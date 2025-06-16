import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { DomSanitizer } from '@angular/platform-browser';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';

@Component({
  selector: 'app-table',
  templateUrl: './table-component.html',
  styleUrls: ['./table-component.css'],
})
export class TableComponent<T> implements OnInit {
  @Input() pageSizeOptions = pageSizeOptions;
  @Input() displayedColumns: string[] = [];
  @Input() dataSource: T[] = [];
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 0;
  @Input() actionButtons: { label: string; icon: string; action: string }[] =
    [];
  @Input() pipes: { [key: string]: string } = {};

  // Custom header names passed from parent
  @Input() customHeaderNames: { [key: string]: string } = {};

  @Output() actionClicked = new EventEmitter<{ action: string; row: T }>();
  @Output() pageChanged = new EventEmitter<PageEvent>();

  @Input() columnStyles: { [column: string]: { [style: string]: string } } = {};

  onPageChange(event: PageEvent) {
    console.log('Page changed:', this.pageIndex, this.pageSize);
    this.pageChanged.emit(event);
  }

  onAction(action: string, row: T) {
    this.actionClicked.emit({ action, row });
  }
  constructor(
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {}

  getButtonColor(action: string): string {
    switch (action) {
      case 'edit':
        return '#004869';
      case 'delete':
        return '#d3493f';
      case 'approve':
        return 'purple';
      case 'send':
        return 'green';
      case 'files':
        return 'rgb(34, 34, 164)';
      case 'pdf':
        return '#d3493f';
      case 'pdfs':
        return '#d3493f';
      default:
        return '#000000';
    }
  }

  // Apply pipes based on column configuration
  applyPipe(value: any, column: string): any {
    const pipeType = this.pipes[column];
    switch (pipeType) {
      case 'date':
        return this.datePipe.transform(value, 'medium');
      case 'currency':
        return this.currencyPipe.transform(value, 'INR');
      default:
        return value;
    }
  }

  getColumnClass(column: string, element: any): string {
    if (column.toLowerCase().includes('status')) {
      if (element[column]?.toLowerCase() === 'approved') {
        return 'approved-column';
      }
      if (element[column]?.toLowerCase() === 'pending') {
        return 'pending-column';
      }
      if (element[column]?.toLowerCase() === 'rejected') {
        return 'rejected-column';
      }
      if (element[column]?.toLowerCase() === 'rework') {
        return 'rework-column';
      }
      if (element[column]?.toLowerCase() === 'reworking') {
        return 'rework-column';
      }

      if (element[column]?.toLowerCase() === 'po created') {
        return 'status-column ';
      }
    }

    if (column.toLowerCase().includes('quotationtype')) {
      if (element[column]?.toLowerCase() === 'new quotation') {
        return 'status-column ';
      }
      if (element[column]?.toLowerCase() === 'rework approval pending') {
        return 'rework-column ';
      }
      if (element[column]?.toLowerCase() === 'rework') {
        return 'rework-column ';
      }
    }

    if (
      column.toLowerCase().includes('amount') ||
      column.toLowerCase().includes('cost')
    ) {
      return 'amount-column';
    }
    return '';
  }

  hasAnyStatus(element: any): boolean {
    return !!(element.status || element.poStatus);
  }

  getStatus(element: any): string {
    return (element.status || element.poStatus || '').toLowerCase();
  }

  canShowButton(action: string, element: any): boolean {
    const status = this.getStatus(element);
    const allowedStatuses = ['rework', 'reworking', 'a', 'i'];
    const allowedStatus = ['reworking', 'a', 'i'];
    if (action === 'add') {
      const poGeneratedStatus = (element.poGeneratedStatus || '').toLowerCase();
      const poStatus = (element.poStatus || '').toLowerCase();
      return (!poGeneratedStatus && !poStatus) || poStatus === 'rejected';
    }
    if (action === 'send') {
      return !this.hasAnyStatus(element) || allowedStatus.includes(status);
    }

    if (action === 'edit') {
      return !this.hasAnyStatus(element) || allowedStatuses.includes(status);
    }
    return true;
  }
}
