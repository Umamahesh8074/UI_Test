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

@Component({
  selector: 'app-appprovedialog',
  templateUrl: './approvedialog.component.html',
  styleUrls: ['./approvedialog.component.css'],
})
export class ApproveDialogComponent implements OnInit {
  displayedData: string = '';
  remarks: string = '';
  @Output() onClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  // @Output() onClose: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('remarksTextarea') remarksTextarea!: ElementRef;
  ngOnInit(): void {}

  public dialogRef: MatDialogRef<ApproveDialogComponent> | undefined;

  constructor(
    dialogRef: MatDialogRef<ApproveDialogComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA)
    public data: { displayedData: string; isFromBilling: boolean }
  ) {
    this.dialogRef = dialogRef;
    // this.displayedData = data.displayedData;
  }

  onCancelDialog(status: string) {
    console.log('close');
    this.onClose.emit(false);
    this.dialogRef?.close({ status: 'cancel' });
  }

  onCloseDialog() {
    this.onClose.emit(false);
    this.dialogRef?.close({ status: 'cancel' });
  }

  onApprove() {
    this.onClose.emit(false);
    this.dialogRef?.close({ remarks: this.remarks });
  }

  ngAfterViewInit() {
    this.autoResizeRemarks();
  }
  autoResizeRemarks() {
    const textarea = this.remarksTextarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
