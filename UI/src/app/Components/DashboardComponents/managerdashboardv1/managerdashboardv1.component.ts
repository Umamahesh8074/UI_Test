import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationEnd, Router } from '@angular/router';
import { ChartComponent } from 'chart.js';
import { ApexOptions } from 'ng-apexcharts';
import { filter, Subject, takeUntil } from 'rxjs';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { MapDto, TeamDashBoardDataDto } from 'src/app/Models/Presales/lead';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import {
  ILeadSubSourceDto,
  LeadSubSource,
} from 'src/app/Models/Presales/leadsubsource';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { Login } from 'src/app/Models/User/Login';
import { User } from 'src/app/Models/User/User';
import { UserDto } from 'src/app/Models/User/UserDto';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LeadsCommonService } from 'src/app/Services/CommanService/leads-common.service';
import { StateServiceService } from 'src/app/Services/CommanService/state-service.service';
import { LeadbudgetService } from 'src/app/Services/LeadBugetService/leadbudget.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { LeadSubsourceService } from 'src/app/Services/Presales/LeadSubSource/lead-subsource.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-managerdashboardv1',
  templateUrl: './managerdashboardv1.component.html',
  styleUrls: ['./managerdashboardv1.component.css'],
})
export class Managerdashboardv1Component {
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<any>;
  leadsData: MapDto[] = [];
  assignedTo?: number;
  user: User = new User();
  leadFollowUpTotal: number = 0;
  pageSizeOptions = pageSizeOptions;
  totalLeads: number = 0;
  newLeads: number = 0;
  dashboardnewLeads: number = 0;
  scheduledVisits: number = 0;
  followups: number = 0;
  dashboardFollowups: number = 0;
  siteVisitDoneCount: number = 0;
  closedLeads: number = 0;
  lostLeads: number = 0;
  nonContactableLeadsCount: number = 0;
  siteVisitProspectFollowups: number = 0;
  totalBookedLeadsCount: number = 0;
  bookedCount: number = 0;
  private destroy$ = new Subject<void>();
  today: any;
  daysType: string = 'Filter_Days';
  followupStatusType: string = 'Lead_Status';
  moduleNames: string[] = [];
  revisitDoneStatusId: number = 0;
  days: CommonReferenceDetails[] = [];
  dateRange: any = 0;
  statusId: number = 0;
  userRole: string = '';
  //  chart: Chart | any;
  projectName: string = '';
  projects: Project[] = [];
  displayedColumns: string[] = [
    'userName',
    'newLeads',
    'noOfFollowups',
    'noOfSiteVisitDone',
    'booked',
  ];
  isUserManager: boolean = false;
  User: any = new FormControl([] as UserDto[]);
  userName: string = '';
  showDateRangePicker = false;
  formData!: FormGroup;
  startDate: any;
  endDate: any;
  Mainuser: User = new User();
  // displayedLeadBudgetColumns: string[] = [
  //   'sourceName',
  //   'subSourceName',
  //   'totalAmonut',
  //   'leadCount',
  //   'CPL',
  //   'bookedLeadCount',
  //   'CPB',
  //   'siteVisitDoneLeadCount',
  //   'CPV',
  // ];
  teamData: TeamDashBoardDataDto[] = [];
  filteredData: MatTableDataSource<TeamDashBoardDataDto> =
    new MatTableDataSource<TeamDashBoardDataDto>();
  organizationId: number = 0;

  leadBudgetSpend: any = [];
  leadBudget: any;
  leadBudgetdateRangeForm!: FormGroup;
  nonContactableStatusId: any;
  nonContactableCount: number = 0;
  projectId: any = [];
  project: any = new FormControl([] as IProject[]);
  bookedCancelledCount: number = 0;
  //addded
  UserDetails: UserDto[] = [];
  followupIds: any[] = [];
  nonContactableId: number = 0;
  visitProspectId: number = 0;
  siteVisitDoneId: number = 0;
  bookedId: number = 0;
  bookedCancelledId: number = 0;
  userId: number = 0;
  //added
  public login: Login = new Login('', '');
  treeData: any;
  expandedNodes = new Set<string>();
  activeNodes = new Set<string>();
  selectedDay: any;
  newLeadId: any;
  lostId: number = 0;
  lostCount: number = 0;
  revisitProposedId = 0;
  isManagerDashBoard: boolean = true;
  eoiReceivedStatus: any;
  eoiReceivedId: any;
  followupId: number = 0;
  followupCount: number = 0;
  dashboard: string = 'yes';

