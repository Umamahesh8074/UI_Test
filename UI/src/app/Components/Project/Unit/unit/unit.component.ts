import { DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Subject, takeUntil } from 'rxjs';
import {
  BOUNDARIES,
  COMMON_STATUS,
  TIME_OUT,
} from 'src/app/Constants/CommanConstants/Comman';
import { ProjectDetails } from 'src/app/Models/Project/project';
import { Unit } from 'src/app/Models/Project/unit';
import {
  CommonReferenceDetails,
  ICommonReferenceDetails,
} from 'src/app/Models/User/CommonReferenceDetails';
import { CommonReferenceDetailsDto } from 'src/app/Models/User/CommonReferenceDetailsDto';
import { User } from 'src/app/Models/User/User';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';

import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { LevelService } from 'src/app/Services/ProjectService/Level/level.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { UnitTypeService } from 'src/app/Services/ProjectService/UnitType/unittype.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import Swal from 'sweetalert2';
import { AvailableUnitsComponent } from '../available-units/available-units.component';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css'],
})
export class UnitComponent {
  projects: any[] = [];
  blocks: any[] = [];
  levels: any[] = [];
  unitData: any[] = [];
  unitName: string = '';
  isAdding: boolean = true;
  isLoading: boolean = true;
  statuses: any;
  east: string = '';
  boundaries: any;
  unit: Unit[] = [];
  boundaryControlEast: FormControl = new FormControl('');
  boundaryControlWest: FormControl = new FormControl('');
  boundaryControlNorth: FormControl = new FormControl('');
  boundaryControlSouth: FormControl = new FormControl('');

  // boundaries: ICommonReferenceDetails[] = [];

  west: string = '';
  north: string = '';
  south: string = '';
  projectId: number = 0;
  blockId: number = 0;
  levelId: number = 0;

  unitTypes: any[] = [];

  unitsArray: any;

  locations: any[] = [
    {
      id: 1,
      name: 'location1',
    },
    {
      id: 2,
      name: 'location2',
    },
  ];
 

  destroy$ = new Subject<void>();
  formData: FormGroup;
  noOfUnits: number = 0;

  page: number = 0;
  size: number = 10;
  totalPages: number = 0;

  commonReferenceDetails: ICommonReferenceDetails[] = [];
  unitType: string = 'Unit';
  unitTypeNames: CommonReferenceDetailsDto[] = [];
  user: User = new User();
  projectName: string = '';
  blockName: string = '';
  phaseType: string = 'Phase';
  unitFaces: CommonReferenceDetailsDto[] = [];
  unitTypeName: CommonReferenceDetails = new CommonReferenceDetails();
  unitTypeFacingName: CommonReferenceDetails = new CommonReferenceDetails();

  serviceCode: any = new FormControl([] as any[]);
  selectedBoundaryEast: any;
  selectedBoundaryNorth: any;
  selectedBoundaryWest: any;
  selectedBoundarySouth: any;
  unitCount: number = 0;
  projectDetails: ProjectDetails[] = [];
  ngOnInit(): void {
    this.getUser();
    console.log(history.state.unit);
    this.getAllProjects();
    this.getCommonStatuses();
    this.getBoundaries();
    this.getUnitTypes();
    this.getUnitFaces();
    this.getDataFromState();
  }

  constructor(
    private projectService: ProjectService,
    private blockService: BlockService,
    private levelService: LevelService,
    private router: Router,
    private builder: FormBuilder,
    public dialog: MatDialog,
    private unitService: UnitService,
    private commonService: CommanService,
    private authService: AuthService,
    private commonRefDetails: CommonreferencedetailsService,
    private decimalPipe: DecimalPipe
  ) {
    this.formData = this.builder.group({
      projectId: [0, Validators.required],
      blockId: [0, Validators.required],
      levelId: [0, Validators.required],
      units: this.builder.array([], Validators.required),
    });
  }

  createUnitGroup(): FormGroup {
    return this.builder.group({
      id: [],
      unitTypeId: [, Validators.required],
      unitName: [, Validators.required],
      status: ['A'],
      east: [, Validators.required],
      west: [, Validators.required],
      north: [, Validators.required],
      south: [, Validators.required],
      unitFacingId: [, Validators.required],
      carpetArea: [, Validators.required],
      balconyArea: [, Validators.required],
      udsArea: [, Validators.required],
      sbaArea: [, Validators.required],
      projectDetailsId: [, Validators.required],

      // unitAddress:[]
      // locationId: [],
    });
  }

