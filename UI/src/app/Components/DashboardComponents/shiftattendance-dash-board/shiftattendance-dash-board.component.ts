import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { NavigationEnd, Router } from '@angular/router';
import { ChartComponent } from 'chart.js';
import { error } from 'highcharts';
import { ApexOptions } from 'ng-apexcharts';
import { filter, Subject, takeUntil } from 'rxjs';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { AttendanceDto } from 'src/app/Models/Facility Management/AttendanceDto';
import { AttendanceCountDto } from 'src/app/Models/Facility Management/AttendanceReport';
import { LocationDto } from 'src/app/Models/Facility Management/Location';
import { MapDto, TeamDashBoardDataDto } from 'src/app/Models/Presales/lead';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { Login } from 'src/app/Models/User/Login';
import { User } from 'src/app/Models/User/User';
import { UserDto } from 'src/app/Models/User/UserDto';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { StateServiceService } from 'src/app/Services/CommanService/state-service.service';
import { ShiftAttendanceService } from 'src/app/Services/FacilityManagement/shiftattendance-service.service';
import { QrgeneratorService } from 'src/app/Services/Qrgenerator/qrgenerator.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-Attendance-dash-board',
  templateUrl: './shiftattendance-dash-board.component.html',
  styleUrls: ['./shiftattendance-dash-board.component.css'],
})
export class ShiftAttendanceDashBoardComponent implements OnInit {
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<any>;
  newPresent: number = 0;
  newAbsent: number = 0;
  user: User[] = [];
  private destroy$ = new Subject<void>();
  today: any;
  earlyLeaverCount: number = 0;
  newWorkingDays: number = 0;
  UserDetails: UserDto[] = [];
  showDatePicker: boolean = false; // Initially hide the date picker
  Mainuser: User = new User();
  lateComerCount: number = 0;
  notifications: any;
  selectedDay: any;
  daysType: string = 'Filter_Days';
  dateRange: any = 0;
  startDate: any;
  formData!: FormGroup;
  endDate: any;
  days: CommonReferenceDetails[] = [];
  isMenuAttendance = true;
  attendanceCount: AttendanceCountDto[] = [];
  customStartDate: any;
  customEndDate: any;
  attendanceData: AttendanceDto[] = [];
  userName: string = '';

  userId: number = 0;
  organizationId: number = 0;
  status: string = '';
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  isLateComer: boolean = false;
  shiftTiming: string = 'Shift_Timings';
  locationForOrg: LocationDto[] = [];
  shiftTimingList: CommonReferenceDetails[] = [];
  shiftId: any;
  showDateRangePicker = false;
  selectlocationId: number = 0;

  constructor(
    private router: Router,
    private commonService: CommanService,
    private formBuilder: FormBuilder,
    private stateService: StateServiceService,
    private authService: AuthService,
    private userService: UserService,
    private attendanceService: ShiftAttendanceService,
    private qrgenerator: QrgeneratorService
  ) {}

  // onPageChange(event: any) {
  //   this.pageSize = event.pageSize;
  //   this.pageIndex = event.pageIndex;
  // }
  ngOnInit() {
    this.today = new Date().toDateString();
    this.getNotifications();

    const user = localStorage.getItem('user');
    this.Mainuser?.userId;

    if (user) {
      this.Mainuser = JSON.parse(user);
      // this.fetchUser();
    }
    const userId = this.Mainuser?.userId;
    const organizationId = this.Mainuser?.organizationId;

    // if (this.MainUser) {
    //   this.Mainuser = JSON.parse(this.state.history.user);

    // }
    this.initForm();

    this.fetchShiftTimings();
    this.fetchFilterDays();
    this.userId = userId;
    this.organizationId = organizationId;
    this.navigateToCount();
    this.fetchLocationFOrOrganization();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    // if (this.chart) {
    //   this.chart.destroy();
    // }
  }

  handleDaySelection(commanRef: CommonReferenceDetails) {
    console.log(commanRef.commonRefKey);
    this.dateRange = commanRef.commonRefKey;
    if (commanRef.commonRefValue.includes('Custom')) {
      this.showDateRangePicker = true;
      this.dateRange = '';
    } else {
      this.dateRange = commanRef.commonRefKey;
      this.startDate = null;
      this.endDate = null;
      this.formData.patchValue({
        customStartDate: null,
        customEndDate: null,
      });

      this.navigateToCount();

      this.showDateRangePicker = false;
    }
  }
  navigateToPresent() {
    // Set the status to "Present"
    this.status = 'Logged In'; // Update the status variable accordingly
    let route = 'layout/shiftattendance';
    let isLateComer = false;
    let isEarlyLeaver = false;
    // Now, you can fetch the attendance data
    const state = {
      userName: this.userName,
      userId: this.userId,

      customStartDate: this.startDate,
      customEndDate: this.endDate,
      dateRange: this.dateRange,
      startDate:
        this.dateRange && this.customStartDate ? this.customStartDate : '',
      endDate:
        this.dateRange && this.customStartDate
          ? new Date(new Date(this.customStartDate).setHours(23, 59, 59, 999))
              .toISOString()
              .replace('Z', '')
          : '',
      status: this.status,

      isLateComer: isLateComer,
      isEarlyLeaver: isEarlyLeaver,
      shiftId: this.shiftId,
      selectlocationId: this.selectlocationId,
    };

    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }

