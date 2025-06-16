import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { COMMON_STATUS } from 'src/app/Constants/CommanConstants/Comman';
import { IWeekOff, WeekOff } from 'src/app/Models/Leave/WeekOff';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { WeekOffService } from 'src/app/Services/LeaveService/WeekOff/week-off.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-week-off',
  templateUrl: './add-week-off.component.html',
  styleUrls: ['./add-week-off.component.css'],
})
export class AddWeekOffComponent implements OnInit, OnDestroy {
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<any>;
  weekOff: IWeekOff = new WeekOff(0, 0, '', '', '');
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  formData!: FormGroup;
  user: User = new User();
  userId: number | null = null;
  statuses: any;
  @ViewChild('endDatePicker') endDatePicker!: MatDatepicker<Date>;
  weekDays: string[] = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];
  constructor(
    private weekOffService: WeekOffService,
    private router: Router,
    public dialog: MatDialog,
    private builder: FormBuilder,
    private commonService: CommanService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getCommonStatuses();
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.userId = this.user.userId;
    }
    this.weekOff =
      history.state.weekOff || new WeekOff(0, this.userId ?? 0, '', '', '');
    this.isAdding = !history.state.weekOff;
    if (this.weekOff !== null) {
      this.patchFormData(this.weekOff);
    }
  }

  initializeForm() {
    this.formData = this.builder.group({
      id: [null],
      userId: [null],
      weekOffDay: ['', Validators.required],
      status: [],
    });
  }

  patchFormData(weekOff: any) {
    this.formData.patchValue(weekOff);
  }

  save() {
    console.log(this.formData.value);
    if (this.formData.invalid) {
      return;
    }
    if (this.isAdding) {
      this.formData.patchValue({ userId: this.userId });
      console.log('Form value before add:', this.formData.value);
      this.weekOffService
        .addWeekOff(this.formData.value, this.user.organizationId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.handleSuccessResponse(resp);
            this.router.navigate(['layout/weekoff']);
          },
          error: (err) => {
            this.handleErrorResponse(err);
            console.error('Error adding weekoff', err);
          },
        });
    } else {
      console.log('Form value before update:', this.formData.value);
      this.weekOffService
        .editWeekOff(this.formData.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.handleSuccessResponse(resp);
            this.router.navigate(['layout/weekoff']);
          },
          error: (err) => {
            this.handleErrorResponse(err);
            console.error('Error updating weekoff', err);
          },
        });
    }
  }

  handleSuccessResponse(response: any): void {
    Swal.fire({
      title: 'Success!',
      text: response.message || 'Operation completed successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }

  handleErrorResponse(response: any): void {
    Swal.fire({
      title: 'Error!',
      text: response.error?.message || 'An error occurred. Please try again.',
      icon: 'error',
      confirmButtonText: 'Close',
    });
  }

  clearForm() {
    this.formData.reset();
  }

  gotoWeekOff() {
    this.router.navigate(['layout/weekoff']);
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
