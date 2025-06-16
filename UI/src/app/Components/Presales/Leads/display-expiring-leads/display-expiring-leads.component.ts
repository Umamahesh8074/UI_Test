import { OverlayContainer } from '@angular/cdk/overlay';
import { DatePipe, formatDate } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  DIGITAL_PARTNER,
  leadPageSizeOptions,
} from 'src/app/Constants/CommanConstants/Comman';
import { LeadDto } from 'src/app/Models/Presales/lead';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { User } from 'src/app/Models/User/User';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { LeadSourceService } from 'src/app/Services/Presales/LeadSource/lead-source.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-display-expiring-leads',
  templateUrl: './display-expiring-leads.component.html',
  styleUrls: ['./display-expiring-leads.component.css'],
})
export class DisplayExpiringLeadsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;

  phoneNumber: string = '';
  leads: LeadDto[] = [];
  user: User = new User();
  destroy$ = new Subject<void>();
  days: CommonReferenceDetails[] = [];
  isExportExcel: boolean = false;
  isView: boolean = true;
  daysType: string = 'Filter_Days';
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  chart: Chart | any;
  menuOpen: boolean = false;
  dropdownPosition: any = {};
  presalesUserIds: number[] = [];
  salesUserIds: number[] = [];
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  displayedColumns: string[] = [
    'rowNumber',
    'opportunityId',
    'name',
    'projectName',
    'sourceName',
    'subSourceName',
    'status',
    'createdDate',
    'expireDate',
    'actions',
  ];

  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;

  // Pagination
  totalItems: number = 0;
  pageSize: number = 100;
  pageIndex: number = 0;
  assignedTo?: number;
  name: string = '';
  statusId: any = '';
  isChannelPartner: boolean = false;
  showDateRangePicker: boolean = false;
  isSalesTeam = false;
  isSalesTeamFollowUs = false;
  pageSizeOptions = leadPageSizeOptions;
  isMenuLeads = false;
  dateRange: any;
  leadStatus: any[] = [];
  customStartDate: any;
  customEndDate: any;
  isDashboardLeads: boolean = false;
  formData!: FormGroup;
  datePipe: DatePipe = new DatePipe('en-IN');
  selectedDay: any;
  stateData: any;
  fileTypeError: boolean = false;
  userId: number = 0;
  userDetails: any;
  filteredUsers: any;
  roleName: string = '';
  showDropdown: boolean = false;
  preSalesId: any;
  salesId: any;
  userIdFromDashBoard: any;
  userNameFromDashBoard: any;
  dataSource!: any;
  moduleNames: string[] = [];
  projectId: any = [];
  UserRoleName: string | undefined;
  organizationId: number = 0;
  //cp user id
  cpUserId: number = 0;
  isCpUserId: boolean = false;
  sources: LeadSource[] = [];
  dialogSources: LeadSource[] = [];
  filteredSources: LeadSource[] = [];
  sourceId: number = 0;
  source: any = new FormControl([] as LeadSource[]);
  roleId: number = 0;
  isCanBulkUpload: boolean = true;
  bulkUploadLimit: number = -1;
  userName: string = '';
  projectName: string = '';
  selectedProject: IProject = new Project();
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);
  selectedUser: any = new FormControl();

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  openDialog: boolean = false;
  form!: FormGroup;
  lead: any;
  digitalPartnerName: any;
  digitalPartner: any;
  selectedStatus: any;
  sourceName: string = '';
  selectedprojectIds: any;
  @ViewChild('allProjectSelected') private allProjectSelected?: any;
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private leadService: LeadService,
    private commonService: CommanService,
    private commonRefDetailService: CommonreferencedetailsService,
    private formBuilder: FormBuilder,
    private overlayContainer: OverlayContainer,
    private authService: AuthService,
    private fb: FormBuilder,
    private projectService: ProjectService,
    private userService: UserService,
    private sourceService: LeadSourceService,
    private loaderService: LoaderService
  ) {
    this.form = this.fb.group({
      sourceId: [null, Validators.required], // Initialize sourceId form control
    });
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
  ngOnInit() {
    this.initForm();

    this.initializeState();
    // const user = localStorage.getItem('user');
    this.getDigitalParter();
    this.getUserFormLocalStorage();
    this.updateDisplayedColumns();
    const userRole = this.roleName.toLowerCase();
    const roles = ['manager', 'cto', 'sales head'];
    this.fetchUsers();
    if (this.roleName) {
      this.showDropdown = roles.includes(userRole);
    }

    this.route.params.subscribe((params) => this.setTeamType(params));
    this.fetchProjects();
    this.fetchFilterDays();
    this.loadUserAndFetchLeads();
    this.fetchLeadSources();
    this.route.queryParams.subscribe((params) => {
      this.userIdFromDashBoard = params['userId'];
      this.userNameFromDashBoard = params['userName'];
      console.log(this.userIdFromDashBoard);
    });
    console.log('DisplayLeadsComponent initialized');
    console.log(
      'OverlayContainer element:',
      this.overlayContainer.getContainerElement()
    );
    this.overlayContainer.getContainerElement().classList.add('leads-dropdown');
    this.isCanBulkUpload = this.authService.getIsCanBulkUpload();
  }
  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.overlayContainer
      .getContainerElement()
      .classList.remove('leads-dropdown');
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      customStartDate: [],
      customEndDate: [],
    });
    this.formData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formDataValue) => {
        if (formDataValue.customStartDate && formDataValue.customEndDate) {
          const startDate = this.formatDateTime(formDataValue.customStartDate);
          const endDate = this.formatDateTime(
            formDataValue.customEndDate,
            true
          );
          console.log(startDate);
          console.log(endDate);
          this.customStartDate = startDate;
          this.customEndDate = endDate;
          this.isMenuLeads = false;
          this.getDashBoardLeadsDetails();
        }
      });
  }

  private initializeState() {
    console.log(history.state);
    const state = history.state;
    this.stateData = state;
    this.cpUserId = state.cpUserId;
    if (state.pageSize !== undefined) {
      this.pageSize = state.pageSize;
    }
    if (state.pageIndex !== undefined) {
      this.pageIndex = state.pageIndex;
    }
    console.log(this.cpUserId);
    if (this.cpUserId != undefined && this.cpUserId != 0) {
      this.userId = state.cpUserId;
      this.isCpUserId = true;
    } else {
      console.log('else part*************', this.user.userId);
      this.userId = this.user.userId;
    }
    this.dateRange = state.dateRange || '';
    this.customStartDate = state.customStartDate;
    this.customEndDate = state.customEndDate;
    this.isMenuLeads = state.isMenuLeads === true;
    this.userIdFromDashBoard = state.userId;
    this.userNameFromDashBoard = state.userName;
    this.projectId = state.projectId||[];
    this.statusId = state.statusId;
    if (state.projectId?.length>0) {
      this.patchStateProjectIds(this.projectId)
    }
    this.userName = state.custName;
    this.phoneNumber = state.phoneNumber ? state.phoneNumber : '';
    this.sourceId = history.state.sourceId;
    if (state.sourceId) {
      this.sourceService.fetchById(this.sourceId).subscribe({
        next: (response: any) => {
          console.log(response);

          this.source.patchValue(response);
        },
        error: (error) => console.error(error),
      });
    }

    if (history.state.presalesUserIds?.length > 0) {
      this.preSalesId = history.state.presalesUserIds;

      if (history.state.presalesUserIds[0]) {
        this.userService
          .getUserDtoByUserId(history.state.presalesUserIds[0])
          .subscribe({
            next: (response: any) => {
              this.selectedUser.patchValue(response);
            },
            error: (error) => console.error(error),
          });
      }
    }
    if (history.state.salesUserIds?.length > 0) {
      this.salesId = history.state.salesUserIds;

      if (history.state.salesUserIds[0]) {
        this.userService
          .getUserDtoByUserId(history.state.salesUserIds[0])
          .subscribe({
            next: (response: any) => {
              this.selectedUser.patchValue(response);
            },
            error: (error) => console.error(error),
          });
      }
    }

    console.log(this.userIdFromDashBoard + ' ' + this.userNameFromDashBoard);
  }

  private setTeamType(params: any) {
    this.isSalesTeam = params['ST'] === 'ST';
    console.log('Is sales person ', this.isSalesTeam);

    this.isSalesTeamFollowUs = this.isSalesTeam;
  }

  private fetchFilterDays() {
    this.commonService.getRefDetailsByType(this.daysType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        this.days = response;
        this.days = response.filter((day) => {
          const value = day.commonRefValue.toLowerCase();
          return !value.includes('last') && !value.includes('yesterday');
        });
        this.handleDateRange(this.stateData);
      },
      error: (error) => console.error(error),
    });
  }

  private handleDateRange(state: any) {
    if (state.customStartDate && state.customEndDate) {
      this.showDateRangePicker = true;
      this.formData.patchValue({
        customStartDate: state.customStartDate,
        customEndDate: state.customEndDate,
      });
      this.selectedDay = this.days.find((day) =>
        day.commonRefValue.includes('Custom')
      );
    } else if (this.dateRange !== undefined && this.dateRange !== null) {
      this.dateRange = history.state.dateRange;
      this.selectedDay = this.days.find(
        (day) => day.commonRefKey == this.dateRange
      );
    } else {
      this.selectedDay = this.days.find((day) => day.commonRefKey === '0');
    }
  }

  private loadUserAndFetchLeads() {
    this.dateRange = 0;
    const user = localStorage.getItem('user');

    if (user) {
      this.user = JSON.parse(user);
      console.log(this.user.roleName);

      if (
        this.user.roleName.toLocaleLowerCase().includes('channel') ||
        this.user.roleName.toLocaleLowerCase().includes('cp')
      ) {
        this.isChannelPartner = true;
        console.log(this.isChannelPartner);
      }
      // this. this.getDashBoardLeadsDetails();();
      this.dateRange = history.state.dateRange;
      this.getDashBoardLeadsDetails();

      this.leadService.refreshRequired.subscribe(() =>
        this.getDashBoardLeadsDetails()
      );
    }
    this.getAllLeadStatus();
  }

  private getAllLeadStatus() {
    // ? this.moduleNames.push('P,PS')
    this.moduleNames.push('S,PS,P');

    const refType = 'Lead_Status';

    this.commonRefDetailService
      .fetchLeadStatusListByRole(refType, this.moduleNames)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.leadStatus = response;
          console.log(this.leadStatus);

          const excludeStrings = ['Booked']; // Add any strings you want to exclude
          this.leadStatus = response.filter(
            (day: { commonRefValue: string }) => {
              return !excludeStrings.includes(day.commonRefValue); // Replace with your actual property
            }
          );
          this.handleDateRange(this.stateData);
        },
        error: (error: any) => {
          console.error(error);
        },
      });
  }

  getDashBoardLeadsDetails() {
    this.showLoading();
    const leadType = this.isSalesTeam ? 'S' : 'P';
    this.leadService
      .getExpiringLeadsData(
        this.userId,
        this.user.roleId,
        this.digitalPartnerName,
        this.pageIndex,
        this.pageSize,
        this.isMenuLeads,
        this.dateRange,
        this.customStartDate,
        this.customEndDate,
        this.projectId,
        this.sourceId,
        '',
        this.statusId,
        this.preSalesId,
        this.salesId,
        this.phoneNumber,
        this.userName,
        leadType,
        this.isExportExcel
      )
      .subscribe({
        next: (response: any) => {
          if (this.isExportExcel) {
            this.downloadXLSFile(
              response,
              'Expiring Leads ' + Date.now().toString(),
              false
            );
          } else {
            this.leads = response.records;
            this.totalItems = response.totalRecords;
            this.paginator.pageIndex = this.pageIndex;
            this.paginator.pageSize = this.pageSize;
            this.dataSource = new MatTableDataSource(this.leads);
          }
          this.hideLoading();
        },
        error: (error: any) => {
          this.hideLoading();
          console.error(error);
        },
      });
  }

  formatDateTime(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }
  onPageChange(event: any) {
    this.isExportExcel=false
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getDashBoardLeadsDetails();
  }

  onSearch(phoneNumber: any) {
    this.isExportExcel = false;
    this.phoneNumber = phoneNumber;
    // this.pageIndex = 0;
    // this.paginator.firstPage();
    // }
    if (this.phoneNumber.length === 0) {
      this.getDashBoardLeadsDetails();
    }
  }

  onStatusSelectionChange(event: any) {
    this.isExportExcel=false
    this.statusId = event.value;
    if (this.statusId === 'all') {
      this.statusId = '';
    }
    this.getDashBoardLeadsDetails();
  }

  changeLeadExpiry(lead: LeadDto) {
    this.openDialog = true;
    this.lead = lead;
    this.form.patchValue({ sourceId: this.lead.sourceId });
    console.log(this.form.value);
    const selectedSource = this.sources.find(
      (s) => s.leadSourceId === this.form.value.sourceId
    );

    this.dialogSources = this.sources.filter((source) => {
      if (selectedSource?.name === 'Walk-In') {
        return source.name === 'Walk-In';
      } else {
        return (
          source.leadSourceId === this.form.value.sourceId ||
          source.name === 'Walk-In'
        );
      }
    });

    //   Swal.fire({
    //     title: 'Extending Lead Expiry Date',
    //     html: `
    //  <span>
    //    Are you sure you want to extend the expiry days for this lead? </br>
    //  <b>Id: </b> <span class=text-success "> ${lead.opportunityId} </span > &nbsp&nbsp&nbsp&nbsp
    // <b>Name:</b> <span class=text-success>${lead.name}</span>
    // </span> `,
    //     icon: 'info',
    //     showConfirmButton: true,
    //     confirmButtonText: 'Ok',
    //     showCancelButton: true,
    //     cancelButtonText: 'Cancel',
    //   }).then((file) => {
    //     if (file.isConfirmed) {
    //       this.leadService.changeLeadExpiry(lead.id).subscribe({
    //         next: (response) => {
    //           if (response) {
    //             Swal.fire({
    //               title: 'Lead Expiry Date Extended',
    //               text: 'Lead Expiry Date has been extended successfully.',
    //               icon: 'success',
    //             });
    //           }
    //         },
    //         error: (error) => {
    //           console.error(error);
    //           if (error) {
    //             Swal.fire('Error', 'Failed to Update Lead Expiry Date', 'error');
    //           }
    //         },
    //       });
    //       this.getDashBoardLeadsDetails();
    //     }
    //   });
  }

  filterLeads(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value.toLowerCase();
    if (searchTerm.length >= 3) {
      console.log(searchTerm);
    }
  }

  handleDaySelection(commonRefObject: CommonReferenceDetails | null) {
    this.isExportExcel = false;
    console.log('method called');
    console.log(commonRefObject);
    // If "All" option is selected
    if (!commonRefObject) {
      console.log('All selected');
      this.dateRange = 999;
      this.customStartDate = null;
      this.customEndDate = null;
      this.formData.patchValue({
        customStartDate: null,
        customEndDate: null,
      });
      this.showDateRangePicker = false;
      this.isMenuLeads = false;
      this.getDashBoardLeadsDetails(); // Fetch all data
    } else {
      this.dateRange = commonRefObject.commonRefKey;

      if (
        commonRefObject.commonRefValue &&
        commonRefObject.commonRefValue.includes('Custom')
      ) {
        console.log('Custom Date');
        this.showDateRangePicker = true;
        this.dateRange = '';
      } else {
        this.customStartDate = null;
        this.customEndDate = null;
        this.formData.patchValue({
          customStartDate: null,
          customEndDate: null,
        });
        this.isMenuLeads = false;
        this.getDashBoardLeadsDetails();
        this.showDateRangePicker = false;
      }
    }
  }

  getUserFormLocalStorage() {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.userId = this.user.userId;
      this.roleName = this.user.roleName;
      this.UserRoleName = this.user.roleName
        ? this.user.roleName.toLowerCase()
        : undefined;
      this.organizationId = this.user.organizationId;
      this.roleId = this.user.roleId;
      console.log(
        '=======> ' + this.user.roleName + '=========> ' + this.roleId
      );
    }
  }

  updateDisplayedColumns() {
    // Add the assignedTo column only for sales manager and presales manager
    if (this.isRole(['presales manager'])) {
      this.displayedColumns.splice(7, 0, 'assignedTo');
    }
    if (this.isRole(['channel partner', 'cp approval'])) {
      this.displayedColumns.splice(4, 0, 'mobileNumber');
    }
    if (this.isRole(['sales head', 'cto', 'sales manager', 'cp approval'])) {
      this.displayedColumns.splice(7, 0, 'presalesMember'); // Insert 'presalesMember'
      this.displayedColumns.splice(8, 0, 'salesMember'); // Insert 'salesMember'
    }
  }

  isRole(roles: string[]): boolean {
    if (!this.UserRoleName) {
      console.log('UserRoleName is undefined'); // Log for debugging
      return false;
    }
    return roles.some((role) => this.UserRoleName === role.toLowerCase());
  }

  getAllUserNames(userName?: string) {
    // const refType = this.isSalesTeam ? 'Sales_Followup_Status' : 'Lead_Status';
    this.userService
      .getUserByManagerId(this.userId, userName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.userDetails = response;
          this.filteredUsers = response;
        },
        error: (error: any) => {
          console.error(error);
        },
      });
  }

  searchUser(event: any) {
    this.isExportExcel = false;

    const userName = event.target.value;
    if (event.target.value.length >= 3) {
      this.fetchUsers(userName);
    } else if (event.target.value.length == 0) {
      this.preSalesId = 0;
      this.salesId = 0;
      this.fetchUsers('');
      this.getDashBoardLeadsDetails();
    }
  }
  fetchUsers(userName?: string) {
    const userRoles = [
      'cp approval',
      'assistant manager - channel sales',
      'cto',
      'sales head',
    ];
    if (this.roleName && userRoles.includes(this.roleName.toLowerCase())) {
      this.fetchUsersByRole(userName);
    } else {
      this.getAllUserNames(userName);
    }
  }

  displaySelectedUser(user: any): string {
    return user && user.userName ? user.userName : 'All';
  }
  onUsernameSelectionChange(event: any) {
    this.preSalesId = '';
    this.salesId = '';
    this.isExportExcel = false;
    const userId = event.option.value.userId;
    console.log(event.option.value);
    const selectedUser = this.userDetails.find(
      (user: any) => user.userId === userId
    );
    const userRole = selectedUser?.roleName.toLowerCase();
    // alert(selectedUser.roleName);
    if (userRole?.includes('presales') || userRole?.includes('nocallsupport')) {
      console.log(this.roleName);
      this.preSalesId = userId;
      if (this.preSalesId === 'all') {
        this.preSalesId = '';
      }
      // this.assignedTo = this.preSalesId;
    } else if (userRole?.includes('sales')) {
      this.salesId = userId;
      if (this.salesId === 'all') {
        this.salesId = '';
      }
      // this.assignedTo = this.salesId;
    }
    this.getDashBoardLeadsDetails();
  }

  fetchLeadSources(): void {
    this.leadService.fetchLeadSources().subscribe({
      next: (sources: LeadSource[]) => {
        console.log(sources);

        this.sources = sources;
        this.filteredSources = this.sources;
      },
      error: (error: any) => {
        console.error('Error fetching lead sources:', error);
      },
    });
  }

  onSourceSelect(event: MatAutocompleteSelectedEvent): void {
    this.isExportExcel = false;
    const selectedSource = event.option.value as LeadSource;
    console.log('Selected Source:', selectedSource);
    this.sourceId = selectedSource.leadSourceId;
    this.getDashBoardLeadsDetails();
  }

  displaySource(source: LeadSource): string {
    return source && source.name ? source.name : 'All';
  }

  searchSource(event: any): void {
    this.isExportExcel = false;
    const searchTerm = event.target.value.toLowerCase();
    if (event.target.value.length == 0) {
      this.sourceId = 0;
      this.getDashBoardLeadsDetails();
      this.fetchLeadSources();
    }
    this.filteredSources = this.sources.filter((source) =>
      source.name.toLowerCase().includes(searchTerm)
    );

    // Filter the sources array based on the search term

    // this.fetchLeadSources(event.target.value);
  }
  onSearchUserName(userName: any) {
    //this.pageIndex = 0;
    // this.isExportExcel = false;

    this.paginator.firstPage();
    this.userName = userName;
    if (this.userName.length === 0) {
      // this.userId = 0;
      this.getDashBoardLeadsDetails();
    }
  }

  // downloadTemplate() {
  //   this.leadService.downloadTemplate(this.isChannelPartner).subscribe({
  //     next: (response: Blob) => {
  //       console.log('Template downloaded successfully', response);
  //       console.log(JSON.stringify(response));
  //       this.downloadXLSXFile(response, 'Leads_upload_template', false);
  //       Swal.fire({
  //         icon: 'success',
  //         text: 'Template downloaded successfully',
  //         timer: 2000,
  //         timerProgressBar: true,
  //         showConfirmButton: false,
  //       });
  //     },
  //     error: (error) => {
  //       console.error('File download failed : ', error);
  //       Swal.fire({
  //         icon: 'error',
  //         text: 'Error Occurred',
  //         timer: 2000,
  //         timerProgressBar: true,
  //         showConfirmButton: false,
  //       });
  //     },
  //   });
  // }

  // onFileSelected(event: any): void {
  //   const file: File = event.target.files[0];
  //   console.log(file);

  //   if (file) {
  //     const fileName: string = file.name;
  //     const fileParts: string[] = fileName.split('.');
  //     let fileExtension: string = '';

  //     if (fileParts.length > 1) {
  //       fileExtension = fileParts.pop()!.toLowerCase(); // Non-null assertion operator
  //     }

  //     if (fileExtension === 'xls' || fileExtension === 'xlsx') {
  //       this.selectedFile = file;
  //       this.selectedFileName = fileName; // Update the displayed file name
  //       this.fileTypeError = false;
  //     } else {
  //       this.selectedFile = null;
  //       this.selectedFileName = null; // Reset the displayed file name
  //       this.fileTypeError = true;
  //     }
  //   } else {
  //     this.selectedFile = null;
  //     this.selectedFileName = null; // Reset the displayed file name
  //     this.fileTypeError = false;
  //   }
  // }

  // onUpload(): void {
  //   if (this.selectedFile && this.selectedFile !== null) {
  //     console.log('organizationId.....' + this.organizationId);
  //     console.log('roleId.....' + this.roleId);

  //     this.leadService
  //       .uploadFile(this.selectedFile, this.userId, this.roleId)
  //       .subscribe({
  //         next: (response) => {
  //           console.log('File uploaded successfully', response);
  //           this.resetFileInput();
  //           console.log(JSON.stringify(response));
  //           const successCount: number = response.successCount;
  //           const failureCount: number = response.failureCount;
  //           const total: number = successCount + failureCount;
  //           Swal.fire({
  //             title: 'File uploaded successfully...',
  //             html: `
  //           <p><strong>Success Leads:</strong> ${successCount}</p><br>
  //           <p><strong>Duplicate Leads:</strong> ${failureCount}</p><br>
  //           <p><strong>Total:</strong> ${total}</p>
  //         `,
  //             icon: 'success',
  //             timerProgressBar: true,
  //             showConfirmButton: true,
  //             confirmButtonText: 'Download',
  //             showCancelButton: true,
  //             cancelButtonText: 'OK',
  //           }).then((file) => {
  //             if (file.isConfirmed) {
  //               this.excelDownload(response.fileName);
  //             }
  //             this.getDashBoardLeadsDetails();
  //           });
  //         },
  //         error: (error) => {
  //           console.error('File upload failed : ', error?.error.fileName);
  //           this.resetFileInput();
  //           if (error?.error?.fileName) {
  //             Swal.fire({
  //               icon: 'error',
  //               html: `

  //             <div> ${error?.error?.fileName}</div>
  //           `,
  //               showConfirmButton: true,
  //             });
  //           } else {
  //             Swal.fire({
  //               icon: 'error',
  //               text: 'Error occured',
  //               showConfirmButton: true,
  //             });
  //           }
  //         },
  //       });
  //   } else {
  //     Swal.fire({
  //       icon: 'info',
  //       text: 'Please select file...',
  //       timer: 2000,
  //       timerProgressBar: true,
  //       showConfirmButton: false,
  //     });
  //   }
  // }
  // private resetFileInput(): void {
  //   this.selectedFile = null;
  //   this.fileInput.nativeElement.value = '';
  //   this.selectedFileName = null;
  // }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : 'All';
  }

  // onProjectSelect(event: any) {
  //   this.isExportExcel = false;
  //   console.log(event.option.value);
  //   this.projectId = event?.option.value?.projectId;
  //   this.getDashBoardLeadsDetails();
  // }

  searchProject(event: any) {
    this.isExportExcel = false;
    if (event.target.value.length >= 3) {
      this.projectName = event.target.value;
      this.fetchProjects();
    } else if (event.target.value.length == 0) {
      this.projectName = '';
      this.projectId = 0;
      this.fetchProjects();
      //this.getDashBoardLeadsDetails();
    }
  }

  // fetchProjects() {
  //   this.projectService
  //     .getAllProjects(this.projectName, 0, 100, 'Y', this.user.organizationId)
  //     .subscribe({
  //       next: (projects) => {
  //         this.projects = projects.records;
  //       },
  //       error: (error) => {
  //         console.error('Error fetching projects:', error);
  //       },
  //     });
  // }

  onDialogClose() {
    this.openDialog = false;
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Value:', this.form.value.sourceId);
      this.leadService
        .changeLeadExpiry(this.lead.id, this.form.value.sourceId)
        .subscribe({
          next: (response) => {
            if (response) {
              Swal.fire({
                title: 'Lead Expiry Date Extended',
                text: 'Lead Expiry Date has been extended successfully.',
                icon: 'success',
              });
            }
          },
          error: (error) => {
            console.error(error);
            if (error) {
              Swal.fire('Error', 'Failed to Update Lead Expiry Date', 'error');
            }
          },
        });

      this.openDialog = false;
      this.getDashBoardLeadsDetails();
    } else {
      console.log('Form is invalid');
    }
  }

  getDigitalParter() {
    this.commonService.fetchCommonReferenceTypes(DIGITAL_PARTNER).subscribe({
      next: (data) => {
        this.digitalPartner = data.filter(
          (e) => e.commonRefKey == 'DIGITAL_PARTNER'
        );
        console.log(this.digitalPartner);
        //this.setDefaultStatus();
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  handleDigitalParterSelection(event: any) {
    this.isExportExcel = false;
    console.log(event);
    this.digitalPartnerName = event;
    this.getDashBoardLeadsDetails();
  }

  isNotLastColumn(event: MouseEvent): boolean {
    const clickedElement = event.target as HTMLElement;
    const parentRow = clickedElement.parentElement; // it's the parent element
    if (parentRow && parentRow.children) {
      const lastCell = parentRow.children[parentRow.children.length - 1];
      return clickedElement !== lastCell;
    }
    return true; // Default to true if structure is unexpected
  }
  onLeadRowClick(leadId: number) {
    this.isView = false;
    this.handleFollowups(leadId);
  }
  handleFollowups(leadId: number) {
    if (this.preSalesId > 0) {
      this.presalesUserIds.push(this.preSalesId);
    }
    if (this.salesId > 0) {
      this.salesUserIds.push(this.salesId);
    }
    if (!this.isView) {
      const route = this.isSalesTeamFollowUs
        ? '/layout/sales/followups/save/ST'
        : '/layout/presales/followups/save/PST';
      this.router.navigate([route], {
        state: {
          leadId: leadId,
          isSalesTeamFollowUs: this.isSalesTeamFollowUs,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          handleFollowups: false,
          isFromDashBoard: false,
          disableActionButton: this.isChannelPartner,
          statusId: this.statusId,
          sourceId: this.sourceId,
          phoneNumber: this.phoneNumber,
          custName: this.userName,
          // opportunityId: this.opportunityId,
          // selectedSubSourcesIds: this.selectedSubSourcesIds,
          dateRange: this.dateRange,
          isMenuLeads: this.isMenuLeads,
          customStartDate: this.customStartDate,
          customEndDate: this.customEndDate,
          projectId: this.projectId,
          //leadType: this.leadType,
          assignedTo: this.assignedTo,
          //currentStatusDashboard: this.currentStatusDashboard,
          // dashboard: this.dashboard,
          presalesUserIds: this.presalesUserIds,
          salesUserIds: this.salesUserIds,
          isExpiringPage: true,
          digitalPartner: this.digitalPartner,
        },
      });
    }
  }

  generateLeadsReport() {
    this.isExportExcel = true;
    this.getDashBoardLeadsDetails();
  }

  private downloadXLSFile(
    data: Blob,
    filename: string,
    needTime: boolean = true
  ) {
    const now = new Date();
    const timestamp = now.toLocaleDateString() + '_' + now.toLocaleTimeString();
    const blob = new Blob([data], {
      type: 'application/vnd.ms-excel',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    needTime
      ? (a.download = filename + '_' + timestamp + '.xls')
      : (a.download = filename + '.xls');

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  onClickSearchName() {
    this.isExportExcel=false
    if (this.userName.length > 0) {
      this.getDashBoardLeadsDetails();
    }
  }
  onClickSearchButton() {
    this.isExportExcel=false
    if (this.phoneNumber.length > 0) {
      this.getDashBoardLeadsDetails();
    }
  }
  // onStatusSelectionChange(event: any) {
  //   this.isExportExcel=false
  //   // this.paginator.firstPage();
  //   if (event.value === 'all') {
  //     this.statusIds = this.leadStatusIds;
  //   } else {
  //     this.statusIds = [];
  //     this.statusIds = event.value;
  //   }
  //   this.getDashBoardLeadsDetailsV1();
  // }

  toggleMenu(event: MouseEvent) {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      this.setDropdownPosition(event);
    }
  }

  // Method to set the dropdown menu position
  setDropdownPosition(event: MouseEvent) {
    const button = event.target as HTMLElement;
    const rect = button.getBoundingClientRect();
    this.dropdownPosition = {
      top: `${rect.bottom + window.scrollY}px`, // Position the dropdown below the button
      //left: `${rect.left + window.scrollX}px`,  // Align with the left edge of the button
    };
  }

  // Method to close the menu
  closeMenu() {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && typeof activeElement.blur === 'function') {
      activeElement.blur();
    }
    this.menuOpen = false;
  }

  private fetchUsersByRole(userName?: string) {
    let status: any;
    // this.route.params.subscribe((params) => {
    //   status = params;
    //   console.log('Status from URL (observable):', status);
    // });
    const roleName: string[] = []; // Declare roleName as an array of strings
    {
      //  if (status.PST === 'PST') {
      roleName.push('sales member');
      roleName.push('presales member');
      roleName.push('NoCallSupport');
      roleName.push('presales manager');
      // this.isPresalesUser = true;
    }
    // else {
    // roleName.push('sales member');
    // this.isPresalesUser = false;

    this.userService
      .fetchUsersByRolesAndOrganization(
        roleName,
        this.user.organizationId,
        'A',
        userName
      )
      .subscribe({
        next: (userDetails) => {
          this.userDetails = userDetails;
          this.filteredUsers = userDetails;
        },
        error: (error) => {
          console.error('Error fetching UserDetails by role:', error);
        },
      });
  }
  
  isSelectedProject(projectId?: number): boolean {
    return this.selectedprojectIds?.includes(projectId);
  }

  fetchProjectsByIds(selectedIds: any) {
    this.projectName = this.projectName || '';
    this.projectService
      .getProjectsByIds(this.projectName, this.user.organizationId, selectedIds, 'Y')
      .subscribe({
        next: (projects) => {
          this.projects = projects.records;
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  patchStateProjectIds(selectedIds: number[]): void {
    this.project.patchValue('')
    this.projectService
      .getProjectsByIds('', this.user.organizationId, selectedIds, 'Y')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects: any) => {
          console.log(projects)
          this.projects = this.sortProject(this.projects, selectedIds)
          const selectedNames = projects
            .map((project: any) => project.projectName)
            .join(', ');
          console.log(selectedNames);
          this.project.patchValue(selectedNames);
          this.selectedprojectIds = selectedIds;
          console.log(this.selectedprojectIds)
          this.projectId = this.selectedprojectIds
          console.log(this.projectId)
          //  this.checkAllProjectSeleted(this.selectedprojectIds)
          //this.isSelectedProject();
          // this.selectedSubSourcesIds = this.selectedSubSourcesIds;
        },
      });

  }

  sortProject(projects: any[], selectedprojectIds: any): any[] {
    return projects.sort((a, b) => {
      const aSelected = selectedprojectIds.includes(a.projectId);
      const bSelected = selectedprojectIds.includes(b.projectId);
      // Place selected items first, then unselected items
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }
  onAllSelectProject() {
    this.isExportExcel = false
    console.log(this.allProjectSelected.checked)
    // this.allProjectChecked=this.allProjectSelected.checked
    if (this.allProjectSelected.checked) {
      this.selectedprojectIds = this.projects.map((p: any) => p.projectId, 0)
    } else {
      this.selectedprojectIds = []
    }
    console.log(this.projectId)
    //this.projectId = this.selectedprojectIds
    this.displayProjectNames();
    // if (this.isUnassignedLeads) {
    //   this.getDashBoardUnassignedLeadsDetails();
    // } else if (this.dashboard && !this.isCTODashboard) {
    //   this.getDashBoardLeadsDetailsV1();
    // } else if (this.isCTODashboard) {
    //   this.getDashBoardLeadsDetailsNew();
    // } else if (this.currentStatusDashboard) {
    //   this.getDashBoardLeadsCurrentStatusDetails();
    // } else {
    //   this.getDashBoardLeadsDetails();
    // }
  }

  displayProjectNames() {
    if(this.selectedprojectIds.length>0){
    this.projectService
      .getProjectsByIds('', this.user.organizationId, this.selectedprojectIds, 'Y')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects: any) => {
          console.log(projects)
          this.projects = this.sortProject(this.projects, this.selectedprojectIds)
          const selectedNames = projects
            .map((project: any) => project.projectName)
            .join(', ');
          console.log(selectedNames);
          this.project.patchValue(selectedNames);
        },
      });
    }
    else{
      this.project.patchValue('');
    }
  }

  isProjectAllSelected(): boolean {
    const allProjectIds = this.projects.map(p => p.projectId);
    return Array.isArray(this.selectedprojectIds) &&
           allProjectIds.length > 0 &&
           allProjectIds.every(id => this.selectedprojectIds.includes(id));
  }

  onProjectSelectButtonClick(){
    this.projectId=this.selectedprojectIds
    this.isExportExcel=false
    this.getDashBoardLeadsDetails();
  }
  
  fetchProjects() {
    this.projectName = this.projectName || '';
    this.projectService
      .getAllProjects(this.projectName, 0, 1000, 'Y', this.user.organizationId)
      .subscribe({
        next: (projects) => {
          this.projects = projects.records;
          if (this.selectedprojectIds?.length > 0) {
            this.sortProject(this.projects, this.selectedprojectIds)
            console.log(this.projects)
            // const projectId = this.projects.map(p => p.projectId)
            // console.log(this.projects)
            // if (projectId.length == this.selectedprojectIds.length) {
            //   console.log(this.projectId)
            //   this.projectId.push(0)
            // }
          }

        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  onProjectSelect(project: any, event: any) {
    //this.allProjectChecked=false;
    this.project.patchValue('')
    console.log(event);

    const selectedProject = project.projectId;
    console.log('selected project id' + selectedProject);

    // Get the sub-source ID
   console.log(this.selectedprojectIds)
    if (event.checked) {
      if (!this.selectedprojectIds) {
        this.selectedprojectIds = [];
      }
      this.selectedprojectIds?.push(selectedProject);
      this.displayProjectNames()
      // alert(this.selectedSubSourcesIds); // Add to selected IDs
    } else {
      // Remove sub-source ID from selected IDs
      this.selectedprojectIds = this.selectedprojectIds?.filter(
        (id: any) => id !== selectedProject
      );
      console.log(this.selectedprojectIds)
      if (this.selectedprojectIds?.length > 0) {
        this.displayProjectNames()
      }
      else if (this.selectedprojectIds?.length == 0) {
        this.project.patchValue('');
      }
}
   // this.projectId = this.selectedprojectIds
    console.log(this.projectId)
  }

}
