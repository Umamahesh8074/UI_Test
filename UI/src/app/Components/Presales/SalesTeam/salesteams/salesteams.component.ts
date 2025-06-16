import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { COMMON_STATUS } from 'src/app/Constants/CommanConstants/Comman';
import { ISalesTeam, SalesTeam } from 'src/app/Models/Presales/salesteam';
import { IProject } from 'src/app/Models/Project/project';
import { IUser, User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { SaleteamService } from 'src/app/Services/Presales/SalesTeam/saleteam.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';

@Component({
  selector: 'app-salesteams',
  templateUrl: './salesteams.component.html',
  styleUrls: ['./salesteams.component.css'],
})
export class SalesteamsComponent implements OnInit {
  salesTeam: ISalesTeam = new SalesTeam();
  formData!: FormGroup;
  private destroy$ = new Subject<void>();
  statuses: any = [];
  projects: any = [];
  isAdding: any = true;
  projectId: any;
  project: any = new FormControl([] as IProject[], Validators.required);
  projectName: any = '';
  organizationId: any;
  users: any = [];
  user: any = new FormControl([] as IUser[], Validators.required);
  userName: any = '';
  userId: any;
  constructor(
    private router: Router,
    private builder: FormBuilder,
    private projectService: ProjectService,
    private commanService: CommanService,
    private salesTeamService: SaleteamService,
    private toastrService: ToastrService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getCommonStatuses();
    this.salesTeam = history.state.saleTeam;
    this.organizationId = history.state.organizationId;
    this.fetchProjects();
    this.fetchUsers();
    this.initializeForm();
    if (history.state.saleTeam != null && this.salesTeam !== undefined) {
      this.isAdding = false;
      this.patchFormData();
      if (
        this.salesTeam.projectId !== undefined &&
        this.salesTeam.projectId !== null
      ) {
        this.fetchProject(this.salesTeam.projectId);
      }
      if (
        this.salesTeam.teamHeadId !== undefined &&
        this.salesTeam.teamHeadId !== null
      ) {
        this.fetchUser(this.salesTeam.teamHeadId);
      }
    }
  }

  fetchProject(projectId: number) {
    this.projectService.getProjectById(projectId).subscribe({
      next: (project) => {
        console.log(project);
        this.project.setValue(project);
      },
      error: (error) => {
        console.error('Error fetching project:', error);
      },
    });
  }

  initializeForm() {
    this.formData = this.builder.group({
      id: [],
      name: ['', Validators.required],
      status: ['A', Validators.required],
      isLeadAssigned: ['No'],
      projectId: [, Validators.required],
      teamHeadId: [, Validators.required],
    });
  }

  patchFormData() {
    this.formData.patchValue(this.salesTeam);
  }
  private handleSuccessResponse(response: any): void {
    console.log('Success');

    this.toastrService.success('', 'Success', {
      timeOut: 2000, // Set success timeout
    });
    this.gotoSalesTeam();
  }

  private handleErrorResponse(error: any): void {
    console.error('Error saving/updating lead:', 'Failed');
    this.toastrService.error('Failed', 'failed', {
      timeOut: 3000, // Set success timeout
    });
    //this.gotoSalesTeam();
  }
  onSubmit() {
    console.log('sales team saving...');
    console.log(this.formData.value);
    if (this.formData.valid) {
      if (this.isAdding) {
        this.salesTeamService.addSalesTeam(this.formData.value).subscribe({
          next: (response) => this.handleSuccessResponse(response),
          error: (error) => {
            console.log(error.message);
            this.handleErrorResponse(error);
          },
        });
      } else {
        this.salesTeamService.updateSalesTeam(this.formData.value).subscribe({
          next: (response) => this.handleSuccessResponse(response),
          error: (error) => {
            console.log(error.message);
            this.handleErrorResponse(error);
          },
        });
      }
    }
  }

  getCommonStatuses() {
    this.commanService.fetchCommonReferenceTypes(COMMON_STATUS).subscribe({
      next: (data) => {
        this.statuses = data;
        //this.setDefaultStatus();
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  clearForm() {
    this.formData.reset();
    this.project.reset();
    this.user.reset();
  }

  gotoSalesTeam() {
    this.router.navigate(['layout/presales/salesteam']);
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }
  displayUser(user: IUser): string {
    return user && user.userName ? user.userName : '';
  }
  onProjectSelect(event: any) {
    console.log(event.option.value);
    this.projectId = event.option.value.projectId;
    this.formData.patchValue({ projectId: this.projectId });
  }
  onUserSelect(event: any) {
    console.log(event.option.value);
    this.userId = event.option.value.userId;
    this.formData.patchValue({ teamHeadId: this.userId });
  }
  searchProject(event: any) {
    if (event.target.value.length >= 3) {
      console.log(event.target.value);
      this.projectName = event.target.value;
      this.fetchProjects();
    } else {
      this.projectName = '';
      this.fetchProjects();
    }
  }
  searchUser(event: any) {
    if (event.target.value.length >= 3) {
      console.log(event.target.value);
      this.userName = event.target.value;
      this.fetchUsers();
    } else {
      this.userName = '';
      this.fetchUsers();
    }
  }
  fetchProjects() {
    this.projectService
      .getAllProjects(this.projectName, 0, 1000, 'Y',this.organizationId)
      .subscribe({
        next: (data) => {
          this.projects = data.records;
        },
        error: (error) => {
          console.error(error?.message);
        },
      });
  }

  fetchUser(id: any) {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        console.log(user);
        this.user.setValue(user);
      },
      error: (error) => {
        console.error('Error fetching project:', error);
      },
    });
  }

  fetchUsers() {
    this.userService
      .getAllUsersByName(this.userName, 0, 1000, this.organizationId)
      .subscribe({
        next: (data) => {
          this.users = data.records;
        },
        error: (error) => {
          console.error(error?.message);
        },
      });
  }
}