  combineDateAndTime(date: string, time: string): string {
    // Parse the date
    const [year, month, day] = date.split('T')[0].split('-');

    // Format the date as dd/MM/yyyy
    const formattedDate = `${day}/${month}/${year}`;

    // Parse and format the time
    const [hours, minutes] = time.split(':').map(Number);

    // Convert to 12-hour format with AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for AM
    const formattedMinutes = String(minutes).padStart(2, '0');

    // Combine date and time
    return `${formattedDate} ${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  @ViewChild('chart') chart: ChartComponent | undefined;

  public chartOptions: Partial<ApexOptions> = {};
  searchUserName(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
  }
  private initForm(): void {
    this.formData = this.formBuilder.group({
      customStartDate: [],
      customEndDate: [],
    });
    this.formData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (formDataValue: { customStartDate: Date; customEndDate: Date }) => {
          if (formDataValue.customStartDate && formDataValue.customEndDate) {
            const startDate = this.formatDateTimeDateRange(
              formDataValue.customStartDate
            );
            const endDate = this.formatDateTimeDateRange(
              formDataValue.customEndDate,
              true
            );

            console.log(this.customStartDate);
            this.customStartDate;

            this.startDate = startDate;
            this.endDate = endDate;

            this.navigateToCount();
          }
        }
      );
  }
  formatDateTimeDateRange(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }

  // No need to handle endDate as you're now dealing with a single date
  // formatDateTime(date: Date): string {
  //   return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  // }

  // onUserSelected(selectedUser: any) {
  //   if (selectedUser) {
  //     // Check if the selected user meets your criteria to show the date picker
  //     this.showDateRangePicker = true; // Adjust logic as needed
  //   } else {
  //     this.showDateRangePicker = false;
  //   }
  // }

  fetchFilterDays() {
    this.commonService.getRefDetailsByType(this.daysType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        const excludeStrings = [
          'Tomorrow',
          'Next 7 Days',
          'Next 30 Days',
          'Day After',
        ];

        this.days = response.filter((day) => {
          return !excludeStrings.includes(day.commonRefValue); // Replace with your actual property
        });
        this.selectedDay = this.days.find((day) => day.commonRefKey === '0');
      },
      error: (error) => console.error(error),
    });
  }

  // fetchUser() {
  //   this.userService
  //     .getUserByManagerId(this.Mainuser.userId, this.userName)
  //     .subscribe({
  //       next: (UserDetails) => {
  //         this.UserDetails = UserDetails;
  //       },
  //       error: (error) => {
  //         console.error('Error fetching UserDetails:', error);
  //       },
  //     });
  // }
  onselectUserName(event: any) {
    const userId = event.option.value.userId;
    const selectedUserId = this.UserDetails.find(
      (pa) => pa.userId === this.userId
    );
    console.log(userId);
    this.initForm();
  }
  getNotifications() {
    this.attendanceService.getNotifications().subscribe({
      next: (record) => {
        console.log(record);
        this.notifications = record;
      },
      error: () => {},
    });
  }

  navigateToCount() {
    console.log('ENTERING');

    this.attendanceService
      .getPresent(
        this.Mainuser.userId,
        this.organizationId,
        this.dateRange,
        this.startDate,
        this.endDate,
        this.shiftId,
        this.selectlocationId
      )
      .subscribe({
        next: (resp) => {
          console.log(resp, 'response');

          // Initialize counts to zero
          this.newPresent = 0;
          this.newAbsent = 0;
          this.earlyLeaverCount = 0;
          this.lateComerCount = 0;

          // Check if response is not empty
          if (resp.length > 0) {
            resp.forEach((item) => {
              if (item.attendanceStatus === 'Logged In') {
                this.newPresent = item.count;
              } else if (item.attendanceStatus === 'Not Logged In') {
                this.newAbsent = item.count;
              }
            });

            // Set early leaver and late comer counts from the first item
            this.earlyLeaverCount = resp[0].earlyLeaverCount || 0; // Default to 0 if undefined
            this.lateComerCount = resp[0].lateComerCount || 0; // Default to 0 if undefined
          }
        },
        error: (error) => {
          console.error('Error fetching UserDetails:', error);
        },
      });
  }
  displayAttendanceUserName(UserDetails: User) {
    return UserDetails && UserDetails.userName ? UserDetails.userName : '';
  }

  navigateToAbsent() {
    let isLateComer = false;
    let isEarlyLeaver = false;

    this.status = 'Not Logged In'; // Update the status variable accordingly
    let route = 'layout/shiftattendance';
    // Now, you can fetch the attendance data
    const state = {
      userName: this.userName,
      userId: this.userId,
      // pageIndex: this.pageIndex,
      // pageSize: this.pageSize,
      dateRange: this.dateRange,
      startDate:
        this.dateRange && this.customStartDate ? this.customStartDate : '',
      endDate:
        this.dateRange && this.customStartDate
          ? new Date(new Date(this.customStartDate).setHours(23, 59, 59, 999))
              .toISOString()
              .replace('Z', '')
          : '',
      status: this.status,
      isLateComer: isLateComer,
      isEarlyLeaver: isEarlyLeaver,
      shiftId: this.shiftId,
      selectlocationId: this.selectlocationId,
    };

    console.log(state);

    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }
  navigateToWorkingDays() {}

  navigateToLateCommer() {
    console.log('Navigating to late comer attendance');

    this.status = 'Logged In'; // Set the status
    let route = 'layout/shiftattendance';
    let isEarlyLeaver = false;
    // Define isLateComer based on your condition
    let isLateComer = true; // You can dynamically set this based on your logic

    // Now, fetch the attendance data and include isLateComer in the state
    const state = {
      userName: this.userName,
      userId: this.userId,
      // pageIndex: this.pageIndex,
      // pageSize: this.pageSize,
      dateRange: this.dateRange,
      startDate:
        this.dateRange && this.customStartDate ? this.customStartDate : '',
      endDate:
        this.dateRange && this.customStartDate
          ? new Date(new Date(this.customStartDate).setHours(23, 59, 59, 999))
              .toISOString()
              .replace('Z', '')
          : '',
      status: this.status,
      isLateComer: isLateComer,
      isEarlyLeaver: isEarlyLeaver, // Adding isLateComer flag
      selectlocationId: this.selectlocationId,
    };

    console.log(state);

    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }

  navigateToEarlyLeaver() {
    console.log('Navigating to late comer attendance');

    this.status = 'Logged In'; // Set the status
    let route = 'layout/shiftattendance';

    // Define isLateComer based on your condition
    let isEarlyLeaver = true; // You can dynamically set this based on your logic
    let isLateComer = false;
    // Now, fetch the attendance data and include isLateComer in the state
    const state = {
      userName: this.userName,
      userId: this.userId,
      // pageIndex: this.pageIndex,
      // pageSize: this.pageSize,
      dateRange: this.dateRange,
      startDate:
        this.dateRange && this.customStartDate ? this.customStartDate : '',
      endDate:
        this.dateRange && this.customStartDate
          ? new Date(new Date(this.customStartDate).setHours(23, 59, 59, 999))
              .toISOString()
              .replace('Z', '')
          : '',
      status: this.status,
      isLateComer: isLateComer,
      isEarlyLeaver: isEarlyLeaver, // Adding isLateComer flag
    };

    console.log(state);

    // Set the state in the StateService
    this.stateService.setState('stateData', state);

    // Navigate to the desired route with the state data
    this.router.navigate([route], {
      state: state,
    });
  }
  // fetchShiftTimings() {
  //   console.log('entering attendance status');

  //   this.commonService.getRefDetailsByType(this.shiftTiming).subscribe({
  //     next: (response: CommonReferenceDetails[]) => {
  //       this.shiftTimingList = response;
  //       console.log(this.shiftTimingList);
  //     },
  //     error: (error) => console.error(error),
  //   });
  // }
  fetchShiftTimings() {
    console.log('entering attendance status');

    this.commonService.getRefDetailsByType(this.shiftTiming).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        this.shiftTimingList = response;
        console.log(this.shiftTimingList);
        this.shiftTimingList.unshift({
          id: 0,
          commonRefKey: '',
          commonRefValue: 'All Shifts',
          referenceTypeId: 0,
        });
        console.log(this.shiftTimingList);
      },
      error: (error) => console.error(error),
    });
  }

  selectedShift(shiftIds: number[]) {
    this.shiftId = shiftIds;
    console.log(this.shiftId);
    this.navigateToCount();
  }

  fetchLocationFOrOrganization() {
    this.qrgenerator.getAllLoctionByOrgId(this.organizationId).subscribe({
      next: (response: LocationDto[]) => {
        this.locationForOrg = response;
        console.log(this.locationForOrg);
      },
      error: (error) => console.log(error),
    });
  }

  selectedLocation(locationId: number) {
    this.selectlocationId = locationId;

    this.navigateToCount();
  }
}
