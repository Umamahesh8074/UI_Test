import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'wob-additional-info',
  templateUrl: './wob-additional-info.component.html',
  styleUrls: ['./wob-additional-info.component.css'],
})
export class WorkOrderBillingAdditionalInfo implements OnInit {
  public dialogRef: MatDialogRef<WorkOrderBillingAdditionalInfo> | undefined;

  displayedColumns: string[] = [];
  @Input() workOrderBilling: any;

  constructor() {}

  ngOnInit(): void {}
}
