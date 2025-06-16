import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
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
  NAVIGATE_TO_ADD_AND_EDIT_WORK_ORDER_Header_CREATION,
  NAVIGATE_TO_REWORK_WORK_ORDER,
  NAVIGATE_TO_WORK_ORDER_CREATION,
} from 'src/app/Constants/WorkOrder/workorder';
import {
  IWorkOrderHeader,
  WorkOrderHeader,
} from 'src/app/Models/WorkOrder/WorkOrderHeader';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { WorkOrderCreationService } from 'src/app/Services/WorkOrderService/WorkOrderCreation/WorkOrderCreation.service';
import { WorkOrderHeaderService } from 'src/app/Services/WorkOrderService/WorkOrderHeader/WorkOrderHeader.service';

@Component({
  selector: 'add-wo-header',
  templateUrl: './add-wo-header.component.html',
  styleUrls: ['./add-wo-header.component.css'],
})
export class AddWoHeaderComponent implements OnInit {
  private destroy$ = new Subject<void>();
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  workOrderId: number = 0;
  formData!: FormGroup;
  showAdditionalFields: any[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  workOrder: any;
  workOrderStatus: string = '';
  headerId: number = 0;
  tcId: number = 0;
  headerName: string = '';
  headers: IWorkOrderHeader[] = [];
  header: any = new FormControl([] as IWorkOrderHeader[]);
  selectedHeader: IWorkOrderHeader = new WorkOrderHeader();
  termsAndConditions: any[] = [];
  displayPageData: any;
  statePageSize: number = 0;
  statePageIndex: number = 0;

  displayedColumns: string[] = [
    'id',
    'headerName',
    'headerOrder',
    'headerTermsAndConditions',
    'actions',
  ];

  ngOnInit(): void {
    this.getDataFromState();
    this.fetchHeaders();
  }

  constructor(
    private woCreationService: WorkOrderCreationService,
    private loaderService: LoaderService,
    public dialog: MatDialog,
    private workOrderHeaderService: WorkOrderHeaderService,
    private workOrderTermsAndConService: WorkOrderHeaderService,
    private router: Router
  ) {}

  getDataFromState() {
    const {
      workOrder,
      statePageSize,
      statePageIndex,
      stateHeaderId,
      stateSelectedHeader,
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

    if (stateHeaderId) {
      this.headerId = stateHeaderId;
    }
    if (stateSelectedHeader) {
      this.header.patchValue(stateSelectedHeader);
    }
    if (workOrderStatus) {
      this.workOrderStatus = workOrderStatus;
    }

    this.loadDetails();
    this.workOrderTermsAndConService.refreshRequired.subscribe(() => {
      this.loadDetails();
    });
  }

  loadDetails() {
    this.showLoading();
    this.workOrderTermsAndConService
      .getWorkOrderTermsAndConditionsByWorkOrderId(
        this.workOrderId,
        this.pageIndex,
        this.pageSize,
        this.headerId,
        this.tcId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respose) => {
          this.termsAndConditions = respose.records;
          this.totalItems = respose.totalRecords;
          this.paginator.pageIndex = this.pageIndex;
          this.paginator.pageSize = this.pageSize;
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
  AddWoHeader() {
    this.router.navigate(
      [NAVIGATE_TO_ADD_AND_EDIT_WORK_ORDER_Header_CREATION],
      {
        state: {
          isAdding: true,
          title: 'ADD WORK ORDER HEADER',
          workOrderCreationDto: this.workOrder,
          workOrderStatus: this.workOrderStatus,
          pageSize: this.pageSize,
          pageIndex: this.pageIndex,
          statePageSize: this.statePageSize,
          statePageIndex: this.statePageIndex,
          displayPage: this.displayPageData,
        },
      }
    );
  }

  gotoWo() {
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
      data: { displayedData: 'delete Work Order Header' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteWorkOrderHeader(workOrderId);
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

  deleteWorkOrderHeader(id: number) {
    this.workOrderHeaderService
      .deleteWorkOrderTermsAndConditions(id)
      .subscribe({
        next: (response) => {
          console.log('Deleted successfully:', response);
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }
  editWoHeader(workOrderHeader: any) {
    this.fetchWorkOrderById(workOrderHeader.woId, workOrderHeader.id);
  }

  fetchWorkOrderById(workOrderId: number, headerId: number) {
    this.workOrderTermsAndConService
      .getWorkOrderTermsAndConditionsByWorkOrderId(
        workOrderId,
        this.pageIndex,
        this.pageSize,
        headerId,
        this.tcId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const workOrderHeader = response;
          console.log(workOrderHeader);
          this.router.navigate(
            [NAVIGATE_TO_ADD_AND_EDIT_WORK_ORDER_Header_CREATION],
            {
              state: {
                workOrderHeader: workOrderHeader.records,
                workOrderCreationDto: this.workOrder,
                title: 'EDIT WORK ORDER HEADER',
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                statePageSize: this.statePageSize,
                statePageIndex: this.statePageIndex,
                headerId: this.headerId,
                selectedHeader: this.selectedHeader,
                stateTotalItems: this.totalItems,
                workOrderStatus: this.workOrderStatus,
                isAdding: false,
                displayPage: this.displayPageData,
              },
            }
          );
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  fetchHeaders() {
    this.workOrderHeaderService
      .getWorkOrderTermsAndConditionsWithOutPagination(
        this.workOrderId,
        this.headerName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (woHeaders) => {
          const allOption = new WorkOrderHeader();
          allOption.id = 0;
          allOption.headerName = 'All';
          this.headers = [allOption, ...woHeaders];
        },
        error: (error: Error) => {
          console.error('Error fetching woHeaders:', error);
        },
      });
  }

  displayHeader(woHeader: IWorkOrderHeader) {
    return woHeader && woHeader.headerName ? woHeader.headerName : '';
  }

  searchHeader(serviceCode: any) {
    const query = serviceCode.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.headerName = query;
      this.fetchHeaders();
    }
    if (query.length === searchTextZero) {
      this.headerId = 0;
      this.loadDetails();
    }
  }

  onHeaderSelect(serviceCode: any) {
    this.headerId = serviceCode.option.value.id;
    this.tcId = serviceCode.option.value.id;
    this.headerName = serviceCode.option.value;
    this.selectedHeader = serviceCode.option.value;
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    this.loadDetails();
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }

  AddOrEditHeader() {
    this.fetchWorkOrderById(this.termsAndConditions[0].woId, 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  clearForm() {
    this.formData.reset();
  }
}
