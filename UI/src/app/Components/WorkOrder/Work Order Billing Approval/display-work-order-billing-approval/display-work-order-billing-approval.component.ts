import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { T } from '@fullcalendar/core/internal-common';
import { Subject, takeUntil } from 'rxjs';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  NAVIGATE_TO_WORK_ORDER_BILLING_APPROVALS_VIEW,
  WorkOrderStatus,
} from 'src/app/Constants/WorkOrder/workorder';
import { Page } from 'src/app/Models/CommanModel/Page';
import { IProject, Project } from 'src/app/Models/Project/project';
import { IUser, User } from 'src/app/Models/User/User';
import { IVendor, Vendor } from 'src/app/Models/WorkOrder/VendorData';
import {
  IWorkOrderBillingsData,
  IWorkOrderBillingsDto,
} from 'src/app/Models/WorkOrder/WorkOrderBilling';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { vendorService } from 'src/app/Services/WorkOrderService/Vendor Data/vendor.service';
import { WorkOrderBillingService } from 'src/app/Services/WorkOrderService/WorkOrderBilling/WorkOrderBilling.service';
@Component({
  selector: 'display-work-order-billing-approval',
  templateUrl: './display-work-order-billing-approval.component.html',
  styleUrls: ['./display-work-order-billing-approval.component.css'],
})
export class DisplayWorkOrderBillingApprovalComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  formData!: FormGroup;

  //approval status
  approvalStatus: string = '';
  isApprovalStatus: boolean = false;

  //pagination
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  userId: number = 0;
  user: IUser = new User();
  workOrderNumber: string = '';

  billingId: number = 0;
  stages: any;

  //project auto complete fields
  projectId: number = 0;
  projectName: string = '';
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);

  //vendor autocomplete fields
  vendors: IVendor[] = [];
  vendorCode: string = '';
  vendorName: string = '';
  vendorId: number = 0;
  vendor: any = new FormControl([] as IVendor[]);
  organizationId: number = 0;

  //custom date range
  dateRange: any = '';
  customStartDate: any = '';
  customEndDate: any = '';

  //workorder dto
  // Workorder DTO
  workOrderBillings: (IWorkOrderBillingsDto | IWorkOrderBillingsData)[] = [];

  openDialog: boolean | undefined;
  noDocuments: boolean = true;
  documentType: string = '';
  documents: any;
  isWorkOrderBillingDocuments: boolean = true;

  //documents pagination
  documentTotalItems: number = TOTAL_ITEMS;
  documentPageSize: number = 15;
  documentPageIndex: number = PAGE_INDEX;
  documentPageSizeOptions = pageSizeOptions;

  selectedProject: IProject = new Project();
  selectedVendor: IVendor = new Vendor();

  displayedColumns: string[] = [
    'rowNumber',
    'workOrderNumber',
    'createdDate',
    'createdBy',
    'vendorCode',
    'vendorName',
    'plantCode',
    'actionStatus',
    'wobType',
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

  displayedColumnsDocuments = ['fileName', 'createdDate', 'status', 'actions'];
  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.fetchProjects();
    this.fetchVendors();
    this.initForm();
    this.getDataFromState();
    this.getStatusFromRoutes();
  }
  constructor(
    private workOrderBillingService: WorkOrderBillingService,
    private commonService: CommanService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private vendorService: vendorService,
    private loaderService: LoaderService
  ) {}

  //getting user from local storage to set organization id
  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.user = user;
      this.userId = user.userId;
      this.organizationId = user.organizationId;
    }
  }

  getDataFromState() {
    const { displayPageData } = history.state;
    if (displayPageData) {
      console.log(displayPageData);
      const displayStatePageData = displayPageData;
      this.workOrderNumber = displayStatePageData.workOrderNumber;
      this.selectedProject = displayStatePageData.selectedProject;
      this.selectedVendor = displayStatePageData.selectedVendor;
      this.selectedStatus = displayStatePageData.selectedWoStatus;
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
    if (this.selectedVendor) {
      this.vendor.patchValue(this.selectedVendor);
      this.vendorId = this.selectedVendor.id;
    }
    if (this.customStartDate) {
      this.formData.get('customStartDate')?.patchValue(this.customStartDate);
    }
    if (this.customEndDate) {
      this.formData.get('customEndDate')?.patchValue(this.customEndDate);
    }
  }

  resetForm() {
    const project = new Project();
    project.projectId = 0;
    project.displayProjectName = 'All';
    this.project.reset(project);
    this.projectId = 0;
    const vendor = new Vendor();
    vendor.id = 0;
    vendor.vendorCode = 'All';
    this.vendor.reset(vendor);
    this.vendorId = 0;
    this.formData.reset({
      customStartDate: null,
      customEndDate: null,
    });
    this.workOrderNumber = '';
    this.selectedProject = new Project();
    this.selectedVendor = new Vendor();
    this.selectedStatus = 'All';
    this.customStartDate = null;
    this.customEndDate = null;
    this.loadWorkOrders();
  }

  getStatusFromRoutes() {
    this.route.params.subscribe((params) => {
      this.approvalStatus = params['check'] || WorkOrderStatus.PENDING;
      this.loadWorkOrders();
    });
  }

  loadWorkOrders() {
    this.isApprovalStatus = this.approvalStatus === WorkOrderStatus.PENDING;
    this.getWorkOrderBillings();
  }

  private getWorkOrderBillings(): void {
    this.showLoading();
    const serviceCall = this.isApprovalStatus
      ? this.workOrderBillingService.getPendingWorkOrderBillingsBasedOnLoggedIn(
          this.workOrderNumber,
          this.userId,
          this.pageIndex,
          this.pageSize,
          this.projectId,
          this.vendorId,
          this.customStartDate,
          this.customEndDate
        )
      : this.workOrderBillingService.getApprovedOrRejectedWorkOrderBillingsBasedOnLoggedIn(
          this.workOrderNumber,
          this.userId,
          this.pageIndex,
          this.pageSize,
          this.selectedStatus,
          this.projectId,
          this.vendorId,
          this.customStartDate,
          this.customEndDate
        );

    serviceCall.pipe(takeUntil(this.destroy$)).subscribe({
      next: (
        workOrderBillings:
          | Page<IWorkOrderBillingsDto[]>
          | Page<IWorkOrderBillingsData[]>
      ) => {
        this.updateWorkOrderBillings(workOrderBillings);
      },
      error: (error: Error) => {
        console.log(error);
        this.hideLoading();
      },
    });
  }
  // Consolidated method for updating work order billings
  private updateWorkOrderBillings(
    workOrderBillings:
      | Page<IWorkOrderBillingsDto[]>
      | Page<IWorkOrderBillingsData[]>
  ): void {
    this.workOrderBillings = workOrderBillings.records;
    this.totalItems = workOrderBillings.totalRecords;
    this.hideLoading();
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getWorkOrderBillings();
  }
  goToApprovals(workOrderBilling: any) {
    this.billingId = workOrderBilling.workOrderBillingId;
    this.getStages(workOrderBilling);
  }
  onSearch(workOrderNumber: string) {
    if (
      workOrderNumber.length >= searchTextLength ||
      workOrderNumber.length === searchTextZero
    ) {
      this.workOrderNumber = workOrderNumber;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getWorkOrderBillings();
    }
  }
  selectedStatus: string = '';

  onStatusChange(selectedValue: string): void {
    this.selectedStatus = selectedValue;
    this.loadWorkOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getStages(workOrderBilling: any) {
    this.showLoading();
    this.workOrderBillingService
      .getStages(this.billingId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stages) => {
          this.stages = stages;
          this.hideLoading();
          this.router.navigate(
            [NAVIGATE_TO_WORK_ORDER_BILLING_APPROVALS_VIEW],
            {
              state: {
                workOrderData: workOrderBilling,
                status: this.approvalStatus,
                stages: this.stages,
                displayPage: {
                  workOrderNumber: this.workOrderNumber,
                  selectedProject: this.selectedProject,
                  selectedVendor: this.selectedVendor,
                  selectedWoStatus: this.selectedStatus,
                  customStartDate: this.customStartDate,
                  customEndDate: this.customEndDate,
                },
              },
            }
          );
        },
        error: () => {
          this.hideLoading();
        },
      });
  }

  //date filter
  onDateChange() {
    this.pageIndex = 0;
    this.paginator.firstPage();
    const startDate = this.formData.get('customStartDate')?.value;
    const endDate = this.formData.get('customEndDate')?.value;
    if (startDate !== null && endDate !== null) {
      this.dateRange = '';
      this.loadWorkOrders();
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
          this.loadWorkOrders();
        }
      });
  }

  formatDateTime(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }

  //fetch projects based on organization id
  fetchProjects() {
    this.projectService
      .getProjectsByOrgIdWithProjectFilter(
        this.organizationId,
        '',
        this.projectName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          const allOption = new Project();
          allOption.projectId = 0;
          allOption.displayProjectName = 'All';
          this.projects = [allOption, ...projects];
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  displayProject(project: IProject) {
    return project && project.projectName ? project.projectName : '';
  }
  onProjectSelect(project: any) {
    this.projectId = project.option.value.projectId;
    this.selectedProject = project.option.value;
    this.loadWorkOrders();
  }
  searchProject(project: any) {
    const query = project.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.projectName = query;
      this.fetchProjects();
    }
    if (query.length === searchTextZero) {
      this.projectId = 0;
      this.loadWorkOrders();
    }
  }

  //added siva
  fetchVendors() {
    this.vendorService
      .getVendorCodesWithOutPage(this.vendorCode, this.vendorName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vendorCode) => {
          const allOption = new Vendor();
          allOption.id = 0;
          allOption.vendorCode = 'All';
          this.vendors = [allOption, ...vendorCode];
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  onVendorCodeSelect(event: any) {
    this.vendorId = event.option.value.id;
    this.selectedVendor = event.option.value;
    this.loadWorkOrders();
  }
  displayVendorCode(vendor: Vendor) {
    return vendor && vendor.vendorCode ? vendor.vendorCode : '';
  }

  searchVendorCode(event: any) {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.vendorCode = query;
      this.fetchVendors();
    }
    if (query.length === searchTextZero) {
      this.vendorId = 0;
      this.loadWorkOrders();
    }
  }
  viewDownLoads(workOrderData: any, documentType: string) {
    this.documentType = documentType;
    let workOrderBillingId;

    if (documentType == 'WORK_ORDER_BILLING_DOCUMENTS') {
      this.isWorkOrderBillingDocuments = true;
    } else {
      this.isWorkOrderBillingDocuments = false;
    }
    if (workOrderData.id) {
      workOrderBillingId = workOrderData.workOrderBillingId;
    } else {
      workOrderBillingId = workOrderData.workOrderBillingId;
    }

    if (workOrderBillingId) {
      this.getDocumentsBasedOnId(workOrderBillingId);
    }
  }

  getDocumentsBasedOnId(workOrderId: number) {
    const documentType = this.documentType;
    this.commonService
      .getDocumentById(
        workOrderId,
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
          console.log(error);
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
      fileName = 'Work_Order';
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
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    this.onClose();
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

  onDocumentPageChange(event: any) {
    this.documentPageSize = event.pageSize;
    this.documentPageIndex = event.pageIndex;
    this.getDocumentsBasedOnId(this.billingId);
  }

  onClose() {
    this.openDialog = false;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'approved';
      case 'Rejected':
        return 'rejected';
      case 'Rework':
        return 'rework';
      case 'Pending':
        return 'pending';
      case 'Rework Approval Pending':
        return 'rework';
      case 'Amendment':
        return 'amendment';
      case 'New':
        return 'pending';
      default:
        return '';
    }
  }

  clearDateRange(): void {
    this.formData.get('customStartDate')?.setValue('');
    this.formData.get('customEndDate')?.setValue('');
    this.customStartDate = '';
    this.customEndDate = '';
    this.loadWorkOrders();
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
