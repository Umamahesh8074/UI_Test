import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { StageService } from 'src/app/Services/ProjectService/Stage/stage.service';
import {
  TIME_OUT,
  pageSizeOptions,
} from 'src/app/Constants/CommanConstants/Comman';
import { User } from 'src/app/Models/User/User';
import {
  IPaymentPlan,
  PaymentPlan,
  PaymentPlanDto,
} from 'src/app/Models/Project/PaymentPlan';
import { PaymentPlanService } from 'src/app/Services/ProjectService/PaymentPlan/paymentPlan.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { IProject, Project } from 'src/app/Models/Project/project';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-displayPaymentPlan',
  templateUrl: './displayPaymentPlan.component.html',
  styleUrls: ['./displayPaymentPlan.component.css'],
})
export class DisplayPaymentPlanComponent implements OnInit {
  destroy$ = new Subject<void>();
  paymentPlanData: PaymentPlanDto[] = [];
  paymentPlan: IPaymentPlan = new PaymentPlan();
  user: User = new User();
  organizationId: number = 0;
  projectId: number = 0;
  projectName: string = '';
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);
  selectedProject: IProject = new Project();
  pageSizeOptions = pageSizeOptions;

  pageSize: number = 10;
  pageIndex: number = 0;
  totalPages: number = 0;

  displayedColumns: string[] = [
    'id',
    'projectName',
    'blockName',
    'towerName',
    'planName',
    'description',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.getAllPaymentPlans();
    this.fetchProjects();
  }

  constructor(
    private paymentPlanService: PaymentPlanService,
    private projectService: ProjectService,
    private router: Router,
    private commanService: CommanService,
    private toastrService: ToastrService,
    public dialog: MatDialog
  ) {}

  //getting user from local storage to set organization id
  private setUserFromLocalStorage(): void {
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      console.log(user.organizationId);
      this.organizationId = user.organizationId;
    }
  }

  getAllPaymentPlans() {
    this.paymentPlanService
      .getAllPaymentPlans(this.projectName, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paymentPlanData) => {
          console.log(paymentPlanData);
          this.paymentPlanData = paymentPlanData.records;
          this.totalPages = paymentPlanData.totalRecords;
        },
        error: (error) => {
          console.log(error.error);
        },
      });
  }
  handleSuccessResponse(response: any): void {
    console.log(response.message);
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
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
    this.getAllPaymentPlans();
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }

  searchProject(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.projectName = query;
      this.fetchProjects();
      this.getAllPaymentPlans();
    } else if (query.length == 0) {
      this.projectName = '';
      this.fetchProjects();
      this.getAllPaymentPlans();
    }
  }

  openConfirmDialog(id: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: ' delete Payment Plan' },
    });
    dialogRef.componentInstance.isConfirmDelete
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDelete: boolean) => {
        if (isDelete) {
          this.deletePaymentPlan(id);
        }
      });
  }

  editPaymentPlan(paymentPlanData: any) {
    this.fetchPaymentPlanById(paymentPlanData.id);
  }

  fetchPaymentPlanById(id: number) {
    this.paymentPlanService
      .getPaymentPlanById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paymentPlanData) => {
          console.log(paymentPlanData);
          this.router.navigate(['/layout/crm/paymentPlan'], {
            state: {
              paymentPlan: paymentPlanData,
              isAdding: false,
            },
          });
        },
        error: (error) => {
          console.error(error);
          console.error('Error fetching payment plan  by id:', error);
        },
      });
  }

  deletePaymentPlan(id: number) {
    this.paymentPlanService
      .deletePaymentPlan(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.paymentPlanService.refreshRequired.next();
          this.getAllPaymentPlans();
          this.handleSuccessResponse(response);
        },
        error: (error: Error) => {
          console.error('Error deleting payment plan:', error);
        },
      });
  }

  addPaymentPlan() {
    this.router.navigate(['/layout/crm/paymentPlan'], {
      state: { isAdding: true },
    });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllPaymentPlans();
  }
}
