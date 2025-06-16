import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ILeaveRequest, LeaveRequest } from 'src/app/Models/Leave/LeaveRequest';
import { LeaveRequestDto } from 'src/app/Models/Leave/LeaveRequestDto';
import { LeaveRequestService } from 'src/app/Services/LeaveService/LeaveRequest/leave-request.service';
import { IUser, User } from 'src/app/Models/User/User';
import { UserDto } from 'src/app/Models/Leave/UserDto';
import { MatDatepicker } from '@angular/material/datepicker';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import {
  COMMON_STATUS,
  searchTextLength,
  searchTextZero,
} from 'src/app/Constants/CommanConstants/Comman';
import { UserService } from 'src/app/Services/UserService/userservice.service';

@Component({
  selector: 'app-add-team-leaves',
  templateUrl: './add-team-leaves.component.html',
  styleUrls: ['./add-team-leaves.component.css'],
})
export class AddTeamLeavesComponent implements OnInit, OnDestroy {
  leaveRequest: ILeaveRequest = new LeaveRequest(0, 0, '', '', '', 'A');
  isAdding: boolean = true;
  totalReporteeCount: number = 0;
  leaveRequestDtoData: LeaveRequestDto[] = [];
  userData: UserDto[] = [];
  userControll: any = new FormControl([] as User[]);
  private destroy$ = new Subject<void>();
  formData!: FormGroup;
  user: User = new User();
  userId: number | null = null;
  minStartDate: Date = new Date();
  minEndDate: Date = new Date();
  statuses: any;
  @ViewChild('endDatePicker') endDatePicker!: MatDatepicker<Date>;
  
  organizationId: number = 0;
  userName: string = '';
  selectedUser: IUser = new User();
  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    this.getCommonStatuses();
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.userId = this.user.userId;
      // alert(this.organizationId)
      this.organizationId = this.user.organizationId;
      // alert(this.organizationId)
      console.log('Parsed user:', this.user); // Log parsed user object
      console.log('User ID:', this.userId); // Log user ID

      // Fetch team leave requests after userId is set
    } else {
      console.error('User not found in localStorage.');
    }
    this.initializeForm();
    this.fetchUserforAuto();
    // Check if there's a leave request in the history state
    if (history.state.leaveRequest) {
      this.isAdding = false;
      this.leaveRequest = history.state.leaveRequest;
      this.formData.patchValue(this.leaveRequest);
      console.log(this.formData);
    }

    this.formData.get('startDate')?.valueChanges.subscribe(() => {
      this.updateEndDateMinDate(); // Update end date min date whenever start date changes
    });
  }
  constructor(
    private leaveRequestService: LeaveRequestService,
    private router: Router,
    public dialog: MatDialog,
    private builder: FormBuilder,
    private datePipe: DatePipe,
    private commonService: CommanService,
    private userService: UserService
  ) {

  }
  private initializeForm(): void {


    this.formData = this.builder.group({
      id: [this.leaveRequest?.id || null],
      userId: [this.leaveRequest?.userId || null, Validators.required],
      startDate: [this.leaveRequest?.startDate || null, Validators.required],
      endDate: [this.leaveRequest?.endDate || null, Validators.required],
      reason: [this.leaveRequest?.reason || null, Validators.required],
    organizationId: [this.organizationId],
      status: [this.leaveRequest?.status || ''],
    });

  }
  updateEndDateMinDate(): void {
    console.log('hii');
    const startDateValue = this.formData.get('startDate')?.value;
    if (startDateValue) {
      const startDate = new Date(startDateValue);
      this.minEndDate = startDate; // Update minEndDate to be the selected start date
      const endDatePickerInput = document.getElementById(
        'endDatePickerInput'
      ) as HTMLInputElement;
      if (endDatePickerInput) {
        endDatePickerInput.min =
          this.datePipe.transform(startDate, 'yyyy-MM-dd') || '';
      }
    }
  }

  // fetchTeamLeaveRequests(): void {

  //   if (this.userId) {
  //    if(this.user.roleName='HR')
  //    {
  //     this.userService.fetchAllUsers(this.userName,this.organizationId)
  //    }
  //    else{

  //    }

  //       this.leaveRequestService
  //       .getTeamLeavesByManagerId(this.userId)
  //       .pipe(takeUntil(this.destroy$))
  //       .subscribe({
  //         next: (leaveRequests: LeaveRequestDto[]) => {
  //           this.userData = leaveRequests.map((record: LeaveRequestDto) => ({
  //             userId: record.userId,
  //             userName: record.userName,
  //             email: '', // Populate with actual email if available, or leave empty
  //           }));
  //         },
  //         error: (error: any) =>
  //           console.error('Error fetching team leave requests:', error),
  //       });

  //   }

  // }
  searchUserForAuto(event: any) {
    const query = event.target.value;
    console.log(event.target.value, query);
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.userName = query;
      this.fetchUserforAuto();
    }

    // Fetch users from the server based on the search criteria
  }
  fetchUserforAuto() {
    // alert(this.user.roleName);
    if (this.user.roleName == 'HR') {
      this.userService
        .fetchAllUsers(this.userName, this.organizationId)
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
    } else {
      this.userService
        .getUserByManagerId(this.user.userId, this.userName)
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
  }
  onUserSelectForAuto(event: any): void {
    this.userId = event.option.value.userId;

    this.formData.patchValue({ userId: this.userId });
  }
  displayUserForAuto(userData: User): string {
    console.log(userData);
    return userData && userData.userName ? userData.userName : '';
  }

  save(): void {
    // alert(this.formData.value.organizationId)
    if (this.formData.valid) {
      const formValue = {
        ...this.formData.value,
        startDate: this.formatDate(this.formData.value.startDate),
        endDate: this.formatDate(this.formData.value.endDate),
      };

      if (this.isAdding) {
       
        console.log(formValue);

        this.leaveRequestService
          .addLeaveRequest(formValue)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp) => {
              this.router.navigate(['layout/teamleaverequest']);
              console.log(resp);
            },
            error: (err) => {
              console.error('Error adding leave request', err);
            },
          });
      } else {
        this.leaveRequestService
          .editLeaveRequest(formValue)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/teamleaverequest']);
            },
            error: (err) => {
              console.error('Error updating leave request', err);
            },
          });
      }
    }
  }
  formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  clearForm(): void {
    this.formData.reset();
    Object.keys(this.formData.controls).forEach((key) => {
      this.formData.controls[key].markAsTouched(); // Mark each field as touched to trigger error messages
    });
  }

  gotoLeaverequest(): void {
    this.router.navigate(['layout/teamleaverequest']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getCommonStatuses() {
    this.commonService.fetchCommonReferenceTypes(COMMON_STATUS).subscribe({
      next: (data) => {
        this.statuses = data;
        //this.setDefaultStatus();
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }
}
