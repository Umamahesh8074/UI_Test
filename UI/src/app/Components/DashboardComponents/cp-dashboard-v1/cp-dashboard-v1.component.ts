import { state } from '@angular/animations';
import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { NavigationEnd, Router } from '@angular/router';
import { ChartComponent } from 'chart.js';
import { ApexOptions } from 'ng-apexcharts';
import { filter, Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { FILTER_DAYS } from 'src/app/Constants/CommanConstants/Comman';
import {
  CPDashBoardData,
  IChannelPartnerRegisterBean,
} from 'src/app/Models/Presales/channelPartner';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { Login } from 'src/app/Models/User/Login';
import { User } from 'src/app/Models/User/User';
import { UserDto } from 'src/app/Models/User/UserDto';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LeadsCommonService } from 'src/app/Services/CommanService/leads-common.service';
import { StateServiceService } from 'src/app/Services/CommanService/state-service.service';
import { ChannelPartnerRegisterService } from 'src/app/Services/Presales/CPRegisterService/channel-partner-register.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import { NotificationsDto } from 'src/app/Models/Project/notifications';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cp-dashboard-v1',
  templateUrl: './cp-dashboard-v1.component.html',
  styleUrls: ['./cp-dashboard-v1.component.css'],
})
export class CpDashboardV1Component {
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<any>;
  private destroy$ = new Subject<void>();
  user: User = new User();
  today: any;
  showDateRangePicker = false;
  daysType: string = FILTER_DAYS;
  days: CommonReferenceDetails[] = [];
  dateRange: any = 0;
  startDate: any;
  endDate: any;
  isApproval: boolean = false;
  notifications: any;
  projectName: any;
  //leads count for channel partner
  registeredLeadsCount: number = 0;
  followupsCount: number = 0;

  siteVisitDoneCount: number = 0;
  bookedCount: number = 0;
  bookedCanceledCount: number = 0;
  followupIds: number[] = [];
  bookedId: number = 0;
  bookedCancelledId: number = 0;
  cPDashBoardData: CPDashBoardData[] = [];
  User: any = new FormControl([] as UserDto[]);
  userName: string = '';
  siteVisitDoneId: number = 0;

  sitevisitStatusDoneId: number = 0;
  siteVisitProspectId: number[] = [];
  formData!: FormGroup;
  UserDetails: UserDto[] = [];
  teamData: any[] = [];
  filteredData: MatTableDataSource<any> = new MatTableDataSource<any>();
  userId: number = 0;
  Mainuser: User = new User();
  public login: Login = new Login('', '');
  displayedColumns: string[] = [
    'cpName',
    'registeredLeads',
    'newLeads',
    'unassignedLeads',
    'noOfFollowups',
    'noOfSiteVisit',
    'noOfSiteVisitDone',
    'booked',
    'bookedCancelled',
    'lost',
    'eoiReceived',
    'salesFollowUp',
    'salesLost',
    'salesJunk',
    'salesNonContactable',
    'salesDND',
  ];

  //count for cp wise
  assignedLeadsIds: number[] = [];

