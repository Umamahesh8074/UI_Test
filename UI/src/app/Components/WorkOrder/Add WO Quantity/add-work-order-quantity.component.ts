import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { tickStep } from 'd3';
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
import {
  NAVIGATE_TO_ADD_AND_EDIT_WORK_ORDER,
  NAVIGATE_TO_REWORK_WORK_ORDER,
  NAVIGATE_TO_WORK_ORDER_CREATION,
} from 'src/app/Constants/WorkOrder/workorder';
import {
  IServiceCodeDto,
  ServiceCodeDto,
} from 'src/app/Models/WorkOrder/ServiceCode';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { ServiceCodeService } from 'src/app/Services/WorkOrderService/ServiceCode/ServiceCode.service';
import { WorkOrderCreationService } from 'src/app/Services/WorkOrderService/WorkOrderCreation/WorkOrderCreation.service';

@Component({
  selector: 'add-work-order-quantity',
  templateUrl: './add-work-order-quantity.component.html',
  styleUrls: ['./add-work-order-quantity.component.css'],
})
export class AddWoQuantityComponent implements OnInit {
  private destroy$ = new Subject<void>();
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  workOrderId: number = 0;
  workOrderQuantitiesData: any;
  formData!: FormGroup;
  showAdditionalFields: any[] = [];
  workOrderCreation: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  workOrder: any;
  workOrderStatus: string = '';
  displayPageData: any;

  serviceCodeId: number = 0;
  serviceCodeName: string = '';
  serviceCodes: IServiceCodeDto[] = [];
  serviceCode: any = new FormControl([] as IServiceCodeDto[]);
  selectedServicecode: IServiceCodeDto = new ServiceCodeDto();

