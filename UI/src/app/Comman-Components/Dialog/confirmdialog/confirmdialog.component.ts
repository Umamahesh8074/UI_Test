import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmdialog',
  templateUrl: './confirmdialog.component.html',
  styleUrls: ['./confirmdialog.component.css'],
})
export class ConfirmdialogComponent implements OnInit {
  displayedData: string = '';
  @Output() isConfirmDelete: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  ngOnInit(): void {}

  public dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;

  constructor(
    dialogRef: MatDialogRef<ConfirmdialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { displayedData: string; isUpdate: boolean; title: string }
  ) {
    this.dialogRef = dialogRef;
    this.displayedData = data.displayedData;
  }

  onConfirmDialog() {
    this.isConfirmDelete.emit(true);
    this.dialogRef?.close();
  }

  onCancelDialog() {
    this.isConfirmDelete.emit(false);
    this.dialogRef?.close();
  }
}
