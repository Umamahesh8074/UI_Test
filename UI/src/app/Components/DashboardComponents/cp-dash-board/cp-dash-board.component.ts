import { state } from '@angular/animations';
import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { Login } from 'src/app/Models/User/Login';
import { User } from 'src/app/Models/User/User';
import { UserDto } from 'src/app/Models/User/UserDto';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { StateServiceService } from 'src/app/Services/CommanService/state-service.service';
import { ChannelPartnerRegisterService } from 'src/app/Services/Presales/CPRegisterService/channel-partner-register.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cp-dash-board',
  templateUrl: './cp-dash-board.component.html',
  styleUrls: ['./cp-dash-board.component.css'],
})
export class ChannelPartnerDashBoardComponent implements OnInit {
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

  //leads count for channel partner
  registeredLeadsCount: number = 0;
  followupsCount: number = 0;

  siteVisitDoneCount: number = 0;
  bookedCount: number = 0;
  bookedCanceledCount: number = 0;
  followupIds: number[] = [];
  bookedId: any;
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
    'noOfSiteVisitDone',
    'booked',
    'bookedCancelled',
    'lost',
    'eoiReceived',
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
  scheduledVisits: number | undefined;
  nonContactableCount: any;
  newLeads: number = 0;
  assignedLeads: number = 0;
  newLeadId: number = 0;
  lostId: number = 0;
  lostCount: number = 0;
  isToggled: boolean = false;
  cpDetails: any;
  cpRegisterId: number = 0;
  unassignedLeads: number = 0;
  eoiReceivedStatus: any;
  eoiReceivedId: any;
  eoiReceived: any;
  //added
  ngOnInit(): void {
    // this.isToggled = true;
    const user = this.authService.getUser();
    if (user != null) {
      this.user = JSON.parse(user);
      console.log(this.user);
    }
    this.initForm();
    this.setUserFromLocalStorage();
    this.fetchCpDetails();

    this.fetchFilterDays();
    //this.fetchLeadsData();
    this.fetchLeadsDashboardCount();
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
    public dialog: MatDialog
  ) {}

  private initForm(): void {
    console.log(history.state);
    this.startDate = history.state.customStartDate;
    this.endDate = history.state.customEndDate;
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
          this.getCpWiseLeadsCount();
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
        console.log(this.user.roleName);
        this.isApproval = true;
        console.log(this.isApproval);
      }
      this.getCpWiseLeadsCount();
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
      console.log('ghjk');
      this.dateRange = commanRef.commonRefKey;
      console.log(commanRef.commonRefKey);
      this.startDate = null;
      this.endDate = null;
      this.formData.patchValue({
        customStartDate: null,
        customEndDate: null,
      });
      // this.getCpDashBoardLeadsCount();
      this.getCpWiseLeadsCount();
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
    console.log('start date and end date ', this.startDate, this.endDate);
    this.leadService
      .fetchCpWiseData(
        this.user.userId,
        this.user.roleId,
        this.dateRange,
        this.startDate,
        this.endDate
      )
      .subscribe({
        next: (response: any) => {
          console.log(response);

          // this.teamData = response;
          this.cPDashBoardData = response;
          console.log('cp dash board data', this.cPDashBoardData);
          const data = this.aggregateUserStatuses(response);
          console.log(data);
          this.teamData = data;

          this.updateChartOptions(this.teamData);
          console.log(this.teamData);
          this.filteredData.data = this.teamData;
          console.log('filtered data ' + this.filteredData.data);
        },
        error: (error) => console.error(error),
      });
  }
  aggregateUserStatuses(data: any) {
    const userStatusMap: { [userName: string]: any } = {};

    data?.forEach((item: any) => {
      const userName = item.userName;
      console.log('follow up....' + item.followUps);
      console.log('confirm....' + item.siteVisitConfirm);

      // Initialize user entry if it doesn't exist
      if (!userStatusMap[userName]) {
        userStatusMap[userName] = {
          userId: item.userId,
          userName: userName,
          companyName: item.companyName,
          registeredLeads: item.assignedLeads,
          followUps: 0,
          followupIds: [],
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
        };
      }

      // Aggregate statuses into followUps and booked
      userStatusMap[userName].followUps += item.followUps || 0;
      // userStatusMap[userName].followUps += item.nonContactable || 0;
      // userStatusMap[userName].followUps += item.visitProspect || 0;
      // userStatusMap[userName].followUps += item.qualified || 0;
      // userStatusMap[userName].followUps += item.lost || 0;
      userStatusMap[userName].followUps += item.siteVisitConfirm || 0;
      // userStatusMap[userName].followUps += item.junk || 0;

      // Aggregate followup IDs
      if (item.followUpsStatusId) {
        userStatusMap[userName].followupIds.push(item.followUpsStatusId);
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
    console.log('column', userId);
    this.cpUserId = userId;
    this.navigateToLeads();
  }

  onCellClick(statusId: any, userId: number) {
    console.log(statusId, userId);
    this.cpUserId = userId;
    console.log(statusId.length);

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
    console.log(teamData);

    // Check if teamData is not null or empty
    if (teamData && teamData.length > 0) {
      this.isShow = true; // Show the chart
      console.log(this.isShow);
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
      console.log(this.isShow);

      this.isShow = false; // Hide the chart if no data
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
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

  followups: number = 0;
  closedLeads: number = 0;
  lostLeads: number = 0;
  nonContactableLeads: number = 0;
  siteVisitProspectFollowups: number = 0;
  totalBookedLeadsCount: number = 0;
  bookedCancelledCount: number = 0;

  //added
  fetchLeadsDashboardCount() {
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
      .getProjectTeamReportForChannelPatner(
        this.user.userId,
        this.user.roleId,
        this.dateRange ? this.dateRange : 0,
        this.startDate,
        this.endDate,
        0,
        0,
        0
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (record) => {
          console.log(record);
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
          if (record.followUp) {
            console.log(record.followUp);
            this.followupsCount = record.followUp;
            this.followupIds.push(record.followUpId);
            console.log(this.followupsCount);
          }

          if (record.siteVisitConfirmId) {
            this.followupsCount += record.siteVisitConfirm;
            this.followupIds.push(record.siteVisitConfirmId);
          }

          console.log(this.followupIds);
        },
        error: () => {},
      });
  }

  onStatusclick(statusId: any, userId: any) {
    console.log('column', userId);
    console.log('statusId', statusId);
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
      this.getCpWiseLeadsCount();
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
      this.fetchLeadsDashboardCount();
    }
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
      projectId: '',
      // statusId: this.newLeadId,
      dashboard: 'Yes',
      // isSalesHeadDashboard: true,
      isUnassignedLeads: true,
      cpUserId: userId,
    };
    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }
}
