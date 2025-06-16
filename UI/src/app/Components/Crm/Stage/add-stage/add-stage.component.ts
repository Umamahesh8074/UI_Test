import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { OverlayContainer } from '@angular/cdk/overlay';
import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { ToastrService } from 'ngx-toastr';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  COMMON_STATUS,
  DUE_DAYS,
  INITIATE_TYPE,
  TIME_OUT,
  pageSizeOptions,
} from 'src/app/Constants/CommanConstants/Comman';
import { STAGE_STATUS } from 'src/app/Constants/Crm/CrmConstants';
import { Block, IBlock } from 'src/app/Models/Block/block';
import { IPaymentPlan, PaymentPlan } from 'src/app/Models/Project/PaymentPlan';
import { IProject, Project } from 'src/app/Models/Project/project';
import { IStage, Stage, StageDto } from 'src/app/Models/Project/stage';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { PaymentPlanService } from 'src/app/Services/ProjectService/PaymentPlan/paymentPlan.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { StageService } from 'src/app/Services/ProjectService/Stage/stage.service';
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';

@Component({
  selector: 'app-add-stage',
  templateUrl: './add-stage.component.html',
  styleUrls: ['./add-stage.component.css'],
})
export class AddStageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  formData!: FormGroup;
  organizationId: number = 0;
  projectId: number = 0;
  planId: number = 0;
  projectName: string = '';
  planName: string = '';
  projects: Project[] = [];
  paymentPlans: any[] = [];
  stagesData: StageDto[] = [];
  pageSizeOptions = pageSizeOptions;
  selectedPaymentPlan: IPaymentPlan = new PaymentPlan();
  stage: IStage = new Stage();
  paymentPlan: any = new FormControl([] as IPaymentPlan[]);
  project: any = new FormControl([] as IProject[]);
  statuses: any;
  initiate: any;
  chart: Chart | any;
  userManageData: any;
  dueDateDays: any;

  //block auto complete
  blockId: number = 0;
  block: any = new FormControl([] as IBlock[]);
  blockName: string = '';
  blocks: Block[] = [];

  pageSize: number = 30;
  pageIndex: number = 0;
  totalPages: number = 0;
  isinitiated = false;
  userId: number = 0;
  dueDays:number =0;

  @ViewChild('dueDatePicker') dueDatePicker!: MatDatepicker<any>;
  @ViewChild('demandDatePicker') demandDatePicker!: MatDatepicker<any>;

  constructor(
    private router: Router,
    private paymentPlanService: PaymentPlanService,
    private stageService: StageService,
    private builder: FormBuilder,
    private toastrService: ToastrService,
    private projectService: ProjectService,
    private commonService: CommanService,
    public dialog: MatDialog,
    private overlayContainer: OverlayContainer,
    private blockService: BlockService,
    private loaderService: LoaderService,
    private usermanageService: UsermanageService
  ) {}

  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.initializeFormData();
    this.getUsermanageByUserId();
    this.patchFormDataWithStage();
    this.getDataFromState();
    this.getCommonStatuses();
    this.getInitiateTypes();
    this.getPaymentDueDays();
    // this.stageService.refreshRequired.subscribe(() => {
    //   this.getAllStages();
    // });
    this.initiatedYes();

    console.log('AddStageComponent initialized');
    console.log(
      'OverlayContainer element:',
      this.overlayContainer.getContainerElement()
    );
    this.overlayContainer.getContainerElement().classList.add('add-stage');
  }

  private initializeFormData(): void {
    this.formData = this.builder.group({
      projectId: [0],
      blockId: [0],
      planId: [0],
      projectName: [''],
      planName: [''],
      stageBean: this.builder.array([]),


    });
  }

  get stagesOrders(): FormArray {
    return this.formData.get('stageBean') as FormArray;
  }

  setStagesOrdersEmpty() {
    const stagesFormArray = this.formData.get('stageBean') as FormArray;
    stagesFormArray.clear();
  }

  createStage(planId: number): FormGroup {
    return this.builder.group({
      stageId: [0],
      planId: [planId],
      stageName: [''],
      description: [''],
      stageOrder: [0], // Ensure a default valid order
      percentage: [0],
      days: [0],
      dueDate: [],
      demandDate: [],
      initiated: [''],
      // status: [''],
    });
  }

  isEmptyStageAdded = false;

  // Method to add an empty stage
  addEmptyStage(): void {
    const totalPercentage = this.getTotalPercentage();

    if (totalPercentage === 100) {
      console.warn(
        'Cannot add a new stage as the total percentage is already 100%.'
      );
      return; // Exit the method if total percentage is 100
    }
    const planId = this.formData.get('planId')?.value;
    const newStage = this.createStage(planId);
    newStage.get('initiated')?.setValue('No');
    this.stagesOrders.push(newStage);
    this.isEmptyStageAdded = true;
    this.monitorStageChanges(newStage);
     this.monitorDateChanges(newStage);
    console.log('Added empty stage:', newStage);
  }
  onDrop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.stagesOrders.controls,
      event.previousIndex,
      event.currentIndex
    );
    console.log('Reordered stages:', this.stagesOrders.value);
  }
  getTotalPercentage(): number {
    return this.stagesOrders.controls.reduce((total, stage) => {
      const percentage = stage.get('percentage')?.value || 0;
      return total + percentage;
    }, 0);
  }

  saveButtonEnabled: boolean = false;

  monitorStageChanges(newStage: FormGroup): void {
    Object.keys(newStage.controls).forEach((controlKey) => {
      const control = newStage.get(controlKey);
      if (control && controlKey !== 'initiated') {
        control.valueChanges.subscribe(() => {
          this.enableSaveButton();
        });
      }
    });
  }

  initiatedYes() {
    if (this.formData.get('initiated')?.value === 'Yes') {
      this.formData.disable();
    }
    if (this.formData.get('initiated')?.value === 'Yes') {
      this.formData.get('dueDate')?.disable();
      this.formData.get('demandDate')?.disable();
    } else {
      this.formData.get('dueDate')?.enable();
      this.formData.get('demandDate')?.enable();
    }
  }

  enableSaveButton(): void {
    this.saveButtonEnabled = this.isFormDirty;
  }

  get isFormDirty(): boolean {
    return this.formData.dirty;
  }

  removeEmptyStage(stage: any): void {
    const stageId = stage.get('stageId')?.value;
    console.log(stageId);
    let index = -1;

    for (let i = 0; i < this.stagesOrders.length; i++) {
      if (this.stagesOrders.at(i).get('stageId')?.value === stageId) {
        index = i;
        break;
      }
    }
    if (index !== -1 && this.stagesOrders.length > 1) {
      this.stagesOrders.removeAt(index);
      console.log('Removed empty stage at index:', index);
    } else {
      console.log('At least one stage must remain.');
    }
  }

  // Check if it is the last stage in the array
  isLastStage(stage: any): boolean {
    const index = this.stagesOrders.controls.indexOf(stage);
    return index === this.stagesOrders.length - 1;
    console.log(index);
  }

  isEmptyStage(stage: any): boolean {
    const stageId = stage.get('stageId')?.value;
    return !stageId || stageId === null || stageId === 0;
  }

  private patchFormDataWithStage() {
    console.log(this.stage);
    if (this.stage.stageId) {
      console.log(this.stage);
      this.fetchPaymentPlan(this.stage.stageId);
    }

    this.formData.patchValue(this.stage);
  }
  private getDataFromState() {
    const { stage } = history.state;

    this.stage = stage || this.stage;

    this.patchFormDataWithStage();
  }

  // Fetch projects based on organization ID
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

  onProjectSelect(event: any) {
    if (event.option.value.projectId == this.projectId) {
      console.log('Same Project selected {}');
      return;
    }
    this.projectId = event.option.value.projectId;
    this.projectName = event.option.value.projectName;
    console.log(this.projectName);
    // Update the project ID in the form and fetch new blocks
    this.blockId = 0;
    this.blocks = [];
    this.block.setValue(null);
    this.formData.patchValue({ blockId: null });

    this.planId = 0;
    this.paymentPlans = [];
    this.paymentPlan.setValue(null);
    this.formData.patchValue({ planId: null });
    this.stagesData = [];
    this.setStagesOrdersEmpty();
    console.log(this.stagesData);
    this.formData.patchValue({ projectId: this.projectId });
    this.fetchBlocks();
    console.log(this.stagesData);
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
    if (event.option.value.id == this.blockId) {
      console.log('Same Block selected {}');
      return;
    }
    this.blockId = event.option.value.id;
    console.log(this.blockId);

    this.formData.patchValue({ blockId: this.blockId });
    this.fetchPaymentPlans();

    if (this.projectId > 0 && this.blockId > 0) {
      this.planId = 0;
      this.paymentPlans = [];
      this.paymentPlan.setValue(null);
      this.formData.patchValue({ planId: null });
      this.stagesData = [];
      this.setStagesOrdersEmpty();
    }
  }
  displayBlock(block: IBlock) {
    return block && block.name ? block.name : '';
  }
  searchBlock(event: any) {
    const query = event.target.value;
    this.blockName = query;
    this.fetchBlocks();
  }

  fetchPaymentPlans() {
    console.log(this.projectId);
    this.paymentPlanService
      .getAllPaymentPlansByProjectId(this.projectId, this.blockId)

      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paymentPlans) => {
          this.paymentPlans = paymentPlans;
        },
        error: (error: Error) => {
          console.error('Error fetching payment Plans:', error);
        },
      });
  }

  onPaymentPlanSelect(event: any) {
    const selectedPaymentPlan = event.option.value;
    console.log('Selected Payment Plan:', selectedPaymentPlan);
    this.planName = event.option.value.planName;
    console.log(this.planName);
    this.planId = event.option.value.id;
    const planId = selectedPaymentPlan?.id;
    if (planId) {
      this.formData.patchValue({
        planId: planId,
        planName: selectedPaymentPlan.planName,
      });

      // Log the form data after patching
      console.log('Form Data after patching:', this.formData.value);
    } else {
      console.log('No valid planId found for the selected payment plan');
    }
    this.getAllStages();
  }

  displayPaymentPlan(paymentPlan: IPaymentPlan): string {
    return paymentPlan && paymentPlan.planName ? paymentPlan.planName : '';
  }

  searchPaymentPlan(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.planName = query;
      this.fetchPaymentPlans();
    } else if (query.length == 0) {
      this.planName = '';
      this.fetchPaymentPlans();
    }
    this.getAllStages();
  }
  private fetchPaymentPlan(planId: number): void {
    this.paymentPlanService
      .getPaymentPlanById(planId)
      .pipe(
        takeUntil(this.destroy$), // Automatically unsubscribe when destroy$ emits
        catchError((error) => {
          this.toastrService.error('Error fetching project', error.message);
          return of(new PaymentPlan());
        })
      )
      .subscribe((paymentPlan) => {
        this.selectedPaymentPlan = paymentPlan;
        this.formData.patchValue({ id: paymentPlan.id });
      });
  }

  getAllStages() {
    this.showLoading();
    this.stagesData = [];
    console.log(this.projectName, this.planName);
    this.stageService
      .getAllStages(
        this.projectId,
        this.blockId,
        this.planId,
        this.pageIndex,
        this.pageSize,
        STAGE_STATUS
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.stagesData = response.records;
          this.populateStages();
          const totalPercentage = this.stagesData.reduce((total, stage) => {
            return total + (stage.percentage || 0);
          }, 0);

          // If percentage is less than 100, show toast
          if (totalPercentage < 100) {
            this.toastrService.warning(
              'The total percentage is less than 100%.',
              'Warning'
            );
          }
          this.hideLoading();
        },
        error: (error) => console.error(error.error),
      });
  }

  // Populate the form array with fetched stages data
  populateStages() {
    const stagesFormArray = this.formData.get('stageBean') as FormArray;
    stagesFormArray.clear();

    this.stagesData.forEach((stage) => {
      const stageFormGroup = this.builder.group({
        stageId: [stage.stageId],
        stageName: [stage.stageName || ''],
        description: [stage.description || ''],
        stageOrder: [stage.stageOrder || 0],
        percentage: [stage.percentage || 0],
        days: [stage.days || 0],
        dueDate: [stage.dueDate || null],
        demandDate: [stage.demandDate || null],
        initiated: [stage.initiated],
        status: [stage.status],
        ...(stage.stageId ? { stageId: [stage.stageId] } : {}),
      });
      stagesFormArray.push(stageFormGroup);
      this.monitorStageChanges(stageFormGroup);
      this.monitorDateChanges(stageFormGroup);
    });

    if (!this.stagesData || this.stagesData.length === 0) {
      this.addEmptyStage();
    }
  }
  isSaving: boolean = false;

  save() {
    const totalPercentage = this.calculateTotalPercentage();

    console.log('Complete Form Data:', this.formData.value);

    if (totalPercentage > 100) {
      this.toastrService.error('Error', 'Total percentage cannot exceed 100%.');
      return;
    }

    if (!this.checkUniqueStageOrders()) {
      this.toastrService.error('Error', 'Stage order must be unique.');
      return;
    }

    const formValue = { ...this.formData.value };
    console.log('Data to save:', formValue);

    this.stageService.addStage(formValue).subscribe({
      next: (_) => {
        this.toastrService.success('Success', 'Stages saved successfully');
        this.getAllStages();
        this.isinitiated = false;
      },
      error: (error) => {
        console.error('Error saving data:', error);
        this.toastrService.error(
          'Error',
          error.message || 'An error occurred while saving.'
        );
      },
    });
  }

  private calculateTotalPercentage(): number {
    let total = 0;

    const stages = this.formData.value.stageBean;

    if (stages && Array.isArray(stages)) {
      for (const stage of stages) {
        total += stage.percentage || 0;
      }
    }

    return total;
  }

  private checkUniqueStageOrders(): boolean {
    const seenStageOrders = new Set<number>();
    const stages = this.formData.value.stageBean;

    if (stages && Array.isArray(stages)) {
      for (const stage of stages) {
        if (seenStageOrders.has(stage.stageOrder)) {
          return false;
        } else {
          seenStageOrders.add(stage.stageOrder);
        }
      }
    }
    return true;
  }

  // update() {
  //   console.log('Complete Form Data:', this.formData.value);
  //   const totalPercentage = this.calculateTotalPercentage();
  //   if (totalPercentage > 100) {
  //     this.toastrService.error('Error', 'Total percentage cannot exceed 100%.');
  //     return;
  //   }

  //   const planId = this.formData.get('planId')?.value;

  //   const updatedStages = this.formData.value.stageBean.map((stage: any) => {
  //     return {
  //       ...stage,
  //       planId: planId,
  //     };
  //   });

  //   const formValue = {
  //     ...this.formData.value,
  //     stageBean: updatedStages,
  //   };

  //   console.log('Data to update:', formValue);

  //   this.stageService.updateStage(formValue).subscribe({
  //     next: (_) => {
  //       this.toastrService.success('Success', 'Stages updated successfully');
  //       // Optionally refresh stages after saving
  //       this.getAllStages();
  //       this.isinitiated = false;
  //     },
  //     error: (error) => {
  //       console.error('Error updating data:', error);
  //       this.toastrService.error(
  //         'Error',
  //         error.message || 'An error occurred while saving.'
  //       );
  //     },
  //   });
  // }

  saveOrUpdate() {
    const totalPercentage = this.calculateTotalPercentage();

    console.log('Complete Form Data:', this.formData.value);

    if (totalPercentage > 100) {
      this.toastrService.error('Error', 'Total percentage cannot exceed 100%.');
      return;
    }

    if (!this.checkUniqueStageOrders()) {
      this.toastrService.error('Error', 'Stage order must be unique.');
      return;
    }

    const planId = this.formData.get('planId')?.value;
    const updatedStages = this.formData.value.stageBean.map((stage: any) => {
      return {
        ...stage,
        planId: planId,
      };
    });

    const formValue = {
      ...this.formData.value,
      stageBean: updatedStages,
    };
    console.log('Data to save or update:', formValue);

    const saveOperation$ = this.stageService.addStage(formValue);
    const updateOperation$ = this.stageService.updateStage(formValue);

    // Execute both save and update operations
    forkJoin([saveOperation$, updateOperation$])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([saveResponse, updateResponse]) => {
          console.log(
            'Stages saved and updated successfully:',
            saveResponse,
            updateResponse
          );
          this.toastrService.success(
            'Success',
            'Stages saved and updated successfully'
          );
          this.getAllStages();
          this.isinitiated = false;
        },
        error: (error) => {
          console.error('Error saving and updating stages:', error);
          this.toastrService.error(
            'Error',
            error.message || 'An error occurred while saving and updating.'
          );
        },
      });
  }

  get isUpdateButtonEnabled() {
    const stages = this.stagesOrders.controls as FormGroup[];
    return stages.some((stage: FormGroup) => {
      return (
        Object.keys(stage.controls).some((controlKey) => {
          return controlKey !== 'initiated' && stage.controls[controlKey].dirty;
        }) && stage.get('stageId')?.value !== null
      );
    });
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

  getInitiateTypes() {
    this.commonService.fetchCommonReferenceTypes(INITIATE_TYPE).subscribe({
      next: (data) => {
        this.initiate = data;
        //this.setDefaultStatus();
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  openConfirmDialog(stageId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete stage' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteStage(stageId);
        }
      }
    );
  }

  onInitiateChange(event: any, stage: AbstractControl) {
    this.isinitiated = true;
    console.log('Selected Value:', event.value);
    // Check if the selected value is 'Yes'
    if (event.value === 'Yes') {
      const stageId = stage.get('stageId')?.value;
      console.log('Stage ID:', stageId); // Log the stageId to confirm it's being retrieved

      if (stageId) {
        // Open the confirmation dialog
        this.openConfirmDialogStatus(stageId, true, stage);
      } else {
        console.error('Stage ID is not found.');
      }
    }
  }

  openConfirmDialogStatus(
    stageId: any,
    isUpdate: boolean,
    stage: AbstractControl
  ) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'update the stage', isUpdate: isUpdate },
    });
    const res = dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isUpdate: boolean) => {
        console.log(isUpdate);
        if (isUpdate) {
          this.updateInitiateStatus(stageId, isUpdate);
          //  this.formData.reset();
        } else {
          stage.get('initiated')?.setValue('No');
        }
      }
    );
  }

  resetInitiateValue(stage: AbstractControl) {
    // Reset the initiated field value to its original state (e.g., 'No' or previous value)
    const originalValue = stage.get('initiated')?.value;
    if (originalValue !== 'Yes') {
      stage.get('initiated')?.setValue(originalValue); // Revert to previous value if 'Yes' is not selected
    }
  }

  // updateInitiateStatus(stageId: number){
  //   this.stageService.updateInitiateStatus(this.stage).subscribe({
  //     next: (response: any) => {
  //       this.handleSuccessResponse(response);

  //       const stageIndex = this.stagesOrders.controls.findIndex(
  //         (stage) => stage.get('stageId')?.value === stageId
  //       );
  //       console.log("stageNumber",stageIndex)
  //       // if (stageIndex !== -1) {
  //       //   this.stagesOrders.removeAt(stageIndex);
  //       // }
  //     },
  //     error: (error: Error) => {
  //       console.error('Error updating stage:', error);
  //     },
  //   });
  // }

  removedStages: { [key: number]: boolean } = {};

  // updateInitiateStatus(stageId: number) {
  //   const stageIndex = this.stagesOrders.controls.findIndex(
  //     (stage) => stage.get('stageId')?.value === stageId
  //   );

  //   if (stageIndex !== -1) {
  //     const relatedStageControl = this.stagesOrders.controls[stageIndex];
  //     const stageData = relatedStageControl.value;
  //      stageData.initiated = 'Yes'
  //     this.stageService.updateInitiateStatus(stageData).subscribe({
  //       next: (response: any) => {
  //         this.handleSuccessResponse(response);
  //         console.log("Stage updated successfully:", response);
  //         const initiatedValue = response.initiated; // Adjust if necessary
  //         // this.isinitiated = false;

  //       // Patch the 'initiated' value to the form control
  //       relatedStageControl.patchValue({
  //         initiated: initiatedValue
  //       });

  //       this.removedStages[stageId] = true;
  //       },
  //       error: (error: Error) => {
  //         console.error("Error updating stage:", error);
  //       }
  //     });
  //   } else {
  //     console.warn("Stage with the provided stageId not found.");
  //   }
  // }


  updateInitiateStatus(stageId: number, isUpdate: boolean) {
    this.showLoading();
    const stageIndex = this.stagesOrders.controls.findIndex(
      (stage) => stage.get('stageId')?.value === stageId
    );

    if (stageIndex !== -1) {
      const relatedStageControl = this.stagesOrders.controls[stageIndex];
      const stageData = relatedStageControl.getRawValue(); 
      if (isUpdate) {
        stageData.initiated = 'Yes';
      }

      this.stageService
        .updateInitiateStatus(stageData, this.projectId, this.blockId)
        .subscribe({
          next: (response: any) => {
            this.handleSuccessResponse(response);
            this.getAllStages();

            console.log('Stage updated successfully:', response);

            // Update the form control value
            relatedStageControl.patchValue({
              initiated: response.initiated,
            });

            if (stageIndex + 1 < this.stagesOrders.controls.length) {
              const nextStageControl =
                this.stagesOrders.controls[stageIndex + 1];
              nextStageControl.patchValue({ enabled: true });
            }
            this.removedStages[stageId] = true;
            this.hideLoading();
          },
          error: (error: Error) => {
            console.error('Error updating stage:', error);
          },
        });
    } else {
      console.warn('Stage with the provided stageId not found.');
    }
  }

  isTdDisabled(currentStageIndex: number): boolean {
    if (currentStageIndex === 0) {
      return false; // First stage is always enabled
    }

    const previousStage = this.stagesOrders.controls[currentStageIndex - 1];
    return previousStage.get('initiated')?.value !== 'Yes';
  }

  // isLastStage(stage: any): boolean {
  //   // Get the last stage from the stagesOrders controls
  //   const lastStage = this.stagesOrders.controls[this.stagesOrders.controls.length - 1];

  //   // Check if the current stage is the last one
  //   return stage.get('stageId')?.value === lastStage.get('stageId')?.value;
  // }

  deleteStage(stageId: number) {
    this.stageService.deleteStage(stageId).subscribe({
      next: (response: any) => {
        this.handleSuccessResponse(response);

        const stageIndex = this.stagesOrders.controls.findIndex(
          (stage) => stage.get('stageId')?.value === stageId
        );
        if (stageIndex !== -1) {
          this.stagesOrders.removeAt(stageIndex);
        }
      },
      error: (error: Error) => {
        console.error('Error deleting stage:', error);
      },
    });
  }

  handleSuccessResponse(response: any): void {
    console.log(response.message);
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
  }

  clearForm(): void {
    this.formData.reset();
    this.stagesOrders.clear();
    this.isinitiated = false;
    // this.addEmptyStage();
  }

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
      this.userId = user.userId;
    }
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.overlayContainer.getContainerElement().classList.remove('add-stage');
    if (this.chart) {
      this.chart.destroy();
    }
  }
  private getUsermanageByUserId(): void {
    console.log(this.userId);
    this.usermanageService.getUserManage(this.userId).subscribe({
      next: (response) => {
        console.log('User manage data:', response);
        this.userManageData = response;
        this.projectId = response[0].projectId;
        console.log(this.projectId);
        this.fetchBlocks();
      },

      error: (err) => {
        // Handle the error here
        console.error('Error fetching user manage data:', err);
      },
    });
  }

