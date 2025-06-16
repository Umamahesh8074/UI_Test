import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { LeaveRequest } from 'src/app/Models/Leave/LeaveRequest';
import { LeaveRequestDto } from 'src/app/Models/Leave/LeaveRequestDto';
import { LeaveRequestPageWithReporteeCount } from 'src/app/Models/Leave/LeaveRequestPageWithCount';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LeaveRequestService } from 'src/app/Services/LeaveService/LeaveRequest/leave-request.service';

@Component({
  selector: 'app-display-team-leaves',
  templateUrl: './display-team-leaves.component.html',
  styleUrls: ['./display-team-leaves.component.css'],
})
export class DisplayTeamLeavesComponent {
  private destroy$ = new Subject<void>();
  leaveRequestData: LeaveRequest[] = [];
  leaveRequestDtoData: LeaveRequestDto[] = [];
  totalReporteeCount: number = 0;
  leaveRequestPageWithReporteeCount: LeaveRequestPageWithReporteeCount =
    new LeaveRequestPageWithReporteeCount();
    formData!: FormGroup;
    status: string = '';
  user: User = new User();
  userId: number | null = null;
  managerId: number | null = null;
  roleName: string | null = null;
  userName: string = '';
  startDate: any;
  endDate: any;
  dateRange: any = 0;
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
  organizationId:number=0;
  days: CommonReferenceDetails[] = [];
  daysType: string = 'Filter_Days';
showDateRangePicker: any;
  constructor(
    private leaveRequestService: LeaveRequestService,
    private router: Router,
    public dialog: MatDialog,
    private datePipe: DatePipe,
    private commonService:CommanService,
    
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.userId = this.user.userId;
      this.organizationId=this.user.organizationId;
      this.managerId = this.user.managerId || null; // Assuming managerId is stored in the user object
      this.roleName = this.user.roleName;
      if (!isNaN(this.userId)) {
        // this.fetchLeaveRequestsBasedOnRole();
        this.fetchTeamLeaveRequests(this.userName);
      } else {
        console.error('Invalid userId in local storage.');
      }
    } else {
      console.error('userId not found in local storage.');
    }
this.fetchFilterDays();
    this.leaveRequestService.refreshRequired
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

  
  fetchFilterDays() {
    this.commonService.getRefDetailsByType(this.daysType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        // Directly assign the response to this.days without filtering
        this.days = response;
      },
      error: (error) => console.error(error),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchTeamLeaveRequests(this.userName);
  }

  fetchTeamLeaveRequests(userName: string) {
    if (this.userId) {
      if(this.user.roleName=='HR')
      {
        this.leaveRequestService
        .getleavesbyorganizationid(
          this.organizationId,
          userName,
          
          this.pageIndex,
          this.pageSize, 
          this.dateRange,
          this.startDate,
          this.endDate,
          this.status
        )
        
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (leaveRequest: any) => {
            console.log(leaveRequest);
            // this.leaveRequestPageWithReporteeCount = leaveRequest;
            // this.totalReporteeCount =
            //   this.leaveRequestPageWithReporteeCount.totalReporteeCount;

            // this.leaveRequestDtoData =
            //   .records.map(
            //     (record: any) => ({
            //       ...record,
            //       startDate: this.datePipe.transform(
            //         record.startDate,
            //         'yyyy-MM-dd'
            //       ),
            //       endDate: this.datePipe.transform(
            //         record.endDate,
            //         'yyyy-MM-dd'
            //       ),
            //     })
            //   );
            this.leaveRequestDtoData=leaveRequest.records;
            this.totalItems = leaveRequest.totalRecords;
          },
          error: (error: any) =>
            console.error('Error fetching team leave requests:', error),
        });
      }
      else{
        this.leaveRequestService
        .getTeamLeaveRequestsByManagerId(
          userName,
          this.userId,
          this.pageIndex,
          this.pageSize
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (leaveRequest: any) => {
            console.log(leaveRequest);
            this.leaveRequestPageWithReporteeCount = leaveRequest;
            this.totalReporteeCount =
              this.leaveRequestPageWithReporteeCount.totalReporteeCount;
            this.leaveRequestDtoData =
              this.leaveRequestPageWithReporteeCount.pageData.records.map(
                (record: any) => ({
                  ...record,
                  startDate: this.datePipe.transform(
                    record.startDate,
                    'yyyy-MM-dd'
                  ),
                  endDate: this.datePipe.transform(
                    record.endDate,
                    'yyyy-MM-dd'
                  ),
                })
              );
            this.totalItems = leaveRequest.pageData.totalRecords;
          },
          error: (error: any) =>
            console.error('Error fetching team leave requests:', error),
        });
      }
      
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
          this.fetchTeamLeaveRequests('');
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        },
      });
  }

  addLeaveRequest() {
    this.router.navigate(['layout/addteamleaverequest']);
  }

  editLeaveRequest(leaveRequest: LeaveRequest) {
    console.log(leaveRequest);
    this.router.navigate(['layout/addteamleaverequest'], {
      state: { leaveRequest: leaveRequest },
    });
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
     // this.fetchTeamLeaveRequests();

      this.showDateRangePicker = false;
    }
  }
}
