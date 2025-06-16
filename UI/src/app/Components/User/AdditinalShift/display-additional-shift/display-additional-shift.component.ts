import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { AdditionalShift } from 'src/app/Models/User/additionalShift';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { AttendanceServiceService } from 'src/app/Services/FacilityManagement/attendance-service.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import { AddAdditionalShiftComponent } from '../add-additional-shift/add-additional-shift.component';
import { AdditionalShiftDto } from 'src/app/Models/User/AdditionalShiftDto';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-display-additional-shift',
  templateUrl: './display-additional-shift.component.html',
  styleUrls: ['./display-additional-shift.component.css'],
})
export class DisplayAdditionalShiftComponent {
  constructor(
    private attendanceService: AttendanceServiceService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private commonService: CommanService,
    public dialog: MatDialog
  ) {}
  private destroy$ = new Subject<void>();

  UserName: string = '';
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  userId: number = 0;
  dateRange: any = 0;
  startDate: any;
  endDate: any;
  status: string = '';
  user: User = new User();
  additionalShiftDetails: AdditionalShiftDto[] = [];
  pageSizeOptions = pageSizeOptions;
  showDateRangePicker = false;

  customStartDate: any;
  customEndDate: any;
  days: CommonReferenceDetails[] = [];
  daysType: string = 'Filter_Days';
  // additionalShiftData: AdditionalShiftD[] = [];
  displayedColumns: string[] = [
    'name',
    'additionalShiftDate',
    'ShiftTime',
    'Project',
    'actions',
  ];
  formData!: FormGroup;
  ngOnInit(): void {
    this.initializeState();
    this.initForm();
    const user = localStorage.getItem('user');
    if (user) {
      console.log(user, 'user');

      this.user = JSON.parse(user);
      this.userId = this.user.userId;
    }
    this.fetchFilterDays();
    this.getAdditionalShifts(this.UserName);
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
            this.getAdditionalShifts(this.UserName);
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

  fetchFilterDays() {
    this.commonService.getRefDetailsByType(this.daysType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        // Directly assign the response to this.days without filtering
        this.days = response;
      },
      error: (error) => console.error(error),
    });
  }
  private initializeState() {
    const state = history.state;

    console.log(history.state);
    if (state.pageSize != undefined) {
      this.pageSize = state.pageSize;
    }
    if (state.pageIndex != undefined) {
      this.pageIndex = state.pageIndex;
    }
  }

  getAdditionalShifts(userName: any) {
    this.UserName = userName;
    this.attendanceService
      .getAllAdditionalShift(
        this.UserName,
        this.userId,
        this.pageIndex,
        this.pageSize,
        this.dateRange,
        this.startDate,
        this.endDate,
        this.status
      )

      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (additionalShift) => {
          this.additionalShiftDetails = additionalShift.records;
          console.log(additionalShift, 'additionalShift');
          this.totalItems = additionalShift.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  onSearch(searchText: any) {
    this.UserName = searchText;
    console.log(this.UserName);

    this.getAdditionalShifts(this.UserName);
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAdditionalShifts(this.UserName);
  }

  addAdditionalShift() {
    this.router.navigate(['layout/additionalshift'], {
      state: { isAdding: true },
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
      this.getAdditionalShifts(this.UserName);

      this.showDateRangePicker = false;
    }
  }

  editAdditionalShift(attendanceUser: any) {
    console.log('id taking ', attendanceUser.additionalShiftId);
    this.getAdditionalShiftById(attendanceUser.additionalShiftId).subscribe({
      next: (response) => {
        console.log(response); // Verify if data is correctly fetched
        this.additionalShiftDetails = response;
        // Navigate with state once the data is available
        this.router.navigate(['layout/additionalshift'], {
          state: { additionalShiftDetails: this.additionalShiftDetails },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getAdditionalShiftById(id: number) {
    return this.attendanceService
      .getAdditionalShiftById(id)
      .pipe(takeUntil(this.destroy$));
  }
  openConfirmDialog(id: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete User' },
    });

    dialogRef.componentInstance.isConfirmDelete
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.deleteAdditionalShift(id);
        }
      });
  }

  deleteAdditionalShift(id: number) {
    this.attendanceService
      .deleteAdditionalShiftById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('User deleted successfully:', response);

          // this.getAdditionalShifts();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        },
      });
  }
}
