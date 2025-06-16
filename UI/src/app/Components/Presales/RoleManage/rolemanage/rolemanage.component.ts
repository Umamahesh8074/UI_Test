import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subject, filter, takeUntil } from 'rxjs';
import { IRoleManageDto } from 'src/app/Models/Presales/RoleManage';
import { IProject } from 'src/app/Models/Project/project';
import { User } from 'src/app/Models/User/User';
import { CommomReferenceDetailsService } from 'src/app/Services/Presales/CommonRefernceDetails/commomreferencedetails.service';
import { RolemanageService } from 'src/app/Services/Presales/RoleManage/rolemanage.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { WorkflowTypeService } from 'src/app/Services/WorkflowService/workflow-type.service';
import { WorkflowstageService } from 'src/app/Services/WorkflowService/workflowstage.service';

@Component({
  selector: 'app-rolemanage',
  templateUrl: './rolemanage.component.html',
  styleUrls: ['./rolemanage.component.css'],
})
export class RolemanageComponent {
  projectName: string | null = '';
  referenceId?: number;
  roleManages: IRoleManageDto[] = [] as IRoleManageDto[];
  checkedRoleManages: IRoleManageDto[] = [] as IRoleManageDto[];
  private destroy$ = new Subject<void>();
  projects: IProject[] = [];
  project: any = new FormControl({} as IProject, Validators.required);
  searchedRoleManages: IRoleManageDto[] = [] as IRoleManageDto[];
  searchedSelectedRoleManage: IRoleManageDto[] = [] as IRoleManageDto[];
  roleManageSearchText: any;
  checkedRoleManageSearchText: any;
  typeCommonRefernceDetailsId: number = 0;
  title: any;
  refernceKey: any;
  public user: User = new User();
  organizationId: any;
  stgaeTypeId: any;
  stageId: any;
  constructor(
    private projectService: ProjectService,
    private roleManageService: RolemanageService,
    private router: Router,
    private route: ActivatedRoute,
    private commomReferenceDetailsService: CommomReferenceDetailsService,
    private workflowTypeService: WorkflowTypeService,
    private workflowstageService: WorkflowstageService
  ) {}
  ngOnChanges() {
    console.log('teams');
  }
  stageTypes: any = [];
  stages: any = [];
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      console.log(this.user.organizationId);
      this.organizationId = this.user.organizationId;
      console.log(this.organizationId);
    }
    this.getProjects(this.projectName);
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
  }

  private resetState(): void {
    this.project = new FormControl({} as IProject, Validators.required);
    this.roleManages = [] as IRoleManageDto[];
    this.checkedRoleManages = [] as IRoleManageDto[];
  }

  private handleRouteParams(params: any): void {
    this.refernceKey = params['Team'];
    console.log(params['Team']);

    if (params['Team'] === 'S') {
      this.title = 'Sales Team';
    } else if (params['Team'] === 'P') {
      this.title = 'Pre Sales Team';
    } else if (params['Team'] === 'RM') {
      this.title = 'Lead Manage';
    } else if (params['Team'] === 'SA') {
      this.title = 'Stage Approvals';
      this.getStageType();
    }
    this.getTypeCommonRefernceId(params['Team']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTypeCommonRefernceId = (referenceKey: any) => {
    this.commomReferenceDetailsService
      .fetchCommonRefernceDetailsId(referenceKey)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (commonRefernceDetails) => {
          console.log(commonRefernceDetails);
          this.typeCommonRefernceDetailsId = commonRefernceDetails.id;
        },
        error: (error) => {
          console.log(error.error);
        },
      });
  };
  // Get all projects
  getProjects(projectName: any) {
    this.projectName = projectName;
    this.projectService
      .getProjectsByOrgId(this.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projectData:any) => {
          this.projects = projectData;
          console.log(projectData);
        },
        error: (error:any) => {
          console.log(error.error);
        },
      });
    this.getAllRoleManages(this.referenceId);
  }
  getStageType() {
    this.workflowTypeService
      .fetchAllWorkflowTypes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stageTypes) => {
          this.stageTypes = stageTypes;
          console.log(stageTypes);
        },
        error: (error) => {
          console.log(error.error);
        },
      });
    this.getAllRoleManages(this.referenceId);
  }

  onProjectSelect(event: any) {
    console.log(event.option.value);
    this.referenceId = event.option.value.projectId;
    this.getAllRoleManages(this.referenceId);
    this.filteringCheckedRoleManages();
  }

  displayFn(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }

  getAllRoleManages(projectId?: number) {
    if (!projectId) return;

    this.roleManageService
      .getRoleManage(
        projectId,
        this.typeCommonRefernceDetailsId,
        this.organizationId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (roleManages: IRoleManageDto[]) => {
          console.log(roleManages);
          this.roleManages = roleManages;
          this.checkedRoleManages = roleManages?.filter(
            (roleManage) => roleManage.isAssigned === 1
          );
        },
        error: (error) => {
          console.log(error.error);
        },
      });
  }

  onOptionChecked(projectSaleTeam: IRoleManageDto) {
    if (this.roleManages) {
      this.roleManages = this.roleManages.map((team) => {
        if (team.roleId == projectSaleTeam.roleId) {
          team.isAssigned = team.isAssigned === 1 ? 0 : 1;
          team.referenceId = this.referenceId;
          team.typeCommonReferenceDetailsId = this.typeCommonRefernceDetailsId;
        }
        return team;
      });
    }
    this.filteringCheckedRoleManages();
  }

  filteringCheckedRoleManages() {
    this.checkedRoleManages = this.roleManages?.filter(
      (roleManage) => roleManage.isAssigned === 1
    );
    console.log(this.checkedRoleManages);
  }

  onSubmit = () => {
    console.log(this.checkedRoleManages);
    this.roleManageService
      .saveProjectSalesTeam(
        this.checkedRoleManages,
        this.referenceId,
        this.typeCommonRefernceDetailsId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          // this.getMenuItems(this.roleId);
          this.getAllRoleManages(this.referenceId);
          const routeLink = 'layout/presales/rolemanage/' + this.refernceKey;
          this.router.navigate([routeLink]);
        },
        error: (err) => {
          console.error('Error adding Role', err);
        },
      });
  };

  searchRoleManageOnRoleName = (searchText: any) => {
    this.roleManageSearchText = searchText;
    this.searchedRoleManages = this.roleManages.filter((roleManage) =>
      roleManage.roleName?.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  searchcheckedRoleManageOnRoleName = (searchText: any) => {
    this.checkedRoleManageSearchText = searchText;
    this.searchedSelectedRoleManage = this.checkedRoleManages.filter(
      (roleManage) =>
        roleManage.roleName?.toLowerCase().includes(searchText.toLowerCase())
    );
  };
  getStages(workFlowTypeId: any) {
    this.workflowstageService
      .getAllWorkflowstageByType(workFlowTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stages) => {
          console.log(stages);
          this.stages = stages;
          console.log(stages);
        },
        error: (error) => {
          console.log(error.error);
        },
      });
  }
  handleStageTypeSelection(event: any) {
    console.log(event.id);
    this.stgaeTypeId = event.id;
    this.getStages(event.id);
  }
  handleStageSelection(event: any) {
    this.stageId = event.id;
    this.referenceId = this.stageId;
    this.getAllRoleManages(this.referenceId);
    this.filteringCheckedRoleManages();
  }

  
}
