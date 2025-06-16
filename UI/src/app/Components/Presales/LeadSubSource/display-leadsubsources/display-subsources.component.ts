import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { LeadSubSourceDto } from 'src/app/Models/Presales/leadsubsource';
import { LeadSubsourceService } from 'src/app/Services/Presales/LeadSubSource/lead-subsource.service';

@Component({
  selector: 'app-display-subsources',
  templateUrl: './display-subsources.component.html',
  styleUrls: ['./display-subsources.component.css'],
})
export class DisplayLeadSubSourcesComponent {
  private destroy$ = new Subject<void>();
  leadSubSourceData: LeadSubSourceDto[] = [];
  leadSubSourceName: string = '';
  displayedColumns: string[] = ['sourceName', 'name', 'status', 'actions'];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  pageSizeOptions = pageSizeOptions;
  sourceId: any;
  ngOnInit(): void {
    this.leadSubsourceService.refreshRequired.subscribe(() => {
      this.getLeadSubSource(this.leadSubSourceName);
    });
  }

  constructor(
    private leadSubsourceService: LeadSubsourceService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.getLeadSubSource(this.leadSubSourceName);
  }
  onSearch(leadSubSourceName: any) {
    console.log('entered');
    this.pageIndex = 0;
    this.paginator.firstPage();
    this.getLeadSubSource(leadSubSourceName);
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getLeadSubSource(this.leadSubSourceName);
  }

  getLeadSubSource(leadSourceName: any) {
    this.leadSubSourceName = leadSourceName;
    console.log(this.leadSubSourceName);
    this.leadSubsourceService
      .getAllLeadSubSource(
        this.leadSubSourceName,
        this.pageIndex,
        this.pageSize,
        this.sourceId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (leadSubsource) => {
          this.leadSubSourceData = leadSubsource.records;
          this.totalItems = leadSubsource.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ///opening confirm dialog
  openConfirmDialog(leadSourceId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'leadSubSource' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteLeadSubSource(leadSourceId);
        }
      }
    );
  }

  deleteLeadSubSource(leadSourceId: number) {
    this.leadSubsourceService
      .deleteLeadSubSource(leadSourceId)
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
  addLeadSubSource() {
    this.router.navigate(['layout/presales/leadsubsource']);
  }

  editLeadSubSource(leadSubSource: any) {
    console.log(leadSubSource);
    this.router.navigate(['layout/presales/leadsubsource'], {
      state: { leadSubSource: leadSubSource },
    });
  }
  refreshTable() {
    this.getLeadSubSource(this.leadSubSourceName);
  }
}
