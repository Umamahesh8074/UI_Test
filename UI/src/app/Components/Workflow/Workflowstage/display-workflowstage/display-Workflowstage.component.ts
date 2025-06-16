import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Subject, takeUntil, tap } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { WorkflowStage } from 'src/app/Models/Workflow/workflowstage';
import { WorkflowstageService } from 'src/app/Services/WorkflowService/workflowstage.service';

@Component({
  selector: 'app-displayworkflowstage',
  templateUrl: './display-workflowstage.component.html',
  styleUrls: ['./display-workflowstage.component.css'],
  encapsulation: ViewEncapsulation.None, // Set ViewEncapsulation to None
})
export class DisplayworkflowstageComponent implements OnInit {
  private destroy$ = new Subject<void>();
  workflowstageData: WorkflowStage[] = [];
  workflowstageName: string = '';
  displayedColumns: string[] = [
    'workflowTypeName',
    'workflowStageName',
    'description',
    'orderIndex',
    'status',
    'actions',
  ];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;

  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  pageSizeOptions = pageSizeOptions;
  ngOnInit(): void {
    this.getWorkflowstage('');
    this.workflowstageService.refreshRequired
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getWorkflowstage(this.workflowstageName);
      });
  }

  constructor(
    private workflowstageService: WorkflowstageService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.getWorkflowstage(this.workflowstageName);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getWorkflowstage(this.workflowstageName);
  }

  getWorkflowstage(workflowstageName: any) {
    this.workflowstageName = workflowstageName;
    this.workflowstageService
      .getAllWorkflowstage(workflowstageName, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (workflowstageData) => {
          this.workflowstageData = workflowstageData.records;

          this.totalItems = workflowstageData.totalRecords;
          console.log(workflowstageData);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ///opening confirm dialog
  openConfirmDialog(id: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Workflowstage' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteWorkflowstage(id);
        }
      }
    );
  }

  //delete workflowstage by workflowstage id
  deleteWorkflowstage(workflowStageId: number) {
    this.workflowstageService
      .deleteWorkflowstage(workflowStageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (workflowstageData) => {
          console.log(workflowstageData);
          this.getWorkflowstage(this.workflowstageName);
          this.workflowstageService.refreshRequired.next();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  //adding workflowstage
  addWorkflowstage() {
    this.router.navigate(['layout/addworkflowstage']);
  }

  editWorkflowstage(workflowstageData: any) {
    console.log(workflowstageData);
    this.workflowstageService
      .getWorkflowstageByTypeById(workflowstageData.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (workflowstageData) => {
          this.router.navigate(['layout/addworkflowstage'], {
            state: { workflowstage: workflowstageData },
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
