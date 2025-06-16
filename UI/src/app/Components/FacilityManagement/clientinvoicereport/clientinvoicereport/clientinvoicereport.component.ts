import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  Client,
  IClient,
  IMonthlyInvoiceReportDto,
  MonthlyInvoiceReportDto,
} from 'src/app/Models/ClientCustomerconsumption/clientcustomerconsumption';
import { ClientService } from 'src/app/Services/client/client.service';
import { clientinvoicereportService } from 'src/app/Services/clientinvoicereport/clientinvoicereport.service';

@Component({
  selector: 'app-clientinvoicereport',
  templateUrl: './clientinvoicereport.component.html',
  styleUrls: ['./clientinvoicereport.component.css'],
})
export class AddclientinvoicereportComponent implements OnInit {
  isAdding: boolean = false;
  expanded: boolean[] = [false, false, true]; // Default expanded[2] to true

  private destroy$ = new Subject<void>();
  formData!: FormGroup;
  client: IClient = new Client();
  isView: boolean = false;
  monthlyInvoiceReport: IMonthlyInvoiceReportDto =
    new MonthlyInvoiceReportDto();
  isGenerateReport: boolean = false; // Set the flag to true when generating report

  invoices: any[] = [];
  totalServiceNameCount: number = 0;
  totalItems: number = 0;
  pageSize: number = 10;
  pageIndex: number = 0;
  serviceArray: any = [];
  clientId: any;
  expandedIndex: any;
  clientInvoiceReportId: any;
  referenceKey: any;
  invoice: any;
  constructor(
    private router: Router,
    private clientinvoicereportService: clientinvoicereportService,
    private builder: FormBuilder,
    private clientService: ClientService
  ) {}

  ngOnInit(): void {
    // this.monthlyInvoiceReport = history.state.monthlyInvoiceReport[0];
    const state = history.state;
    // Set the default month
    // if (state) {
    //   console.log('State data:', state);
    //   this.expandedIndex = state.expandedIndex;
    //   this.pageIndex = state.pageIndex || 0; // Retrieve the page index, default to 0 if undefined

    //   console.log(state.pageIndex);
    //   console.log(state.expandedIndex);
    // }

    if (state) {
      console.log('State data:', state);
      this.expandedIndex = state.expandedIndex;
      this.pageIndex = state.pageIndex ?? 0; // Use nullish coalescing for default value
    } else {
      this.pageIndex = 0; // Default to first page if state is unavailable
    }

    this.monthlyInvoiceReport = history.state.invoice;
    this.initial();
    console.log(this.clientId);
    if (this.monthlyInvoiceReport) {
      this.isAdding = false;
      this.patchFormData();
    }
    // this.formData = this.builder.group({
    //   clientId: [this.monthlyInvoiceReport.clientId, Validators.required],
    //   clientName: [this.monthlyInvoiceReport.clientName, Validators.required],
    //   location: [this.monthlyInvoiceReport.location],
    //   address1: [this.monthlyInvoiceReport.address1],
    //   address2: [this.monthlyInvoiceReport.address2],
    //   city: [this.monthlyInvoiceReport.city],
    //   pincode: [this.monthlyInvoiceReport.pincode],
    //   pan: [this.monthlyInvoiceReport.pan],
    //   gst: [this.monthlyInvoiceReport.gst],
    //   state: [this.monthlyInvoiceReport.state],
    //   phoneNumber: [this.monthlyInvoiceReport.phoneNumber],
    //   residentType: [this.monthlyInvoiceReport.residentType],
    //   emailId: [
    //     this.monthlyInvoiceReport.emailId,
    //     [Validators.required, Validators.email],
    //   ],
    //   status: [this.monthlyInvoiceReport.status],
    //   organizationId: [this.monthlyInvoiceReport.organizationId],
    //   monthlyClientInvoiceReportId: [
    //     this.monthlyInvoiceReport.monthlyClientInvoiceReportId,
    //   ],
    //   // noOfDuties: [this.monthlyInvoiceReport.noOfDuties],
    //   // manPower: [this.monthlyInvoiceReport.manPower],
    //   // serviceName: [this.monthlyInvoiceReport.serviceName],
    //   // serviceSalary: [this.monthlyInvoiceReport.serviceSalary],
    //   // totalAmount: [this.monthlyInvoiceReport.totalAmount],
    //   invoiceDate: [this.monthlyInvoiceReport.invoiceDate],
    //   invoiceNumber: [this.monthlyInvoiceReport.invoiceNumber],
    //   orgPinCode: [this.monthlyInvoiceReport.orgPinCode],
    //   orgGstinUin: [this.monthlyInvoiceReport.orgGstinUin],
    //   serviceArray: [this.serviceArray],
    // });
  }

  // Populate form with data

