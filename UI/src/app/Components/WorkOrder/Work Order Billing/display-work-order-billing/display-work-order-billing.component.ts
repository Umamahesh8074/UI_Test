import { formatDate } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TIME_OUT,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  NAVIGATE_TO_ADD_WORK_ORDER_BILLING,
  NAVIGATE_TO_WORK_ORDER_BILLING_DETAILS,
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
import Swal from 'sweetalert2';

@Component({
  selector: 'display-work-order-billing',
  templateUrl: './display-work-order-billing.component.html',
  styleUrls: ['./display-work-order-billing.component.css'],
  encapsulation: ViewEncapsulation.None, // Set ViewEncapsulation to None
})
export class DisplayWorkOrderBillingComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  workOrderBilling: IWorkOrderBillingsData[] = [];
  workOrderNumber: string = '';
  workOrderBillingId: number = 0;
  stages: any;

  selectedProject: IProject = new Project();
  selectedVendor: IVendor = new Vendor();

  displayedColumns: string[] = [
    'rowNumber',
    'workOrderNumber',
    'createdDate',
    'vendorCode',
    'vendorName',
    'projectName',
    'actionStatus',
    'stageOwner',
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

  //billing properties
  workOrdersBillingStatus: string = '';
  isReworkWo: boolean = false;

  //logged in user data
  user: IUser = new User();
  loggedInUserId: number = 0;

  //select status
  selectedStatus: string = 'All';

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

  documentType: string = '';
  isWorkOrderBillingDocuments: boolean = true;
  documents: any;
  openDialog: boolean | undefined;
  noDocuments: boolean = true;

  //documents pagination
  documentTotalItems: number = TOTAL_ITEMS;
  documentPageSize: number = 15;
  documentPageIndex: number = PAGE_INDEX;
  documentPageSizeOptions = pageSizeOptions;

  constructor(
    private workOrderBillingService: WorkOrderBillingService,
    private router: Router,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private commonService: CommanService,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private vendorService: vendorService,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.workOrderBillingService.refreshRequired.subscribe(() => {
      this.getStatusFromRoutes();
    });
    this.setUserFromLocalStorage();
    this.fetchProjects();
    this.fetchVendors();
    this.initForm();
    this.getDataFromState();
    this.getStatusFromRoutes();
  }

  getDataFromState() {
    const { displayPageData } = history.state;
    if (displayPageData) {
      console.log(displayPageData);
      const displayStatePageData = displayPageData;
      this.workOrderNumber = displayStatePageData.workOrderNumber;
      console.log(this.workOrderNumber);
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
      this.workOrdersBillingStatus = params['status'];
      if (this.workOrdersBillingStatus) {
        this.loadWorkOrders();
      }
    });
  }

  //getting user from local storage to set organization id
  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.user = user;
      this.loggedInUserId = user.userId;
      this.organizationId = user.organizationId;
    }
  }

  loadWorkOrders() {
    this.showLoading();
    const serviecCall =
      this.workOrdersBillingStatus === WorkOrderStatus.REWORK
        ? this.workOrderBillingService.getReworkWorkOrderBillingsBasedOnLoggedIn(
            this.workOrderNumber,
            this.loggedInUserId,
            this.pageIndex,
            this.pageSize,
            this.selectedStatus,
            this.projectId,
            this.vendorId,
            this.customStartDate,
            this.customEndDate
          )
        : this.workOrderBillingService.fetchAllWorkOrderBilling(
            this.workOrderNumber,
            this.pageIndex,
            this.pageSize,
            this.loggedInUserId,
            this.projectId,
            this.vendorId,
            this.customStartDate,
            this.customEndDate
          );

    serviecCall.pipe(takeUntil(this.destroy$)).subscribe({
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

  private updateWorkOrderBillings(
    workOrderBillings:
      | Page<IWorkOrderBillingsDto[]>
      | Page<IWorkOrderBillingsData[]>
  ) {
    this.workOrderBilling = workOrderBillings.records;
    this.totalItems = workOrderBillings.totalRecords;
    this.hideLoading();
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadWorkOrders();
  }
  onSearch(workOrderNumber: string) {
    if (
      workOrderNumber.length > searchTextLength ||
      workOrderNumber.length === searchTextZero
    ) {
      this.workOrderNumber = workOrderNumber;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.loadWorkOrders();
    }
  }
  openConfirmDialog(id: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Work Order Billing' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.inactiveWorkOrderBilling(id);
        }
      }
    );
  }

  inactiveWorkOrderBilling(id: number) {
    this.showLoading();
    this.workOrderBillingService.inActivateWorkOrderBilling(id).subscribe({
      next: (response: any) => {
        this.handleSuccessResponse(response);
        this.hideLoading();
      },
      error: (error: Error) => {
        console.error('Error deleting work order billing:', error);
        this.hideLoading();
      },
    });
  }
  handleSuccessResponse(response: any): void {
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
  }

  AddWorkOrderBilling() {
    this.router.navigate([NAVIGATE_TO_ADD_WORK_ORDER_BILLING], {
      state: { isAdding: true },
    });
  }

  editAfterRework(workOrderBilling: any, workOrderBillingStatus: string) {
    this.fetchWorkOrderBillingById(
      workOrderBilling.workOrderBillingId,
      workOrderBillingStatus
    );
  }

  editWorkOrderBilling(
    workOrderBilling: IWorkOrderBillingsDto,
    workOrderBillingStatus: string
  ) {
    this.fetchWorkOrderBillingById(
      workOrderBilling.workOrderBillingId,
      workOrderBillingStatus
    );
  }

  fetchWorkOrderBillingById(id: number, workOrderBillingStatus: string) {
    this.showLoading();
    this.workOrderBillingService
      .getWorkOrderBillingById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (workOrderBilling) => {
          this.hideLoading();
          this.router.navigate([NAVIGATE_TO_ADD_WORK_ORDER_BILLING], {
            state: {
              workOrderBilling: workOrderBilling,
              isAdding: false,
              workOrderBillingStatus: workOrderBillingStatus,
              displayPage: {
                workOrderNumber: this.workOrderNumber,
                selectedProject: this.selectedProject,
                selectedVendor: this.selectedVendor,
                selectedWoStatus: this.selectedStatus,
                customStartDate: this.customStartDate,
                customEndDate: this.customEndDate,
              },
            },
          });
        },
        error: (error) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }

  goToApprovals(workOrderBillingDetails: any) {
    this.workOrderBillingId = workOrderBillingDetails.workOrderBillingId;
    this.getStages(workOrderBillingDetails);
  }

  getStages(workOrderBillingDetails: any) {
    this.showLoading();
    console.log(workOrderBillingDetails);
    this.workOrderBillingService
      .getStages(this.workOrderBillingId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stages) => {
          this.stages = stages;
          this.hideLoading();

          const destination = NAVIGATE_TO_WORK_ORDER_BILLING_DETAILS;
          const status =
            this.workOrdersBillingStatus === WorkOrderStatus.REWORK
              ? WorkOrderStatus.REWORK
              : WorkOrderStatus.CREATE;

          const selectStatus = this.selectedStatus;
          this.router.navigate([destination], {
            state: {
              workOrderData: workOrderBillingDetails,
              status,
              selectStatus,
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
          });
        },
        error: (error: Error) => {
          this.hideLoading();
        },
      });
  }

  onStatusChange(selectedValue: string): void {
    this.selectedStatus = selectedValue;
    this.loadWorkOrders();
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
          console.error(error);
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

  clearDateRange(): void {
    this.formData.get('customStartDate')?.setValue('');
    this.formData.get('customEndDate')?.setValue('');
    this.customStartDate = '';
    this.customEndDate = '';
    this.loadWorkOrders();
  }

  sendForApproval(workOrderBilling: any) {
    this.showLoading();
    this.workOrderBillingService
      .sendForApproval(workOrderBilling.workOrderBillingId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.handleSuccessStatus(response);
          this.hideLoading();
        },
        error: () => {
          this.hideLoading();
        },
      });
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

  getDocumentsBasedOnId(workOrderBillingId: number) {
    const documentType = this.documentType;
    this.commonService
      .getDocumentById(
        workOrderBillingId,
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
      case 'Rework Approval Pending':
        return 'rework';
      case 'New':
        return 'pending';
      default:
        return '';
    }
  }

  sendForApprovalAfterReworkOrAmendament(workOrderBilling: any) {
    this.showLoading();
    this.workOrderBillingService
      .sendForApprovalAfterReworkOrReject(
        workOrderBilling.woBillingId,
        workOrderBilling.wobType
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.handleSuccessStatus(response);
          this.hideLoading();
        },
        error: () => {
          this.hideLoading();
        },
      });
  }

  handleSuccessStatus(response: any): void {
    Swal.fire({
      title: 'Success',
      text: response.message,
      icon: 'success',
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: true,
    }).then(() => {});
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
    this.getDocumentsBasedOnId(this.workOrderBillingId);
  }
}
