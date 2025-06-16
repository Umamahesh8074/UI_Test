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
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TIME_OUT,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  NAVIGATE_ADD_WO_QUANTITY,
  NAVIGATE_TO_ADD_AND_EDIT_WORK_ORDER_Header,
  NAVIGATE_TO_ADD_WORK_ORDER_CREATION,
  NAVIGATE_TO_WORK_ORDER_DETAILS,
  WorkOrderStatus,
  WorkOrderStatusConstants,
} from 'src/app/Constants/WorkOrder/workorder';
import { Page } from 'src/app/Models/CommanModel/Page';
import { IUser, User } from 'src/app/Models/User/User';
import {
  IWorkOrderCreationsDto,
  IWorkOrdersDataDto,
} from 'src/app/Models/WorkOrder/WorkOrderCreation';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { formatDate } from '@angular/common';
import { WorkOrderCreationService } from 'src/app/Services/WorkOrderService/WorkOrderCreation/WorkOrderCreation.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { vendorService } from 'src/app/Services/WorkOrderService/Vendor Data/vendor.service';
import { IProject, Project } from 'src/app/Models/Project/project';
import { IVendor, Vendor } from 'src/app/Models/WorkOrder/VendorData';
import Swal from 'sweetalert2';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { IStagesDto } from 'src/app/Models/WorkOrder/WorkOrderBilling';

