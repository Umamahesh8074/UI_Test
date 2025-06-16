import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { NavigationEnd, Router } from '@angular/router';
import { ChartComponent } from 'chart.js';
import { ApexOptions } from 'ng-apexcharts';
import { filter, Subject, takeUntil } from 'rxjs';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { MapDto } from 'src/app/Models/Presales/lead';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import { LeadSubSource } from 'src/app/Models/Presales/leadsubsource';
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
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';
import { ApexChart } from 'ng-apexcharts';

interface TeamMapDto {
  status: string;
  count: number;
  userId: number;
  userName: string;
  teamId: number;
  teamName: string;
  projectId: number;
  projectName: string;
}

interface AggregatedTeamData {
  teamName: string;
  assignedLeads: number;
  siteVisitDone: number;
  nonContactable: number;
  followUps: number;
}

@Component({
  selector: 'app-sales-head-dash-board',
  templateUrl: './sales-head-dash-board.component.html',
  styleUrls: ['./sales-head-dash-board.component.css'],
})
export class SalesHeadDashBoardComponent {
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<any>;
  leadsData: MapDto[] = [];
  assignedTo?: number;
  user: User = new User();
  Mainuser: User = new User();
  leadFollowUpTotal: number = 0;
  pageSizeOptions = pageSizeOptions;
  totalLeads: number = 0;
  newLeads: number = 0;
  dashboardTotalLeads: number = 0;
  scheduledVisits: number = 0;
  followups: number = 0;
  dashboardFollowups: number = 0;
  siteVisitDoneCount: number = 0;
  closedLeads: number = 0;
  lostLeads: number = 0;
  nonContactableLeads: number = 0;
  siteVisitProspectFollowups: number = 0;
  totalBookedLeadsCount: number = 0;
  bookedCount: number = 0;
  lostCount: number = 0;
  lostId: number = 0;
  isShow: boolean = false;
  followUpId: number = 0;
  bookedCancelledCount: number = 0;
  private destroy$ = new Subject<void>();
  today: any;
  daysType: string = 'Filter_Days';
  followupStatusType: string = 'Lead_Status';
  moduleNames: string[] = [];
  siteVisitDoneId: number[] = [];
  siteVisitProspectId: number[] = [];
  bookedId: number[] = [];
  followupIds: number[] = [];
  revisitDoneStatusId: number = 0;
  bookedCancelledId: number = 0;
  days: CommonReferenceDetails[] = [];
  dateRange: any = 0;
  statusId: number = 0;
  userRole: string = '';
  // chart: Chart | any;
  projectName: string = '';
  userName: string = '';
  projects: Project[] = [];
  UserDetails: UserDto[] = [];
  displayedColumns: string[] = [
    'userName',
    'newLeads',
    'noOfFollowups',
    'noOfSiteVisitDone',
    'booked',
  ];
  newLeadId: any;
  ncStatusId: any;
  showDateRangePicker = false;
  formData!: FormGroup;
  startDate: any;
  endDate: any;
  eoiReceivedStatus: any;
  eoiReceivedId: any;
  followUpCount: number = 0;
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
  teamLeadsData: TeamMapDto[] = [];
  teamData: AggregatedTeamData[] = [];
  organizationId: number = 0;
  unassignedLeads: number = 0;
  public login: Login = new Login('', '');
  leadBudgetSpend: any = [];
  leadBudget: any;
  leadBudgetdateRangeForm!: FormGroup;
  nonContactableStatusId: any;
  nonContactableCount: any;
  projectId: number = 0;
  userId: number = 0;
  project: any = new FormControl([] as IProject[]);
  teamWiseDataColumns: string[] = [
    'teamName',
    'assignedLeads',
    'siteVisitDone',
    'nonContactable',
    'followUps',
  ];
  treeData: any;
  User: any = new FormControl([] as UserDto[]);
  sources: LeadSource[] = [];
  filteredSources: LeadSource[] = [];
  sourceId: number = 0;
  selectedDay: any;

