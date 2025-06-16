import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {
  PAGE_INDEX,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { IIndentItems } from 'src/app/Models/Procurement/indentDto';

@Component({
  selector: 'app-indent-items',
  templateUrl: './indentitems.component.html',
  styleUrls: ['./indentitems.component.css'],
})
export class IndentItemComponent implements OnInit {
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = 20;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  @Input() indentItems: IIndentItems[] = [];
  dataSource: MatTableDataSource<IIndentItems> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayColumns: string[] = [
    'id',
    'materialCode',
    'category',
    'subCategory',
    'specification',
    'itemUnit',
    'quantity',
  ];

  ngOnInit(): void {}

  constructor() {}
}