  statePageSize: number = 0;
  statePageIndex: number = 0;

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
    'gstWithAmount',
    'budgetQuantity',
    'actions',
  ];

  displayedColumnsAmendment: string[] = [
    'id',
    'serviceCode',
    'serviceDescription',
    'scUomRefValue',
    'serviceGroupCode',
    'primeActivityNumber',
    'quantity',
    'amendmentQuantity',
    'totalQuantity',
    'rate',
    'value',
    'totalAmountWthGstAfterAmendment',
    'actions',
  ];

  ngOnInit(): void {
    this.getDataFromState();
    this.fetchServiceCodes();
  }

  constructor(
    private woCreationService: WorkOrderCreationService,
    private loaderService: LoaderService,
    public dialog: MatDialog,
    private serviceCodeService: ServiceCodeService,
    private router: Router
  ) {}

  getDataFromState() {
    const {
      workOrder,
      statePageSize,
      statePageIndex,
      stateServiceCodeId,
      stateSelectedServicecode,
      workOrderStatus,
      activePageIndex,
      activePageSize,
      displayPage,
    } = history.state;

    if (workOrder) {
      this.workOrderId = workOrder.workOrderId;
      this.workOrder = workOrder;
    }

    if (displayPage) {
      this.displayPageData = displayPage;
    }

    if (activePageSize && activePageIndex !== undefined) {
      this.pageSize = activePageSize;
      this.pageIndex = activePageIndex;
    }

    this.statePageSize = statePageSize;
    this.statePageIndex = statePageIndex;

    if (stateServiceCodeId) {
      this.serviceCodeId = stateServiceCodeId;
    }
    if (stateSelectedServicecode) {
      this.serviceCode.patchValue(stateSelectedServicecode);
    }
    if (workOrderStatus) {
      this.workOrderStatus = workOrderStatus;
    }

    this.loadDetails();
    this.woCreationService.refreshRequired.subscribe(() => {
      this.loadDetails();
    });
  }

  loadDetails() {
    this.showLoading();
    this.woCreationService
      .getWorkorderQuantitiesDtoById(
        this.workOrderId,
        this.pageIndex,
        this.pageSize,
        this.serviceCodeId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respose) => {
          console.log(respose.records);
          this.totalItems = respose.totalRecords;
          this.paginator.pageIndex = this.pageIndex;
          this.paginator.pageSize = this.pageSize;

          this.workOrderQuantitiesData = respose.records;
          this.hideLoading();
        },
        error: (error) => {
          console.error('Error fetching work order quantities:', error);
          this.hideLoading();
        },
      });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadDetails();
  }
  AddWoQuantity() {
    this.router.navigate([NAVIGATE_TO_ADD_AND_EDIT_WORK_ORDER], {
      state: {
        isAdding: true,
        title: 'ADD WORK ORDER QUANTITY',
        workOrderCreationDto: this.workOrder,
        workOrderStatus: this.workOrderStatus,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        statePageSize: this.statePageSize,
        statePageIndex: this.statePageIndex,
        displayPage: this.displayPageData,
      },
    });
  }

  gotoWo() {
    console.log(this.workOrder);
    if (this.workOrder?.actionStatus) {
      if (
        this.workOrder.actionStatus === 'Pending' ||
        this.workOrder.actionStatus === ''
      ) {
        this.router.navigate([NAVIGATE_TO_WORK_ORDER_CREATION], {
          state: {
            statePageSize: this.statePageSize,
            statePageIndex: this.statePageIndex,
            displayPageData: this.displayPageData,
          },
        });
      } else if (
        this.workOrder.actionStatus === 'Rework' ||
        this.workOrder.actionStatus === 'Amendment' ||
        this.workOrder.actionStatus === 'Approved' ||
        this.workOrder.actionStatus === 'Reworking' ||
        this.workOrder.actionStatus === 'Amendment Rework Editing' ||
        this.workOrder.actionStatus === 'Amendment Rework'
      ) {
        this.router.navigate([NAVIGATE_TO_REWORK_WORK_ORDER], {
          state: {
            statePageSize: this.statePageSize,
            statePageIndex: this.statePageIndex,
            displayPageData: this.displayPageData,
          },
        });
      }
    } else if (this.workOrderStatus) {
      if (this.workOrderStatus === 'Create') {
        this.router.navigate([NAVIGATE_TO_WORK_ORDER_CREATION], {
          state: {
            statePageSize: this.statePageSize,
            statePageIndex: this.statePageIndex,
            displayPageData: this.displayPageData,
          },
        });
      }
    } else {
      this.router.navigate([NAVIGATE_TO_WORK_ORDER_CREATION], {
        state: {
          statePageSize: this.statePageSize,
          statePageIndex: this.statePageIndex,
          displayPageData: this.displayPageData,
        },
      });
    }
  }

  openConfirmDialog(workOrderId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Work Order Quantity' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteWorkOrderQuantity(workOrderId);
        }
      }
    );
  }

  deleteWorkOrderQuantity(woQId: number) {
    this.woCreationService.deleteWorkOrderQuantity(woQId).subscribe({
      next: (response) => {
        console.log('Deleted successfully:', response);
      },
      error: (error: Error) => {
        console.error(error);
      },
    });
  }
  editWoQty(workOrderCreation: any) {
    this.workOrderStatus = workOrderCreation.actionStatus;
    this.fetchWorkOrderById(
      workOrderCreation.workOrderCreationId,
      workOrderCreation.workOrderQuantityid
    );
  }

  fetchWorkOrderById(workOrderCreationId: number, workOrderQuantityid: number) {
    this.showLoading();
    this.woCreationService
      .getWOById(
        workOrderCreationId,
        workOrderQuantityid,
        this.pageIndex,
        this.pageSize,
        this.serviceCodeId
      )
      .subscribe({
        next: (response) => {
          const workOrderCreationDto = response;
          this.router.navigate([NAVIGATE_TO_ADD_AND_EDIT_WORK_ORDER], {
            state: {
              workOrderCreationDto: workOrderCreationDto,
              title: 'EDIT WORK ORDER QUANTITY',
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
              statePageSize: this.statePageSize,
              statePageIndex: this.statePageIndex,
              serviceCodeId: this.serviceCodeId,
              selectedServicecode: this.selectedServicecode,
              stateTotalItems: this.totalItems,
              workOrderStatus: workOrderCreationDto.actionStatus,
              isAdding: false,
              displayPage: this.displayPageData,
            },
          });
          this.hideLoading();
        },
        error: (error: Error) => {
          this.hideLoading();
        },
      });
  }

  fetchServiceCodes(): void {
    this.serviceCodeService
      .getServiceCodeDtosWithOutPage(this.serviceCodeName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (serviceCodes) => {
          const allOption = new ServiceCodeDto();
          allOption.serviceCodeId = 0;
          allOption.serviceCode = 'All';
          this.serviceCodes = [allOption, ...serviceCodes];
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }
  displayServiceCode(serviceCode: any) {
    return serviceCode && serviceCode.serviceCode
      ? serviceCode.serviceCode
      : '';
  }
  onServiceCodeSelect(serviceCode: any) {
    this.serviceCodeId = serviceCode.option.value.serviceCodeId;
    this.serviceCodeName = serviceCode.option.value;
    this.selectedServicecode = serviceCode.option.value;
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    this.loadDetails();
  }
  searchServiceCode(serviceCode: any) {
    const query = serviceCode.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.serviceCodeName = query;
      this.fetchServiceCodes();
    }
    if (query.length === searchTextZero) {
      this.serviceCodeId = 0;
      this.loadDetails();
    }
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }

  AddOrEditQuantity() {
    this.fetchWorkOrderById(
      this.workOrderQuantitiesData[0].workOrderCreationId,
      0
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  clearForm() {
    this.formData.reset();
  }

  get hasAmendment1(): boolean {
    if (this.workOrderQuantitiesData) {
      return this.workOrderQuantitiesData.some(
        (q: any) =>
          q.workOrderQuantityStatus &&
          q.workOrderQuantityStatus.includes('Amendment')
      );
    } else {
      return false;
    }
  }
}
