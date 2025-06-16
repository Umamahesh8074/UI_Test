import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
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
import { NAVIGATE_TO_ADD_WORK_ORDER_HEADER } from 'src/app/Constants/WorkOrder/workorder';
import { IWorkOrderHeader } from 'src/app/Models/WorkOrder/WorkOrderHeader';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { WorkOrderHeaderService } from 'src/app/Services/WorkOrderService/WorkOrderHeader/WorkOrderHeader.service';

@Component({
  selector: 'display-work-order-header',
  templateUrl: './display-work-order-header.component.html',
  styleUrls: ['./display-work-order-header.component.css'],
})
export class DisplayWorkOrderHeaderComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  headerName: string = '';
  workOrderHeaderData: IWorkOrderHeader[] = [];

  //pagination
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  displayedColumns: string[] = [
    'rowNumber',
    'headerName',
    'headerTermsAndConditions',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    this.getDataFromState();
    this.getAllWorkOrderHeaders();
    this.workOrderHeaderService.refreshRequired.subscribe(() => {
      this.getAllWorkOrderHeaders();
    });
  }
  constructor(
    private workOrderHeaderService: WorkOrderHeaderService,
    private router: Router,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private loaderService: LoaderService
  ) {}

  getDataFromState() {
    const { statePageSize, statePageIndex } = history.state;
    console.log(statePageIndex, statePageSize);
    if (statePageSize && statePageIndex !== undefined) {
      this.pageSize = statePageSize;
      this.pageIndex = statePageIndex;
    }
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllWorkOrderHeaders();
  }

  getAllWorkOrderHeaders() {
    this.showLoading();
    this.workOrderHeaderService
      .getAllWorkOrderHeaders(this.headerName, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (workOrderHeaders) => {
          this.totalItems = workOrderHeaders.totalRecords;
          this.paginator.pageIndex = this.pageIndex;
          this.paginator.pageSize = this.pageSize;
          this.workOrderHeaderData = workOrderHeaders.records;
          this.hideLoading();
        },
        error: (error: Error) => {
          console.error('Error fetching prime activity code:', error);
          this.hideLoading();
        },
      });
  }

  onSearch(headerName: string) {
    if (
      headerName.length >= searchTextLength ||
      headerName.length === searchTextZero
    ) {
      this.headerName = headerName;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllWorkOrderHeaders();
    }
  }

  openConfirmDialog(workOrderHeaderId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Work Order Header' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteWorkOrderHeader(workOrderHeaderId);
        }
      }
    );
  }

  deleteWorkOrderHeader(workOrderHeaderId: number) {
    this.showLoading();
    this.workOrderHeaderService
      .inActivateWorkOrder(workOrderHeaderId)
      .subscribe({
        next: (response: any) => {
          this.handleSuccessResponse(response);
          this.hideLoading();
        },
        error: (error: Error) => {
          console.error('Error deleting prime activity code:', error);
          this.hideLoading();
        },
      });
  }

  AddWorkOrderHeader() {
    this.router.navigate([NAVIGATE_TO_ADD_WORK_ORDER_HEADER], {
      state: {
        isAdding: true,
        statePageSize: this.pageSize,
        statePageIndex: this.pageIndex,
      },
    });
  }

  editWorkOrderHeader(workOrderHeaderData: any) {
    this.fetchWorkOrderHeaderById(workOrderHeaderData.id);
  }

  fetchWorkOrderHeaderById(workOrderHeaderId: number) {
    this.showLoading();
    this.workOrderHeaderService
      .getWorkOrderHeaderById(workOrderHeaderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (workOrderHeaderData) => {
          this.hideLoading();
          this.router.navigate([NAVIGATE_TO_ADD_WORK_ORDER_HEADER], {
            state: {
              workOrderHeaderData: workOrderHeaderData,
              isAdding: false,
              statePageSize: this.pageSize,
              statePageIndex: this.pageIndex,
            },
          });
        },
        error: (error) => {
          console.error('Error fetching prime activity code by id:', error);
          this.hideLoading();
        },
      });
  }

  handleSuccessResponse(response: any): void {
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
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
