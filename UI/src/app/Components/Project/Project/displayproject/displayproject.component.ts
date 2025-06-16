import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { IProject, Project, ProjectDto } from 'src/app/Models/Project/project';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { ProjectComponent } from '../project/project.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { User } from 'src/app/Models/User/User';

@Component({
  selector: 'app-displayproject',
  templateUrl: './displayproject.component.html',
  styleUrls: ['./displayproject.component.css'],
})
export class DisplayprojectComponent implements OnInit {
  projectName: string = '';
  destroy$ = new Subject<void>();
  projectData: ProjectDto[] = [];
  project: IProject = new Project();
  user: User = new User();
  organizationId: number = 0;

  displayedColumns: string[] = [
    'rowNumber',
    'projectName',
    'projectCode',
    'projectType',
    'projectStatus',
    'status',
    'actions',
  ];

  pageSizeOptions = pageSizeOptions;

  pageSize: number = 15;
  pageIndex: number = 0;
  totalPages: number = 0;

  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.refreshProject();
  }

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private dialog: MatDialog,
    private commanService: CommanService
  ) {}

  //getting logged in user data from local storage
  private setUserFromLocalStorage(): void {
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      this.user = user;
      this.getProjects();
    }
  }

  onSearchProject(projectName: string) {
    console.log(projectName);
    this.projectName = projectName;
    if (this.projectName.length > 3 || this.projectName.length == 0) {
      this.getProjects();
    }
  }

  //refresh project after inactive project
  refreshProject() {
    this.projectService.refresh.subscribe(() => {
      this.getProjects();
    });
  }

  //get all projects
  getProjects() {
    this.projectService
      .getAllProjects(
        this.projectName,
        this.pageIndex,
        this.pageSize,
        '',
        this.user.organizationId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projectData) => {
          console.log(projectData);
          this.projectData = projectData.records;
          this.totalPages = projectData.totalRecords;
        },
        error: (error) => {
          console.log(error.error);
        },
      });
  }

  addProject() {
    this.router.navigate(['layout/project']);
  }

  //edit project
  editProject(project: any) {
    this.getProjectDataById(project.projectId);
  }

  getProjectDataById(projectId: number) {
    this.projectService
      .getProjectById(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projectData) => {
          this.project = projectData;
          this.router.navigate(['layout/project'], {
            state: { project: projectData },
          });
        },
        error: (error) => {
          console.log(error.error);
        },
      });
  }

  //open confirm dialog
  openConfirmDialog(projectId: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Project' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteProject(projectId);
        }
      }
    );
  }

  deleteProject(menuId: number) {
    this.projectService
      .deleteProject(menuId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.getProjects();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  //pagination change
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getProjects();
  }

  //view project details sending data to dialog
  viewProject(projectData: any) {
    this.projectService
      .getProjectById(projectData.projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projectData) => {
          this.project = projectData;
          console.log(this.project);
          const dialogRef = this.dialog.open(ProjectComponent, {
            data: { send: true, projectData: this.project },
            width: '60%',
            height: '100%',
          });

          dialogRef.componentInstance.onClose.subscribe(() => {
            dialogRef.close();
          });
        },
        error: (error) => {
          console.log(error.error);
        },
      });
  }
}
