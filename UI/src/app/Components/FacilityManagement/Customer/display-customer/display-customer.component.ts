import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { Subject, takeUntil, tap } from 'rxjs';
import { ApproveDialogComponent } from 'src/app/Comman-Components/Dialog/approvaldialog/approvedialog.component';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { Customer, CustomerDto } from 'src/app/Models/Customer/customer';
import { CustomerService } from 'src/app/Services/Customer/customer.service';


@Component({
  selector: 'app-displaycustomer',
  templateUrl: './display-customer.component.html',
  styleUrls: ['./display-customer.component.css'],
  encapsulation: ViewEncapsulation.None, // Set ViewEncapsulation to None
})
export class DisplaycustomerComponent implements OnInit {
  private destroy$ = new Subject<void>();
  customerData: CustomerDto[] = [];
  customerName: string = '';
  displayedColumns: string[] = ['customerName', 'phNo', 'buildingName','projectType','actions'];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  pageSizeOptions=pageSizeOptions;
  //pagination
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
   customers: Customer[] = [];
  ngOnInit(): void {
    this.getallcustomers();
    
  }

  constructor(
    private customerService: CustomerService,
    private router: Router,
    public dialog: MatDialog
  ) {
    // this.getCustomer(this.customerName);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    // this.getCustomer(this.customerName);
  }
  getallcustomers() {
    this.customerService.getAllCustomersWithPagination(this.pageIndex, this.pageSize).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.customerData = resp.records;
          console.log(this.customerData);
          this.totalItems = resp.totalRecords;
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  getCustomer(customerName: any) {
    this.customerName = customerName;
    this.customerService
      .getAllCustomer(customerName, this.pageIndex, this.pageIndex)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (customerData) => {
          this.customerData = customerData.records;
          console.log(this.customerData);


          this.totalItems = customerData.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ///opening confirm dialog
  openConfirmDialog(customerId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'Customer' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteCustomer(customerId);
        }
      }
    );
  }

  //delete customer by customer id
  deleteCustomer(customerId: number) {
    this.customerService
      .deleteCustomer(customerId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (customerData) => {
          console.log(customerData);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  //adding customer
  addCustomer() {
    this.router.navigate(['layout/facility/management/addcustomer']);
    this.getallcustomers();
  }

  editCustomer(customerData: any) {
    this.router.navigate(['layout/facility/management/addcustomer'], {
      state: { customer: customerData },
    });
  }

 

}
