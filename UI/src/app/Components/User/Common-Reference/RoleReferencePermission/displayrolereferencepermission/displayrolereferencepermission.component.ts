import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { PAGE_INDEX, PAGE_SIZE, pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { Role } from 'src/app/Models/User/Role';
import { RoleReferencePermission } from 'src/app/Models/User/RoleReferencePermission';
import { User } from 'src/app/Models/User/User';
import { RoleReferencePermissionService } from 'src/app/Services/UserService/rolereferencepermission.service';

@Component({
  selector: 'app-displayrolereferencepermission',
  templateUrl: './displayrolereferencepermission.component.html',
  styleUrls: ['./displayrolereferencepermission.component.css'],
})
export class DisplayRoleReferencePermissionComponent {
  private subscription: Subscription;
  private destroy$ = new Subject<void>();
  organizationId = 0;
  roleId = 0;
  roleReferencePermissionData: RoleReferencePermission[] = [];
  public user: User = new User();
  displayedColumns: string[] = ['name', 'roleName', 'actions'];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  commonRefValue: string = '';
@ViewChild(MatPaginator) paginator!: MatPaginator;
  totalItems: number = 0;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;


   pageSizeOptions = pageSizeOptions;

  //ng on init
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      this.roleId = this.user.roleId;

      console.log(this.user.organizationId);
      console.log('role ID ' + this.roleId);
    }
    this.getRoleReferencePermissionByName('');
    this.roleReferencePermissionService.refreshRequired
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getRoleReferencePermissionByName(this.commonRefValue);
      });
  }

  constructor(
    private roleReferencePermissionService: RoleReferencePermissionService,
    private router: Router,
    public dialog: MatDialog
  ) {
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
    history.state.pageIndex = this.pageIndex;
    history.state.pageSize = this.pageSize;
   this.getRoleReferencePermissionByName(this.commonRefValue, this.pageIndex); // Pass pageIndex explicitly
  }

  openConfirmDialog(id: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete CommonReferenceType' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteRoleReferencePermission(id);
        }
      }
    );
  }

  deleteRoleReferencePermission(id: number) {
    this.roleReferencePermissionService
      .deleteRoleReferencePermission(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comnrefData) => {
          console.log(comnrefData);

          this.getRoleReferencePermissionByName(this.commonRefValue);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  addRoleReferencePermission() {
    this.router.navigate(['layout/addrolereferencepermission']);
  }

  editRoleReferencePermission(RoleReferencePermission: any) {
    console.log(RoleReferencePermission);
    this.roleReferencePermissionService
      .getWorkRoleReferencePermissionById(RoleReferencePermission.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comnrefData) => {
          console.log(comnrefData);
          this.router.navigate(['layout/addrolereferencepermission'], {
            state: { RoleReferencePermission: comnrefData },
          });
        },
        error: (error: any) => {
          console.error('Error fetching RoleReferencePermission:', error);
        },
      });
  }

  getRoleReferencePermissionByName(name: any, pageIndex: number = 0) {
    // Reset pageIndex if the search term has changed
    if (this.commonRefValue !== name) {
      this.pageIndex = 0;
    } else {
      this.pageIndex = pageIndex;
    }

    this.commonRefValue = name;
    this.roleReferencePermissionService
      .getAllRoleReferencePermissionByName(name, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (comnrefData) => {
          this.roleReferencePermissionData = comnrefData.records;
          this.totalItems = comnrefData.totalRecords;
          console.log(comnrefData.records);
        },
        error: (error: any) => {
          console.error('Error fetching RoleReferencePermission:', error);
        },
      });
  }
}
