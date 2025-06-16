import { Component, HostListener, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
} from 'src/app/Constants/CommanConstants/Comman';
import { Attendance } from 'src/app/Models/Facility Management/Attendance';
import { AttendanceDto } from 'src/app/Models/Facility Management/AttendanceDto';
import { User } from 'src/app/Models/User/User';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { ShiftAttendanceService } from 'src/app/Services/FacilityManagement/shiftattendance-service.service';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { formatDate } from '@angular/common';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { QrgeneratorService } from 'src/app/Services/Qrgenerator/qrgenerator.service';
import { LocationDto } from 'src/app/Models/Facility Management/Location';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatDateFormats,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
export const MAT_YEAR_ONLY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'YYYY',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-shift-attendance',
  templateUrl: './shift-attendance.component.html',
  styleUrls: ['./shift-attendance.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_YEAR_ONLY_FORMATS },
  ],
})
export class ShiftAttendanceComponent {
  private destroy$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  AttendanceUserData: Attendance[] = [];
  UserName: string = '';
  totalItems: number = 0;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  userId: number = 0;
  stateData: any;
  status: string = '';
  user: User = new User();
  isAdding: boolean = true;
  dataSource!: any;
  attendanceStatusList: CommonReferenceDetails[] = [];
  attendanceStatus: string = 'Attendance_Status';
  monthsList: CommonReferenceDetails[] = [];
  displayedColumns: string[] = [
    'name',
    'InDateTime',
    'OutDateTime',
    'logInLocation',
    'logOutLocation',
    'attendanceStatus',
    'shift',
    'actions',
  ];

  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  dateRange: any = 0;
  startDate: any;
  endDate: any;
  showDateRangePicker = false;
  customStartDate: any;
  customEndDate: any;
  isLateComer: boolean = false;
  isEarlyLeaver: boolean = false;

