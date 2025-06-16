import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { NavigationEnd, Router } from '@angular/router';
import { ChartComponent } from 'chart.js';
import { ApexOptions } from 'ng-apexcharts';
import { filter, Subject, takeUntil } from 'rxjs';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { MapDto, TeamDashBoardDataDto } from 'src/app/Models/Presales/lead';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import { LeadSubSource } from 'src/app/Models/Presales/leadsubsource';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { Login } from 'src/app/Models/User/Login';
import { User } from 'src/app/Models/User/User';
import { UserDto } from 'src/app/Models/User/UserDto';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { StateServiceService } from 'src/app/Services/CommanService/state-service.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { LeadSubsourceService } from 'src/app/Services/Presales/LeadSubSource/lead-subsource.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-member-dashboard-v2',
  templateUrl: './member-dashboard-v2.component.html',
  styleUrls: ['./member-dashboard-v2.component.css'],
})
export class MemberDashboardV2Component {
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<any>;
  leadsData: MapDto[] = [];
  assignedTo?: number;
  user: User = new User();
  leadFollowUpTotal: number = 0;
  pageSizeOptions = pageSizeOptions;
  totalLeads: number = 0;
  dashBoardTotalLeadCount: number = 0;
  newLeads: number = 0;
  scheduledVisits: number = 0;
  followups: number = 0;
  siteVisitDoneCount: number = 0;
  closedLeads: number = 0;
  lostLeads: number = 0;
  siteVisitProspectFollowups: number = 0;
  totalBookedLeadsCount: number = 0;
  bookedCount: number = 0;
  lostCount: number = 0;
  private destroy$ = new Subject<void>();
  today: any;
  daysType: string = 'Filter_Days';
  followupStatusType: string = 'Lead_Status';
  moduleNames: string[] = [];
  siteVisitDoneId: number[] = [];
  siteVisitProspectId: number[] = [];
  bookedCancelledId: number = 0;
  lostId: number = 0;
  bookedCancelledCount: number = 0;
  revisitDoneStatusId: number = 0;
  days: CommonReferenceDetails[] = [];
  dateRange: any = 0;
  statusId: number = 0;
  userRole: string = '';
  //chart: Chart | any;
  projectName: string = '';
  projects: Project[] = [];
  UserDetails: UserDto[] = [];
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
  displayedLeadBudgetColumns: string[] = [
    'sourceName',
    'subSourceName',
    'totalAmonut',
    'leadCount',
    'CPL',
    'bookedLeadCount',
    'CPB',
    'siteVisitDoneLeadCount',
    'CPV',
  ];
  teamData: TeamDashBoardDataDto[] = [];
  organizationId: number = 0;
  leadBudgetSpend: any = [];
  leadBudget: any;
  leadBudgetdateRangeForm!: FormGroup;
  nonContactableStatusId: any;
  nonContactableCount: number = 0;
  nonContactable: number = 0;
  projectId: number = 0;
  project: any = new FormControl([] as IProject[]);
  proxyId: number = 0;
  currentuserId: number = 0;
  //status ids
  isShow: boolean = false;
  bookedStatusId: number = 0;
  sitevisitDoneId: number = 0;
  nonContactableId: number = 0;
  siteVisitProspectid: number = 0;
  public login: Login = new Login('', '');
  userId: number = 0;
  bookedCancledId: number = 0;
  followupIds: any[] = [];
  bookedId: number[] = [];
  newLeadId: any;
  proxyLoginDisplay: Boolean = true;
  nonContactableLeadsCount: number = 0;
  selectedDay: any;
  isMemberDashBoard: boolean = true; //
  bookedCountData: any;
  bookedColumns: string[] = ['projectName', 'bookingCount'];
  eoiReceivedStatus: any;
  eoiReceivedId: any;
  EOIReceived: number = 0;
  followUpId: number = 0;
  followUpCount: number = 0;

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
  ncStatusId: any = '';
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
  subSourceControl: any;
  panel3Expanded = false;
  constructor(
    private router: Router,
    private leadService: LeadService,
    private commonService: CommanService,
    private formBuilder: FormBuilder,
    private stateService: StateServiceService,
    private authService: AuthService,
    private userService: UserService,
    private projectService: ProjectService,
    private leadSubSource: LeadSubsourceService
  ) {}
  ngOnInit() {
    console.log(history.state);
    this.panel1Expanded =
      history.state.panel1Expanded == undefined
        ? this.panel1Expanded
        : history.state.panel1Expanded;
    this.panel2Expanded =
      history.state.panel2Expanded == undefined
        ? this.panel2Expanded
        : history.state.panel2Expanded;
    const user = localStorage.getItem('user');
    const MainUser = localStorage.getItem('Mainuser');
    this.sourceIds = history.state.sourceIds || [];
    this.dateRange = history.state.dateRange;
    if (this.sourceIds?.length > 0) {
      this.fetchSubSourcesBySourceIds(this.sourceIds);
    }
    this.subSourceIds = history.state.selectedSubSourcesIds;
    if (user) {
      this.user = JSON.parse(user);
      this.userRole = this.user.roleName;
      this.organizationId = this.user.organizationId;
    }
    this.fetchLeadSources();
    this.initForm();
    this.fetchProjects();
    this.today = new Date().toDateString();
    this.fetchFilterDays();

    // this.fetchLeadsData(this.user.userId);
    //    this.getProjectReport();
    // this.fetchLeadsDashboardCount();
    // this.fetchTotalLeadsCount();
    this.fetchLeadsCurrentStatusDashboardCount();

    if (MainUser) {
      this.Mainuser = JSON.parse(MainUser);
      this.fetchUser();
    }
    if (this.Mainuser.userId == this.user.userId) {
      this.proxyLoginDisplay = false;
    } else {
      console.log(this.proxyLoginDisplay);
    }
    // this.getBookCount();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    // if (this.chart) {
    //   this.chart.destroy();
    // }
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
    var statusId;

    const state = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.startDate,
      customEndDate: this.endDate,
      statusId: '',
      isMemberDashBoard: this.isMemberDashBoard,
      panel1Expanded: this.panel1Expanded,
      panel2Expanded: this.panel2Expanded,
      digitalPartner: this.digitalPartnerName,
      sourceIds: this.sourceIds,
      selectedSubSourcesIds: this.subSourceIds,
    };

    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }

  fetchFilterDays() {
    this.commonService.getRefDetailsByType(this.daysType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        this.days = response;
        // this.selectedDay = this.days.find((day) => day.commonRefKey === '0'); // Set "Today" as the default

        this.patchDateFilterAndFetchData();
      },
      error: (error) => console.error(error),
    });
  }

  patchDateFilterAndFetchData() {
    const dayToFind = history.state.dateRange;
    const startDate = history.state.customStartDate;
    const endDate = history.state.customEndDate;
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
      }
      // alert('Fetching data');
      // this.fetchLeadsDashboardCount();
    } else {
      this.selectedDay = this.days.find((day) => day.commonRefKey === '0');
    }
    // this.fetchLeadsDashboardCount();
    this.fetchLeadsCurrentStatusDashboardCount();
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
      //    this.getProjectReport();
      // this.fetchLeadsDashboardCount();
      this.panel2Expanded = false;
      this.panel3Expanded = false;
      this.fetchLeadsCurrentStatusDashboardCount();
      this.showDateRangePicker = false;
    }
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      customStartDate: [],
      customEndDate: [],
    });
  }

  formatDateTime(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }

  convertToDateTime(dateString: string): Date {
    // Replace 'T' with a space to create a valid date string
    const formattedString = dateString.replace('T', ' ').substring(0, 26); // Keep only up to 26 characters for microsecond precision
    return new Date(formattedString);
  }

  searchProject(event: any) {
    if (event.target.value.length >= 3) {
      this.projectName = event.target.value;
      this.fetchProjects();
    } else {
      this.projectName = '';
      this.fetchProjects();
    }
  }

  fetchProjects() {
    this.projectService
      .getAllProjects(this.projectName, 0, 100, 'Y', this.user.organizationId)
      .subscribe({
        next: (projects) => {
          this.projects = projects.records;
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  onProjectSelect(event: any) {
    this.projectId = event.option.value.projectId;
    this.formData.patchValue({ projectId: this.projectId });
    this.panel2Expanded = false;
    this.panel3Expanded = false;
    // this.fetchLeadsData(this.user.userId);
    // this.fetchLeadsDashboardCount();
    this.fetchLeadsCurrentStatusDashboardCount();
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }

  navigateToFollowups(value?: string, statusId?: any) {
    const userRoleLower = this.userRole.toLowerCase();
    const route = userRoleLower.includes('presale')
      ? 'layout/presales/dashboard/followups/PST'
      : 'layout/sales/dashboard/followups/ST';
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
          isMemberDashBoard: true,
        },
      })
      .then(() => {
        console.log('Status IDs after navigation:');
      })
      .catch((err) => {
        console.error('Navigation error:', err);
      });
  }

  displayUser(user: User): string {
    return user && user.userName ? user.userName : '';
  }
  searchUser(event: any) {
    if (event.target.value.length >= 3 || event.target.value.length == 0) {
      this.userName = event.target.value;
      this.fetchUser();
    }
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

  onUserSelect(event: any) {
    this.userId = event.option.value.userId;
    this.login.identifier = event.option.value.email;
    this.login.password = event.option.value.showPassword;

    this.userService.login(this.login).subscribe({
      next: (response) => {
        this.user = response.userDto;
        // Swal.fire('Login!', 'success');
        this.authService.setUser(JSON.stringify(this.user));
        this.authService.setRole(this.user.roleName);
        this.authService.setAccessToken(response.accessToken);
        this.authService.setRefreshToken(response.token);
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

  isAllDataZero(): boolean {
    return (
      this.totalLeads === 0 &&
      this.totalBookedLeadsCount === 0 &&
      this.closedLeads === 0 &&
      this.lostLeads === 0 &&
      this.EOIReceived === 0
    );
  }

  fetchTotalLeadsCount() {
    console.log('entered');

    this.leadService
      .fetchTotalLeadsCount(this.user.userId, this.user.roleId, '')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: MapDto[]) => {
          response.forEach((lead) => {
            const leadStatus = lead?.status?.toLowerCase();
            if (leadStatus === 'total') {
              this.totalLeads = lead.value;
            }
            if (leadStatus === 'closed') {
              this.closedLeads = lead.value;
            } else if (leadStatus === 'lost') {
              this.lostLeads = lead.value;
            } else if (leadStatus === 'rnr') {
              this.nonContactableLeadsCount = lead.value;
            } else if (leadStatus === 'booked') {
              this.totalBookedLeadsCount = lead.value;
            } else if (leadStatus === 'eoi received') {
              this.EOIReceived = lead.value;
            }
          });
          this.updateChartOptions();
        },
        error: (error) => console.error(error),
      });
  }

  navigateToLeadsForNonContactable() {
    console.log('non contactable');
    this.commonService
      .getRefDetailsId('Lead_Status', 'NC')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
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

  updateChartOptions() {
    // Define your data points
    const totalLeads = this.totalLeads || 0;
    const bookedLeadsCount = this.totalBookedLeadsCount || 0;
    const closedLeads = this.closedLeads || 0;
    const lostLeads = this.lostLeads || 0;
    const EOIReceived = this.EOIReceived || 0;

    // Prepare series data and labels
    const series = [
      totalLeads,
      bookedLeadsCount,
      closedLeads,
      lostLeads,
      EOIReceived,
    ];

    // Prepare labels based on the data points
    const labels = [
      'Total Leads',
      'Booked Leads Count',
      'Closed Leads',
      'Lost Leads',
      'EOI Received',
    ];

    // Set chart options
    this.chartOptions = {
      series: series,
      chart: {
        width: 380,
        type: 'pie',
      },
      labels: labels,
      colors: ['#258fe6', '#43bd40', '#3357FF', '#6b8a7a', '#d3de5f'],
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

    this.followups = 0;
    this.siteVisitDoneCount = 0;
    this.siteVisitProspectFollowups = 0;
    this.nonContactableCount = 0;
    this.bookedCount = 0;
    this.bookedCancelledCount = 0;
    this.newLeads = 0;
    this.leadService
      .fetchLeadsDashboardCountV1(
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
        this.subSourceIds
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.dashBoardTotalLeadCount = resp.assignedLeads;
          this.newLeads = resp.newLeads;
          this.nonContactableCount = resp.nonContactable;
          this.nonContactableId = resp.nonContactableId;
          this.lostCount = resp.lost;
          this.bookedCount = resp.booked;
          this.siteVisitProspectFollowups = resp.visitProspect;
          this.bookedCancelledCount = resp.cancelledBookings;
          this.newLeadId = resp.newLeadId;
          this.bookedId = [resp.bookedId];
          this.siteVisitProspectId = resp.visitProspectId;
          this.lostId = resp.lostId;
          this.siteVisitDoneCount = resp.siteVisitDone;
          this.bookedCancelledId = resp.cancelledBookingsId;
          this.nonContactableId = resp.nonContactableId;
          this.siteVisitDoneId = [resp.siteVisitDoneId];
          this.followups = resp.siteVisitConfirm + resp.reVisitProposed;
          this.eoiReceivedStatus = resp.eoiReceivedStatus;
          this.eoiReceivedId = resp.eoiReceivedId;
          this.followUpId = resp.followUpId;
          this.followUpCount = resp.followUp;
          if (resp.siteVisitConfirmId) {
            this.followupIds.push(resp.siteVisitConfirmId);
          }

          if (
            resp.reVisitProposedId &&
            !this.userRole.toLocaleLowerCase().includes('presale')
          ) {
            this.followupIds.push(resp.reVisitProposedId);
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
      dashboard: 'Yes',
      statusId: statusId,
      isMemberDashBoard: this.isMemberDashBoard,
      panel1Expanded: this.panel1Expanded,
      panel2Expanded: this.panel2Expanded,
      digitalPartner: this.digitalPartnerName,
      sourceIds: this.sourceIds,
      selectedSubSourcesIds: this.subSourceIds,
    };

    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }
  getBookCount() {
    console.log('booking');
    this.followups = 0;
    this.siteVisitDoneCount = 0;
    this.siteVisitProspectFollowups = 0;
    this.nonContactableCount = 0;
    this.bookedCount = 0;
    this.bookedCancelledCount = 0;
    this.newLeads = 0;
    this.leadService
      .getBookCount(
        this.user.userId,
        this.user.roleId,
        '',
        '',
        '',
        this.projectId,
        '',
        ''
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.bookedCountData = resp;
        },
        error: (err) => {},
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
      // this.fetchLeadsDashboardCount();
      this.panel2Expanded = false;
      this.panel3Expanded = false;
      this.fetchLeadsCurrentStatusDashboardCount();
    }
  }

  fetchLeadsCurrentStatusDashboardCount() {

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
        this.subSourceIds
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
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
          this.bookedId = [resp.bookedId];
          this.siteVisitProspectId = resp.visitProspectId;
          this.bookedCancelledId = resp.cancelledBookingsId;
          this.siteVisitDoneId = [resp.siteVisitDoneId];
          this.ncStatusId = [resp.nonContactableId];
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
          //this.currentFollowUpCount=resp.followUp;
        },
        error: (err) => {},
      });
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
      isMemberDashBoard: this.isMemberDashBoard,
      panel1Expanded: this.panel1Expanded,
      panel2Expanded: this.panel2Expanded,
      digitalPartner: this.digitalPartnerName,
      sourceIds: this.sourceIds,
      selectedSubSourcesIds: this.subSourceIds,
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
      statusId: statusId,
      currentStatusDashboard: 'Yes',
      isMemberDashBoard: this.isMemberDashBoard,
      panel1Expanded: this.panel1Expanded,
      panel2Expanded: this.panel2Expanded,
      digitalPartner: this.digitalPartnerName,
      sourceIds: this.sourceIds,
      selectedSubSourcesIds: this.subSourceIds,
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
      this.fetchLeadsCurrentStatusDashboardCount();
    } else if (panelNumber === 2) {
      this.fetchLeadsDashboardCount();
      this.panel2Expanded = true;
    } else if (panelNumber === 3) {
      this.panel3Expanded = true;
      this.fetchTotalLeadsCount();
      this.getBookCount();
    }
  }
  onPanelClose(panelNumber: number): void {
    if (panelNumber === 1) {
      this.panel1Expanded = false;
    } else if (panelNumber === 2) {
      this.panel2Expanded = false;
    } else if (panelNumber === 3) {
      this.panel3Expanded = false;
    }
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
    // this.fetchLeadsDashboardCount();
    this.panel2Expanded = false;
    this.panel3Expanded = false;
    this.fetchLeadsCurrentStatusDashboardCount();
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
    //this.getDuplicateLeads();
    // this.fetchLeadsDashboardCount();
    this.panel2Expanded = false;
    this.panel3Expanded = false;
    this.fetchLeadsCurrentStatusDashboardCount();
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
}
