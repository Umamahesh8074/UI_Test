import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { WeekOff } from 'src/app/Models/Leave/WeekOff';
import { WeekOffDto } from 'src/app/Models/Leave/WeekOffDto';
import { WeekOffPageWithReporteeCount } from 'src/app/Models/Leave/WeekOffPageWithReporteeCount';
import { User } from 'src/app/Models/User/User';
import { WeekOffService } from 'src/app/Services/LeaveService/WeekOff/week-off.service';

@Component({
  selector: 'app-display-week-off',
  templateUrl: './display-week-off.component.html',
  styleUrls: ['./display-week-off.component.css'],
})
export class DisplayWeekOffComponent {
  private destroy$ = new Subject<void>();
  leaveRequestData: WeekOff[] = [];
  WeekOffDtoData: WeekOffDto[] = [];
  totalReporteeCount: number = 0;
  weekOffPageWithReporteeCount: WeekOffPageWithReporteeCount =
    new WeekOffPageWithReporteeCount();

  user: User = new User();
  userId: number | null = null;
  managerId: number | null = null;
  roleName: string | null = null;

  displayedColumns: string[] = ['userName', 'startDate', 'status', 'actions'];
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;

  constructor(
    private weekOffService: WeekOffService,
    private router: Router,
    public dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.userId = this.user.userId;
      this.managerId = this.user.managerId || null; // Assuming managerId is stored in the user object
      this.roleName = this.user.roleName;
      if (!isNaN(this.userId)) {
        this.fetchWeekOffRequestsBasedOnRole();
      } else {
        console.error('Invalid userId in local storage.');
      }
    } else {
      console.error('userId not found in local storage.');
    }

    this.weekOffService.refreshRequired
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchWeekOffRequestsBasedOnRole();
      });
  }

  fetchWeekOffRequestsBasedOnRole(): void {
    if (this.isManager()) {
      // Fetch manager's leave requests

      this.fetchWeekOffs();
      // this.fetchTeamLeaveRequests();
    } else {
      // Fetch user's own leave requests
      this.fetchWeekOffs();
    }
  }

  isManager(): boolean {
    return this.totalReporteeCount > 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchWeekOffs();
  }

  fetchWeekOffs(): void {
    if (this.userId) {
      this.weekOffService
        .getWeekOffByUserId(this.userId, this.pageIndex, this.pageSize)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (weekOff: any) => {
            this.weekOffPageWithReporteeCount = weekOff;
            this.totalReporteeCount =
              this.weekOffPageWithReporteeCount.totalReporteeCount;
            this.WeekOffDtoData =
              this.weekOffPageWithReporteeCount.pageData.records.map(
                (record: any) => ({
                  ...record,
                  // Format the date with hyphens
                  date: this.datePipe.transform(record.date, 'MM-dd-yyyy'),
                })
              );
            this.totalItems = weekOff.pageData.totalRecords;
          },
          error: (error: any) =>
            console.error('Error fetching weekOff:', error),
        });
    }
  }

  openConfirmDialog(userId: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: ' delete Week Off' },
    });

    dialogRef.componentInstance.isConfirmDelete
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.deleteweekOff(userId);
        }
      });
  }

  deleteweekOff(userId: number) {
    this.weekOffService
      .deleteWeekOff(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('User deleted successfully:', response);
          // Trigger refresh after deletion
          this.weekOffService.refreshRequired.next();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        },
      });
  }

  addWeekOff() {
    this.router.navigate(['layout/addweekoff']);
  }

  editWeekOff(weekOff: WeekOff) {
    console.log(weekOff);
    this.router.navigate(['layout/addweekoff'], {
      state: { weekOff: weekOff },
    });
  }
}
