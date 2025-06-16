import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  pageSizeOptions,
  searchTextZero,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  DisplaySecuritypatrol,
  ScheduleItemDto,
} from 'src/app/Models/Securitypatrol/securitypatrol';
import { Role } from 'src/app/Models/User/Role';
import { User } from 'src/app/Models/User/User';
import { SecuritypatrolService } from 'src/app/Services/Securitypatrol/securitypatrol.service';
import { RoleService } from 'src/app/Services/UserService/role.service';

@Component({
  selector: 'app-displaysecuritypatrol',
  templateUrl: './display-securitypatrol.component.html',
  styleUrls: ['./display-securitypatrol.component.css'],
  encapsulation: ViewEncapsulation.None, // Set ViewEncapsulation to None
})
export class DisplaysecuritypatrolComponent implements OnInit {
  roles: Role[] = [];
  public user: User = new User();
  private destroy$ = new Subject<void>();
  securitypatrolData: DisplaySecuritypatrol[] = [];
  scheduleTimeDto: ScheduleItemDto[] = [];
  isAdding = false;
  isView = true;
  securityPatrolName: string = '';
  displayedColumns: string[] = [
    'userName',
    'projectName',
    'location',
    'securityPatrolName',
    'scheduleItems',
    'status',
    'actions',
  ];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  organizationId = 0;
  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  securitypatrol: any;
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      console.log(this.user.organizationId);
      console.log('ORG ID ' + this.organizationId);
      this.getSecuritypatrol(this.securityPatrolName, this.organizationId);
    }
  }
  pageSizeOptions = pageSizeOptions;
  constructor(
    private securitypatrolService: SecuritypatrolService,
    private router: Router,
    public dialog: MatDialog,
    private roleService: RoleService
  ) {}

  onSearch(searchText: any) {
    if (searchText.length >= 3 || searchText.length === searchTextZero) {
      this.securityPatrolName = searchText;
      this.pageIndex = 0; // Reset page index when searching
      this.getSecuritypatrol(this.securityPatrolName, this.organizationId);
    }
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getSecuritypatrol(this.securityPatrolName, this.organizationId);
  }

  getSecuritypatrol(name: any, organizationId: number) {
    this.securityPatrolName = name;
    this.securitypatrolService
      .getAllSecuritypatrolDto(
        this.securityPatrolName,
        this.pageIndex,
        this.pageSize,
        organizationId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (securitypatrolData) => {
          this.securitypatrolData = securitypatrolData.records;
          this.totalItems = securitypatrolData.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
    // Fetch initial data
  }

  fetchRoles() {
    this.roleService.fetchAllRoles('', this.organizationId).subscribe({
      next: (roles: any) => {
        console.log(roles);
        this.roles = roles;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }
  ///opening confirm dialog
  openConfirmDialog(securityTimeId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'Securitypatrol' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteSecuritypatrol(securityTimeId);
        }
      }
    );
  }

  //delete securitypatrol by securitypatrol id
  deleteSecuritypatrol(securityTimeId: number) {
    this.securitypatrolService
      .deleteSecuritypatrol(securityTimeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (securitypatrolData) => {
          console.log(securitypatrolData);
          this.getSecuritypatrol(this.securityPatrolName, this.organizationId);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  //adding securitypatrol
  addSecuritypatrol() {
    this.router.navigate(['layout/facility/management/securitypatrol'], {
      state: { isAdding: true },
    });
  }

  // editSecuritypatrol(securitypatrolData: any) {
  // securitypatrolData = securitypatrolData
  // console.log(securitypatrolData);
  //   this.router.navigate(['layout/facility/management/securitypatrol'], {
  //     state: { securitypatrolObject: securitypatrolData },
  //   });
  // }

  editSecuritypatrol(securitypatrol: any) {
    console.log('id taking ', securitypatrol.scheduleTimeId);
    this.getSecurityPatrolById(securitypatrol.scheduleTimeId).subscribe({
      next: (response) => {
        console.log(response); // Verify if data is correctly fetched
        this.scheduleTimeDto = response;
        // Navigate with state once the data is available
        this.router.navigate(['layout/facility/management/securitypatrol'], {
          state: { securitypatrol: this.scheduleTimeDto },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  getSecurityPatrolById(id: number) {
    return this.securitypatrolService
      .getSecurityPatrolByScheduleTimeId(id)
      .pipe(takeUntil(this.destroy$));
  }
}
