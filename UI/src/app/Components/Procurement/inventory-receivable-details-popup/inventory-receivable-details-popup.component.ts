import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
} from 'src/app/Constants/CommanConstants/Comman';
import { InventoryReceivableService } from 'src/app/Services/ProcurementService/InventoryReceivable/inventory-receivable.service';

@Component({
  selector: 'app-inventory-receivable-details-popup',
  templateUrl: './inventory-receivable-details-popup.component.html',
  styleUrls: ['./inventory-receivable-details-popup.component.css'],
})
export class InventoryReceivableDetailsPopupComponent {
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  totalItems: number = 0;
  irData: any;
  inventoryReceivableData: any;
  inventoryReceivableHistory: any;
  formData!: FormGroup;
  irId: number = 0;
  private destroy$ = new Subject<void>();

  displayedColumns: string[] = [
    'rowNumber',
    'invoiceNumber',
    'invoiceDate',
    'invoiceAmount',
    'receivedDate',
    'quantityReceived',
    'pendingQuantity',
    'quantityExceed',
    'actions',
  ];

  constructor(
    public dialogRef: MatDialogRef<InventoryReceivableDetailsPopupComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private inventoryReceivableService: InventoryReceivableService
  ) {
    console.log(data);
    this.irData = data;
    this.getInventoryReceivableHistory();
    console.log(data);
  }

  getInventoryReceivableHistory() {
    this.inventoryReceivableService
      .getInventoryReceivableHistory(
        this.data.quotationItemId,
        this.irId,
        this.pageIndex,
        this.pageSize
      )
      .subscribe((response) => {
        this.inventoryReceivableHistory = response.records;
      });
  }

  editInventoryReceivable(inventory: any) {
    console.log('Inventory id taking ', inventory);
    this.getInventoryById(inventory.irhId).subscribe({
      next: (response) => {
        this.inventoryReceivableData = response;
        this.onClose();
        this.router.navigate(['layout/procurement/goodsedit'], {
          state: {
            inventoryReceivableData: this.inventoryReceivableData,
            inventory: this.irData,
          },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  getInventoryById(irId: number) {
    return this.inventoryReceivableService
      .getInventoryDetailsById(irId)
      .pipe(takeUntil(this.destroy$));
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    history.state.pageIndex = this.pageIndex;
    history.state.pageSize = this.pageSize;
    this.getInventoryReceivableHistory();
  }
  onClose(): void {
    this.dialogRef.close();
  }
}
