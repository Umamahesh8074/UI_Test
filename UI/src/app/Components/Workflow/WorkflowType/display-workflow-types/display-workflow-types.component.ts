import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, Subscription, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { WorkflowType } from 'src/app/Models/Workflow/WorkflowType';
import { WorkflowTypeService } from 'src/app/Services/WorkflowService/workflow-type.service';

@Component({
  selector: 'app-display-workflow-types',
  templateUrl: './display-workflow-types.component.html',
  styleUrls: ['./display-workflow-types.component.css'],
})
export class DisplayWorkflowTypesComponent {
  private subscription: Subscription;
  private destroy$ = new Subject<void>();
  workflowTypeData: WorkflowType[] = [];

  pageSizeOptions = pageSizeOptions;

  displayedColumns: string[] = ['name', 'description', 'status', 'actions'];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  workflowTypeName: string = '';

  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;

  //ng on init
  ngOnInit(): void {
    this.getWorkflowTypeName('');
    this.workflowTypeService.refreshRequired
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getWorkflowTypeName(this.workflowTypeName);
        this.getWorkflowTypes();
      });

    this.getWorkflowTypes();
  }

  constructor(
    private workflowTypeService: WorkflowTypeService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.getWorkflowTypes();
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
    this.getWorkflowTypes();
  }

  //get work flow
  getWorkflowTypes() {
    console.log('fetch WorkflowType');
    this.workflowTypeService
      .getAllWorkflowTypes(this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (workflowTypeData) => {
          this.workflowTypeData = workflowTypeData.records;
          this.totalItems = workflowTypeData.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ///opening confirm dialog
  openConfirmDialog(workflowTypeId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete WorkflowType' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteWorkflowType(workflowTypeId);
        }
      }
    );
  }

  //delete menu by menu id
  deleteWorkflowType(workflowTypeId: number) {
    this.workflowTypeService
      .deleteWorkflowType(workflowTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (workflowTypeData) => {
          console.log(workflowTypeData);

          this.getWorkflowTypes();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  //adding role
  addWorkflowType() {
    this.router.navigate(['layout/addworkflowtype']);
  }

  editWorkflowType(workflowTypeData: any) {
    this.router.navigate(['layout/addworkflowtype'], {
      state: { workflowType: workflowTypeData },
    });
  }

  getWorkflowTypeName(workflowTypeName: any) {
    this.workflowTypeName = workflowTypeName;
    this.workflowTypeService
      .getAllWorkflowTypeName(workflowTypeName, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (workflowTypeData) => {
          this.workflowTypeData = workflowTypeData.records;
          this.totalItems = workflowTypeData.totalRecords;
          console.log(workflowTypeData.records);
        },
        error: (error: any) => {
          console.error('Error fetching menu items:', error);
        },
      });
  }
}