  // save() {
  //   //adding clientinvoicereport
  //   if (this.isAdding) {
  //     this.clientinvoicereportService
  //       .addclientinvoicereport(this.formData.value)
  //       .pipe(takeUntil(this.destroy$))
  //       .subscribe({
  //         next: (resp) => {
  //           this.router.navigate([
  //             'layout/facility/management/clientinvoicereport',
  //           ]);
  //         },
  //         error: (err) => {
  //           console.error('Error adding clientinvoicereport', err);
  //         },
  //       });
  //   } else {
  //     //updating clientinvoicereport
  //     this.clientinvoicereportService
  //       .updateclientinvoicereport(this.formData.value)
  //       .pipe(takeUntil(this.destroy$))
  //       .subscribe({
  //         next: (resp) => {
  //           this.monthlyInvoiceReport = resp;
  //           this.router.navigate([
  //             'layout/facility/management/clientinvoicereport',
  //           ]);
  //         },
  //         error: (err) => {
  //           console.error('Error updating clientinvoicereport', err);
  //         },
  //       });
  //   }
  // }
  // loadClients(clientId: number): void {
  //   this.clientService.getClientById(clientId).subscribe({
  //     next: (resp) => {
  //       this.totalServiceNameCount = resp.totalServiceNameCount;

  //       console.log(this.totalServiceNameCount);
  //       history.state.monthlyInvoiceReport?.forEach((service: any) => {
  //         service = {
  //           serviceName: service.serviceName,
  //           serviceSalary: service.serviceSalary,
  //           noOfDuties: service.noOfDuties,
  //           manPower: service.manPower,
  //           totalAmount: service.totalAmount,
  //         };
  //         console.log(service);
  //         this.serviceArray.push(service);
  //       });

