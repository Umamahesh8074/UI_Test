import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';

import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  Customerconsumption,
  CustomerconsumptionDto,
} from 'src/app/Models/Customerconsumption/customerconsumption';
import { CustomerconsumptionService } from 'src/app/Services/Customerconsumption/customerconsumption.service';
import { Customer } from 'src/app/Models/Customer/customer';
import { InvoiceReportDto } from 'src/app/Models/Invoice/invoice';
import { InvoiceService } from 'src/app/Services/Invoice/invoice.service';

@Component({
  selector: 'app-displaycustomerconsumption',
  templateUrl: './display-customerconsumption.component.html',
  styleUrls: ['./display-customerconsumption.component.css'],
  encapsulation: ViewEncapsulation.None, // Set ViewEncapsulation to None
})
export class DisplaycustomerconsumptionComponent implements OnInit {
  private destroy$ = new Subject<void>();
  customerconsumptionData: CustomerconsumptionDto[] = [];
  customerconsumptionName: string = '';
  customer: Customer[] = [];
  invoiceData: InvoiceReportDto[] = [];
  invoice: any;
  displayedColumns: string[] = [
    'customerName',
    'currentConsumption',
    'consumptionType',
    'consumptionDate',
    'actions',
  ];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;

  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;
  reportId: any;
  consumptionId: any;
  referenceKey: any;

  ngOnInit(): void {
    this.customerconsumptionService.refreshRequired.subscribe(() => {
      this.getCustomerconsumption(this.customerconsumptionName);
    });
  }

  constructor(
    private customerconsumptionService: CustomerconsumptionService,
    private invoiceService: InvoiceService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.getCustomerconsumption(this.customerconsumptionName);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getCustomerconsumption(this.customerconsumptionName);
  }

  getCustomerconsumption(customerconsumptionName: any) {
    this.customerconsumptionName = customerconsumptionName;
    this.customerconsumptionService
      .getAllCustomerconsumption(
        customerconsumptionName,
        this.pageIndex,
        this.pageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (customerconsumptionData) => {
          console.log(customerconsumptionData);
          this.customerconsumptionData = customerconsumptionData.records;
          this.totalItems = customerconsumptionData.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ///opening confirm dialog
  openConfirmDialog(customerconsumptionId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'Customerconsumption' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteCustomerconsumption(customerconsumptionId);
        }
      }
    );
  }

  //delete customerconsumption by customerconsumption id
  deleteCustomerconsumption(customerconsumptionId: number) {
    this.customerconsumptionService
      .deleteCustomerconsumption(customerconsumptionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (customerconsumptionData) => {
          console.log(customerconsumptionData);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  //adding customerconsumption
  addCustomerconsumption() {
    this.router.navigate(['layout/facility/management/consumption']);
  }

  // editCustomerconsumption(customerconsumptionData: any) {
  //   this.router.navigate(['layout/facility/management/consumption'], {
  //     state: { customerconsumption: customerconsumptionData },
  //   });
  // }




editCustomerconsumption(customerconsumptionData: any) {

    this.customerconsumptionService
      .getCustomerconsumptionId(customerconsumptionData.consumptionId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log(data);
          this.router.navigate(['layout/facility/management/consumption'], {

            state: {
              consumptionId: this.consumptionId,
              referenceKey: this.referenceKey,
              customerconsumption: data,
            },
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  viewCustomerConsumption( customerconsumptionData: any) {
    console.log(customerconsumptionData);


    this.invoiceService
      .getInvoiceById(customerconsumptionData.reportId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log(data);
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
