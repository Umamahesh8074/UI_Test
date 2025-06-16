import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { IProject } from 'src/app/Models/Project/project';
import { IProjectMembers } from 'src/app/Models/Project/ProjectMembersDto';
import { User } from 'src/app/Models/User/User';
import { IUserDto } from 'src/app/Models/User/UserDto';
import { LeadsCommonService } from 'src/app/Services/CommanService/leads-common.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { SaleteamService } from 'src/app/Services/Presales/SalesTeam/saleteam.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';

@Component({
  selector: 'app-display-team-mates',
  templateUrl: './display-team-mates.component.html',
  styleUrls: ['./display-team-mates.component.css'],
})
export class DisplayTeamMatesComponent {
  user: User = new User();
  userId: number = 0;
  hideTeamNameHeader = true;
  selectedProject: string | null = null;
  selectedTeam: string | null = null;
  fetchedProjects: {
    [projectName: string]: { [teamName: string]: IProjectMembers[] };
  } = {};
  projectTeams: any;
  displayProjects = ['projectName', 'teamDetails'];
  displayTeam = ['teamName', 'userDetails'];
  projects: any = [];
  showMembers = true;
  displayUsers = ['userName', 'phoneNumber', 'email'];
  projectName: any = '';
  projectId: any = '';
  project: any = new FormControl([] as IProject[]);
  userListByManagerId: any = [];
  userName: any;
  selectedUsersControl = new FormControl([]);
  selectedUsers: any;
  userControl: any = new FormControl([] as IUserDto[]);
  public filteredUsers: any = [];
  roleName: any;
  memberId: any = '';
  constructor(
    private userservice: UserService,
    private salesTeamService: SaleteamService,
    private projectService: ProjectService,
    private userService: UserService,
    private leadCommonService: LeadsCommonService
  ) {}

  destroy$ = new Subject<void>();
  noTeams: boolean = false;

  ngOnInit() {
    this.initForm();
    const user = localStorage.getItem('user');
    if (user) {
      console.log('user');
      this.user = JSON.parse(user);
      this.userId = this.user.userId;
      this.roleName = this.user.roleName;
      if (this.roleName) {
        const roles = [
          'presales manager',
          'sales manager',
          'cto',
          'sales head',
        ];
        //this.showDropdown = roles.includes(this.roleName.toLowerCase());
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
      if (this.user.roleName.includes('sales head') || this.user.roleName.includes('presales manager') ) {
        this.getProjects(this.projectName);
      } else {
        this.fetchSalesTeam();
      }
    }
    this.getTeamMates();
  }
  private initForm(): void {}

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

  getTeamMates() {
    this.leadCommonService.showLoading();
    this.userservice
      .getTeamMembers(this.userId, this.projectId, this.memberId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (members) => {
          this.projectTeams = members;
          this.leadCommonService.hideLoading();
        },
        error: (error) => {
          console.log(error);
          this.leadCommonService.hideLoading();
        },
      });
  }

  fetchSalesTeam(projectSearchText?: string) {
    this.salesTeamService
      .fetchAllSaleTeam('', 0, 10, '', this.user.userId, this.projectName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (salesTeam) => {
          console.log(salesTeam);
          this.projects = salesTeam.records;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : 'All';
  }

  onProjectSelect(event: any) {
    console.log(event);
    this.projectId = event?.option.value?.projectId;
    console.log(this.projectId);
    this.getTeamMates();
  }
  // Get all projects
  getProjects(projectName: any) {
    this.projectService
      .getProjectsByOrgIdWithProjectFilter(
        this.user.organizationId,
        projectName
      )
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
  onProjectSerach(projectSearchText: string) {
    this.projectName = projectSearchText || '';
    if (this.user.roleName.includes('sales head') || this.user.roleName.includes('presales manager') ) {
      this.getProjects(this.projectName);
    } else {
      this.fetchSalesTeam();
    }
  }

  getAllUserNames() {
    this.userService
      .getUserByManagerId(this.user.userId, this.userName)
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

  displayUser(user: User): string {
    return user && user.userName ? user.userName : 'All';
  }
  onUserSelete(event: any) {
    console.log(event?.option.value);
    this.memberId = event?.option.value?.userId;
    this.getTeamMates();
    //  this.teamUserId = event?.option.value?.userId;
    //   this.getProjectReport();
  }

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
        //this.showDropdown = roles.includes(this.roleName.toLowerCase());
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
        this.user.organizationId,
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
}
