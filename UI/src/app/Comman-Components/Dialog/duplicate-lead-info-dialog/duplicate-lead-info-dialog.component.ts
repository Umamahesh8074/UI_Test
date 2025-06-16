import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-duplicate-lead-info-dialog',
  templateUrl: './duplicate-lead-info-dialog.component.html',
  styleUrls: ['./duplicate-lead-info-dialog.component.css']
})
export class DuplicateLeadInfoDialogComponent {
  
  displayedColumns: string[] = [
    'opportunityId',
    'name',
    'projectName',
    'sourceName',
    'status',
    'createdDate',
  ];
  constructor(
    @Inject(MAT_DIALOG_DATA) public leadHistories: any,
    public dialogRef: MatDialogRef<DuplicateLeadInfoDialogComponent>
  ) {}
  onClose(): void {
    this.dialogRef.close();
  }

}
