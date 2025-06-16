import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApproveDialogComponent } from 'src/app/Comman-Components/Dialog/approvaldialog/approvedialog.component';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  NAVIGATE_TO_PENDING_WORK_ORDER_BILLING,
  NAVIGATE_TO_WORK_ORDER_BILLING_APPROVALS_APPROVEDORREJECTED,
  NAVIGATE_TO_WORK_ORDER_BILLINGS,
  WorkOrderStatus,
} from 'src/app/Constants/WorkOrder/workorder';
import {
  IWorkOrderBillingsDto,
  WorkOrderBillingsDto,
} from 'src/app/Models/WorkOrder/WorkOrderBilling';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { ApprovalsService } from 'src/app/Services/ProcurementService/Approvals/approvals.service';
@Component({
  selector: 'work-order-billing-approval',
  templateUrl: './work-order-billing-approval.component.html',
  styleUrls: ['./work-order-billing-approval.component.css'],
})
export class WorkOrderBillingApprovalComponent implements OnInit {
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  formData!: FormGroup;
  workOrder: IWorkOrderBillingsDto = new WorkOrderBillingsDto();
  remarks: string = '';
  userId: number = 0;
  workFlowTypeId: number = 0;
  user: any;
  panelOpenState = false;

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
    'releasedTillPrevious',
    'currentPeriod',
    'cumulative',
    'balance',
  ];

  //pagination
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  displayPageData: any;

  //work order show is fro creating
  status: string = '';
  stages: any;
  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.getDataFromState();
  }
  constructor(
    public dialog: MatDialog,
    private approvalsService: ApprovalsService,
    private router: Router,
    private commonService: CommanService,
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

    if (displayPage) {
      this.displayPageData = displayPage;
    }
    if (workOrder) {
      this.workOrder = workOrder;
      this.workFlowTypeId = workOrder.workflowTypeId;
      this.totalItems = workOrder.workOrderBillingQuantities.length;
    }
  }
  //getting user from local storage to set organization id
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
      data: { isFromBilling: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { status, remarks } = result;
        this.remarks = remarks;
        if (remarks && status !== WorkOrderStatus.CANCEL) {
          this.updateApprovalStatus(statuss);
          this.updateBillingStatus(this.workOrder.workOrderBillingId);
        }
      }
    });
  }

  updateBillingStatus(billingId: number) {
    this.commonService.updateBillingStatus(billingId).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error: Error) => {
        console.log(error);
      },
    });
  }

  updateApprovalStatus(status: string) {
    this.showLoading();
    this.approvalsService
      .updateApprovalStatus(
        this.workOrder.workOrderBillingId,
        this.workFlowTypeId,
        this.userId,
        status,
        this.remarks
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.hideLoading();
          this.router.navigate([NAVIGATE_TO_PENDING_WORK_ORDER_BILLING]);
        },
        error: (err) => {
          console.error('Error updating Approvals', err);
          this.hideLoading();
        },
      });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }
  gotoApprovals() {
    const navigateTo =
      this.status === WorkOrderStatus.PENDING
        ? NAVIGATE_TO_PENDING_WORK_ORDER_BILLING
        : this.status === WorkOrderStatus.REJAPPROVED
        ? NAVIGATE_TO_WORK_ORDER_BILLING_APPROVALS_APPROVEDORREJECTED
        : this.status.includes(WorkOrderStatus.CREATE)
        ? NAVIGATE_TO_WORK_ORDER_BILLINGS
        : null;

    if (navigateTo) {
      this.router.navigate([navigateTo], {
        state: {
          displayPageData: this.displayPageData,
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
