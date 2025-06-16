import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { COMMON_STATUS } from 'src/app/Constants/CommanConstants/Comman';
import { ILeaveRequest, LeaveRequest } from 'src/app/Models/Leave/LeaveRequest';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LeaveRequestService } from 'src/app/Services/LeaveService/LeaveRequest/leave-request.service';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.css'],
})
export class LeaveRequestComponent implements OnInit, OnDestroy {
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<any>;
  leaveRequest: ILeaveRequest = new LeaveRequest(0, 0, '', '', '', '');
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  formData: FormGroup;
  user: User = new User();
  userId: number | null = null;
  minStartDate: Date = new Date();
  minEndDate: Date = new Date();
  @ViewChild('endDatePicker') endDatePicker!: MatDatepicker<Date>;
  statuses: any;
  organizationId: number = 0
  constructor(
    private leaveRequestService: LeaveRequestService,
    private router: Router,
    public dialog: MatDialog,
    private builder: FormBuilder,
    private datePipe: DatePipe,
    private commonService: CommanService
  ) {
    this.formData = this.builder.group({
      id: [null],
      userId: [null, Validators.required],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      reason: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getCommonStatuses();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.userId = this.user.userId;
      this.organizationId = this.user.organizationId;
    } else {
      console.error('User not found in localStorage.');
    }

    this.leaveRequest =
      history.state.leavereuest ||
      new LeaveRequest(0, this.userId ?? 0, '', '', '', 'A');
    this.isAdding = !history.state.leavereuest;

    this.formData = this.builder.group({
      id: [this.leaveRequest.id],
      userId: [this.leaveRequest.userId, Validators.required],
      startDate: [this.leaveRequest.startDate, [Validators.required]],
      endDate: [this.leaveRequest.endDate, [Validators.required]],
      reason: [this.leaveRequest.reason, Validators.required],
      organizationId: [this.organizationId],
      status: [this.leaveRequest.status],
    });

    this.formData.get('startDate')?.valueChanges.subscribe(() => {
      this.updateEndDateMinDate(); // Update end date min date whenever start date changes
    });

    if (this.userId) {
      this.formData.patchValue({ userId: this.userId });
      console.log('Form after patching userId:', this.formData.value);
    }
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
        console.log(this.datePipe.transform(startDate, 'yyyy-MM-dd'));
      }
    }
  }

  save() {
    if (this.formData.invalid) {
      return;
    }

    const formValue = {
      ...this.formData.value,
      startDate: this.formatDate(this.formData.value.startDate),
      endDate: this.formatDate(this.formData.value.endDate),
    };

    if (this.isAdding) {
      this.formData.patchValue({ userId: this.userId });
      console.log('Form value before add:', formValue);
      this.leaveRequestService
        .addLeaveRequest(formValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.router.navigate(['layout/leaverequest']);
          },
          error: (err) => {
            console.error('Error adding leaverequest', err);
          },
        });
    } else {
      console.log('Form value before update:', formValue);
      this.leaveRequestService
        .editLeaveRequest(formValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['layout/leaverequest']);
          },
          error: (err) => {
            console.error('Error updating leaverequest', err);
          },
        });
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

  clearForm() {
    this.formData.reset();
    Object.keys(this.formData.controls).forEach((key) => {
      this.formData.controls[key].markAsTouched(); // Mark each field as touched to trigger error messages
    });
  }

  gotoLeaverequest() {
    this.router.navigate(['layout/leaverequest']);
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
