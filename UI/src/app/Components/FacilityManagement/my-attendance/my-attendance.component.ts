import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { Attendance } from 'src/app/Models/Facility Management/Attendance';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { AttendanceServiceService } from 'src/app/Services/FacilityManagement/attendance-service.service';

@Component({
  selector: 'app-my-attendance',
  templateUrl: './my-attendance.component.html',
  styleUrls: ['./my-attendance.component.css'],
})
export class MyAttendanceComponent {
  private destroy$ = new Subject<void>();
  userId: number = 0;
  dateRange: any = 0;
  UserName: string = '';
  user: User = new User();
  showDateRangePicker = false;
  daysType: string = 'Filter_Days';
  displayedColumns: string[] = [
    'inDateTime',
    'outDateTime',
    'attendanceStatus',
  ];
  startDate: any;
  endDate: any;
  totalItems: number = 0;
  formData!: FormGroup;
  days: CommonReferenceDetails[] = [];
  attendanceData: Attendance[] = [];

  customStartDate: any;
  customEndDate: any;
  pageSize: number = 5;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private commonService: CommanService,
    private attendanceService: AttendanceServiceService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit() {
    this.initForm();
    const user = localStorage.getItem('user');
    if (user) {
      console.log('user');
      this.user = JSON.parse(user);
      this.userId = this.user.userId;
    }
    this.fetchFilterDays();
    this.initForm();
    this.fetchMyAttendance();
  }

  onSearch(searchText: any) {
    this.UserName = searchText;
    this.paginator.firstPage();
    this.fetchMyAttendance();
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
            this.fetchMyAttendance();
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
      },
      error: (error) => console.error(error),
    });
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
      this.fetchMyAttendance();
      this.showDateRangePicker = false;
    }
  }
  fetchMyAttendance() {
    this.attendanceService
      .getMyAttendanceReport(
        this.userId,

        this.pageIndex,
        this.pageSize,

        this.dateRange,
        this.startDate,
        this.endDate
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (attendanceData) => {
          this.attendanceData = attendanceData.records.map((record: any) => {
            return {
              ...record,
              attendanceInDateTime: this.combineDateAndTime(
                record.attendanceInDate,
                record.attendanceInTime
              ),
              attendanceOutDateTime: this.combineDateAndTime(
                record.attendanceOutDate,
                record.attendanceOutTime
              ),
            };
          });
          this.totalItems = attendanceData.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
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

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchMyAttendance();
  }
}