  get units() {
    return this.formData.get('units') as FormArray;
  }
  getUser() {
    const storedUser = this.authService.getUser();
    console.log(storedUser);
    this.user = JSON.parse(storedUser ? storedUser : '');
    console.log(this.user);
  }
  //get all projects
  getAllProjects() {
    this.projectService
      .getProjects(this.projectName, this.user.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.projects = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  //get all blocks based on project Id
  selectProject(projectId: any) {
    console.log(projectId);
    this.projectId = projectId;
    this.getProjectDetails(this.projectId);
    this.blockService
      .getBlocks(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.blocks = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  //get all levels basedon blockId
  selectBlock(blockId: any) {
    console.log(blockId);
    this.blockId = blockId;
    this.levelService
      .getLevels(blockId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.levels = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  selectLevel(levelId: any) {
    console.log(levelId);
    this.levelId = levelId;
    console.log(levelId);

    if (!this.isAdding) {
      this.levelService
        .getLevelByLevelId(levelId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log(response);
            this.levels = response;
          },
          error: (error) => {
            console.log(error);
          },
        });
    } else {
      this.levelService
        .getLevelByLevelId(levelId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log(response);
            this.levels = response;
            this.noOfUnits = this.levels[0].noOfUnits;
            this.getAllUnits();
            this.updateArray();
            this.checkingUnits();
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }
  getUnitTypes() {
    this.commonService
      .getRefDetailsByType(this.unitType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.unitTypeNames = resp;
          console.log(this.unitTypeNames);
          console.log('unit types fetched succesfully');
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  getUnitFaces() {
    this.commonService
      .getRefDetailsByType(this.phaseType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.unitFaces = resp;
          console.log(this.unitTypeNames);
          console.log('unit types fetched succesfully');
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  project(projectId: any) {
    console.log(projectId);
    this.projectId = projectId;

    this.blockService.getBlocks(projectId).pipe(takeUntil(this.destroy$));
  }

  getUnitType(unitTypeId: number) {
    this.commonRefDetails.getById(unitTypeId).subscribe({
      next: (resp) => {
        this.unitTypeName = resp;
        console.log(this.unitTypeName);
        console.log('unit types fetched succesfully');
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  getUnitFacingId(unitFacingId: number) {
    this.commonRefDetails.getById(unitFacingId).subscribe({
      next: (resp) => {
        this.unitTypeFacingName = resp;
        console.log(this.unitTypeFacingName);
        console.log('unit types fetched succesfully');
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getBoundaryByName(boundaryname: string, direction: string) {
    console.log('getBoundaryByName called with:', boundaryname);

    this.commonRefDetails
      .getByRefValue(boundaryname)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('API response received for', direction, ':', response);

          if (direction === 'west') {
            this.selectedBoundaryWest = response;
            console.log(
              'Updated selectedBoundaryWest:',
              this.selectedBoundaryWest
            );
          } else if (direction === 'east') {
            this.selectedBoundaryEast = response;
            console.log(
              'Updated selectedBoundaryEast:',
              this.selectedBoundaryEast
            );
          } else if (direction === 'north') {
            this.selectedBoundaryNorth = response;
            console.log(
              'Updated selectedBoundaryNorth:',
              this.selectedBoundaryNorth
            );
          } else {
            this.selectedBoundarySouth = response;
            console.log(
              'Updated selectedBoundarySouth:',
              this.selectedBoundarySouth
            );
          }
        },
      });
  }

  getDataFromState() {
    const { unit, isAdding } = history.state;
    console.log(unit, isAdding);
    if (unit) {
      this.isAdding = isAdding;
      this.unitsArray = unit;
      this.noOfUnits = unit.units.length;
      console.log(this.noOfUnits);
      console.log(this.unitsArray);
    }

    if (!isAdding && this.unitsArray) {
      this.patchFormDataWithUnit();
    }
  }

  patchFormDataWithUnit() {
    const projectId = this.unitsArray.projectId;
    const blockId = this.unitsArray.blockId;
    const levelId = this.unitsArray.levelId;
    this.formData.patchValue({ projectId, blockId, levelId });
    this.selectProject(projectId);
    this.selectBlock(blockId);
    this.selectLevel(levelId);
    this.populateUnits();
  }

  populateUnits() {
    const unitArray = this.formData.get('units') as FormArray;
    unitArray.clear();

    console.log(this.unitsArray.units);
    this.unitsArray.units.forEach((item: any) => {
      console.log(item);
      if (item.unitTypeId) {
        this.getUnitType(item.unitTypeId);
      }
      if (item.unitFacingId) {
        console.log('entered facing Id ' + item.unitFacingId);
        this.getUnitFacingId(item.unitFacingId);
      }

      if (item.east) {
        this.getBoundaryByName(item.east, 'east');
      }
      if (item.west) {
        this.getBoundaryByName(item.west, 'west');
      }
      if (item.north) {
        this.getBoundaryByName(item.north, 'north');
      }

      if (item.south) {
        this.getBoundaryByName(item.south, 'south');
      }
      const unitGroup = this.builder.group({
        id: [item.id],
        unitTypeId: [item.unitTypeId],
        unitName: [item.unitName],
        status: [item.status],
        east: [item.east],
        west: [item.west],
        north: [item.north],
        south: [item.south],
        carpetArea: [item.carpetArea],
        balconyArea: [item.balconyArea],
        sbaArea: [item.sbaArea],
        udsArea: [item.udsArea],
        unitFacingId: [item.unitFacingId],
        projectDetailsId: [item.projectDetailsId],
      });

      unitArray.push(unitGroup);
    });
  }

  updateArray() {
    const formArray = this.formData.get('units') as FormArray;
    if (formArray) {
      // Clear existing FormArray
      formArray.clear();
      for (let i = 0; i < this.noOfUnits; i++) {
        formArray.push(this.createUnitGroup());
      }
    } else {
      console.error(' FormArray is not defined');
    }
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
              Swal.fire({
                title: 'success',
                text: 'Unit added successfully',
                icon: 'success',
                timerProgressBar: false,
                showConfirmButton: true,
                allowOutsideClick: true,
              }).then(() => {
                this.gotoUnits();
              });
              // this.router.navigate(['layout/project/unit']);
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
              Swal.fire({
                title: 'success',
                text: 'Unit updated successfully',
                icon: 'success',
                timerProgressBar: false,
                showConfirmButton: true,
                allowOutsideClick: true,
              }).then(() => {
                this.gotoUnits();
              });
              // this.router.navigate(['layout/project/unit']);
            },
            error: (error) => {
              console.log(error);
              Swal.fire({
                title: 'success',
                text: 'No record Found With this id',
                icon: 'success',
                timerProgressBar: false,
                showConfirmButton: true,
                allowOutsideClick: true,
              }).then(() => {
                this.gotoUnits();
              });
            },
          });
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearForm() {}

  gotoUnits() {
    this.router.navigate(['layout/project/unit']);
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

  getBoundaries() {
    this.commonService.fetchCommonReferenceTypes(BOUNDARIES).subscribe({
      next: (data) => {
        this.boundaries = data;
        console.log(this.boundaries);

        //this.setDefaultStatus();
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  onBoundariesSelect(event: any, direction: string, unitIndex: number) {
    const selectedValue = event.option.value;

    const unitsFormArray = this.formData.get('units') as FormArray;
    const selectedUnit = unitsFormArray.at(unitIndex) as FormGroup;

    selectedUnit.patchValue({
      [direction]: selectedValue.commonRefValue,
    });
    console.log(`${direction} value patched: `, selectedValue.commonRefValue);
  }

  onBoundaryValueChange(event: any, direction: string, unitIndex: number) {
    let finalValue: string | null = null;
    if (event && event.option) {
      const selectedValue = event.option.value;
      console.log(selectedValue);
      finalValue = selectedValue.commonRefValue;
      console.log(`${direction} value selected from dropdown: `, finalValue);
    } else if (event && event.target) {
      finalValue = event.target.value;
      console.log(`${direction} typed value: `, finalValue);
    }
    const unitsFormArray = this.formData.get('units') as FormArray;
    const selectedUnit = unitsFormArray.at(unitIndex) as FormGroup;

    if (finalValue) {
      selectedUnit.patchValue({
        [direction]: finalValue,
      });
    }
  }

  displayBoundaries(boundary: ICommonReferenceDetails): string {
    return boundary && boundary.commonRefValue ? boundary.commonRefValue : '';
  }

  searchBoundary(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.getBoundaries();
    } else if (query.length === 0) {
      this.getBoundaries();
    }
  }

  getAllUnits() {
    this.unitService
      .getAllUnits(
        this.unitName,
        this.page,
        this.size,
        this.projectName,
        this.blockName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.unitData = response.records;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  checkingUnits() {
    console.log(this.projectId, this.blockId, this.levelId);
    this.unitService
      .checkingUnits(this.projectId, this.blockId, this.levelId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.unitCount = response;
          // this.blocksCount = response;
          if (this.unitCount > 0) {
            console.log(this.unitCount);
            Swal.fire({
              title: 'Error',
              text: 'Units already exist for this Level',
              icon: 'error',
              timerProgressBar: false,
              showConfirmButton: true,
              allowOutsideClick: true,
            }).then(() => {
              this.gotoUnits();
            });
          }
        },
        error: (error) => {
          console.log(error);
          // this.handleErrorResponse(error);
        },
      });
  }
  formatRate(event: any): void {
    const value = event.target.value.replace(/,/g, '');
    if (!isNaN(Number(value))) {
      event.target.value = this.decimalPipe.transform(value, '1.0-0');
    }
  }

  // Restrict input to only numeric keys
  restrictToNumbers(event: KeyboardEvent): boolean {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Tab',
    ];
    const isNumber = /^[0-9]$/.test(event.key);
    return isNumber || allowedKeys.includes(event.key);
  }

  getProjectDetails(projectId: number) {
    this.projectService
      .getProjectDetailsByProjectId(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.projectDetails = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