  siteVisitDoneStatusId: number = 0;
  followUpsStatusId: number = 0;
  bookedStatusId: number = 0;
  nonContactableStatusId: number = 0;
  siteVisitConfirmStatusId: number = 0;
  visitProspectStatusId: number = 0;
  qualifiedStatusId: number = 0;
  bookedCancelledStatusId: number = 0;
  lostStatusId: number = 0;
  junkStatusId: number = 0;
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  cpUserId: number = 0;
  selectedDay: CommonReferenceDetails | undefined;
  isShow: boolean = false;
  proxyLoginDisplay: Boolean = true;
  scrollNotifications: NotificationsDto[] = [];
  scheduledVisits: number | undefined;
  nonContactableCount: number = 0;
  newLeads: number = 0;
  assignedLeads: number = 0;
  newLeadId: number = 0;
  lostId: number = 0;
  lostCount: number = 0;
  isToggled: boolean = false;
  cpDetails: any;
  cpRegisterId: number = 0;
  unassignedLeads: number = 0;
  eoiReceivedStatus: number = 0;
  eoiReceivedId: any;
  eoiReceived: number = 0;
  followupCount: number = 0;
  followupId: number = 0;
  projectId: any;
  //added
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);
  selectedprojectIds: any;
  @ViewChild('allProjectSelected') private allProjectSelected?: any;
  isLoading: boolean = false;
  salesLostCount: any = 0;
  salesLostId: any = 0;
  salesNonContactable: any = 0;
  salesNonContactableId: any = 0;
  salesJunkCount = 0;
  salesJunkId = 0;
  salesDNDcount = 0;
  salesDNDId = 0;
  salesFollowupCount = 0;
  salesFollwupId = 0;
  isExpried: any = 'N';

  notificationType: string = 'Notification_Event';
  alertTypeId: number = 0;
  notificationTypeId: number = 0;

  ngOnInit(): void {
    // this.isToggled = true;
    this.fetchEventTypes();
    const user = this.authService.getUser();
    if (user != null) {
      this.user = JSON.parse(user);
    }

    this.setUserFromLocalStorage();
    this.initForm();
    this.fetchCpDetails();

    this.fetchFilterDays();
    //this.fetchLeadsData();
    // this.fetchLeadsDashboardCount();
    // this.updateChartOptions();
    this.today = new Date().toDateString();
    const MainUser = localStorage.getItem('Mainuser');
    if (MainUser) {
      this.Mainuser = JSON.parse(MainUser);
      this.fetchUser();
      this.getNotifications();
    }
    if (this.Mainuser.userId == this.user.userId) {
      this.proxyLoginDisplay = false;
    } else {
      console.log(this.proxyLoginDisplay);
    }
    this.isExpried =
      history.state.expried != undefined
        ? history.state.expried
        : this.isExpried;
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
            this.sortProject(this.projects, this.selectedprojectIds);
            console.log(this.projects);
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
  constructor(
    private leadService: LeadService,
    private commanService: CommanService,
    private formBuilder: FormBuilder,
    private stateService: StateServiceService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private projectService: ProjectService,
    private cpService: ChannelPartnerRegisterService,
    public dialog: MatDialog,
    private leadCommonService: LeadsCommonService,
    private commonService: CommanService
  ) {}

  private initForm(): void {
    console.log(history.state);
    this.startDate = history.state.customStartDate;
    this.endDate = history.state.customEndDate;
    this.projectId = history.state.projectId || [];
    this.fetchProjects();
    if (this.projectId?.length > 0) {
      this.patchStateProjectIds(this.projectId);
    }
    this.formData = this.formBuilder.group({
      customStartDate: [],
      customEndDate: [],
      isToggled: [],
      isCallSupportAvailable: [],
    });
    this.followupsCount = 0;
    this.formData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formDataValue) => {
        console.log(formDataValue);
        if (formDataValue.customStartDate && formDataValue.customEndDate) {
          const startDate = this.formatDateTime(formDataValue.customStartDate);
          const endDate = this.formatDateTime(
            formDataValue.customEndDate,
            true
          );
          this.startDate = startDate;
          this.endDate = endDate;
          if (this.user.roleName.includes('Cp Approval')) {
            this.getCpWiseLeadsCount();
          }
          // this.updateChartOptions();
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

  //getting logged in user data from local storage
  private setUserFromLocalStorage(): void {
    const user = this.authService.getUser();
    console.log(user);
    if (user != null) {
      this.user = JSON.parse(user);
      console.log(this.user.roleName);
      if (
        this.user.roleName.toLocaleLowerCase().includes('cp approval') ||
        this.user.roleName
          .toLocaleLowerCase()
          .includes('assistant manager - channel sales')
      ) {
        this.isApproval = true;
        console.log(this.isApproval);
      }
      console.log(this.user.roleName);
      if (this.user.roleName.includes('Cp Approval')) {
        this.getCpWiseLeadsCount();
      }
    }
  }

  fetchFilterDays() {
    this.commanService.getRefDetailsByType(this.daysType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        this.days = response;
        this.handleDateRange(history.state);
        this.patchDateFilterAndFetchData();
      },
      error: (error: Error) => console.error(error),
    });
  }

  handleDaySelection(commanRef: CommonReferenceDetails) {
    if (commanRef.commonRefValue.includes('Custom')) {
      this.showDateRangePicker = true;
      this.dateRange = '';
    } else {
      this.dateRange = commanRef.commonRefKey;
      console.log(commanRef.commonRefKey);
      this.startDate = null;
      this.endDate = null;
      this.formData.patchValue({
        customStartDate: null,
        customEndDate: null,
      });
      // this.getCpDashBoardLeadsCount();
      if (this.user.roleName.includes('Cp Approval')) {
        this.getCpWiseLeadsCount();
      }
      // this.updateChartOptions();
      // this.fetchLeadsData();
      this.fetchLeadsDashboardCount();
      this.showDateRangePicker = false;
    }
  }

  private handleDateRange(state: any) {
    console.log(state.customEndDate, state.customStartDate);
    if (state.customStartDate && state.customEndDate) {
      this.showDateRangePicker = true;
      this.formData.patchValue({
        customStartDate: state.customStartDate,
        customEndDate: state.customEndDate,
      });
      this.selectedDay = this.days.find((day) =>
        day.commonRefValue.includes('Custom')
      );
    }
  }

  navigateToLeads() {
    console.log('this.cpUserId' + this.cpUserId);
    const route = 'layout/presales/cp/leads';
    // Define the state object with the necessary properties
    const state = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.startDate,
      customEndDate: this.endDate,
      cpUserId: this.cpUserId,
      isDashBoard: true,
      dashboard: 'Yes',
      projectId: this.projectId,
      expried: this.isExpried,
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
    const route = 'layout/presales/cp/followups';
    this.router
      .navigate([route], {
        state: {
          dateRange: this.dateRange,
          statusIds: statusId,
          customStartDate: this.startDate,
          customEndDate: this.endDate,
          cpUserId: this.cpUserId,
          isFromDashBoard: true,
        },
      })

      .then(() => {
        console.log('Status IDs after navigation:', state);
      })
      .catch((err) => {
        console.error('Navigation error:', err);
      });
  }

  getCpWiseLeadsCount(): void {
    this.isLoading = true;
    this.leadService
      .fetchCpWiseData(
        this.user.userId,
        this.user.roleId,
        this.dateRange,
        this.startDate,
        this.endDate,
        this.projectId,
        this.isExpried
      )
      .subscribe({
        next: (response: any) => {
          this.isLoading = false;
          // this.teamData = response;
          this.cPDashBoardData = response;
          const data = this.aggregateUserStatuses(response);
          this.teamData = data;
          this.updateChartOptions(this.teamData);
          this.filteredData.data = this.teamData;
        },
        error: (error) => console.error(error),
      });
  }
  aggregateUserStatuses(data: any) {
    const userStatusMap: { [userName: string]: any } = {};

    data?.forEach((item: any) => {
      const userName = item.userName;

      // Initialize user entry if it doesn't exist
      if (!userStatusMap[userName]) {
        userStatusMap[userName] = {
          userId: item.userId,
          userName: userName,
          companyName: item.companyName,
          registeredLeads: item.assignedLeads,
          followUps: 0,
          followupIds: [],
          followupId: item.followUpsStatusId,
          followUp: item.followUps || 0,
          noOfSiteVisitDone: item.siteVisitDone || 0,
          siteVisitDoneId: item.siteVisitDoneId || 0,
          lost: item.lost || 0,
          lostId: item.lostStatusId || 0,
          booked: item.booked || 0,
          bookedId: item.bookedStatusId || 0,
          bookedCancelled: item.bookedCancelled || 0,
          bookedCancelledId: item.bookedCancelledStatusId || 0,
          eoiReceived: item.eoiReceived || 0,
          eoiReceivedId: item.eoiReceivedId || 0,
          newLeads: item.newLeads || 0,
          newLeadId: item.newLeadId || 0,
          unassignedLead: item.unassignedLead | 0,
          salesFollowUpId: item.salesFollowUpId | 0,
          salesFollowUp: item.salesFollowUp | 0,
          salesLost: item.salesLost | 0,
          salesLostId: item.salesLostId | 0,
          salesJunk: item.salesJunk | 0,
          salesJunkId: item.salesJunkId1 | 0,
          salesNoncontactable: item.salesNoncontactable | 0,
          salesNoncontactableId: item.salesNoncontactableId | 0,
          salesDND: item.salesDND | 0,
          salesDNDId: item.salesDNDId | 0,
        };
      }

      // Aggregate statuses into followUps and booked
      //userStatusMap[userName].followUps += item.followUps || 0;
      // userStatusMap[userName].followUps += item.nonContactable || 0;
      // userStatusMap[userName].followUps += item.visitProspect || 0;
      // userStatusMap[userName].followUps += item.qualified || 0;
      // userStatusMap[userName].followUps += item.lost || 0;
      userStatusMap[userName].followUps += item.revisitPropsed || 0;
      userStatusMap[userName].followUps += item.siteVisitConfirm || 0;
      // userStatusMap[userName].followUps += item.junk || 0;

      // Aggregate followup IDs
      // if (item.followUpsStatusId) {
      //   userStatusMap[userName].followupIds.push(item.followUpsStatusId);
      // }
      if (item.revisitPropsedId) {
        userStatusMap[userName].followupIds.push(item.revisitPropsedId);
      }
      // if (item.nonContactableStatusId) {
      //   userStatusMap[userName].followupIds.push(item.nonContactableStatusId);
      // }
      // if (item.visitProspectStatusId) {
      //   userStatusMap[userName].followupIds.push(item.visitProspectStatusId);
      // }
      if (item.siteVisitConfirmStatusId) {
        userStatusMap[userName].followupIds.push(item.siteVisitConfirmStatusId);
      }
      // if (item.qualifiedStatusId) {
      //   userStatusMap[userName].followupIds.push(item.qualifiedStatusId);
      // }
      // if (item.junkStatusId) {
      //   userStatusMap[userName].followupIds.push(item.junkStatusId);
      // }
      // if (item.lostStatusId) {
      //   userStatusMap[userName].followupIds.push(item.lostStatusId);
      // }
    });

    // Convert the map to an array
    return Object.values(userStatusMap);
  }

  applyFilter(event: Event, column: string): void {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.filteredData.filterPredicate = (data: any, filter: string) => {
      const value = data[column]?.toString().toLowerCase();
      return value.includes(filter);
    };
    this.filteredData.filter = filterValue;
  }

  onRowClick(row: any) {
    console.log(row);
  }

  onAssignedLeadsCellClick(userId: any) {
    this.cpUserId = userId;
    this.navigateToLeads();
  }

  onCellClick(statusId: any, userId: number) {
    console.log(statusId, userId);
    this.cpUserId = userId;
    if (statusId != 0) {
      this.navigateToFollowups('', statusId);
    }
  }
  @ViewChild('chart') chart: ChartComponent | undefined;
  public chartOptions: Partial<ApexOptions> = {};

  // updateChartOptions(teamData: any) {
  //   console.log( this.isShow);

  //   if(teamData!=null){
  //     this.isShow=true;
  //     console.log( this.isShow);
  //   }
  //   // this.isShow=false;
  //   this.chartOptions = {
  //     series: teamData.map((data: any) => data.registeredLeads || 0),
  //     chart: {
  //       width: 380,
  //       type: 'pie',
  //     },
  //     labels: teamData.map((data: any) => data.userName),
  //     responsive: [
  //       {
  //         breakpoint: 480,
  //         options: {
  //           chart: {
  //             width: 200,
  //           },
  //           legend: {
  //             position: 'bottom',
  //           },
  //         },
  //       },
  //     ],
  //   };
  // }
  updateChartOptions(teamData: any) {
    // Check if teamData is not null or empty
    if (teamData && teamData.length > 0) {
      this.isShow = true; // Show the chart
      console.log(teamData.map((data: any) => data.registeredLeads || 0));

      this.chartOptions = {
        series: teamData.map((data: any) => data.registeredLeads || 0),
        chart: {
          width: 380,
          type: 'pie',
        },
        labels: teamData.map((data: any) => data.userName),
        colors: ['#008080', '#33FF57', '#3357FF', '#FFC300', '#6A5ACD'],
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
    } else {
      this.isShow = false; // Hide the chart if no data
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onUserSelect(event: any) {
    this.userId = event.option.value.userId;
    this.login.identifier = event.option.value.email;
    this.login.password = event.option.value.showPassword;
    this.userService.login(this.login).subscribe({
      next: (response) => {
        this.user = response.userDto;
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
  fetchUser() {
    this.userService
      .getUserByManagerId(this.Mainuser.userId, this.userName)
      .subscribe({
        next: (UserDetails) => {
          this.UserDetails = UserDetails;
          this.getAllScrollNotifications();
        },
        error: (error) => {
          console.error('Error fetching UserDetails:', error);
        },
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

  followups: number = 0;
  closedLeads: number = 0;
  lostLeads: number = 0;
  nonContactableLeads: number = 0;
  siteVisitProspectFollowups: number = 0;
  totalBookedLeadsCount: number = 0;
  bookedCancelledCount: number = 0;

  //added
  fetchLeadsDashboardCount() {
    this.leadCommonService.showLoading();
    this.followupCount = 0;
    this.followupsCount = 0;
    this.siteVisitDoneCount = 0;
    this.siteVisitProspectFollowups = 0;
    this.nonContactableCount = 0;
    this.bookedCount = 0;
    this.bookedCancelledCount = 0;
    this.assignedLeads = 0;
    this.newLeads = 0;
    this.unassignedLeads = 0;
    this.leadService;
    this.leadService
      .fetchLeadsDashboardCountV1(
        this.user.userId,
        this.user.roleId,
        '',
        this.dateRange ? this.dateRange : 0,
        this.startDate,
        this.endDate,
        this.projectId,
        0,
        0,
        '',
        '',
        '',
        this.isExpried
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (record) => {
          this.leadCommonService.hideLoading();

          this.assignedLeads = record.assignedLeads;
          this.unassignedLeads = record.unassignedLeads;
          this.newLeads = record.newLeads;
          this.siteVisitDoneCount = record.siteVisitDone;
          this.siteVisitDoneStatusId = record.siteVisitDoneId;
          this.bookedCount = record.booked;
          this.lostCount = record.lost;
          this.bookedId = record.bookedId;
          this.lostId = record.lostId;
          this.bookedCanceledCount = record.cancelledBookings;
          this.bookedCancelledId = record.cancelledBookingsId;
          this.newLeadId = record.newLeadId;
          this.eoiReceived = record.eoiReceived;
          this.eoiReceivedStatus = record.eoiReceivedStatus;
          this.eoiReceivedId = record.eoiReceivedId;
          this.salesDNDId = record.salesDNDId;
          this.salesDNDcount = record.salesDND;
          this.salesNonContactable = record.salesNoncontactable;
          this.salesNonContactableId = record.salesNoncontactableId;
          this.salesJunkCount = record.salesJunk;
          this.salesJunkId = record.salesJunkId;
          this.salesLostCount = record.salesLost;
          this.salesLostId = record.salesLostId;
          this.salesFollowupCount = record.salesFollowUp;
          this.salesFollwupId = record.salesFollowUpId;
          if (record.followUp) {
            // this.followupsCount = record.followUp;
            this.followupCount = record.followUp;
            this.followupId = record.followUpId;
          }

          if (record.siteVisitConfirmId) {
            this.followupsCount = record.siteVisitConfirm;
            this.followupIds.push(record.siteVisitConfirmId);
          }
          if (record.reVisitProposedId) {
            this.followupsCount += record.reVisitProposed;
            this.followupIds.push(record.reVisitProposedId);
          }
        },
        error: () => {
          this.leadCommonService.hideLoading();
        },
      });
  }

  onStatusclick(statusId: any, userId: any) {
    this.cpUserId = userId;
    this.navigateToLeadsByStatus(statusId);
  }
  navigateToLeadsByStatus(statusId: any) {
    console.log('statusId' + statusId);

    console.log(this.dateRange);
    console.log('userid of cp...........' + this.cpUserId);

    console.log('Navigating to leads');
    const route = 'layout/presales/cp/leads';
    // Define the state object with the necessary properties
    const state = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.startDate,
      customEndDate: this.endDate,
      cpUserId: this.cpUserId,
      isDashBoard: true,
      statusId: statusId,
      dashboard: 'yes',
      projectId: this.projectId,
      expried: this.isExpried,
    };
    // Set the state in the StateService
    this.stateService.setState('stateData', state);
    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }

  patchDateFilterAndFetchData() {
    const dayToFind = history.state.dateRange;
    const startDate = history.state.customStartDate;
    const endDate = history.state.customEndDate;
    // alert(dayToFind + ' ' + startDate + ' ' + endDate);
    // const start
    if (dayToFind !== undefined) {
      if (dayToFind === 0) {
        this.selectedDay = this.days.find((day) => day.commonRefKey === '0');
        this.dateRange = dayToFind;
      } else {
        this.dateRange = dayToFind;
        this.selectedDay = this.days.find(
          (day) => day.commonRefKey === dayToFind
        );
      }
      this.fetchLeadsDashboardCount();
      if (this.user.roleName.includes('Cp Approval')) {
        this.getCpWiseLeadsCount();
      }
    } else {
      this.selectedDay = this.days.find((day) => day.commonRefKey === '0');
    }
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
    }
    // this.fetchLeadsDashboardCount();
    // this.getCpWiseLeadsCount();
  }
  convertToDateTime(dateString: string): Date {
    // Replace 'T' with a space to create a valid date string
    const formattedString = dateString.replace('T', ' ').substring(0, 26); // Keep only up to 26 characters for microsecond precision
    return new Date(formattedString);
  }

  onToggle(event: any) {
    const currentToggleState = event.checked;

    // Open the confirmation dialog
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: {
        displayedData: `turn CALL SUPPORT ${
          currentToggleState ? 'ON' : 'OFF'
        }?`,
      },
    });

    // Wait for confirmation result
    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          // If confirmed, apply the toggle change
          this.onConfirmCallSupport(currentToggleState);
        } else {
          // If not confirmed, revert the toggle state
          this.isToggled = !currentToggleState;
          event.source.checked = !currentToggleState;
        }
      }
    );
  }

  onConfirmCallSupport(isToggled: boolean) {
    this.isToggled = isToggled;

    // Update form value based on toggle state
    this.formData.patchValue({
      isCallSupportAvailable: this.isToggled ? 'Y' : 'N',
    });

    const channelPartner: IChannelPartnerRegisterBean = {
      id: this.cpRegisterId,
      name: '',
      email: '',
      phoneNumber: '',
      password: '',
      officeNumber: '',
      address: '',
      companyName: '',
      companyWebsite: '',
      registeredDate: new Date(0),
      dateOfBirth: new Date(0),
      idProofs: [],
      idProofNumber: '',
      showAdditionalFields: false,
      personName: '',
      personPhoneNumber: 0,
      personemail: '',
      designation: '',
      reraExpDate: new Date(0),
      isCanBulkUpload: '',
      bulkUploadLimit: 0,
      isCallSupportAvailable: this.formData.value.isCallSupportAvailable,
      aadharUrl: '',
      panUrl: '',
      reraUrl: '',
      personUrl: '',
      gstCertificateUrl: '',

      status: '',

      cpUserId: 0,
      pageUrl: '',
      gstNumber: '',
      reraNumber: '',
      alternatePhoneNumber: '',
      aadharNumber: '',
      panNumber: '',
      sourceId: 0,
      isFromNewChannelPartner: false,
      isToggled: false,
    };

    this.cpService.updateApprovedChannelPartner(channelPartner).subscribe({
      next: (data) => {
        Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'OK',
        });
      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          title: 'Error!',
          text: error.error.message || 'An unexpected error occurred.',
          icon: 'error',
          confirmButtonText: 'Try Again',
        });
      },
      complete: () => {
        console.log('Request completed.');
      },
    });
  }

  getNotifications() {
    this.projectService
      .getNotifications(this.user.roleId, this.user.userId)
      .subscribe({
        next: (record) => {
          console.log(record);
          this.notifications = record;
        },
        error: () => {},
      });
  }

  fetchCpDetails() {
    const user = localStorage.getItem('user');
    const userJson = user ? JSON.parse(user) : null;
    this.cpRegisterId = userJson?.cpRegisterId;
    this.cpService.getCpById(userJson?.cpRegisterId).subscribe((res) => {
      console.log('Is CALL SUPPORT AVAILABLE ' + res.isCallSupportAvailable);
      if (res.isCallSupportAvailable === 'N') {
        this.isToggled = false;
        this.formData.patchValue({ isCallSupportAvailable: 'N' });
      } else {
        this.isToggled = true;
        this.formData.patchValue({ isCallSupportAvailable: 'Y' });
      }
      this.cpDetails = res;
    });
  }

  navigateToUnassignedLeads(userId: any) {
    console.log('unassigned leads');
    const userRoleLower = 'presale';
    let route = userRoleLower.includes('presale')
      ? 'layout/presales/leads/PST'
      : 'layout/sales/leads/ST';

    // Define the state object with the necessary properties
    const state = {
      dateRange: this.dateRange,
      isMenuLeads: false,
      customStartDate: this.startDate,
      customEndDate: this.endDate,
      projectId: this.projectId,
      // statusId: this.newLeadId,
      dashboard: 'Yes',
      // isSalesHeadDashboard: true,
      isUnassignedLeads: true,
      cpUserId: userId,
      expried: this.isExpried,
    };
    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
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

  isSelectedProject(projectId?: number): boolean {
    return this.selectedprojectIds?.includes(projectId);
  }

  fetchProjectsByIds(selectedIds: any) {
    this.projectName = this.projectName || '';
    this.projectService
      .getProjectsByIds(
        this.projectName,
        this.user.organizationId,
        selectedIds,
        'Y'
      )
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
    this.project.patchValue('');
    this.projectService
      .getProjectsByIds('', this.user.organizationId, selectedIds, 'Y')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects: any) => {
          console.log(projects);
          this.projects = this.sortProject(this.projects, selectedIds);
          const selectedNames = projects
            .map((project: any) => project.projectName)
            .join(', ');
          console.log(selectedNames);
          this.project.patchValue(selectedNames);
          this.selectedprojectIds = selectedIds;
          console.log(this.selectedprojectIds);
          this.projectId = this.selectedprojectIds;
          console.log(this.projectId);
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
    console.log(this.allProjectSelected.checked);
    // this.allProjectChecked=this.allProjectSelected.checked
    if (this.allProjectSelected.checked) {
      this.selectedprojectIds = this.projects.map((p: any) => p.projectId, 0);
    } else {
      this.selectedprojectIds = [];
    }
    console.log(this.projectId);
    //this.projectId = this.selectedprojectIds
    this.displayProjectNames();
  }

  displayProjectNames() {
    if (this.selectedprojectIds.length > 0) {
      this.projectService
        .getProjectsByIds(
          '',
          this.user.organizationId,
          this.selectedprojectIds,
          'Y'
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (projects: any) => {
            console.log(projects);
            this.projects = this.sortProject(
              this.projects,
              this.selectedprojectIds
            );
            const selectedNames = projects
              .map((project: any) => project.projectName)
              .join(', ');
            console.log(selectedNames);
            this.project.patchValue(selectedNames);
          },
        });
    } else {
      this.project.patchValue('');
    }
  }

  isProjectAllSelected(): boolean {
    const allProjectIds = this.projects.map((p) => p.projectId);
    return (
      Array.isArray(this.selectedprojectIds) &&
      allProjectIds.length > 0 &&
      allProjectIds.every((id) => this.selectedprojectIds.includes(id))
    );
  }

  onProjectSelect(project: any, event: any) {
    //this.allProjectChecked=false;
    this.project.patchValue('');
    console.log(event);

    const selectedProject = project.projectId;
    console.log('selected project id' + selectedProject);

    // Get the sub-source ID
    console.log(this.selectedprojectIds);
    if (event.checked) {
      if (!this.selectedprojectIds) {
        this.selectedprojectIds = [];
      }
      this.selectedprojectIds?.push(selectedProject);
      this.displayProjectNames();
      // alert(this.selectedSubSourcesIds); // Add to selected IDs
    } else {
      // Remove sub-source ID from selected IDs
      this.selectedprojectIds = this.selectedprojectIds?.filter(
        (id: any) => id !== selectedProject
      );
      console.log(this.selectedprojectIds);
      if (this.selectedprojectIds?.length > 0) {
        this.displayProjectNames();
      } else if (this.selectedprojectIds?.length == 0) {
        this.project.patchValue('');
      }
    }
    // this.projectId = this.selectedprojectIds
    console.log(this.projectId);
  }

  onProjectSelectButtonClick() {
    this.projectId = this.selectedprojectIds;
    this.fetchLeadsDashboardCount();
    if (this.user.roleName.includes('Cp Approval')) {
      this.getCpWiseLeadsCount();
    }
  }

  getCpWiseLeadsCountDownload(): void {
    console.log('start date and end date ', this.startDate, this.endDate);
    this.leadService
      .fetchCpWiseDataForDownload(
        this.user.userId,
        this.user.roleId,
        this.dateRange,
        this.startDate,
        this.endDate,
        this.projectId
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.downloadXLSFile(
            response,
            'Cp Lead Report' + Date.now().toString(),
            false
          );
        },
        error: (error) => console.error(error),
      });
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

  onToggleExpried(event: any) {
    const currentToggleState = event.checked;
    if (currentToggleState) {
      this.isExpried = '';
    } else {
      this.isExpried = 'N';
    }
    this.fetchLeadsDashboardCount();
    if (this.user.roleName.includes('Cp Approval')) {
      this.getCpWiseLeadsCount();
    }
  }

  // getAllScrollNotifications() {
  //   this.projectService
  //     .getAllNotifications(0, this.user.roleId, this.notificationTypeId)
  //     .subscribe({
  //       next: (record) => {
  //         this.scrollNotifications = record;
  //         if (Array.isArray(record) && record.length > 0) {
  //           // Find the latest unread notification (customize as needed)
  //           const latestUnread = record[0];
  //           if (latestUnread && latestUnread.messageBody) {
  //             Swal.fire({
  //               title: 'Notification',
  //               text: latestUnread.messageBody,
  //               icon: 'info',
  //               confirmButtonText: 'I Understand',
  //             });
  //           }
  //         }
  //       },
  //       error: () => {},
  //     });
  // }

  getAllScrollNotifications() {
    this.projectService
      .getAllNotifications(0, this.user.roleId, this.notificationTypeId)
      .subscribe({
        next: (record) => {
          this.scrollNotifications = record;
          const shownAlready = localStorage.getItem('notificationShown');
          if (shownAlready) return;

          const latestUnread = record?.[0];
          if (latestUnread?.messageBody) {
            Swal.fire({
              title: 'Notification',
              text: latestUnread.messageBody,
              icon: 'info',
              // showCancelButton: true,
              confirmButtonText: 'I Understand',
              // cancelButtonText: 'View Terms & Conditions',
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                localStorage.setItem('notificationShown', 'true');
              } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Open Terms & Conditions in a new tab or modal
                this.router.navigate([
                  'layout/presales/cp/terms-and-conditions',
                ]);
                localStorage.setItem('notificationShown', 'true');
              }
            });
          }
        },
        error: () => {},
      });
  }

  fetchEventTypes() {
    this.commonService.getRefDetailsByType(this.notificationType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        response.forEach((e) => {
          const key = e.commonRefKey?.toLowerCase();
          if (key === 'alert') {
            this.alertTypeId = e.id;
          } else if (key === 'notify') {
            this.notificationTypeId = e.id;
          }
        });
      },
      error: (error) => console.error('Failed to fetch event types:', error),
    });
  }
}
