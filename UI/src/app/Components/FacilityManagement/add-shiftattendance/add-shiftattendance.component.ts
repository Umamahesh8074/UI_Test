import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';
import {
  searchTextLength,
  searchTextZero,
} from 'src/app/Constants/CommanConstants/Comman';

import { Attendance } from 'src/app/Models/Facility Management/Attendance';
import { AttendanceDto } from 'src/app/Models/Facility Management/AttendanceDto';
import { LocationDto } from 'src/app/Models/Facility Management/Location';
import { Qrgenerator } from 'src/app/Models/Qrgenerator/qrgenerator';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { IUser, User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ShiftAttendanceService } from 'src/app/Services/FacilityManagement/shiftattendance-service.service';
import { QrgeneratorService } from 'src/app/Services/Qrgenerator/qrgenerator.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-shiftattendance',
  templateUrl: './add-shiftattendance.component.html',
  styleUrls: ['./add-shiftattendance.component.css'],
})
export class AddShiftAttendanceComponent {
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<any>;
  attendance = new Attendance(0, 0, '', '', '', '', 0, 0, '', '', 0, 0, '');
  form: FormGroup = this.builder.group({
    attendanceTimein: [''],
    attendanceTimeout: [''],
  });
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  selectedUserId: number = 0;
  selectedUser: IUser = new User();
  selectedLocation: Qrgenerator = new Qrgenerator();
  attendanceData: Attendance[] = [];
  formData!: FormGroup;
  userName: string = '';
  //user: User[] = [];
  userLoggedIn: User = new User();
  filteredUsers: User[] = [];
  searchControl = new FormControl('');
  userId: number = 0;
  loginUserId: number = 0;
  qrLocations: LocationDto[] = [];
  userControll: any = new FormControl([] as User[]);
  attendanceStatus: string = 'Attendance_Status';
  attendanceStatusList: CommonReferenceDetails[] = [];
  shiftList: CommonReferenceDetails[] = [];
  userData: IUser[] = [];
  location: LocationDto[] = [];
  attendanceDetails: AttendanceDto = new AttendanceDto(
    0,
    0,
    '',
    new Date(),
    new Date(),
    '',
    '',
    0,
    0,
    '',
    '',
    '',
    0,
    '',
    '',
    0,
    0,
    '',
    ''
  );
  toastrService: any;
  constructor(
    private router: Router,
    private attendanceService: ShiftAttendanceService,
    private builder: FormBuilder,
    private commanService: CommanService,
    private userService: UserService,
    private qrGenerator: QrgeneratorService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getDataFromState();

    const user = localStorage.getItem('user');
    if (user) {
      console.log(user, 'user');

      this.userLoggedIn = JSON.parse(user);
      this.loginUserId = this.userLoggedIn.userId;
    }

    this.fetchUserforAuto();

    this.attendance = history.state.attendance;
    console.log(this.attendance);

    // this.fetchShiftsForUser(
    //   this.attendance.userId,
    //   this.attendance.attendanceInDate
    // );
  }

  private getDataFromState() {
    const { attendance, isAdding } = history.state;
    console.log(attendance, 'attendance');
    this.isAdding = isAdding;
    this.attendanceDetails = attendance;
    if (!this.isAdding) {
      this.patchFormDataWithUserData();
    }
  }
  patchFormDataWithUserData() {
    console.log(this.attendanceDetails);

    if (this.attendanceDetails) {
      if (this.attendanceDetails.userId) {
        this.fetchUser(this.attendanceDetails.userId);
      }
      if (this.attendanceDetails.userId) {
        this.fetchLocationOfUser(this.attendanceDetails.userId);
      }
      // Patch form data with original format
      this.formData.patchValue({
        attendanceId: this.attendanceDetails.attendanceId,
        userId: this.attendanceDetails.userId,
        attendanceInDate: new Date(this.attendanceDetails.attendanceInDate),
        attendanceOutDate: new Date(
          this.attendanceDetails.attendanceOutDate || ''
        ), // Set to empty if null
        attendanceInTime: this.attendanceDetails.attendanceInTime
          ? this.formatTimeToOriginal(this.attendanceDetails.attendanceInTime)
          : '',
        attendanceOutTime: this.attendanceDetails.attendanceOutTime
          ? this.formatTimeToOriginal(this.attendanceDetails.attendanceOutTime)
          : '',
        logInLocationId: this.attendanceDetails.logInLocationId,
        logOutLocationId: this.attendanceDetails.logOutLocationId,
        attendanceStatus: this.attendanceDetails.attendanceStatus,
        shiftId: this.attendanceDetails.shiftId,
      });
    }
  }

