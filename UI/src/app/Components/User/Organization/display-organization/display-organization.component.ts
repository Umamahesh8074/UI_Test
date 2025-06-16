import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { OrganizationBean } from 'src/app/Models/User/Organization';
import { OrganizationService } from 'src/app/Services/UserService/organization.service';

@Component({
  selector: 'app-display-organization',
  templateUrl: './display-organization.component.html',
  styleUrls: ['./display-organization.component.css'],
})
export class DisplayOrganizationComponent {
  organizations: OrganizationBean[] = [];
  organizationName: string | null = null;
  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;
  displayedColumns: string[] = [
    'rowNumber',
    'name',
    `contact`,
    `status`,
    'actions',
  ];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  organization: OrganizationBean = new OrganizationBean();

  constructor(
    private organizationService: OrganizationService,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.fetchAllOrganizations('');
  }

  // this function is used to get organizations with out pagination
  getAllOrganizations() {
    this.organizationService.getAllOrganizations().subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  //fetching all organizations with pagination and sorting
  fetchAllOrganizations(organizationName: string | null = '') {
    this.organizationService
      .fetchAllOrganizations(organizationName, this.pageIndex, this.pageSize)
      .subscribe({
        next: (data) => {
          this.organizations = data.records;
          this.totalItems = data.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  //opening confirm dialog
  openConfirmDialog(organization: OrganizationBean) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: {
        displayedData:
          'delete Organization Name : ' + organization.organizationName,
      }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteOrganization(organization);
        }
      }
    );
  }
  deleteOrganization(organization: OrganizationBean) {
    this.organizationService.deleteOrganization(organization).subscribe({
      next: (data) => {
        console.log(data);
        this.fetchAllOrganizations();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchAllOrganizations(
      this.organizationName ? this.organizationName : ''
    );
  }

  onEdit(organizationId: any) {
    if (organizationId != null) {
      this.organizationService
        .getOrganizationById(organizationId)
        .subscribe((Organization: OrganizationBean) => {
          this.organization = Organization;
          this.router.navigate(['./addorganization'], {
            relativeTo: this.route.parent,
            state: {
              organization: this.organization,
            },
          });
        });
    }
  }
  addOrganization() {
    this.router.navigate(['./addorganization'], {
      relativeTo: this.route.parent,
    });
  }
}
