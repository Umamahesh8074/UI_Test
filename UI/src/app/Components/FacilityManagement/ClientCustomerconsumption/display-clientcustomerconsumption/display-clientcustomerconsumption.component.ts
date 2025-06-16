import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { PAGE_INDEX, PAGE_SIZE, pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';

import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  Customerconsumption,
  CustomerconsumptionDto,
} from 'src/app/Models/Customerconsumption/customerconsumption';
import { CustomerconsumptionService } from 'src/app/Services/Customerconsumption/customerconsumption.service';
import { Customer } from 'src/app/Models/Customer/customer';
import { InvoiceReportDto } from 'src/app/Models/Invoice/invoice';
import { InvoiceService } from 'src/app/Services/Invoice/invoice.service';
import { ClientCustomerconsumptionService } from 'src/app/Services/ClientCustomerconsumption/clientcustomerconsumption.service';
import { FacilityServicesDto } from 'src/app/Models/ClientCustomerconsumption/clientcustomerconsumption';

@Component({
  selector: 'app-display-clientcustomerconsumption',
  templateUrl: './display-clientcustomerconsumption.component.html',
  styleUrls: ['./display-clientcustomerconsumption.component.css'],
  encapsulation: ViewEncapsulation.None, // Set ViewEncapsulation to None
})
export class DisplayClientcustomerconsumptionComponent implements OnInit {
  private destroy$ = new Subject<void>();
  customerconsumptionData: FacilityServicesDto[] = [];
  projectLocation: string = '';
  customer: Customer[] = [];
  invoiceData: InvoiceReportDto[] = [];
  customerconsumption: FacilityServicesDto[] = [];

  invoice: any;
  displayedColumns: string[] = [
    'clientName',
    'location',
    'serviceName',
    'manPower',
    'serviceSalary',
    'actions',
  ];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;

  //pagination
  totalItems: number = 0;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  reportId: any;
  consumptionId: any;
  referenceKey: any;

  ngOnInit(): void {
    this.clientcustomerconsumptionService.refreshRequired.subscribe(() => {
      this.getCustomerconsumption(this.projectLocation);
    });
  }

  constructor(
    private invoiceService: InvoiceService,
    private router: Router,
    public dialog: MatDialog,
    private clientcustomerconsumptionService: ClientCustomerconsumptionService
  ) {
    this.getCustomerconsumption(this.projectLocation);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    history.state.pageIndex = this.pageIndex;
    history.state.pageSize = this.pageSize;
    this.getCustomerconsumption(this.projectLocation);
  }

  getCustomerconsumption(projectLocation: any) {
    this.projectLocation = projectLocation;
    this.clientcustomerconsumptionService
      .getAllFacilityservice(projectLocation, this.pageIndex, this.pageSize)
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
      data: { displayedData: 'delete Customerconsumption' }, // Pass the property as data to the dialog
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
    console.log(customerconsumptionId);
    this.clientcustomerconsumptionService
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
    this.router.navigate(['layout/facility/management/addajnaconsumption']);
  }



  viewClientCustomerConsumption(customerconsumptionData: any) {
    console.log(customerconsumptionData);
console.log(customerconsumptionData.reportId);
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
  editCustomerconsumption(customerconsumption: any) {
    console.log('Fetching data for facilityServiceId:', customerconsumption.facilityServiceId);
  
    this.getCustomerConsumptionById(customerconsumption.facilityServiceId).subscribe({
      next: (response) => {
        console.log('Fetched response:', response);
  
        // Ensure the response matches the DTO structure with 'facilityServices' as an array of objects
        const processedData: FacilityServicesDto = {
          facilityServices: Array.isArray(response?.facilityServices)
            ? response.facilityServices.map((service: any) => ({
                serviceName: service?.serviceName ?? '',
                manPower: service?.manPower ?? 0,
                serviceSalary: service?.serviceSalary ?? 0,
                clientId: service?.clientId ?? 0,
                projectLocation: service?.projectLocation ?? '',
                location: service?.location ?? '',
              }))
            : [],
        };
  
     
        
        console.log('Processed customer consumption data:', processedData);
  
        // Navigate to the next page with processed data
        this.router.navigate(['layout/facility/management/addajnaconsumption'], {
          state: { customerconsumptionData: processedData },
        });
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      },
    });
  }
  
  
  getCustomerConsumptionById(facilityServiceId: any) {
    return this.clientcustomerconsumptionService
    .getCustomerConsumptionById(facilityServiceId)
    .pipe(takeUntil(this.destroy$));
  }

}