  currentFollowups = 0;
  currentSiteVisitDoneCount = 0;
  currentSiteVisitProspectFollowups = 0;
  currentNonContactableCount = 0;
  currentBookedCount = 0;
  currentBookedCancelledCount = 0;
  currentDashboardTotalLeads = 0;
  currentNewLeads = 0;
  currentUnassignedLeads = 0;
  currentDashboardFollowups = 0;
  currentFollowupIds: number[] = [];
  currentLost: number = 0;
  currentReVisitProposed: number = 0;
  currentReVisitProposedId: number = 0;
  currentSitevisitId: number = 0;
  currentSitevisitconfirmId = 0;
  currentEoiReceivedStatus: number = 0;
  siteVisitConfirmId = 0;
  currentSiteVisitConfirm = 0;
  currentJunk = 0;
  junkId = 0;
  currentQualified = 0;
  qualifiedId = 0;
  currentrevisitDoneCount = 0;
  reVisitDoneId = 0;
  panel1Expanded = true; //First accordion expanded by default
  panel2Expanded = false;
  digitalPartnerName = '';
  ncStatusId: number = 0;
  siteVisitProspectId: number[] = [];
  followUpId: number = 0;
  followUpCount: number = 0;
  sourceSubsourceMap: { [key: number]: number[] } = {};
  sourceIds: number[] = [];
  subSourceIds: number[] = [];
  source: any = new FormControl([] as LeadSource[]);
  selectedSubSourcesIds: number[] = [];
  filteredSubSources: LeadSubSource[] = [];
  subSourceId: any = '';
  subSources: any = [];
  sources: LeadSource[] = [];
  filteredSources: LeadSource[] = [];
  sourceId: number = 0;
  subSourceControl = new FormControl([]);
  memberActivityColumns: string[] = [
    'userName',
    'assignedCount',
    'followUpsCount',
  ];
  presaleMemberReport: any = [];
  saleMemberReport: any = [];
  @ViewChild('allSelected') private allSelected?: MatOption;
  revisitDoneCount: any;
  selectedprojectIds: any;
  @ViewChild('allProjectSelected') private allProjectSelected?: any;
  salesLostCount: any = 0;
  salesLostId: any = 0;
  salesNonContactable: any = 0;
  salesNonContactableId: any = 0;
  salesJunkCount = 0;
  salesJunkId = 0;
  salesDNDcount = 0
  salesDNDId = 0
  salesFollowupCount = 0
  salesFollwupId = 0;
  currentSalesLostCount: any = 0;
  currentSalesNonContactable: any = 0;
  currentSalesJunkCount = 0;
  currentSalesDNDcount = 0
  currentSalesFollowupCount = 0
  isExpried:any='N'
  constructor(
    private router: Router,
    private leadService: LeadService,
    private commonService: CommanService,
    private formBuilder: FormBuilder,
    private stateService: StateServiceService,
    private leadBudgetService: LeadbudgetService,
    private authService: AuthService,
    private userService: UserService,
    private leadSubSource: LeadSubsourceService,
    private projectService: ProjectService,
    private leadCommonService: LeadsCommonService
  ) {}
  ngOnInit() {
    this.subSourceIds = history.state.selectedSubSourcesIds;
    const user = localStorage.getItem('user');
    const MainUser = localStorage.getItem('Mainuser');
    if (user) {
      this.user = JSON.parse(user);
      this.userRole = this.user.roleName;
      this.organizationId = this.user.organizationId;
    }
    this.fetchLeadSources();
    this.initForm();
    this.panel1Expanded =
      history.state.panel1Expanded == undefined
        ? this.panel1Expanded
        : history.state.panel1Expanded;
    this.panel2Expanded =
      history.state.panel2Expanded == undefined
        ? this.panel2Expanded
        : history.state.panel2Expanded;
    this.sourceIds = history.state.sourceIds || [];
    this.subSourceIds = history.state.subSourceIds || [];
    this.selectedSubSourcesIds = history.state.subSourceIds || [];
    this.projectId=history.state.projectId||[]
    if(this.projectId?.length>0){
     this.patchStateProjectIds(this.projectId)
    }
    if (this.sourceIds?.length > 0) {
      this.formData.patchValue({ sourceIds: this.sourceIds });
      this.patchStateSubSourcesBySourceIds(this.sourceIds);
    }
    this.fetchFilterDays();
    this.initLeadBudgetDateRange();
    this.fetchProjects();
    this.today = new Date().toDateString();
    this.isUserManager = this.userRole.toLocaleLowerCase().includes('manager')
      ? true
      : false;
    this.organizationId = this.user.organizationId;
    //this.fetchLeadsData(this.user.userId);
    this.getProjectReport();
    // this.fetchLeadsDashboardCount();
    this.fetchTotalLeadsCount();
    this.userRole.toLocaleLowerCase().includes('sales')
      ? this.moduleNames.push('S,PS')
      : this.moduleNames.push('P,PS');

    if (MainUser) {
      this.Mainuser = JSON.parse(MainUser);
      this.fetchUser();
    }
    this.isExpried=history.state.expried!=undefined?history.state.expried:this.isExpried
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    // if (this.chart) {
    //   this.chart.destroy();
    // }
  }

  fetchUser() {
    this.userService
      .getUserByManagerId(this.Mainuser.userId, this.userName)
      .subscribe({
        next: (UserDetails) => {
          this.UserDetails = UserDetails;
        },
        error: (error) => {
          console.error('Error fetching UserDetails:', error);
        },
      });
  }
  navigateTo(table: string) {
    this.router.navigate([`/${table}`]);
  }

