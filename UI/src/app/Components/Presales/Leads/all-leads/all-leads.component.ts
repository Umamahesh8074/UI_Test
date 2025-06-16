import { DatePipe, formatDate } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Chart } from 'chart.js';
import { OverlayContainer } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import {
  DIGITAL_PARTNER,
  leadPageSizeOptions,
} from 'src/app/Constants/CommanConstants/Comman';
import { Lead, LeadDto, LeadMcubeAudio } from 'src/app/Models/Presales/lead';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import {
  ILeadSubSourceDto,
  LeadSubSource,
} from 'src/app/Models/Presales/leadsubsource';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { User } from 'src/app/Models/User/User';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { LeadSubsourceService } from 'src/app/Services/Presales/LeadSubSource/lead-subsource.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-all-leads',
  templateUrl: './all-leads.component.html',
  styleUrls: ['./all-leads.component.css'],
})
export class AllLeadsComponent {
  @ViewChild(MatSort) sort!: MatSort;

  phoneNumber: string = '';
  @ViewChild('allSelected') private allSelected?: MatOption;
  lead: any = new Lead();
  leads: any[] = [];
  user: User = new User();
  userToBePatched: User = new User();
  destroy$ = new Subject<void>();
  days: CommonReferenceDetails[] = [];
  isExportExcel: boolean = false;
  isView: boolean = true;
  daysType: string = 'Filter_Days';
  selectedFile: File | null = null;
  selectedFileName: string | null = null;
  chart: Chart | any;
  projectName: any;
  isPresalesUser: boolean = false;
  salesLeads: any;
  isAllLeads: boolean = true;
  subSourceIds: number[] = [];
  displayedColumns: string[] = [
    'rowNumber',
    'opportunityId',
    'name',
    'projectName',
    'sourceName',
    'subSource',
    'createdDate',
    'status',
    'presalesMember',
    'salesMember',
    'assignedToSaleDate',
    'remarks',
    'actions',
  ];
  display: string[] = [
    'opportunityId',
    'leadName',
    'projectName',
    'leadStatus',
    'date',
    'remarks',
  ];

  audioDialogColumns: string[] = [
    'createdDate',
    'calledTo',
    'assignedTo',
    'controls',
    'progress',
  ];

  dialogRef: any;

