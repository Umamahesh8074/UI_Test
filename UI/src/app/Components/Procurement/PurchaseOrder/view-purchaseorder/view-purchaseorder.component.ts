import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, takeUntil } from 'rxjs';
import { ReusableComponent } from 'src/app/Comman-Components/base-component/base.component';
import { ApproveDialogComponent } from 'src/app/Comman-Components/Dialog/approvaldialog/approvedialog.component';
import {
  PAGE_INDEX,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { Charges } from 'src/app/Models/Procurement/charges';
import { IndentItems } from 'src/app/Models/Procurement/indentDto';
import { IStagesDto } from 'src/app/Models/WorkOrder/WorkOrderBilling';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { ApprovalsService } from 'src/app/Services/ProcurementService/Approvals/approvals.service';
import { IndentService } from 'src/app/Services/ProcurementService/Indent/indent.service';
import { QuotationService } from 'src/app/Services/ProcurementService/Quotation/quotation.service';

@Component({
  selector: 'app-view-purchaseorder',
  templateUrl: './view-purchaseorder.component.html',
  styleUrls: ['./view-purchaseorder.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ViewPurchaseOrderComponent
  extends ReusableComponent
  implements OnInit
{
  quotationData: any;
  quotationItems: any[] = [];
  indentItems: IndentItems[] = [];
  charges: Charges[] = [];
  quotationId: number = 0;
  indentId: number = 0;
  purchaseOrderId: number = 0;
  stages: IStagesDto[] = [];
  routeStatus: string = '';
  remarks: string = '';
  expanded: boolean[] = [];
  indentStages: IStagesDto[] = [];
  workflowTypeId: number = 0;
  panelOpenState = false;
  indentTotalItems: number = 0;
  isLoading: boolean = false;
  displayPageData: any;
  displayApprovedQuotationPage: any;
  termsAndConditions: any;

  //documents pagination
  termsAndConTotalItems: number = TOTAL_ITEMS;
  termsAndConPageSize: number = 15;
  termsAndConPageIndex: number = PAGE_INDEX;
  termsAndConPageSizeOptions = pageSizeOptions;

  displayedColumns: string[] = [
    'ItemId',
    'category',
    'subCategory',
    'specification',
    'unit',
    'cost',
    'quantity',
    'quotationItemCostWithOutGst',
    'gst',
    'discount',
    'quotationItemCostWithGst',
  ];

  openDialog: boolean | undefined;
  openQuotationDialog: boolean | undefined;
  quotationCharges: any[] = [];
  displayedStageColumns: string[] = [
    'stageId',
    'stageName',
    'stageOrder',
    'actionDoneBy',
    'woReceivedDate',
    'actionDate',
    'stageStatus',
    'actionComments',
  ];

  displayedColumnsTermsAndCon = ['rowNumber', 'termsAndConditions'];

  displayedColumns2: string[] = [
    'id',
    'transportCharge',
    'loadingCharge',
    'unLoadingCharge',
    'installationCharge',
    'otherCharge',
  ];

  ngOnInit(): void {
    super.setUserFromLocalStorage();
    this.getDataFromState();
    this.loadDetails();
  }

  constructor(
    private quotationService: QuotationService,
    commanService: CommanService,
    private indentService: IndentService,
    router: Router,
    private dialog: MatDialog,
    route: ActivatedRoute,
    private approvalsService: ApprovalsService,
    private loaderService: LoaderService
  ) {
    super(commanService, router, route);
  }

  getDataFromState() {
    const {
      purchaseOrder,
      routeStatus,
      displayPage,
      quotationId,
      quotation,
      displayApprovedQuotationPage,
    } = history.state;
    if (displayPage) {
      this.displayPageData = displayPage;
    }
    if (displayApprovedQuotationPage) {
      this.displayApprovedQuotationPage = displayApprovedQuotationPage;
    }
    if (quotationId) {
      this.quotationId = quotationId;
    }
    if (quotation) {
      this.quotationData = quotation;
    }

    if (purchaseOrder != null && purchaseOrder != undefined) {
      this.quotationData = purchaseOrder;
      this.indentTotalItems = this.indentItems.length;
      this.indentId = purchaseOrder.indentId;
      this.indentItems = purchaseOrder.indentItems;
      this.routeStatus = routeStatus;
      this.workflowTypeId = purchaseOrder.workflowTypeId;
      this.quotationId = purchaseOrder.quotationId;
      this.purchaseOrderId = purchaseOrder.purchaseOrderId;
      this.getTermsAndConBasedOnId();
    }
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  loadDetails() {
    this.showLoading();
    forkJoin({
      quotationData: this.quotationService.fetchQuotationBasedonQuotationId(
        this.quotationId,
        this.pageIndex,
        this.pageSize
      ),
      stages: this.quotationService.getStages(this.quotationId, this.userId),
      indentStages: this.indentService.getStages(this.indentId, this.userId),
      quotationCharges: this.quotationService.getQuotationCharges(
        this.quotationId
      ),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ quotationData, stages, indentStages, quotationCharges }) => {
          this.quotationItems = quotationData.records;
          this.totalItems = quotationData.totalRecords;
          this.stages = stages;
          this.indentStages = indentStages;
          this.quotationCharges = quotationCharges;
          this.hideLoading();
        },
        error: (err) => {
          console.error(err);
          this.hideLoading();
        },
        complete: () => {
          this.isLoading = false;
        },
      });
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
        if (remarks && status !== 'cancel') {
          this.updateApprovalStatus(statuss);
        }
      }
    });
  }

  updateApprovalStatus(status: string) {
    this.showLoading();
    this.approvalsService
      .updateApprovalStatus(
        this.purchaseOrderId,
        this.workflowTypeId,
        this.userId,
        status,
        this.remarks
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['layout/procurement/pending/purchase/order']);
          this.hideLoading();
        },
        error: (err) => {
          console.error('Error updating Approvals', err);
          this.hideLoading();
        },
      });
  }

  goBack() {
    switch (this.routeStatus) {
      case 'pending':
        this.router.navigate(['./pending/purchase/order'], {
          relativeTo: this.route.parent,
          state: {
            quotationId: this.quotationId,
            quotation: this.quotationData,
            displayPageData: this.displayPageData,
            displayApprovedQuotationPage: this.displayApprovedQuotationPage,
          },
        });
        break;
      case 'rework':
        this.router.navigate(['./app/rej/rework/purchase/order'], {
          relativeTo: this.route.parent,
          state: {
            quotationId: this.quotationId,
            quotation: this.quotationData,
            displayPageData: this.displayPageData,
            displayApprovedQuotationPage: this.displayApprovedQuotationPage,
          },
        });
        break;
      case 'create':
        this.router.navigate(['./display/po'], {
          relativeTo: this.route.parent,
          state: {
            quotationId: this.quotationId,
            quotation: this.quotationData,
            displayPageData: this.displayPageData,
            displayApprovedQuotationPage: this.displayApprovedQuotationPage,
          },
        });
        break;
      case 'approve':
        this.router.navigate(['./approved/rej/rework/po'], {
          relativeTo: this.route.parent,
          state: {
            quotationId: this.quotationId,
            quotation: this.quotationData,
            displayPageData: this.displayPageData,
            displayApprovedQuotationPage: this.displayApprovedQuotationPage,
          },
        });
        break;
    }
  }

  onTermsAndCondPageChange(event: any) {
    this.termsAndConPageSize = event.pageSize;
    this.termsAndConPageIndex = event.pageIndex;
    this.getTermsAndConBasedOnId();
  }

  getTermsAndConBasedOnId() {
    this.commanService
      .getTermsAndCond(
        this.quotationId,
        this.termsAndConPageIndex,
        this.termsAndConPageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.termsAndConditions = response.records;
          this.termsAndConTotalItems = response.totalRecords;
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  onClose() {
    this.openDialog = false;
  }
  onCloseQuotation() {
    this.openQuotationDialog = false;
  }
  viewIndent() {
    this.openDialog = true;
  }
  viewQuotation() {
    this.openQuotationDialog = true;
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
