import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  NAVIGATE_TO_ADD_WORK_ORDER_CREATION,
  NAVIGATE_TO_REWORK_WORK_ORDER,
  NAVIGATE_TO_WORK_ORDER_CREATION,
  WorkOrderStatus,
} from 'src/app/Constants/WorkOrder/workorder';
import { IProject, Project } from 'src/app/Models/Project/project';
import { IVendor, Vendor } from 'src/app/Models/WorkOrder/VendorData';
import { IStagesDto } from 'src/app/Models/WorkOrder/WorkOrderBilling';
import {
  IWorkOrdersDataDto,
  WorkOrdersDataDto,
} from 'src/app/Models/WorkOrder/WorkOrderCreation';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { WorkOrderAmountService } from 'src/app/Services/WorkOrderService/WorkOrderAmount/WorkOrderAmount.service';
import { WorkOrderCreationService } from 'src/app/Services/WorkOrderService/WorkOrderCreation/WorkOrderCreation.service';

@Component({
  selector: 'display-work-order',
  templateUrl: './display-work-order-details.component.html',
  styleUrls: ['./display-work-order-details.component.css'],
})
export class DisplayWorkOrderDetailsComponent implements OnInit {
  private destroy$ = new Subject<void>();
  formData!: FormGroup;
  workOrder: IWorkOrdersDataDto = new WorkOrdersDataDto();
  status: string = '';
  selectStatus: string = '';
  totalValue: number = 0;
  workOrderStatus: string = '';
  workOrderAmount: any;
  workOrderId: number = 0;
  workOrderQuantities: any;
  previousworkOrderQuantities: any;

  //pagination
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  totalItems1: number = TOTAL_ITEMS;
  pageSize1: number = PAGE_SIZE;
  pageIndex1: number = PAGE_INDEX;
  pageSizeOptions1 = pageSizeOptions;

  projects: IProject[] = [];
  vendors: IVendor[] = [];
  isLoading: boolean = false;
  stages: IStagesDto[] = [];

  displayPageData: any;
  stateProjects: IProject = new Project();
  stateVendors: IVendor = new Vendor();
  statePageSize: number = 0;
  statePageIndex: number = 0;
  openDialog: boolean | undefined;

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

  displayedColumns1: string[] = [
    'id',
    'workOrderStatus',
    'stageOrder',
    'totalAmount',
    'totalAmountWithGst',
  ];

  ngOnInit(): void {
    this.getDataFromState();
  }
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private workOrderCreationService: WorkOrderCreationService,
    private workOrderAmountService: WorkOrderAmountService,
    private loaderService: LoaderService,
    private sanitizer: DomSanitizer
  ) {}

  getDataFromState() {
    const {
      workOrderData: workOrder,
      status,
      displayPage,
      stateProjects,
      stateVendors,
      stages,
      statePageSize,
      statePageIndex,
    } = history.state;

    this.workOrder = workOrder;

    if (status) this.status = status;

    console.log(displayPage);

    if (displayPage) {
      this.displayPageData = displayPage;
    }
    console.log(this.displayPageData);
    if (stateProjects) {
      this.stateProjects = stateProjects;
    }
    if (stateVendors) {
      this.stateVendors = stateVendors;
    }
    this.statePageSize = statePageSize;
    this.statePageIndex = statePageIndex;

    if (stages) {
      this.stages = stages;
    }

    if (workOrder.workOrderId) {
      this.workOrderId = workOrder.workOrderId;
      this.loadDetails();
    }
  }

  gotoApprovals() {
    if (this.status.includes(WorkOrderStatus.REWORK)) {
      this.router.navigate([NAVIGATE_TO_REWORK_WORK_ORDER], {
        state: {
          selectStatus: this.selectStatus,
          displayPageData: this.displayPageData,
          statePageSize: this.statePageSize,
          statePageIndex: this.statePageIndex,
        },
      });
    } else {
      this.router.navigate([NAVIGATE_TO_WORK_ORDER_CREATION], {
        state: {
          selectStatus: this.selectStatus,
          displayPageData: this.displayPageData,
          statePageSize: this.statePageSize,
          statePageIndex: this.statePageIndex,
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //added new

  ModifyApprovedWo(workOrder: IWorkOrdersDataDto) {
    const id = workOrder.workOrderId;
    let status = 'amendment';
    this.workOrderStatus = workOrder.actionStatus;
    this.fetchWorkOrderCreationById(id, status);
  }

  loadDetails() {
    this.showLoading();
    forkJoin({
      quantities: this.workOrderCreationService.getWorkorderQuantitiesDtoById(
        this.workOrderId,
        this.pageIndex,
        this.pageSize,
        0
      ),
      previousQuantities:
        this.workOrderCreationService.getPreviousWorkorderQuantitiesDtoById(
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

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }

  fetchWorkOrderCreationById(workOrderCreationId: number, status: string) {
    this.showLoading();
    this.isLoading = true;
    this.workOrderCreationService
      .getWorkOrderCreationById(workOrderCreationId, status)
      .subscribe({
        next: (response) => {
          const workOrderCreationDto = response;
          this.router.navigate([NAVIGATE_TO_ADD_WORK_ORDER_CREATION], {
            state: {
              workOrderCreationDto: workOrderCreationDto,
              isAdding: false,
              isForView: true,
              workOrderStatus: this.workOrderStatus,
              title: 'AMENDMENT WORK ORDER',
              status: 'Approved',
              projects: this.stateProjects,
              vendors: this.stateVendors,
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

  hasValidStages(): boolean {
    return (
      !!this.stages &&
      Array.isArray(this.stages) &&
      this.stages.some((stage) => stage && stage.stageId !== null)
    );
  }
  openAmountModel(workOrderId: number) {
    this.workOrderId = workOrderId;
    this.openDialog = true;
    this.fetchWorkOrderAmountData();
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

  onClose() {
    this.openDialog = false;
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
}
