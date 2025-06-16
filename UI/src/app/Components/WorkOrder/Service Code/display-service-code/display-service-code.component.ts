import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { NAVIGATE_TO_ADD_SERVICE_CODE } from 'src/app/Constants/WorkOrder/workorder';
import { IServiceCodeDto } from 'src/app/Models/WorkOrder/ServiceCode';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { ServiceCodeService } from 'src/app/Services/WorkOrderService/ServiceCode/ServiceCode.service';

@Component({
  selector: 'display-service-code',
  templateUrl: './display-service-code.component.html',
  styleUrls: ['./display-service-code.component.css'],
  encapsulation: ViewEncapsulation.None, // Set ViewEncapsulation to None
})
export class DisplayServiceCodeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  serviceCodeData: IServiceCodeDto[] = [];

  //pagination
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  serviceCode: string = '';
  serviceCodeName: string = '';
  serviceGroupCode: string = '';
  sacCode: string = '';
  serviceUOM: string = '';
  serviceCodeDes: string = '';
  primeActivityCode = '';

  displayedColumns: string[] = [
    'rowNumber',
    'serviceCode',
    'serviceGroupName',
    'serviceGroupCode',
    'serviceCodeDescription',
    'sacCode',
    'serviceUom',
    'primeActivityCode',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    this.getDataFromState();
    this.getAllServiceCodes();
    this.serviceCodeService.refreshRequired.subscribe(() => {
      this.getAllServiceCodes();
    });
  }

  constructor(
    private serviceCodeService: ServiceCodeService,
    private router: Router,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private loaderService: LoaderService
  ) {}

  getDataFromState() {
    const { statePageSize, statePageIndex } = history.state;
    if (statePageSize && statePageIndex !== undefined) {
      this.pageSize = statePageSize;
      this.pageIndex = statePageIndex;
    }
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllServiceCodes();
  }

  getAllServiceCodes() {
    this.showLoading();
    this.serviceCodeService
      .getAllServiceCode(
        this.serviceCode,
        this.serviceCodeName,
        this.serviceGroupCode,
        this.sacCode,
        this.serviceUOM,
        this.primeActivityCode,
        this.serviceCodeDes,
        this.pageIndex,
        this.pageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (serviceCodeData) => {
          this.totalItems = serviceCodeData.totalRecords;
          this.paginator.pageIndex = this.pageIndex;
          this.paginator.pageSize = this.pageSize;
          this.serviceCodeData = serviceCodeData.records;
          this.hideLoading();
        },
        error: (error: Error) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }

  onSearch(serviceCode: string) {
    if (
      serviceCode.length >= searchTextLength ||
      serviceCode.length === searchTextZero
    ) {
      this.serviceCode = serviceCode;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllServiceCodes();
    }
  }

  openConfirmDialog(serviceCodeId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Service Code' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.inactiveServiceCode(serviceCodeId);
        }
      }
    );
  }

  inactiveServiceCode(serviceCodeId: number) {
    this.showLoading();
    this.serviceCodeService.inActivateServiceCode(serviceCodeId).subscribe({
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

  AddServiceCode() {
    this.router.navigate([NAVIGATE_TO_ADD_SERVICE_CODE], {
      state: {
        isAdding: true,
        statePageSize: this.pageSize,
        statePageIndex: this.pageIndex,
      },
    });
  }

  editServiceCode(serviceCode: any) {
    this.fetchServiceCodeById(serviceCode.serviceCodeId);
  }

  fetchServiceCodeById(serviceCodeId: number) {
    this.showLoading();
    this.serviceCodeService
      .getServiceCodeServiceById(serviceCodeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (serviceCodeData) => {
          this.hideLoading();
          this.router.navigate([NAVIGATE_TO_ADD_SERVICE_CODE], {
            state: {
              serviceCode: serviceCodeData,
              isAdding: false,
              statePageSize: this.pageSize,
              statePageIndex: this.pageIndex,
            },
          });
        },
        error: (error) => {
          console.error(error);
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

  onNameSearch(searchText: string) {
    if (
      searchText.length >= searchTextLength ||
      searchText.length === searchTextZero
    ) {
      this.serviceCodeName = searchText;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllServiceCodes();
    }
  }

  onServiceGroupSearch(searchText: string) {
    if (
      searchText.length >= searchTextLength ||
      searchText.length === searchTextZero
    ) {
      this.serviceGroupCode = searchText;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllServiceCodes();
    }
  }

  onSacCodeSearch(searchText: string) {
    if (
      searchText.length >= searchTextLength ||
      searchText.length === searchTextZero
    ) {
      this.sacCode = searchText;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllServiceCodes();
    }
  }

  onServiceUOMSearch(searchText: string) {
    if (searchText.length >= 1 || searchText.length === searchTextZero) {
      this.serviceUOM = searchText;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllServiceCodes();
    }
  }

  onServiceCodeDesSearch(searchText: string) {
    if (
      searchText.length >= searchTextLength ||
      searchText.length === searchTextZero
    ) {
      this.serviceCodeDes = searchText;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllServiceCodes();
    }
  }

  onPrimeActivityCode(searchText: string) {
    if (
      searchText.length >= searchTextLength ||
      searchText.length === searchTextZero
    ) {
      this.primeActivityCode = searchText;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllServiceCodes();
    }
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
