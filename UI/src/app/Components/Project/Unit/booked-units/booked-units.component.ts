import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, takeUntil } from 'rxjs';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { Block } from 'src/app/Models/Block/block';
import { Level } from 'src/app/Models/Project/level';
import { Project } from 'src/app/Models/Project/project';
import { AvailableUnitsDto } from 'src/app/Models/Project/unit';
import { CommonReferenceDetailsDto } from 'src/app/Models/User/CommonReferenceDetailsDto';
import { User } from 'src/app/Models/User/User';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { LevelService } from 'src/app/Services/ProjectService/Level/level.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { UnitTypeService } from 'src/app/Services/ProjectService/UnitType/unittype.service';

@Component({
  selector: 'app-booked-units',
  templateUrl: './booked-units.component.html',
  styleUrls: ['./booked-units.component.css'],
})
export class BookedUnitsComponent implements OnInit {
  user: User = new User();
  private destroy$ = new Subject<void>();
  projects: Project[] = [];
  blocks: Block[] = [];
  levels: Level[] = [];
  levelId: number = 0;
  projectId: number = 0;
  blockId: number = 0;
  pageSizeOptions = pageSizeOptions;
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  phaseType: string = 'Phase_Type';
  phaseTypes: CommonReferenceDetailsDto[] = [];
  unitTypeNames: string[] = [];
  phaseReferenceId: number = 0;
  unitType: string = '';
  area: number = 0;
  areas: number[] = [];
  availableUnits: AvailableUnitsDto[] = [];
  flag: string = '';
  displayedColumns: string[] = ['id', 'unitName', 'projectName', 'projectAddress', 'blockName', 'levelName', 'phase',
    'unitTypeName', 'superArea', 'preSalesMember','salesMember'];
  constructor(
    public projectService: ProjectService,
    public blockService: BlockService,
    public levelService: LevelService,
    public unitService: UnitService,
    public unitTypeService: UnitTypeService,
    private commonService: CommanService,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.getUser();
    this.getAllProjects();
    this.getPhaseTypes();
    this.getUnitTypeNames();
    this.getAreas();
  }
  getUser() {
    const storedUser = this.authService.getUser();
    console.log(storedUser);
    this.user = JSON.parse(storedUser ? storedUser : '');
    console.log(this.user);
  }
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
  getUnitTypeNames() {
    this.unitTypeService
      .getUnitTypeNames()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.unitTypeNames = resp;
          console.log(this.unitTypeNames);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  getAreas() {
    this.unitTypeService
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
  onSearchGetAvailableUnits() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.pageIndex = 0;
     this.getBookedUnits();
  }

  getBookedUnits() {
    console.log(this.pageIndex);

    console.log(
      this.projectId,
      this.blockId,
      this.levelId,
      this.phaseReferenceId,
      this.unitType,
      this.area
    );

    this.unitService
      .getBookedUnits(
        this.pageIndex,
        this.pageSize,
        this.projectId,
        this.blockId,
        this.levelId,
        this.phaseReferenceId,
        this.unitType,
        this.area
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.availableUnits = response.records;
          this.totalItems = response.totalRecords;
          console.log(response);
          this.flag =
            this.availableUnits.length > 0 ? 'available' : 'not available';
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getBookedUnits();
  }
}
