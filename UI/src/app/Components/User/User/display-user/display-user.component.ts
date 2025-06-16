import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { User } from 'src/app/Models/User/User';
import { UserDto } from 'src/app/Models/User/UserDto';
import { UserService } from 'src/app/Services/UserService/userservice.service';

@Component({
  selector: 'app-display-user',
  templateUrl: './display-user.component.html',
  styleUrls: ['./display-user.component.css'],
})
export class DisplayUserComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  userData: UserDto[] = [];
  userName: string = '';
  dataSource!: any;
  displayedColumns: string[] = [
    'rowNumber',
    'userName',
    'email',
    'phoneNumber',
    'roleName',
    'managerName',
    'status',
    'actions',
  ];
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;

  constructor(
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog
  ) {}
  public user: User = new User();
  organizationId: any;
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      console.log(this.user.organizationId);
      this.organizationId = this.user.organizationId;
      console.log(this.organizationId);
    }
    if (this.user.roleName == 'Channel Partner') {
      this.getChannelPartnerUsers();
    } else {
      this.getUsers('');
    }

    this.userService.refreshRequired
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getUsers(this.userName);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    if (this.user.roleName == 'Channel Partner') {
      this.getChannelPartnerUsers();
    } else {
      this.getUsers(this.userName);
    }
  }
  // onPageChange(event: any) {
  //   this.pageSize = event.pageSize;
  //   this.pageIndex = event.pageIndex;
  //   this.getApprovalChannelPartners(this.name,this.pageIndex,this.pageSize,this.isApproval);

  // }
  onSearch(userName: any) {
    this.userName = userName;
    this.pageIndex = 0;
    this.paginator.firstPage();
    if (this.user.roleName == 'Channel Partner') {
      if (userName.length > 3 || userName.length == 0) {
        this.userName = userName;
        this.getChannelPartnerUsers();
      }
    } else {
      this.userName = userName;
      this.getUsers(this.userName);
    }
  }

  getChannelPartnerUsers() {
    console.log('channel partner users');
    this.userService
      .getCpUsers(
        this.userName,
        this.pageIndex,
        this.pageSize,
        this.user.organizationId,
        this.user.userId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.userData = response.records;

          this.totalItems = response.totalRecords;
          this.dataSource = new MatTableDataSource(this.userData);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  getUsers(userName: string) {
    this.userService
      .getAllUsersByName(
        this.userName,
        this.pageIndex,
        this.pageSize,
        this.organizationId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userData) => {
          this.userData = userData.records;
          console.log(userData.records);
          this.totalItems = userData.totalRecords;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }

  openConfirmDialog(userId: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete User' },
    });

    dialogRef.componentInstance.isConfirmDelete
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.deleteUser(userId);
        }
      });
  }

  deleteUser(userId: number) {
    this.userService
      .deleteUser(userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('User deleted successfully:', response);
          // Trigger refresh after deletion
          this.userService.refreshRequired.next();
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        },
      });
  }

  addUser() {
    this.router.navigate(['layout/adduser'], {
      state: { organizationId: this.organizationId },
    });
  }

  editUser(userData: any) {
    this.userService
      .getUserById(userData.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.router.navigate(['layout/adduser'], {
            state: { userData: response, organizationId: this.organizationId },
          });
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        },
      });
  }

}
