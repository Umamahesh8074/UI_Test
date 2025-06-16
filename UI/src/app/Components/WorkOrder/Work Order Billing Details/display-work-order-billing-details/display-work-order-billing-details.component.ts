import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  NAVIGATE_TO_REWORK_WORK_ORDER_BILLING,
  NAVIGATE_TO_WORK_ORDER_BILLING,
  WorkOrderStatus,
} from 'src/app/Constants/WorkOrder/workorder';
import {
  IWorkOrderBillingsData,
  WorkOrderBillingsData,
} from 'src/app/Models/WorkOrder/WorkOrderBilling';
import { WorkOrderBillingAdditionalInfo } from '../../Work Order Billing/wob-additional_info/wob-additional-info.component';

@Component({
  selector: 'display-work-order-billing',
  templateUrl: './display-work-order-billing-details.component.html',
  styleUrls: ['./display-work-order-billing-details.component.css'],
})
export class DisplayWorkOrderBillingDetailsComponent implements OnInit {
  private destroy$ = new Subject<void>();
  formData!: FormGroup;
  workOrderBillingsData: any;
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  status: string = '';
  selectStatus: string = '';
  stages: any;
  displayPageData: any;

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

  displayedStageColumns: string[] = [
    'stageId',
    'stageName',
    'stageOrder',
    'actionDoneBy',
    'actionDate',
    'woReceivedDate',
    'stageStatus',
    'actionComments',
  ];

  ngOnInit(): void {
    this.getDataFromState();
  }
  constructor(public dialog: MatDialog, private router: Router) {}

  getDataFromState() {
    const {
      workOrderData: workOrder,
      status,
      selectStatus,
      stages,
      displayPage,
    } = history.state;

    if (stages) {
      this.stages = stages;
    }

    if (displayPage) {
      this.displayPageData = displayPage;
    }

    if (status) {
      this.status = status;
      this.selectStatus = selectStatus;
    }
    if (workOrder) {
      this.workOrderBillingsData = workOrder;
      this.totalItems = workOrder.workOrderBillingQuantities.length;
    }
    console.log(this.workOrderBillingsData);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  viewAdditionalInfo() {
    const dialogRef = this.dialog.open(WorkOrderBillingAdditionalInfo, {
      width: '80%',
      height: '500px',
      data: { workOrderBilling: this.workOrderBillingsData },
    });
  }

  gotoApprovals() {
    if (this.status.includes(WorkOrderStatus.REWORK)) {
      this.router.navigate([NAVIGATE_TO_REWORK_WORK_ORDER_BILLING], {
        state: {
          selectStatus: this.selectStatus,
          displayPageData: this.displayPageData,
        },
      });
    } else {
      this.router.navigate([NAVIGATE_TO_WORK_ORDER_BILLING], {
        state: {
          selectStatus: this.selectStatus,
          displayPageData: this.displayPageData,
        },
      });
    }
  }

  hasValidStages(): boolean {
    return (
      !!this.workOrderBillingsData &&
      Array.isArray(this.workOrderBillingsData.stagesDto) &&
      this.workOrderBillingsData.stagesDto.some(
        (stage: any) => stage && stage.stageId !== null
      )
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
