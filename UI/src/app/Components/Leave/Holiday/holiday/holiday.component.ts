import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { COMMON_STATUS } from 'src/app/Constants/CommanConstants/Comman';
import { Holiday, IHoliday } from 'src/app/Models/Leave/Holiday';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { HolidayService } from 'src/app/Services/LeaveService/Holiday/holiday.service';

@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.css'],
})
export class HolidayComponent implements OnInit, OnDestroy {
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<any>;
  holiday: IHoliday = new Holiday();
  isAdding: boolean = true;
  minDate: Date = new Date();
  private destroy$ = new Subject<void>();
  formData!: any;
  statuses: any;
  constructor(
    private holidayService: HolidayService,
    private router: Router,
    public dialog: MatDialog,
    private builder: FormBuilder,
    private commonService: CommanService
  ) {}

  ngOnInit(): void {
    this.getCommonStatuses();
    const holidayData = history.state.holidayData;
    this.initializeForm();
    if (holidayData != null) {
      this.holiday = holidayData;
      this.isAdding = false;
      this.patchFormDate();
    }
  }

  initializeForm() {
    this.formData = this.builder.group({
      id: [],
      name: ['', Validators.required],
      date: ['', Validators.required],
      description: [''],

      status: ['A'],
    });
  }
  patchFormDate() {
    console.log(this.holiday.date);
    const formattedDate = this.parseDate(this.holiday.date);
    this.formData.patchValue({ ...this.holiday, date: formattedDate });
    console.log(this.formData.value);
  }

  save() {
    console.log(this.formData.value);
    if (this.formData.valid) {
      // Transform the date to the required format (YYYY-MM-DD)
      const formValue = {
        ...this.formData.value,
        date: this.formatDate(this.formData.value.date),
      };

      if (this.isAdding) {
        this.holidayService
          .addHoliday(formValue)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp) => {
              this.router.navigate(['layout/holiday']);
            },
            error: (err) => {
              console.error('Error adding holiday', err);
            },
          });
      } else {
        this.holidayService
          .editHoliday(formValue)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/holiday']);
            },
            error: (err) => {
              console.error('Error updating holiday', err);
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

  clearForm() {
    console.log(this.formData);
    this.formData.reset();
    console.log(this.formData);
    console.log(this.formData.valid);
    Object.keys(this.formData.controls).forEach((key) => {
      this.formData.controls[key].markAsTouched(); // Mark each field as touched to trigger error messages
    });
  }

  gotoRoles() {
    this.router.navigate(['layout/holiday']);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  parseDate(dateString: string): any {
    const date = new Date(dateString);
    return date;
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