  // formatTimeToOriginal(time: string): string {
  //   const date = this.parseTime(time); // Convert string to Date
  //   const hours = date.getHours();
  //   const minutes = date.getMinutes();
  //   const ampm = hours >= 12 ? 'PM' : 'AM';

  //   // Convert hours to 12-hour format
  //   const formattedHours = hours % 12 || 12; // Convert '0' to '12'
  //   const formattedMinutes = String(minutes).padStart(2, '0');

  //   return `${formattedHours}:${formattedMinutes} ${ampm}`; // Return in desired format
  // // }
  // formatTimeToOriginal(time: string): string {
  //   if (!time || !/^\d{2}:\d{2}:\d{2}$/.test(time)) {
  //     return '';
  //   }

  //   const [hourStr, minuteStr] = time.split(':');
  //   const hours = parseInt(hourStr, 10);
  //   const minutes = parseInt(minuteStr, 10);

  //   const ampm = hours >= 12 ? 'PM' : 'AM';
  //   const formattedHours = hours % 12 || 12; // Convert 0 to 12
  //   const formattedMinutes = String(minutes).padStart(2, '0');

  //   return `${formattedHours}:${formattedMinutes} ${ampm}`;
  // }
  formatTimeToOriginal(time: string): string {
    if (!time) return '';

    // Handle formats with or without milliseconds
    const timeMatch = time.match(/^(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?/);
    if (!timeMatch) return '';

    const hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);

    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = String(minutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  private fetchUser(userId: number): void {
    this.userService
      .getUserById(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userData) => {
          this.selectedUser = userData;

          this.formData.patchValue({ userId: userData.userId });
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  private initializeForm(): void {
    this.fetchAttendanceStatus();
    const currentTime = new Date();

    const hours24 = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const ampm = hours24 >= 12 ? 'PM' : 'AM';

    const hours12 = hours24 % 12 || 12; // Convert '0' to '12'

    const currentTimeString = `${String(hours12).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')} ${ampm}`;

    console.log(currentTimeString, 'default');

    this.formData = this.builder.group({
      attendanceId: [0],
      userId: [],

      attendanceInDate: [new Date(), Validators.required],
      attendanceInTime: [currentTimeString, Validators.required],
      attendanceOutDate: [new Date(), Validators.required],
      attendanceOutTime: [currentTimeString, Validators.required],

      logInLocationId: [Validators.required],
      logOutLocationId: [Validators.required],
      status: ['A'],
      attendanceStatus: [Validators.required],
      shiftId: [],
    });
  }
  onUserSelectForAuto(event: any): void {
    this.userId = event.option.value.userId;
    this.fetchLocationOfUser(this.userId);
    const inDate = this.formatDateTimee(this.formData.value.attendanceInDate);
    this.fetchShiftsForUser(this.userId, inDate);
    this.formData.patchValue({ userId: this.userId });
  }

  searchUserForAuto(event: any) {
    const query = event.target.value;
    console.log(event.target.value, query);
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.userName = query;
      this.fetchUserforAuto();
    }

    // Fetch users from the server based on the search criteria
  }

  formattedDateOut: any;
  formattedDatIn: any;
  // parseTime(timeString: string): Date {
  //   console.log("entering parse");

  //   const [time, modifier] = timeString.split(' ');
  //   let [hours, minutes] = time.split(':').map(Number);

  //   if (modifier === 'PM' && hours < 12) {
  //     hours += 12;
  //   } else if (modifier === 'AM' && hours === 12) {
  //     hours = 0;
  //   }

  //   return new Date(1970, 0, 1, hours, minutes); // Use a dummy date
  // }

  parseTime(timeString: string): Date {
    console.log('entering parse');

    // Split the time into hours, minutes, and AM/PM modifier
    const [time, modifier] = timeString.trim().split(' ');

    if (!time || !modifier) {
      console.error('Invalid time format', timeString);
      return new Date(); // Return an invalid date
    }

    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    // Check for invalid time parsing
    if (isNaN(hours) || isNaN(minutes)) {
      console.error('Invalid time', timeString);
      return new Date(); // Return an invalid date
    }

    return new Date(1970, 0, 1, hours, minutes); // Use a dummy date
  }

  // Method to combine date and time
  combineDateAndTime(dateInput: Date | null, timeString: string | null): Date {
    const date = dateInput ? this.normalizeDate(dateInput) : new Date();
    let time: Date;

    if (timeString) {
      console.log('if', timeString);

      // If timeString is provided, parse it
      time = this.parseTime(timeString);
    } else {
      console.log('else', timeString);

      // If timeString is null, use the current time
      time = new Date(); // Get the current date and time
    }

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );
  }
  normalizeDate(input: string | Date): Date {
    if (typeof input === 'string') {
      // Handle ISO date string or other formats
      const date = new Date(input);
      if (!isNaN(date.getTime())) {
        return date;
      }
      console.error('Invalid date string:', input);
    } else if (input instanceof Date) {
      return input;
    }
    throw new Error('Invalid date input');
  }

  onChange(event: any, type: string): void {
    let inDate = this.formData.get('attendanceInDate')?.value;
    let inTime = this.formData.get('attendanceInTime')?.value;
    let outDate = this.formData.get('attendanceOutDate')?.value;
    let outTime = this.formData.get('attendanceOutTime')?.value;

    if (type === 'dateIn') {
      inDate = event.value;
    } else if (type === 'dateOut') {
      outDate = event.value;
    } else if (type === 'timeIn') {
      inTime = event;
      console.log(inTime);
    } else if (type === 'timeOut') {
      console.log(outTime);
      outTime = event;
    }
    console.log('In Time:', inTime);
    console.log('Out Time:', outTime);
    // const formattedInTime = this.formatTime(inTime); // Convert to 12-hour AM/PM format
    // const formattedOutTime = this.formatTime(outTime); // Convert to 12-hour AM/PM format
    const inDateTime = this.combineDateAndTime(
      inDate ? new Date(inDate) : null,
      inTime
    );
    console.log(inDateTime, 'inout dat');

    const outDateTime = this.combineDateAndTime(
      outDate ? new Date(outDate) : null,
      outTime
    );
    console.log(outDateTime, 'out');
    // const difference = differenceInHours(outDateTime, inDateTime);

    if (outDateTime <= inDateTime) {
      console.log('Out DateTime is not after In DateTime');
      this.formData
        .get('attendanceOutDate')
        ?.setErrors({ dateRangeInvalid: true });
      this.formData
        .get('attendanceInDate')
        ?.setErrors({ dateRangeInvalid: true });
      this.formData
        .get('attendanceOutTime')
        ?.setErrors({ dateRangeInvalid: true });
      this.formData
        .get('attendanceInTime')
        ?.setErrors({ dateRangeInvalid: true });
    } else {
      console.log('Out DateTime is after In DateTime');
      this.formData.get('attendanceOutDate')?.setErrors(null);
      this.formData.get('attendanceInDate')?.setErrors(null);
      this.formData.get('attendanceOutTime')?.setErrors(null);
      this.formData.get('attendanceInTime')?.setErrors(null);
    }
  }

  formatTime(time: string): string {
    const timeParts = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!timeParts) {
      console.error('Error parsing time:', time);
      return 'Invalid time';
    }
    let [_, hours, minutes, ampm] = timeParts;
    let hoursNumber = parseInt(hours, 10);
    let minutesNumber = parseInt(minutes, 10);
    if (ampm.toUpperCase() === 'PM' && hoursNumber < 12) {
      hoursNumber += 12;
    } else if (ampm.toUpperCase() === 'AM' && hoursNumber === 12) {
      hoursNumber = 0;
    }
    const formattedAmpm = hoursNumber >= 12 ? 'PM' : 'AM';
    const formattedHours = hoursNumber % 12 || 12; // Convert hours to 12-hour format
    const formattedMinutes = String(minutesNumber).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes} ${formattedAmpm}`;
  }

  formatDateTimee(date: any) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  }

  save() {
    console.log('entered...');

    if (this.formData.valid) {
      const data = this.formData.value;
      console.log(data);

      this.formData.markAllAsTouched();
      data.attendanceInTime = this.formatDateTime(
        this.parseTime(data.attendanceInTime)
      );
      data.attendanceOutTime = this.formatDateTime(
        this.parseTime(data.attendanceOutTime)
      );

      console.log(this.isAdding, '.....');

      if (this.isAdding) {
        this.attendanceService
          .addAttendance(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp: any) => {
              Swal.fire({
                icon: 'success',
                text: 'User added successfully',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
              });
              this.router.navigate(['layout/shiftattendance']);
            },
            error: (error: HttpErrorResponse) => {
              const errorMessage =
                error.error?.message || 'An unexpected error occurred';
              Swal.fire({
                icon: 'error',
                text: errorMessage,
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
              });
              console.error('Error adding users', errorMessage);
            },
          });
      } else {
        console.log(data, 'data for');
        console.log(
          this.formatDateTimee(new Date(this.formData.value.attendanceInDate))
        );

        const inDate = this.formatDateTimee(
          this.formData.value.attendanceInDate
        );
        const outDate = this.formatDateTimee(
          this.formData.value.attendanceOutDate
        );
        const attendanceInDate = new Date(data.attendanceInDate);
        console.log(attendanceInDate);

        const attendance: Attendance = {
          attendanceId: data.attendanceId,
          userId: data.userId,
          attendanceInDate: inDate,
          attendanceInTime: data.attendanceInTime,
          attendanceOutDate: outDate,
          attendanceOutTime: data.attendanceOutTime,
          logInLocationId: data.logInLocationId,
          logOutLocationId: data.logOutLocationId,
          status: data.status,
          attendanceStatus: data.attendanceStatus,
          employeeId: data.employeeId,
          shiftId: data.shiftId,
          autoLogOut: data.autoLogOut,
        };
        console.log('update.......', attendance);
        this.attendanceService
          .updateAttendance(attendance)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                text: 'User updated successfully',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
              });
              this.router.navigate(['layout/shiftattendance']);
            },
            error: (err: any) => {
              Swal.fire({
                icon: 'error',
                text: 'Error Occurred',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
              });
              console.error('Error updating Workflowstage', err);
            },
          });
      }
    }
  }

  formatDateTime(date: Date): string {
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
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

  fetchLocationOfUser(userId: number) {
    this.attendanceService
      .getQrgeneratorLocation(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (location) => {
          console.log(location);

          this.location = location;
        },
        error: (error: Error) => {
          console.error('Error fetching User : ', error);
        },
      });
  }

  clearForm() {
    this.formData.reset();
  }

  gotoUsers() {
    this.router.navigate(['/layout/shiftattendance']);
  }

  displayUserForAuto(userData: User): string {
    console.log(userData);
    return userData && userData.userName ? userData.userName : '';
  }

  fetchAttendanceStatus() {
    console.log('entering attendance status');

    this.commanService.getRefDetailsByType(this.attendanceStatus).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        this.attendanceStatusList = response;
        console.log(this.attendanceStatusList);
      },
      error: (error) => console.error(error),
    });
  }

  fetchShiftsForUser(userId: number, attendanceDate: string) {
    this.attendanceService.getShiftForUser(userId, attendanceDate).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        this.shiftList = response;
        console.log(this.shiftList);
      },
    });
  }
}
