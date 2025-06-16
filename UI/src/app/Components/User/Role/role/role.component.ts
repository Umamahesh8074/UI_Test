import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { Role, RoleDto } from 'src/app/Models/User/Role';
import { User } from 'src/app/Models/User/User';
import { RoleService } from 'src/app/Services/UserService/role.service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
})
export class RoleComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private destroy$ = new Subject<void>();
  roleData: RoleDto[] = [];
  roleName: string = '';
  displayedColumns: string[] = [
    'roleName',
    'homePageName',
    'status',
    'actions',
  ];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  organizationId: any;
  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;
  public user: User = new User();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      console.log(this.user.organizationId);
      this.organizationId = this.user.organizationId;
      console.log(this.organizationId);
    }
    this.getRole(this.roleName, this.organizationId);
  }

  onRoleSerach(searchText: any) {
    this.pageIndex = 0;
    this.paginator.firstPage();
    this.roleName = searchText;
    this.getRole(this.roleName, this.organizationId);
  }

  constructor(
    private roleService: RoleService,
    private router: Router,
    public dialog: MatDialog
  ) {
    //this.getRole(this.roleName, this.organizationId);
    this.subscription = new Subscription();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next(); // Unsubscribe from the destroy$ Subject
    this.destroy$.complete(); // Complete the destroy$ Subject
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getRole(this.roleName, this.organizationId);
  }

  getRole(roleName: any, organizationId: any) {
    console.log('org id' + organizationId);
    this.roleName = roleName;
    this.roleService
      .getAllRole(roleName, this.pageIndex, this.pageSize, organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (roleData) => {
          this.roleData = roleData.records;
          this.totalItems = roleData.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ///opening confirm dialog
  openConfirmDialog(roleId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Role' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteRole(roleId);
        }
      }
    );
  }

  //delete menu by menu id
  deleteRole(roleId: number) {
    this.roleService
      .deleteRole(roleId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (roleData) => {
          console.log(roleData);
          this.getRole('', this.organizationId);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  //adding role
  addRole() {
    this.router.navigate(['layout/addrole'], {
      state: { organizationId: this.organizationId },
    });
  }

  editRole(roleData: any) {
    this.router.navigate(['layout/addrole'], {
      state: { role: roleData, organizationId: this.organizationId },
    });
  }
}
