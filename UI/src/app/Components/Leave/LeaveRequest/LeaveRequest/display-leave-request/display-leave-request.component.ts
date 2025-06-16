import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  COMMON_STATUS,
  pageSizeOptions,
} from 'src/app/Constants/CommanConstants/Comman';
import { LeaveRequest } from 'src/app/Models/Leave/LeaveRequest';
import { LeaveRequestDto } from 'src/app/Models/Leave/LeaveRequestDto';
import { LeaveRequestPageWithReporteeCount } from 'src/app/Models/Leave/LeaveRequestPageWithCount';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LeaveRequestService } from 'src/app/Services/LeaveService/LeaveRequest/leave-request.service';

@Component({
  selector: 'app-display-leave-request',
  templateUrl: './display-leave-request.component.html',
  styleUrls: ['./display-leave-request.component.css'],
})
export class DisplayLeaveRequestComponent {
  private destroy$ = new Subject<void>();
  leaveRequestData: LeaveRequest[] = [];
  leaveRequestDtoData: LeaveRequestDto[] = [];
  totalReporteeCount: number = 0;
  leaveRequestPageWithReporteeCount: LeaveRequestPageWithReporteeCount =
    new LeaveRequestPageWithReporteeCount();

  user: User = new User();
  userId: number | null = null;
  managerId: number | null = null;
  roleName: string | null = null;

  displayedColumns: string[] = [
    'userName',
    'startDate',
    'endDate',
    'reason',
    'status',
    'actions',
  ];
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;

  constructor(
    private leaveRequestService: LeaveRequestService,
    private router: Router,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private commonService: CommanService
  ) {}

  ngOnInit(): void {
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.userId = this.user.userId;
      this.managerId = this.user.managerId || null; // Assuming managerId is stored in the user object
      this.roleName = this.user.roleName;
      if (!isNaN(this.userId)) {
        this.fetchLeaveRequestsBasedOnRole();
      } else {
        console.error('Invalid userId in local storage.');
      }
    } else {
      console.error('userId not found in local storage.');
    }

    this.leaveRequestService.refreshRequired
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchLeaveRequestsBasedOnRole();
      });
  }

  fetchLeaveRequestsBasedOnRole(): void {
    if (this.isManager()) {
      // Fetch manager's leave requests

      this.fetchLeaveRequests();
      // this.fetchTeamLeaveRequests();
    } else {
      // Fetch user's own leave requests
      this.fetchLeaveRequests();
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
    this.fetchLeaveRequests();
  }

  fetchLeaveRequests(): void {
    if (this.userId) {
      this.leaveRequestService
        .getLeaveRequestsByUserId(this.userId, this.pageIndex, this.pageSize)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (leaveRequest: any) => {
            this.leaveRequestPageWithReporteeCount = leaveRequest;
            this.totalReporteeCount =
              this.leaveRequestPageWithReporteeCount.totalReporteeCount;
            this.leaveRequestDtoData =
              this.leaveRequestPageWithReporteeCount.pageData.records.map(
                (record: any) => ({
                  ...record,
                  // Format the date with hyphens
                  date: this.datePipe.transform(record.date, 'MM-dd-yyyy'),
                })
              );
            this.totalItems = leaveRequest.pageData.totalRecords;
          },
          error: (error: any) =>
            console.error('Error fetching holiday:', error),
        });
    }
  }

  openConfirmDialog(userId: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'LeaveRequest' },
    });

    dialogRef.componentInstance.isConfirmDelete
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.deleteLeaveRequest(userId);
        }
      });
  }

  deleteLeaveRequest(userId: number) {
    this.leaveRequestService
      .deleteLeaveRequest(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('User deleted successfully:', response);
          // Trigger refresh after deletion
          this.leaveRequestService.refreshRequired.next();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        },
      });
  }

  addLeaveRequest() {
    this.router.navigate(['layout/addleaverequest']);
  }

  editLeaveRequest(leavereuest: LeaveRequest) {
    this.router.navigate(['layout/addleaverequest'], {
      state: { leavereuest: leavereuest },
    });
  }


}
