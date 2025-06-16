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
import { NAVIGATE_TO_ADD_PRIME_ACTIVITY } from 'src/app/Constants/WorkOrder/workorder';
import { IPrimeActivityCodeDto } from 'src/app/Models/WorkOrder/PrimeActivityCode';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { PrimeActivityCodeService } from 'src/app/Services/WorkOrderService/PrimeActivityCode/PrimeActivityCode.service';

@Component({
  selector: 'display-prime-activity-code',
  templateUrl: './display-prime-activity-code.component.html',
  styleUrls: ['./display-prime-activity-code.component.css'],
})
export class DisplayPrimeActivityCodeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  primeActivityNumber: string = '';
  primeActivityData: IPrimeActivityCodeDto[] = [];
  primeActivityDescription: any;
  primeActivityDescriptionCode: any;
  displayedColumns: string[] = [
    'rowNumber',
    'primeActivityNumber',
    'unitOfMeasure',
    'primeActivityDescription',
    'padCode',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    this.getDataFromState();
    this.getAllPrimeActivityCodes();
    this.primeActivityCodeService.refreshRequired.subscribe(() => {
      this.getAllPrimeActivityCodes();
    });
  }
  constructor(
    private primeActivityCodeService: PrimeActivityCodeService,
    private router: Router,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private loaderService: LoaderService
  ) {}

  getDataFromState() {
    const { statePageSize, statePageIndex,displayPageData } = history.state;
    if (statePageSize && statePageIndex !== undefined) {
      this.pageSize = statePageSize;
      this.pageIndex = statePageIndex;
    }
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    console.log('pageSize', this.pageSize);
    this.pageIndex = event.pageIndex;
    this.getAllPrimeActivityCodes();
  }

  getAllPrimeActivityCodes() {
    this.showLoading();
    this.primeActivityCodeService
      .getAllPrimeActivityCodes(
        this.primeActivityNumber,
        this.primeActivityDescription,
        this.primeActivityDescriptionCode,
        this.pageIndex,
        this.pageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (primeActivityCodes) => {
          this.totalItems = primeActivityCodes.totalRecords;
          this.paginator.pageIndex = this.pageIndex;
          this.paginator.pageSize = this.pageSize;
          this.primeActivityData = primeActivityCodes.records;
          this.hideLoading();
        },
        error: (error: Error) => {
          console.error('Error fetching prime activity code:', error);
          this.hideLoading();
        },
      });
  }

  onSearch(primeActivityNumber: string) {
    if (
      primeActivityNumber.length >= searchTextLength ||
      primeActivityNumber.length === searchTextZero
    ) {
      this.primeActivityNumber = primeActivityNumber;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllPrimeActivityCodes();
    }
  }

  openConfirmDialog(primeActivityCodeId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Prime Activity Code' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deletePrimeActivity(primeActivityCodeId);
        }
      }
    );
  }

  deletePrimeActivity(primeActivityCodeId: number) {
    this.showLoading();
    this.primeActivityCodeService
      .inActivatePrimeActivityCode(primeActivityCodeId)
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

  AddPrimeActivity() {
    this.router.navigate([NAVIGATE_TO_ADD_PRIME_ACTIVITY], {
      state: {
        isAdding: true,
        statePageSize: this.pageSize,
        statePageIndex: this.pageIndex,
      },
    });
  }

  editPrimeActivity(primeActivityNumberData: any) {
    this.fetchPrimeActivityCodeById(primeActivityNumberData.primeActivityId);
  }

  fetchPrimeActivityCodeById(primeActivityId: number) {
    this.showLoading();
    this.primeActivityCodeService
      .getPrimeActivityCodeById(primeActivityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (primeActivityCodeData) => {
          this.hideLoading();
          this.router.navigate([NAVIGATE_TO_ADD_PRIME_ACTIVITY], {
            state: {
              primeActivityCode: primeActivityCodeData,
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
  onDescrptionSearch(searchText: string) {
    if (
      searchText.length >= searchTextLength ||
      searchText.length === searchTextZero
    ) {
      this.primeActivityDescription = searchText;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllPrimeActivityCodes();
    }
  }
  onDescrptionCodeSearch(searchText: string) {
    if (searchText.length >= 1 || searchText.length === searchTextZero) {
      this.primeActivityDescriptionCode = searchText;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllPrimeActivityCodes();
    }
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