  navigateToLeads() {
    const userRoleLower = this.userRole.toLowerCase();
    let route = userRoleLower.includes('presale')
      ? 'layout/presales/leads/PST'
      : 'layout/sales/leads/ST';

    if (userRoleLower === 'sales head') {
      route = 'layout/presales/leads/PST';
    }
    // Define the state object with the necessary properties
    const state = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.startDate,
      customEndDate: this.endDate,
      projectId: this.projectId,
      statusId: '',
      isManagerDashBoard: this.isManagerDashBoard,
      dashboard: this.dashboard,
      panel1Expanded: this.panel1Expanded,
      panel2Expanded: this.panel2Expanded,
      digitalPartner: this.digitalPartnerName,
      sourceIds: this.sourceIds,
      selectedSubSourcesIds: this.selectedSubSourcesIds,
      expried:this.isExpried
    };

    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }
  goToLeads() {
    const userRoleLower = this.userRole.toLowerCase();
    const route = userRoleLower.includes('presale')
      ? 'layout/presales/leads/PST'
      : 'layout/sales/leads/ST';

    // Define the state object with the necessary properties
    const state = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.startDate,
      customEndDate: this.endDate,
      statusId: this.statusId,
    };

    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }

  navigateToFollowups(value?: string, statusId?: any) {
    console.log(statusId);
    const userRoleLower = this.userRole.toLowerCase();
    const route = userRoleLower.includes('presale')
      ? 'layout/presales/dashboard/followups/PST'
      : 'layout/sales/dashboard/followups/ST';
    // let statusIds: any[] = [];
    console.log('Final Status IDs before navigation:', statusId);
    if (statusId.length <= 0) {
      statusId = [0];
    }
    this.router
      .navigate([route], {
        state: {
          dateRange: this.dateRange,
          statusIds: statusId,
          customStartDate: this.startDate,
          customEndDate: this.endDate,
          projectId: this.projectId,
          isFromDashBoard: true,
          isManagerDashBoard: true,
        },
      })
      .catch((err) => {
        console.error('Navigation error:', err);
      });
  }

  // fetchLeadsData(userId: number) {
  //   this.leadService
  //     .getDashBoardCount(
  //       userId,
  //       this.user.roleId,
  //       this.dateRange,
  //       this.startDate,
  //       this.endDate,
  //       this.projectId
  //     )
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (response: MapDto[]) => {
  //         this.leadsData = response;
  //         this.processDashBoardData();
  //       },
  //       error: (error) => console.error(error),
  //     });
  // }

  fetchFilterDays() {
    this.commonService.getRefDetailsByType(this.daysType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        this.days = response.filter((day) => {
          const value = day.commonRefValue.toLowerCase();
          return !value.includes('tomo') && !value.includes('next');
        });
        // this.selectedDay = this.days.find((day) => day.commonRefKey === '0');
        this.patchDateFilterAndFetchData();
      },
      error: (error) => console.error(error),
    });
  }

  patchDateFilterAndFetchData() {
    const dayToFind = history.state.dateRange;
    const startDate = history.state.customStartDate;
    const endDate = history.state.customEndDate;
    this.projectId = history.state.projectId;

    if (this.projectId > 0) {
      this.patchProject();
    }

    this.subSourceIds = history.state.subSourceIds || [];

    // const start
    if (
      startDate !== undefined &&
      endDate !== undefined &&
      startDate !== null &&
      endDate !== null
    ) {
      this.startDate = startDate;
      this.endDate = endDate;
      this.selectedDay = this.days.find((day) => day.commonRefKey === 'Custom');
      this.showDateRangePicker = true;
      this.formData.patchValue({
        customStartDate: this.convertToDateTime(startDate),
        customEndDate: this.convertToDateTime(endDate),
      });
    } else if (dayToFind !== undefined) {
      if (dayToFind === 0) {
        this.selectedDay = this.days.find((day) => day.commonRefKey === '0');
        this.dateRange = dayToFind;
      } else if (dayToFind != 0) {
        this.dateRange = dayToFind;
        this.selectedDay = this.days.find(
          (day) => day.commonRefKey === dayToFind
        );
        console.log(this.selectedDay);
      }
      // alert('Fetching data');
      // this.fetchLeadsDashboardCount();
    } else {
      this.selectedDay = this.days.find((day) => day.commonRefKey === '0');
    }
    this.fetchLeadsDashboardCount();
    this.fetchLeadsCurrentStatusDashboardCount();
    this.getProjectReport();
    if (this.user.roleName == 'presales manager') {
      this.getPresaleMemberReport();
    } else if (this.user.roleName == 'sales manager') {
      this.getSaleMemberReport();
    }
  }
  convertToDateTime(dateString: string): Date {
    // Replace 'T' with a space to create a valid date string
    const formattedString = dateString?.replace('T', ' ').substring(0, 26); // Keep only up to 26 characters for microsecond precision
    return new Date(formattedString);
  }

  handleDaySelection(commonRefObject: CommonReferenceDetails) {
    this.dateRange = commonRefObject.commonRefKey;

    if (commonRefObject.commonRefValue.includes('Custom')) {
      console.log('Custom Date');
      this.showDateRangePicker = true;
      this.dateRange = '';
    } else {
      this.startDate = null;
      this.endDate = null;
      this.formData.patchValue({
        customStartDate: null,
        customEndDate: null,
      });
      // this.fetchLeadsData(this.user.userId);
      this.getProjectReport();
      this.fetchLeadsDashboardCount();
      this.fetchLeadsCurrentStatusDashboardCount();
      this.showDateRangePicker = false;
      this.getProjectReport();
      if (this.user.roleName == 'presales manager') {
        this.getPresaleMemberReport();
      } else if (this.user.roleName == 'sales manager') {
        this.getSaleMemberReport();
      }
    }
  }

  fetchTotalLeadsCount() {
    this.leadService
      .fetchTotalLeadsCount(this.user.userId, this.user.roleId, '')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: MapDto[]) => {
          response.forEach((lead) => {
            const leadStatus = lead.status?.toLowerCase(); // Handle null status
            switch (leadStatus) {
              case 'total':
                this.totalLeads = lead.value;
                break;
              case 'closed':
                this.closedLeads = lead.value;
                break;
              case 'lost':
                this.lostLeads = lead.value;
                break;
              case 'booked':
                this.totalBookedLeadsCount = lead.value;
                break;
              case 'rnr': // If RNR is a valid status
                this.nonContactableLeadsCount = lead.value;
                break;
              default:
                break;
            }
          });
          this.updateChartOptions();
          //  this.createChart();
        },
        error: (error) => console.error(error),
      });
  }

  isAllDataZero(): boolean {
    return (
      this.totalLeads === 0 &&
      this.totalBookedLeadsCount === 0 &&
      this.closedLeads === 0 &&
      this.lostLeads === 0
    );
  }

  getProjectReport() {
    this.followups = 0;
    this.siteVisitDoneCount = 0;
    this.siteVisitProspectFollowups = 0;
    this.nonContactableCount = 0;
    this.bookedCount = 0;
    this.bookedCancelledCount = 0;
    this.newLeads = 0;
    this.leadService
      .getProjectTeamReport(
        this.user.userId,
        this.user.roleId,
        this.dateRange ? this.dateRange : 0,
        this.startDate,
        this.endDate,
        this.projectId,
        '',
        '',
        '',
        '',
        '',
        this.isExpried
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.treeData = resp;

          // if (
          //   Array.isArray(resp) &&
          //   resp.length > 0 &&
          //   resp[0].name === 'PreSales'
          // ) {
          // if (resp[0].followUp > 0) {
          //   this.followups += resp[0].followUp;
          //   this.followupIds.push(resp[0].followUpId);
          // }
          // if (resp[0].qualified > 0) {
          //   this.followups += resp[0].qualified;
          //   this.followupIds.push(resp[0].qualifiedId);
          // }
          // if (resp[0].junk > 0) {
          //   this.followups += resp[0].junk;
          //   this.followupIds.push(resp[0].junkId);
          // }
          // if (resp[0].lost > 0) {
          //   this.followups += resp[0].lost;
          //   this.followupIds.push(resp[0].lostId);
          // }
          // if (resp[0].reVisitProposed > 0) {
          //   this.followups += resp[0].reVisitProposed;
          //   this.followupIds.push(resp[0].reVisitProposedId);
          // }
          // if (resp[0].siteVisitConfirm > 0) {
          //   this.followups += resp[0].siteVisitConfirm;
          //   this.followupIds.push(resp[0].siteVisitConfirmId);
          // }
          // this.newLeads = resp[0].assignedLeads;
          // this.siteVisitDoneCount += resp[0].siteVisitDone;
          // this.nonContactableCount += resp[0].nonContactable;
          // this.bookedCount = resp[0].booked;
          // this.siteVisitProspectFollowups = resp[0].visitProspect;
          // this.bookedCancelledCount = resp[0].cancelledBookings;
          // this.bookedId = resp[0].bookedId;
          // this.visitProspectId = resp[0].visitProspectId;
          // this.bookedCancelledId = resp[0].cancelledBookingsId;
          // this.siteVisitDoneId = [resp[0].siteVisitDoneId];
          // } else if (
          //   Array.isArray(resp) &&
          //   resp.length > 0 &&
          //   resp[0].name === 'Sales'
          // ) {
          //   if (resp[0].followUp > 0) {
          //     this.followups += resp[0].followUp;
          //     this.followupIds.push(resp[0].followUpId);
          //   }
          // if (resp[0].qualified > 0) {
          //   this.followups += resp[0].qualified;
          //   this.followupIds.push(resp[0].qualifiedId);
          // }
          // if (resp[0].junk > 0) {
          //   this.followups += resp[0].junk;
          //   this.followupIds.push(resp[0].junkId);
          // }
          // if (resp[0].lost > 0) {
          //   this.followups += resp[0].lost;
          //   this.followupIds.push(resp[0].lostId);
          // }
          // if (resp[0].reVisitProposed > 0) {
          //   this.followups += resp[0].reVisitProposed;
          //   this.followupIds.push(resp[0].reVisitProposedId);
          // }
          // if (resp[0].siteVisitConfirm > 0) {
          //   this.followups += resp[0].siteVisitConfirm;
          //   this.followupIds.push(resp[0].siteVisitConfirmId);
          // }
          // this.newLeads = resp[0].assignedLeads;
          // this.siteVisitDoneCount += resp[0].siteVisitDone;
          // this.nonContactableCount += resp[0].nonContactable;
          // this.bookedCount = resp[0].booked;
          // this.siteVisitProspectFollowups = resp[0].visitProspect;
          // this.bookedCancelledCount = resp[0].cancelledBookings;
          // this.bookedId = resp[0].bookedId;
          // this.visitProspectId = resp[0].visitProspectId;
          // this.bookedCancelledId = resp[0].cancelledBookingsId;
          // this.siteVisitDoneId = [resp[0].siteVisitDoneId];
          // }
        },
        error: (err) => {},
      });
  }

  applyFilter(event: Event, column: string): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.filteredData.filterPredicate = (
      data: TeamDashBoardDataDto,
      filter: string
    ) => {
      const value = data[column as keyof TeamDashBoardDataDto]
        ?.toString()
        .toLowerCase();
      return value.includes(filter);
    };
    this.filteredData.filter = filterValue;
  }

  onRowClick(row: TeamDashBoardDataDto): void {
    console.log('enterd...');

    const userRoleLower = this.userRole.toLowerCase();
    const route = userRoleLower.includes('presale')
      ? 'layout/presales/leads/PST'
      : 'layout/sales/leads/ST';

    // Define the query parameters with the necessary properties
    const queryParams = {
      userId: row.userId,
      userName: row.userName,
      dateRange: this.dateRange,
    };
    // Navigate to the desired route with the query parameters
    this.router.navigate([route], { queryParams });
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
          this.startDate = startDate;
          this.endDate = endDate;
          // this.fetchLeadsData(this.user.userId);
          this.getProjectReport();
          this.fetchLeadsDashboardCount();
          this.fetchLeadsCurrentStatusDashboardCount();
          this.getProjectReport();
          if (this.user.roleName == 'presales manager') {
            this.getPresaleMemberReport();
          } else if (this.user.roleName == 'sales manager') {
            this.getSaleMemberReport();
          }
        }
      });
  }

  formatDateTime(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }

  getLeadBugdetSpent(startDate: any, endDate: any) {
    this.leadBudgetService
      .getAllBudgetSpent(startDate, endDate, this.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log(response);
          const leadBudgetSpend = response;
          if (leadBudgetSpend.length > 0) {
            // Removed parentheses
            console.log(leadBudgetSpend[leadBudgetSpend.length - 1]); // Accessing the last element
            this.leadBudget = leadBudgetSpend[leadBudgetSpend.length - 1];
            leadBudgetSpend.pop();
            this.leadBudgetSpend = leadBudgetSpend;
          }
        },
        error: (error) => console.error(error),
      });
  }

  initLeadBudgetDateRange() {
    this.leadBudgetdateRangeForm = this.formBuilder.group({
      leadBudgetCustomStartDate: null,
      leadBudgetCustomEndDate: null,
    });
    this.leadBudgetdateRangeForm.valueChanges.subscribe((formData) => {
      this.onLeadBudgetDateRangeChange(formData);
    });
  }

  onLeadBudgetDateRangeChange(formDataValue: any) {
    console.log(formDataValue);
    if (
      formDataValue.leadBudgetCustomStartDate &&
      formDataValue.leadBudgetCustomEndDate
    ) {
      const startDate = this.formatDateTime(
        formDataValue.leadBudgetCustomStartDate
      );
      const endDate = this.formatDateTime(
        formDataValue.leadBudgetCustomEndDate,
        true
      );
      this.getLeadBugdetSpent(startDate, endDate);
    }
  }

  searchProject(event: any) {
    if (event.target.value.length >= 3) {
      console.log(event.target.value);
      this.projectName = event.target.value;
      this.fetchProjects();
    } else if (event.target.value.length === 0) {
      this.projectName = '';
      this.projectId = 0;
      this.fetchProjects();
      // this.fetchLeadsDashboardCount();
      // this.fetchLeadsCurrentStatusDashboardCount();
      // this.getProjectReport();
      // if (this.user.roleName == 'presales manager') {
      //   this.getPresaleMemberReport();
      // } else if (this.user.roleName == 'sales manager') {
      //   this.getSaleMemberReport();
      // }
    }
  }

  // fetchProjects() {
  //   this.leadService
  //     .fetchProjects(this.projectName, this.user.organizationId)
  //     .subscribe({
  //       next: (projects) => {
  //         this.projects = projects;
  //       },
  //       error: (error) => {
  //         console.error('Error fetching projects:', error);
  //       },
  //     });
  // }
  // fetchProjects() {
  //   this.projectService
  //     .getAllProjects(this.projectName, 0, 100, 'Y', this.user.organizationId)
  //     .subscribe({
  //       next: (projects) => {
  //         this.projects = projects.records;
  //         // alert(this.projectId);
  //       },
  //       error: (error) => {
  //         console.error('Error fetching projects:', error);
  //       },
  //     });
  // }

  patchProject() {
    this.projectService
      .getAllProjects(this.projectName, 0, 100, 'Y', this.user.organizationId)
      .subscribe({
        next: (projects) => {
          this.projects = projects.records;
          if (this.projectId > 0) {
            this.project.patchValue(
              this.projects.find(
                (project: any) => this.projectId === project.projectId
              )
            );
          }
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  // onProjectSelect(event: any) {
  //   console.log(event.option.value);
  //   this.projectId = event?.option.value?.projectId;
  //   this.formData.patchValue({ projectId: this.projectId });
  //   // this.fetchLeadsData(this.user.userId);

  //   //  this.getProjectReport();
  //   this.fetchLeadsDashboardCount();
  //   this.fetchLeadsCurrentStatusDashboardCount();
  //   this.getProjectReport();
  //   if (this.user.roleName == 'presales manager') {
  //     this.getPresaleMemberReport();
  //   } else if (this.user.roleName == 'sales manager') {
  //     this.getSaleMemberReport();
  //   }
  // }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : 'All';
  }

  // processDashBoardData() {
  //   this.totalLeads = 0;
  //   this.newLeads = 0;
  //   this.scheduledVisits = 0;
  //   this.followups = 0;
  //   this.siteVisitDoneCount = 0;
  //   this.closedLeads = 0;
  //   this.lostLeads = 0;
  //   this.nonContactableLeadsCount = 0;
  //   this.siteVisitProspectFollowups = 0;
  //   this.bookedCount = 0;

  //   this.leadsData.forEach((data) => {
  //     switch (data.status) {
  //       case 'Assigned Leads':
  //         this.newLeads = data.value;
  //         break;

  //       case 'Cancelled Booking':
  //         this.bookedCancelledCount = data.value;
  //         this.bookedCancelledId = data.statusId;
  //         break;
  //       case 'Booked':
  //         this.bookedCount = data.value;
  //         this.bookedId = data.statusId;
  //         break;
  //       case 'Qualified':
  //       case 'Follow-up':
  //       case 'Site Visit Confirm':
  //       case 'Lost':
  //       case 'Junk':
  //         this.followups += data.value;

  //         // Check if the statusId is already present in followupIds
  //         if (!this.followupIds.includes(data.statusId)) {
  //           this.followupIds.push(data.statusId);
  //         }

  //         break;
  //       case 'Non-Contactable':
  //         console.log('non contable ', data.value);
  //         this.nonContactableLeadsCount = data.value;
  //         this.nonContactableId = data.statusId;
  //         console.log('non contable ', this.nonContactableId);

  //         break;
  //       case 'Site Visit Done':
  //       case 'Revisit Done':
  //         this.siteVisitDoneCount = data.value;
  //         this.siteVisitDoneId = data.statusId;
  //         break;
  //       case 'Closed':
  //         this.closedLeads = data.value;
  //         break;
  //       case 'Lost':
  //         this.lostLeads = data.value;
  //         break;
  //       case 'Visit Prospect':
  //         this.siteVisitProspectFollowups = data.value;
  //         this.visitProspectId = data.statusId;
  //         break;
  //       default:
  //         console.warn('Unknown status:');
  //     }
  //   });
  // }
  displayUser(user: User): string {
    return user && user.userName ? user.userName : '';
  }
  searchUser(event: any) {
    if (event.target.value.length >= 3 || event.target.value.length == 0) {
      console.log(event.target.value);
      this.userName = event.target.value;
      this.fetchUser();
    }
  }
  // fetchUser() {
  //   this.userService.getUserByManagerId(this.Mainuser.userId).subscribe({
  //     next: (UserDetails) => {
  //       this.UserDetails = UserDetails;
  //     },
  //     error: (error) => {
  //       console.error('Error fetching UserDetails:', error);
  //     },
  //   });
  // }

  onUserSelect(event: any) {
    console.log(event.option.value);
    this.userId = event.option.value.userId;
    this.login.identifier = event.option.value.email;
    this.login.password = event.option.value.showPassword;
    this.userService.login(this.login).subscribe({
      next: (response) => {
        this.user = response.userDto;
        console.log(this.user);
        this.authService.setUser(JSON.stringify(this.user));
        this.authService.setRole(this.user.roleName);
        this.authService.setAccessToken(response.accessToken);
        this.authService.setRefreshToken(response.token);
        console.log(this.user.homePath);
        this.navigateToDashBoard(this.user.homePath);
      },
      error: (err) => {
        if (err.status === 0) {
          Swal.fire('Failed', 'Failed to connect to server', 'error');
        } else if (err.status === 403 || err.status == 401) {
          Swal.fire('Failed', 'Invalid Credentials', 'error');
        } else {
          Swal.fire('Failed', 'An unexpected error occurred', 'error');
        }
        console.error('Failed to fetch:', err);
      },
    });
  }
  private navigateToDashBoard(homePath: string) {
    this.authService.setDashBoardPath(homePath);
    this.router.navigate(['/layout']).then(() => {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          window.location.reload();
        });
    });
  }

  getUniqueId(node: any, ...indices: number[]): string {
    return `${node.name}-${indices.join('-')}`;
  }

  isActive(id: string): boolean {
    return this.activeNodes.has(id);
  }

  isExpanded(id: string): boolean {
    return this.expandedNodes.has(id);
  }

  toggle(id: string): void {
    if (this.expandedNodes.has(id)) {
      this.expandedNodes.delete(id);
    } else {
      this.expandedNodes.add(id);
    }

    if (this.activeNodes.has(id)) {
      this.activeNodes.delete(id); // Deselect row
    } else {
      this.activeNodes.add(id); // Select new row
    }
  }
  navigateToLeadsForNonContactable() {
    console.log('non contactable');
    this.commonService
      .getRefDetailsId('Lead_Status', 'NC')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.statusId = response;
          // this.navigateToLeads();
          const userRoleLower = this.userRole.toLowerCase();
          let route = userRoleLower.includes('presale')
            ? 'layout/presales/leads/PST'
            : 'layout/sales/leads/ST';

          if (userRoleLower === 'sales head') {
            route = 'layout/presales/leads/PST';
          }
          // Define the state object with the necessary properties
          const state = {
            dateRange: this.dateRange,
            isMenuLeads: false,
            customStartDate: this.startDate,
            customEndDate: this.endDate,
            ncStatusId: this.statusId,
            projectId: this.projectId,
            isManagerDashBoard: true,
          };

          // Set the state in the StateService
          this.stateService.setState('stateData', state);

          // Navigate to the desired route with the state data
          this.router.navigate([route], {
            state: state,
          });
        },
        error: (error) => console.error(error),
      });
  }
  @ViewChild('chart') chart: ChartComponent | undefined;

  public chartOptions: Partial<ApexOptions> = {};
  isShow: boolean = false;
  updateChartOptions() {
    // Define your data points
    const totalLeads = this.totalLeads || 0;
    const bookedLeadsCount = this.totalBookedLeadsCount || 0;
    const closedLeads = this.closedLeads || 0;
    const lostLeads = this.lostLeads || 0;

    // Prepare series data and labels
    const series = [totalLeads, bookedLeadsCount, closedLeads, lostLeads];

    // Prepare labels based on the data points
    const labels = [
      'Total Leads',
      'Booked Leads Count',
      'Closed Leads',
      'Lost Leads',
    ];
    // Set chart options
    this.chartOptions = {
      series: series,
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: labels,
      colors: ['#008080', '#33FF57', '#3357FF', '#FFC300'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              height: 250,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    // Show or hide the chart based on the presence of data
    this.isShow = series.some((value) => value > 0);
  }

  fetchLeadsDashboardCount() {
    this.dashboardFollowups = 0;
    this.siteVisitDoneCount = 0;
    this.siteVisitProspectFollowups = 0;
    this.nonContactableCount = 0;
    this.bookedCount = 0;
    this.bookedCancelledCount = 0;
    this.dashboardnewLeads = 0;
    this.newLeads = 0;
    this.followupCount = 0;
    this.lostCount = 0;
    this.salesJunkCount = 0
    this.salesLostCount = 0;
    this.salesFollowupCount = 0;
    this.salesNonContactable=0
    this.salesDNDcount = 0;
    this.leadService
      .fetchLeadsCurrentStatusDashboardCountNew(
        this.user.userId,
        this.user.roleId,
        '',
        this.dateRange,
        this.startDate,
        this.endDate,
        this.projectId,
        '',
        '',
        '',
        this.sourceIds,
        this.selectedSubSourcesIds,
        this.isExpried
        
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.dashboardnewLeads = resp.assignedLeads;
          this.newLeads = resp.newLeads;
          this.siteVisitDoneCount = resp.siteVisitDone;
          this.nonContactableCount = resp.nonContactable;
          this.bookedCount = resp.booked;
          this.lostCount = resp.lost;
          this.siteVisitProspectFollowups = resp.visitProspect;
          this.bookedCancelledCount = resp.cancelledBookings;
          this.newLeadId = resp.newLeadId;
          this.bookedId = resp.bookedId;
          this.lostId = resp.lostId;
          this.nonContactableId = resp.nonContactableId;
          this.visitProspectId = resp.visitProspectId;
          this.bookedCancelledId = resp.cancelledBookingsId;
          this.siteVisitDoneId = resp.siteVisitDoneId;
          this.eoiReceivedStatus = resp.eoiReceivedStatus;
          this.eoiReceivedId = resp.eoiReceivedId;
          this.reVisitDoneId = resp.reVisitDoneId;
          this.revisitDoneCount = resp.reVisitDone;
          // this.followups = resp.followUp;
          this.dashboardFollowups = resp.siteVisitConfirm;
          this.salesDNDId = resp.salesDNDId;
          this.salesDNDcount = resp.salesDND;
          this.salesNonContactable = resp.salesNoncontactable;
          this.salesNonContactableId = resp.salesNoncontactableId;
          this.salesJunkCount = resp.salesJunk;
          this.salesJunkId = resp.salesJunkId;
          this.salesLostCount = resp.salesLost;
          this.salesLostId = resp.salesLostId;
          this.salesFollowupCount = resp.salesFollowUp;
          this.salesFollwupId = resp.salesFollowUpId;
          if (resp.followUpId) {
            this.followupId = resp.followUpId;
          }
          this.followupCount = resp.followUp;
          if (resp.siteVisitConfirmId) {
            this.followupIds.push(resp.siteVisitConfirmId);
          }
          if (
            resp.reVisitProposedId &&
            !this.userRole.toLocaleLowerCase().includes('presale')
          ) {
            this.followupIds.push(resp.reVisitProposedId);
            this.dashboardFollowups =
              this.dashboardFollowups + resp.reVisitProposed;
          }
        },
        error: (err) => {},
      });
  }

  navigateToLeadsByStatus(statusId: any) {
    const userRoleLower = this.userRole.toLowerCase();
    let route = userRoleLower.includes('presale')
      ? 'layout/presales/leads/PST'
      : 'layout/sales/leads/ST';

    if (userRoleLower === 'sales head') {
      route = 'layout/presales/leads/PST';
    }
    // Define the state object with the necessary properties
    const state = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.startDate,
      customEndDate: this.endDate,
      projectId: this.projectId,
      dashboard: this.dashboard,
      statusId: statusId,
      isManagerDashBoard: true,
      panel1Expanded: this.panel1Expanded,
      panel2Expanded: this.panel2Expanded,
      digitalPartner: this.digitalPartnerName,
      sourceIds: this.sourceIds,
      selectedSubSourcesIds: this.selectedSubSourcesIds,
      expried:this.isExpried
    };

    // alert('Sta ' + statusId + ' ' + typeof statusId);
    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }

  onDateRangeChange(): void {
    const formDataValue = this.formData.value;
    if (formDataValue.customStartDate && formDataValue.customEndDate) {
      const startDate = this.formatDateTime(formDataValue.customStartDate);
      const endDate = this.formatDateTime(formDataValue.customEndDate, true);

      this.startDate = startDate;
      this.endDate = endDate;

      // Replace the alert and call necessary API methods.
      this.fetchLeadsDashboardCount();
      this.fetchLeadsCurrentStatusDashboardCount();
      this.getProjectReport();
      if (this.user.roleName == 'presales manager') {
        this.getPresaleMemberReport();
      } else if (this.user.roleName == 'sales manager') {
        this.getSaleMemberReport();
      }
    }
  }

  navigateToLeadsCurrentStatus() {
    const userRoleLower = this.userRole.toLowerCase();
    let route = userRoleLower.includes('presale')
      ? 'layout/presales/leads/PST'
      : 'layout/sales/leads/ST';

    if (userRoleLower === 'sales head' || userRoleLower.includes('cto')) {
      route = 'layout/presales/leads/PST';
    }

    // Define the state object with the necessary properties
    const state = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.startDate,
      customEndDate: this.endDate,
      projectId: this.projectId,
      // statusId: this.newLeadId,
      currentStatusDashboard: 'Yes',
      isManagerDashBoard: true,
      panel1Expanded: this.panel1Expanded,
      panel2Expanded: this.panel2Expanded,
      digitalPartner: this.digitalPartnerName,
      sourceIds: this.sourceIds,
      selectedSubSourcesIds: this.selectedSubSourcesIds,
      expried:this.isExpried
    };
    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }

  navigateToLeadsByCurrentStatus(statusId: any) {
    const userRoleLower = this.userRole.toLowerCase();
    let route = userRoleLower.includes('presale')
      ? 'layout/presales/leads/PST'
      : 'layout/sales/leads/ST';

    if (userRoleLower === 'sales head') {
      route = 'layout/presales/leads/PST';
    }
    // Define the state object with the necessary properties
    const state = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.startDate,
      customEndDate: this.endDate,
      projectId: this.projectId,
      statusId: Number(statusId),
      currentStatusDashboard: 'Yes',
      isManagerDashBoard: true,
      panel1Expanded: this.panel1Expanded,
      panel2Expanded: this.panel2Expanded,
      digitalPartner: this.digitalPartnerName,
      sourceIds: this.sourceIds,
      selectedSubSourcesIds: this.selectedSubSourcesIds,
      expried:this.isExpried
    };
    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }

  onPanelOpen(panelNumber: number): void {
    if (panelNumber === 1) {
      this.panel1Expanded = true;
      this.panel2Expanded = false;
    } else if (panelNumber === 2) {
      this.panel1Expanded = false;
      this.panel2Expanded = true;
    }
  }
  onPanelClose(panelNumber: number): void {
    if (panelNumber === 1) {
      this.panel1Expanded = false;
      this.panel2Expanded = true; // Automatically open the other panel
    } else if (panelNumber === 2) {
      this.panel1Expanded = true; // Automatically open the other panel
      this.panel2Expanded = false;
    }
  }
  fetchLeadsCurrentStatusDashboardCount() {
    this.leadCommonService.showLoading();
    this.currentFollowups = 0;
    this.currentSiteVisitDoneCount = 0;
    this.currentSiteVisitProspectFollowups = 0;
    this.currentNonContactableCount = 0;
    this.currentBookedCount = 0;
    this.currentBookedCancelledCount = 0;
    this.currentDashboardTotalLeads = 0;
    this.currentNewLeads = 0;
    this.currentUnassignedLeads = 0;
    this.currentDashboardFollowups = 0;
    this.currentLost = 0;
    this.currentSiteVisitDoneCount = 0;
    this.currentEoiReceivedStatus = 0;
    this.currentSiteVisitConfirm = 0;
    this.currentJunk = 0;
    this.currentQualified = 0;
    this.currentrevisitDoneCount = 0;
    this.currentSalesLostCount = 0;
    this.currentSalesNonContactable = 0;
    this.currentSalesJunkCount = 0;
    this.currentSalesDNDcount = 0
    this.currentSalesFollowupCount = 0
    this.leadService
      .fetchLeadsCurrentStatusDashboardCount(
        this.user.userId,
        this.user.roleId,
        this.digitalPartnerName,
        this.dateRange,
        this.startDate,
        this.endDate,
        this.projectId,
        '',
        '',
        '',
        this.sourceIds,
        this.selectedSubSourcesIds,
        this.isExpried
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.leadCommonService.hideLoading();

          this.currentDashboardTotalLeads = resp.assignedLeads;
          this.currentNewLeads = resp.newLeads;
          this.currentReVisitProposed = resp.reVisitProposed;
          this.currentSiteVisitDoneCount = resp.siteVisitDone;
          this.currentNonContactableCount = resp.nonContactable;
          this.currentUnassignedLeads = resp.unassignedLeads;
          //this.currentLost = resp.lost;
          this.lostId = resp.lostId;
          this.currentBookedCount = resp.booked;
          this.currentSiteVisitProspectFollowups = resp.visitProspect;
          this.currentBookedCancelledCount = resp.cancelledBookings;
          this.newLeadId = resp.newLeadId;
          this.bookedId = resp.bookedId;
          this.siteVisitProspectId = resp.visitProspectId;
          this.bookedCancelledId = resp.cancelledBookingsId;
          this.siteVisitDoneId = resp.siteVisitDoneId;
          this.ncStatusId = resp.nonContactableId;
          this.newLeadId = resp.newLeadId;
          this.currentEoiReceivedStatus = resp.eoiReceivedStatus;
          this.eoiReceivedId = resp.eoiReceivedId;
          this.followUpId = resp.followUpId;
          this.currentLost = resp.lost;
          this.currentSiteVisitConfirm = resp.siteVisitConfirm;
          this.siteVisitConfirmId = resp.siteVisitConfirmId;
          this.currentJunk = resp.junk;
          this.junkId = resp.junkId;
          this.currentQualified = resp.qualified;
          this.qualifiedId = resp.qualifiedId;
          this.reVisitDoneId = resp.reVisitDoneId;
          this.currentReVisitProposedId = resp.reVisitProposedId;
          this.currentrevisitDoneCount = resp.reVisitDone;
          this.currentFollowups = resp.followUp;
          this.salesDNDId = resp.salesDNDId;
          this.currentSalesDNDcount = resp.salesDND;
          this.currentSalesNonContactable = resp.salesNoncontactable;
          this.salesNonContactableId = resp.salesNoncontactableId;
          this.currentSalesJunkCount = resp.salesJunk;
          this.salesJunkId = resp.salesJunkId;
          this.currentSalesLostCount = resp.salesLost;
          this.salesLostId = resp.salesLostId;
          this.currentSalesFollowupCount = resp.salesFollowUp;
          this.salesFollwupId = resp.salesFollowUpId;
          //this.currentFollowUpCount=resp.followUp;
        },
        error: (err) => {
          this.leadCommonService.hideLoading();
        },
      });
  }
  selectedSources: LeadSource[] = [];

  onSelectionSourceChange(event: any) {
    console.log(event.value);
    const selectedIds = event.value;
    this.sourceId = selectedIds;
    this.sourceIds = selectedIds;
    // Handle deselection logic by comparing currently selected sources with previously selected ones
    const previouslySelectedSources = Object.keys(this.sourceSubsourceMap).map(
      Number
    );
    const deselectedSourceIds = previouslySelectedSources.filter(
      (sourceId) => !selectedIds.includes(sourceId)
    );
    console.log(deselectedSourceIds);

    // Remove related sub-sources when source is deselected
    deselectedSourceIds.forEach((sourceId) => {
      if (this.sourceSubsourceMap[sourceId]) {
        const subsourceIds = this.sourceSubsourceMap[sourceId];

        // Remove each subSourceId from selectedSubSourcesIds
        subsourceIds.forEach((subSourceId) => {
          this.selectedSubSourcesIds = this.selectedSubSourcesIds?.filter(
            (id) => id !== subSourceId
          );
        });

        // Remove the entry from sourceSubsourceMap
        delete this.sourceSubsourceMap[sourceId];
      }
    });

    console.log(this.selectedSubSourcesIds); // Corrected log statement for selectedSubSourcesIds
    this.subSourceId = this.selectedSubSourcesIds;
    console.log(
      'Updated sourceSubsourceMap after deselection:',
      this.sourceSubsourceMap
    );
    console.log('Updated selectedSubSourcesIds:', this.selectedSubSourcesIds);

    // For newly selected sources, ensure the sourceSubsourceMap is initialized
    selectedIds.forEach((sourceId: number) => {
      // this.sourceId = sourceId; // Set the current sourceId
      // Initialize array if the sourceId doesn't exist in the map
      if (!this.sourceSubsourceMap[sourceId]) {
        this.sourceSubsourceMap[sourceId] = [];
      }
      console.log(
        `Map for sourceId ${sourceId}:`,
        this.sourceSubsourceMap[sourceId]
      );
    });

    // this.paginator.firstPage();
    console.log(selectedIds);
    this.fetchSubSourcesBySourceIds(selectedIds);
    this.sourceIds = selectedIds;
    //this.getDuplicateLeads();
    this.fetchLeadsDashboardCount();
    this.fetchLeadsCurrentStatusDashboardCount();
    this.getProjectReport();
    if (this.user.roleName == 'presales manager') {
      this.getPresaleMemberReport();
    } else if (this.user.roleName == 'sales manager') {
      this.getSaleMemberReport();
    }
  }

  fetchSubSourcesBySourceIds(selectedIds: number[]): void {
    console.log(selectedIds);
    this.leadSubSource
      .fetchBySourceIds(selectedIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subSources: any) => {
          this.subSources = subSources;
          this.filteredSubSources = this.subSources;
          this.filteredSubSources = this.sortSubSources(this.subSources);

          this.selectedSubSourcesIds = this.selectedSubSourcesIds?.filter(
            (id) => {
              console.log(this.filteredSubSources);

              // Check if the id exists in filteredSubSources
              return this.filteredSubSources.some(
                (subSource) => subSource.leadSubSourceId === id
              );
            }
          );
          console.log(this.selectedSubSourcesIds);
          const stateSubSources = this.subSources.filter((source: any) =>
            this.selectedSubSourcesIds.includes(source.leadSubSourceId)
          );
          console.log(stateSubSources);
          const selectedNames = stateSubSources
            .map((source: any) => source.name)
            .join(', ');
          this.subSourceControl.patchValue(selectedNames);

          //  this.patchStateSubSourcesBySourceIds(selectedIds);
        },
      });
  }
  fetchSubSourcesBySourceIdsOne(selectedIds: number[]): void {
    console.log(selectedIds);
    this.leadSubSource
      .fetchBySourceIds(selectedIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subSources: any) => {
          this.subSources = subSources;
          this.filteredSubSources = this.subSources;
          this.filteredSubSources = this.sortSubSources(this.subSources);

          this.selectedSubSourcesIds = this.selectedSubSourcesIds?.filter(
            (id) => {
              console.log(this.filteredSubSources);

              // Check if the id exists in filteredSubSources
              return this.filteredSubSources.some(
                (subSource) => subSource.leadSubSourceId === id
              );
            }
          );
          console.log(this.selectedSubSourcesIds);
          const stateSubSources = this.subSources.filter((source: any) =>
            this.selectedSubSourcesIds.includes(source.leadSubSourceId)
          );
          console.log(stateSubSources);
          const selectedNames = stateSubSources
            .map((source: any) => source.name)
            .join(', ');
          this.subSourceControl.patchValue(selectedNames);
          this.getProjectReport();
          this.fetchLeadsDashboardCount();
          this.fetchLeadsCurrentStatusDashboardCount();
          // this.getLeadSourceCount();
          this.getPresaleMemberReport();
          this.getSaleMemberReport();
          //  this.patchStateSubSourcesBySourceIds(selectedIds);
        },
      });
  }

  sortSubSources(subSources: any[]): any[] {
    return subSources.sort((a, b) => {
      const aSelected = this.selectedSubSourcesIds?.includes(a.leadSubSourceId);
      const bSelected = this.selectedSubSourcesIds?.includes(b.leadSubSourceId);

      // Place selected items first, then unselected items
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }
  onSelectionSubSourceChange(subSource: any, event: any) {
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
    console.log('Selected Sources:', this.selectedSources);

    //this.paginator.firstPage();
    this.subSourceIds = this.selectedSubSourcesIds;
    // this.displaySelectedSubSource();
    //this.getDuplicateLeads();
    this.fetchLeadsDashboardCount();
    this.fetchLeadsCurrentStatusDashboardCount();
    this.getProjectReport();
    if (this.user.roleName == 'presales manager') {
      this.getPresaleMemberReport();
    } else if (this.user.roleName == 'sales manager') {
      this.getSaleMemberReport();
    }
  }

  isSelected(subSourceId: number): boolean {
    return this.selectedSubSourcesIds?.includes(subSourceId);
  }
  searchSubSource(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    if (!searchTerm) {
      this.filteredSubSources = [...this.subSources];
    } else {
      this.filteredSubSources = this.subSources.filter((source: any) =>
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

  getPresaleMemberReport() {
    this.leadService
      .fetchMemberReport(
        this.user.userId,
        this.user.roleId,
        this.digitalPartnerName,
        this.dateRange,
        this.startDate,
        this.endDate,
        this.projectId,
        '',
        '',
        '',
        this.sourceIds,
        this.selectedSubSourcesIds,
        104,
        '',
        this.isExpried
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          // console.log(resp);
          this.presaleMemberReport = resp;
        },
        error: (err) => {},
      });
  }
  getSaleMemberReport() {
    this.leadService
      .fetchMemberReport(
        this.user.userId,
        this.user.roleId,
        this.digitalPartnerName,
        this.dateRange,
        this.startDate,
        this.endDate,
        this.projectId,
        '',
        '',
        '',
        this.sourceIds,
        this.selectedSubSourcesIds,
        '',
        105,
        this.isExpried
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.saleMemberReport = resp;
        },
        error: (err) => {},
      });
  }

  tosslePerOne(): void {
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
      this.selectedSubSourcesIds = [];
    }

    // this.updateSubSourceIds();
    this.fetchSubSourcesBySourceIdsOne(this.sourceIds);
    // this.getProjectReport();
    // this.fetchLeadsDashboardCount();
    // this.fetchLeadsCurrentStatusDashboardCount();
    // // this.getLeadSourceCount();
    // this.getPresaleMemberReport();
    // this.getSaleMemberReport();
  }

  toggleAllSelection() {
    if (this.allSelected?.selected) {
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
    }
    this.sourceIds = this.formData.value.sourceIds;
    // this.updateSubSourceIds();
    // alert('length ' + this.subSourceIds);
    this.fetchSubSourcesBySourceIdsOne(this.sourceIds);
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

  patchStateSubSourcesBySourceIds(selectedIds: number[]): void {
    // alert('Patching');
    console.log(selectedIds);
    this.leadSubSource
      .fetchBySourceIds(selectedIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (subSources: any) => {
          this.subSources = subSources;
          this.filteredSubSources = this.subSources;
          this.filteredSubSources = this.sortSubSources(this.subSources);
          // this.displaySelectedSubSource();
          const stateSubSources = this.subSources.filter((source: any) =>
            this.subSourceIds.includes(source.leadSubSourceId)
          );
          console.log(stateSubSources);
          const selectedNames = stateSubSources
            .map((source: any) => source.name)
            .join(', ');
          this.subSourceControl.patchValue(selectedNames);
          this.selectedSubSourcesIds = this.subSourceIds;
        },
      });
  }

  displaySelectedSubSource() {
    const stateSubSources = this.subSources.filter((source: any) =>
      this.subSourceIds.includes(source.leadSubSourceId)
    );
    console.log(stateSubSources);
    const selectedNames = stateSubSources
      .map((source: any) => source.name)
      .join(', ');
    this.subSourceControl.patchValue(selectedNames);
    this.selectedSubSourcesIds = this.subSourceIds;
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

  onProjectSelectButtonClick() {
    this.projectId=this.selectedprojectIds
    this.fetchLeadsDashboardCount();
    this.fetchLeadsCurrentStatusDashboardCount();
    this.getProjectReport();
    if (this.user.roleName == 'presales manager') {
      this.getPresaleMemberReport();
    } else if (this.user.roleName == 'sales manager') {
      this.getSaleMemberReport();
    }
  }
  fetchProjects() {
    // this.projectService
    //   .getAllProjects(this.projectName, 0, 100, 'Y', this.user.organizationId)
    //   .subscribe({
    //     next: (projects) => {
    //       this.projects = projects.records;
    //     },
    //     error: (error) => {
    //       console.error('Error fetching projects:', error);
    //     },
    //   });
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
      onToggle(event: any) {
    const currentToggleState = event.checked;
    if(currentToggleState){
     this.isExpried=''
    }
    else{
      this.isExpried='N'
    }
           this.getProjectReport();
          this.fetchLeadsDashboardCount();
          this.fetchLeadsCurrentStatusDashboardCount();
          if (this.user.roleName == 'presales manager') {
            this.getPresaleMemberReport();
          } else if (this.user.roleName == 'sales manager') {
            this.getSaleMemberReport();
          }
  }
}
