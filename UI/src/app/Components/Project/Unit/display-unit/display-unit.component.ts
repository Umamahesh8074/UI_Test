import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  COMPANY_TYPE,
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  USER_MANAGE_CRM,
  USER_MANAGE_TYPE,
} from 'src/app/Constants/Crm/CrmConstants';
import { Block, IBlock } from 'src/app/Models/Block/block';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { Level } from 'src/app/Models/Project/level';
import { Project } from 'src/app/Models/Project/project';
import { AvailableUnitsDto, UnitType } from 'src/app/Models/Project/unit';
import { User } from 'src/app/Models/User/User';
import { IUserManageDto } from 'src/app/Models/User/UserManage';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { LevelService } from 'src/app/Services/ProjectService/Level/level.service';
import { PaymentPlanService } from 'src/app/Services/ProjectService/PaymentPlan/paymentPlan.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { StageService } from 'src/app/Services/ProjectService/Stage/stage.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';

@Component({
  selector: 'app-display-unit',
  templateUrl: './display-unit.component.html',
  styleUrls: ['./display-unit.component.css'],
})
export class DisplayUnitComponent {
  destroy$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  unitName: string = '';
  unitsData: UnitType[] = [];
  unit: any[] = [];
  projectUnit: any[] = [];
  displayedColumns: string[] = [
    'projectName',
    'blockName',
    'levelName',
    'unitName',
    'status',
    'companyType',
    'blockedByName',
    'firstApplicantName',

    'actions',
  ];
  user: User = new User();

  projects: Project[] = [];
  blocks: any[] = [];
  levels: Level[] = [];
  levelId: number = 0;
  projectName: string = '';
  blockName: string = '';
  selectedStatus: any = '';
  // projectsData: Project[] = [];
  projectId: any[] = [];
  // project: any = new FormControl([] as IProject[]);
  status: any[] = [
    {
      name: 'Available',
    },
    {
      name: 'Blocked',
    },
    {
      name: 'Booked',
    },
  ];
  organizationId: number = 0;

  block: any = new FormControl([] as IBlock[]);
  selectedBlock: IBlock = new Block();
  selectedProject: any = null;
  unitData: AvailableUnitsDto = new AvailableUnitsDto();
  typeId: number = 0;
  companyType: any;
  project: any = new FormControl([] as IUserManageDto[]);
  userManageprojects: any[] = [];
  @ViewChild('allProjectSelected') private allProjectSelected?: any;
  @ViewChild('allBlockSelected') private allBlockSelected?: MatCheckbox;
  selectedprojectIds: number[] = [];
  selectedUserManageIds: number[] = [];
  selectedBlockIds: any;
  fromComponent: boolean = false;
  selectedUserManages: any[] = [];
  selectedBlocks: any[] = [];
  blockId: any = [];
  userId: number = 0;
  typeCommonReferenceDetailsId: number = 0;
  stageId: any;
  planId: any;
  paymentTransactionTypeId: any = 0;
  ngOnInit(): void {
    this.getUser();
    this.getDataFromState();
    this.getUserManageTypes();
    this.getCompanyTypes();
  }

  constructor(
    private unitService: UnitService,
    private router: Router,
    public dialog: MatDialog,
    private authService: AuthService,
    private projectService: ProjectService,
    public blockService: BlockService,
    public levelService: LevelService,
    private commonService: CommanService,
    private usermanageService: UsermanageService,
    private paymentPlanService: PaymentPlanService,
    private stageService: StageService
  ) {}
  getUser() {
    const storedUser = this.authService.getUser();
    console.log(storedUser);
    this.user = JSON.parse(storedUser ? storedUser : '');
    this.userId = this.user.userId;
    console.log(this.user);
    this.organizationId = this.user.organizationId;
  }

