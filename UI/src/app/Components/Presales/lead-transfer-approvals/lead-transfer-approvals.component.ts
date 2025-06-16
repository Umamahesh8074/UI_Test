import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
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
import { Approvals } from 'src/app/Models/Procurement/approvals';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { LeadTransferServiceService } from 'src/app/Services/Presales/Leads/lead-transfer-service.service';
import { ApprovalsService } from 'src/app/Services/ProcurementService/Approvals/approvals.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-lead-transfer-approvals',
  templateUrl: './lead-transfer-approvals.component.html',
  styleUrls: ['./lead-transfer-approvals.component.css'],
})
export class LeadTransferApprovalsComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  approvalsData: Approvals[] = [];
  approvalsName: string = '';
  roleId: number = 0;
  userId: number = 0;
  organizationId: number = 0;

  //pagination
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  indentCode: string = '';
  stageOwnerName: string = '';
  selectedProject: IProject = new Project();

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
  indentId: number = 0;

  displayedColumns: string[] = [
    'opportunityId',
    'customerName',
    'customerPhNo',
    'project',
    'currentSource',
    'currentSubSource',
    'createdDate',
    'leadStatus',
    'requestedSource',
    'requestedSubSource',
    'whoRequested',
    'requestedDate',
    'presentStage',
    'approver',
    'stageStatus',
    'transferStatus',
    'actions',
  ];

  status = [
    {
      id: 1,
      value: 'All',
    },
    {
      id: 4,
      value: 'Approved',
    },
    {
      id: 2,
      value: 'Rejected',
    },
    {
      id: 3,
      value: 'Rework',
    },
  ];
  leadTransferForApprovals: any = [];
  openApprovalDialog: boolean = false;
  selectedApproval: any = null;
  showResultDialog: boolean = false;
  resultDialogTitle: string = '';
  resultDialogMessage: string = '';
  leadTransferForApproval: any;

  constructor(
    private router: Router,
    public dialog: MatDialog,

    private projectService: ProjectService,
    private commonService: CommanService,
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private LeadTransferService: LeadTransferServiceService,
    private approvalsService: ApprovalsService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getDataFromState();
    this.setUserFromLocalStorage();
    this.fetchProjects();
    this.getApprOrRejOrReworkLeadTransferByUserId();
  }

  getDataFromState() {
    const { displayPageData } = history.state;
    if (displayPageData) {
      const displayStatePageData = displayPageData;
      this.selectedProject = displayStatePageData.selectedProject;
      this.stageOwnerName = displayStatePageData.searchedStageOwner;
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

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.userId = user.userId;
      this.organizationId = user.organizationId;
    }
  }

  getApprOrRejOrReworkLeadTransferByUserId() {
    this.showLoading();
    this.LeadTransferService.getLeadTransferApprovalDetails(
      this.userId,
      this.pageIndex,
      this.pageSize,
      this.customStartDate,
      this.customEndDate,
      this.projectId
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (approvalData) => {
          this.leadTransferForApprovals = approvalData.records;
          if (this.paginator) {
            this.paginator.pageIndex = this.pageIndex;
            this.paginator.pageSize = this.pageSize;
          }
          this.totalItems = approvalData.totalRecords;
          this.hideLoading();
        },
        error: (error) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }

  onStatusChange(selectedValue: string) {
    this.selectedStatus = selectedValue;
    this.pageIndex = PAGE_INDEX;
    this.getApprOrRejOrReworkLeadTransferByUserId();
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getApprOrRejOrReworkLeadTransferByUserId();
  }

  displayApprovalDetails(approvals: any) {
    this.selectedApproval = approvals;
    this.leadTransferForApproval = approvals;
    console.log(this.selectedApproval);
    this.openApprovalDialog = true;
  }

  onSearch(indentCode: string) {
    if (
      indentCode.length >= searchTextLength ||
      indentCode.length === searchTextZero
    ) {
      this.indentCode = indentCode;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getApprOrRejOrReworkLeadTransferByUserId();
    }
  }

  onSearchStageOwner(stageOwnerName: string) {
    if (
      stageOwnerName.length >= searchTextLength ||
      stageOwnerName.length === searchTextZero
    ) {
      this.stageOwnerName = stageOwnerName;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getApprOrRejOrReworkLeadTransferByUserId();
    }
  }

  //fetch projects based on organization id
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
  displayProject(project: IProject) {
    return project && project.displayProjectName
      ? project.displayProjectName
      : '';
  }
  onProjectSelect(project: any) {
    this.projectId = project.option.value.projectId;
    this.selectedProject = project.option.value;
    this.getApprOrRejOrReworkLeadTransferByUserId();
  }
  searchProject(project: any) {
    const query = project.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.projectName = query;
      this.fetchProjects();
    }
    if (query.length === searchTextZero) {
      this.projectId = 0;
      this.getApprOrRejOrReworkLeadTransferByUserId();
    }
  }

  onDateChange() {
    this.pageIndex = 0;
    this.paginator.firstPage();
    const startDate = this.formData.get('customStartDate')?.value;
    const endDate = this.formData.get('customEndDate')?.value;
    if (startDate !== null && endDate !== null) {
      this.dateRange = '';
      this.getApprOrRejOrReworkLeadTransferByUserId();
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
          this.getApprOrRejOrReworkLeadTransferByUserId();
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
    this.getApprOrRejOrReworkLeadTransferByUserId();
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
    this.stageOwnerName = '';
    this.selectedStatus = 'All';
    this.customStartDate = null;
    this.customEndDate = null;
    this.selectedProject = new Project();
    this.getApprOrRejOrReworkLeadTransferByUserId();
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
    // console.log(status);
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
      case 'pending':
        return 'pending-column';
      case 'reworking':
        return 'rework-column';
      case 'rework approval pending':
        return 'rework-column';
      case 'new indent':
        return 'new-column';
      default:
        return 'approved-column';
    }
  }
  gotoIndent() {
    //this.dialogRef.close({ action: 'back' });
  }

  approvalStatus(status: string) {
    // Show confirmation dialog before proceeding
    Swal.fire({
      title:
        status === 'Approval'
          ? 'Approve Lead Transfer?'
          : 'Reject Lead Transfer?',
      text: `Are you sure you want to ${
        status === 'Approval' ? 'approve' : 'reject'
      } this lead transfer?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: status === 'Approval' ? 'Approve' : 'Reject',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        this.approvalsService
          .updateApprovalStatus(
            this.leadTransferForApproval.leadTransferId,
            this.leadTransferForApproval.workFlowTypeId,
            this.userId,
            status,
            ''
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.getApprOrRejOrReworkLeadTransferByUserId();
              this.hideLoading();
              this.openApprovalDialog = false;
              this.handleSuccess('Lead transfer status updated successfully.');
            },
            error: (err) => {
              console.error('Error updating Approvals', err);
              this.hideLoading();
              this.handleFailer('Failed to update lead transfer status.');
            },
          });
      }
    });
  }

  handleSuccess(message: string) {
    Swal.fire({
      title: 'Success!',
      text: message || 'Operation completed successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }

  handleFailer(message: string) {
    Swal.fire({
      title: 'Error!',
      text: message || 'An error occurred. Please try again.',
      icon: 'error',
      confirmButtonText: 'Close',
    });
  }

  onBack() {
    this.openApprovalDialog = false;
  }
}
