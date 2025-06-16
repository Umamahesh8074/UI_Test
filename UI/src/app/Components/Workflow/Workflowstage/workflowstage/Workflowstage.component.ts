import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { COMMON_STATUS } from 'src/app/Constants/CommanConstants/Comman';
import { WorkflowType } from 'src/app/Models/Workflow/WorkflowType';
import {
  IWorkflowStage,
  WorkflowStage,
} from 'src/app/Models/Workflow/workflowstage';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { WorkflowTypeService } from 'src/app/Services/WorkflowService/workflow-type.service';
import { WorkflowstageService } from 'src/app/Services/WorkflowService/workflowstage.service';

@Component({
  selector: 'app-workflowstage',
  templateUrl: './workflowstage.component.html',
  styleUrls: ['./workflowstage.component.css'],
})
export class AddWorkflowstageComponent implements OnInit {
  workflowstage: IWorkflowStage = new WorkflowStage();
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  statuses: any;
  workflowTypes: WorkflowType[] = [];
  formData!: any;
  constructor(
    private router: Router,
    private workflowstageService: WorkflowstageService,
    private builder: FormBuilder,
    private workflowTypeService: WorkflowTypeService,
    private commanService: CommanService
  ) {}

  ngOnInit(): void {
    this.getCommonStatuses();
    this.fetchWorkflowTypes();
    this.workflowstage = history.state.workflowstage;
    console.log(history.state.workflowstage);
    this.initializeFormData();
    if (history.state.workflowstage != null) {
      this.isAdding = false;
      this.patchFormData();
    }
  }

  initializeFormData() {
    this.formData = this.builder.group({
      id: this.builder.control(0),
      workflowTypeId: this.builder.control(0, Validators.required),
      workflowStageName: this.builder.control('', Validators.required),
      description: this.builder.control(''),
      orderIndex: this.builder.control(0),
      status: this.builder.control('A'),
    });
  }
  patchFormData() {
    console.log(this.workflowstage);
    this.formData.patchValue(this.workflowstage);
  }
  save() {
    //adding workflowstage
    if (this.formData.valid) {
      if (this.isAdding) {
        console.log(this.formData.value);
        this.workflowstageService
          .addWorkflowstage(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (resp) => {
              this.router.navigate(['layout/workflowstages']);
            },
            error: (err) => {
              console.error('Error adding Workflowstage', err);
            },
          });
      } else {
        //updating workflowstage
        this.workflowstageService
          .updateWorkflowstage(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/workflowstages']);
            },
            error: (err) => {
              console.error('Error updating Workflowstage', err);
            },
          });
      }
    }
  }

  clearForm() {
    this.formData.reset();
  }

  gotoWorkflowstages() {
    this.router.navigate(['/layout/workflowstages']);
  }

  fetchWorkflowTypes() {
    this.workflowTypeService.fetchAllWorkflowTypes().subscribe({
      next: (workflowTypes) => {
        console.log(workflowTypes);
        this.workflowTypes = workflowTypes;
      },
      error: (error) => {
        console.error(error);
      },
    });
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
