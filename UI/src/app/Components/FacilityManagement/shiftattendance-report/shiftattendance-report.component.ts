import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import {
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
} from 'src/app/Constants/CommanConstants/Comman';
import { Attendance } from 'src/app/Models/Facility Management/Attendance';
import { AttendanceReportDto } from 'src/app/Models/Facility Management/AttendanceReport';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { IUser, User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ShiftAttendanceService } from 'src/app/Services/FacilityManagement/shiftattendance-service.service';
import { HolidayService } from 'src/app/Services/LeaveService/Holiday/holiday.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { DatePipe } from '@angular/common';
import { Holiday } from 'src/app/Models/Leave/Holiday';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import { QrgeneratorService } from 'src/app/Services/Qrgenerator/qrgenerator.service';
import { LocationDto } from 'src/app/Models/Facility Management/Location';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './shiftattendance-report.component.html',
  styleUrls: ['./shiftattendance-report.component.css'],
})
export class ShiftAttendanceReportComponent {
  private destroy$ = new Subject<void>();
  loginUserId: number = 0;
  dateRange: any = 0;
  userName: string = '';
  user: User = new User();
  selectedUser: IUser = new User();
  userData: IUser[] = [];
  selectedUserId: number = 0;
  userId: number = 0;
  showDateRangePicker = false;
  daysType: string = 'Filter_Days';
  displayedColumns: string[] = ['name', 'location', 'present', 'absent'];
  startDate: any;
  endDate: any;
  totalItems: number = 0;
  formData!: FormGroup;
  days: CommonReferenceDetails[] = [];
  attendanceData: AttendanceReportDto[] = [];
  customStartDate: any;
  customEndDate: any;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;
  holidayData: Holiday[] = [];
  newWorkingDays: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  holidayName: string = '';
  selectedDay: any;
  locationForOrg: LocationDto[] = [];
  selectlocationId: number = 0;
  organizationId: number = 0;
  constructor(
    private commonService: CommanService,
    private attendanceService: ShiftAttendanceService,
    private formBuilder: FormBuilder,
    private holidayService: HolidayService,
    private datePipe: DatePipe,
    private userService: UserService,
    private qrgenerator: QrgeneratorService
  ) {}
  ngOnInit() {
    this.initForm();
    const user = localStorage.getItem('user');
    if (user) {
      console.log('user');
      this.user = JSON.parse(user);
      this.loginUserId = this.user.userId;
      this.organizationId = this.user.organizationId;
    }
    this.fetchFilterDays();
    this.initForm();
    this.fetchAttendance(this.userName);
    this.navigateToWorkingDays();
    this.fetchUserforAuto();
    this.fetchLocationFOrOrganization();
  }
  fetchUserforAuto() {
    this.attendanceService
      .getAllUser(this.loginUserId, this.userName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.userData = user;
          console.log(user);
        },
        error: (error: Error) => {
          console.error('Error fetching User : ', error);
        },
      });
  }
  private fetchUser(userId: number): void {
    this.userService
      .getUserById(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userData) => {
          console.log(userData, 'yyyyyyyyyyyyyyyy');
          this.selectedUser = userData;

          this.formData.patchValue({ userId: userData.userId });
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  displayUserForAuto(userData: User): string {
    console.log(userData);
    return userData && userData.userName ? userData.userName : '';
  }
  onUserSelectForAuto(event: any): void {
    this.userId = event.option.value.userId;
    this.fetchAttendance(this.userId);

    this.formData.patchValue({ userId: this.userId });
  }
  searchUserForAuto(event: any) {
    const query = event.target.value;
    console.log(event.target.value, query);
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.userName = query;
      this.fetchUserforAuto();
      this.fetchAttendance(this.userName);
    }

    // Fetch users from the server based on the search criteria
  }
  formatDateTime(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
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
            const startDate = this.formatDateTime(
              formDataValue.customStartDate
            );
            const endDate = this.formatDateTime(
              formDataValue.customEndDate,
              true
            );

            console.log(this.customStartDate);
            this.customStartDate;

            this.startDate = startDate;
            this.endDate = endDate;
            this.fetchAttendance(this.userName);
          }
        }
      );
  }

  fetchFilterDays() {
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
        this.handleDateRange(history.state);
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
    console.log(this.selectedDay);
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
      this.fetchAttendance(this.userName);

      this.showDateRangePicker = false;
    }
  }
  fetchAttendance(userName: any) {
    this.userName = userName;
    this.attendanceService
      .getAttendanceReport(
        this.userName,
        this.selectlocationId,
        this.loginUserId,
        this.user.roleId,
        this.pageIndex,
        this.pageSize,

        this.dateRange,
        this.startDate,
        this.endDate
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (attendanceData) => {
          console.log(attendanceData);

          this.attendanceData = attendanceData.records;
          this.totalItems = attendanceData.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  navigateToWorkingDays() {
    const currentDate = new Date(); // Get the current date
    const currentMonth = currentDate.getMonth() + 1; // Get month (0-11) and add 1

    // Format the month to always be two digits
    const formattedMonth = currentMonth.toString().padStart(2, '0');

    console.log(formattedMonth); // This will log '09' for September

    this.getAllHoliday(formattedMonth); // Pass the formatted month to the function
  }

  getDaysInCurrentMonth(): number {
    const currentDate = new Date(); // Get the current date
    const currentYear = currentDate.getFullYear(); // Get the current year
    const currentMonth = currentDate.getMonth(); // Get the current month (0-11)

    // Create a new date object for the first day of the next month
    const firstDayOfNextMonth = new Date(currentYear, currentMonth + 1, 1);

    // Subtract one day to get the last day of the current month
    const lastDayOfCurrentMonth = new Date(
      firstDayOfNextMonth.getTime() - 86400000
    );

    // Get the date (which represents the number of days in the current month)
    return lastDayOfCurrentMonth.getDate(); // Returns the total days in the current month
  }
  getAllHoliday(date: any): void {
    this.holidayName = date;
    this.holidayService
      .getAllHoliday(date, this.pageIndex, this.pageSize)
      .subscribe({
        next: (holidayData: any) => {
          this.holidayData = holidayData.records.map((record: any) => ({
            ...record,
            date: this.datePipe.transform(record.date, 'EEE MMM dd yyyy'),
          }));
          this.totalItems = holidayData.totalRecords;

          const totalDaysInCurrentMonth = this.getDaysInCurrentMonth();
          const remainingDays = totalDaysInCurrentMonth - this.totalItems;
          this.newWorkingDays = remainingDays;
        },
        error: (error: any) => console.error('Error fetching holiday:', error),
      });
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchAttendance(this.userName);
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
    this.paginator.firstPage();
    this.selectlocationId = locationId;
    this.fetchAttendance(this.userName);
  }
}
