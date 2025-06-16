import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { IProject } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { User } from 'src/app/Models/User/User';
import { IUserDto } from 'src/app/Models/User/UserDto';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { SaleteamService } from 'src/app/Services/Presales/SalesTeam/saleteam.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';

export interface FoodNode {
  name: string;
  children?: FoodNode[];
  lost?: number;
  siteVisitConfirm?: number;
  siteVisitDone?: number;
  booked?: number;
  junk?: number;
  nonContactable?: number;
  revisitConfirm?: number;
  reVisitDone?: number;
  visitProspect?: any;
  followup?: any;
  qualified?: any;
  totalLead?: any;
  assignedLeads?: any;
}

@Component({
  selector: 'app-projectteamreportpage',
  templateUrl: './projectteamreportpage.component.html',
  styleUrls: ['./projectteamreportpage.component.css'],
})
export class ProjectteamreportpageComponent {
  treeData: any;
  private destroy$ = new Subject<void>();
  public loginUser: User = new User();
  private loginUserId: any;
  private loginUserRoleId: any;
  private organizationId: any;
  projects: IProject[] = [];
  project: any = new FormControl([] as IProject[]);
  user: any = new FormControl([] as IUserDto[]);
  projectId: any;
  teamId: any;
  salesTeams: any;
  projectName: string = '';
  daysType: string = 'Filter_Days';
  dateRange: any = 0;
  formData!: FormGroup;
  showDateRangePicker = false;
  startDate: any;
  endDate: any;
  days: CommonReferenceDetails[] = [];
  userListByManagerId: any = [];
  teamUserId: any;
  selectedDay: any;
  userName: any;
  roleName: string = '';
  showDropdown: boolean = false;
  userDetails: any;
  public filteredUsers: any = [];
  selectedUsers: any;

