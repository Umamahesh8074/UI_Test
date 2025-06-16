import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  PAGE_INDEX,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { IStagesDto } from 'src/app/Models/WorkOrder/WorkOrderBilling';

@Component({
  selector: 'app-workorder-stage',
  templateUrl: './workorder-stage.component.html',
  styleUrls: ['./workorder-stage.component.css'],
})
export class WorkOrderStageComponent {
  //pagination
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = 3;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  @Input() stagesDto: any[] = [];
  @Input() status: string | undefined;

  // Data source for the table
  dataSource: MatTableDataSource<IStagesDto> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator; // Non-null assertion

  displayedStageColumns: string[] = [
    'stageId',
    'stageName',
    'stageOrder',
    'actionDoneBy',
    'woReceivedDate',
    'actionDate',
    'stageStatus',
    'actionComments',
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.dataSource.data = this.stagesDto;
    this.totalItems = this.stagesDto.length;
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
    this.dataSource.data = this.stagesDto.slice(startIndex, endIndex);
  }
}
