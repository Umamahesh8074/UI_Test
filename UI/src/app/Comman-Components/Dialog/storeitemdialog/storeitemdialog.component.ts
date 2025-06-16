import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';

@Component({
  selector: 'app-storeitemdialog',
  templateUrl: './storeitemdialog.component.html',
  styleUrls: ['./storeitemdialog.component.css'],
})
export class StoreItemDialogComponent implements OnInit {
  displayedData: string = '';
  pageSizeOptions = pageSizeOptions;
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;

  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  public dialogRef: MatDialogRef<StoreItemDialogComponent> | undefined;

  displayedStoreColumns: string[] = [
    'rowNumber',
    'projectName',
    'storeName',
    'materialType',
    'categoryName',
    'subCategoryName',
    'specificationName',
    'unitName',
    'storeInventory',
  ];
  storeItems: any = [];
  status: string = '';

  constructor(
    dialogRef: MatDialogRef<StoreItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogRef = dialogRef;
  }

  ngOnInit(): void {
    console.log('StoreItemDialogComponent initialized with data:', this.data);
    this.storeItems = this.data.records;
    this.status = this.data.status;
  }

  onCancelDialog(status: string) {
    console.log('close');
    this.onClose.emit(false);
    this.dialogRef?.close({ status: 'cancel' });
  }

  raiseIndent() {
    this.onClose.emit(false);
    this.dialogRef?.close({ status: 'raise' });
  }

  onPageChange(event: any) {}
}
