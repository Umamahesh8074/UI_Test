import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-inventory-transfer-popup',
  templateUrl: './inventory-transfer-popup.component.html',
  styleUrls: ['./inventory-transfer-popup.component.css'],
})
export class InventoryTransferPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<InventoryTransferPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
