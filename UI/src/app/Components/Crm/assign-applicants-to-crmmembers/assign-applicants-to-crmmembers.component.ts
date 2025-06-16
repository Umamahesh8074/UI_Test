import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import {
  pageSizeOptions,
  TIME_OUT,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  CRM_MEMBER_ROLL_NAME,
  CRM_ROLL_NAME,
  ROLL_NAME,
  STAGE_STATUS,
} from 'src/app/Constants/Crm/CrmConstants';
import { IApplicantInfoDto } from 'src/app/Models/Crm/ApplicantInfo';
import { IProject, Project } from 'src/app/Models/Project/project';
import { Unit } from 'src/app/Models/Project/unit';
import { IUser } from 'src/app/Models/User/User';
import { UserDto } from 'src/app/Models/User/UserDto';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ApplicationInfoService } from 'src/app/Services/CrmServices/applicant-info.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import { ToastrService } from 'ngx-toastr';
import { Block, IBlock } from 'src/app/Models/Block/block';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { LevelService } from 'src/app/Services/ProjectService/Level/level.service';
import { ILevel, Level } from 'src/app/Models/Project/level';
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';

@Component({
  selector: 'app-assign-applicants-to-crmmembers',
  templateUrl: './assign-applicants-to-crmmembers.component.html',
  styleUrls: ['./assign-applicants-to-crmmembers.component.css'],
})
export class AssignApplicantsToCrmmembersComponent implements OnInit {
  constructor(
    private userService: UserService,
    private commonService: CommanService,
    private applicationInfoService: ApplicationInfoService,
    private projectService: ProjectService,
    private unitService: UnitService,
    private toastrService: ToastrService,
    private blockService: BlockService,
    public levelService: LevelService,
    private usermanageService: UsermanageService
  ) {}
  crmTeam: string = '';
  organizationId: number = 0;
  private destroy$ = new Subject<void>();
  userData: UserDto[] = [];
  targetUserData: UserDto[] = [];
  userId: number = 0;
  pageSize: number = 14;
  pageIndex: number = 0;
  totalPages: number = 0;
  applicantInfoData: IApplicantInfoDto[] = [];
  projectName: string = '';
  firstApplicantName: string = '';
  unitName: string = '';
  typeId: number = 0;
  bookedById: number = 0;
  pageSizeOptions = pageSizeOptions;
  userName: string = '';
  targetUserName: string = '';
  user: any = new FormControl([] as IUser[]);
  targetUser: any = new FormControl([] as IUser[]);
  selected = new Set<any>();
  projectId: any;
  project: any = new FormControl([] as IProject[]);
  projects: Project[] = [];
  units: Unit[] = [];
  unit: FormControl = new FormControl([] as Unit[]);
  unitId: number = 0;
  selectedUnitName: Unit = new Unit();
  blockId: number = 0;
  block: any = new FormControl([] as IBlock[]);
  floor: any = new FormControl([] as ILevel[]);
  blockName: string = '';
  blocks: Block[] = [];
  formData!: FormGroup;
  crmUserId: number = 0;
  crmTargetUserId: number = 0;
  levels: Level[] = [];
  levelId: number = 0;
  levelName: any;
  userManageData: any;
  typeCommonReferenceDetailsId: number = 0;

  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.fetchUsers();
    this.fetchTargetUsers();
    this.getUsermanageByUserId();
  }

  displayedColumns: string[] = [
    'select',
    'bookingCode',
    'firstApplicantName',
    'projectName',
    'levelName',
    'towerName',
    'blockName',
    'unitName',
    'crmUserName',
    'finalPrice',
    'receivedAmount',
  ];

  onCrmTeamSelect(event: any) {
    const selectedUser = event.option?.value;

    if (selectedUser === 'all') {
      this.crmUserId = 0;
      console.log('Fetching all applicants...');
      this.getAllApplicantInfos();
    } else if (selectedUser) {
      this.crmUserId = selectedUser.userId;
      console.log('Selected CRM User:', selectedUser);
      this.fetchUsers();
      this.getAllApplicantInfos();
    } else {
      this.crmUserId = 0;
      console.log('CRM User selection cleared.');
      this.getAllApplicantInfos();
    }
  }

  onTargetCrmSelect(event: any) {
    const selectedUser = event.option.value;
    this.fetchTargetUsers();
  }

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
      this.userId = user.userId;
    }
  }

  fetchUsers() {
    this.userService
      .fetchUsersByRolesAndOrganization(
        CRM_MEMBER_ROLL_NAME,
        this.organizationId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.userData = data;
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  fetchTargetUsers() {
    this.userService
      .fetchUsersByRolesAndOrganization(
        CRM_MEMBER_ROLL_NAME,
        this.organizationId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.targetUserData = data;
          // this.getAllApplicantInfos();
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  getAllApplicantInfos() {
    this.applicationInfoService
      .getAllApplicantInfo(
        this.pageIndex,
        this.pageSize,
        // STAGE_STATUS,
        this.typeCommonReferenceDetailsId,
        this.projectId,
        this.firstApplicantName,
        this.projectName,
        this.unitName,
        this.bookedById,
        this.typeId,
        this.blockName,
        this.blockId,
        this.crmUserId,
        this.levelId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (applicantInfo) => {
          this.applicantInfoData = applicantInfo.records;
          this.totalPages = applicantInfo.totalRecords;
        },
        error: (error) => {
          console.log(error.error);
        },
      });
  }

  searchCrm(event: any): void {
    const query = event.target.value.userName;
    if (query.length >= 3) {
      this.userName = query;
      this.fetchUsers();
      this.getAllApplicantInfos();
    } else if (query.length == 0) {
      this.userName = '';
      this.fetchUsers();
      this.getAllApplicantInfos();
    }
  }

  searchTargetCrm(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.targetUserName = query;
      this.fetchTargetUsers();
      // this.getAllApplicantInfos();
    } else if (query.length == 0) {
      this.targetUserName = '';
      this.fetchTargetUsers();
      // this.getAllApplicantInfos();
    }
  }

  displayUser(user: IUser): string {
    return user && user.userName ? user.userName : '';
  }
  displayTargetUser(targetUser: IUser): string {
    return targetUser && targetUser.userName ? targetUser.userName : '';
  }

  isAllSelected(): boolean {
    const numSelected = this.selected.size;
    const numRows = this.applicantInfoData?.length || 0;
    return numRows > 0 && numSelected === numRows;
  }

  isSomeSelected(): boolean {
    const numSelected = this.selected.size;
    const numRows = this.applicantInfoData?.length || 0;
    return numSelected > 0 && numSelected < numRows;
  }

  masterToggle() {
    const numRows = this.applicantInfoData?.length || 0;
    if (numRows === 0) {
      return; // Prevent toggling if no data is available
    }

    if (this.isAllSelected()) {
      this.selected.clear();
    } else {
      this.applicantInfoData.forEach((row) => this.selected.add(row));
    }
  }

  toggleSelection(row: any) {
    if (this.selected.has(row)) {
      this.selected.delete(row);
    } else {
      this.selected.add(row);
    }
  }

  isSelected(row: any): boolean {
    return this.selected.has(row);
  }

  updateCrmUserId() {
    const selectedBookingIds = Array.from(this.selected).map(
      (item: any) => item.bookingId
    );
    const selectedUserId = this.targetUser.value?.userId;

    if (selectedBookingIds.length === 0 || !selectedUserId) {
      console.error('No bookings selected or CRM user not selected');
      return;
    }

    this.applicationInfoService
      .updateCrmUserId(selectedBookingIds, selectedUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (message) => {
          console.log('CRM User updated successfully:', message);
          this.unit.setValue(null);
          this.block.setValue(null);
          this.floor.setValue(null);
          this.project.setValue(null);
          this.targetUser.setValue(null);
          this.user.setValue(null);
          this.unitName = '';
          this.projectName = '';
          this.levelId = 0;
          this.blockId = 0;
          this.crmUserId = 0;
          this.handleSuccessResponse(message);
          this.getAllApplicantInfos();
        },
        error: (error) => {
          const errorMessage = error?.error || 'Unknown error occurred';
          console.error('Error updating CRM user:', errorMessage);
          this.handleErrorResponse(errorMessage);
        },
      });
  }

  fetchProjects() {
    this.projectService
      .getProjectsByOrgIdWithProjectFilter(
        this.organizationId,
        this.projectName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          console.log(projects);
          this.projects = projects;
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  onProjectSelect(event: any) {
    this.projectName = event.option.value.projectName;
    this.projectId = event.option.value.projectId;
    this.block.setValue(null);
    this.floor.setValue(null);
    this.unit.setValue(null);
    this.fetchBlocks();
    this.getAllApplicantInfos();
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }

  searchProject(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.projectName = query;
      this.fetchProjects();
      this.getAllApplicantInfos();
    } else if (query.length == 0) {
      this.projectName = '';
      this.fetchProjects();
      this.getAllApplicantInfos();
    }
  }

  fetchUnits(levelId: number) {
    this.unitService
      .getUnitsBasedOnLevelId(levelId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.units = data;
          console.log(data);
        },
        error: (error: Error) => {
          console.error('Error fetching units:', error);
        },
      });
  }
  onUnitSelect(event: any) {
    this.unitName = event.option.value.unitName;
    this.unitId = event.option.value.unitId;
    this.getAllApplicantInfos();
  }
  displayUnit(unit: Unit): string {
    return unit && unit.unitName ? unit.unitName : '';
  }
  searchUnit(eventOrValue: any): void {
    console.log(eventOrValue);

    let query: string;
    if (eventOrValue instanceof Event) {
      const inputElement = eventOrValue.target as HTMLInputElement;
      query = inputElement.value;
      console.log(query);
    } else {
      query = eventOrValue;
      console.log(query);
    }
    if (query.length >= 1) {
      this.unitName = query;
      this.getAllUnits(this.unitName);
    } else if (query.length === 0) {
      this.unitName = '';
      this.getAllUnits(this.unitName);
    }
  }

  getAllUnits(unitName: string) {
    this.unitService
      .getUnitByName(unitName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response.records);
          this.units = response;
          this.selectedUnitName = response[0];
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  fetchBlocks() {
    this.blockService
      .getBlocks(this.projectId, this.blockName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blocks) => {
          this.blocks = blocks;
          console.log(blocks);
          console.log(this.blockId);
          // this.getLevelsBasedOnBlockId(this.blockId);
          // this.fetchUnits(this.projectId);
        },
        error: (error: Error) => {
          console.error('Error fetching blocks:', error);
        },
      });
  }
  onBlockSelect(event: any) {
    this.blockId = 0;
    this.levelId = 0;
    this.unitName = '';
    if (event.option.value.id) {
      this.blockId = event.option.value.id;
      this.floor.setValue(null);
      this.unit.setValue(null);
      this.getLevelsBasedOnBlockId(this.blockId);
      this.getAllApplicantInfos();
      return;
    }
    this.blockId = event.option.value.id;
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

  onFloorSelect(event: any) {
    this.levelId = 0;
    this.unitId = 0;
    this.unitName = '';
    console.log(event);
    this.levelId = event.option.value.levelId;
    this.unit.setValue(null);
    this.unitName = '';
    this.fetchUnits(this.levelId);
    this.getAllApplicantInfos();
  }
  displayFloor(floor: Level) {
    return floor && floor.name ? floor.name : '';
  }
  searchFloor(event: any) {
    const query = event.target.value;
    this.levelName = query;
    if (query.length >= 1) {
      this.levelName = query;
      console.log(this.levelName);
      this.getLevelsBasedOnBlockId(this.blockId);
      this.getAllApplicantInfos();
    } else if (query.length === 0) {
      this.levelName = '';
      this.levelId = 0;
      this.getLevelsBasedOnBlockId(this.blockId);
      this.getAllApplicantInfos();
    }
  }
  private getUsermanageByUserId(): void {
    console.log(this.userId);
    this.usermanageService.getUserManage(this.userId).subscribe({
      next: (response) => {
        console.log('User manage data:', response);
        this.userManageData = response;
        this.projectId = response[0].projectId;
        this.typeCommonReferenceDetailsId =
          response[0].typeCommonReferenceDetailsId;
        console.log(this.projectId);
        this.fetchBlocks();
        this.getAllApplicantInfos();
      },

      error: (err) => {
        // Handle the error here
        console.error('Error fetching user manage data:', err);
      },
    });
  }
  handleSuccessResponse(response: any): void {
    console.log(response.message);
    this.toastrService.success('', response, {
      timeOut: TIME_OUT,
    });
  }

  handleErrorResponse(error: any): void {
    const errorMessage = error?.message || 'An unknown error occurred';
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllApplicantInfos();
  }
}