  // Pagination
  totalItems: number = 0;
  pageSize: number = 25;
  pageIndex: number = 0;
  assignedTo: number = 0;
  name: string = '';
  statusId: any = '';
  ncStatusId: any = '';
  isChannelPartner: boolean = true;
  showDateRangePicker: boolean = false;
  isSalesTeam = false;
  isSalesTeamFollowUs = false;
  pageSizeOptions = leadPageSizeOptions;
  isMenuLeads = true;
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
  filteredSources: LeadSource[] = [];
  sourceId: number = 0;
  sourceIds: number[] = [];
  source: any = new FormControl([] as LeadSource[]);
  roleId: number = 0;
  isCanBulkUpload: boolean = true;
  bulkUploadLimit: number = -1;
  userName: string = '';
  isUnassignedLeads = false;
  projects: Project[] = [];

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  leadHistories: any;
  isDialogOpen: any;
  openDialog: boolean = false;
  starCount: any;
  add: any = true;
  opportunityId: string = '';
  subSources: LeadSubSource[] = [];
  subSourceId: number[] = [];
  filteredSubSources: LeadSubSource[] = [];
  isMemberDashBoard: boolean = false;
  isManagerDashBoard: boolean = false;
  isSalesHeadDashboard: boolean = false;
  isDigitalMarketingDashboard: boolean = false;
  selectedSubSourcesIds: number[] = [];
  subSourceControl = new FormControl('');
  stateSubSourceIds: number[] = [];
  project: any = new FormControl([] as IProject[]);
  audio: LeadMcubeAudio[] = [];
  openAudioDialog: boolean = false;
  currentAudio: HTMLAudioElement | null = null;
  currentlyPlayingAudio: any = null;
  isDisplayExcelUpload: boolean = true;
  selectedProject: IProject = new Project();
  mainUser: User = new User();
  leadType: string = '';
  digitalPartner: any;
  digitalPartnerName: any = '';
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
    private leadSubSource: LeadSubsourceService,
    private authService: AuthService,
    private projectService: ProjectService,
    private userService: UserService,
    private loaderService: LoaderService
  ) {}
  private modal: any;
  ngOnInit() {
    this.initForm();
    this.getDigitalParter();
    this.isAllLeads = true;
    if (history.state.navigationId == 1) {
      const state = history.state;
      state.phoneNumber = '';
      state.custName = '';
      state.opportunityId = '';
      state.sourceIds = 0;
      state.selectedSubSourcesIds = [];
      // state.selectedSubSourcesIds = 0;
      state.assignedTo = 0;
      state.projectId = 0;
      console.log(history.state);
    }
    this.route.params.subscribe((params) => this.setTeamType(params));
    this.clearModalFilters();
    const modalElement = document.getElementById('exampleModal');

    this.getAllLeadStatus();
    this.initializeState();
    this.getUserFormLocalStorage();

    if (this.roleName) {
      const roles = ['presales manager', 'sales manager', 'cto', 'sales head'];
      this.showDropdown = roles.includes(this.roleName.toLowerCase());
    }
    const roles = [
      'cp approval',
      'assistant manager - channel sales',
      'cto',
      'sales head',
    ];
    if (this.roleName && roles.includes(this.roleName.toLowerCase())) {
      this.fetchUsersByRole();
    } else {
      this.getAllUserNames();
    }

    if (this.isUnassignedLeads) {
      this.fetchSubSources(8);
    }
    // this.route.params.subscribe((params) => this.setTeamType(params));
    this.loadUserAndFetchLeads();
    this.fetchFilterDays();
    this.fetchLeadSources();
    this.route.queryParams.subscribe((params) => {
      this.userIdFromDashBoard = params['userId'];
      this.userNameFromDashBoard = params['userName'];
    });
    console.log(
      'OverlayContainer element:',
      this.overlayContainer.getContainerElement()
    );
    this.overlayContainer.getContainerElement().classList.add('leads-dropdown');
    this.isCanBulkUpload = this.authService.getIsCanBulkUpload();
    this.bulkUploadLimit = this.authService.getBulkUploadLimit();
    // this.filteredSubSources = this.subSourceControl.valueChanges.pipe(
    //   startWith(''),
    //   map((value: string) => this.filter(value))
    // );
    // this.subSourceControl.valueChanges.subscribe(() => {
    //   this.onSelectionSubSourceChange(); // Call the filterData method whenever the selection changes
    // });
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
      sourceIds: new FormControl(''),
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
          this.customStartDate = startDate;
          this.customEndDate = endDate;
          //isMenuLeads should be false when date range filter is there
          //otherwise in backend date filter wont apply
          this.isMenuLeads = false;
          this.getDashBoardLeadsDetails();
        }
      });
  }

  private initializeState() {
    const state = history.state;
    this.stateData = state;
    this.cpUserId = state.cpUserId;
    this.statusId = state.statusId;
    if (state.pageSize != undefined) {
      this.pageSize = state.pageSize;
    }
    if (state.pageIndex != undefined) {
      this.pageIndex = state.pageIndex;
    }

    if (this.cpUserId != undefined && this.cpUserId != 0) {
      this.userId = this.user.userId;
      this.isCpUserId = true;
    } else {
      this.userId = this.user.userId;
    }

    //dateRange part
    this.dateRange = state.dateRange || '';
    this.customStartDate = state.customStartDate;
    this.customEndDate = state.customEndDate;
    this.isMenuLeads = state.isMenuLeads !== false;
    this.ncStatusId = state.ncStatusId;
    this.userIdFromDashBoard = state.userId;
    this.userNameFromDashBoard = state.userName;
    this.projectId = state.projectId;
    if (this.projectId?.length > 0) {
      this.patchStateProjectIds(this.projectId)
    }
    this.isMemberDashBoard = state.isMemberDashBoard === true;
    this.isManagerDashBoard = state.isManagerDashBoard === true;
    this.isSalesHeadDashboard = state.isSalesHeadDashboard === true;
    this.isDigitalMarketingDashboard =
      state.isDigitalMarketingDashboard === true;
    this.isUnassignedLeads = state.isUnassignedLeads;
    this.sourceIds = state.sourceIds ? state.sourceIds : [];
    this.sourceId = state.sourceIds;

    if (this.formData) {
      this.formData.value.sourceIds = this.sourceIds;
      this.formData.patchValue({ sourceIds: this.sourceIds });
    }

    if (this.sourceIds.length > 0) {
      this.fetchSubSourcesBySourceIds(this.sourceIds);
    }
    this.phoneNumber = state.phoneNumber;
    this.userName = state.custName;
    this.opportunityId = state.opportunityId;
    this.stateSubSourceIds = state.selectedSubSourcesIds;
    this.subSourceId = state.selectedSubSourcesIds;
    this.selectedSubSourcesIds = state.selectedSubSourcesIds;
    console.log(this.sourceIds.length + ' lenght ');
    this.subSourceIds = state.subSourceIds;

    if (this.sourceIds?.length > 0) {
      this.patchStateSubSourcesBySourceIds(this.sourceIds);
    }
    this.assignedTo = state.assignedTo;
    if (this.assignedTo > 0) {
      this.updatePresalesAndSalesUserId(this.assignedTo);
    }
    this.salesLeads = state.salesLeads;

    if (state.isAllLeads !== undefined) {
      this.isAllLeads = state.isAllLeads;
    }
  }
  private setTeamType(params: any) {
    this.isSalesTeam = params['ST'] === 'ST';
    this.isSalesTeamFollowUs = this.isSalesTeam;
  }

  private fetchFilterDays() {
    this.commonService.getRefDetailsByType(this.daysType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        // this.days = response;
        this.days = response.filter((day) => {
          const value = day.commonRefValue.toLowerCase();
          return !value.includes('tomo') && !value.includes('next');
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
    } else {
      this.dateRange = state.dateRange;
      this.selectedDay = this.days.find(
        (day) => day.commonRefKey == this.dateRange
      );
    }
  }

  private loadUserAndFetchLeads() {
    const user = localStorage.getItem('user');

    if (user) {
      this.user = JSON.parse(user);
      this.fetchProjects();

      if (
        this.user.roleName.toLocaleLowerCase().includes('channel') ||
        this.user.roleName.toLocaleLowerCase().includes('cp')
      ) {
        this.isChannelPartner = false;
      }
      // this. this.getDashBoardLeadsDetails();();
      const role = this.user.roleName.toLocaleLowerCase();
      if (role.includes('member')) {
        this.isMemberDashBoard = true;
      } else if (
        !role.includes('assistant manager - channel sales') &&
        role.includes('manager')
      ) {
        this.isManagerDashBoard = true;
      } else if (role.includes('head') || role.includes('cto')) {
        this.isSalesHeadDashboard = true;
      }

      if (role.toLowerCase() === 'channel partner') {
        this.isDisplayExcelUpload = false;
      }
      // this.isMenuLeads = false;

      this.getDashBoardLeadsDetails();
      // this.leadService.refreshRequired.subscribe(() =>
      //   this.getDashBoardLeadsDetails()
      // );
    }
  }

  private getAllLeadStatus() {
    const role = this.user.roleName.toLocaleLowerCase();
    // role.includes('presale')
    //   ? this.moduleNames.push('P,PS')
    //   : this.moduleNames.push('S,PS');
    // if (
    //   role.includes('sales head') ||
    //   role.includes('cto') ||
    //   role.includes('channel')
    // ) {
    //   this.moduleNames.push('P');
    // }
    this.moduleNames = ['S', 'P', 'PS'];
    const refType = 'Lead_Status';

    this.commonRefDetailService
      .fetchLeadStatusListByRole(refType, this.moduleNames)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.leadStatus = response;
        },
        error: (error: any) => {
          console.error(error);
        },
      });
  }

  getDashBoardLeadsDetails() {
    // alert(this.selectedSubSourcesIds);
    this.showLoading();
    this.leadType = '';
    this.leadService
      .findLeadsBasedOnLoggedInUser(
        this.userId,
        this.user.roleId,
        this.digitalPartnerName,
        this.phoneNumber,
        history.state.pageIndex === undefined
          ? this.pageIndex
          : history.state.pageIndex,
        history.state.pageSize === undefined
          ? this.pageSize
          : history.state.pageSize,
        this.userName,
        this.statusId,
        this.leadType,
        this.dateRange,
        this.isMenuLeads,
        this.isExportExcel,
        this.customStartDate,
        this.customEndDate,
        this.sourceIds,
        history.state.cpUserId === undefined || history.state.cpUserId === 0
          ? this.selectedSubSourcesIds
          : history.state.cpUserId,
        this.preSalesId,
        this.salesId,
        this.projectId,
        this.opportunityId
        // this.salesLeads
      )
      .subscribe({
        next: (response) => {
          if (this.isExportExcel) {
            this.downloadXLSFile(
              response,
              'Leads ' + Date.now().toString(),
              false
            );
          } else {
            this.leads = response.records;
            this.totalItems = response.totalRecords;
            this.paginator.pageIndex = this.pageIndex;
            this.paginator.pageSize = this.pageSize;
            this.dataSource = new MatTableDataSource(this.leads);
            this.getStarCount(this.leads);
            if (history.state.pageSize !== undefined) {
              this.pageSize = history.state.pageSize;
            }
            if (history.state.pageIndex !== undefined) {
              this.pageIndex = history.state.pageIndex;
            }
          }
          this.hideLoading();
        },
        error: (error) => {
          console.error(error);
          this.hideLoading();
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
    history.state.pageIndex = this.pageIndex;
    history.state.pageSize = this.pageSize;

    this.getDashBoardLeadsDetails();
    // this.leadService.refreshRequired.subscribe(() =>
    //   this.getDashBoardLeadsDetails()
    // );
  }

  onClickSearchNumber() {
    this.isExportExcel = false;
    if (this.phoneNumber.length > 0) {
      this.getDashBoardLeadsDetails();
    }
  }

  onSearch(phoneNumber: any) {
    this.isExportExcel = false;
    this.phoneNumber = phoneNumber;
    if (phoneNumber.length === 0) {
      // this.pageIndex = 0;
      // this.paginator.firstPage();

      this.getDashBoardLeadsDetails();
      // this.leadService.refreshRequired.subscribe(() =>
      //   this.getDashBoardLeadsDetails()
      // );
    }
  }

  onStatusSelectionChange(event: any) {
    this.isExportExcel = false;
    this.statusId = event.value;
    if (this.statusId === 'all') {
      this.statusId = '';
    }
    this.getDashBoardLeadsDetails();
    // this.leadService.refreshRequired.subscribe(() =>
    //   this.getDashBoardLeadsDetails()
    // );
  }

  addLead() {
    const route = this.isSalesTeam
      ? '/layout/sales/savelead/ST'
      : '/layout/presales/savelead/PST';
    this.router.navigate([route], {
      state: {
        isMenuLeads: this.isMenuLeads,
        dateRange: this.dateRange,
        customStartDate: this.customStartDate,
        customEndDate: this.customEndDate,
        isMemberDashBoard: this.isMemberDashBoard,
        isManagerDashBoard: this.isManagerDashBoard,
        isSalesHeadDashboard: this.isSalesHeadDashboard,
      },
    });
  }

  updateLead(leadId: number) {
    this.fetchLead(leadId);
  }

  fetchLead(leadId: number) {
    this.leadService.fetchLead(leadId).subscribe({
      next: (response) => {
        this.lead = response;
        const route = this.isSalesTeam
          ? '/layout/sales/savelead/ST'
          : '/layout/presales/savelead/PST';
        this.router.navigate([route], {
          state: {
            lead: response,
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            statusId: this.statusId,
            sourceIds: this.sourceIds,
            phoneNumber: this.phoneNumber,
            custName: this.userName,
            opportunityId: this.opportunityId,
            selectedSubSourcesIds: this.selectedSubSourcesIds,
            dateRange: this.dateRange,
            isMenuLeads: this.isMenuLeads,
            assignedTo: this.assignedTo,
            isAllLeads: this.isAllLeads,
          },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  filterLeads(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value.toLowerCase();
    if (searchTerm.length >= 3) {
      console.log(searchTerm);
    }
  }

  handleFollowups(leadId: number) {
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
          sourceIds: this.sourceIds,
          phoneNumber: this.phoneNumber,
          custName: this.userName,
          opportunityId: this.opportunityId,
          selectedSubSourcesIds: this.selectedSubSourcesIds,
          dateRange: this.dateRange,
          isMenuLeads: this.isMenuLeads,
          customStartDate: this.customStartDate,
          customEndDate: this.customEndDate,
          projectId: this.projectId,
          leadType: this.leadType,
          assignedTo: this.assignedTo,
          isAllLeads: this.isAllLeads,
        },
      });
    }
  }

  handleScheduleVisits(leadId: any) {
    this.router.navigate(['layout/presales/schedule/visit'], {
      state: {
        leadId,
        isView: this.isView,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        statusId: this.statusId,
        sourceIds: this.sourceIds,
        phoneNumber: this.phoneNumber,
        custName: this.userName,
        opportunityId: this.opportunityId,
        selectedSubSourcesIds: this.selectedSubSourcesIds,
        dateRange: this.dateRange,
        isMenuLeads: this.isMenuLeads,
        customStartDate: this.customStartDate,
        customEndDate: this.customEndDate,
        assignedTo: this.assignedTo,
      },
    });
  }

  generateLeadsReport() {
    this.isExportExcel = true;

    this.getDashBoardLeadsDetails();
    // this.leadService.refreshRequired.subscribe(() =>
    //   this.getDashBoardLeadsDetails()
    // );
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      const fileName: string = file.name;
      const fileParts: string[] = fileName.split('.');
      let fileExtension: string = '';

      if (fileParts.length > 1) {
        fileExtension = fileParts.pop()!.toLowerCase(); // Non-null assertion operator
      }

      if (fileExtension === 'xls' || fileExtension === 'xlsx') {
        this.selectedFile = file;
        this.selectedFileName = fileName; // Update the displayed file name
        this.fileTypeError = false;
      } else {
        this.selectedFile = null;
        this.selectedFileName = null; // Reset the displayed file name
        this.fileTypeError = true;
      }
    } else {
      this.selectedFile = null;
      this.selectedFileName = null; // Reset the displayed file name
      this.fileTypeError = false;
    }
  }

  onUpload(): void {
    if (this.selectedFile && this.selectedFile !== null) {
      this.leadService
        .uploadFile(this.selectedFile, this.userId, this.roleId)
        .subscribe({
          next: (response) => {
            this.resetFileInput();
            const successCount: number = response.successCount;
            const failureCount: number = response.failureCount;
            const total: number = successCount + failureCount;
            Swal.fire({
              title: 'File uploaded successfully...',
              html: `
            <p><strong>Success Leads:</strong> ${successCount}</p><br>
            <p><strong>Failure Leads:</strong> ${failureCount}</p><br>
            <p><strong>Total:</strong> ${total}</p>
          `,
              icon: 'success',
              timerProgressBar: true,
              showConfirmButton: true,
              confirmButtonText: 'Download',
              showCancelButton: true,
              cancelButtonText: 'OK',
            }).then((file) => {
              if (file.isConfirmed) {
                this.excelDownload(response.fileName);
              }

              this.getDashBoardLeadsDetails();
              // this.leadService.refreshRequired.subscribe(() =>
              //   this.getDashBoardLeadsDetails()
              // );
            });
          },
          error: (error) => {
            console.error('File upload failed : ', error?.error.fileName);
            this.resetFileInput();
            if (error?.error?.fileName) {
              Swal.fire({
                icon: 'error',
                html: `
              
              <div> ${error?.error?.fileName}</div>
            `,
                showConfirmButton: true,
              });
            } else {
              Swal.fire({
                icon: 'error',
                text: 'Error occured',
                showConfirmButton: true,
              });
            }
          },
        });
    } else {
      Swal.fire({
        icon: 'info',
        text: 'Please select file...',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  }
  private resetFileInput(): void {
    this.selectedFile = null;
    this.fileInput.nativeElement.value = '';
    this.selectedFileName = null;
  }
  onLeadRowClick(leadId: number) {
    this.isView = false;
    this.handleFollowups(leadId);
  }

  // private downloadFile(
  //   data: Blob,
  //   filename: string,
  //   needTime: boolean = true
  // ): void {
  //   const now = new Date();
  //   const timestamp = now.toLocaleDateString() + '_' + now.toLocaleTimeString();
  //   if (filename.endsWith('.xls')) {
  //     const blob = new Blob([data], {
  //       type: 'application/vnd.ms-excel',
  //     });
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     needTime
  //       ? (a.download = filename + '_' + timestamp + '.xls')
  //       : (a.download = filename + '.xls');

  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(url);
  //   } else {
  //     const blob = new Blob([data], {
  //       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //     });
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     needTime
  //       ? (a.download = filename + '_' + timestamp + '.xlsx')
  //       : (a.download = filename + '.xlsx');

  //     document.body.appendChild(a);
  //     a.click();
  //     document.body.removeChild(a);
  //     window.URL.revokeObjectURL(url);
  //   }
  // }
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

  private downloadXLSXFile(
    data: Blob,
    filename: string,
    needTime: boolean = true
  ) {
    const now = new Date();
    const timestamp = now.toLocaleDateString() + '_' + now.toLocaleTimeString();

    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    needTime
      ? (a.download = filename + '_' + timestamp + '.xlsx')
      : (a.download = filename + '.xlsx');

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  private excelDownload(fileName: string) {
    this.leadService.downloadUpdatedExcel(fileName).subscribe({
      next: (response: Blob) => {
        console.log('File downloaded successfully', response);
        this.fileInput.nativeElement.value = '';
        if (fileName.endsWith('.xlsx')) {
          this.downloadXLSXFile(response, 'UpdatedLeads');
        }
        if (fileName.endsWith('.xls')) {
          this.downloadXLSFile(response, 'UpdatedLeads');
        }
      },
      error: (error) => {
        console.error('File download failed : ', error);
        Swal.fire({
          icon: 'error',
          text: 'Error Occurred',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      },
    });
  }

  downloadTemplate() {
    this.leadService.downloadTemplate(!this.isChannelPartner).subscribe({
      next: (response: Blob) => {
        this.downloadXLSXFile(response, 'Leads_upload_template', false);
        Swal.fire({
          icon: 'success',
          text: 'Template downloaded successfully',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      },
      error: (error) => {
        console.error('File download failed : ', error);
        Swal.fire({
          icon: 'error',
          text: 'Error Occurred',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      },
    });
  }

  handleDaySelection(commonRefObject: CommonReferenceDetails | null) {
    // If "All" option is selected
    this.isExportExcel = false;
    if (!commonRefObject) {
      this.dateRange = 999;
      this.customStartDate = null;
      this.customEndDate = null;
      this.formData.patchValue({
        customStartDate: null,
        customEndDate: null,
      });
      this.showDateRangePicker = false;
      this.isMenuLeads = false;

      this.getDashBoardLeadsDetails();
    } else {
      this.dateRange = commonRefObject.commonRefKey;

      if (
        commonRefObject.commonRefValue &&
        commonRefObject.commonRefValue.includes('Custom')
      ) {
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
        // this.leadService.refreshRequired.subscribe(() =>
        //   this.getDashBoardLeadsDetails()
        // );

        this.showDateRangePicker = false;
      }
    }
  }

  viewLeadDetails(lead: any) {
    this.leadService.fetchLead(lead.id).subscribe({
      next: (response) => {
        this.lead = response;
        const route = '/layout/presales/savelead/PST';
        this.router.navigate([route], {
          state: {
            isView: this.isView,
            lead: response,
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
          },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  viewLeadHistories(leadId: any) {
    this.leadService.fetchLead(leadId).subscribe({
      next: (response) => {
        this.lead = response;
        const route = '/layout/presales/history';
        this.router.navigate([route], {
          state: {
            leadId: leadId,
            team: this.isSalesTeam,
            lead: response,
            pageSize: this.pageSize,
            pageIndex: this.pageIndex,
            statusId: this.statusId,
            sourceIds: this.sourceId,
            phoneNumber: this.phoneNumber,
            custName: this.userName,
            opportunityId: this.opportunityId,
            subSourceIds: this.selectedSubSourcesIds,
            dateRange: this.dateRange,
            isMenuLeads: this.isMenuLeads,
            customStartDate: this.customStartDate,
            customEndDate: this.customEndDate,
            assignedTo: this.assignedTo,
            projectId: this.projectId,
            isAllLeads: this.isAllLeads,
          },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
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

  getUserFormLocalStorage() {
    const user = localStorage.getItem('user');
    const mainUser = localStorage.getItem('Mainuser');
    if (mainUser) {
      this.mainUser = JSON.parse(mainUser);
    }
    if (user) {
      this.user = JSON.parse(user);
      this.userId = this.user.userId;
      this.roleName = this.user.roleName;
      this.UserRoleName = this.user.roleName
        ? this.user.roleName.toLowerCase()
        : undefined;
      this.organizationId = this.user.organizationId;
      this.roleId = this.user.roleId;
      if (
        this.user.roleName.toLocaleLowerCase().includes('channel partner') ||
        this.user.roleName.toLocaleLowerCase().includes('cp users') ||
        this.user.roleName.toLocaleLowerCase().includes('cto') ||
        this.user.roleName.toLocaleLowerCase().includes('cp approval') ||
        this.user.roleName.toLocaleLowerCase() === 'presales manager' ||
        this.user.roleName
          .toLocaleLowerCase()
          .includes('assistant manager - channel sales')
      ) {
        this.add = true;
      }
      if (
        this.user.roleName.toLocaleLowerCase().includes('sales head') ||
        this.user.roleName.toLocaleLowerCase().includes('cto') ||
        this.user.roleName.toLocaleLowerCase().includes('cp approval') ||
        this.user.roleName.toLocaleLowerCase() === 'sales manager' ||
        this.user.roleName
          .toLocaleLowerCase()
          .includes('assistant manager - channel sales')
      ) {
        this.add = false;
      }
    }
  }

  isRole(roles: string[]): boolean {
    if (!this.UserRoleName) {
      console.log('UserRoleName is undefined'); // Log for debugging
      return false;
    }
    return roles.some((role) => this.UserRoleName === role.toLowerCase());
  }

  getAllUserNames() {
    let status: any;
    this.route.params.subscribe((params) => {
      status = params;
      console.log('Status from URL (observable):', status);
    });
    this.userService.getUserByManagerId(this.mainUser.userId, '').subscribe({
      next: (userDetails) => {
        if (status.PST === 'PST') {
          this.isPresalesUser = true;
          this.userDetails = userDetails.filter(
            (user) =>
              user.roleName == 'presales member' ||
              user.roleName == 'presales manager'
          );
        } else {
          this.isPresalesUser = false;
          this.userDetails = userDetails.filter(
            (user) => user.roleName == 'sales member'
          );
        }
      },
      error: (error) => {
        console.error('Error fetching UserDetails:', error);
      },
    });
  }
  onUsernameSelectionChange(event: any) {
    this.isExportExcel = false;
    console.log(event);
    this.preSalesId = event.value;
    if (this.preSalesId === 'all') {
      this.preSalesId = '';
    }

    this.salesId = event.value;
    if (this.salesId === 'all') {
      this.salesId = '';
    }
    this.assignedTo = event.value;

    this.getDashBoardLeadsDetails();
  }

  goBack() {
    const stateData = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.customStartDate,
      customEndDate: this.customEndDate,
      cpUserId: this.cpUserId,
      projectId: this.projectId,
    };

    if (this.isMemberDashBoard) {
      this.router.navigate(['layout/memberdashboard'], {
        state: stateData,
      });
    } else if (this.isManagerDashBoard) {
      this.router.navigate(['layout/mangerdashboard'], {
        state: stateData,
      });
    } else if (this.isSalesHeadDashboard) {
      this.router.navigate(['layout/salesheaddashboard'], {
        state: stateData,
      });
    } else if (this.isDigitalMarketingDashboard) {
      this.router.navigate(['layout/digitalmarketing'], {
        state: stateData,
      });
    } else {
      this.router.navigate(['layout/cpdashboard'], {
        state: stateData,
      });
    }
  }

  fetchLeadSources(): void {
    this.leadService.fetchLeadSources().subscribe({
      next: (sources: LeadSource[]) => {
        this.sources = sources;
        this.filteredSources = this.sources;
      },
      error: (error: any) => {
        console.error('Error fetching lead sources:', error);
      },
    });
  }

  onSourceSelect(event: MatAutocompleteSelectedEvent): void {
    const selectedSource = event.option.value as LeadSource;
    this.sourceId = selectedSource.leadSourceId;
    this.fetchSubSources(this.sourceId);
    // alert(this.sourceId + 'onsource selection');

    this.getDashBoardLeadsDetails();
    // this.leadService.refreshRequired.subscribe(() =>
    //   this.getDashBoardLeadsDetails()
    // );
  }

  displaySource(source: LeadSource): string {
    return source && source.name ? source.name : 'All';
  }

  searchSource(event: any): void {
    const searchTerm = event.target.value.toLowerCase();

    // Filter the sources array based on the search term
    this.filteredSources = this.sources.filter((source) =>
      source.name.toLowerCase()?.includes(searchTerm)
    );
  }

  onClickSearchName() {
    this.isExportExcel = false;
    if (this.userName.length > 0) {
      this.getDashBoardLeadsDetails();
    }
  }
  onSearchUserName(userName: any) {
    this.isExportExcel = false;
    this.paginator.firstPage();
    this.userName = userName;
    if (userName.length === 0) {
      this.getDashBoardLeadsDetails();
    }
  }

  onDialogOpen(phoneNumber: string) {
    const countryCodePattern = /^\+\d{1,4}\s*/;
    const formatedPhoneNumber = phoneNumber.replace(countryCodePattern, '');

    this.leadService
      .getDuplicateLeadHistories(formatedPhoneNumber, 0, 20)
      .subscribe({
        next: (response) => {
          this.leadHistories = response.records;
          // this.totalItems = response.totalRecords;
          this.openDialog = true;
        },
        error: (error: any) => {
          console.error(error);
        },
      });
  }

  onCancelAndClose() {
    this.openDialog = false;
  }

  // Method to submit and close the modal
  submitAndClose() {
    // Handle form submission or any logic
    this.openDialog = false;
  }

  openAudioFilesDialog(leadId: number) {
    this.leadService.fetchLeadAudio(leadId).subscribe({
      next: (audio) => {
        // Filter unique records based on `audioFile`
        const uniqueAudio = audio.filter(
          (item: LeadMcubeAudio, index: number, self: LeadMcubeAudio[]) =>
            index === self.findIndex((a) => a.audioFile === item.audioFile)
        );

        // Map to reset properties
        this.audio = uniqueAudio.map((item: LeadMcubeAudio) => {
          item.currentTime = 0; // Reset the currentTime to 0
          item.isPlaying = false; // Ensure no audio is playing when the dialog opens
          return item;
        });

        if (this.currentAudio) {
          this.currentAudio.currentTime = 0;
        }

        this.openAudioDialog = true;
      },
      error: (err) => {
        console.error('Error fetching audio:', err);
      },
    });
  }

  getStarCount(lead: any): number {
    let starCount = 0;
    if (lead.isRegisteredWithAnotherProject === 1) {
      starCount += 1;
    }
    // if (lead.isSiteVisitDoneInAnotherProject === 2) {
    //   starCount += 1;
    // }

    return starCount;
  }

  getStarColor(projectName: string): string {
    const projectColors: { [key: string]: string } = {
      'SBR MINARA': 'green',
      'SBR FLORENSO': 'gray',
      'SBR EARTH&SKY': 'blue',
    };
    return projectColors[projectName] || 'gray';
  }

  onClickSearchOpportunityId() {
    this.isExportExcel = false;
    if (this.opportunityId.length > 0) {
      this.getDashBoardLeadsDetails();
    }
  }
  onSearchOpportunityId(opportunityId: string) {
    this.isExportExcel = false;
    this.opportunityId = opportunityId;

    if (opportunityId.length == 0) {
      this.opportunityId = '';

      this.getDashBoardLeadsDetails();
    }
  }

  fetchSubSources(sourceId: number): void {
    // this.selectedSubSource = new LeadSubSource(0, '', 0, '');
    this.sourceId = sourceId;
    this.leadService.fetchLeadSubSources(sourceId).subscribe({
      next: (subSources) => {
        this.sourceId = sourceId;
        this.subSources = subSources;
        // this.filteredSubSources = this.subSources;
      },
      error: (error) => {
        console.error('Error fetching lead sub-sources:', error);
      },
    });
  }

  searchSubSource(event: any): void {
    this.isExportExcel = false;
    const searchTerm = event.target.value.toLowerCase();
    if (!searchTerm) {
      this.filteredSubSources = [...this.subSources];
    } else {
      this.filteredSubSources = this.subSources.filter((source) =>
        source.name.toLowerCase()?.includes(searchTerm)
      );
    }
    this.filteredSubSources = this.filteredSubSources.sort((a, b) => {
      const aSelected = this.selectedSubSourcesIds?.includes(a.leadSubSourceId);
      const bSelected = this.selectedSubSourcesIds?.includes(b.leadSubSourceId);

      // Place selected items first, then unselected items
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }

  displaySubSource(SubSource: LeadSubSource): string {
    return SubSource && SubSource.name ? SubSource.name : '';
  }
  isSelected(subSourceId: number): boolean {
    return this.selectedSubSourcesIds?.includes(subSourceId);
  }

  selectedSources: LeadSource[] = [];

  // onSelectionSourceChange(event: any) {
  //   this.isExportExcel = false;
  //   const selectedIds = event.value;
  //   this.sourceId = selectedIds;
  //   this.sourceIds = selectedIds;
  //   // Handle deselection logic by comparing currently selected sources with previously selected ones
  //   const previouslySelectedSources = Object.keys(this.sourceSubsourceMap).map(
  //     Number
  //   );
  //   const deselectedSourceIds = previouslySelectedSources.filter(
  //     (sourceId) => !selectedIds.includes(sourceId)
  //   );
  //   // Remove related sub-sources when source is deselected
  //   deselectedSourceIds.forEach((sourceId) => {
  //     if (this.sourceSubsourceMap[sourceId]) {
  //       const subsourceIds = this.sourceSubsourceMap[sourceId];

  //       // Remove each subSourceId from selectedSubSourcesIds
  //       subsourceIds.forEach((subSourceId) => {
  //         this.selectedSubSourcesIds = this.selectedSubSourcesIds?.filter(
  //           (id) => id !== subSourceId
  //         );
  //       });

  //       // Remove the entry from sourceSubsourceMap
  //       delete this.sourceSubsourceMap[sourceId];
  //     }
  //   });

  //   console.log(this.selectedSubSourcesIds); // Corrected log statement for selectedSubSourcesIds
  //   this.subSourceId = this.selectedSubSourcesIds;
  //   console.log(
  //     'Updated sourceSubsourceMap after deselection:',
  //     this.sourceSubsourceMap
  //   );
  //   console.log('Updated selectedSubSourcesIds:', this.selectedSubSourcesIds);

  //   // For newly selected sources, ensure the sourceSubsourceMap is initialized
  //   selectedIds.forEach((sourceId: number) => {
  //     // this.sourceId = sourceId; // Set the current sourceId
  //     // Initialize array if the sourceId doesn't exist in the map
  //     if (!this.sourceSubsourceMap[sourceId]) {
  //       this.sourceSubsourceMap[sourceId] = [];
  //     }
  //     console.log(
  //       `Map for sourceId ${sourceId}:`,
  //       this.sourceSubsourceMap[sourceId]
  //     );
  //   });

  //   this.paginator.firstPage();
  //   this.fetchSubSourcesBySourceIds(selectedIds);

  //   this.getDashBoardLeadsDetails();
  //   // this.leadService.refreshRequired.subscribe(() =>
  //   //   this.getDashBoardLeadsDetails()
  //   // );
  // }\

  tosslePerOne(): void {
    this.isExportExcel=false
    this.sourceIds = this.formData.value.sourceIds;
    if (this.allSelected?.selected) {
      this.allSelected.deselect();
      this.sourceIds = this.formData.value.sourceIds;

      // return;
    }
    if (
      this.formData.controls['sourceIds'].value.length == this.sources.length
    ) {
      this.allSelected?.select();
      this.selectedSubSourcesIds = [];
      // this.selectedSubSourcesIds = [];
    }
    // this.sourceIds = this.formData.value.sourceIds;
    // this.updateSubSourceIds();
    this.fetchSubSourcesBySourceIdsOne(this.sourceIds);

    // this.getAllLeadStatus();
    // this.getDashBoardLeadsDetails();
  }

  toggleAllSelection() {
    this.isExportExcel = false;
    if (this.allSelected?.selected) {
      this.selectedSubSourcesIds = [];
      this.subSourceId = [];
      this.formData.controls['sourceIds'].patchValue([
        ...this.sources.map((item) => item.leadSourceId),
        0,
      ]);
      // this.sourceIds = [];
    } else {
      // alert('elseeeeeeeeeeee');
      this.formData.controls['sourceIds'].patchValue([]);
      this.sourceIds = this.formData.value.sourceIds;
    }
    this.sourceIds = this.formData.value.sourceIds;

    this.fetchSubSourcesBySourceIdsOne(this.sourceIds);
  }
  fetchSubSourcesBySourceIdsOne(selectedIds: number[]): void {
    this.leadSubSource
      .fetchBySourceIds(selectedIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subSources: any) => {
          this.subSources = subSources;
          this.filteredSubSources = this.subSources;
          this.filteredSubSources = this.sortSubSources(this.subSources);
          this.selectedSubSourcesIds = this.selectedSubSourcesIds?.filter(
            (id) =>
              this.filteredSubSources.some(
                (subSource) => subSource.leadSubSourceId === id
              )
          );
          if (this.selectedSubSourcesIds == undefined) {
            this.selectedSubSourcesIds = [];
          }

          const stateSubSources = this.subSources.filter((source: any) =>
            this.selectedSubSourcesIds.includes(source.leadSubSourceId)
          );
          console.log(this.selectedSubSourcesIds);
          const selectedNames = stateSubSources
            .map((source: any) => source.name)
            .join(', ');
          this.subSourceControl.patchValue(selectedNames);
          this.getAllLeadStatus();
          this.getDashBoardLeadsDetails();
        },
      });
  }
  fetchSubSourcesBySourceIds(selectedIds: number[]): void {
    this.leadSubSource
      .fetchBySourceIds(selectedIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subSources: any) => {
          this.subSources = subSources;
          this.filteredSubSources = this.subSources;
          this.filteredSubSources = this.sortSubSources(this.subSources);
          this.selectedSubSourcesIds = this.selectedSubSourcesIds?.filter(
            (id) =>
              this.filteredSubSources.some(
                (subSource) => subSource.leadSubSourceId === id
              )
          );
          const stateSubSources = this.subSources.filter((source: any) =>
            this.selectedSubSourcesIds.includes(source.leadSubSourceId)
          );
          console.log(this.selectedSubSourcesIds);
          const selectedNames = stateSubSources
            .map((source: any) => source.name)
            .join(', ');
          this.subSourceControl.patchValue(selectedNames);
        },
      });
  }
  sourceSubsourceMap: { [key: number]: number[] } = {};

  onSelectionSubSourceChange(subSource: any, event: any) {
    this.isExportExcel = false;
    const selectedSubSourceId = subSource.leadSubSourceId;
    // Get the sub-source ID
    const sourceId = subSource.sourceId; // Get the corresponding source ID
    if (event.checked) {
      if (this.sourceSubsourceMap[sourceId]) {
        this.sourceSubsourceMap[sourceId]?.push(selectedSubSourceId);
      }
      this.selectedSubSourcesIds?.push(selectedSubSourceId); // Add to selected IDs
    } else {
      // Remove sub-source ID from selected IDs
      this.selectedSubSourcesIds = this.selectedSubSourcesIds?.filter(
        (id) => id !== selectedSubSourceId
      );

      // Remove sub-source ID from sourceSubsourceMap
      if (this.sourceSubsourceMap[sourceId]) {
        this.sourceSubsourceMap[sourceId] = this.sourceSubsourceMap[
          sourceId
        ].filter((id) => id !== selectedSubSourceId);

        // Optional: Remove the key from the map if the array is empty
        if (this.sourceSubsourceMap[sourceId].length === 0) {
          delete this.sourceSubsourceMap[sourceId];
        }
      }
    }

    console.log('Updated sourceSubsourceMap:', this.sourceSubsourceMap);
    // Additional processing
    this.filteredSubSources = this.sortSubSources(this.filteredSubSources);
    console.log('Selected SubSource IDs:', this.selectedSubSourcesIds);

    this.paginator.firstPage();
    this.subSourceId = this.selectedSubSourcesIds;
    // Trigger any additional updates or API calls
    console.log(this.subSourceId);

    this.getDashBoardLeadsDetails();
    // this.leadService.refreshRequired.subscribe(() =>
    //   this.getDashBoardLeadsDetails()
    // );
  }

  sortSubSources(subSources: any[]): any[] {
    return subSources.sort((a, b) => {
      const aSelected = this.selectedSubSourcesIds?.includes(a.leadSubSourceId);
      const bSelected = this.selectedSubSourcesIds?.includes(b.leadSubSourceId);

      // Place selected items first, then unselected items
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }
  isAllSelected() {
    return this.subSources.length === this.selectedSubSourcesIds.length;
  }
  filter(value: string): any[] {
    const filterValue = value.toLowerCase();
    const selected = this.subSources.filter((subSource) =>
      this.isSelected(subSource.leadSubSourceId)
    );
    const unselected = this.subSources.filter(
      (subSource) =>
        !this.isSelected(subSource.leadSubSourceId) &&
        subSource.name.toLowerCase().includes(filterValue)
    );

    // Combine selected users at the top
    return [...selected, ...unselected];
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : 'All';
  }

  


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
  playAudio(audioItem: LeadMcubeAudio): void {
    // If a different audio is playing, stop it and start the new audio
    if (
      this.currentlyPlayingAudio &&
      this.currentlyPlayingAudio !== audioItem
    ) {
      this.pauseAudio(this.currentlyPlayingAudio); // Stop the currently playing audio
      this.currentlyPlayingAudio = null; // Clear the reference to the previous audio
    }
    if (this.currentAudio) {
      this.currentAudio.onloadedmetadata = () => {
        if (this.currentAudio?.duration) {
          audioItem.duration = this.currentAudio.duration;
        } else {
          console.warn('Duration is unavailable for the current audio.');
        }
      };
    }

    // Check if audio is already created and playing/resuming the same audio
    if (!this.currentAudio || this.currentAudio.src !== audioItem.audioFile) {
      // Create a new Audio instance for the new audio
      this.currentAudio = new Audio(audioItem.audioFile);
      this.currentAudio.currentTime = 0; // Start from the beginning
      this.currentlyPlayingAudio = audioItem; // Set the currently playing audio

      // Fetch metadata for duration
      this.currentAudio.onloadedmetadata = () => {
        audioItem.duration = this.currentAudio?.duration; // Set total duration
        console.log('Total duration: ' + this.currentAudio?.duration);
      };

      // Update current time during playback
      this.currentAudio.ontimeupdate = () => {
        audioItem.currentTime = this.currentAudio?.currentTime; // Update current time
      };

      this.currentAudio.onended = () => {
        audioItem.isPlaying = false; // Reset UI state when audio ends
      };
    } else {
      // If playing the same audio, resume from the last saved position
      this.currentAudio.currentTime = audioItem.currentTime || 0; // Use saved position
    }

    // Play the audio
    this.currentAudio.play();
    audioItem.isPlaying = true; // Update UI state
    this.currentlyPlayingAudio = audioItem; // Update the currently playing reference
  }

  pauseAudio(audioItem: LeadMcubeAudio): void {
    audioItem.isPlaying = false;
    this.currentlyPlayingAudio = null;
    if (this.currentAudio) {
      this.currentAudio.pause();
      audioItem.currentTime = this.currentAudio.currentTime; // Save the current time when paused
      audioItem.isPlaying = false; // Update UI state
    }
  }

  forwardAudio(audioItem: LeadMcubeAudio): void {
    if (this.currentAudio) {
      this.currentAudio.currentTime += 10; // Jump forward by 10 seconds
    }
  }

  onAudioDialogClose() {
    this.openAudioDialog = false;
    this.currentAudio?.pause();
  }

  // Method to format time in mm:ss
  formatTime(seconds: any): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  }

  // Change audio time when clicking on progress bar
  changeAudioTime(event: MouseEvent, audioItem: any) {
    const progressBar = event.target as HTMLProgressElement;
    const newTime =
      (event.offsetX / progressBar.offsetWidth) * audioItem.duration;
    audioItem.currentTime = newTime;

    // Optional: Update audio playback if it's playing
    if (audioItem.isPlaying) {
      this.playAudio(audioItem);
    }
  }

  fetchProject(projectId: number) {
    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => {
        this.selectedProject = project;
        this.project.setValue(project);
      },
      error: (error) => {
        console.error('Error fetching project:', error);
      },
    });
  }

  // Options for the dropdown menu

  // @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger | undefined;
  //  menuOptions = ['Search By Sourse', 'Search By Name', 'Search By Opportunity Id','Assigned To'];

  //  // Method to handle the selection
  //  onMenuItemClick(option: string) {
  //    console.log('Selected Option:', option);
  //    // You can handle the action for each option here
  //    if (this.trigger) {
  //     this.trigger.closeMenu();
  //   }
  //  }
  // Options for the dropdown menu
  dropdownPosition: any = {};
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  onMenuClick(event: MouseEvent) {
    console.log('Menu clicked', event);
    // Additional logic can be added here if needed
  }
  menuOpen: boolean = false; // This controls the visibility of the menu
  // This will be bound to the input field

  // Toggle the visibility of the menu
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
    this.menuOpen = false;
  }

  getUserById(userId: number) {
    this.userService.getUserById(userId).subscribe({
      next: (user) => {
        this.userToBePatched = user;
      },
      error: (error) => {
        console.error('Error fetching project:', error);
      },
    });
  }

  clearModalFilters() {
    this.projectId = 0;
    this.selectedProject = new Project();
    // this.projects=[];
    // console.log(this.projects)
  }

  updatePresalesAndSalesUserId(userId: any) {
    if (
      !this.isSalesTeam ||
      this.user.roleName.toLowerCase().includes('presales manager')
    ) {
      this.preSalesId = userId;
    } else if (
      this.isSalesTeam ||
      this.user.roleName.toLowerCase().includes('sales manager')
    ) {
      this.salesId = userId;
    }
  }
  isDisplayStars(): boolean {
    return (
      this.user.roleName.toLowerCase() !== 'channel partner' &&
      this.user.roleName.toLowerCase() !== 'cp users'
    );
  }

  private fetchUsersByRole() {
    let status: any;
    const roleName: string[] = []; // Declare roleName as an array of strings
    roleName.push('presales member');
    roleName.push('sales member');
    roleName.push('NoCallSupport');
    this.userService
      .fetchUsersByRolesAndOrganization(roleName, this.user.organizationId, 'A')
      .subscribe({
        next: (userDetails) => {
          this.userDetails = userDetails;
        },
        error: (error) => {
          console.error('Error fetching UserDetails by role:', error);
        },
      });
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

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
  // updateSubSourceIds() {
  //   const selectedSourceIdsSet = new Set(this.sourceIds);

  //   this.subSourceIds = this.subSourceIds.filter((subSourceId) =>
  //     this.subSources.some(
  //       (sub: ILeadSubSourceDto) =>
  //         sub.leadSubSourceId === subSourceId &&
  //         selectedSourceIdsSet.has(sub.leadSourceId)
  //     )
  //   );
  // }
  patchStateSubSourcesBySourceIds(selectedIds: number[]): void {
    console.log(selectedIds + ' entering patch');
    this.leadSubSource
      .fetchBySourceIds(selectedIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subSources: any) => {
          this.subSources = subSources;
          this.filteredSubSources = this.subSources;
          this.filteredSubSources = this.sortSubSources(this.subSources);
          const stateSubSources = this.subSources.filter((source: any) => {
            console.log(this.subSourceIds + ' sub source ids');

            this.subSourceIds.includes(source.leadSubSourceId);
            console.log(this.subSourceIds.includes(source.leadSubSourceId));
          });
          console.log(stateSubSources);
          const selectedNames = stateSubSources
            .map((source: any) => source.name)
            .join(', ');
          this.subSourceControl.patchValue(selectedNames);
          this.selectedSubSourcesIds = this.subSourceIds;
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
