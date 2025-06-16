import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import {
  COMMON_STATUS,
  TIME_OUT,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  NAVIGATE_TO_DISPLAY_PROJECT_CHARGE,
  PROJECT_CHARGE_AMOUNT_CALCULATE,
  PROJECT_CHARGE_CHARGE_IN,
  PROJECT_CHARGE_CHARGE_TYPE,
  PROJECT_CHARGE_UNIT_LOCATION,
} from 'src/app/Constants/Crm/CrmConstants';
import {
  NAVIGATE_TO_DISPLAY_PRIME_ACTIVITY,
  UNIT_OF_MEASUREMENT,
} from 'src/app/Constants/WorkOrder/workorder';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import {
  ILevelsByProject,
  IProjectCharge,
  LevelsByProject,
  ProjectCharge,
} from 'src/app/Models/Crm/ProjectCharge';
import { ILevel, Level } from 'src/app/Models/Project/level';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ProjectChargeService } from 'src/app/Services/CrmServices/project-charge.service';
import { LevelService } from 'src/app/Services/ProjectService/Level/level.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { PrimeActivityCodeService } from 'src/app/Services/WorkOrderService/PrimeActivityCode/PrimeActivityCode.service';
@Component({
  selector: 'app-project-charge',
  templateUrl: './project-charge.component.html',
  styleUrls: ['./project-charge.component.css'],
})
export class ProjectChargeComponent implements OnInit {
  projectCharge: IProjectCharge = new ProjectCharge();
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();

  formData!: FormGroup;
  organizationId: number = 0;
  costSheetList: CommonReferenceType[] = [];
  Cost_sheet_Charges: string = 'Cost_sheet_Charges';
  unitOfMeasurements: any[] = [];
  chargeInData: CommonReferenceType[] = [];
  chargeTypeData: CommonReferenceType[] = [];

  phasesData: CommonReferenceType[] = [];
  phaseId: number = 0;
  phaseName: string = '';
  phaseFc: FormControl = new FormControl([] as CommonReferenceType[]);
  selectedPhase: CommonReferenceType = new CommonReferenceType();

  amountCalculateData: CommonReferenceType[] = [];
  amountCalculateId: number = 0;
  chargeTypeId:number =0;
  amountCalculatedName: string = '';
  chargeTypeName: string ='';
  amountCalculatedFc: FormControl = new FormControl(
    [] as CommonReferenceType[]
  );
  selectedAmountCalculate: CommonReferenceType = new CommonReferenceType();
  selectedChargeType: CommonReferenceType = new CommonReferenceType();

  projectsData: Project[] = [];
  projectId: number = 0;
  projectName: string = '';
  projectFc: FormControl = new FormControl([] as Project[]);
  selectedProject: IProject = new Project();

  uomId: number = 0;
  uomName: string = '';
  uom: any = new FormControl([] as CommonReferenceType[]);
  selectedUom: CommonReferenceType = new CommonReferenceType();

  chargeInId: number = 0;
  chargeInName: string = '';
  chargeIns: any = new FormControl([] as CommonReferenceType[]);

  selectedChargeIn: CommonReferenceType = new CommonReferenceType();
  chargeTypes: any = new FormControl([] as CommonReferenceType[]);

  statuses: any;
  levelsData: any;
  levelName:string='';

  @ViewChild('textArea') textArea!: ElementRef;
  levelId: number=0;
  selectedLevel: ILevel = new Level();
  levelFc: any = new FormControl([] as Level[]);