  getDataFromState() {
    console.log('history.state', history.state);
    this.selectedStatus = history.state.status;
    this.stageId = history.state.stageId;
    this.projectId = history.state.projectId;
    this.blockId = history.state.blockId;
    this.paymentTransactionTypeId = history.state.paymentTransactionTypeId;
    if (history.state.typeId > 0) {
      this.typeId = history.state.typeId;
    }
    this.planId = history.state.planId;
    this.selectedUserManageIds = history.state.selectedUserManageIds;
    this.typeCommonReferenceDetailsId =
      history.state.typeCommonReferenceDetailsId;

    this.fromComponent = history.state.fromComponent;
    if (this.selectedUserManageIds?.length > 0 && this.projectId?.length > 0) {
      this.patchStateProjectIds(
        this.selectedUserManageIds,
        this.projectId,
        this.typeCommonReferenceDetailsId
      );
    } else {
      this.fromComponent = false;
      this.getUserManageTypes();
    }
    if (this.blockId?.length > 0) {
      this.patchStateBlockIds(this.blockId);
    }
    this.getAllUnits();
  }
  getAllUnits() {
    this.unitService
      .getAllUnits(
        this.unitName,
        this.pageIndex,
        this.pageSize,
        this.projectName,
        this.blockName,
        this.selectedStatus,
        this.projectId,
        this.blockId,
        this.typeId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response.records);
          this.unitsData = response.records;
          this.totalItems = response.totalRecords;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  onSearch(searchText: any) {
    if (searchText.length >= 3 || searchText.length == 0) {
      this.unitName = searchText;
      this.getAllUnits();
    }
  }
  onSearchProjectName(searchText: string) {
    if (searchText.length >= 3 || searchText.length == 0) {
      this.projectName = searchText;
      this.getAllUnits();
    }
  }
  onSearchBlockName(searchText: string) {
    this.blockName = searchText;
    this.getAllUnits();
  }
  addUnit() {
    this.router.navigate(['layout/unit']);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllUnits();
  }
  openConfirmDialog(id: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Unit' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteUnit(id);
        }
      }
    );
  }

  //delete unit
  deleteUnit(unitTypeId: number) {
    console.log(unitTypeId);
    this.unitService
      .deleteUnit(unitTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  editUnit(unit: any) {
    this.getUnitById(unit.unitId).subscribe({
      next: (response) => {
        this.unit = response;
        console.log(response);
        this.router.navigate(['layout/unit'], {
          state: { unit: this.unit, isAdding: false },
        });
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  getUnitById(unitId: any) {
    return this.unitService.getUnitById(unitId).pipe(takeUntil(this.destroy$));
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onStatusSelect(event: any) {
    console.log(event);
    if (event === 'All') {
      let val = '';
      this.selectedStatus = val;
    } else {
      this.selectedStatus = event;
    }
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    this.getAllUnits();
  }

  goBack() {
    const route = 'layout/crm/crmuser/dashboard';
    // this.getActionStatusIdByStatus(status);
    const state = {
      stageId: this.stageId,
      blockId: this.blockId,
      planId: this.planId,
      projectId: this.selectedprojectIds,
      selectedUserManageIds: this.selectedUserManageIds,
      typeCommonReferenceDetailsId: this.typeCommonReferenceDetailsId,
      fromComponent: true,
      typeId: this.typeId,
      paymentTransactionTypeId: this.paymentTransactionTypeId,
    };
    this.router.navigate([route], {
      state: state,
    });
  }
  // compareBlocks(option: any, selected: any): boolean {
  //   console.log('option', option);
  //   console.log('selected', selected);
  //   return option?.id === selected?.id;
  // }
  searchProject(event: any): void {
    if (event.target.value.length >= 3) {
      this.projectName = event.target.value;
    } else if (event.target.value.length === 0) {
      this.projectName = '';
      this.projectId = [];
    }
  }
  onAllSelectProject() {
    console.log(this.allProjectSelected.checked);
    // this.allProjectChecked=this.allProjectSelected.checked
    if (this.allProjectSelected.checked) {
      this.selectedprojectIds = this.userManageprojects.map(
        (p: any) => p.projectId,
        0
      );
      this.selectedUserManageIds = this.userManageprojects.map(
        (p: any) => p.id,
        0
      );
      this.displayProjectNames();
    } else {
      this.selectedprojectIds = [];
      this.selectedBlockIds = [];
      this.selectedUserManageIds = [];
      this.blockId = this.selectedBlockIds;
    }
  }
  displayProjectNames() {
    console.log(this.selectedprojectIds);
    this.usermanageService
      .fetchProjectsBasedOnUserId(
        this.userId,
        this.typeCommonReferenceDetailsId,
        '',
        '',
        this.selectedprojectIds
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects: any) => {
          console.log(projects);
          console.log(this.selectedprojectIds);
          console.log(this.userManageprojects);
          this.userManageprojects = this.sortProject(
            this.userManageprojects,
            this.selectedprojectIds
          );
          const selectedNames = projects
            .map((project: any) => project.projectName)
            .join(', ');
          console.log(selectedNames);
          this.project.patchValue(selectedNames);
        },
      });
  }
  sortProject(projects: any[], selectedprojectIds: any): any[] {
    return projects.sort((a, b) => {
      const aSelected = selectedprojectIds.includes(a.projectId);
      const bSelected = selectedprojectIds.includes(b.projectId);
      // Place selected items first, then unselected items
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }
  isProjectAllSelected(): boolean {
    const allProjectIds = this.userManageprojects.map((p) => p.projectId);
    return (
      Array.isArray(this.selectedprojectIds) &&
      allProjectIds.length > 0 &&
      allProjectIds.every((id) => this.selectedprojectIds.includes(id))
    );
  }
  isSelectedProject(projectId?: number, id?: number): boolean {
    return this.selectedprojectIds?.includes(projectId ? projectId : 0);
  }
  onProjectSelect(umproject: any, event: any) {
    this.project.patchValue('');
    const selectedProject = umproject.projectId;
    const selectedUserManageId = umproject.id;
    if (event.checked) {
      if (!this.selectedprojectIds) this.selectedprojectIds = [];
      if (!this.selectedUserManageIds) this.selectedUserManageIds = [];
      if (!this.selectedprojectIds.includes(selectedProject)) {
        this.selectedprojectIds.push(selectedProject);
      }
      if (!this.selectedUserManageIds.includes(selectedUserManageId)) {
        this.selectedUserManageIds.push(selectedUserManageId);
      }
      this.displayProjectNames();
    } else {
      this.selectedprojectIds = this.selectedprojectIds?.filter(
        (projectId: any) => projectId !== selectedProject
      );
      this.selectedUserManageIds = this.selectedUserManageIds?.filter(
        (id: any) => id !== selectedUserManageId
      );
      // --- Deselect related blocks ---
      let relatedBlockIds: number[] = [];
      if (this.selectedBlockIds?.length > 0) {
        relatedBlockIds = this.selectedBlocks
          .filter((b) => b.projectId === selectedProject)
          .map((b) => b.id);

        this.selectedBlockIds = this.selectedBlockIds.filter(
          (id: any) => !relatedBlockIds.includes(id)
        );
        this.selectedBlocks = this.selectedBlocks.filter((block) =>
          this.selectedBlockIds.includes(block.id)
        );
        this.blockId = [...this.selectedBlockIds];
        const selectedNames = this.selectedBlocks
          .map((block: any) => block.name + ' ( ' + block.projectCode + ' )')
          .join(', ');
        this.block.patchValue(selectedNames);
      }
      // If no blocks left, set blockId to empty array
      if (!this.selectedBlockIds || this.selectedBlockIds.length === 0) {
        this.blockId = [];
      }
      // --- Deselect related payment plans and stages for the deselected project ---
      if (this.planId?.length > 0) {
        this.paymentPlanService
          .getAllPaymentPlansByProjectId([selectedProject], [])
          .subscribe((removedProjectPlans: any[]) => {
            const removedPlanIds = removedProjectPlans.map((plan) => plan.id);
            // Remove those planIds from planId array
            if (Array.isArray(this.planId)) {
              this.planId = this.planId.filter(
                (id: any) => !removedPlanIds.includes(id)
              );
            } else if (this.planId && removedPlanIds.includes(this.planId)) {
              this.planId = [];
            }
            // Remove related stages for the removed planIds
            if (removedPlanIds.length > 0 && this.stageId?.length > 0) {
              this.stageService
                .getStages(
                  '',
                  [selectedProject],
                  removedPlanIds,
                  '',
                  this.stageId
                )
                .subscribe((removedStages: any[]) => {
                  const removedStageIds = removedStages.map(
                    (stage) => stage.stageId
                  );
                  if (Array.isArray(this.stageId)) {
                    this.stageId = this.stageId.filter(
                      (id: any) => !removedStageIds.includes(id)
                    );
                  } else if (
                    this.stageId &&
                    removedStageIds.includes(this.stageId)
                  ) {
                    this.stageId = [];
                  }
                });
            }
          });
      }
      if (this.selectedprojectIds?.length > 0) {
        this.displayProjectNames();
      } else if (this.selectedprojectIds?.length == 0) {
        this.project.patchValue('');
      }
    }
    this.projectId = this.selectedprojectIds;
  }
  onProjectSelectButtonClick() {
    this.projectId = this.selectedprojectIds;
    if (this.projectId.length > 0) {
      this.fetchBlocks();
      this.getAllUnits();
    } else {
      this.block.setValue(null);
      this.blocks = [];
      this.fromComponent = false;
      this.getAllUnits();
    }
  }
  searchBlock(event: any): void {
    if (event.target.value.length >= 3) {
      this.blockName = event.target.value;
      this.fetchBlocks();
    } else if (event.target.value.length === 0) {
      this.blockName = '';
      this.blockId = 0;
    }
  }
  fetchBlocks() {
    this.blockService
      .fetchBlocksByBlockIds(this.selectedprojectIds, '', this.blockName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blocks) => {
          this.blocks = blocks;
          console.log(this.blocks);
          if (this.selectedBlockIds?.length > 0) {
            this.selectedBlocks = this.blocks.filter((block) =>
              this.selectedBlockIds.includes(block.id)
            );
            this.blocks = this.sortBlock(this.blocks, this.selectedBlockIds);
            const selectedNames = this.selectedBlocks
              .map(
                (block: any) => block.name + ' ( ' + block.projectCode + ' )'
              )
              .join(', ');
            console.log(selectedNames);
            console.log(this.blocks);
            this.block.patchValue(selectedNames);
          } else {
            this.block.setValue(null);
          }
        },
        error: (error: Error) => {
          console.error('Error fetching blocks:', error);
        },
      });
  }
  onAllSelectBlock() {
    if (this.allBlockSelected?.checked) {
      this.selectedBlockIds = (this.blocks || []).map((p: any) => p.id);
      this.displayBlockNames();
    } else {
      this.selectedBlockIds = [];
    }
  }
  isBlockAllSelected(): boolean {
    const allBlockIds = this.blocks.map((b) => b.id);
    return (
      Array.isArray(this.selectedBlockIds) &&
      allBlockIds.length > 0 &&
      allBlockIds.every((id: any) => this.selectedBlockIds.includes(id))
    );
  }
  isSelectedBlock(blockId?: number): boolean {
    return blockId != null && this.selectedBlockIds?.includes(blockId);
  }
  displayBlockNames() {
    this.blockService
      .fetchBlocksByBlockIds(this.selectedprojectIds, this.selectedBlockIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blocks: any) => {
          console.log(blocks);
          this.blocks = this.sortBlock(this.blocks, this.selectedBlockIds);
          const selectedNames = blocks
            .map((block: any) => block.name + ' ( ' + block.projectCode + ' )')
            .join(', ');
          console.log(selectedNames);
          this.block.patchValue(selectedNames);
        },
      });
  }
  sortBlock(block: any[], selectedBlockIds: any): any[] {
    return block.sort((a, b) => {
      const aSelected = selectedBlockIds.includes(a.id);
      const bSelected = selectedBlockIds.includes(b.id);
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }
  onBlockSelect(block: any, event: any) {
    this.block.patchValue('');
    const selectedBlock = block.id;
    if (event.checked) {
      if (!this.selectedBlockIds) this.selectedBlockIds = [];
      if (!this.selectedBlocks) this.selectedBlocks = [];
      if (!this.selectedBlockIds.includes(selectedBlock)) {
        this.selectedBlockIds.push(selectedBlock);
        this.selectedBlocks.push(block);
      }
      this.displayBlockNames();
    } else {
      this.selectedBlockIds = this.selectedBlockIds?.filter(
        (id: any) => id !== selectedBlock
      );
      this.selectedBlocks = this.selectedBlocks?.filter(
        (b: any) => b.id !== selectedBlock
      );
      if (this.selectedBlockIds?.length > 0) {
        this.displayBlockNames();
      } else {
        this.block.patchValue('');
      }
      // Always remove related payment plans and stages for the deselected block
      if (this.planId?.length > 0) {
        this.paymentPlanService
          .getAllPaymentPlansByProjectId(this.selectedprojectIds, [
            selectedBlock,
          ])
          .subscribe((removedBlockPlans: any[]) => {
            const removedPlanIds = removedBlockPlans.map((plan) => plan.id);
            // Remove those planIds from planId array
            if (Array.isArray(this.planId)) {
              this.planId = this.planId.filter(
                (id: any) => !removedPlanIds.includes(id)
              );
            } else if (this.planId && removedPlanIds.includes(this.planId)) {
              this.planId = [];
            }
            // Remove related stages for the removed planIds
            if (removedPlanIds.length > 0 && this.stageId?.length > 0) {
              this.stageService
                .getStages(
                  '',
                  this.selectedprojectIds,
                  removedPlanIds,
                  [selectedBlock],
                  this.stageId
                )
                .subscribe((removedStages: any[]) => {
                  const removedStageIds = removedStages.map(
                    (stage) => stage.stageId
                  );
                  if (Array.isArray(this.stageId)) {
                    this.stageId = this.stageId.filter(
                      (id: any) => !removedStageIds.includes(id)
                    );
                  } else if (
                    this.stageId &&
                    removedStageIds.includes(this.stageId)
                  ) {
                    this.stageId = [];
                  }
                });
            }
          });
      }
    }
  }
  onBlockSelectButtonClick() {
    this.blockId = this.selectedBlockIds;
    if (this.blockId.length > 0) {
      this.getAllUnits();
    } else {
      this.fromComponent = false;
      this.getAllUnits();
    }
  }

  getUserManageTypes() {
    this.commonService
      .getRefDetailsId(USER_MANAGE_TYPE, USER_MANAGE_CRM)
      .subscribe({
        next: (data) => {
          this.typeCommonReferenceDetailsId = data;
          this.fetchProjects();
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  fetchProjects() {
    this.usermanageService
      .fetchProjectsBasedOnUserId(
        this.userId,
        this.typeCommonReferenceDetailsId,
        '',
        ''
      )
      .subscribe({
        next: (userManegeProjects) => {
          console.log(userManegeProjects);
          this.userManageprojects = userManegeProjects;
          if (!this.fromComponent) {
            this.projectId = this.userManageprojects.map(
              (p: { projectId: any }) => p.projectId,
              0
            );
            this.getAllUnits();
          }
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  patchStateProjectIds(
    selectedUserManageIds: number[],
    selectedProjectIds?: number[],
    typeCommonReferenceDetailsId: number = 0
  ): void {
    this.project.patchValue('');
    this.selectedprojectIds = selectedProjectIds ? selectedProjectIds : [];
    this.typeCommonReferenceDetailsId = typeCommonReferenceDetailsId ?? 0;
    this.usermanageService
      .fetchProjectsBasedOnUserId(
        this.userId,
        this.typeCommonReferenceDetailsId,
        '',
        selectedUserManageIds,
        selectedProjectIds
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          console.log(projects);
          console.log(this.userManageprojects);
          this.userManageprojects = this.sortProject(
            projects,
            this.selectedprojectIds
          );
          const selectedNames = projects
            .map((project: IUserManageDto) => project.projectName)
            .join(', ');
          console.log(selectedNames);
          this.project.patchValue(selectedNames);
          this.projectId = this.selectedprojectIds;
          console.log(this.selectedprojectIds);
          this.fetchBlocks();
        },
      });
  }
  patchStateBlockIds(selectedBlockIds?: number[]): void {
    // this.block.patchValue('');
    this.selectedBlockIds = selectedBlockIds;
    console.log(this.selectedBlockIds);
    this.blockService
      .fetchBlocksByBlockIds(this.selectedprojectIds, this.selectedBlockIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blocks) => {
          console.log(blocks);
          this.blocks = this.sortProject(blocks, this.selectedBlockIds);
          const selectedNames = blocks
            .map((block: any) => block.name + ' ( ' + block.projectCode + ' )')
            .join(', ');
          console.log(selectedNames);
          this.block.patchValue(selectedNames);
          this.selectedBlockIds = selectedBlockIds;
          this.blockId = this.selectedBlockIds;
          console.log(this.selectedBlockIds);
        },
      });
  }
  onUnitTypeBelongsChange(event: any) {
    console.log(event);
    if (event.value === 'All') {
      let val = 0;
      this.typeId = val;
    } else {
      this.typeId = event.value;
    }
    this.pageIndex = PAGE_INDEX;
    this.getAllUnits();
  }

  getCompanyTypes() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(COMPANY_TYPE)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.companyType = data;
          const allOption = new CommonReferenceType();
          allOption.id = 0;
          allOption.commonRefValue = 'All';
          this.companyType = [allOption, ...data];
          console.log(this.companyType);
          console.log(this.companyType);
        },
        error: (error: any) => {
          console.error('Error fetching Company Types :', error);
        },
      });
  }
}