@Component({
  selector: 'display-work-order-creation',
  templateUrl: './display-work-order-creation.component.html',
  styleUrls: ['./display-work-order-creation.component.css'],
  encapsulation: ViewEncapsulation.None, // Set ViewEncapsulation to None
})
export class DisplayWorkOrderCreationComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  workOrderId: number = 0;

  //stages pagination
  stageTotalItems: number = TOTAL_ITEMS;
  stagePageSize: number = 15;
  stagePageIndex: number = PAGE_INDEX;
  stagePageSizeOptions = pageSizeOptions;

  //pagination
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = 15;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  //documents pagination
  documentTotalItems: number = TOTAL_ITEMS;
  documentPageSize: number = 15;
  documentPageIndex: number = PAGE_INDEX;
  documentPageSizeOptions = pageSizeOptions;

  //searching based on work order number
  workOrderNumber: string = '';
  stageOwner: string = '';
  workOrders: (IWorkOrderCreationsDto | IWorkOrdersDataDto)[] = [];
  workOrdersStatus: string = '';
  isReworkWo: boolean = false;

  //select status
  selectedStatus: string = 'All';
  selectedWorkOrderType: string = 'All';
  selectWorkOrderCategory: string = 'ALL';

  //logged in user data
  user: IUser = new User();
  loggedInUserId: number = 0;

  documentType: string = '';
  noDocuments: boolean = true;

  //custom date range
  formData!: FormGroup;
  dateRange: any = '';
  customStartDate: any = '';
  customEndDate: any = '';

  isWorkOrderDocuments: boolean = true;
  isLoading: boolean = false;
  stages: IStagesDto[] = [];

  displayedColumns: string[] = [
    'rowNumber',
    'workOrderNumber',
    'createdDate',
    'modifiedDate',
    'vendorCode',
    'vendorName',
    'plantCode',
    'actionStatus',
    'stageOwner',
    'amount',
    'totalAmountWithGst',
    // 'status',
    'workOrderType',
    'workOrderCategory',
    'actions',
  ];

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
      value: 'Amendment',
    },
    {
      id: 4,
      value: 'Amendment Rework',
    },
    {
      id: 4,
      value: 'Amendment Rework Editing',
    },
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
      id: 2,
      value: 'Rejected',
    },
    {
      id: 3,
      value: 'Rework',
    },
  ];

  woCategory: string[] = ['ALL', 'OLD', 'NEW'];

  //document variables started
  documents: any;
  workOrderNumberAndId: string = '';
  openDialog: boolean | undefined;

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
  workOrderCreation: any;

  selectedProject: IProject = new Project();
  selectedVendor: IVendor = new Vendor();

  workOrderStatusConstants = WorkOrderStatusConstants;

  //document variables ended
  ngOnInit(): void {
    this.workOrderCreationService.refreshRequired.subscribe(() => {
      this.getStatusFromRoutes();
    });
    this.setUserFromLocalStorage();
    this.fetchProjects();
    this.fetchVendors();
    this.initForm();
    this.getDataFromState();
    this.getStatusFromRoutes();
  }

  constructor(
    private workOrderCreationService: WorkOrderCreationService,
    private router: Router,
    public dialog: MatDialog,
    private commonService: CommanService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private vendorService: vendorService,
    private loaderService: LoaderService
  ) {}

  getStatusFromRoutes() {
    this.route.params.subscribe((params) => {
      this.workOrdersStatus = params['status'];
      if (this.workOrdersStatus) {
        this.loadWorkOrders();
      }
    });
  }

  getDataFromState() {
    const { displayPageData, statePageSize, statePageIndex } = history.state;
    console.log(displayPageData);

    if (statePageSize && statePageIndex !== undefined) {
      this.pageSize = statePageSize;
      this.pageIndex = statePageIndex;
    }
    if (displayPageData) {
      const displayStatePageData = displayPageData;
      this.workOrderNumber = displayStatePageData.workOrderNumber;
      this.selectedProject = displayStatePageData.selectedProject;
      this.selectedVendor = displayStatePageData.selectedVendor;
      this.selectedStatus = displayStatePageData.selectedWoStatus;
      this.selectedWorkOrderType = displayStatePageData.selectedWorkOrderType;
      this.customStartDate = displayStatePageData.customStartDate;
      this.customEndDate = displayStatePageData.customEndDate;
      this.selectWorkOrderCategory =
        displayStatePageData.selectWorkOrderCategory;
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
    // selectedStatus and selectedWorkOrderType are bound directly via [(value)]
    // so they’ll update automatically via two-way binding
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
    this.selectedWorkOrderType = 'All';
    this.customStartDate = null;
    this.customEndDate = null;
    this.selectWorkOrderCategory = 'ALL';
    this.loadWorkOrders();
  }

  loadWorkOrders() {
    if (this.workOrdersStatus === WorkOrderStatus.REWORK) {
      this.getReworkWorkOrders();
    } else if (this.workOrdersStatus === WorkOrderStatus.CREATE) {
      this.getWorkOrdersForCreation();
    }
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

  getReworkWorkOrders() {
    this.showLoading();
    this.workOrderCreationService
      .getReworkWorkOrdersBasedOnLoggedIn(
        this.workOrderNumber,
        this.loggedInUserId,
        this.pageIndex,
        this.pageSize,
        this.selectedStatus,
        this.projectId,
        this.vendorId,
        this.customStartDate,
        this.customEndDate,
        this.stageOwner
      )
      .pipe(takeUntil(this.destroy$))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (
          workOrders:
            | Page<IWorkOrderCreationsDto[]>
            | Page<IWorkOrdersDataDto[]>
        ) => {
          this.updateWorkOrderBillings(workOrders);
          this.hideLoading();
        },
        error: (error: Error) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }

  getWorkOrdersForCreation() {
    this.showLoading();
    this.workOrderCreationService
      .getAllWorkOrderCreationWithPagination(
        this.workOrderNumber,
        this.pageIndex,
        this.pageSize,
        this.loggedInUserId,
        this.projectId,
        this.vendorId,
        this.customStartDate,
        this.customEndDate,
        this.selectedWorkOrderType,
        this.stageOwner,
        this.selectWorkOrderCategory
      )
      .pipe(takeUntil(this.destroy$))
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (
          workOrders:
            | Page<IWorkOrderCreationsDto[]>
            | Page<IWorkOrdersDataDto[]>
        ) => {
          this.updateWorkOrderBillings(workOrders);
          this.hideLoading();
        },
        error: (error: Error) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }

  // Consolidated method for updating work order billings
  private updateWorkOrderBillings(
    workOrders: Page<IWorkOrderCreationsDto[]> | Page<IWorkOrdersDataDto[]>
  ): void {
    // this.workOrders = workOrders.records;
    // this.totalItems = workOrders.totalRecords;

    this.totalItems = workOrders.totalRecords;
    this.paginator.pageIndex = this.pageIndex;
    this.paginator.pageSize = this.pageSize;
    this.workOrders = workOrders.records;
  }

  onSearch(workOrderNumber: string) {
    if (
      workOrderNumber.length >= searchTextLength ||
      workOrderNumber.length === searchTextZero
    ) {
      this.workOrderNumber = workOrderNumber;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.workOrdersStatus === WorkOrderStatus.REWORK
        ? this.getReworkWorkOrders()
        : this.getWorkOrdersForCreation();
    }
  }

  onSearchStageOwner(stageOwner: string) {
    if (
      stageOwner.length >= searchTextLength ||
      stageOwner.length === searchTextZero
    ) {
      this.stageOwner = stageOwner;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.workOrdersStatus === WorkOrderStatus.REWORK
        ? this.getReworkWorkOrders()
        : this.getWorkOrdersForCreation();
    }
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.workOrdersStatus === WorkOrderStatus.REWORK
      ? this.getReworkWorkOrders()
      : this.getWorkOrdersForCreation();
  }

  editAfterReworkOrAmendament(workOrderCreation: any, workOrderStatus: string) {
    this.workOrderCreation = workOrderCreation;
    console.log('');

    if (workOrderCreation.actionStatus === 'Rework') {
      this.editWorkOrderCreation(workOrderCreation, workOrderStatus);
    } else if (workOrderCreation.actionStatus === 'Reworking') {
      this.editWorkOrderCreation(workOrderCreation, 'Reworking');
    } else if (workOrderCreation.actionStatus === 'Amendment Rework Editing') {
      this.editWorkOrderCreation(workOrderCreation, 'Amendment Rework Editing');
    } else if (workOrderCreation.actionStatus === 'Amendment Rework') {
      this.editWorkOrderCreation(workOrderCreation, 'Amendment Rework');
    }
  }

  editAfterAmendament(workOrderCreation: any, workOrderStatus: string) {
    this.workOrderCreation = workOrderCreation;
    if (workOrderCreation.workOrderType === 'Amendment') {
      this.editWorkOrderCreation(workOrderCreation, 'Amendment');
    } else {
      console.log(this.workOrderCreation);
      console.log(workOrderStatus);
    }
  }

  editWorkOrderCreation(workOrderCreation: any, workOrderStatus: string) {
    this.workOrderCreation = workOrderCreation;
    const workOrderId = workOrderCreation.workOrderId;
    this.fetchWorkOrderCreationById(
      workOrderId,
      workOrderCreation.stagesDto,
      workOrderStatus,
      workOrderCreation.totalAmount
    );
  }

  fetchWorkOrderCreationById(
    workOrderCreationId: number,
    stagesData: any,
    workOrderStatus: string,
    totalAmount: number
  ) {
    this.showLoading();
    this.isLoading = true;
    this.workOrderCreationService
      .getWorkOrderCreationById(workOrderCreationId, this.workOrdersStatus)
      .subscribe({
        next: (response) => {
          const workOrderCreationDto = response;
          this.router.navigate([NAVIGATE_TO_ADD_WORK_ORDER_CREATION], {
            state: {
              workOrderCreationDto: workOrderCreationDto,
              isAdding: false,
              isForView: false,
              title: 'EDIT WORK ORDER',
              stagesData: stagesData,
              woStatus: this.workOrderCreation.actionStatus,
              workOrderStatus: workOrderStatus,
              vendors: this.vendors,
              projects: this.projects,
              totalAmount: totalAmount,
              statePageSize: this.pageSize,
              statePageIndex: this.pageIndex,
              displayPage: {
                workOrderNumber: this.workOrderNumber,
                selectedProject: this.selectedProject,
                selectedVendor: this.selectedVendor,
                selectedWoStatus: this.selectedStatus,
                selectedWorkOrderType: this.selectedWorkOrderType,
                customStartDate: this.customStartDate,
                customEndDate: this.customEndDate,
                selectWorkOrderCategory: this.selectWorkOrderCategory,
              },
            },
          });
          this.hideLoading();
        },
        error: (error: Error) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }
  // openConfirmDialog(id: number) {}
  openConfirmDialog(workOrderId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Work Order' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteWorkOrder(workOrderId);
        }
      }
    );
  }

  deleteWorkOrder(workOrderId: number) {
    this.workOrderCreationService.deleteWorkOrder(workOrderId).subscribe({
      next: (response: any) => {
        this.handleSuccessResponse(response);
      },
      error: (error: Error) => {
        console.error('Error deleting prime activity code:', error);
      },
    });
  }

  AddWorkOrderCreation() {
    this.router.navigate([NAVIGATE_TO_ADD_WORK_ORDER_CREATION], {
      state: { isAdding: true, title: 'ADD WORK ORDER' },
    });
  }

  handleSuccessResponse(response: any): void {
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
  }
  handleErrorResponse(error: any): void {
    const errorMessage =
      error?.error?.message || 'An unexpected error occurred.';
    this.toastrService.error('', errorMessage, {
      timeOut: TIME_OUT,
    });
  }

  goToApprovals(workOrderCreation: any) {
    this.getStages(workOrderCreation);
  }

  getStages(workOrderCreation: any) {
    this.showLoading();
    this.workOrderCreationService
      .getStages(
        workOrderCreation.workOrderId,
        this.stagePageIndex,
        this.stagePageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stages) => {
          this.stages = stages.records;
          this.hideLoading();
          const destination = NAVIGATE_TO_WORK_ORDER_DETAILS;
          const status =
            this.workOrdersStatus === WorkOrderStatus.REWORK
              ? WorkOrderStatus.REWORK
              : WorkOrderStatus.CREATE;
          this.router.navigate([destination], {
            state: {
              workOrderData: workOrderCreation,
              status,
              stages: stages.records,
              stateProjects: this.projects,
              stateVendors: this.vendors,
              statePageSize: this.pageSize,
              statePageIndex: this.pageIndex,
              displayPage: {
                workOrderNumber: this.workOrderNumber,
                selectedProject: this.selectedProject,
                selectedVendor: this.selectedVendor,
                selectedWoStatus: this.selectedStatus,
                selectedWorkOrderType: this.selectedWorkOrderType,
                customStartDate: this.customStartDate,
                customEndDate: this.customEndDate,
                selectWorkOrderCategory: this.selectWorkOrderCategory,
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
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    this.loadWorkOrders();
  }

  onSelectWorkOrderType(selectedValue: string): void {
    if (selectedValue == 'All') {
      this.selectedWorkOrderType = 'All';
    } else {
      this.selectedWorkOrderType = selectedValue;
    }
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    this.loadWorkOrders();
  }

  onSelectWorkOrderCategory(selectedValue: string): void {
    if (selectedValue == 'ALL') {
      this.selectWorkOrderCategory = 'ALL';
    } else {
      this.selectWorkOrderCategory = selectedValue;
    }
    this.loadWorkOrders();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

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

  // sendForApproval(workOrderCreation: any) {
  //   if (workOrderCreation.workOrderId) {
  //     this.commonService
  //       .getDocumentById(workOrderCreation.workOrderId, 'WORK_ORDER_DOCUMENTS')
  //       .pipe(takeUntil(this.destroy$))
  //       .subscribe({
  //         next: (response) => {
  //           this.documents = response;
  //           console.log(response);
  //         },
  //         error: (error: Error) => {
  //           console.error(error);
  //         },
  //       });
  //   }

  //   console.log(this.documents);

  //   // this.showLoading();
  //   // this.isLoading = true;
  //   // this.workOrderCreationService
  //   //   .sendForApproval(workOrderCreation.workOrderId)
  //   //   .pipe(takeUntil(this.destroy$))
  //   //   .subscribe({
  //   //     next: (response) => {
  //   //       this.handleSuccessStatus(response);
  //   //       this.hideLoading();
  //   //     },
  //   //   });
  // }

  sendForApproval(workOrderCreation: any) {
    if (!workOrderCreation.workOrderId) return;

    this.commonService
      .getDocumentById(
        workOrderCreation.workOrderId,
        'WORK_ORDER_PDF',
        this.documentPageIndex,
        this.documentPageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const documents = response.records;
          if (!documents || documents.length === 0) {
            Swal.fire({
              title: 'PDF Not Found',
              text: 'Please generate the PDF before sending for approval.',
              icon: 'warning',
              confirmButtonText: 'OK',
            });
            return;
          }

          // If documents are present, confirm approval
          Swal.fire({
            title: 'Confirm Submission',
            text: 'Send this Work Order for approval?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel',
          }).then((result) => {
            if (result.isConfirmed) {
              this.showLoading();
              this.workOrderCreationService
                .sendForApproval(workOrderCreation.workOrderId)
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                  next: (response) => {
                    this.handleSuccessStatus(response);
                    this.hideLoading();
                  },
                  error: (error) => {
                    this.handleErrorResponse(error);
                    this.hideLoading();
                  },
                });
            }
          });
        },
        error: (error: Error) => {
          console.error(error);
          this.handleErrorResponse(error);
        },
      });
  }

  sendForApprovalAfterReworkOrAmendament(workOrderCreation: any) {
    // If documents are present, confirm approval
    Swal.fire({
      title: 'Confirm Submission',
      text: 'Send this Work Order for approval?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        this.workOrderCreationService
          .sendForApprovalAfterReworkOrReject(
            workOrderCreation.workOrderId,
            workOrderCreation.workOrderType
          )
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.handleSuccessStatus(response);
              this.hideLoading();
            },
            error: (error) => {
              this.handleErrorResponse(error);
              this.hideLoading();
            },
          });
      }
    });

    // this.showLoading();
    // this.workOrderCreationService
    //   .sendForApprovalAfterReworkOrReject(
    //     workOrderCreation.workOrderId,
    //     workOrderCreation.workOrderType
    //   )
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (response) => {
    //       this.handleSuccessStatus(response);
    //       this.hideLoading();
    //     },
    //   });
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
    return project && project.displayProjectName
      ? project.displayProjectName
      : 'All';
  }
  onProjectSelect(project: any) {
    this.projectId = project.option.value.projectId;
    this.selectedProject = project.option.value;
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
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
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
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
        return 'new';
      case 'OLD':
        return 'rejected';
      default:
        return 'OLD';
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

  addQuantity(workOrderCreation: any, workOrderStatus: string) {
    this.router.navigate([NAVIGATE_ADD_WO_QUANTITY], {
      state: {
        isAdding: true,
        workOrder: workOrderCreation,
        projects: this.projects,
        vendors: this.vendors,
        workOrderStatus,
        statePageSize: this.pageSize,
        statePageIndex: this.pageIndex,
        displayPage: {
          workOrderNumber: this.workOrderNumber,
          selectedProject: this.selectedProject,
          selectedVendor: this.selectedVendor,
          selectedWoStatus: this.selectedStatus,
          selectedWorkOrderType: this.selectedWorkOrderType,
          customStartDate: this.customStartDate,
          customEndDate: this.customEndDate,
          selectWorkOrderCategory: this.selectWorkOrderCategory,
        },
      },
    });
  }

  addQuantityAfterRework(workOrderCreation: any, workOrderStatus: string) {
    console.log('quantity');
    this.workOrderCreation = workOrderCreation;
    workOrderStatus = workOrderCreation.actionStatus;
    this.router.navigate([NAVIGATE_ADD_WO_QUANTITY], {
      state: {
        isAdding: false,
        workOrder: workOrderCreation,
        projects: this.projects,
        vendors: this.vendors,
        workOrderStatus,
        statePageSize: this.pageSize,
        statePageIndex: this.pageIndex,
        displayPage: {
          workOrderNumber: this.workOrderNumber,
          selectedProject: this.selectedProject,
          selectedVendor: this.selectedVendor,
          selectedWoStatus: this.selectedStatus,
          selectedWorkOrderType: this.selectedWorkOrderType,
          customStartDate: this.customStartDate,
          customEndDate: this.customEndDate,
          selectWorkOrderCategory: this.selectWorkOrderCategory,
        },
      },
    });

    // if (
    //   workOrderCreation.actionStatus === 'Rework' ||
    //   workOrderCreation.actionStatus === 'Reworking'
    // ) {
    //   workOrderStatus = workOrderCreation.actionStatus;
    //   this.router.navigate([NAVIGATE_ADD_WO_QUANTITY], {
    //     state: {
    //       isAdding: false,
    //       workOrder: workOrderCreation,
    //       projects: this.projects,
    //       vendors: this.vendors,
    //       workOrderStatus,
    //     },
    //   });
    // }
  }

  addHeader(workOrderCreation: any) {
    this.router.navigate([NAVIGATE_TO_ADD_AND_EDIT_WORK_ORDER_Header], {
      state: {
        isAdding: true,
        workOrder: workOrderCreation,
        projects: this.projects,
        vendors: this.vendors,
        statePageSize: this.pageSize,
        statePageIndex: this.pageIndex,
        displayPage: {
          workOrderNumber: this.workOrderNumber,
          selectedProject: this.selectedProject,
          selectedVendor: this.selectedVendor,
          selectedWoStatus: this.selectedStatus,
          selectedWorkOrderType: this.selectedWorkOrderType,
          customStartDate: this.customStartDate,
          customEndDate: this.customEndDate,
          selectWorkOrderCategory: this.selectWorkOrderCategory,
        },
      },
    });
  }
  generatePdf(workOrder: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to generate the Work Order PDF?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Generate',
      cancelButtonText: 'No, Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.showLoading();
        let workOrderStatus = workOrder.actionStatus || 'Create';
        this.workOrderCreationService
          .generatePdfWithWaterMark(workOrder.workOrderId, workOrderStatus)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (filePath) => {
              this.hideLoading();
              Swal.fire({
                title: 'Work Order PDF Generated',
                text: 'Work Order PDF Generated Successfully!',
                icon: 'success',
                showCancelButton: true,
                showDenyButton: true,
                confirmButtonText: 'Download',
                denyButtonText: 'View PDF',
                cancelButtonText: 'Close',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.downloadDocument(filePath);
                } else if (result.isDenied) {
                  this.viewDocument(filePath);
                }
              });
            },
            error: (error: Error) => {
              this.handleErrorResponse(error);
              this.hideLoading();
            },
          });
      }
    });
  }

  onDocumentPageChange(event: any) {
    this.documentPageSize = event.pageSize;
    this.documentPageIndex = event.pageIndex;
    this.getDocumentsBasedOnId(this.workOrderId);
  }
}
