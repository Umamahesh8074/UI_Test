import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { COMMON_STATUS } from 'src/app/Constants/CommanConstants/Comman';
import { Project } from 'src/app/Models/Project/project';
import { UnitType } from 'src/app/Models/Project/unit';
import { CommonReferenceDetailsDto } from 'src/app/Models/User/CommonReferenceDetailsDto';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UnitTypeService } from 'src/app/Services/ProjectService/UnitType/unittype.service';

@Component({
  selector: 'app-unit',
  templateUrl: './unit-type.component.html',
  styleUrls: ['./unit-type.component.css'],
})
export class UnitTypeComponent {
  unitType: UnitType = new UnitType();

  isAdding: boolean = true;
  private destroy$ = new Subject<void>();

  //dropr down values

  areaType: any[] = [];
  unitTypes: any[] = [];
  payments: any[] = [];
  mesurement: any[] = [];

  noOfLevels: number = 0;

  formData: any;
  statuses: any;
  phaseType: string = 'Phase_Type';
  phaseTypes: CommonReferenceDetailsDto[] = [];
  projects: Project[] = [];
  ngOnInit(): void {
    this.getCommonStatuses();
    this.initializeForm();
    this.getAllProjects();
    this.getPhaseTypes();
    this.getareaTypes();
    this.getUnitTypes();
    this.getPayments();
    this.getMessurements();
    this.getDataFromState();

  }

  constructor(
    private builder: FormBuilder,
    private unitService: UnitTypeService,
    private router: Router,
    private commonService: CommanService,
    private projectService:ProjectService
  ) {}

  getDataFromState() {
    if (history.state.unitType != null) {
      this.isAdding = false;
      this.unitType = history.state.unitType;
      console.log(this.unitType);
      this.patchFormWithUnitTypeData();
    }
  }

  getareaTypes() {
    const refType = 'Area_Type';
    this.commonService
      .getRefDetailsByType(refType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (areaTypesData: any) => {
          console.log(areaTypesData);
          this.areaType = areaTypesData;
        },
        error: (error: Error) => {
          console.log('Error while fetching area types', error);
        },
      });
  }

  getUnitTypes() {
    const refType = 'Unit_Type';
    this.commonService
      .getRefDetailsByType(refType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (unitTypesData: any) => {
          console.log(unitTypesData);
          this.unitTypes = unitTypesData;
        },
        error: (error: Error) => {
          console.log('Error while fetching unit types', error);
        },
      });
  }

  getPayments() {
    const refType = 'Payment_Type';
    this.commonService
      .getRefDetailsByType(refType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paymentsTypesData: any) => {
          console.log(paymentsTypesData);
          this.payments = paymentsTypesData;
        },
        error: (error: Error) => {
          console.log('Error while fetching payment types', error);
        },
      });
  }

  getMessurements() {
    const refType = 'Meassurement_Type';
    this.commonService
      .getRefDetailsByType(refType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (mesTypesData: any) => {
          console.log(mesTypesData);
          this.mesurement = mesTypesData;
        },
        error: (error: Error) => {
          console.log('Error while fetching meassurements types', error);
        },
      });
  }

  initializeForm() {
    this.formData = this.builder.group({
      id: [0],
      name: ['', Validators.required],
      typeId: [, Validators.required],
      rate: [, Validators.required],
      areaTypeId: [, Validators.required],
      isSaleble: [,],
      superArea: [, Validators.required],
      builtUpArea: [, Validators.required],
      carpetArea: [, Validators.required],
      udslArea: [, Validators.required],
      plotArea: [, Validators.required],
      constructionCost: [, Validators.required],
      udslCost: [, Validators.required],
      mesurementId: [, Validators.required],
      description: ['', Validators.required],
      layout: [],
      status: [],
      phaseReferenceId:[],
      projectId:[],
      balconyArea:[, Validators.required]
    });
  }
  private patchFormWithUnitTypeData(): void {
    console.log(this.unitType);
    this.formData.patchValue(this.unitType);
    console.log(this.formData.value);
  }

  save() {
    console.log(this.formData.value);
    if (this.formData.valid) {
      if (this.isAdding) {
        this.unitService
          .addUnits(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/project/unit/type']);
            },
            error: (error) => {
              console.log(error);
            },
          });
      } else {
        this.unitService
          .updateUnits(this.formData.value)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/project/unit/type']);
            },
            error: (error) => {
              console.log(error);
            },
          });
      }
    }
  }

  gotoUnits() {
    this.router.navigate(['layout/project/unit/type']);
  }
  clearForm() {
    this.formData.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  getPhaseTypes() {
    this.commonService
      .getRefDetailsByType(this.phaseType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.phaseTypes = resp;
          console.log(this.phaseTypes);
          console.log('Phase types fetched succesfully');
        },
        error: (err) => {
          console.error('Error adding Customer', err);
        },
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
  getAllProjects() {
    this.projectService
      .getProjects()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.projects = response;
          console.log(this.projects);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
