import { OverlayContainer } from '@angular/cdk/overlay';
import { DatePipe, formatDate } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { leadPageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { Lead, LeadDto } from 'src/app/Models/Presales/lead';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import {
  ILeadSubSourceDto,
  LeadSubSource,
} from 'src/app/Models/Presales/leadsubsource';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { LeadSourceService } from 'src/app/Services/Presales/LeadSource/lead-source.service';
import { LeadSubsourceService } from 'src/app/Services/Presales/LeadSubSource/lead-subsource.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';

@Component({
  selector: 'app-walk-in-leads',
  templateUrl: './walk-in-leads.component.html',
  styleUrls: ['./walk-in-leads.component.css'],
})
export class WalkInLeadsComponent implements OnInit, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;

  phoneNumber: string = '';
  lead: Lead = new Lead();
  leads: LeadDto[] = [];
  user: User = new User();
  destroy$ = new Subject<void>();
  days: CommonReferenceDetails[] = [];
  isExportExcel: boolean = false;
  isView: boolean = true;
  daysType: string = 'Filter_Days';
  // selectedFile: File | null = null;
  // selectedFileName: string | null = null;
  // chart: Chart | any;
  @ViewChild('allSelected') private allSelected?: MatOption;
  displayedColumns: string[] = [
    'rowNumber',
    'createdDate',
    'opportunityId',
    'name',
    'projectName',
    'sourceName',
    'subSourceName',
    'unitName',
    'preSalesManagerName',
    'salesManagerName',
    'leadType',
    'status',
    // 'currentFollowUpDate',`
    'prevStatus',
    'followUpDate',
    'remarks',
    'actions',
  ];

  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;

  // Pagination
  totalItems: number = 0;
  pageSize: number = 25;
  pageIndex: number = 0;
  assignedTo?: number;
  name: string = '';
  statusIds: number[] = [];
  leadStatusIds: number[] = [];
  ncStatusId: any = '';
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
  roleName: string = '';
  showDropdown: boolean = false;
  preSalesId: any;
  salesId: any;
  userIdFromDashBoard: any;
  userNameFromDashBoard: any;
  dataSource!: any;
  moduleNames: string[] = [];
  projectId: any= [];
  UserRoleName: string | undefined;
  organizationId: number = 0;
  //cp user id
  cpUserId: number = 0;
  isCpUserId: boolean = false;
  sources: LeadSource[] = [];
  filteredSources: LeadSource[] = [];
  sourceId: number = 0;
  source: any = new FormControl([] as LeadSource[]);
  roleId: number = 0;
  projectName: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  id: any;
  opportunityId: string = '';
  userName: any;
  projects: Project[] = [];
  selectedProject: IProject = new Project();
  project: any = new FormControl([] as IProject[]);
  // subSourceId: any;
  subSourceIds: number[] = [];
  dropdownPosition: any = {};
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  menuOpen: boolean = false; // This controls the visibility of the menu
  // This will be bound to the input field
  filteredSubSources: LeadSubSource[] = [];
  selectedSubSourcesIds: number[] = [];
  sourceIds: number[] = [];
  subSources: any[] = [];
  // subSourceControl: any;
  selectedStatus: any;
  subSourceControl = new FormControl('');
  selectedprojectIds: any;
  @ViewChild('allProjectSelected') private allProjectSelected?: any;
  isExpried='N'
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private leadService: LeadService,
    private commonService: CommanService,
    private commonRefDetailService: CommonreferencedetailsService,
    private formBuilder: FormBuilder,
    private overlayContainer: OverlayContainer,
    private leadSourceService: LeadSourceService,
    private leadSubSourceService: LeadSubsourceService,
    private userService: UserService,
    private projectService: ProjectService,
    private loaderService: LoaderService
  ) {}

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (user) {
      this.user = JSON.parse(user);
      this.userId = this.user.userId;
      this.organizationId = this.user.organizationId;
      this.roleId = this.user.roleId;
    }

    this.getUserFormLocalStorage();
    // this.updateDisplayedColumns();
    this.initializeState();
    this.fetchProjects();
    this.getAllUserNames();

    this.route.params.subscribe((params) => this.setTeamType(params));
    // this.getWalkInSourceId();
    this.loadUserAndFetchLeads();
    this.initForm();
    this.fetchFilterDays();
    this.fetchLeadSources();
    this.route.queryParams.subscribe((params) => {
      this.userIdFromDashBoard = params['userId'];
      this.userNameFromDashBoard = params['userName'];
      // this.onUsernameSelectionChange({ value: this.userIdFromDashBoard });
    });
    // console.log(
    //   'OverlayContainer element:',
    //   this.overlayContainer.getContainerElement()
    // );
    this.overlayContainer.getContainerElement().classList.add('leads-dropdown');
    this.patchDateFilterAndFetchData();
  }
  // ngAfterViewInit() {
  //   if (this.dataSource) {
  //     this.dataSource.sort = this.sort;
  //     this.dataSource.paginator = this.paginator;
  //   }
  // }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.overlayContainer
      .getContainerElement()
      .classList.remove('leads-dropdown');
    // if (this.chart) {
    //   this.chart.destroy();
    // }
  }

  getWalkInSourceId(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.leadSourceService.fetchSourecByName('Walk-In').subscribe({
        next: (response: any) => {
          this.sourceId = response.leadSourceId;
          this.id = response.leadSourceId;
          console.log('sourceIdFrom get walk-in', this.sourceId);
          resolve(); // Resolve the promise after setting the sourceId
        },
        error: (error) => {
          console.error(error);
          reject(error); // Reject the promise in case of an error
        },
      });
    });
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
          this.getDashBoardLeadsDetailsV1();
        }
      });
  }

  private initializeState() {
    console.log(history.state);
    const state = history.state;
    this.stateData = state;
    this.cpUserId = state.cpUserId;
    if (this.cpUserId != undefined && this.cpUserId != 0) {
      this.userId = state.cpUserId;
      this.isCpUserId = true;
    } else {
      this.userId = this.user.userId;
    }

    this.dateRange = state.dateRange || 0;
    this.customStartDate = state.customStartDate;
    this.customEndDate = state.customEndDate;
    this.ncStatusId = state.ncStatusId;
    this.userIdFromDashBoard = state.userId;
    this.userNameFromDashBoard = state.userName;
    if (state.projectId !== undefined && state.projectId.length > 0) {
      this.projectId = state.projectId;
      this.patchStateProjectIds(this.projectId)
    }

    if (state.pageIndex !== undefined) {
      this.pageIndex = history.state.pageIndex;
    }
    if (state.pageSize !== undefined) {
      this.pageSize = history.state.pageSize;
    }
    this.sourceId = history.state.sourceIds;
    this.phoneNumber = history.state.phoneNumber;
    this.opportunityId = history.state.opportunityId;
    this.userName = history.state.custName;
    this.statusIds = history.state.statusId;
    this.isExpried=history.state.expried!=undefined?history.state.expried:this.isExpried
  }

  private setTeamType(params: any) {
    this.isSalesTeam = params['ST'] === 'ST';
    this.isSalesTeamFollowUs = this.isSalesTeam;
  }

  patchDateFilterAndFetchData() {
    this.projectId = history.state.projectId;

    this.sourceIds = history.state.sourceIds || [];
    this.formData.value.sourceIds = this.sourceIds;
    this.formData.patchValue({ sourceIds: this.sourceIds });

    if (this.sourceIds?.length > 0) {
      this.patchStateSubSourcesBySourceIds(this.sourceIds);
    }

    this.subSourceIds = history.state.subSourceIds || [];
    this.selectedSubSourcesIds = history.state.subSourceIds || [];
  }
  // patchStateSubSourcesBySourceIds(selectedIds: number[]): void {
  //   console.log(selectedIds);
  //   this.leadSubSource
  //     .fetchBySourceIds(selectedIds)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (subSources: any) => {
  //         this.subSources = subSources;
  //         this.filteredSubSources = this.subSources;
  //         this.filteredSubSources = this.sortSubSources(this.subSources);
  //         const stateSubSources = this.subSources.filter((source: any) =>
  //           this.subSourceIds.includes(source.leadSubSourceId)
  //         );
  //         console.log(stateSubSources);
  //         const selectedNames = stateSubSources
  //           .map((source: any) => source.name)
  //           .join(', ');
  //         this.subSourceControl.patchValue(selectedNames);
  //         this.selectedSubSourcesIds = this.subSourceIds;
  //       },
  //     });
  // }
  patchStateSubSourcesBySourceIds(selectedIds: number[]): void {
    console.log(selectedIds);
    this.leadSubSourceService
      .fetchBySourceIds(selectedIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subSources: any) => {
          this.subSources = subSources;
          this.filteredSubSources = this.subSources;
          this.filteredSubSources = this.sortSubSources(this.subSources);
          const stateSubSources = this.subSources.filter((source: any) =>
            this.subSourceIds.includes(source.leadSubSourceId)
          );

          console.log(stateSubSources);
          const selectedNames = stateSubSources
            .map((source: any) => source.name)
            .join(', ');
          this.subSourceControl.patchValue(selectedNames);
          //  this.selectedSubSourcesIds=this.subSourceIds;
          // this.getDashBoardLeadsDetailsV1();
        },
      });
  }
  patchStateSubSourcesBySourceIdsOne(selectedIds: number[]): void {
    console.log(selectedIds);
    this.leadSubSourceService
      .fetchBySourceIds(selectedIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subSources: any) => {
          this.subSources = subSources;
          this.filteredSubSources = this.subSources;
          this.filteredSubSources = this.sortSubSources(this.subSources);
          const stateSubSources = this.subSources.filter((source: any) =>
            this.selectedSubSourcesIds.includes(source.leadSubSourceId)
          );
          // alert(this.selectedSubSourcesIds + 'patch');

          console.log(stateSubSources);
          const selectedNames = stateSubSources
            .map((source: any) => source.name)
            .join(', ');
          this.subSourceControl.patchValue(selectedNames);
          //  this.selectedSubSourcesIds=this.subSourceIds;
          this.getDashBoardLeadsDetailsV1();
        },
      });
  }

  private fetchFilterDays() {
    this.commonService.getRefDetailsByType(this.daysType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        const excludeStrings = [
          'Tomorrow',
          'Next 7 Days',
          'Next 30 Days',
          'Day After',
        ]; // Add any strings you want to exclude
        this.days = response.filter((day) => {
          return !excludeStrings.includes(day.commonRefValue); // Replace with your actual property
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
    } else if (state.dateRange > 0) {
      this.dateRange = state.dateRange;
      this.selectedDay = this.days.find(
        (day) => day.commonRefKey == this.dateRange
      );
    } else {
      this.dateRange = 0;
      this.selectedDay = this.days.find((day) => day.commonRefKey === '0');
    }
  }

  private loadUserAndFetchLeads() {
    const user = localStorage.getItem('user');

    if (user) {
      this.user = JSON.parse(user);

      if (
        this.user.roleName.toLocaleLowerCase().includes('channel') ||
        this.user.roleName.toLocaleLowerCase().includes('cp')
      ) {
        this.isChannelPartner = true;
      }
    }
    this.getAllLeadStatus();
  }

  private getAllLeadStatus() {
    // this.user.roleName.toLocaleLowerCase().includes('presale') ||
    // this.user.roleName.toLocaleLowerCase().includes('sales head')
    //   ? this.moduleNames.push('P,PS')
    //   :
    this.moduleNames.push('S');

    const refType = 'Lead_Status';

    this.commonRefDetailService
      .fetchLeadStatusListByRole(refType, this.moduleNames)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (!Array.isArray(response)) {
            console.error('Error: response is not an array');
            return;
          }

          this.statusIds = [];
          this.leadStatusIds = [];

          this.leadStatus = response.filter((status: any) => {
            if (['SVD', 'RVD'].includes(status.commonRefKey?.toUpperCase())) {
              console.log('Matched:', status.commonRefKey);
              this.statusIds.push(status.id);
              this.leadStatusIds.push(status.id);
              return true;
            }
            return false;
          });
          // alert(history.state.statusIds);
          // alert(typeof history.state.statusIds);
          if (history.state.statusIds !== undefined) {
            // const exists = this.leadStatus.find(
            //   (item) => item.id === history.state.statusIds[0]
            // );
            // this.selectedStatus = exists;
            this.statusIds = history.state.statusIds;
            if (history.state.statusIds.length > 1) {
              this.selectedStatus = 'all';
            } else {
              this.selectedStatus = history.state.statusIds;
            }
          }
          this.getDashBoardLeadsDetailsV1();
        },
        error: (error: any) => {
          console.error(error);
        },
      });
  }

  // async getDashBoardLeadsDetails() {
  //   await this.getWalkInSourceId();
  //   this.leadService
  //     .getDashBoardLeadsDetails(
  //       this.userId,
  //       this.user.roleId,
  //       this.pageIndex,
  //       this.pageSize,
  //       this.isMenuLeads,
  //       this.dateRange,
  //       this.customStartDate,
  //       this.customEndDate,
  //       this.projectId,
  //       this.sourceId,
  //       '',
  //       this.ncStatusId ? this.ncStatusId : this.statusId,
  //       this.preSalesId,
  //       this.salesId,
  //       this.phoneNumber,
  //       this.userName,
  //       '',
  //       this.opportunityId
  //     )
  //     .subscribe({
  //       next: (response) => {
  //         this.leads = response.records;
  //         this.totalItems = response.totalRecords;
  //         this.dataSource = new MatTableDataSource(this.leads);
  //       },
  //       error: (error) => {
  //         console.error(error);
  //       },
  //     });
  // }

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
    6;
    this.getDashBoardLeadsDetailsV1();
  }

  // onSearch(phoneNumber: any) {
  //   this.phoneNumber = phoneNumber;
  //   this.pageIndex = 0;
  //   this.paginator.firstPage();
  //   this.getDashBoardLeadsDetails();
  // }

  onStatusSelectionChange(event: any) {
    this.isExportExcel = false;
    // this.paginator.firstPage();
    if (event.value === 'all') {
      this.statusIds = this.leadStatusIds;
    } else {
      this.statusIds = [];
      this.statusIds = event.value;
    }
    this.getDashBoardLeadsDetailsV1();
  }

  // updateLead(leadId: number) {
  //   this.fetchLead(leadId);
  // }

  fetchLead(leadId: number) {
    this.leadService.fetchLead(leadId).subscribe({
      next: (response) => {
        this.lead = response;
        const route = this.isSalesTeam
          ? '/layout/sales/savelead/ST'
          : '/layout/presales/savelead/PST';
        this.router.navigate([route], { state: { lead: response } });
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
          isFromWalkIn: true,
          dateRange: this.dateRange,
          customStartDate: this.customStartDate,
          customEndDate: this.customEndDate,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          projectId: this.projectId,
          sourceIds: this.sourceIds,
          selectedSubSourcesIds: this.selectedSubSourcesIds,
          preSalesId: this.preSalesId,
          statusId: this.statusIds,
          phoneNumber: this.phoneNumber,
          opportunityId: this.opportunityId,
          custName: this.userName,
          expried:this.isExpried
        },
      });
    }
  }

  handleScheduleVisits(leadId: any) {
    this.router.navigate(['layout/presales/schedule/visit'], {
      state: { leadId },
    });
  }

  onLeadRowClick(leadId: number) {
    this.isView = false;
    this.handleFollowups(leadId);
  }

  handleDaySelection(commonRefObject: CommonReferenceDetails | null) {
    this.isExportExcel = false;
    // If "All" option is selected
    if (!commonRefObject) {
      this.dateRange = 999;
      // this.isMenuLeads = true;
      this.customStartDate = null;
      this.customEndDate = null;
      this.formData.patchValue({
        customStartDate: null,
        customEndDate: null,
      });
      this.showDateRangePicker = false;
      this.getDashBoardLeadsDetailsV1(); // Fetch all data
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
        this.getDashBoardLeadsDetailsV1();
        this.showDateRangePicker = false;
      }
    }
  }

  // viewLeadDetails(lead: any) {
  //   this.leadService.fetchLead(lead.id).subscribe({
  //     next: (response) => {
  //       this.lead = response;
  //       const route = '/layout/presales/savelead/PST';
  //       this.router.navigate([route], {
  //         state: { lead: response, isView: this.isView },
  //       });
  //     },
  //     error: (error) => {
  //       console.error(error);
  //     },
  //   });
  // }

  viewLeadHistories(leadId: any) {
    this.leadService.fetchLead(leadId).subscribe({
      next: (response) => {
        this.lead = response;
        const route = '/layout/presales/history';
        this.router.navigate([route], {
          state: {
            leadId: leadId,
            isSalesTeamFollowUs: this.isSalesTeamFollowUs,
            isFromWalkIn: true,
            dateRange: this.dateRange,
            customStartDate: this.customStartDate,
            customEndDate: this.customEndDate,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            projectId: this.projectId,
            sourceIds: this.sourceIds,
            subSourceIds: this.selectedSubSourcesIds,
            preSalesId: this.preSalesId,
            statusId: this.statusIds,
            phoneNumber: this.phoneNumber,
            opportunityId: this.opportunityId,
            custName: this.userName,
            expried:this.isExpried
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
    if (user) {
      this.user = JSON.parse(user);
      this.userId = this.user.userId;
      this.roleName = this.user.roleName;
      this.UserRoleName = this.user.roleName
        ? this.user.roleName.toLowerCase()
        : undefined;
    }
  }

  // updateDisplayedColumns() {
  //   // Add the assignedTo column only for sales manager and presales manager
  //   if (
  //     this.isRole([
  //       'sales manager',
  //       'presales manager',
  //       'channel partner',
  //       'cp approval',
  //     ])
  //   ) {
  //     this.displayedColumns.splice(2, 0, 'assignedTo'); // Insert at the correct position
  //   }
  //   if (this.isRole(['channel partner', 'cp approval'])) {
  //     this.displayedColumns.splice(4, 0, 'mobileNumber');
  //   }
  // }

  // isRole(roles: string[]): boolean {
  //   if (!this.UserRoleName) {
  //     console.log('UserRoleName is undefined'); // Log for debugging
  //     return false;
  //   }
  //   return roles.some((role) => this.UserRoleName === role.toLowerCase());
  // }

  getAllUserNames() {
    let status: any;
    const roleName: string[] = []; // Declare roleName as an array of strings
    roleName.push('presales member');
    roleName.push('sales member');
    this.userService
      .fetchUsersByRolesAndOrganization(roleName, this.user.organizationId)
      .subscribe({
        next: (userDetails) => {
          this.userDetails = userDetails;
        },
        error: (error) => {
          console.error('Error fetching UserDetails by role:', error);
        },
      });
  }
  onUsernameSelectionChange(event: any) {
    this.isExportExcel = false;
    if (this.roleName.toLowerCase().includes('presales manager')) {
      this.preSalesId = event;
      if (this.preSalesId === 'all') {
        this.preSalesId = '';
      }
    } else if (this.roleName.toLowerCase().includes('sales manager')) {
      this.salesId = event;
      if (this.salesId === 'all') {
        this.salesId = '';
      }
    }

    this.getDashBoardLeadsDetailsV1();
  }

  goBack() {
    const stateData = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.customStartDate,
      customEndDate: this.customEndDate,
      cpUserId: this.cpUserId,
    };
    this.router.navigate(['layout/presales/cp/dashboard'], {
      state: stateData,
    });
  }
  onSearchOpportunityId(opportunityId: string) {
    this.isExportExcel = false;
    this.paginator.firstPage();
    this.opportunityId = opportunityId;
    if (this.opportunityId.length === 0) {
      this.getDashBoardLeadsDetailsV1();
    }
  }

  onClickOpportunityIdSearchButton() {
    this.isExportExcel = false;
    if (this.opportunityId.length > 0) {
      this.getDashBoardLeadsDetailsV1();
    }
  }

  onSearch(phoneNumber: any) {
    this.isExportExcel = false;
    this.phoneNumber = phoneNumber;
    // this.pageIndex = 0;
    // this.paginator.firstPage();
    // }
    if (this.phoneNumber.length === 0) {
      this.getDashBoardLeadsDetailsV1();
    }
  }

  onSearchUserName(userName: any) {
    //this.pageIndex = 0;
    this.isExportExcel = false;
    this.paginator.firstPage();
    this.userName = userName;
    if (this.userName.length === 0) {
      this.getDashBoardLeadsDetailsV1();
    }
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
     // this.getDashBoardLeadsDetailsV1();
    }
  }
  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : 'All';
  }

 

  getDashBoardLeadsDetailsV1() {
    // alert(this.selectedSubSourcesIds);
    this.showLoading();
    var leadType = '';
    // alert(this.sourceId + ' API');
    this.leadService
      .getDashBoardLeadsDetailsV1(
        this.userId,
        this.user.roleId,
        '',
        this.pageIndex,
        this.pageSize,
        // history.state.pageIndex === undefined
        //   ? this.pageIndex
        //   : history.state.pageIndex,
        // history.state.pageSize === undefined
        //   ? this.pageSize
        //   : history.state.pageSize,
        this.isMenuLeads,
        this.dateRange,
        this.customStartDate,
        this.customEndDate,
        this.projectId,
        this.sourceIds,
        this.selectedSubSourcesIds,
        this.statusIds,
        this.preSalesId,
        this.salesId,
        this.phoneNumber,
        this.userName,
        leadType,
        this.opportunityId,
        '',
        '',
        this.isExportExcel,
        this.isExpried
      )
      .subscribe({
        next: (response) => {
          if (this.isExportExcel) {
            this.downloadXLSFile(
              response,
              'walk-in Leads ' + Date.now().toString(),
              false
            );
          } else {
            this.leads = response.records;
            this.totalItems = response.totalRecords;
            this.paginator.pageIndex = this.pageIndex;
            this.paginator.pageSize = this.pageSize;
            this.dataSource = new MatTableDataSource(this.leads);
            // if (history.state.pageSize !== undefined) {
            //   this.pageSize = history.state.pageSize;
            // }
            // if (history.state.pageIndex !== undefined) {
            //   this.pageIndex = history.state.pageIndex;
            // }
          }
          this.hideLoading();
        },
        error: (error) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }

  getTypeClass(type: string): string {
    switch (type) {
      case 'Hot':
        return 'hot-class';
      case 'Warm':
        return 'warm-class';
      case 'Cold':
        return 'cold-class';
      default:
        return '';
    }
  }

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

  onMenuClick(event: MouseEvent) {
    console.log('Menu clicked', event);
    // Additional logic can be added here if needed
  }

  toggleAllSelection() {
    this.isExportExcel = false;
    if (this.allSelected?.selected) {
      // alert('all selected');
      this.selectedSubSourcesIds = [];
      this.formData.controls['sourceIds'].patchValue([
        ...this.sources.map((item) => item.leadSourceId),
        0,
      ]);
      this.subSourceIds = [];

      // this.sourceIds = [];
    } else {
      // alert('elseeeeeeeeeeee');
      this.formData.controls['sourceIds'].patchValue([]);
      this.sourceIds = this.formData.value.sourceIds;
    }
    this.sourceIds = this.formData.value.sourceIds;
    // this.sourceIds = this.formData.value.sourceIds;
    // this.updateSubSourceIds();
    this.fetchSubSourcesBySourceIds(this.sourceIds);
  }
  updateSubSourceIds() {
    const selectedSourceIdsSet = new Set(this.sourceIds);

    this.subSourceIds = this.subSourceIds?.filter((subSourceId) =>
      this.subSources.some(
        (sub: ILeadSubSourceDto) =>
          sub.leadSubSourceId === subSourceId &&
          selectedSourceIdsSet.has(sub.leadSourceId)
      )
    );
  }
  previousSelectedIds: number[] = [];
  deselectedIds: number[] = [];
  // tosslePerOne(): void {
  //   alert(this.selectedSubSourcesIds);
  //   // const currentSelectedIds = this.formData.controls['sourceIds'].value;
  //   if (this.allSelected?.selected) {
  //     alert('FIRS IFF');
  //     this.allSelected.deselect();

  //     // return;
  //   }
  //   if (
  //     this.formData.controls['sourceIds'].value.length == this.sources.length
  //   ) {
  //     alert('SECOND IFF');
  //     this.allSelected?.select();
  //   }

  //   this.sourceIds = this.formData.value.sourceIds;
  //   this.updateSubSourceIds();
  //   this.patchStateSubSourcesBySourceIds(this.sourceIds);
  //   this.getDashBoardLeadsDetailsV1();
  // }
  tosslePerOne(): void {
    this.isExportExcel = false;
    this.sourceIds = this.formData.value.sourceIds;
    if (this.allSelected?.selected) {
      // alert('FIRS IFF');
      this.allSelected.deselect();
      // return;
      this.sourceIds = this.formData.value.sourceIds;
    }
    if (
      this.formData.controls['sourceIds'].value.length == this.sources.length
    ) {
      // alert('SECOND IFF');
      this.allSelected?.select();
      this.sourceIds = [];
    }
    // this.sourceIds = this.formData.value.sourceIds;
    // this.updateSubSourceIds();
    this.fetchSubSourcesBySourceIds(this.sourceIds);
    // this.getDashBoardLeadsDetailsV1();
  }
  fetchSubSourcesBySourceIds(selectedIds: number[]): void {
    console.log(selectedIds);
    this.leadSubSourceService
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
            this.subSourceIds.includes(source.leadSubSourceId)
          );

          console.log(stateSubSources);
          const selectedNames = stateSubSources
            .map((source: any) => source.name)
            .join(', ');
          this.subSourceControl.patchValue(selectedNames);
          //  this.selectedSubSourcesIds=this.subSourceIds;
          this.getDashBoardLeadsDetailsV1();
        },
      });
  }

  // fetchSubSourcesBySourceIds(selectedIds: number[]): void {
  //   this.leadSubSourceService
  //     .fetchBySourceIds(selectedIds)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (subSources: any) => {
  //         this.subSources = subSources;
  //         this.filteredSubSources = this.subSources;
  //         this.filteredSubSources = this.sortSubSources(this.subSources);
  //         const stateSubSources = this.subSources.filter((source: any) =>
  //           this.subSourceIds.includes(source.leadSubSourceId)
  //         );
  //       },
  //     });

  // }
  sourceSubsourceMap: { [key: number]: number[] } = {};

  sortSubSources(subSources: any[]): any[] {
    return subSources.sort((a, b) => {
      const aSelected = this.selectedSubSourcesIds?.includes(a.leadSubSourceId);
      const bSelected = this.selectedSubSourcesIds?.includes(b.leadSubSourceId);

      // Place selected items first, then unselected items
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
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

  onSelectionSubSourceChange(subSource: any, event: any) {
    this.isExportExcel = false;
    const selectedSubSourceId = subSource.leadSubSourceId;
    // Get the sub-source ID
    const sourceId = subSource.sourceId; // Get the corresponding source ID
    if (event.checked) {
      if (this.sourceSubsourceMap[sourceId]) {
        this.sourceSubsourceMap[sourceId]?.push(selectedSubSourceId);
      }
      this.selectedSubSourcesIds?.push(selectedSubSourceId);
      // Add to selected IDs
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

    // Additional processing
    this.filteredSubSources = this.sortSubSources(this.filteredSubSources);

    this.paginator.firstPage();
    this.subSourceIds = this.selectedSubSourcesIds;
    // Trigger any additional updates or API calls

    this.getDashBoardLeadsDetailsV1();
  }

  isSelected(subSourceId: number): boolean {
    return this.selectedSubSourcesIds?.includes(subSourceId);
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

  generateLeadsReport() {
    this.isExportExcel = true;
    this.getDashBoardLeadsDetailsV1();
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
    this.isExportExcel = false;
    if (this.userName.length > 0) {
      this.getDashBoardLeadsDetailsV1();
    }
  }
  onClickSearchButton() {
    this.isExportExcel = false;
    if (this.phoneNumber.length > 0) {
      this.getDashBoardLeadsDetailsV1();
    }
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
    this.getDashBoardLeadsDetailsV1()
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
        onToggle(event: any) {
    const currentToggleState = event.checked;
    if(currentToggleState){
     this.isExpried=''
    }
    else{
      this.isExpried='N'
    }
    this.isExportExcel=false
    this.getDashBoardLeadsDetailsV1()
  }
}
