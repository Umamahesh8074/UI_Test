import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { ApproveDialogComponent } from 'src/app/Comman-Components/Dialog/approvaldialog/approvedialog.component';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  NAVIGATE_TO_WORK_ORDER_APPROVALS_APPROVEDORREJECTED,
  NAVIGATE_TO_WORK_ORDER_APPROVALS_PENDING,
  NAVIGATE_TO_WORK_ORDER_CREATION,
  WorkOrderStatus,
} from 'src/app/Constants/WorkOrder/workorder';
import { IProject, Project } from 'src/app/Models/Project/project';
import { IVendor, Vendor } from 'src/app/Models/WorkOrder/VendorData';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { ApprovalsService } from 'src/app/Services/ProcurementService/Approvals/approvals.service';
import { WorkOrderAmountService } from 'src/app/Services/WorkOrderService/WorkOrderAmount/WorkOrderAmount.service';
import { WorkOrderCreationService } from 'src/app/Services/WorkOrderService/WorkOrderCreation/WorkOrderCreation.service';
import { WorkOrderHeaderService } from 'src/app/Services/WorkOrderService/WorkOrderHeader/WorkOrderHeader.service';

@Component({
  selector: 'work-order-approval',
  templateUrl: './work-order-approval.component.html',
  styleUrls: ['./work-order-approval.component.css'],
})
export class WorkOrderApprovalComponent implements OnInit {
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  formData!: FormGroup;
  workOrder: any;
  workOrderId: number = 0;
  remarks: string = '';
  userId: number = 0;
  workFlowTypeId: number = 0;
  user: any;
  workOrderQuantities: any;
  previousworkOrderQuantities: any;
  status: string = '';
  totalValue: number = 0;
  openDialog: boolean | undefined;
  workOrderAmount: any;
  stages: any;
  openTermAndCondDialog: boolean | undefined;
  project: IProject = new Project();
  vendor: IVendor = new Vendor();
  displayPageData: any;
  termsAndConditions: any;

  //pagination
  totalItems1: number = TOTAL_ITEMS;
  pageSize1: number = PAGE_SIZE;
  pageIndex1: number = PAGE_INDEX;
  pageSizeOptions1 = pageSizeOptions;

  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  //documents pagination
  headerTotalItems: number = TOTAL_ITEMS;
  headerPageSize: number = 15;
  headerPageIndex: number = PAGE_INDEX;
  headerPageSizeOptions = pageSizeOptions;

  displayedColumns: string[] = [
    'id',
    'serviceCode',
    'serviceDescription',
    'scUomRefValue',
    'serviceGroupCode',
    'primeActivityNumber',
    'quantity',
    'rate',
    'value',
    'wbsElements',
    'budgetQuantity',
  ];

  displayedColumns1: string[] = [
    'id',
    'workOrderStatus',
    'stageOrder',
    'totalAmount',
    'totalAmountWithGst',
  ];

