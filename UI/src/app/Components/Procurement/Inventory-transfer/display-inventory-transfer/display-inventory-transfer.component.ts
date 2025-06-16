import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { isValidDate } from '@fullcalendar/core/internal';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { InventoryTransferDto } from 'src/app/Models/Procurement/InventoryTransfer';
import { transferType } from 'src/app/Models/Procurement/itemunit';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { InventoryTransferService } from 'src/app/Services/ProcurementService/Inventory-transfer/inventory-transfer.service';
import { InventoryTransferPopupComponent } from '../inventory-transfer-popup/inventory-transfer-popup.component';

@Component({
  selector: 'app-display-inventory-transfer',
  templateUrl: './display-inventory-transfer.component.html',
  styleUrls: ['./display-inventory-transfer.component.css'],
})
export class DisplayInventoryTransferComponent {
  private destroy$ = new Subject<void>();
  inventoryTransferDto: InventoryTransferDto[] = [];
  itemName: string = '';
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  formData!: FormGroup;
  dateRange: any = '';
  customStartDate: any = '';
  customEndDate: any = '';
  public loggedInUserId: number = 0;
  transferTypes: transferType[] = [
    {
      id: 1,
      transferType: 'Site',
    },
    {
      id: 2,
      transferType: 'Store',
    },
  ];
  displayedColumns: string[] = [
    'rowNumber',
    'materialCode',
    'TransferType',
    'FromStore',
    'ToStore',
    'ToSite',
    'TransferDate',
    'QuantityTransferred',
    'TransferredBy',
    'ReceivedBy',
    'Remarks',
    'actions',
  ];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  //pagination

  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.initForm();

    this.patchData();
  }
  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.loggedInUserId = user.userId;
      if (this.loggedInUserId) {
        this.getInventoryTransfer();
      }
    }
    // if (this.loggedInUserId > 0) {
    //   this.inventoryTransferService.refreshRequired.subscribe(() => {
    //     this.getInventoryTransfer();
    //   });
    // }
  }
  patchData() {
    this.itemName = history.state.displayPage.searchedName;
  }

  constructor(
    private inventoryTransferService: InventoryTransferService,
    private router: Router,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private commonService: CommanService
  ) {}
  onSearch(itemName: any) {
    this.itemName = itemName;
    this.pageIndex = 0;
    this.paginator.firstPage();
    if (itemName.length >= 3) {
      this.getInventoryTransfer();
    } else if (itemName.length == 0) {
      this.itemName = '';
      this.getInventoryTransfer();
    }
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getInventoryTransfer();
  }

  getInventoryTransfer() {
    console.log(this.loggedInUserId);
    this.inventoryTransferService
      .getAllInventoryTransfers(
        this.pageIndex,
        this.pageSize,
        this.itemName,
        this.customStartDate,
        this.customEndDate,
        this.loggedInUserId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (inventoryTransfer) => {
          this.inventoryTransferDto = inventoryTransfer.records;
          console.log(this.inventoryTransferDto);

          this.totalItems = inventoryTransfer.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ///opening confirm dialog
  openConfirmDialog(leadSourceId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'Inventory Transfer' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteInventoryTransfer(leadSourceId);
        }
      }
    );
  }

  deleteInventoryTransfer(transferId: number) {
    this.inventoryTransferService
      .deleteInventoryTransfer(transferId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  //adding menu
  addInventoryTransfer() {
    this.router.navigate(['layout/procurement/inventorytransfer'], {
      state: {
        isAdding: true,
        displayPage: {
          searchedName: this.itemName,
        },
      },
    });
  }

  editInventoryTransfer(inventoryTransfer: any) {
    console.log(inventoryTransfer);
    this.router.navigate(['layout/procurement/inventorytransfer'], {
      state: {
        inventoryTransfer: inventoryTransfer,
        displayPage: {
          searchedName: this.itemName,
        },
      },
    });
  }

  onDateChange() {
    this.pageIndex = 0;
    this.paginator.firstPage();
    const startDate = this.formData.get('customStartDate')?.value;
    const endDate = this.formData.get('customEndDate')?.value;
    if (startDate !== null && endDate !== null) {
      this.dateRange = '';
      this.getInventoryTransfer();
    } else {
      this.dateRange = 0;
    }
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      customStartDate: [],
      customEndDate: [],
    });
    this.formData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formDataValue) => {
        if (formDataValue.customStartDate && formDataValue.customEndDate) {
          const startDate = this.formatDateTime(formDataValue.customStartDate);
          const endDate = this.formatDateTime(
            formDataValue.customEndDate,
            true
          );
          this.customStartDate = startDate;
          this.customEndDate = endDate;
          // this.getInventoryTransfer();
        }
      });
  }

  formatDateTime(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }

  clearDateRange(): void {
    this.formData.get('customStartDate')?.setValue('');
    this.formData.get('customEndDate')?.setValue('');
    this.customStartDate = '';
    this.customEndDate = '';
    this.getInventoryTransfer();
  }


   openDetailsPopup(row: any): void {
      const dialogRef = this.dialog.open(
        InventoryTransferPopupComponent,
        {
          width: '860px', // ← Increase from 400px to 600px (or more)
          maxWidth: '120vw', // ← Optional: prevent it from growing too large
          data: row,
        }
      );
  
      dialogRef.afterClosed().subscribe((result) => {
        console.log('Dialog closed');
        // Implement any actions after dialog close, like refreshing data.
      });
    }
  
  resetForm() {}
}
