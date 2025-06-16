import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { ApprovalIndentDto } from 'src/app/Models/Procurement/approvals';
import { ReusableComponent } from 'src/app/Comman-Components/base-component/base.component';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { IndentService } from 'src/app/Services/ProcurementService/Indent/indent.service';
import {
  PAGE_INDEX,
  searchTextLength,
  searchTextZero,
} from 'src/app/Constants/CommanConstants/Comman';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { IProject, Project } from 'src/app/Models/Project/project';
import { FormBuilder, FormControl } from '@angular/forms';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { MatPaginator } from '@angular/material/paginator';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-displayquotation',
  templateUrl: './display-quotation.component.html',
  styleUrls: ['./display-quotation.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DisplayquotationComponent
  extends ReusableComponent
  implements OnInit
{
  approvedIndents: ApprovalIndentDto[] = [];
  quotationName: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  projectId: number = 0;
  projectName: string = '';
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);
  dateRange: any = '';
  customStartDate: any = '';
  customEndDate: any = '';
  createdUserName: string = '';
  selectedProject: IProject = new Project();
  indentCode: string = '';

  displayedColumns: string[] = [
    'rowNumber',
    'projecName',
    'indentCode',
    'createdBy',
    'requiredDate',
    'createdDate',
  ];

  customHeaderNames = {
    rowNumber: 'S.No',
    projectName: 'Project Name',
    createdBy: 'Created By',
    indentCode: 'Indent Code',
    requiredDate: 'Required Date',
    createdDate: 'Created Date',
  };

  actionButtons: any[] = [
    { label: 'Quotation', icon: 'rule', action: 'approve' },
    { label: 'Add Quotation', icon: 'add', action: 'add' },
  ];

  pipes = {
    requiredDate: 'date',
    createdDate: 'date',
  };

  ngOnInit(): void {
    super.setUserFromLocalStorage();
    this.initForm();
    this.getDataFromState();
    this.getApprovedIndents();
    this.fetchProjects();
  }

  constructor(
    router: Router,
    private indentService: IndentService,
    route: ActivatedRoute,
    commanService: CommanService,
    private projectServie: ProjectService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder
  ) {
    super(commanService, router, route);
  }

  getDataFromState() {
    const { displayPageData, pageDataFromCreateQuotation } = history.state;
    if (displayPageData) {
      const displayStatePageData = displayPageData;
      this.selectedProject = displayStatePageData.selectedProject;
      this.indentCode = displayStatePageData.searchedIndentCode;
      this.pageSize = displayStatePageData.pageSize;
      this.pageIndex = displayStatePageData.pageIndex;
      this.customStartDate = displayStatePageData.customStartDate;
      this.customEndDate = displayStatePageData.customEndDate;
      this.createdUserName = displayStatePageData.searchedCreatedUserName;
      this.patchFormValues();
    }
    if (pageDataFromCreateQuotation) {
      const displayStatePageData = pageDataFromCreateQuotation;
      this.selectedProject = displayStatePageData.selectedProject;
      this.indentCode = displayStatePageData.searchedIndentCode;
      this.pageSize = displayStatePageData.pageSize;
      this.pageIndex = displayStatePageData.pageIndex;
      this.customStartDate = displayStatePageData.customStartDate;
      this.customEndDate = displayStatePageData.customEndDate;
      this.createdUserName = displayStatePageData.searchedCreatedUserName;
      this.patchFormValues();
    }
  }

  patchFormValues() {
    if (this.selectedProject) {
      this.project.patchValue(this.selectedProject);
      this.projectId = this.selectedProject.projectId;
    }
    if (this.customStartDate) {
      this.formData.get('customStartDate')?.patchValue(this.customStartDate);
    }
    if (this.customEndDate) {
      this.formData.get('customEndDate')?.patchValue(this.customEndDate);
    }
  }

  getApprovedIndents() {
    this.showLoading();
    this.indentService
      .getApprovedIndents(
        this.pageIndex,
        this.pageSize,
        this.indentCode,
        this.projectId,
        this.customStartDate,
        this.customEndDate,
        this.createdUserName,
        this.userId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.approvedIndents = response.records;
          if (this.paginator) {
            this.paginator.pageIndex = this.pageIndex;
            this.paginator.pageSize = this.pageSize;
          }
          this.totalItems = response.totalRecords;
          this.hideLoading();
        },
        error: (error: Error) => {
          console.log(error);
          this.hideLoading();
        },
      });
  }

  onActionClicked(event: any): void {
    const { action, row } = event;
    if (action === 'approve') {
      this.gotoIndentItems(row);
    } else if (action === 'add') {
      this.createQuotation(row);
    }
  }
  gotoIndentItems(row: any) {
    this.router.navigate(['./indent-details'], {
      relativeTo: this.route.parent,
      state: {
        indentData: row,
        status: 'PendingQuotation',
        displayPage: {
          selectedProject: this.selectedProject,
          searchedIndentCode: this.indentCode,
          searchedCreatedUserName: this.createdUserName,
          customStartDate: this.customStartDate,
          customEndDate: this.customEndDate,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      },
    });
  }

  createQuotation(row: any) {
    this.router.navigate(['./createquotation'], {
      relativeTo: this.route.parent,
      state: {
        quotation: row,
        routeStatus: 'pending',
        displayPage: {
          selectedProject: this.selectedProject,
          searchedIndentCode: this.indentCode,
          searchedCreatedUserName: this.createdUserName,
          customStartDate: this.customStartDate,
          customEndDate: this.customEndDate,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      },
    });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getApprovedIndents();
  }

  onSearch(indentCode: string) {
    if (
      indentCode.length > searchTextLength ||
      indentCode.length === searchTextZero
    ) {
      this.indentCode = indentCode;
      this.pageIndex = PAGE_INDEX;
      this.getApprovedIndents();
    }
  }
  onProjectSelect(event: any) {
    this.projectId = event.option.value.projectId;
    this.selectedProject = event.option.value;
    this.formData.patchValue({ projectId: this.projectId });
    this.getApprovedIndents();
  }

  displayProject(project: any) {
    if (typeof project === 'number' && project != undefined) {
      const pro = this.projects.find((p) => p.projectId === project);
      return pro && pro.displayProjectName;
    } else if (project != undefined) {
      return project && project.displayProjectName
        ? project.displayProjectName
        : '';
    }
  }

  searchProject(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.projectName = query;
      this.fetchProjects();
    } else if (query.length == 0) {
      this.projectName = '';
      this.fetchProjects();
    }
  }

  // fetchProjects() {
  //   this.projectServie
  //     .getProjectsByOrgIdWithProjectFilter(
  //       this.organizationId,
  //       '',
  //       this.projectName
  //     )
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (projects) => {
  //         const allOption = new Project();
  //         allOption.projectId = 0;
  //         allOption.displayProjectName = 'All';
  //         this.projects = [allOption, ...projects];
  //       },
  //       error: (error: Error) => {
  //         console.error('Error fetching projects:', error);
  //       },
  //     });
  // }

  fetchProjects() {
    this.projectServie
      .getProjectsForPO(this.projectName, this.organizationId, this.userId)
      .subscribe({
        next: (projects) => {
          const allOption = new Project();
          allOption.projectId = 0;
          allOption.displayProjectName = 'All';
          this.projects = [allOption, ...projects];
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  get projectIdControl(): FormControl {
    return this.formData.get('projectId') as FormControl;
  }

  onSearchCreatedBy(createdUserName: string) {
    if (
      createdUserName.length > searchTextLength ||
      createdUserName.length === searchTextZero
    ) {
      this.createdUserName = createdUserName;
      this.pageIndex = PAGE_INDEX;
      this.getApprovedIndents();
    }
  }

  onDateChange() {
    this.pageIndex = 0;
    const startDate = this.formData.get('customStartDate')?.value;
    const endDate = this.formData.get('customEndDate')?.value;
    if (startDate !== null && endDate !== null) {
      this.dateRange = '';
      this.getApprovedIndents();
    } else {
      this.dateRange = 0;
    }
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
          this.customStartDate = startDate;
          this.customEndDate = endDate;
          this.getApprovedIndents();
        }
      });
  }

  formatDateTime(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }

  clearDateRange(): void {
    this.formData.get('customStartDate')?.setValue('');
    this.formData.get('customEndDate')?.setValue('');
    this.customStartDate = '';
    this.customEndDate = '';
    this.getApprovedIndents();
  }

  resetForm() {
    const project = new Project();
    project.projectId = 0;
    project.displayProjectName = 'All';
    this.project.reset(project);
    this.projectId = 0;
    this.formData.reset({
      customStartDate: null,
      customEndDate: null,
    });

    this.indentCode = '';
    this.customStartDate = null;
    this.customEndDate = null;
    this.createdUserName = '';
    this.selectedProject = new Project();
    this.getApprovedIndents();
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
