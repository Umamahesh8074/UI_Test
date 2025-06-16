import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { IndentItemDto } from 'src/app/Models/Procurement/indent';
import { IIndentDto } from 'src/app/Models/Procurement/indentDto';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { IndentService } from 'src/app/Services/ProcurementService/Indent/indent.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-displayindent',
  templateUrl: './display-indent.component.html',
  styleUrls: ['./display-indent.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DisplayindentComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  indentsArray: IIndentDto[] = [];
  indents: IndentItemDto = new IndentItemDto();
  loggedInUserId: number = 0;
  organizationId: number = 0;

  //project auto complete fields
  projectId: number = 0;
  projectName: string = '';
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);

  formData!: FormGroup;
  dateRange: any = '';
  customStartDate: any = '';
  customEndDate: any = '';
  selectedStatus: string = 'All';

  //documents pagination
  documentTotalItems: number = TOTAL_ITEMS;
  documentPageSize: number = 15;
  documentPageIndex: number = PAGE_INDEX;
  documentPageSizeOptions = pageSizeOptions;
  documentType: string = '';
  documents: any;
  noDocuments: boolean = true;
  openDialog: boolean | undefined;
  isIndentDocuments: boolean = true;

  indentCode: string = '';
  stageOwner: string = '';
  selectedProject: IProject = new Project();
  indentId: number = 0;
  displayedColumnsDocuments = ['fileName', 'createdDate', 'status', 'actions'];

  displayedColumns: string[] = [
    'rowNumber',
    'code',
    'createdDate',
    'modifiedDate',
    'project',
    'requiredDate',
    'createdBy',
    'currentStageOwner',
    'indentStatus',
    'indentType',
    'actions',
  ];

  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.initForm();
    this.getDataFromState();
    this.getAllIndents();
    this.fetchProjects();
    this.indentService.refreshRequired.subscribe(() => {
      this.getAllIndents();
    });
  }

  constructor(
    private indentService: IndentService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private commonService: CommanService,
    private projectService: ProjectService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService
  ) {}

  getDataFromState() {
    const { displayPageData } = history.state;
    if (displayPageData) {
      const displayStatePageData = displayPageData;
      this.selectedProject = displayStatePageData.selectedProject;
      this.stageOwner = displayStatePageData.searchedStageOwner;
      this.indentCode = displayStatePageData.searchedIndentCode;
      this.pageSize = displayStatePageData.pageSize;
      this.pageIndex = displayStatePageData.pageIndex;
      this.customStartDate = displayStatePageData.customStartDate;
      this.customEndDate = displayStatePageData.customEndDate;
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

  onSearch(indentCode: string) {
    if (
      indentCode.length > searchTextLength ||
      indentCode.length === searchTextZero
    ) {
      this.indentCode = indentCode;
      this.pageIndex = PAGE_INDEX;
      this.getAllIndents();
    }
  }

  onSearchStageOwner(stageOwner: string) {
    if (
      stageOwner.length > searchTextLength ||
      stageOwner.length === searchTextZero
    ) {
      this.stageOwner = stageOwner;
      this.pageIndex = PAGE_INDEX;
      this.getAllIndents();
    }
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllIndents();
  }

  //getting user from local storage to set organization id
  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.loggedInUserId = user.userId;
      this.organizationId = user.organizationId;
    }
  }

  getAllIndents() {
    this.showLoading();
    this.indentService
      .getAllIndent(
        this.indentCode,
        this.pageIndex,
        this.pageSize,
        this.customStartDate,
        this.customEndDate,
        this.projectId,
        this.stageOwner,
        this.loggedInUserId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (indentResponse) => {
          this.indentsArray = indentResponse.records;
          if (this.paginator) {
            this.paginator.pageIndex = this.pageIndex;
            this.paginator.pageSize = this.pageSize;
          }
          this.totalItems = indentResponse.totalRecords;
          this.hideLoading();
        },
        error: (error) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }

  ///opening confirm dialog
  openConfirmDialog(indentId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'Delect  Indent' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteIndent(indentId);
        }
      }
    );
  }

  //delete indent by indent id
  deleteIndent(indentId: number) {
    this.indentService
      .deleteIndent(indentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (indentData) => {
          console.log(indentData);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  //adding indent
  addIndent() {
    this.router.navigate(['./addindent'], {
      relativeTo: this.route.parent,
      state: {
        isAdding: true,
        status: 'PendingIndent',
        displayPage: {
          selectedProject: this.selectedProject,
          searchedIndentCode: this.indentCode,
          searchedStageOwner: this.stageOwner,
          customStartDate: this.customStartDate,
          customEndDate: this.customEndDate,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      },
    });
  }

  editIndent(indentData: any) {
    console.log(indentData.indentId);
    this.showLoading();
    this.indentService
      .getIndentItemsById(indentData.indentId)
      .subscribe((response) => {
        this.indents = response;
        this.router.navigate(['./addindent'], {
          relativeTo: this.route.parent,
          state: {
            indent: this.indents,
            isAdding: false,
            indentType: 'Update',
            status: 'PendingIndent',
            displayPage: {
              selectedProject: this.selectedProject,
              searchedIndentCode: this.indentCode,
              searchedStageOwner: this.stageOwner,
              customStartDate: this.customStartDate,
              customEndDate: this.customEndDate,
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
            },
          },
        });
        this.hideLoading();
      });
  }

  gotoIndentItems(indentData: any) {
    this.router.navigate(['layout/procurement/indent-details'], {
      state: {
        indentData: indentData,
        status: 'PendingIndent',
        displayPage: {
          selectedProject: this.selectedProject,
          searchedIndentCode: this.indentCode,
          searchedStageOwner: this.stageOwner,
          customStartDate: this.customStartDate,
          customEndDate: this.customEndDate,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      },
    });
  }

  sendForApproval(indent: IIndentDto) {
    console.log(indent.indentId);
    this.indentService
      .moveIndentToWorkFlow(indent.indentId, this.loggedInUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          Swal.fire('Success', response.message, 'success');
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  // //fetch projects based on organization id
  // fetchProjects() {
  //   this.projectService
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
    this.projectService
      .getProjectsForPO(
        this.projectName,
        this.organizationId,
        this.loggedInUserId
      )
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
  displayProject(project: IProject) {
    return project && project.displayProjectName
      ? project.displayProjectName
      : '';
  }
  onProjectSelect(project: any) {
    this.projectId = project.option.value.projectId;
    this.selectedProject = project.option.value;
    this.getAllIndents();
  }
  searchProject(project: any) {
    const query = project.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.projectName = query;
      this.fetchProjects();
    }
    if (query.length === searchTextZero) {
      this.projectId = 0;
      this.getAllIndents();
    }
  }

  onDateChange() {
    this.pageIndex = 0;
    this.paginator.firstPage();
    const startDate = this.formData.get('customStartDate')?.value;
    const endDate = this.formData.get('customEndDate')?.value;
    if (startDate !== null && endDate !== null) {
      this.dateRange = '';
      this.getAllIndents();
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
          this.getAllIndents();
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
    this.getAllIndents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    this.stageOwner = '';
    this.customStartDate = null;
    this.customEndDate = null;
    this.selectedProject = new Project();
    this.getAllIndents();
  }

  viewDownLoads(indent: any, documentType: string) {
    this.documentType = documentType;
    let indentId;

    if (documentType == 'INDENT_DOCUMENTS') {
      this.isIndentDocuments = true;
    } else {
      this.isIndentDocuments = false;
    }
    if (indent.indentId) {
      this.indentId = indent.indentId;
      indentId = indent.indentId;
    } else {
      this.indentId = indent.indentId;
      indentId = indent.indentId;
    }

    if (indentId) {
      this.getDocumentsBasedOnId(indentId);
    }
  }

  getDocumentsBasedOnId(indentId: number) {
    const documentType = this.documentType;
    this.commonService
      .getDocumentById(
        indentId,
        documentType,
        this.documentPageIndex,
        this.documentPageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.documents = response.records;
          this.documentTotalItems = response.totalRecords;
          if (this.documents && this.documents.length > 0) {
            this.openDialog = true;
            this.noDocuments = false;
          } else {
            this.noDocuments = true;
            this.openDialog = true;
          }
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  downloadDocument(document: any) {
    const documentUrl = document;
    const decodedUrl = decodeURIComponent(documentUrl);
    let fileName = '';
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] ?? '';
    } else {
      fileName = 'Indent';
    }
    this.commonService
      .downLoadDoc(document)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          this.downloadFile(response, fileName);
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  private downloadFile(data: Blob, filename: string): void {
    const url = window.URL.createObjectURL(data);
    // window.open(url);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    this.onClose();
  }

  onDocumentPageChange(event: any) {
    this.documentPageSize = event.pageSize;
    this.documentPageIndex = event.pageIndex;
    this.getDocumentsBasedOnId(this.indentId);
  }

  viewDocument(document: any) {
    const documentUrl = document;
    const decodedUrl = decodeURIComponent(documentUrl);
    let fileName = '';
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] ?? '';
    } else {
      fileName = 'Work_Order';
    }
    this.commonService
      .downLoadDoc(document)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          this.viewFile(response, fileName);
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  private viewFile(data: Blob, filename: string): void {
    const url = window.URL.createObjectURL(data);
    window.open(url);
  }

  onClose() {
    this.openDialog = false;
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
  getStatusClass(status: string): string {
    console.log(status);
    if (!status) {
      return 'approved-column';
    }
    switch (status.toLowerCase()) {
      case 'approved':
        return 'approved-column';
      case 'rejected':
        return 'rejected-column';
      case 'rework':
        return 'rework-column';
      case 'reworking':
        return 'rework-column';
      case 'pending':
        return 'pending-column';
      case 'rework approval pending':
        return 'rework-column';
      case 'new indent':
        return 'new-column';
      default:
        return 'approved-column';
    }
  }
}
