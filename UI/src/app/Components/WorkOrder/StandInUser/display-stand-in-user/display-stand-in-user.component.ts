import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TIME_OUT,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { NAVIGATE_TO_ADD_STAND_IN_USER } from 'src/app/Constants/WorkOrder/workorder';
import { IStandInUserDto } from 'src/app/Models/WorkOrder/StandInUser';
import { StandInUserService } from 'src/app/Services/WorkOrderService/StandInUser/stand-in-user.service';

@Component({
  selector: 'display-stand-in-user',
  templateUrl: './display-stand-in-user.component.html',
  styleUrls: ['./display-stand-in-user.component.css'],
})
export class DisplayStandInUserComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;

  //pagination
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  id: number = 0;
  managerId: number = 0;
  managerName: string = '';
  userId: number = 0;
  userName: string = '';
  status: string = '';
  standInUserData: IStandInUserDto[] = [];

  displayedColumns: string[] = [
    'id',
    'managerId',
    'managerName',
    'userId',
    'userName',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    this.getAllStandInUsers();
    this.standInUserService.refreshRequired.subscribe(() => {
      this.getAllStandInUsers();
    });
  }
  constructor(
    private standInUserService: StandInUserService,
    private router: Router,
    public dialog: MatDialog,
    private toastrService: ToastrService
  ) {}

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllStandInUsers();
  }

  getAllStandInUsers() {
    this.standInUserService
      .getAllStandInUsers(
        this.userName,

        this.pageIndex,
        this.pageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (standInUsers) => {
          this.standInUserData = standInUsers.records;
          this.totalItems = standInUsers.totalRecords;
        },
        error: (error: Error) => {
          console.error('Error fetching StandInUser:', error);
        },
      });
  }

  onSearch(userName: string) {
    if (
      userName.length >= searchTextLength ||
      userName.length === searchTextZero
    ) {
      this.userName = userName;

      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllStandInUsers();
    }
  }

  openConfirmDialog(standInUserId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete StandInUser' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteStandInUser(standInUserId);
        }
      }
    );
  }

  deleteStandInUser(standInUserId: number) {
    this.standInUserService.inActivateStandInUser(standInUserId).subscribe({
      next: (response: any) => {
        this.handleSuccessResponse(response);
      },
      error: (error: Error) => {
        console.error('Error deleting StandInUser:', error);
      },
    });
  }

  AddStandInUser() {
    this.router.navigate([NAVIGATE_TO_ADD_STAND_IN_USER], {
      state: { isAdding: true },
    });
  }

  editStandInUser(primeActivityNumberData: any) {
    this.fetchStandInUserById(primeActivityNumberData.primeActivityId);
  }

  fetchStandInUserById(primeActivityId: number) {
    this.standInUserService
      .getStandInUserById(primeActivityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (standInUserData) => {
          console.log(standInUserData);
          this.router.navigate([NAVIGATE_TO_ADD_STAND_IN_USER], {
            state: { standInUser: standInUserData, isAdding: false },
          });
        },
        error: (error) => {
          console.error(error);
          console.error('Error fetching StandInUser by id:', error);
        },
      });
  }

  handleSuccessResponse(response: any): void {
    console.log(response.message);
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
