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
import { NAVIGATE_TO_ADD_SAC_CODE } from 'src/app/Constants/WorkOrder/workorder';
import { ISacCode } from 'src/app/Models/WorkOrder/SacCode';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { SacCodeService } from 'src/app/Services/WorkOrderService/SacCode/SacCode.service';

@Component({
  selector: 'display-sac-code',
  templateUrl: './display-sac-code.component.html',
  styleUrls: ['./display-sac-code.component.css'],
})
export class DisplaySacCodeComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  sacCode: string = '';
  sacCodeDes: string = '';
  sacCodeData: ISacCode[] = [];

  //pagination
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  displayedColumns: string[] = [
    'rowNumber',
    'sacCode',
    'sacCodeDescription',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    this.getDataFromState();
    this.getAllSacCodes();
    this.sacCodeService.refreshRequired.subscribe(() => {
      this.getAllSacCodes();
    });
  }
  constructor(
    private sacCodeService: SacCodeService,
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
    this.getAllSacCodes();
  }

  getAllSacCodes() {
    this.showLoading();
    this.sacCodeService
      .getAllSacCodes(
        this.sacCode,
        this.sacCodeDes,
        this.pageIndex,
        this.pageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sacCodes) => {
          this.totalItems = sacCodes.totalRecords;
          this.paginator.pageIndex = this.pageIndex;
          this.paginator.pageSize = this.pageSize;
          this.sacCodeData = sacCodes.records;
          this.hideLoading();
        },
        error: (error: Error) => {
          console.error('Error fetching prime activity code:', error);
          this.hideLoading();
        },
      });
  }

  onSearch(sacCode: string) {
    if (
      sacCode.length >= searchTextLength ||
      sacCode.length === searchTextZero
    ) {
      this.sacCode = sacCode;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllSacCodes();
    }
  }

  openConfirmDialog(sacCodeId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Prime Activity Code' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteSacCode(sacCodeId);
        }
      }
    );
  }

  deleteSacCode(sacCodeId: number) {
    this.showLoading();
    this.sacCodeService.inActivateSacCode(sacCodeId).subscribe({
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

  AddSacCode() {
    this.router.navigate([NAVIGATE_TO_ADD_SAC_CODE], {
      state: {
        isAdding: true,
        statePageSize: this.pageSize,
        statePageIndex: this.pageIndex,
      },
    });
  }

  editSacCode(sacCodeData: any) {
    this.fetchSacCodeById(sacCodeData.id);
  }

  fetchSacCodeById(sacCodeId: number) {
    this.showLoading();
    this.sacCodeService
      .getSacCodeById(sacCodeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sacCodeData) => {
          this.hideLoading();
          this.router.navigate([NAVIGATE_TO_ADD_SAC_CODE], {
            state: {
              sacCodeData: sacCodeData,
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

  onSacDescrptionSearch(searchText: any) {
    if (
      searchText.length >= searchTextLength ||
      searchText.length === searchTextZero
    ) {
      this.sacCodeDes = searchText;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllSacCodes();
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
