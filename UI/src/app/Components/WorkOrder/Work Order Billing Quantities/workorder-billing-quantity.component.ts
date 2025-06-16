import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  PAGE_INDEX,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';

@Component({
  selector: 'app-workorder-billing-quantity',
  templateUrl: './workorder-billing-quantity.component.html',
  styleUrls: ['./workorder-billing-quantity.component.css'],
})
export class WorkOrderBillingQuantitiesComponent {
  //pagination
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = 20;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  private _workOrderBillingData: any[] = [];

  @Input()
  set workOrderBillingData(data: any[]) {
    this._workOrderBillingData = data;
    this.loadData();
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'serviceCode',
    'serviceDescription',
    'scUomRefValue',
    'serviceGroupCode',
    'primeActivityNumber',
    'quantity',
    'rate',
    'value',
    'wbsElements',
    'budgetQuantity',
    'releasedTillPrevious',
    'currentPeriod',
    'cumulative',
    'balance',
    'workOrderBillingQuantityStatus',
    'quantityOrder',
  ];

  ngOnInit() {
    this.loadData();
  }
  constructor() {
    console.log(this._workOrderBillingData);
  }

  loadData() {
    console.log(this._workOrderBillingData);
    this.dataSource.data = this._workOrderBillingData;
    this.totalItems = this._workOrderBillingData.length;
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.paginator.pageSize = this.pageSize;
    }
    this.updateDisplayedData();
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updateDisplayedData();
  }

  updateDisplayedData() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.dataSource.data = this._workOrderBillingData.slice(
      startIndex,
      endIndex
    );
  }
}