  attendanceData: AttendanceDto[] = [];
  daysType: string = 'Filter_Days';
  pageSizeOptions = pageSizeOptions;
  shiftId: any;
  isFromDashBoard: boolean = false;
  days: CommonReferenceDetails[] = [];
  formData!: FormGroup;
  shiftTiming: string = 'Shift_Timings';
  shiftTimingList: CommonReferenceDetails[] = [];
  selectedShiftId: any;
  selectedDay: any;
  locationForOrg: LocationDto[] = [];
  selectlocationId: number = 0;
  organizationId: number = 0;
  isExcel: boolean = false;
  attendanceForm!: FormGroup;
  ngOnInit(): void {
    this.initializeState();
    this.initForm();
    const user = localStorage.getItem('user');
    if (user) {
      console.log(user, 'user');

      this.user = JSON.parse(user);
      this.userId = this.user.userId;
      this.organizationId = this.user.organizationId;
    }
    this.fetchFilterDays();
    this.fetchShiftTimings();
    this.fetchAttendanceStatus();
    this.fetchLocationFOrOrganization();
    this.getAttendance(this.UserName);
  }
  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
  }

  private initializeState() {
    const state = history.state;
    this.stateData = state;

    console.log(history.state);
    if (state.pageSize != undefined) {
      this.pageSize = state.pageSize;
    }
    if (state.pageIndex != undefined) {
      this.pageIndex = state.pageIndex;
    }
    if (state.isFromDashBoard != undefined) {
      this.isFromDashBoard = state.isFromDashBoard;
    }

    this.shiftId = state.shiftId || 0;
    this.status = state.status || '';

    this.dateRange = state.dateRange || '';

    this.UserName = state.UserName;
    this.userId = state.userId;
    //this.pageIndex = state.pageIndex ;
    ////this.pageSize = state.pageSize;
    this.dateRange = state.dateRange;
    this.startDate = state.startDate;
    this.endDate = state.endDate;

    this.isLateComer = state.isLateComer;
    this.isEarlyLeaver = state.isEarlyLeaver;
    this.selectlocationId = state.selectlocationId || 0;
  }

  private initForm(): void {
    this.attendanceForm = this.formBuilder.group({
      month: [null, Validators.required],
      year: [null, Validators.required],
      location: [null, Validators.required],
    });
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
            this.getAttendance(this.UserName);
          }
        }
      );
  }
  constructor(
    private commonService: CommanService,
    private attendanceService: ShiftAttendanceService,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private qrgenerator: QrgeneratorService,
    private commonRefDetails: CommonreferencedetailsService
  ) {}

  onSearch(searchText: any) {
    this.paginator.firstPage();
    this.UserName = searchText;
    console.log(this.UserName);

    this.getAttendance(this.UserName);
  }

  // getAttendance(userName: any) {
  //   this.UserName = userName;

  //   console.log(this.userId);
  //   console.log(this.pageIndex);
  //   console.log(this.pageSize);

  //   this.attendanceService
  //     .getAllAttendance(
  //       this.UserName,
  //       this.userId,
  //       this.pageIndex,
  //       this.pageSize,
  //       this.dateRange,
  //       this.startDate,
  //       this.endDate,
  //       this.status,
  //       this.shiftId,
  //       this.selectlocationId,
  //       this.isExcel,
  //     )
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (attendanceData) => {

  //          if (this.isExcel && attendanceData instanceof Blob) {
  //           alert("lll")
  //       const blob = new Blob([attendanceData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //       const url = window.URL.createObjectURL(blob);
  //       const a = document.createElement('a');
  //       a.href = url;
  //       a.download = `Attendance_${new Date().toISOString()}.xlsx`;
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //       return;
  //     }
  //         let filteredRecords = attendanceData.records;
  //         console.log(filteredRecords);

  //         this.totalItems = attendanceData.totalRecords;
  //          // Map the filtered records and combine date and time
  //         this.attendanceData = filteredRecords.map((record: any) => {

  //           return {
  //             ...record,
  //             attendanceInDateTime: this.combineDateAndTime(
  //               record.attendanceInDate,
  //               record.attendanceInTime
  //             ),
  //             attendanceOutDateTime:
  //               record.attendanceOutDate && record.attendanceOutTime
  //                 ? this.combineDateAndTime(
  //                   record.attendanceOutDate,
  //                   record.attendanceOutTime
  //                 )
  //                 : "",
  //           };
  //         });

  //       },
  //       error: (error) => {
  //         console.error(error);
  //       },
  //     });
  // }

  // combineDateAndTime(date: string, time: string): string {
  //   // Parse the date
  //   const [year, month, day] = date.split('T')[0].split('-');

  //   // Format the date as dd/MM/yyyy
  //   const formattedDate = `${day}/${month}/${year}`;

  //   // Parse and format the time
  //   const [hours, minutes] = time.split(':').map(Number);

  //   // Convert to 12-hour format with AM/PM
  //   const ampm = hours >= 12 ? 'PM' : 'AM';
  //   const formattedHours = hours % 12 || 12; // Convert 0 to 12 for AM
  //   const formattedMinutes = String(minutes).padStart(2, '0');

  //   // Combine date and time
  //   return `${formattedDate} ${formattedHours}:${formattedMinutes} ${ampm}`;
  // }
  combineDateAndTime(date: string | null, time: string | null): string {
    if (!date) {
      return '';
      // Return an empty string if date is null
    }
    if (!time) {
      const [year, month, day] = date.split('T')[0].split('-');
      return `${day}/${month}/${year}`;
    }

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

  formatDateTime(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  formatDateTimeDateRange(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }
  deleteAttendance(id: number) {
    this.attendanceService
      .deleteAttendance(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Attendane deleted successfully:', response);
          this.getAttendance(this.UserName);
        },
        error: (error) => {
          console.error('Error deleting Attendance:', error);
        },
      });
  }
  //opening confirm dialog
  openConfirmDialog(AttendanceId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete attendanceUser' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteAttendance(AttendanceId);
        }
      }
    );
  }

  // deleteAttendance(menuId: number) {
  //   this.attendanceService
  //     .deleteAttendance(menuId)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (menuData) => {
  //         console.log(menuData);
  //       },
  //       error: (error) => {
  //         console.error(error);
  //       },
  //     });
  // }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    history.state.pageIndex = this.pageIndex;
    history.state.pageSize = this.pageSize;
    this.getAttendance(this.UserName);
  }

  //adding attendance
  addAttendance() {
    this.router.navigate(['layout/attendance/addShiftAttendance'], {
      state: { isAdding: true },
    });
  }

  editAttendance(attendanceUser: any) {
    console.log('edit', attendanceUser);
    //const updatedAttendanceUser = this.updateAttendanceWithCurrentTime(attendanceUser);
    // console.log("updatedAttendanceUser",updatedAttendanceUser);
    this.attendanceService
      .getAttendanceById(attendanceUser.attendanceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log(data);
          const updatedAttendanceUser =
            this.updateAttendanceWithCurrentTime(data);
          this.router.navigate(['layout/attendance/addShiftAttendance'], {
            state: { attendance: updatedAttendanceUser, isAdding: false },
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  updateAttendanceWithCurrentTime(data: any): any {
    const currentDate = new Date();

    // Update attendanceInTime if it's null
    if (!data.attendanceInTime) {
      data.attendanceInTime = currentDate.toISOString(); // Or use any specific format you prefer
    }

    // Update attendanceOutTime if it's null
    if (!data.attendanceOutTime) {
      data.attendanceOutTime = currentDate.toISOString(); // Or use any specific format you prefer
    }

    // Update attendanceInDate if it's null
    if (!data.attendanceInDate) {
      data.attendanceInDate = currentDate.toISOString(); // Or use any specific format you prefer
    }

    // Update attendanceOutDate if it's null
    if (!data.attendanceOutDate) {
      data.attendanceOutDate = currentDate.toISOString(); // Or use any specific format you prefer
    }

    return data;
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
      this.getAttendance(this.UserName);

      this.showDateRangePicker = false;
    }
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
  selectedShift(shiftId: number) {
    this.paginator.firstPage();
    if (shiftId == 0) {
      // Handle "All" selection
      console.log('Selected All Shifts');
      this.shiftId = 0; // or set to a specific value if needed
      this.getAttendance(this.UserName);
    } else {
      // If a specific shift is selected
      this.shiftId = shiftId;
      console.log('Selected Shift ID:', this.shiftId);
      this.getAttendance(this.UserName);
    }
  }
  selectedStatus(status: string) {
    this.paginator.firstPage();
    if (status === 'All') {
      // Handle "All" selection
      console.log('Selected All Shifts');
      this.status = ''; // or set to a specific value if needed
      this.getAttendance(this.UserName);
    } else {
      // If a specific shift is selected
      this.status = status;
      console.log('Selected Shift ID:', this.status);
      this.getAttendance(this.UserName);
    }
  }
  fetchAttendanceStatus() {
    console.log('entering attendance status');

    this.commonService.getRefDetailsByType(this.attendanceStatus).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        this.attendanceStatusList = response;
        console.log(this.attendanceStatusList);
        this.attendanceStatusList.unshift({
          id: 0,
          commonRefKey: '',
          commonRefValue: 'All',
          referenceTypeId: 0,
        });
      },
      error: (error) => console.error(error),
    });
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

    this.getAttendance(this.UserName);
  }

  getAttendance(UserName: any) {
    if (this.isExcel) {
      this.attendanceService
        .getAllAttendance(
          this.UserName,
          this.userId,
          this.pageIndex,
          this.pageSize,
          this.dateRange,
          this.startDate,
          this.endDate,
          this.status,
          this.shiftId,
          this.selectlocationId,
          this.isExcel,
          this.month,
          this.selectedYearDisplay
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (excelBlob: any) => {
            console.log('download excel');

            this.downloadXLSXFile(excelBlob, 'AttendanceReport', false);
            console.log(excelBlob);
            this.isExcel = false;
          },
          error: (error) => {
            console.error('Excel download failed:', error);
          },
        });
    } else {
      this.attendanceService
        .getAllAttendance(
          this.UserName,
          this.userId,
          this.pageIndex,
          this.pageSize,
          this.dateRange,
          this.startDate,
          this.endDate,
          this.status,
          this.shiftId,
          this.selectlocationId,
          this.isExcel
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (attendanceData) => {
            let filteredRecords = attendanceData.records;
            this.totalItems = attendanceData.totalRecords;
            this.attendanceData = filteredRecords.map((record: any) => ({
              ...record,
              attendanceInDateTime: this.combineDateAndTime(
                record.attendanceInDate,
                record.attendanceInTime
              ),
              attendanceOutDateTime:
                record.attendanceOutDate && record.attendanceOutTime
                  ? this.combineDateAndTime(
                      record.attendanceOutDate,
                      record.attendanceOutTime
                    )
                  : '',
            }));
          },
          error: (error) => {
            console.error(error);
          },
        });
    }
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

  //right click menu
  selectedRow: any;
  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedRowData: any = null;

  onTableRightClick(event: MouseEvent, rowData: any) {
    console.log('Right-click triggered');
    console.log('Ctrl pressed:', event.ctrlKey);
    console.log(rowData);

    if (event.ctrlKey) {
      this.selectedRow = rowData;
      event.preventDefault(); // This blocks the browser menu
      this.contextMenuPosition = {
        x: event.clientX,
        y: event.clientY,
      };
      this.contextMenuVisible = true;
      this.selectedRowData = rowData;
      console.log('Context Menu Position:', this.contextMenuPosition);

      console.log(this.contextMenuVisible);
    } else {
      this.contextMenuVisible = false;
    }
  }

  onGlobalMenuAction(action: any) {
    this.contextMenuVisible = false;
    if (action === 'Edit') {
      this.editAttendance(this.selectedRowData);
    } else if (action === 'Delete') {
      this.openConfirmDialog(this.selectedRowData.attendanceId);
    }
  }

  @HostListener('document:click')
  onClickOutside() {
    this.contextMenuVisible = false;
  }

  onRightClick(event: MouseEvent) {
    console.log('Ctrl pressed:', event.ctrlKey);

    if (event.ctrlKey) {
      event.preventDefault(); // This blocks the browser menu
      this.contextMenuPosition = {
        x: event.clientX,
        y: event.clientY,
      };
      this.contextMenuVisible = true;
    } else {
      this.contextMenuVisible = false;
    }
  }

  generateExcel() {
    //   const dialogRef = this.dialog.open(ApproveDialogComponent, {
    //     width: '40%',
    //     height: '300px',
    //   });

    //   dialogRef.afterClosed().subscribe((result) => {
    //         this.isExcel = true;
    // this.getAttendance(this.UserName);
    //     // if (result) {
    //     //   const { status, remarks } = result;
    //     //   this.remarks = remarks;
    //     //   console.log(this.remarks, status);
    //     //   if (remarks && status !== 'cancel') {
    //     //     this.updateApprovalStatus(statuss);
    //     //   }
    //     // }
    //   });
    if (this.attendanceForm.invalid) {
      this.attendanceForm.markAllAsTouched();
      return;
    } else {
      this.isExcel = true;
      this.getAttendance(this.UserName);
    }
  }

  getMonths() {
    this.commonRefDetails.fetchCommomRefDetailsByType('Months').subscribe({
      next: (response: CommonReferenceDetails[]) => {
        this.monthsList = response;
        console.log(this.monthsList);
      },
      error: (error) => console.error(error),
    });
  }

  month: string = '';
  selectedMonth(month: string) {
    console.log(month);

    this.month = month;
    this.attendanceForm.get('month')?.setValue(month);
    this.getAttendance(this.UserName);
  }

  selectedYear: _moment.Moment | null = null;
  selectedYearDisplay: string = '';

  chosenYearHandler(normalizedYear: _moment.Moment) {
    this.selectedYear = normalizedYear; // Bind this to the input value
    this.selectedYearDisplay = normalizedYear.year().toString();
    this.attendanceForm.get('year')?.setValue(normalizedYear);
    console.log(this.selectedYearDisplay);
  }
  goToDashBoard() {
    this.router.navigate(['layout/attendance/teamShiftAttendanceReport']);
  }
}
