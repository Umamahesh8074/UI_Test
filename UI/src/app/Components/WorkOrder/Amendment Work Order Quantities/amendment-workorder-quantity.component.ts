import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  PAGE_INDEX,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { IWorkOrderBillingQuantities } from 'src/app/Models/WorkOrder/WorkOrderBilling';
import { IWorkOrdersQuantitiesDto } from 'src/app/Models/WorkOrder/WorkOrderCreation';

@Component({
  selector: 'app-amendment-workorder-quantity',
  templateUrl: './amendment-workorder-quantity.component.html',
  styleUrls: ['./amendment-workorder-quantity.component.css'],
})
export class AmendmentWorkOrderQuantityComponent {
  //pagination
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = 20;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  @Input() workOrderQuantitiesDto:
    | IWorkOrdersQuantitiesDto[]
    | IWorkOrderBillingQuantities[] = [];

  dataSource: MatTableDataSource<
    IWorkOrdersQuantitiesDto | IWorkOrderBillingQuantities
  > = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'id',
    'serviceCode',
    'serviceDescription',
    'scUomRefValue',
    'serviceGroupCode',
    'primeActivityNumber',
    'quantity',
    'amendmentQuantity',
    'totalQuantity',
    'rate',
    'value',
    'totalAmountWthGstAfterAmendment',
    'workOrderQuantityStatus',
    'quantityOrder',
  ];

  ngOnInit() {
    this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['workOrderQuantitiesDto']) {
      this.loadData();
    }
  }

  loadData() {
    this.dataSource.data = this.workOrderQuantitiesDto;
    this.dataSource.paginator = this.paginator;
  }
}
