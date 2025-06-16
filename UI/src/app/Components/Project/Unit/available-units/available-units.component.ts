import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import Chart from 'chart.js/auto';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { Block } from 'src/app/Models/Block/block';
import { Level } from 'src/app/Models/Project/level';
import { Project } from 'src/app/Models/Project/project';
import { AvailableUnitsDto } from 'src/app/Models/Project/unit';
import { CommonReferenceDetailsDto } from 'src/app/Models/User/CommonReferenceDetailsDto';
import { User } from 'src/app/Models/User/User';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { LevelService } from 'src/app/Services/ProjectService/Level/level.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { UnitTypeService } from 'src/app/Services/ProjectService/UnitType/unittype.service';

@Component({
  selector: 'app-available-units',
  templateUrl: './available-units.component.html',
  styleUrls: ['./available-units.component.css'],
})
export class AvailableUnitsComponent implements OnInit {
  private destroy$ = new Subject<void>();
  status: string = 'Available';
  projects: Project[] = [];
  blocks: Block[] = [];
  levels: Level[] = [];
  availableUnits: AvailableUnitsDto[] = [];
  unitTypeNames: CommonReferenceDetailsDto[] = [];
  areas: number[] = [];
  user: User = new User();
  projectId: number = 0;
  blockId: number = 0;
  levelId: number = 0;
  unitId: number = 0;
  phaseReferenceId: number = 0;

  unitTypeReferenceId: number = 0;
  area: number = 0;
  chart: Chart | any;

  flag: string = '';
  displayedColumns: string[] = [
    'id',
    'unitName',
    'projectName',
    'projectAddress',
    'blockName',
    'levelName',
    'phase',
    'unitTypeName',
    'superArea',
    'actions',
  ];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  phaseType: string = 'Phase';
  unit: string = 'Unit';
  phaseTypes: CommonReferenceDetailsDto[] = [];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  //pagination
  pageSizeOptions = pageSizeOptions;
  totalItems: number = 0;
  pageSize: number = 20;
  pageIndex: number = 0;
  unitType: string = '';
  unitsData: AvailableUnitsDto = new AvailableUnitsDto();
  ngOnInit(): void {
    this.getUser();
    this.getAllProjects();
    this.getPhaseTypes();
    this.getAvailableUnits();
    this.getUnitTypeNames();
    this.getAreas();
    console.log('DisplayLeadsComponent initialized');
    console.log(
      'OverlayContainer element:',
      this.overlayContainer.getContainerElement()
    );
    this.overlayContainer
      .getContainerElement()
      .classList.add('units-container');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.overlayContainer
      .getContainerElement()
      .classList.remove('units-container');
    if (this.chart) {
      this.chart.destroy();
    }
  }

  getUser() {
    const storedUser = this.authService.getUser();
    console.log(storedUser);
    this.user = JSON.parse(storedUser ? storedUser : '');
    console.log(this.user);
  }
  ngAfterViewInit(): void {
    // Ensure paginator is initialized
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
  }

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public projectService: ProjectService,
    public blockService: BlockService,
    public levelService: LevelService,
    public unitService: UnitService,
    public unitTypeService: UnitTypeService,
    private commonService: CommanService,
    private authService: AuthService,
    private overlayContainer: OverlayContainer,
    private loaderService:LoaderService
  ) {}

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAvailableUnits();
  }
  //get all projects
  getAllProjects() {
    this.projectService
      .getProjectsByOrgId(this.user.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.projects = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  getBlocksBasedOnProjectId(projectId: any) {
    console.log(projectId);
    this.levelId = 0;
    this.blockService
      .getBlocks(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.blocks = response;
          console.log(this.blocks);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  //get all levels basedon blockId
  getLevelsBasedOnBlockId(blockId: any) {
    console.log(blockId);
    this.levelService
      .getLevels(blockId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.levels = response;
          console.log(this.levels);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  onSearchGetAvailableUnits() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.pageIndex = 0;
    this.getAvailableUnits();
  }

  getAvailableUnits() {
    this.showLoading();
    console.log(this.pageIndex);

    console.log(
      this.projectId,
      this.blockId,
      this.levelId,
      this.phaseReferenceId,
      this.unitTypeReferenceId,
      this.area
    );

    this.unitService
      .getAvailableUnits(
        this.pageIndex,
        this.pageSize,
        this.projectId,
        this.blockId,
        this.levelId,
        this.phaseReferenceId,
        this.unitTypeReferenceId,
        this.area
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.hideLoading();
          this.availableUnits = response.records;
          this.totalItems = response.totalRecords;
          console.log(response);
          this.flag =
            this.availableUnits.length > 0 ? 'available' : 'not available';
        },
        error: (error) => {
          this.hideLoading();
          console.log(error);
        },
      });
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
          console.error(err);
        },
      });
  }
  gotoBooking(unit: AvailableUnitsDto) {
    this.getUnitDetailsByProjectId(unit.projectId, unit.unitId);
    console.log(this.unitsData);
    // this.router.navigate(['layout/project/blockunit'], {
    //   state: { unitsData: this.unitsData },
    // });
  }

  // getUnitTypeNames() {
  //   this.unitTypeService
  //     .getUnitTypeNames()
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (resp) => {
  //         this.unitTypeNames = resp;
  //         console.log(this.unitTypeNames);
  //       },
  //       error: (err) => {
  //         console.error(err);
  //       },
  //     });
  // }
  getUnitTypeNames() {
    this.commonService
      .getRefDetailsByType(this.unit)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.unitTypeNames = resp;
          console.log(this.phaseTypes);
          console.log('Phase types fetched succesfully');
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  getAreas() {
    this.unitService
      .getAreas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.areas = resp;
          console.log(this.areas);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  downloadExcel() {
    this.showLoading();
    this.unitService
      .downloadExcel(
        this.projectId,
        this.blockId,
        this.levelId,
        this.phaseReferenceId,
        this.unitTypeReferenceId,
        this.area
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.hideLoading();
          this.downloadFile(response, 'AvailableUnits');
          console.log('Excel downloaded successfully');
        },
        error: (error) => {
          this.hideLoading();
          console.log(error);
        },
      });
  }

  private downloadFile(
    data: Blob,
    filename: string,
    needTime: boolean = true
  ): void {
    const now = new Date();
    const timestamp = now.toLocaleDateString() + '_' + now.toLocaleTimeString();
    const blob = new Blob([data], {
      type: 'application/vnd.ms-excel',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    needTime
      ? (a.download = filename + '_' + timestamp + '.xls')
      : (a.download = filename + '.xls');

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
  getUnitDetailsByProjectId(projectId: number, unitId: number) {
    this.unitService
      .getUnitDetailsData(projectId, unitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.unitsData = response;
          console.log(response);
          this.router.navigate(['layout/project/blockunit'], {
            state: { unitsData: this.unitsData },
          });
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
