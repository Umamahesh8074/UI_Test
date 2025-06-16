import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Subject, takeUntil } from 'rxjs';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { IWorkOrderAmount } from 'src/app/Models/WorkOrder/WorkOrderAmount';
import { WorkOrderAmountService } from 'src/app/Services/WorkOrderService/WorkOrderAmount/WorkOrderAmount.service';

@Component({
  selector: 'app-work-order-amount',
  templateUrl: './workorder-amount.component.html',
  styleUrls: ['./workorder-amount.component.css'],
})
export class WorkOrderAmountComponent implements OnInit {
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  private destroy$ = new Subject<void>();

  dataSource: MatTableDataSource<IWorkOrderAmount> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Input() workOrderAmount: IWorkOrderAmount[] = [];

  @Input() openDialog: boolean | undefined;
  @Input() workOrderId: number = 0;

  constructor(private workOrderAmountService: WorkOrderAmountService) {}

  ngOnInit(): void {
    this.loadData();
  }

  displayedColumns: string[] = [
    'id',
    'workOrderStatus',
    'stageOrder',
    'totalAmount',
  ];

  loadData() {
    console.log(this.workOrderId);
    this.fetchWorkOrderAmountData();
  }

  fetchWorkOrderAmountData() {
    this.workOrderAmountService
      .fetchWorkOrderAmount(this.pageIndex, this.pageSize, this.workOrderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response.records);
          this.dataSource.data = response.records;
        },
      });
  }

  onClose() {
    this.openDialog = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