monitorDateChanges(stage: FormGroup): void {
  // Auto-fill expectedDate = actualDate + dueDays
  stage.get('demandDate')?.valueChanges.subscribe((demandDate: Date | string) => {
    if (demandDate) {
      const dateObj = new Date(demandDate);
      
      // Format and reassign actualDate
      const formattedActualDate = this.formatDateTime(dateObj);
      stage.get('demandDate')?.setValue(formattedActualDate, { emitEvent: false });

      // Calculate and format expectedDate
      const dueDate = new Date(dateObj);
      dueDate.setDate(dueDate.getDate() + Number(this.dueDays));
      const formattedExpectedDate = this.formatDateTime(dueDate);
      stage.get('dueDate')?.setValue(formattedExpectedDate);
    }
  });

  stage.get('initiated')?.valueChanges.subscribe((initiated: string) => {
    const actualControl = stage.get('demandDate');
    const expectedControl = stage.get('dueDate');

    if (initiated === 'Yes') {
      expectedControl?.disable();
      actualControl?.disable();
    } else {
      expectedControl?.enable();
      actualControl?.enable();
    }
  });
}

    getPaymentDueDays() {
      this.commonService.fetchCommonReferenceTypes(DUE_DAYS).subscribe({
        next: (data) => {
          this.dueDateDays = data;
         this.dueDays = Number(data[0].commonRefValue)
        },
        error: (error) => {
          console.error(error?.message);
        },
      });
    }
      formatDateTime(date: Date): string {
        return formatDate(date, 'yyyy-MM-dd', 'en-IN');
      }
}