  //       // Populate the fields with the empty service data
  //       this.populateServiceFields(this.serviceArray);
  //     },
  //     error: (err) => {
  //       console.error('Error loading client', err);
  //     },
  //   });
  // }
  save() {
    if (this.isGenerateReport) {
      // Prevent updating if it's the report generation action
      this.isGenerateReport = false; // Reset the flag
      return;
    }

    if (this.isAdding) {
      this.clientinvoicereportService
        .addclientinvoicereport(this.formData.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.router.navigate([
              'layout/facility/management/clientinvoicereport',
            ]);
          },
          error: (err) => {
            console.error('Error adding clientinvoicereport', err);
          },
        });
    } else {
      const formData = new FormData();
      // Append values from the form
      formData.append(
        'orderNumber',
        this.formData.get('orderNumber')?.value || ''
      );
      formData.append(
        'invoiceNumber',
        this.formData.get('invoiceNumber')?.value || ''
      );

      this.clientinvoicereportService
        .updateclientinvoicereport(this.formData.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.monthlyInvoiceReport = resp;

            // Use similar navigation logic as gotoclientinvoicereports()
            this.router.navigate(
              ['layout/facility/management/clientinvoicereport'],
              {
                state: {
                  expandedIndex: this.expandedIndex,
                  pageIndex: this.pageIndex,
                }, // Pass both expandedIndex and pageIndex
              }
            );
          },
          error: (err) => {
            console.error('Error updating clientinvoicereport', err);
          },
        });
    }
  }
  get servicesArray(): FormArray {
    return this.formData.get('serviceArray') as FormArray;
  }
  getClientInvoiceReport(clientId: number) {
    this.clientinvoicereportService
      .getAllclientinvoicereportByClientId(
        this.clientId,
        this.pageIndex,
        this.pageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (invoiceDetails) => {
          this.monthlyInvoiceReport = invoiceDetails.invoiceDetails.records;
          this.totalItems = invoiceDetails.invoiceDetails.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  populateServiceFields(invoices: any[]): void {
    const serviceArray = this.serviceArray;

    if (!serviceArray) {
      console.error('Service Array is not initialized');
      return;
    }

    // serviceArray.clear();  // Clear existing controls

    invoices.forEach((invoice) => {
      serviceArray.push(
        this.builder.group({
          serviceName: [invoice.serviceName || '', Validators.required],
          serviceSalary: [invoice.serviceSalary || 0, Validators.required],
          noOfDuties: [invoice.noOfDuties || 0, Validators.required],
          manPower: [invoice.manPower || 0, Validators.required],
          totalAmount: [invoice.totalAmount || 0, Validators.required],
        })
      );
    });
  }

  initial() {
    this.formData = this.builder.group({
      clientInvoiceReportId: [0],
      clientId: [0],
      clientName: ['', Validators.required],
      location: [''],
      address1: [''],
      address2: [''],
      city: [''],
      pincode: [''],
      pan: [''],
      gst: [''],
      state: [''],
      phoneNumber: [''],
      residentType: [''],

      // Customer Fields
      emailId: ['', Validators.required],
      status: [''],
      customerAddress1: [''],
      customerAddress2: [''],
      customerCity: [''],
      customerCityPinCode: [''],
      customergstinUin: [''],
      customerState: [''],
      customerStateCode: [''],
      customerPan: [''],
      unitId: [0],
      customerResidentType: [''],
      organizationId: [0],
      monthlyClientInvoiceReportId: [0],
      noOfDuties: [0],

      manPower: [0],
      serviceName: [''],
      serviceSalary: [0],
      totalAmount: [0],
      invoiceDate: new Date(),
      invoiceNumber: [''],
      orgPinCode: [''],
      orgGstinUin: [''],
      facilityServiceId: [0],
      month: [''],
      year: [''],
      projectLocation: [''],
      grandTotal: [''],
      orderNumber: [''],
    });

    this.formData
      .get('serviceName')
      ?.valueChanges.subscribe(() => this.updateCalculations());

    this.formData
      .get('serviceSalary')
      ?.valueChanges.subscribe(() => this.updateCalculations());
    this.formData
      .get('noOfDuties')
      ?.valueChanges.subscribe(() => this.updateCalculations());
    this.formData
      .get('invoiceDate')
      ?.valueChanges.subscribe(() => this.updateCalculations());
    this.formData
      .get('manPower')
      ?.valueChanges.subscribe(() => this.updateCalculations());
    this.formData
      .get('totalAmount')
      ?.valueChanges.subscribe(() => this.updateCalculations());
  }

  // get serviceArray(): FormArray {
  //   return this.formData.get('serviceArray') as FormArray;
  // }

  toggleQuotation(index: number) {
    this.expanded[index] = !this.expanded[index];
  }
  patchFormData() {
    //console.log(this.invoice.totalValue);
    console.log(this.formData);
    console.log(this.monthlyInvoiceReport);

    console.log(this.formData);

    console.log(this.monthlyInvoiceReport);

    this.formData.patchValue(this.monthlyInvoiceReport);
  }

  clearForm() {
    this.formData.reset();
  }

  // gotoclientinvoicereports() {
  //   console.log(this.expandedIndex);

  //   this.router.navigate(['layout/facility/management/clientinvoicereport'], {
  //     state: { expandedIndex: this.expandedIndex, pageIndex: this.pageIndex }, // Pass the index in the state
  //   });
  // }

  gotoclientinvoicereports() {
    console.log(this.expandedIndex);
    this.router.navigate(['layout/facility/management/clientinvoicereport'], {
      state: { expandedIndex: this.expandedIndex, pageIndex: this.pageIndex },
    });
  }

  // updateCalculations() {
  //   const noOfDuties = this.formData.get('noOfDuties')?.value || 0;
  //   const manPower = this.formData.get('manPower')?.value || 0;
  //   const serviceSalary = this.formData.get('serviceSalary')?.value || 0;

  //   const totalAmount = noOfDuties * manPower * serviceSalary;
  //   this.formData
  //     .get('totalAmount')
  //     ?.setValue(totalAmount, { emitEvent: false });
  // }
  updateCalculations() {
    const noOfDuties = this.formData.get('noOfDuties')?.value || 0; // Default to 0 if null
    const manPower = this.formData.get('manPower')?.value || 0;
    const serviceSalary = this.formData.get('serviceSalary')?.value || 0;
    const invoiceDate = this.formData.get('invoiceDate')?.value;

    console.log('Invoice Date:', invoiceDate);

    if (invoiceDate) {
      // Parse the invoiceDate into a Date object
      const date = new Date(invoiceDate);

      if (!isNaN(date.getTime())) {
        // Check if the date is valid
        // Calculate the number of days in the month
        const daysInMonth = new Date(
          date.getFullYear(),
          date.getMonth() + 1,
          0
        ).getDate();
        console.log('Days in Month:', daysInMonth);

        // Calculate the total amount based on the updated formula
        const totalAmount = (serviceSalary / daysInMonth) * noOfDuties;
        this.formData
          .get('totalAmount')
          ?.setValue(totalAmount, { emitEvent: false });
      } else {
        console.error('Invalid date format for invoiceDate:', invoiceDate);
        // Handle invalid date formats gracefully
        this.formData.get('totalAmount')?.setValue(0, { emitEvent: false });
      }
    } else {
      // If invoiceDate is missing, set totalAmount to 0
      console.error('Invoice Date is missing.');
      this.formData.get('totalAmount')?.setValue(0, { emitEvent: false });
    }
  }
  updateOrderNumber(event: Event): void {
    const newValue = (event.target as HTMLElement).innerText.trim();
    this.formData.get('orderNumber')?.setValue(newValue);
  }

  updateInvoiceNumber(event: Event): void {
    const newValue = (event.target as HTMLElement).innerText.trim();
    this.formData.get('invoiceNumber')?.setValue(newValue);
  }
}