  autoResize() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto'; // Reset height to auto to calculate new height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height based on scrollHeight
  }

  ngOnInit(): void {
    this.initializeFormData();
    this.setUserFromLocalStorage();
    this.getDataFromState();
    this.getChargeIns();
    this.getAmountCalculates();
    this.getProjects();
    this.getPhases();
    this.getChargeTypes();
    // this.fetchUnitOfMeasurements();
    this.getCommonStatuses();
    this.fetchCostSheetCharges();
     this.getFloors();
  }

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private commonService: CommanService,
    private commonRefDetailsService: CommonreferencedetailsService,
    private toastrService: ToastrService,
    private projectService: ProjectService,
    private projectChargeService:ProjectChargeService,
    private levelService:LevelService

  ) {}

  private initializeFormData(): void {
    this.formData = this.builder.group({
      id: [0],
      name: ['', [Validators.required]],
      chargeIn: ['', [Validators.required]],
      amountCalculate: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      description: ['', []],  
      projectId: ['', [Validators.required]],
      levelId: [''],
      phaseId: [''],
      orgId: [''],
      status: ['A'],
      chargeType: ['', [Validators.required]]
    });
  }

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
    }
  }

  private getDataFromState() {
    const { projectCharge, isAdding } = history.state;
    console.log(projectCharge);
    this.isAdding = history.state.isAdding;
    this.projectCharge = projectCharge || this.projectCharge;
    if (!this.isAdding) {
      this.patchFormDataWithProjectChargeData();
    }
  }

  private patchFormDataWithProjectChargeData() {
    console.log(this.projectCharge);
    
    console.log(this.projectCharge.id);
    if (this.projectCharge.id) {
      this.fetchProjectChargeIn(this.projectCharge.chargeIn);
    }

    if (this.projectCharge.projectId) {
      this.projectId = this.projectCharge.projectId;
      console.log(this.projectCharge.projectId);
      if (this.projectId!=null) {
        console.log(this.projectId);
        this.fetchProjectById(this.projectId)
      }
    }
    if (this.projectCharge.levelId) {
      this.levelId = this.projectCharge.levelId;
      console.log(this.projectCharge.levelId);
      if (this.levelId!=null) {
        console.log(this.levelId);
        this.fetchLevelById(this.levelId)
      }
    }
    if (this.projectCharge.amountCalculate) {
      this.fetchAmountCaluclateById(this.projectCharge.amountCalculate);
    }
    if (this.projectCharge.chargeType) {
      this.fetchProjecChargeType(this.projectCharge.chargeType);
    }
    // if (this.projectCharge.chargeType) {
    //   this.fetchAmountCaluclateById(this.projectCharge.amountCalculate);
    // }
    if (this.projectCharge.phaseId) {
      this.fetchPhasesById(this.projectCharge.phaseId);
    }
    // if (this.projectCharge.levelId) { 
    //   this.fetchFloorsById(this.projectCharge.levelId);
    // }

    this.formData.patchValue(this.projectCharge);
   
    console.log(this.formData);
  }

  private fetchProjectChargeIn(chargeInId: number) {
    this.commonRefDetailsService
      .getById(chargeInId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedChargeIn = data;
          console.log(data);
          this.formData.patchValue({ chargeIn: data.id });
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  private fetchProjecChargeType(chargeType: string) {
    this.commonRefDetailsService
      .getByRefValue(chargeType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedChargeType = data;
          console.log(data);
          this.formData.patchValue({ chargeTypeName: data });
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  

  searchCharge(event: any): void {
    const query = event.target.value;
    this.chargeInName = query;
    this.getChargeIns();
  }
  getChargeIns() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(
        PROJECT_CHARGE_CHARGE_IN,
        this.chargeInName
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.chargeInData = data;
          console.log(this.chargeInData);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  onChargeInSelect(event: MatAutocompleteSelectedEvent) {
    this.chargeInId = event.option.value.id;
    this.formData.patchValue({ chargeIn: this.chargeInId });
    console.log(this.formData);
  }

  displayChargeIn(chargeIn: CommonReferenceType): string {
    return chargeIn && chargeIn.commonRefValue ? chargeIn.commonRefValue : '';
  }

  searchPhase(event: any): void {
    const query = event.target.value;
    this.phaseName = query;
    this.getPhases();
  }

  // from cmnref
  getPhases() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(
        PROJECT_CHARGE_UNIT_LOCATION,
        this.phaseName
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.phasesData = data;
          console.log(this.phasesData);
        },
        error: (error: any) => {
          console.error('Error fetching Phases :', error);
        },
      });
  }

  onPhaseSelect(event: MatAutocompleteSelectedEvent) {
    this.phaseId = event.option.value.id;
    this.formData.patchValue({ phaseId: this.phaseId });
    console.log(this.formData);
  }

  displayPhase(phase: CommonReferenceType): string {
    return phase && phase.commonRefValue ? phase.commonRefValue : '';
  }
  // from levels
  getFloors() {
    console.log(this.levelName);
    
    this.projectChargeService.getLevelsByProjectId(this.projectId,this.levelName)
    .subscribe({
      next: (data) => {
        console.log(data);
        this.levelsData = data;
        console.log(this.levelsData);
      },
      error: (error: any) => {
        console.error('Error fetching Project Charge Charge Ins :', error);
      },
    });
  }

  searchProject(event: any): void {
    const query = event.target.value;
    this.projectName = query;
    this.getProjects();
  }

  //from projects
  getProjects() {
    this.projectService
      .getProjects(this.projectName, this.organizationId)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.projectsData = data;
          console.log(this.projectsData);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  onProjectSelect(event: any) {
    console.log("dfghjkertyuio");
    console.log(event);
    
    console.log(event.option.value);
    if (event?.option?.value) {
    this.projectId = event.option.value.projectId;
    console.log(this.projectId);
    
    this.formData.patchValue({ projectId: this.projectId });
    console.log(this.formData);
    this.getFloors()
    }
  }

  displayProject(project: Project): string {
    return project && project.projectName ? project.projectName : '';
  }

  searchAmountCalculate(event: any): void {
    const query = event.target.value;
    this.amountCalculatedName = query;
    this.getAmountCalculates();
  }
  //form cmnref
  getAmountCalculates() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(
        PROJECT_CHARGE_AMOUNT_CALCULATE,
        this.amountCalculatedName
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.amountCalculateData = data;
          console.log(this.amountCalculateData);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  onAmountCalculateSelect(event: MatAutocompleteSelectedEvent) {
    this.amountCalculateId = event.option.value.id;
    this.formData.patchValue({ amountCalculate: this.amountCalculateId });
    console.log(this.formData);
  }

  displayAmountCalculate(amountCalculate: CommonReferenceType): string {
    return amountCalculate && amountCalculate.commonRefValue
      ? amountCalculate.commonRefValue
      : '';
  }

  getChargeTypes() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(
        PROJECT_CHARGE_CHARGE_TYPE,
        this.chargeTypeName
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.chargeTypeData = data;
          console.log(this.chargeTypeData);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Types :', error);
        },
      });
  }

  searchChargeType(event: any): void {
    const query = event.target.value;
    this.chargeTypeName = query;
    this.getChargeTypes();
  }

  onChargeTypeSelect(event: MatAutocompleteSelectedEvent): void {
    
    const selectedChargeType = event.option.value;
    const chargeTypeValue = selectedChargeType.commonRefValue;
    this.formData.patchValue({ chargeType: chargeTypeValue });
    console.log(this.formData.value);
  }
  

  displayChargeType(chargeType: CommonReferenceType): string {
    return chargeType && chargeType.commonRefValue
      ? chargeType.commonRefValue
      : '';
  }

  save() {
    this.formData.patchValue({ orgId: this.organizationId });
    console.log(this.formData.value);
    if (this.formData.valid) {
      const saveOrUpdate$ = this.isAdding
        ? this.projectChargeService.addProjectCharge(this.formData.value)
        : this.projectChargeService.updateProjectCharge(
            this.formData.value
          );
      saveOrUpdate$.subscribe({
        next: (response) => {
          this.handleSuccessResponse(response);
        },
        error: (error) => {
          this.handleErrorResponse(error);
        },
      });
    }
  }

  getCommonStatuses() {
    this.commonService.fetchCommonReferenceTypes(COMMON_STATUS).subscribe({
      next: (data) => {
        this.statuses = data;
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }
  handleSuccessResponse(response: any): void {
    console.log(response.message);
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
    this.goToProjectCharges();
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
    this.goToProjectCharges();
  }

  clearForm() {
    this.formData.reset();
  }
  goToProjectCharges() {
    this.router.navigate([NAVIGATE_TO_DISPLAY_PROJECT_CHARGE]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  searchFloor(event: any): void {
    const query = event.target.value;
    console.log(query);
    this.levelName = query;
    console.log(this.levelName);
    this.getFloors();
  }
  
  onFloorSelect(event: MatAutocompleteSelectedEvent) {
    this.levelId = event.option.value.levelId;
    this.formData.patchValue({ levelId: this.levelId });
    console.log(this.formData);
  }
  displayLevel(level: any): string {
    return level && level.levelname ? level.levelname : '';
  }
  private fetchProjectById(projectId: number) {
    this.projectService
      .getProjectById(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedProject = data;
          console.log(data);
          // this.formData.patchValue({ projectId: data.projectId });
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

 
  fetchCostSheetCharges(): void {
    console.log(this.Cost_sheet_Charges);
    this.commonService.getRefDetailsByType(this.Cost_sheet_Charges).subscribe({
      next: (types) => {
        this.costSheetList = types;
      },
      error: (error: any) => {
        console.error('Error fetching  charges:', error);
      },
    });
  }
  private fetchAmountCaluclateById(amoutId: number) {
    this.commonRefDetailsService
      .getById(amoutId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedAmountCalculate = data;
          console.log(data);
          // this.formData.patchValue({ chargeIn: data.id });
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  private fetchPhasesById(phaseId: number) {
    this.commonRefDetailsService
      .getById(phaseId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedPhase = data;
          console.log(data);
          // this.formData.patchValue({ chargeIn: data.id });
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  private fetchLevelById(levelId: number) {
    this.levelService
      .getLevelById(levelId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedLevel = data;
          console.log(data);
          console.log(this.selectedLevel);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

}
