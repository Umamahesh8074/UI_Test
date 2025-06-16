import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IWorkOrderBillingQuantities } from 'src/app/Models/WorkOrder/WorkOrderBilling';
import { IWorkOrdersQuantitiesDto } from 'src/app/Models/WorkOrder/WorkOrderCreation';

@Component({
  selector: 'app-workorder-quantity',
  templateUrl: './workorder-quantity.component.html',
  styleUrls: ['./workorder-quantity.component.css'],
})
export class WorkOrderQuantityComponent {
  @Input() workOrderQuantitiesDto:
    | IWorkOrdersQuantitiesDto[]
    | IWorkOrderBillingQuantities[] = [];

  @Input() pageIndex: number = 0;
  @Input() pageSize: number = 15;

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
    'rate',
    'value',
    'gstWithAmount',
    'wbsElements',
    'budgetQuantity',
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
