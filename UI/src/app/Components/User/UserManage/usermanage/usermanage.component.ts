import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import {
  IProjectSalesTeam,
  IProjectSalesTeamDto,
  ProjectSalesTeam,
} from 'src/app/Models/Presales/projectSalesTeam';
import { IProject } from 'src/app/Models/Project/project';
import {
  IQrgenerator,
  Qrgenerator,
} from 'src/app/Models/Qrgenerator/qrgenerator';
import { IUser, User } from 'src/app/Models/User/User';
import { IUserDto } from 'src/app/Models/User/UserDto';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { QrgeneratorService } from 'src/app/Services/Qrgenerator/qrgenerator.service';
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';

@Component({
  selector: 'app-usermanage',
  templateUrl: './usermanage.component.html',
  styleUrls: ['./usermanage.component.css'],
})
export class UsermanageComponent implements OnInit {
  constructor(
    private usermanageService: UsermanageService,
    private projectService: ProjectService,
    private builder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private qrgeneratorService: QrgeneratorService,
    private commanService: CommanService
  ) {}

  private destroy$ = new Subject<void>();
  projects: IProject[] = [];
  referenceId: any;
  projectId: any;
  userId: any;
  formData!: FormGroup;
  userManage: IProjectSalesTeam = new ProjectSalesTeam();
  organizationId: any;
  isAdding: boolean = true;
  project: any = new FormControl([] as IProject[], Validators.required);
  user: any = new FormControl([] as IUser[], Validators.required);
  users: IUserDto[] = [];
  userName: any = '';
  referenceKey: any;
  projectObj: any;
  userObj: any;
  qrName: any;
  qrgeneratorData: any = [];
  qrGenerator = new FormControl([] as IQrgenerator[]);

  userData: User = new User();
  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.userManage = history.state.userManage || new ProjectSalesTeam();
    console.log(history.state.organizationId);
    this.organizationId = history.state.organizationId;
    this.referenceKey = history.state.referenceKey;
    this.getProjects(this.projectName);
    this.getUsers(this.userName);
    if (history.state.userManage != null && this.userManage !== undefined) {
      this.isAdding = false;
      console.log(this.userManage);
      this.getUserById(this.userManage.userId);
      this.getProjectById(this.userManage.referenceId);
      //this.patchFormData();
    }
  }

  //getting logged in user data from local storage
  private setUserFromLocalStorage(): void {
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      this.userData = user;
    }
  }

  patchFormData() {
    console.log(this.userManage);
    this.project.patchValue(this.projectObj);
    this.user.patchValue(this.userObj);
    console.log(this.project.value);
    console.log(this.user.value);
  }
  projectName: any = '';

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }
  displayUser(user: IUser): string {
    return user && user.userName ? user.userName : '';
  }

  onProjectSelect(event: any) {
    console.log(event.option.value);
    this.projectId = event.option.value.projectId;
    this.referenceId = this.projectId;
    if (this.referenceKey == 'SPP') {
      this.userManage.referenceId = this.projectId;
    }
    if (this.referenceKey == 'SP') {
      this.getQrgenerator();
    }
    this.userManage.projectId = this.projectId;
  }

  getProjects(projectName: any) {
    this.projectName = projectName;
    this.projectService
      .getAllProjects(projectName, 0, 100, 'Y',this.userData.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projectData) => {
          this.projects = projectData.records;
        },
        error: (error) => {
          console.log(error.error);
        },
      });
  }

  save() {
    if (this.isAdding) {
      this.usermanageService
        .save(this.userManage, this.referenceKey)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp: any) => {
            this.router.navigate(['layout/usermanage/' + this.referenceKey]);
          },
          error: (err) => {
            console.error('Error adding user manage', err);
          },
        });
    } else {
      //updating workflowstage
      this.usermanageService
        .update(this.userManage, this.referenceKey)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['layout/usermanage/' + this.referenceKey]);
          },
          error: (err: any) => {
            console.error('Error updating Workflowstage', err);
          },
        });
    }
  }

  getUser(userName: any) {
    this.userName = userName;
  }

  onUserSelect(event: any) {
    console.log(event.option.value);
    this.userId = event.option.value.userId;
    this.userManage.userId = this.userId;
  }

  getUsers(userName: string) {
    this.userName = userName;
    this.userService
      .getAllUsersByName(this.userName, 0, 100, this.organizationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userData) => {
          this.users = userData.records;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }
  goBack() {
    this.router.navigate(['layout/usermanage/' + this.referenceKey]);
  }
  clearForm() {
    this.project.reset();
  }

  getUserById(id: any) {
    this.userService
      .getUserById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userData) => {
          this.userObj = userData;
          this.user.patchValue(userData);
        },
        error: (error) => {
          console.error('Error fetching user:', error);
        },
      });
  }

  getProjectById(id: any) {
    this.projectService
      .getProjectById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projectData) => {
          this.projectObj = projectData;
          this.project.patchValue(projectData);
        },
        error: (error) => {
          console.error('Error fetching project:', error);
        },
      });
  }
  onQrGeneratorSerach(qrName: any) {
    this.qrName = qrName;
    this.getQrgenerator();
  }

  getQrgenerator() {
    this.qrgeneratorService
      .getAllQrgenerator(
        '',
        0,
        1000,
        this.organizationId,
        this.qrName,
        this.projectId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (qrgeneratorData) => {
          this.qrgeneratorData = qrgeneratorData.records;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  onQrGeneratorSelect(event: any) {
    this.referenceId = event.option.value.id;
    this.userManage.referenceId = event.option.value.id;
  }
  displayQrName(qrgenerator: Qrgenerator): string {
    return qrgenerator && qrgenerator.location ? qrgenerator.location : '';
  }
}
