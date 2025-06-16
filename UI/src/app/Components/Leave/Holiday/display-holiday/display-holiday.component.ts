import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject, Subscription, map, startWith, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { Holiday } from 'src/app/Models/Leave/Holiday';
import { HolidayService } from 'src/app/Services/LeaveService/Holiday/holiday.service';

@Component({
  selector: 'app-display-holiday',
  templateUrl: './display-holiday.component.html',
  styleUrls: ['./display-holiday.component.css'],
})
export class DisplayHolidayComponent {
  private subscription: Subscription;
  private destroy$ = new Subject<void>();
  holidayData: Holiday[] = [];
  displayedColumns: string[] = [
    'name',
    'date',
    'description',
    'status',
    'actions',
  ];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  holidayName: string = '';

  // Pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  constructor(
    private holidayService: HolidayService,
    private router: Router,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {
    this.subscription = new Subscription();
    this.filteredMonths = this.searchControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterMonths(value))
    );
  }

  ngOnInit(): void {

    this.getAllHoliday('');
    this.holidayService.refreshRequired
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getAllHoliday(this.holidayName));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllHoliday(this.holidayName);
  }

  searchControl = new FormControl();
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  monthMap: { [key: string]: string } = {
    January: '01',
    February: '02',
    March: '03',
    April: '04',
    May: '05',
    June: '06',
    July: '07',
    August: '08',
    September: '09',
    October: '10',
    November: '11',
    December: '12',
  };
  filteredMonths!: Observable<string[]>;

  filterMonths(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.months.filter((month) =>
      month.toLowerCase().includes(filterValue)
    );
  }
  selectedMonth: string = ''; // Add this property

  formatAndSearch(selectedMonth: string): void {
    const selectedMonthValue = this.monthMap[selectedMonth];
    console.log('Selected Month Value:', selectedMonthValue);
    if (selectedMonthValue) {
      console.log('Searching for holiday with month:', selectedMonthValue);
      this.getAllHoliday(selectedMonthValue);
    } else {
      console.log('Invalid month selected');
    }
  }

  openConfirmDialog(holidayId: number): void {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'Holiday' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteHoliday(holidayId);
        }
      }
    );
  }

  deleteHoliday(id: number): void {
    this.holidayService
      .deleteHoliday(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.getAllHoliday(this.holidayName),
        error: (error) => console.error(error),
      });
  }

  addHoliday(): void {
    this.router.navigate(['layout/addholiday']);
  }

  editHoliday(holidayData: any): void {
    this.router.navigate(['layout/addholiday'], {
      state: { holidayData: holidayData },
    });
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
        },
        error: (error: any) => console.error('Error fetching holiday:', error),
      });
  }

  displayFn(option:string): string {
    return option && option ? option : '';
  }
}
