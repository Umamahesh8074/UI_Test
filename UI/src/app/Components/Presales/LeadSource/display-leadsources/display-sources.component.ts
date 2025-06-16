import { Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import { LeadSourceService } from 'src/app/Services/Presales/LeadSource/lead-source.service';

@Component({
  selector: 'app-display-sources',
  templateUrl: './display-sources.component.html',
  styleUrls: ['./display-sources.component.css'],
})
export class DisplayLeadSourcesComponent {
  private destroy$ = new Subject<void>();
  leadSourceData: LeadSource[] = [];
  leadSourceName: string = '';
  displayedColumns: string[] = ['name', 'status', 'actions'];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;

  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  pageSizeOptions = pageSizeOptions;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    this.leadSourceService.refreshRequired.subscribe(() => {
      this.getLeadSource(this.leadSourceName);
    });
  }

  constructor(
    private leadSourceService: LeadSourceService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.getLeadSource(this.leadSourceName);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getLeadSource(this.leadSourceName);
  }
  onSearch(leadSourceName: any) {
    console.log('entered');

    this.pageIndex = 0;
    this.paginator.firstPage();
    this.getLeadSource(leadSourceName);
  }

  getLeadSource(leadSourceName: any) {
    this.leadSourceName = leadSourceName;
    this.leadSourceService
      .getAllLeadSource(leadSourceName, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (leadsource) => {
          this.leadSourceData = leadsource.records;
          this.totalItems = leadsource.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ///opening confirm dialog
  openConfirmDialog(leadSourceId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'leadSource' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteLeadSource(leadSourceId);
        }
      }
    );
  }

  deleteLeadSource(menuId: number) {
    this.leadSourceService
      .deleteLeadSource(menuId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (menuData) => {
          console.log(menuData);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  //adding menu
  addLeadSource() {
    this.router.navigate(['layout/presales/leadsource']);
  }

  editLeadSource(leadSource: any) {
    this.router.navigate(['layout/presales/leadsource'], {
      state: { leadSource: leadSource },
    });
  }
  refreshTable() {
    this.getLeadSource(this.leadSourceName);
  }
}