  displayedTermsAndConditions: string[] = [
    'id',
    'headerName',
    'headerOrder',
    'headerTermsAndConditions',
  ];

  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.getDataFromState();
  }
  constructor(
    public dialog: MatDialog,
    private approvalsService: ApprovalsService,
    private router: Router,
    private commonService: CommanService,
    private workOrderAmountService: WorkOrderAmountService,
    private workOrderTermsAndConService: WorkOrderHeaderService,
    private woCreationService: WorkOrderCreationService,
    private toastrService: ToastrService,
    private sanitizer: DomSanitizer,
    private loaderService: LoaderService
  ) {}
  getDataFromState() {
    const {
      workOrderData: workOrder,
      status,
      stages,
      displayPage,
    } = history.state;
    if (status) {
      this.status = status;
    }
    if (stages) {
      this.stages = stages;
    }
    if (workOrder) {
      this.workOrder = workOrder;
      this.workOrderId = workOrder.workOrderId;
      this.workFlowTypeId = workOrder.workFlowTypeId;
    }
    if (this.workOrderId > 0) {
      this.loadDetails();
    }
    if (displayPage) {
      this.displayPageData = displayPage;
    }
  }

  loadDetails() {
    this.showLoading();
    forkJoin({
      quantities: this.woCreationService.getWorkorderQuantitiesDtoById(
        this.workOrderId,
        this.pageIndex,
        this.pageSize,
        0
      ),
      previousQuantities:
        this.woCreationService.getPreviousWorkorderQuantitiesDtoById(
          this.workOrderId,
          this.pageIndex1,
          this.pageSize1,
          0
        ),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ quantities, previousQuantities }) => {
          this.workOrderQuantities = quantities.records;
          this.totalItems = quantities.totalRecords;
          this.previousworkOrderQuantities = previousQuantities.records;
          this.totalItems1 = previousQuantities.totalRecords;
          this.hideLoading();
        },
        error: (err) => {
          console.error(err);
          this.hideLoading();
        },
        complete: () => {
          this.hideLoading();
        },
      });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadDetails();
  }

  onPreviousQuantitiesPageChange(event: any) {
    this.pageSize1 = event.pageSize;
    this.pageIndex1 = event.pageIndex;
    this.loadDetails();
  }

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.user = user;
      this.userId = user.userId;
    }
  }

  approvalStatus(statuss: string) {
    const dialogRef = this.dialog.open(ApproveDialogComponent, {
      width: '40%',
      height: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { status, remarks } = result;
        this.remarks = remarks;
        if (remarks && status !== WorkOrderStatus.CANCEL) {
          this.updateApprovalStatus(statuss);
        }
      }
    });
  }

  updateWorkOrderQuantityStatus(workOrderId: number, status: string) {
    if (status !== 'Approval') {
      this.commonService.updateQuantityStatus(workOrderId, status).subscribe({
        next: (data) => {},
        error: (error: Error) => {
          console.error(error);
        },
      });
    }
  }

  updateApprovalStatus(status: string) {
    this.showLoading();
    this.approvalsService
      .updateApprovalStatus(
        this.workOrder.workOrderId,
        this.workFlowTypeId,
        this.userId,
        status,
        this.remarks
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.handleSuccessResponse(status);
          this.hideLoading();
          this.router.navigate([NAVIGATE_TO_WORK_ORDER_APPROVALS_PENDING]);
        },
        error: (err) => {
          this.handleErrorResponse(status);
          console.error('Error updating Approvals', err);
          this.hideLoading();
        },
      });
  }

  gotoApprovals() {
    const navigateTo =
      this.status === WorkOrderStatus.PENDING
        ? NAVIGATE_TO_WORK_ORDER_APPROVALS_PENDING
        : this.status === WorkOrderStatus.REJAPPROVED
        ? NAVIGATE_TO_WORK_ORDER_APPROVALS_APPROVEDORREJECTED
        : this.status.includes(WorkOrderStatus.CREATE)
        ? NAVIGATE_TO_WORK_ORDER_CREATION
        : null;

    if (navigateTo) {
      this.router.navigate([navigateTo], {
        state: {
          displayPageData: this.displayPageData,
          isFromViewWorkOrder: true,
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openAmountModel(workOrderId: number) {
    this.workOrderId = workOrderId;
    this.openDialog = true;
    this.fetchWorkOrderAmountData();
  }

  openTermsAdnConditionsModel(workOrderId: number) {
    this.openTermAndCondDialog = true;
    this.getWorkOrderTermsAndConditionsByWorkOrderId(workOrderId);
    // this.workOrderTermsAndConService
    //   .getWorkOrderTermsAndConditionsByWorkOrderId(
    //     workOrderId,
    //     this.headerPageIndex,
    //     this.headerPageSize,
    //     0,
    //     0
    //   )
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe({
    //     next: (response) => {
    //       this.termsAndConditions = response.records;
    //       this.headerTotalItems = response.totalRecords;
    //       console.log('termsAndConditions', this.termsAndConditions);
    //     },
    //     error: (error: Error) => {
    //       console.error(error);
    //     },
    //   });
  }

  getWorkOrderTermsAndConditionsByWorkOrderId(workOrderId: number) {
    this.workOrderTermsAndConService
      .getWorkOrderTermsAndConditionsByWorkOrderId(
        workOrderId,
        this.headerPageIndex,
        this.headerPageSize,
        0,
        0
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.termsAndConditions = response.records;
          this.headerTotalItems = response.totalRecords;
          console.log('termsAndConditions', this.termsAndConditions);
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  fetchWorkOrderAmountData() {
    this.workOrderAmountService
      .fetchWorkOrderAmount(this.pageIndex, this.pageSize, this.workOrderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.workOrderAmount = response.records;
        },
      });
  }

  onHeaderPageChange(event: any) {
    this.headerPageSize = event.pageSize;
    this.headerPageIndex = event.pageIndex;
    this.getWorkOrderTermsAndConditionsByWorkOrderId(this.workOrderId);
  }

  onClose() {
    this.openDialog = false;
  }
  onCloseTermsAndCond() {
    this.openTermAndCondDialog = false;
  }

  //toaster methods
  handleSuccessResponse(response: string): void {
    if (response === 'Approval') {
      this.successToaster('Your Work Order is Approved Successfully.');
    } else if (response === 'Rework') {
      this.successToaster('Your Work Order is Moved to Rework Successfully.');
    } else if (response === 'Rejected') {
      this.successToaster('Your Work Order is Rejected Successfully.');
    } else {
      this.successToaster('Successfully Updated Work Order');
    }
  }
  successToaster(response: string): void {
    this.toastrService.success('', response, {
      timeOut: 4000,
    });
  }
  handleErrorResponse(response: string): void {
    if (response === 'Approval') {
      this.errorToaster('Error While Approving Work Order.');
    } else if (response === 'Rework') {
      this.errorToaster('Error While Moving Work Order to Rework.');
    } else if (response === 'Rejected') {
      this.errorToaster('Error While Rejecting Work Order.');
    } else {
      this.errorToaster('Error Updating Work Order');
    }
  }
  errorToaster(response: string): void {
    this.toastrService.error('', response, {
      timeOut: 4000,
    });
  }

  get hasAmendment(): boolean {
    if (this.previousworkOrderQuantities) {
      return this.previousworkOrderQuantities.some(
        (q: any) =>
          q.workOrderQuantityStatus &&
          q.workOrderQuantityStatus.includes('Amendment')
      );
    } else {
      return false;
    }
  }

  get hasAmendment1(): boolean {
    if (this.workOrderQuantities) {
      return this.workOrderQuantities.some(
        (q: any) =>
          q.workOrderQuantityStatus &&
          q.workOrderQuantityStatus.includes('Amendment')
      );
    } else {
      return false;
    }
  }

  getSanitizedHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
