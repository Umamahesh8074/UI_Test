import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  pageSizeOptions,
  WEEK_DAYS,
} from 'src/app/Constants/CommanConstants/Comman';
import { WeekOff } from 'src/app/Models/Leave/WeekOff';
import { WeekOffDto } from 'src/app/Models/Leave/WeekOffDto';
import { WeekOffPageWithReporteeCount } from 'src/app/Models/Leave/WeekOffPageWithReporteeCount';
import { User } from 'src/app/Models/User/User';
import { LeadsCommonService } from 'src/app/Services/CommanService/leads-common.service';
import { WeekOffService } from 'src/app/Services/LeaveService/WeekOff/week-off.service';

@Component({
  selector: 'app-display-team-week-off',
  templateUrl: './display-team-week-off.component.html',
  styleUrls: ['./display-team-week-off.component.css'],
})
export class DisplayTeamWeekOffComponent {
  private destroy$ = new Subject<void>();
  weekOffData: WeekOff[] = [];
  weekOffDtoData: WeekOffDto[] = [];
  totalReporteeCount: number = 0;
  weekOffPageWithReporteeCount: WeekOffPageWithReporteeCount =
    new WeekOffPageWithReporteeCount();

  user: User = new User();
  userId: number | null = null;
  managerId: number | null = null;
  roleName: string | null = null;
  userName: string = '';

  displayedColumns: string[] = [
    'rowNumber',
    'userName',
    'startDate',
    'status',
    'actions',
  ];
  totalItems: number = 0;
  pageSize: number = 20;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;
  weekDays = WEEK_DAYS;
  weekOffDay: string = '';
  constructor(
    private weekOffService: WeekOffService,
    private router: Router,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private leadCommonService: LeadsCommonService
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.userId = this.user.userId;
      this.managerId = this.user.managerId || null; // Assuming managerId is stored in the user object
      this.roleName = this.user.roleName;
      if (!isNaN(this.userId)) {
        // this.fetchLeaveRequestsBasedOnRole();
        this.fetchTeamWeekOff(this.userName);
      } else {
        console.error('Invalid userId in local storage.');
      }
    } else {
      console.error('userId not found in local storage.');
    }

    this.weekOffService.refreshRequired
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // this.fetchLeaveRequestsBasedOnRole();
      });
  }

  // fetchLeaveRequestsBasedOnRole(): void {
  //   if (this.isManager()) {
  //     // Fetch manager's leave requests

  //     this.fetchLeaveRequests();
  //     // this.fetchTeamLeaveRequests();
  //   } else {
  //     // Fetch user's own leave requests
  //     this.fetchLeaveRequests();
  //   }
  // }

  // isManager(): boolean {
  //   return this.totalReporteeCount>0;
  // }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchTeamWeekOff(this.userName);
  }

  fetchTeamWeekOff(userName: string) {
    this.leadCommonService.showLoading();
    if (this.userId) {
      this.weekOffService
        .getTeamWeekOffByManagerId(
          userName,
          this.userId,
          this.pageIndex,
          this.pageSize,
          this.weekOffDay
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (weekOff: any) => {
            this.leadCommonService.hideLoading();
            this.weekOffDtoData = weekOff.content;
            this.totalItems = weekOff.totalElements;
          },
          error: (error: any) => {
            this.leadCommonService.hideLoading();
            console.error('Error fetching team leave requests:', error);
          },
        });
    }
  }

  openConfirmDialog(userId: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'Inactive  WeekOff' },
    });

    dialogRef.componentInstance.isConfirmDelete
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.deleteWeekOff(userId);
        }
      });
  }

  deleteWeekOff(userId: number) {
    this.weekOffService
      .deleteWeekOff(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('User deleted successfully:', response);
          // Trigger refresh after deletion
          this.fetchTeamWeekOff('');
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        },
      });
  }

  addWeekOff() {
    this.router.navigate(['layout/addteamweekoff']);
  }

  editWeekOff(weekOff: WeekOff) {
    console.log(weekOff);
    this.router.navigate(['layout/addteamweekoff'], {
      state: { weekOff: weekOff },
    });
  }
  onSelectWeekDay(event: any) {
    console.log(event.value);
    if (event.value.toLowerCase() == 'all') {
      this.weekOffDay = '';
    } else this.weekOffDay = event.value;

    this.fetchTeamWeekOff(this.userName);
  }
}
