import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, filter, takeUntil } from 'rxjs';
import { SHIFT_TIMINGS } from 'src/app/Constants/CommanConstants/attendanceconstant';
import { IProject } from 'src/app/Models/Project/project';
import { Securitypatrol } from 'src/app/Models/Securitypatrol/securitypatrol';
import { User } from 'src/app/Models/User/User';
import { IUserManageDto } from 'src/app/Models/User/UserManage';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { EmployeeService } from 'src/app/Services/Employee/employee.service';
import { CommomReferenceDetailsService } from 'src/app/Services/Presales/CommonRefernceDetails/commomreferencedetails.service';
import { SaleteamService } from 'src/app/Services/Presales/SalesTeam/saleteam.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { QrgeneratorService } from 'src/app/Services/Qrgenerator/qrgenerator.service';
import { SecuritypatrolService } from 'src/app/Services/Securitypatrol/securitypatrol.service';
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';
import { WorkflowTypeService } from 'src/app/Services/WorkflowService/workflow-type.service';
import { WorkflowstageService } from 'src/app/Services/WorkflowService/workflowstage.service';

@Component({
  selector: 'app-userteamanage',
  templateUrl: './userteamanage.component.html',
  styleUrls: ['./userteamanage.component.css'],
})
export class UserteamanageComponent {
  projectName: string | null = '';
  referenceId?: number;
  userTeamsManage: IUserManageDto[] = [] as IUserManageDto[];
  checkedUserTeamsManage: IUserManageDto[] = [] as IUserManageDto[];
  private destroy$ = new Subject<void>();
  projects: IProject[] = [];
  title = '';
  project: any = new FormControl([] as IProject[], Validators.required);
  qrGenerator = new FormControl([] as IProject[]);
  location = new FormControl([] as IProject[]);
  filteredUserTeamsManage: IUserManageDto[] = [] as IUserManageDto[];
  filteredSelectedUserTeamsManage: IUserManageDto[] = [] as IUserManageDto[];
  userTeamsManageSearchText: any;
  checkeduserTeamsManageSearchText: any;
  refernceKey: any;
  organizationId: any;
  stgaeTypeId: any;
  stageId: any;
  stageTypes: any = [];
  stages: any = [];
  qrName: string = '';
  projectId: any;
  qrgeneratorData: any = [];
  locationsData: any = [];
  checkedSaveUserTeamsManage: any = [];
  shiftTimings: any = [];
  selectedShiftId = 0;
  selectedShiftRefKey = '';
  public user: User = new User();
  constructor(
    private projectService: ProjectService,
    private userManageService: UsermanageService,
    private router: Router,
    private route: ActivatedRoute,
    private workflowTypeService: WorkflowTypeService,
    private workflowstageService: WorkflowstageService,
    private securityPatrolService: SecuritypatrolService,
    private qrService: QrgeneratorService,
    private toastrService: ToastrService,
    private salesTeamService: SaleteamService,
    private commonreferanceDetails: CommomReferenceDetailsService,
    private employeeService: EmployeeService,
    private loaderService: LoaderService
  ) {}
  salesTeams: any = [];
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
    }
    this.getProjects('');
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.resetState();
        this.route.params.subscribe((params) => {
          this.handleRouteParams(params);
        });
      });
    this.route.params.subscribe((params) => {
      this.handleRouteParams(params);
    });
    this.getAllShifts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Get all projects
  getProjects(projectName: any) {
    this.organizationId;
    this.projectService
      .getProjectsByOrgIdWithProjectFilter(this.organizationId, projectName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projectData) => {
          this.projects = projectData;
        },
        error: (error) => {
          console.log(error.error);
        },
      });
    //this.getAllUserTeamsManage();
  }

  onProjectSelect(event: any) {
    this.checkedUserTeamsManage = [];
    this.checkedSaveUserTeamsManage = [];
    this.userTeamsManage = [];
    this.projectId = event.option.value.projectId;
    this.referenceId = this.projectId;
    if (
      this.refernceKey != 'SP' &&
      this.refernceKey != 'SA' &&
      this.refernceKey != 'S'
    ) {
      this.getAllUserTeamsManage();
    }
    if (this.refernceKey == 'SP') {
      this.getSecuritypatrolNames();
    }
    if (this.refernceKey == 'SA') {
      if (this.stageId) {
        this.referenceId = this.stageId;
        this.getAllUserTeamsManage();
      }
    }
    if (this.refernceKey == 'S') {
      this.getAllSalesTeamByProjectId();
    }

    if (this.refernceKey == 'SPA') {
      this.getAllLocationsProjectId();
    }

    // if (this.refernceKey == 'UES') {
    //   this.getEmployeeForSelectedShift();
    // }
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }

  displayQrName(securitypatrol: Securitypatrol): string {
    return securitypatrol && securitypatrol.securityPatrolName
      ? securitypatrol.securityPatrolName
      : '';
  }

  getAllUserTeamsManage() {
    this.showLoading();
    this.userManageService
      .getUserManages(
        this.referenceId,
        this.refernceKey,
        this.organizationId,
        this.projectId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userTeamsManage: IUserManageDto[]) => {
          this.userTeamsManage = userTeamsManage;
          this.checkedUserTeamsManage = userTeamsManage?.filter(
            (userTeamManage) => userTeamManage.isAssigned === 1
          );
          this.checkedSaveUserTeamsManage = userTeamsManage?.filter(
            (userTeamManage) =>
              userTeamManage.status === 'A' || userTeamManage.status === 'I'
          );
          this.hideLoading();
        },
        error: (error) => {
          this.hideLoading();
          console.log(error.error);
        },
      });
  }

  onOptionChecked(userManage: IUserManageDto) {
    const role = userManage.role.toLowerCase();
    if (this.userTeamsManage) {
      this.userTeamsManage = this.userTeamsManage.map((team) => {
        if (team.userId == userManage.userId) {
          team.isAssigned = team.isAssigned === 1 ? 0 : 1;
          team.status = team.isAssigned === 1 ? 'A' : 'I';
          team.referenceId = this.referenceId;
          team.projectId = this.projectId;
          team.isEligibleForLeadDistribution =
            role === 'presales member' ||
            role === 'sales member' ||
            role === 'presales manager'
              ? 'Y'
              : 'N';
        }
        return team;
      });
    }
    this.filteringCheckedUserTeamsManage();
  }
  getAllLocationsProjectId() {
    this.qrService
      .getAllLocationsNames(this.projectId, this.qrName, this.refernceKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (locations) => {
          if (Array.isArray(locations) && locations.length === 0) {
            this.location.setValue(null);
            this.userTeamsManage = [];
            this.checkedUserTeamsManage = [];
            this.checkedSaveUserTeamsManage = [];
            this.locationsData = locations;
          } else {
            this.locationsData = locations;
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  filteringCheckedUserTeamsManage() {
    if (this.refernceKey == 'UES') {
      this.checkedUserTeamsManage = this.userTeamsManage?.filter(
        (userManage) => userManage.isAssigned
      );
    } else {
      this.checkedUserTeamsManage = this.userTeamsManage?.filter(
        (userManage) => userManage.status === 'A'
      );
    }
    if (this.refernceKey == 'SP') {
      this.checkedSaveUserTeamsManage = this.userTeamsManage?.filter(
        (userManage) => userManage.status === 'A'
      );
      console.log(
        this.userTeamsManage?.filter(
          (userManage) => userManage.status === 'A' || userManage.status === 'I'
        )
      );
    } else if (this.refernceKey == 'UES') {
      this.checkedSaveUserTeamsManage = this.userTeamsManage?.filter(
        (userManage) => userManage.isAssigned === 1
      );
      console.log(
        this.userTeamsManage?.filter(
          (userManage) => userManage.status === 'A' || userManage.status === 'I'
        )
      );
    } else {
      this.checkedSaveUserTeamsManage = this.userTeamsManage?.filter(
        (userManage) => userManage.status === 'A' || userManage.status === 'I'
      );
    }
  }
  private handleSuccessResponse(response: any): void {
    this.toastrService.success('', 'Persmission Updated Successfully!', {
      timeOut: 2000, // Set success timeout
    });
    this.goRolePermission();
  }

  private handleErrorResponse(error: any): void {
    this.toastrService.error('Failed', error, {
      timeOut: 3000,
    });
    this.goRolePermission();
  }

  goRolePermission() {
    this.getAllUserTeamsManage();
    var routePath = 'layout/presales/presalesteam/' + this.refernceKey;
    this.router.navigate([routePath]);
  }

  onSubmit = () => {
    this.showLoading();
    if (this.refernceKey == 'UES') {
      this.employeeService
        .updateShifts(
          this.checkedSaveUserTeamsManage,
          this.organizationId,
          this.selectedShiftRefKey,
          this.projectId
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.hideLoading();
            this.handleSuccessResponseForShift(resp);
          },
          error: (err) => {
            this.hideLoading();
            console.error('Error adding shift', err);
            this.handleErrorResponse(err);
          },
        });
    } else {
      this.userManageService
        .saveUserManageTeams(
          this.checkedSaveUserTeamsManage,
          this.referenceId,
          this.refernceKey,
          this.projectId
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.hideLoading();
            this.handleSuccessResponse(resp);
          },
          error: (err) => {
            console.error('Error adding Role', err);
            this.hideLoading();
            this.handleErrorResponse(err);
          },
        });
    }
    this.hideLoading();
  };

  filterUserTeamManageOnUserName = (userTeamsManageSearchText: any) => {
    this.userTeamsManageSearchText = userTeamsManageSearchText;
    this.filteredUserTeamsManage = this.userTeamsManage.filter((e) =>
      e.userName
        ?.toLowerCase()
        .includes(userTeamsManageSearchText.toLowerCase())
    );
  };

  filtercheckedUserTeamsManageOnUserName = (userTeamsManageSearchText: any) => {
    this.checkeduserTeamsManageSearchText = userTeamsManageSearchText;
    this.filteredSelectedUserTeamsManage = this.checkedUserTeamsManage.filter(
      (e) =>
        e.userName
          ?.toLowerCase()
          .includes(userTeamsManageSearchText.toLowerCase())
    );
  };

  getStages(workFlowTypeId: any) {
    this.workflowstageService
      .getAllWorkflowstageByType(workFlowTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stages) => {
          this.stages = stages;
        },
        error: (error) => {
          console.log(error.error);
        },
      });
  }

  handleStageTypeSelection(event: any) {
    this.stgaeTypeId = event.id;
    this.getStages(event.id);
  }

  handleStageSelection(event: any) {
    this.stageId = event.id;
    this.referenceId = this.stageId;
    if (this.projectId) {
      this.getAllUserTeamsManage();
    }
    this.filteringCheckedUserTeamsManage();
  }

  getStageType() {
    this.workflowTypeService
      .fetchAllWorkflowTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stageTypes) => {
          this.stageTypes = stageTypes;
        },
        error: (error) => {
          console.log(error.error);
        },
      });
    this.getAllUserTeamsManage();
    this.filteringCheckedUserTeamsManage();
  }
  onQrGeneratorSerach(qrName: any) {
    this.getSecuritypatrolNames();
  }

  getSecuritypatrolNames() {
    this.securityPatrolService
      .getAllSecurtiyPatrolNames(this.projectId, this.qrName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (securityPatrolObjects) => {
          if (
            Array.isArray(securityPatrolObjects) &&
            securityPatrolObjects.length === 0
          ) {
            this.qrGenerator.setValue(null);
            this.userTeamsManage = [];
            this.checkedUserTeamsManage = [];
            this.qrgeneratorData = securityPatrolObjects;
          } else {
            this.qrgeneratorData = securityPatrolObjects;
          }
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  onQrGeneratorSelect(event: any) {
    this.referenceId = event.option.value.scheduleId;
    this.qrGenerator.setValue(event.option.value);
    this.getAllUserTeamsManage();
    this.filteringCheckedUserTeamsManage();
  }

  onLocationSelect(event: any) {
    this.referenceId = event.option.value.id;
    this.location.setValue(event.option.value);
    this.getAllUserTeamsManage();
    this.filteringCheckedUserTeamsManage();
  }
  onlocationSerach(event: any) {
    this.referenceId = event.option.value.id;
    this.location.setValue(event.option.value);
    this.getAllUserTeamsManage();
    this.filteringCheckedUserTeamsManage();
  }
  private resetState(): void {
    this.project = new FormControl({} as IProject, Validators.required);

    this.userTeamsManage = [] as IUserManageDto[];
    this.checkedUserTeamsManage = [] as IUserManageDto[];

    this.project = new FormControl([] as IProject[], Validators.required);
    this.qrGenerator = new FormControl([] as IProject[]);
    this.filteredSelectedUserTeamsManage = [] as IUserManageDto[];
    this.filteredUserTeamsManage = [] as IUserManageDto[];
    // this.stageTypes = [];
    // this.stages = [];
    //this.projects = [];
    // this.qrgeneratorData = [];
  }

  private handleRouteParams(params: any): void {
    this.refernceKey = params['Team'];
    //const param2 = params['param2'];
    if (params['Team'] == 'P') {
      this.title = 'Pre Sale Team';
    } else if (params['Team'] == 'S') {
      this.title = 'to Teams';
    } else if (params['Team'] === 'SA') {
      this.title = 'Stage Approvals';
      this.getStageType();
    } else if (params['Team'] === 'SP') {
      this.title = 'Security Assign For QR Scan';
    } else if (params['Team'] === 'SPP') {
      this.title = 'Security Assign For QR Scan On Project';
    } else if (params['Team'] === 'SPA') {
      this.title = 'Security Assign For Attendance';
    } else if (params['Team'] === 'GRE') {
      this.title = 'GRE CONFIG';
    } else if (params['Team'] === 'UES') {
      this.title = 'UPDATE EMPLOYEE SHIFT';
    }
  }

  getAllSalesTeamByProjectId() {
    this.salesTeamService
      .getAllSaleTeam(this.projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.salesTeams = resp;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  handleSaleTeamSelect(value: any) {
    this.referenceId = value.id;
    this.getAllUserTeamsManage();
  }

  handleLocationSelect(value: any) {
    this.referenceId = value.id;
    this.getAllUserTeamsManage();
  }

  getAllShifts() {
    this.commonreferanceDetails
      .fetchTypeName(SHIFT_TIMINGS)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.shiftTimings = resp;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  selectedShift(event: any) {
    this.selectedShiftId = event.id;
    this.selectedShiftRefKey = event.commonRefKey;
    this.getEmployeeForSelectedShift();
  }

  getEmployeeForSelectedShift() {
    this.employeeService
      .getEmployeeForSelectedShift(
        this.organizationId,
        this.projectId,
        this.selectedShiftId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.userTeamsManage = resp;
          this.checkedUserTeamsManage = resp?.filter(
            (userTeamManage: any) => userTeamManage.isAssigned === 1
          );

          this.checkedSaveUserTeamsManage = resp?.filter(
            (userTeamManage: any) => userTeamManage.isAssigned === 1
          );
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  private handleSuccessResponseForShift(response: any): void {
    this.toastrService.success('', 'Shift Updated Successfully!', {
      timeOut: 2000, // Set success timeout
    });
    this.getEmployeeForSelectedShift();
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
