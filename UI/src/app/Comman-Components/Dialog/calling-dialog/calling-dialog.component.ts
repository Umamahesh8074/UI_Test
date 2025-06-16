import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-calling-dialog',
  templateUrl: './calling-dialog.component.html',
  styleUrls: ['./calling-dialog.component.css'],
})
export class CallingDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CallingDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { customerName?: string; phoneNumber?: string }
  ) {}
}
