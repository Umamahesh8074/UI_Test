import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { TotalLeadsDto } from 'src/app/Models/Presales/lead';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';

@Component({
  selector: 'app-all-leads-entry',
  templateUrl: './display-all-leads.component.html',
  styleUrls: ['./display-all-leads.component.css'],
})
export class DisplayAllLeadsComponent implements OnInit {
  private destroy$ = new Subject<void>();

  totalLeads: TotalLeadsDto[] = [];

  displayedColumns: string[] = [
    'opportunityId',
    'name',
    'email',
    'phoneNumber',
    'projectName',
    'sourceName',
    'subSourceName',
    'assignedToPresales',
    'assignedToSales',
    'budget',
    'campaignName',
    'unitName',
    'isProcessed',
    'status',
  ];

  //pagination fields
  pageSizeOptions = pageSizeOptions;
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;

  ngOnInit(): void {
    this.getAllLeads();
  }

  constructor(public dialog: MatDialog, private leadService: LeadService) {}

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllLeads();
  }

  getAllLeads() {
    this.leadService
      .getTotalLeadDisplay(this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.totalLeads = response.records;
        },
        error: (error: Error) => {
          console.log('Error while fetching total leads', error);
        },
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
