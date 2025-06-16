import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationEnd, Router } from '@angular/router';
import { ChartComponent } from 'chart.js';
import { ApexOptions } from 'ng-apexcharts';
import { filter, Subject, takeUntil } from 'rxjs';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { MapDto, TeamDashBoardDataDto } from 'src/app/Models/Presales/lead';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { Login } from 'src/app/Models/User/Login';
import { User } from 'src/app/Models/User/User';
import { UserDto } from 'src/app/Models/User/UserDto';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { StateServiceService } from 'src/app/Services/CommanService/state-service.service';
import { LeadbudgetService } from 'src/app/Services/LeadBugetService/leadbudget.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-manager-dash-board',
  templateUrl: './manager-dash-board.component.html',
  styleUrls: ['./manager-dash-board.component.css'],
})
export class ManagerDashBoardComponent implements OnInit, OnDestroy {
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
  projectId: number = 0;
  project: any = new FormControl([] as IProject[]);
  bookedCancelledCount: number = 0;
  //addded
  UserDetails: UserDto[] = [];
  followupIds: any[] = [];
  nonContactableId: number = 0;
  visitProspectId: number = 0;
  siteVisitDoneId: any = 0;
  bookedId: any = 0;
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
  constructor(
    private router: Router,
    private leadService: LeadService,
    private commonService: CommanService,
    private formBuilder: FormBuilder,
    private stateService: StateServiceService,
    private leadBudgetService: LeadbudgetService,
    private authService: AuthService,
    private userService: UserService
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

  fetchLeadsData(userId: number) {
    this.leadService
      .getDashBoardCount(
        userId,
        this.user.roleId,
        this.dateRange,
        this.startDate,
        this.endDate,
        this.projectId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: MapDto[]) => {
          this.leadsData = response;
          this.processDashBoardData();
        },
        error: (error) => console.error(error),
      });
  }

  fetchFilterDays() {
    this.commonService.getRefDetailsByType(this.daysType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        this.days = response;
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

    console.log(dayToFind);
    console.log(startDate);
    console.log(endDate);

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
    this.getProjectReport();
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
        ''
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
    } else {
      this.projectName = '';
      this.fetchProjects();
    }
  }

  fetchProjects() {
    this.leadService
      .fetchProjects(this.projectName, this.user.organizationId)
      .subscribe({
        next: (projects) => {
          this.projects = projects;
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  onProjectSelect(event: any) {
    console.log(event.option.value);
    this.projectId = event?.option.value?.projectId;
    this.formData.patchValue({ projectId: this.projectId });
    // this.fetchLeadsData(this.user.userId);

    //  this.getProjectReport();
    this.fetchLeadsDashboardCount();
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : 'All';
  }

  processDashBoardData() {
    this.totalLeads = 0;
    this.newLeads = 0;
    this.scheduledVisits = 0;
    this.followups = 0;
    this.siteVisitDoneCount = 0;
    this.closedLeads = 0;
    this.lostLeads = 0;
    this.nonContactableLeadsCount = 0;
    this.siteVisitProspectFollowups = 0;
    this.bookedCount = 0;

    this.leadsData.forEach((data) => {
      switch (data.status) {
        case 'Assigned Leads':
          this.newLeads = data.value;
          break;

        case 'Cancelled Booking':
          this.bookedCancelledCount = data.value;
          this.bookedCancelledId = data.statusId;
          break;
        case 'Booked':
          this.bookedCount = data.value;
          this.bookedId = data.statusId;
          break;
        case 'Qualified':
        case 'Follow-up':
        case 'Site Visit Confirm':
        case 'Lost':
        case 'Junk':
          this.followups += data.value;

          // Check if the statusId is already present in followupIds
          if (!this.followupIds.includes(data.statusId)) {
            this.followupIds.push(data.statusId);
          }

          break;
        case 'Non-Contactable':
          console.log('non contable ', data.value);
          this.nonContactableLeadsCount = data.value;
          this.nonContactableId = data.statusId;
          console.log('non contable ', this.nonContactableId);

          break;
        case 'Site Visit Done':
        case 'Revisit Done':
          this.siteVisitDoneCount = data.value;
          this.siteVisitDoneId = data.statusId;
          break;
        case 'Closed':
          this.closedLeads = data.value;
          break;
        case 'Lost':
          this.lostLeads = data.value;
          break;
        case 'Visit Prospect':
          this.siteVisitProspectFollowups = data.value;
          this.visitProspectId = data.statusId;
          break;
        default:
          console.warn('Unknown status:');
      }
    });
  }
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
          this.dashboardnewLeads = resp.assignedLeads;
          this.newLeads = resp.newLeads;
          this.siteVisitDoneCount = resp.siteVisitDone;
          this.nonContactableCount = resp.nonContactable;
          this.bookedCount = resp.booked;
          this.lostCount = resp.lost;
          this.siteVisitProspectFollowups = resp.visitProspect;
          this.bookedCancelledCount = resp.cancelledBookings;
          this.newLeadId = resp.newLeadId;
          this.bookedId = [resp.bookedId];
          this.lostId = resp.lostId;
          this.nonContactableId = resp.nonContactableId;
          this.visitProspectId = resp.visitProspectId;
          this.bookedCancelledId = resp.cancelledBookingsId;
          this.siteVisitDoneId = [resp.siteVisitDoneId];
          this.eoiReceivedStatus = resp.eoiReceivedStatus;
          this.eoiReceivedId = resp.eoiReceivedId;
          // this.followups = resp.followUp;
          this.dashboardFollowups = resp.followUp + resp.siteVisitConfirm;
          if (resp.followUpId) {
            this.followupIds.push(resp.followUpId);
          }
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
      Id: this.projectId,
      dashboard: 'Yes',
      statusId: statusId,
      isManagerDashBoard: true,
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
}
