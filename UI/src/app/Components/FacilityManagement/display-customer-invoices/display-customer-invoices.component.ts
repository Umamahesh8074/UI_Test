import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { Customer } from 'src/app/Models/Customer/customer';
import { CustomerInvoiceDetails } from 'src/app/Models/Customerconsumption/customerconsumption';
import { CommonReferenceDetailsDto } from 'src/app/Models/User/CommonReferenceDetailsDto';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { CustomerService } from 'src/app/Services/Customer/customer.service';
import { CustomerconsumptionService } from 'src/app/Services/Customerconsumption/customerconsumption.service';
import { InvoiceService } from 'src/app/Services/Invoice/invoice.service';

@Component({
  selector: 'app-display-customer-invoices',
  templateUrl: './display-customer-invoices.component.html',
  styleUrls: ['./display-customer-invoices.component.css']
})
export class DisplayCustomerInvoicesComponent {

  private destroy$ = new Subject<void>();
  displayedColumns: string[] = ['id', 'customerName', 'consumptionType', 'amount', 'invoiceDate','actions'];
  customerInvoiceDetails: CustomerInvoiceDetails[] = []
  // CustomerInvoiceDetails[] = []
  allProjectsCost: number = 0.0;
  consumption: string = '';
  customerName: string = '';
  month: number = 0;
  year: number = 0;

  consumptionType: string = 'Consumption_Type';
  consumptionYear: string = 'Consumption_Year';
  consumptionTypes: CommonReferenceDetailsDto[] = [];
  customers: Customer[] = [];
  flag: boolean = false;
  months: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
    'October', 'November', 'December']

  years: CommonReferenceDetailsDto[] = [];

  expanded: boolean[] = [];
  formattedDate: string | null = '';
  formattedInvoices: any[] =[];
  selectedIndex: number | null = null;
  expandedIndex: number[] = []; 
  reportId: any;
  referenceKey:any
  toggle(index: number): void {
    if (this.expandedIndex.includes(index)) {
      this.expandedIndex = this.expandedIndex.filter(i => i !== index);
    } else {
      this.expandedIndex = [index];
    }
  }
  
  ngOnInit(): void {
    const now = new Date();
    this.month = now.getMonth()+1;
    this.year = now.getFullYear();
    console.log(this.year);
    
    this.getConsumptionTypes();
    this.fetchCustomerInvoiceDetails();
    this.getCustomers();
    this.getConsumptionYear();


  }

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private invoiceService: InvoiceService,
    private commonService: CommanService,
    private customerService: CustomerService,
    private datePipe: DatePipe,
    private customerconsumptionService: CustomerconsumptionService,
  ) {

  }
  fetchCustomerInvoiceDetails() {
    console.log(this.month);
    console.log(this.year);
    this.invoiceService
      .getAllCustomerInvoiceDetails(this.consumption, this.customerName, this.month, this.year)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.customerInvoiceDetails = response.invoiceDetails;
          this.allProjectsCost = response.totalCost;
          console.log(this.customerInvoiceDetails);
          this.flag = this.customerInvoiceDetails.length > 0 ? true : false;
          this.expandedIndex = [];
          console.log(this.customerInvoiceDetails);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  getConsumptionTypes() {
    this.commonService
      .getRefDetailsByType(this.consumptionType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.consumptionTypes = resp;
          console.log(this.consumptionTypes);
          

        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  getConsumptionYear() {
    this.commonService
      .getRefDetailsByType(this.consumptionYear)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.years = resp;
          console.log(this.years);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }


  getCustomers() {
    this.customerService
      .getUserDetailsByCustomerId()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.customers = data;
          console.log(this.customers);

        },
        error: (err) => {
          console.error(err);
        },
      });
  }
  editCustomerconsumption(customerconsumptionData: any) {
    this.router.navigate(['layout/facility/management/consumption'], {
      state: { customerconsumption: customerconsumptionData },
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
  openConfirmDialog(customerconsumptionId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'Customerconsumption' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteCustomerconsumption(customerconsumptionId);
        }
      }
    );
  }
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

}
