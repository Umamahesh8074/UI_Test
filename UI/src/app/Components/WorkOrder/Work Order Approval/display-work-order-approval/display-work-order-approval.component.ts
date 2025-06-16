import { state } from '@angular/animations';
import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { first, Subject, takeUntil } from 'rxjs';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  NAVIGATE_TO_WORK_ORDER_APPROVALS_VIEW,
  WorkOrderStatus,
} from 'src/app/Constants/WorkOrder/workorder';
import { Page } from 'src/app/Models/CommanModel/Page';
import { IProject, Project } from 'src/app/Models/Project/project';
import { IUser, User } from 'src/app/Models/User/User';
import { IVendor, Vendor } from 'src/app/Models/WorkOrder/VendorData';
import { IWorkOrderCreationsDto } from 'src/app/Models/WorkOrder/WorkOrderCreation';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { vendorService } from 'src/app/Services/WorkOrderService/Vendor Data/vendor.service';
import { WorkOrderCreationService } from 'src/app/Services/WorkOrderService/WorkOrderCreation/WorkOrderCreation.service';

@Component({
  selector: 'work-order-approval',
  templateUrl: './display-work-order-approval.component.html',
  styleUrls: ['./display-work-order-approval.component.css'],
})
export class DisplayWorkOrderApprovalComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  approvalStatus: string = '';

  //stages pagination
  stageTotalItems: number = TOTAL_ITEMS;
  stagePageSize: number = 15;
  stagePageIndex: number = PAGE_INDEX;
  stagePageSizeOptions = pageSizeOptions;

  //pagination
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  userId: number = 0;
  user: IUser = new User();
  workOrderNumber: string = '';
  workOrders: IWorkOrderCreationsDto[] = [];

  documentType: string = '';
  noDocuments: boolean = true;
  documents: any;
  openDialog: boolean | undefined;
  selectedWorkOrderType: string = 'All';

  displayedColumnsDocuments = ['fileName', 'createdDate', 'status', 'actions'];

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
    {
      id: 4,
      value: 'Pending',
    },
  ];

  workOrderId: number = 0;
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
  formData!: FormGroup;
  dateRange: any = '';
  customStartDate: any = '';
  customEndDate: any = '';

  stageOwner: string = '';
  selectedStatus: string = 'All';
  isWorkOrderDocuments: boolean = true;

  selectedProject: IProject = new Project();
  selectedVendor: IVendor = new Vendor();
  shouldLoadWorkOrders: boolean = false;

  //documents pagination
  documentTotalItems: number = TOTAL_ITEMS;
  documentPageSize: number = 15;
  documentPageIndex: number = PAGE_INDEX;
  documentPageSizeOptions = pageSizeOptions;

  displayedColumns: string[] = [
    'rowNumber',
    'workOrderNumber',
    'createdDate',
    'modifiedDate',
    'createdBy',
    'vendorCode',
    'vendorName',
    'plantCode',
    'actionStatus',
    'stageOwner',
    'amount',
    'workOrderAmountWithGst',
    'workOrderType',
    'actions',
  ];

  woStatus = [
    {
      id: 1,
      value: 'All',
    },
    {
      id: 4,
      value: 'New',
    },
    {
      id: 5,
      value: 'Amendment',
    },
    {
      id: 5,
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

  ngOnInit() {
    console.log(history.state);
    this.setUserFromLocalStorage();
    this.fetchProjects();
    this.fetchVendors();
    this.initForm();

    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state || history.state; // Fallback to history.state
    console.log('Navigation State:', state);
    console.log('History is Back: ', state?.isFromViewWorkOrder);
    if (state?.isFromViewWorkOrder) {
      this.getDataFromState();
    }
    // }

    this.getStatusFromRoutes();
  }
  constructor(
    private workOrderService: WorkOrderCreationService,
    private commonService: CommanService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private vendorService: vendorService,
    private loaderService: LoaderService
  ) {}
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
    this.selectedWorkOrderType = 'All';
    this.customStartDate = null;
    this.customEndDate = null;
    this.loadWorkOrders();
  }

  getDataFromState() {
    const data = history.state;
    console.log('State:', data);
    if (data?.displayPageData) {
      const displayPageData = data.displayPageData;
      this.workOrderNumber = displayPageData.workOrderNumber;
      this.selectedProject = displayPageData.selectedProject;
      this.selectedVendor = displayPageData.selectedVendor;
      this.selectedStatus = displayPageData.selectedWoStatus;
      this.selectedWorkOrderType = displayPageData.selectedWorkOrderType;
      this.customStartDate = displayPageData.customStartDate;
      this.customEndDate = displayPageData.customEndDate;
      this.patchFormValues();
    }
  }
  // Patch values into form controls
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

  // resetFilters() {
  //   this.project.setValue({ projectId: 0, displayProjectName: 'All' });
  //   this.vendor.setValue(null);
  //   this.projectId = 0;
  //   this.vendorId = 0;
  // }

  //getting user from local storage to set organization id
  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.user = user;
      this.userId = user.userId;
      this.organizationId = user.organizationId;
    }
  }

  // getStatusFromRoutes(): Promise<void> {
  //   return new Promise((resolve) => {
  //     this.route.params.pipe(first()).subscribe((params) => {
  //       this.approvalStatus = params['status'] || WorkOrderStatus.PENDING;
  //       this.loadWorkOrders();
  //       resolve(); // Ensures completion before calling getDataFromState()
  //     });
  //   });
  // }

  getStatusFromRoutes() {
    this.route.params.subscribe((params) => {
      this.approvalStatus = params['status'] || WorkOrderStatus.PENDING;
      this.loadWorkOrders();
    });
  }

  loadWorkOrders() {
    this.showLoading();
    const serviceCall =
      this.approvalStatus === WorkOrderStatus.PENDING
        ? this.workOrderService.getPendingWorkOrdersBasedOnLoggedIn(
            this.workOrderNumber,
            this.userId,
            this.pageIndex,
            this.pageSize,
            this.projectId,
            this.vendorId,
            this.customStartDate,
            this.customEndDate,
            this.selectedWorkOrderType
          )
        : this.workOrderService.getApprovedOrRejectedWorkOrdersBasedOnLoggedIn(
            this.workOrderNumber,
            this.userId,
            this.pageIndex,
            this.pageSize,
            this.selectedStatus,
            this.projectId,
            this.vendorId,
            this.customStartDate,
            this.customEndDate,
            this.selectedWorkOrderType
          );

    serviceCall.pipe(takeUntil(this.destroy$)).subscribe({
      next: (workOrders: Page<IWorkOrderCreationsDto>) => {
        this.updateWorkOrders(workOrders);
      },
      error: (error: Error) => {
        console.error(error);
        this.hideLoading();
      },
    });
  }

  private updateWorkOrders(workOrders: Page<IWorkOrderCreationsDto>): void {
    this.workOrders = workOrders.records;
    this.totalItems = workOrders.totalRecords;
    this.hideLoading();
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadWorkOrders();
  }
  goToApprovals(workOrderCreation: any) {
    this.workOrderId = workOrderCreation.workOrderId;
    this.getStages(workOrderCreation);
  }

  getStages(workOrderCreation: any) {
    this.showLoading();
    this.workOrderService
      .getStages(this.workOrderId, this.stagePageIndex, this.stagePageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stages) => {
          this.stages = stages.records;
          this.hideLoading();
          this.router.navigate([NAVIGATE_TO_WORK_ORDER_APPROVALS_VIEW], {
            state: {
              workOrderData: workOrderCreation,
              status: this.approvalStatus,
              stages: this.stages,
              displayPage: {
                workOrderNumber: this.workOrderNumber,
                selectedProject: this.selectedProject,
                selectedVendor: this.selectedVendor,
                selectedWoStatus: this.selectedStatus,
                selectedWorkOrderType: this.selectedWorkOrderType,
                customStartDate: this.customStartDate,
                customEndDate: this.customEndDate,
              },
            },
          });
        },
        error: (error: Error) => {
          this.hideLoading();
        },
      });
  }
  onSearch(workOrderNumber: string) {
    if (
      workOrderNumber.length >= searchTextLength ||
      workOrderNumber.length === searchTextZero
    ) {
      this.workOrderNumber = workOrderNumber;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.loadWorkOrders();
    }
  }

  onStatusChange(selectedValue: string): void {
    this.selectedStatus = selectedValue;
    this.loadWorkOrders();
  }

  //added

  viewDownLoads(workOrderData: any, documentType: string) {
    this.documentType = documentType;
    let workOrderId;

    if (documentType == 'WORK_ORDER_DOCUMENTS') {
      this.isWorkOrderDocuments = true;
    } else {
      this.isWorkOrderDocuments = false;
    }
    if (workOrderData.workOrderId) {
      this.workOrderId = workOrderData.workOrderId;
      workOrderId = workOrderData.workOrderId;
    } else {
      this.workOrderId = workOrderData.workOrderId;
      workOrderId = workOrderData.workOrderId;
    }

    if (workOrderId) {
      this.getDocumentsBasedOnId(workOrderId);
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

  onClose() {
    this.openDialog = false;
  }
  //added
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    console.log('Init Form....');
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
    return project && project.displayProjectName
      ? project.displayProjectName
      : 'All';
  }
  onProjectSelect(project: any) {
    this.selectedProject = project.option.value;
    console.log('selected project:', this.selectedProject);
    this.projectId = project.option.value.projectId;
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
          console.error(error);
        },
      });
  }

  onVendorCodeSelect(event: any) {
    this.selectedVendor = event.option.value;
    this.vendorId = event.option.value.id;
    this.loadWorkOrders();
  }
  displayVendorCode(vendor: Vendor) {
    return vendor && vendor.vendorCode ? vendor.vendorCode : 'All';
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
      case 'Amendment':
        return 'amendment';
      case 'Amendment Approval Pending':
        return 'amendment';
      case 'Rework Approval Pending':
        return 'rework';
      case 'Reworking':
        return 'rework';
      case 'New':
        return 'pending';
      default:
        return 'OLD';
    }
  }

  onSelectWorkOrderType(selectedValue: string): void {
    if (selectedValue == 'All') {
      this.selectedWorkOrderType = 'All';
    } else {
      this.selectedWorkOrderType = selectedValue;
    }
    this.loadWorkOrders();
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

  onDocumentPageChange(event: any) {
    this.documentPageSize = event.pageSize;
    this.documentPageIndex = event.pageIndex;
    this.getDocumentsBasedOnId(this.workOrderId);
  }
}
