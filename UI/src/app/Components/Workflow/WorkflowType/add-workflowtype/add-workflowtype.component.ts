import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { COMMON_STATUS } from 'src/app/Constants/CommanConstants/Comman';
import {
  IWorkflowType,
  WorkflowType,
} from 'src/app/Models/Workflow/WorkflowType';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { WorkflowTypeService } from 'src/app/Services/WorkflowService/workflow-type.service';

@Component({
  selector: 'app-add-workflowtype',
  templateUrl: './add-workflowtype.component.html',
  styleUrls: ['./add-workflowtype.component.css'],
})
export class AddWorkflowtypeComponent {
  workflowType: IWorkflowType = new WorkflowType();
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  formData!: any;
  statuses: any;
  constructor(
    private workflowTypeService: WorkflowTypeService,
    private router: Router,
    public dialog: MatDialog,
    private builder: FormBuilder,
    private commanService: CommanService
  ) {}

  ngOnInit(): void {
    this.getCommonStatuses();
    this.workflowType = history.state.workflowType;
    this.initializeFormData();
    if (history.state.workflowType != null) {
      this.isAdding = false;
      this.patchFormData();
    }
  }
  initializeFormData() {
    this.formData = this.builder.group({
      id: this.builder.control(0),
      name: this.builder.control('', Validators.required),
      description: this.builder.control(''),
      status: this.builder.control('A'),
    });
  }
  patchFormData() {
    console.log(this.workflowType);
    this.formData.patchValue(this.workflowType);
  }
  save() {
    //adding menu
    if (this.formData.valid) {
      if (this.isAdding) {
        this.workflowTypeService
          .addWorkflowType(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp) => {
              this.router.navigate(['layout/workflowtypes']);
              console.log(resp);
            },
            error: (err) => {
              console.error('Error adding workflowtypes', err);
            },
          });
      } else {
        //updating menu
        this.workflowTypeService
          .editWorkflowType(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/workflowtypes']);
            },
            error: (err) => {
              console.error('Error updating workflowtypes', err);
            },
          });
      }
    }
  }
  clearForm() {
    this.formData.reset();
  }

  gotoRoles() {
    this.router.navigate(['layout/workflowtypes']);
  }
  getCommonStatuses() {
    this.commanService.fetchCommonReferenceTypes(COMMON_STATUS).subscribe({
      next: (data) => {
        this.statuses = data;
        //this.setDefaultStatus();
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }
}
