
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { Router } from '@angular/router';

import { Subject, takeUntil, tap } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {  InvoiceReportDto } from 'src/app/Models/Invoice/invoice';
import { InvoiceService } from 'src/app/Services/Invoice/invoice.service';

@Component({
  selector: 'app-displayinvoice',
  templateUrl: './display-invoice.component.html',
  styleUrls: ['./display-invoice.component.css'],
  encapsulation: ViewEncapsulation.None, // Set ViewEncapsulation to None
})
export class DisplayinvoiceComponent implements OnInit {
  private destroy$ = new Subject<void>();
  invoiceData: InvoiceReportDto[] = [];
  invoiceName: string = '';
  displayedColumns: string[] = ['customerName','consumptionType', 'invoiceDate', 'actions'];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
invoice:any;
  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  reportId:any;
  referenceKey: any;

  ngOnInit(): void {
    this.invoiceService.refreshRequired.subscribe(() => {
      this.getInvoice(this.invoiceName);
    });
  }

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.getInvoice(this.invoiceName);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getInvoice(this.invoiceName);
  }

  getInvoice(invoiceName: any) {
    this.invoiceName = invoiceName;
    this.invoiceService
      .getAllInvoice(invoiceName, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (invoiceData) => {
          this.invoiceData = invoiceData.records;

          this.totalItems = invoiceData.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ///opening confirm dialog
  openConfirmDialog(invoiceId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'Invoice' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteInvoice(invoiceId);
        }
      }
    );
  }

  //delete invoice by invoice id
  deleteInvoice(invoiceId: number) {
    this.invoiceService
      .deleteInvoice(invoiceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (invoiceData) => {
          console.log(invoiceData);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  //adding invoice
  addInvoice() {
    this.router.navigate(['layout/facility/management/addtaxinvoice']);
  }

  // editInvoice(invoiceData: any) {
  //   this.router.navigate(['layout/facility/management/addtaxinvoice'], {
  //     state: { invoice: invoiceData },
  //   });
  // }


  editInvoice(invoiceData: any) {

    this.invoiceService
      .getInvoiceById(invoiceData.reportId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.router.navigate(['layout/facility/management/addtaxinvoice'], {
            state: {
              reportId: this.reportId,
              referenceKey: this.referenceKey,
              invoice: data,
            },
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
  }




}