  selectedUsersControl = new FormControl([]);
  selectedprojectIds: any;
   @ViewChild('allProjectSelected') private allProjectSelected?: any;

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.loginUser = JSON.parse(user);
      this.loginUserId = this.loginUser.userId;
      this.loginUserRoleId = this.loginUser.roleId;
      this.organizationId = this.loginUser.organizationId;
      this.roleName = this.loginUser.roleName;
      // this.fetchUser();
    }
    if (this.roleName) {
      const roles = ['presales manager', 'sales manager', 'cto', 'sales head'];
      this.showDropdown = roles.includes(this.roleName.toLowerCase());
    }
    const roles = [
      'cp approval',
      'assistant manager - channel sales',
      'cto',
      'sales head',
    ];
    if (this.roleName && roles.includes(this.roleName.toLowerCase())) {
      this.fetchUsersByRole();
    } else {
      this.getAllUserNames();
    }

    this.initForm();
    this.fetchFilterDays();
    this.getProjects(this.projectName);
    this.getProjectReport();
  }

  constructor(
    private leadService: LeadService,
    private projectService: ProjectService,
    private formBuilder: FormBuilder,
    private commonService: CommanService,
    private userService: UserService,
    private loaderService: LoaderService
  ) {}

  expandedNodes = new Set<string>();
  activeNodes = new Set<string>();

  getUniqueId(node: any, ...indices: number[]): string {
    return `${node.name}-${indices.join('-')}`;
  }

  isExpanded(id: string): boolean {
    return this.expandedNodes.has(id);
  }

  toggle(id: string): void {
    if (this.expandedNodes.has(id)) {
      this.expandedNodes.delete(id);
    } else {
      this.expandedNodes.add(id);
    }

    if (this.activeNodes.has(id)) {
      this.activeNodes.delete(id); // Deselect row
    } else {
      this.activeNodes.add(id); // Select new row
    }
  }

  isActive(nodeId: string): boolean {
    return this.activeNodes.has(nodeId);
  }

  getProjectReport() {
    this.showLoading();
    this.leadService
      .getProjectTeamReport(
        this.loginUserId,
        this.loginUserRoleId,
        this.dateRange,
        this.startDate,
        this.endDate,
        this.projectId,
        this.teamUserId,
        this.teamId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.treeData = resp;
          this.hideLoading();
        },
        error: (err) => {
          this.hideLoading();
        },
      });
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : 'All';
  }

  getProjects(projectName: any) {
    this.projectName = projectName;

    this.projectService
      .getAllProjects(this.projectName, 0, 100, 'Y', this.organizationId)
      .subscribe({
        next: (projects) => {
          this.projects = projects.records;
        },
        error: (error) => {
          console.log(error.error);
        },
      });
  }

  getAllSalesTeamByProjectId() {
    // this.salesTeamService
    //   .getAllSaleTeam(this.projectId)
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (resp) => {
    //       this.salesTeams = resp;
    //     },
    //     error: (error) => {
    //       console.error(error);
    //     },
    //   });
  }
  handleSaleTeamSelect(value: any) {
    this.teamId = value?.id;
    this.getProjectReport();
  }

  formatDateTime(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      customStartDate: [],
      customEndDate: [],
    });
    this.formData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formDataValue) => {
        if (formDataValue.customStartDate && formDataValue.customEndDate) {
          const startDate = this.formatDateTime(formDataValue.customStartDate);
          const endDate = this.formatDateTime(
            formDataValue.customEndDate,
            true
          );
          this.startDate = startDate;
          this.endDate = endDate;
          this.getProjectReport();
        }
      });
  }

  fetchFilterDays() {
    this.commonService.getRefDetailsByType(this.daysType).subscribe({
      next: (response: CommonReferenceDetails[]) => {
        this.days = response;
        this.selectedDay = this.days.find((day) => day.commonRefKey === '0'); // Set "Today" as the default
      },
      error: (error) => console.error(error),
    });
  }

  handleDaySelection(commonRefObject: CommonReferenceDetails) {
    this.dateRange = commonRefObject.commonRefKey;
    if (commonRefObject.commonRefValue.includes('Custom')) {
      this.showDateRangePicker = true;
      this.dateRange = '';
    } else {
      this.showDateRangePicker = false;
      this.startDate = null;
      this.endDate = null;
      this.formData.patchValue({
        customStartDate: null,
        customEndDate: null,
      });
      this.getProjectReport();
    }
  }
  // fetchUser() {
  //   this.userService
  //     .getUserByManagerId(this.loginUserId, this.userName)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (resp) => {
  //         const userData = resp.filter((u) => u.userId != this.loginUserId);
  //         this.userListByManagerId = userData;
  //       },
  //       error: (error) => {
  //         console.error(error);
  //       },
  //     });
  // }

  onUserSerach(event: any) {
    this.userName = event;
    if (event.length > 2 || event.length == 0) {
      if (this.roleName) {
        const roles = [
          'presales manager',
          'sales manager',
          'cto',
          'sales head',
        ];
        this.showDropdown = roles.includes(this.roleName.toLowerCase());
      }
      const roles = [
        'cp approval',
        'assistant manager - channel sales',
        'cto',
        'sales head',
      ];
      if (this.roleName && roles.includes(this.roleName.toLowerCase())) {
        this.fetchUsersByRole();
      } else {
        this.getAllUserNames();
      }
    }
  }

  onUserSelete(event: any) {
    console.log(event?.option.value);

    this.teamUserId = event?.option.value?.userId;
    this.getProjectReport();
  }

  displayUser(user: User): string {
    return user && user.userName ? user.userName : 'All';
  }

  isDisplay(): boolean {
    return this.loginUser.roleName.toLowerCase() != 'presales member';
  }

  private fetchUsersByRole() {
    // let status: any;
    const roleName: string[] = []; // Declare roleName as an array of strings
    roleName.push('presales member');
    roleName.push('NoCallSupport');
    roleName.push('presales manager');
    roleName.push('sales member');

    this.userService
      .fetchUsersByRolesAndOrganization(
        roleName,
        this.organizationId,
        'A',
        this.userName
      )
      .subscribe({
        next: (userDetails) => {
          this.userListByManagerId = userDetails;
        },
        error: (error) => {
          console.error('Error fetching UserDetails by role:', error);
        },
      });
  }
  getAllUserNames() {
    this.userService
      .getUserByManagerId(this.loginUser.userId, this.userName)
      .subscribe({
        next: (userDetails) => {
          console.log(userDetails);
          this.userListByManagerId = userDetails;

          // this.selectedUsersControl.patchValue(this.selectedUsers);
          this.selectedUsers = this.selectedUsers.map(
            (user: any) =>
              this.filteredUsers.find(
                (fUser: any) => fUser.userId === user.userId
              ) || user
          );
          this.selectedUsersControl.patchValue(this.selectedUsers);
        },
        error: (error) => {
          console.error('Error fetching UserDetails:', error);
        },
      });
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }

  isSelectedProject(projectId?: number): boolean {
    return this.selectedprojectIds?.includes(projectId);
  }

  fetchProjectsByIds(selectedIds: any) {
    this.projectName = this.projectName || '';
    this.projectService
      .getProjectsByIds(this.projectName, this.user.organizationId, selectedIds, 'Y')
      .subscribe({
        next: (projects) => {
          this.projects = projects.records;
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  patchStateProjectIds(selectedIds: number[]): void {
    this.project.patchValue('')
    this.projectService
      .getProjectsByIds('', this.user.organizationId, selectedIds, 'Y')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects: any) => {
          console.log(projects)
          this.projects = this.sortProject(this.projects, selectedIds)
          const selectedNames = projects
            .map((project: any) => project.projectName)
            .join(', ');
          console.log(selectedNames);
          this.project.patchValue(selectedNames);
          this.selectedprojectIds = selectedIds;
          console.log(this.selectedprojectIds)
          this.projectId = this.selectedprojectIds
          console.log(this.projectId)
          //  this.checkAllProjectSeleted(this.selectedprojectIds)
          //this.isSelectedProject();
          // this.selectedSubSourcesIds = this.selectedSubSourcesIds;
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
  onAllSelectProject() {
    console.log(this.allProjectSelected.checked)
    // this.allProjectChecked=this.allProjectSelected.checked
    if (this.allProjectSelected.checked) {
      this.selectedprojectIds = this.projects.map((p: any) => p.projectId, 0)
    } else {
      this.selectedprojectIds = []
    }
    console.log(this.projectId)
    //this.projectId = this.selectedprojectIds
    this.displayProjectNames();
    // if (this.isUnassignedLeads) {
    //   this.getDashBoardUnassignedLeadsDetails();
    // } else if (this.dashboard && !this.isCTODashboard) {
    //   this.getDashBoardLeadsDetailsV1();
    // } else if (this.isCTODashboard) {
    //   this.getDashBoardLeadsDetailsNew();
    // } else if (this.currentStatusDashboard) {
    //   this.getDashBoardLeadsCurrentStatusDetails();
    // } else {
    //   this.getDashBoardLeadsDetails();
    // }
  }

  displayProjectNames() {
    if(this.selectedprojectIds.length>0){
    this.projectService
      .getProjectsByIds('', this.user.organizationId, this.selectedprojectIds, 'Y')
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects: any) => {
          console.log(projects)
          this.projects = this.sortProject(this.projects, this.selectedprojectIds)
          const selectedNames = projects
            .map((project: any) => project.projectName)
            .join(', ');
          console.log(selectedNames);
          this.project.patchValue(selectedNames);
        },
      });
    }
    else{
      this.project.patchValue('');
    }
  }

  isProjectAllSelected(): boolean {
    const allProjectIds = this.projects.map(p => p.projectId);
    return Array.isArray(this.selectedprojectIds) &&
           allProjectIds.length > 0 &&
           allProjectIds.every(id => this.selectedprojectIds.includes(id));
  }

  onProjectSelectButtonClick(){
    this.projectId=this.selectedprojectIds
    this.getProjectReport();
  }

  
  fetchProjects() {
    this.projectName = this.projectName || '';
    this.projectService
      .getAllProjects(this.projectName, 0, 1000, 'Y', this.user.organizationId)
      .subscribe({
        next: (projects) => {
          this.projects = projects.records;
          if (this.selectedprojectIds?.length > 0) {
            this.sortProject(this.projects, this.selectedprojectIds)
            console.log(this.projects)
            // const projectId = this.projects.map(p => p.projectId)
            // console.log(this.projects)
            // if (projectId.length == this.selectedprojectIds.length) {
            //   console.log(this.projectId)
            //   this.projectId.push(0)
            // }
          }

        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  onProjectSelect(project: any, event: any) {
    //this.allProjectChecked=false;
    this.project.patchValue('')
    console.log(event);

    const selectedProject = project.projectId;
    console.log('selected project id' + selectedProject);

    // Get the sub-source ID
   console.log(this.selectedprojectIds)
    if (event.checked) {
      if (!this.selectedprojectIds) {
        this.selectedprojectIds = [];
      }
      this.selectedprojectIds?.push(selectedProject);
      this.displayProjectNames()
      // alert(this.selectedSubSourcesIds); // Add to selected IDs
    } else {
      // Remove sub-source ID from selected IDs
      this.selectedprojectIds = this.selectedprojectIds?.filter(
        (id: any) => id !== selectedProject
      );
      console.log(this.selectedprojectIds)
      if (this.selectedprojectIds?.length > 0) {
        this.displayProjectNames()
      }
      else if (this.selectedprojectIds?.length == 0) {
        this.project.patchValue('');
      }
}
   // this.projectId = this.selectedprojectIds
    console.log(this.projectId)
  }
  searchProject(event: any) {
    //this.isExportExcel = false;
    if (event.target.value.length >= 3) {
      this.projectName = event.target.value;
      this.fetchProjects();
    } else {
      this.projectName = '';
      this.fetchProjects();
    }
  }
}
