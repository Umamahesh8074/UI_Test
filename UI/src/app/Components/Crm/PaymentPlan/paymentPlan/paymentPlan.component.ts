import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import {
  COMMON_STATUS,
  TIME_OUT,
} from 'src/app/Constants/CommanConstants/Comman';
import { ToastrService } from 'ngx-toastr';
import { IPaymentPlan, PaymentPlan } from 'src/app/Models/Project/PaymentPlan';
import { PaymentPlanService } from 'src/app/Services/ProjectService/PaymentPlan/paymentPlan.service';
import { IProject, Project } from 'src/app/Models/Project/project';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { Block, IBlock } from 'src/app/Models/Block/block';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';

@Component({
  selector: 'app-paymentPlan',
  templateUrl: './paymentPlan.component.html',
  styleUrls: ['./paymentPlan.component.css'],
})
export class PaymentPlanComponent implements OnInit, OnDestroy {
  isAdding: boolean = true; // Flag for new or editing mode
  private destroy$ = new Subject<void>();
  formData!: FormGroup;
  paymentPlan: IPaymentPlan = new PaymentPlan();

  organizationId: number = 0;
  projectId: number = 0;
  projectName: string = '';
  projects: Project[] = [];
  statuses: any;
  project: any = new FormControl([] as IProject[]);
  selectedProject: IProject = new Project();

  //block auto complete
  blockId: number = 0;
  block: any = new FormControl([] as IBlock[]);
  blockName: string = '';
  blocks: Block[] = [];
  selectedBlock: IBlock = new Block();

  constructor(
    private router: Router,
    private paymentPlanService: PaymentPlanService,
    private builder: FormBuilder,
    private toastrService: ToastrService,
    private projectService: ProjectService,

    private commonService: CommanService,
    private blockService: BlockService
  ) {}

  private initializeFormData(): void {
    this.formData = this.builder.group({
      id: [0],
      planName: [''],
      description: [''],
      projectId: [0],
      blockId: [0],
      status: [''],
    });
  }

  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.initializeFormData();
    this.getDataFromState();
    this.fetchProjects();
    this.getCommonStatuses();
  }

  //getting user from local storage to set organization id
  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      console.log(user.organizationId);
      this.organizationId = user.organizationId;
    }
  }

  save() {
    console.log(this.formData.value);
    const saveOrUpdate$ = this.isAdding
      ? this.paymentPlanService.addPaymentPlan(this.formData.value)
      : this.paymentPlanService.updatePaymentPlan(this.formData.value);
    saveOrUpdate$.subscribe({
      next: (response) => {
        this.handleSuccessResponse(response);
      },
      error: (error) => {
        this.handleErrorResponse(error);
      },
    });
  }
  handleSuccessResponse(response: any): void {
    console.log(response.message);
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
    this.gotoPaymentPlans();
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
    this.gotoPaymentPlans();
  }

  onProjectSelect(event: any) {
    this.projectId = event.option.value.projectId;
    this.formData.patchValue({ projectId: this.projectId });
    this.fetchBlocks();
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }

  searchProject(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.projectName = query;
      this.fetchProjects();
    } else if (query.length == 0) {
      this.projectName = '';
      this.fetchProjects();
    }
  }

  onBockSelect(event: any) {
    this.blockId = event.option.value.id;
    this.formData.patchValue({ blockId: this.blockId });
    console.log(this.blockId);
  }
  displayBlock(block: IBlock) {
    return block && block.name ? block.name : '';
  }
  searchBlock(event: any) {
    const query = event.target.value;
    this.blockName = query;
    this.fetchBlocks();
  }

  //fetch projects based on organization id
  fetchProjects() {
    this.projectService
      .getProjectsByOrgIdWithProjectFilter(
        this.organizationId,
        this.projectName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          this.projects = projects;
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  private fetchProject(projectId: number): void {
    this.projectService
      .getProjectById(projectId)
      .pipe(
        takeUntil(this.destroy$), // Automatically unsubscribe when destroy$ emits
        catchError((error) => {
          this.toastrService.error('Error fetching project', error.message);
          return of(new Project());
        })
      )
      .subscribe((project) => {
        this.selectedProject = project;
        this.formData.patchValue({ projectId: project.projectId });
        this.projectId = project.projectId;
        this.fetchBlocks();
      });
  }

  private fetchBlock(blockId: number): void {
    this.blockService
      .getBlockById(blockId)
      .pipe(
        takeUntil(this.destroy$), // Automatically unsubscribe when destroy$ emits
        catchError((error) => {
          this.toastrService.error('Error fetching project', error.message);
          return of(new Block());
        })
      )
      .subscribe((block) => {
        console.log(block);
        this.selectedBlock = block;
        this.formData.patchValue({ blockId: block.id });
      });
  }

  private getDataFromState() {
    const { paymentPlan, isAdding } = history.state;
    this.isAdding = isAdding;
    this.paymentPlan = paymentPlan || this.paymentPlan;
    if (!this.isAdding) {
      this.patchFormDataWithPaymentPlan();
    }
  }

  private patchFormDataWithPaymentPlan() {
    console.log(this.paymentPlan);
    if (this.paymentPlan.projectId) {
      console.log(this.paymentPlan);
      this.fetchProject(this.paymentPlan.projectId);
    }
    if (this.paymentPlan.blockId) {
      this.fetchBlock(this.paymentPlan.blockId);
    }

    this.formData.patchValue(this.paymentPlan);
  }

  // Method to clear the form
  clearForm(): void {
    this.formData.reset();
  }

  // Method to navigate back to the stages list
  gotoPaymentPlans(): void {
    this.router.navigate(['layout/crm/displayPaymentPlan']);
  }

  getCommonStatuses() {
    this.commonService.fetchCommonReferenceTypes(COMMON_STATUS).subscribe({
      next: (data) => {
        this.statuses = data;
        //this.setDefaultStatus();
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  // Fetch projects based on organization ID
  fetchBlocks() {
    this.blockService
      .getBlocks(this.projectId, this.blockName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blocks) => {
          this.blocks = blocks;
          console.log(blocks);
        },
        error: (error: Error) => {
          console.error('Error fetching blocks:', error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