  sourceSubsourceMap: { [key: number]: number[] } = {};
  sourceIds: number[] = [];
  subSourceIds: number[] = [];
  source: any = new FormControl([] as LeadSource[]);
  selectedSubSourcesIds: number[] = [];
  filteredSubSources: LeadSubSource[] = [];
  subSourceId: any = '';
  subSources: any = [];
  subSourceControl: any;
  
  constructor(
    private router: Router,
    private leadService: LeadService,
    private commonService: CommanService,
    private formBuilder: FormBuilder,
    private stateService: StateServiceService,
    private leadBudgetService: LeadbudgetService,
    private userService: UserService,
    private authService: AuthService,
    private leadCommonService: LeadsCommonService,
    private leadSubSource: LeadSubsourceService
  ) {}

  ngOnInit() {
    const user = localStorage.getItem('user');
    const MainUser = localStorage.getItem('Mainuser');
    if (user) {
      this.user = JSON.parse(user);
      this.userRole = this.user.roleName;
      this.organizationId = this.user.organizationId;
    }
    this.initForm();
    this.fetchLeadSources();
    // this.fetchLeadsDashboardCount();
    this.initLeadBudgetDateRange();
    this.fetchProjects();
    this.today = new Date().toDateString();
    this.fetchFilterDays();
    // this.fetchLeadsData(this.user.userId);
    this.fetchTotalLeadsCount();
    this.userRole.toLocaleLowerCase().includes('sales')
      ? this.moduleNames.push('S,PS')
      : this.moduleNames.push('P,PS');
    this.getProjectReport();
    if (MainUser) {
      this.Mainuser = JSON.parse(MainUser);
      this.fetchUser();
    }
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
      dashboard: 'Yes',
      isSalesHeadDashboard: true,
    };
    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }

  navigateToLeadsForNonContactable() {
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

  navigateToFollowups(value?: any) {
    const userRoleLower = this.userRole.toLowerCase();
    const route = userRoleLower.includes('presale')
      ? 'layout/presales/dashboard/followups/PST'
      : 'layout/sales/dashboard/followups/ST';
    let statusIds: number[] = value;
    if (statusIds.length <= 0) {
      statusIds = [0];
    }
    this.router.navigate([route], {
      state: {
        dateRange: this.dateRange,
        statusIds: statusIds,
        customStartDate: this.startDate,
        customEndDate: this.endDate,
        projectId: this.projectId,
        isFromDashBoard: true,
        isSalesHeadDashboard: true,
      },
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

  // // fetchLeadsData(userId: number) {
  // //   this.newLeads = 0;
  // //   this.scheduledVisits = 0;
  // //   this.followups = 0;
  // //   this.siteVisitDoneCount = 0;
  // //   this.closedLeads = 0;
  // //   this.lostLeads = 0;
  // //   this.nonContactableLeads = 0;
  // //   this.siteVisitProspectFollowups = 0;
  // //   this.bookedCount = 0;
  // //   this.dashboardFollowups = 0;
  // //   this.siteVisitDoneId = [];
  // //   this.siteVisitProspectId = [];
  // //   this.followupIds = [];

  // //   this.leadService
  // //     .getProjectTeamReportForChannelPatner(
  // //       this.user.userId,
  // //       this.user.roleId,
  // //       this.dateRange ? this.dateRange : 0,
  // //       this.startDate,
  // //       this.endDate,
  // //       0,
  // //       0,
  // //       0
  // //     )
  // //     .pipe(takeUntil(this.destroy$))
  // //     .subscribe({
  // //       next: (resp: any[]) => {
  // //         resp.forEach(
  // //           (record: {
  // //             name: string;
  // //             followUp: number;
  // //             followUpId: any;
  // //             qualified: number;
  // //             qualifiedId: any;
  // //             junk: number;
  // //             junkId: any;
  // //             lost: number;
  // //             lostId: any;
  // //             reVisitProposed: number;
  // //             reVisitProposedId: any;
  // //             siteVisitConfirm: number;
  // //             siteVisitConfirmId: any;
  // //             siteVisitDone: number;
  // //             nonContactable: any;
  // //             booked: number;
  // //             visitProspect: number;
  // //             cancelledBookings: number;
  // //             bookedId: any;
  // //             visitProspectId: number[];
  // //             cancelledBookingsId: number;
  // //             siteVisitDoneId: any;
  // //           }) => {
  // //             if (record.name === 'PreSales') {
  // //               // if (record.followUp > 0) {
  // //               //   this.dashboardFollowups += record.followUp;
  // //               //   this.followupIds.push(record.followUpId);
  // //               // }

  // //               if (record.qualified > 0) {
  // //                 this.followups += record.qualified;
  // //                 this.followupIds.push(record.qualifiedId);
  // //               }

  // //               if (record.junk > 0) {
  // //                 this.followups += record.junk;
  // //                 this.followupIds.push(record.junkId);
  // //               }

  // //               if (record.lost > 0) {
  // //                 this.followups += record.lost;
  // //                 this.followupIds.push(record.lostId);
  // //               }

  // //               if (record.reVisitProposed > 0) {
  // //                 this.followups += record.reVisitProposed;
  // //                 this.followupIds.push(record.reVisitProposedId);
  // //               }

  // //               if (record.siteVisitConfirm > 0) {
  // //                 // this.dashboardFollowups += record.siteVisitConfirm;
  // //                 this.followupIds.push(record.siteVisitConfirmId);
  // //               }

  // //               this.siteVisitDoneCount += record.siteVisitDone;
  // //               this.nonContactableCount += record.nonContactable;
  // //               this.bookedCount = record.booked;
  // //               this.siteVisitProspectFollowups = record.visitProspect;
  // //               this.bookedCancelledCount = record.cancelledBookings;

  // //               this.bookedId = [record.bookedId];
  // //               this.siteVisitProspectId = record.visitProspectId;
  // //               this.bookedCancelledId = record.cancelledBookingsId;
  // //               this.siteVisitDoneId = [record.siteVisitDoneId];
  // //             } else if (record.name === 'Sales') {
  // //               if (record.followUp > 0) {
  // //                 this.dashboardFollowups += record.followUp;
  // //                 this.followupIds.push(record.followUpId);
  // //               }

  // //               if (record.qualified > 0) {
  // //                 this.followups += record.qualified;
  // //                 this.followupIds.push(record.qualifiedId);
  // //               }

  // //               if (record.junk > 0) {
  // //                 this.followups += record.junk;
  // //                 this.followupIds.push(record.junkId);
  // //               }

  // //               if (record.lost > 0) {
  // //                 this.followups += record.lost;
  // //                 this.followupIds.push(record.lostId);
  // //               }

  // //               if (record.reVisitProposed > 0) {
  // //                 this.dashboardFollowups += record.reVisitProposed;
  // //                 this.followupIds.push(record.reVisitProposedId);
  // //               }

  // //               if (record.siteVisitConfirm > 0) {
  // //                 this.followups += record.siteVisitConfirm;
  // //                 this.followupIds.push(record.siteVisitConfirmId);
  // //               }

  // //               this.siteVisitDoneCount += record.siteVisitDone;
  // //               this.nonContactableCount += record.nonContactable;
  // //               this.bookedCount = record.booked;
  // //               this.siteVisitProspectFollowups = record.visitProspect;
  // //               this.bookedCancelledCount = record.cancelledBookings;

  // //               this.bookedId = [record.bookedId];
  // //               this.siteVisitProspectId = record.visitProspectId;
  // //               this.bookedCancelledId = record.cancelledBookingsId;
  // //               this.siteVisitDoneId = [record.siteVisitDoneId];
  // //             }
  // //           }
  // //         );

  //         // Further processing for the additional leads section
  //         resp.forEach(
  //           (record: {
  //             name: string;
  //             assignedLeads: number;
  //             nonContactable: any;
  //           }) => {
  //             if (record.name === 'PreSales') {
  //               this.newLeads += record.assignedLeads;
  //               this.nonContactableCount = record.nonContactable;
  //               console.log('PreSales', this.newLeads);
  //             } else if (record.name === 'Sales') {
  //               this.newLeads += record.assignedLeads;
  //               this.nonContactableCount = record.nonContactable;
  //               console.log('Sales', this.newLeads);
  //             }
  //           }
  //         );
  //       },
  //       error: (err: any) => {},
  //     });
  // }

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
    console.log('State: Date Range ' + dayToFind);
    console.log('State: Start Date ' + startDate);
    console.log('State: End Date ' + endDate);
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
        customStartDate: this.leadCommonService.convertToDateTime(startDate),
        customEndDate: this.leadCommonService.convertToDateTime(endDate),
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
    this.fetchLeadsDashboardCount();
  }

  handleDaySelection(commonRefObject: CommonReferenceDetails) {
    this.dateRange = commonRefObject.commonRefKey;
    if (commonRefObject.commonRefValue.includes('Custom')) {
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
      this.showDateRangePicker = false;
    }
  }

  fetchTotalLeadsCount() {
    this.leadService
      .fetchTotalLeadsCount(this.user.userId, this.user.roleId,'')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: MapDto[]) => {
          response.forEach((lead) => {
            const leadStatus = lead.status.toLowerCase();
            if (leadStatus === 'total') {
              this.totalLeads = lead.value;
            }
            if (leadStatus === 'closed') {
              this.closedLeads = lead.value;
            } else if (leadStatus === 'lost') {
              this.lostLeads = lead.value;
            } else if (leadStatus === 'rnr') {
              this.nonContactableLeads = lead.value;
            } else if (leadStatus === 'booked') {
              this.totalBookedLeadsCount = lead.value;
            }
          });
          this.updateChartOptions();
          // this.createChart();
        },
        error: (error) => console.error(error),
      });
  }

  // createChart(): void {
  //   if (!this.isAllDataZero()) {
  //     const canvas = document.getElementById('MyChart') as HTMLCanvasElement;
  //     if (canvas) {
  //       this.chart = new Chart(canvas, {
  //         type: 'pie',
  //         data: {
  //           labels: ['Total', 'Booked', 'Closed', 'Lost'],
  //           datasets: [
  //             {
  //               label: 'Count',
  //               data: [
  //                 this.totalLeads,
  //                 this.totalBookedLeadsCount,
  //                 this.closedLeads,
  //                 this.lostLeads,
  //               ],
  //               backgroundColor: ['#329ca8', 'green', 'purple', 'red'],
  //               hoverOffset: 4,
  //             },
  //           ],
  //         },
  //         options: {
  //           aspectRatio: 2.2,
  //           plugins: {
  //             legend: {
  //               position: 'right', // Set legend position to bottom
  //             },
  //           },
  //         },
  //       });
  //     }
  //   }
  // }

  isAllDataZero(): boolean {
    return (
      this.totalLeads === 0 &&
      this.totalBookedLeadsCount === 0 &&
      this.closedLeads === 0 &&
      this.lostLeads === 0
    );
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

  getLeadBugdetSpent(startDate: any, endDate: any) {
    this.leadBudgetService
      .getAllBudgetSpent(startDate, endDate, this.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          const leadBudgetSpend = response;
          if (leadBudgetSpend.length > 0) {
            // Removed parentheses
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
      this.projectName = event.target.value;
      this.fetchProjects();
    } else {
      this.projectName = '';
      this.fetchProjects();
    }
  }

  searchUser(event: any) {
    if (event.target.value.length >= 3 || event.target.value.length == 0) {
      this.userName = event.target.value;
      this.fetchUser();
    }
  }
  fetchProjects() {
    this.leadService
      .fetchProjects(this.projectName, this.organizationId)
      .subscribe({
        next: (projects) => {
          this.projects = projects;
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
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

  onProjectSelect(event: any) {
    this.projectId = event?.option.value?.projectId;
    this.formData.patchValue({ projectId: this.projectId });
    // this.fetchLeadsData(this.user.userId);
    // this.getProjectReport();
    this.fetchLeadsDashboardCount();
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

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : 'All';
  }

  displayUser(user: User): string {
    return user && user.userName ? user.userName : '';
  }

  fetchTeamWiseData() {
    this.leadService
      .teamWiseLeadsData(
        this.user.userId,
        this.user.roleId,
        this.dateRange,
        this.startDate,
        this.endDate
      )
      .subscribe({
        next: (response) => {
          this.teamLeadsData = response;
          // this.processDashBoardTeamData();
        },
        error: (error) => {
          console.error('Error fetching team wise data:', error);
        },
      });
  }

  getProjectReport() {
    this.leadService
      .getProjectTeamReport(
        this.user.userId,
        this.user.roleId,
        this.dateRange ? this.dateRange : 0,
        this.startDate,
        this.endDate,
        this.projectId,
        '',
        ''
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.treeData = resp;
        },
        error: (err) => {},
      });
  }

  expandedNodes = new Set<string>();
  activeNodes = new Set<string>();

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
  @ViewChild('chart') chart: ChartComponent | undefined;
  public chartOptions: Partial<ApexOptions> = {};

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
      colors: ['#258fe6', '#43bd40', '#FFC300', '#6b8a7a'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
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
    this.dashboardTotalLeads = 0;
    this.newLeads = 0;
    this.unassignedLeads = 0;
    this.dashboardFollowups = 0;
    this.leadService
      .fetchLeadsDashboardCount(
        this.user.userId,
        this.user.roleId,
        this.dateRange,
        this.startDate,
        this.endDate,
        this.projectId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.dashboardTotalLeads = resp.assignedLeads;
          this.newLeads = resp.newLeads;
          this.dashboardFollowups =
            resp.siteVisitConfirm + resp.reVisitProposed;
          if (resp.siteVisitConfirmId) {
            this.followupIds.push(resp.siteVisitConfirmId);
          }
          if (resp.reVisitProposedId) {
            this.followupIds.push(resp.reVisitProposedId);
            this.followups = this.followups + resp.reVisitProposed;
          }
          this.siteVisitDoneCount = resp.siteVisitDone;
          this.nonContactableCount = resp.nonContactable;
          this.unassignedLeads = resp.unassignedLeads;
          this.lostCount = resp.lost;
          this.lostId = resp.lostId;
          this.bookedCount = resp.booked;
          this.siteVisitProspectFollowups = resp.visitProspect;
          this.bookedCancelledCount = resp.cancelledBookings;
          this.newLeadId = resp.newLeadId;
          this.bookedId = [resp.bookedId];
          this.siteVisitProspectId = resp.visitProspectId;
          this.bookedCancelledId = resp.cancelledBookingsId;
          this.siteVisitDoneId = [resp.siteVisitDoneId];
          this.ncStatusId = [resp.nonContactableId];
          this.newLeadId = resp.newLeadId;
          this.eoiReceivedStatus = resp.eoiReceivedStatus;
          this.eoiReceivedId = resp.eoiReceivedId;
          this.followUpId = resp.followUpId;
          this.followUpCount = resp.followUp;
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
      statusId: statusId,
      dashboard: 'Yes',
      isSalesHeadDashboard: true,
    };

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
    }
  }

  navigateToUnassignedLeads() {
    console.log('unassigned leads');
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
      dashboard: 'Yes',
      isSalesHeadDashboard: true,
      isUnassignedLeads: true,
      userId: this.user.userId,
    };
    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
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
