import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  Client,
  ClientInvoiceReport,
  IClient,
  IClientInvoiceReport,
  MonthlyInvoiceReportDtoList,
} from 'src/app/Models/ClientCustomerconsumption/clientcustomerconsumption';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { Role } from 'src/app/Models/User/Role';
import { User } from 'src/app/Models/User/User';

import { ClientService } from 'src/app/Services/client/client.service';
import { clientinvoicereportService } from 'src/app/Services/clientinvoicereport/clientinvoicereport.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { RoleService } from 'src/app/Services/UserService/role.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-displayclientinvoicereport',
  templateUrl: './displayclientinvoicereport.component.html',
  styleUrls: ['./displayclientinvoicereport.component.css'],
})
export class DisplayclientinvoicereportComponent implements OnInit {
  clientData: Client[] = [];
  monthlyInvoiceReportData: MonthlyInvoiceReportDtoList[] = [];
  monthlyInvoiceReport: IClientInvoiceReport = new ClientInvoiceReport();
  private destroy$ = new Subject<void>();
  projectLocation: string = '';
  serviceName: string = '';
  month: string = '';
  year: string = '';
  expandedIndex: number[] = [];
  invoiceDate: string = '';
  flag: boolean = false;
  clients: Client[] = [];
  CustomerServiceList: CommonReferenceType[] = [];
  Customer_Service: string = 'Customer_Service';
  clientInvoiceReportId: any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  form!: FormGroup;
  selectedDay: any;
  index: any;
  selectedProjectLocation: IClient = new Client();
  projectLocationFc: FormControl = new FormControl([] as Client[]);

  displayedColumns: string[] = [
    'id',
    'clientName',
    'location',
    'serviceName',
    'manPower',
    'serviceSalary',
    'invoiceDate',
    'actions',
  ];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  public user: User = new User();

  //pagination
  isView = false;
  totalItems: number = 0;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  organizationId = 0;
  pageSizeOptions = pageSizeOptions;
  reportId: any;
  consumptionId: any;
  selectedYear: any; // Store the selected year
  selectedMonth: any; // Store the selected month
  isGenerateReport: boolean = false; // Set the flag to true when generating report
  referenceKey: any;
  consumptionTypeList: CommonReferenceType[] = [];
  consumptionYearList: CommonReferenceType[] = [];
  currentDate: string = '';
  roles: Role[] = [];
  Consumption_Year: string = 'Consumption_Year';
  firstPage: boolean = false;
  lastPage: boolean = false;
  monthlyGrandTotal: number = 0;
  clientName: string = '';
  constructor(
    private clientinvoicereportService: clientinvoicereportService,
    private router: Router,
    public dialog: MatDialog,
    private clientService: ClientService,
    private commonService: CommanService,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    //  const state1 =history.state.expandedIndex;
    //  console.log(state1);

    const state = history.state;
    // this.pageIndex = state?.pageIndex ?? 0; // Fallback to 0 if undefined
    // this.expandedIndex = state?.expandedIndex ?? -1;

    // this.getClientInvoiceReport(this.pageIndex); // Fetch data for the retained page

    // Set the default month
    if (state) {
      console.log('State data:', state);
      this.index = state.expandedIndex; // Get the index from state

      this.pageIndex = state.pageIndex !== undefined ? state.pageIndex : 0; // Get the index from state

      if (this.index != null) {
        // Open the toggle for the respective index
        this.toggle(this.index);
      }
    }
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      console.log(this.user.organizationId);
      console.log('ORG ID ' + this.organizationId);
    }

    const currentMonthIndex = new Date().getMonth(); // Month index (0-based)
    this.selectedDay = this.months[currentMonthIndex]?.id; // Bind to selectedDay

    // Initialize the form with the current month
    this.form = this.fb.group({
      month: [''],
    });
    this.clientinvoicereportService.refreshRequired.subscribe(() => {
      this.getClientInvoiceReport();

      this.getClientInvoiceReport(this.pageIndex);
    });

    this.getClient();
    this.loadClientsByServiceName();
    this.fetchConsumptionYear();
    this.getClientInvoiceReport();
    this.fetchCustomerService();
    this.fetchRoles();
    this.currentDate = new Date().toISOString().split('T')[0];
    this.setDefaultMonth();
  }

  toggle(index: number) {
    if (this.expandedIndex.includes(index)) {
      this.expandedIndex = this.expandedIndex.filter((i) => i !== index);
    } else {
      this.expandedIndex.push(index);
    }
  }

  openToggle(index: number): void {
    console.log(index);

    if (!this.expandedIndex.includes(index)) {
      this.expandedIndex.push(index); // Add index to expanded list to open the toggle
    }
  }

  setDefaultMonth(): void {
    const currentMonthIndex = new Date().getMonth(); // Get the current month (0-based index)
    const currentMonthId = this.months[currentMonthIndex]?.id; // Map to the month's ID

    if (currentMonthId) {
      this.form.patchValue({ month: currentMonthId }); // Update the FormControl value
      this.cdr.detectChanges(); // Trigger change detection for Angular Material
    }
  }
  months = [
    {
      id: 'Jan',
      value: 'January',
    },
    {
      id: 'Feb',
      value: 'February',
    },
    {
      id: 'Mar',
      value: 'March',
    },
    {
      id: 'Apr',
      value: 'April',
    },
    {
      id: 'May',
      value: 'May',
    },
    {
      id: 'Jun',
      value: 'June',
    },

    {
      id: 'Jul',
      value: 'July',
    },
    {
      id: 'Aug',
      value: 'August',
    },
    {
      id: 'Sep',
      value: 'September',
    },
    {
      id: 'Oct',
      value: 'October',
    },
    {
      id: 'Nov',
      value: 'November',
    },
    {
      id: 'Dec',
      value: 'December',
    },
  ];
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;

    // Update the state for navigation
    history.state.pageIndex = this.pageIndex;
    history.state.pageSize = this.pageSize;

    this.getClientInvoiceReport(this.pageIndex); // Pass pageIndex
  }

  // getClient() {
  //   this.clientService
  //     .getClientDetailsByClientId()
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (data) => {
  //         this.clients = data;
  //         console.log(this.clients);
  //       },
  //       error: (err) => {
  //         console.error(err);
  //       },
  //     });
  // }
  getClient(clientName?: any, projectLocation?: any) {
    this.projectLocation = projectLocation;
    this.clientName = clientName;
    this.clientService
      .getAllclients(
        this.clientName,
        this.projectLocation,
        this.pageIndex,
        this.pageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (clientdata) => {
          this.clients = clientdata.records;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }
  getClientInvoiceReport(pageIndex?: any) {
    this.clientinvoicereportService
      .getAllclientinvoicereport(
        this.projectLocation,
        this.serviceName,
        this.month,
        this.year,
        this.pageIndex,
        this.pageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);

          // Extract the records and pagination info
          const { records, pageNo, totalPages, totalRecords } = response || {};
          const { invoiceDetails = [] } = records || {};

          // Calculate 'first' and 'last' flags manually if not set correctly
          const firstPage = pageNo === 0;
          const lastPage = pageNo === totalPages - 1;

          // Map the data into your report format
          this.monthlyInvoiceReportData = invoiceDetails.map((detail: any) => {
            return {
              projectLocation: detail.projectLocation || '',
              location: detail.location || '',
              month: detail.month || '',
              grandTotal: detail.grandTotal || 0,
              invoiceDate: new Date(detail.invoiceDate) || new Date(),
              invoices: detail.invoices || [],
            };
          });

          // Set pagination values
          this.totalItems = totalRecords;
          this.firstPage = firstPage;
          this.lastPage = lastPage;

          console.log('First Page:', this.firstPage);
          console.log('Last Page:', this.lastPage);

          // Flag for conditional display (checks if data exists)
          this.flag = this.monthlyInvoiceReportData.length > 0;
        },
        error: (error) => {
          console.error('Error fetching client invoice report:', error);
        },
      });
  }

  fetchCustomerService(): void {
    console.log(this.Customer_Service);
    this.commonService.getRefDetailsByType(this.Customer_Service).subscribe({
      next: (types) => {
        this.CustomerServiceList = types;
      },
      error: (error: any) => {
        console.error('Error fetching lead types:', error);
      },
    });
  }
  generateInvoice(month?: any, year?: any): void {
    this.clientinvoicereportService
      .generateMonthlyInvoiceReport(this.month, this.year)
      .subscribe({
        next: (data: Blob) => {
          // Create a link element to download the file
          const url = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'Monthly_Invoice_Reports.xlsx';

          // Append the link element to the body temporarily
          document.body.appendChild(a);
          a.click(); // Trigger the download

          // Cleanup: Revoke the object URL and remove the link element
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);

          // Display success message using SweetAlert2
          Swal.fire({
            position: 'center',
            icon: 'success',
            text: 'Monthly Invoice Reports Downloaded Successfully',
            showConfirmButton: false,
            timer: 2000, // Message duration in milliseconds
          }).then(() => {
            // Call another method after the success notification
            this.getClientInvoiceReport(); // Replace with the actual method you want to call
          });
        },
        error: (error: any) => {
          console.error('Error generating invoice report:', error);

          // Display error message using SweetAlert2
          Swal.fire({
            position: 'center',
            icon: 'error',
            text: 'Error generating invoice report. Please try again later.',
            showConfirmButton: true,
          });
        },
      });
  }

  onselectClientName(event: any): void {
    this.paginator.firstPage();
    this.projectLocation = event.option.value.projectLocation
      ? event.option.value.projectLocation
      : '';
    console.log(this.projectLocation);
    // this.projectLocation = event.value ? event.value : '';

    if (this.projectLocation === '') {
      this.serviceName = '';
      this.year = '';
      this.month = '';
    }
    this.getClientInvoiceReport();
  }
  displayProject(client: Client): string {
    return client && client.projectLocation ? client.projectLocation : '';
  }

  searchProjectLocation(event: any): void {
    this.paginator.firstPage();
    const query = event.target.value;
    this.projectLocation = query;
    this.getClient('', this.projectLocation);
  }
  onselectServiceName(event: any): void {
    this.paginator.firstPage();
    this.serviceName = event.value;

    this.serviceName = event.value ? event.value : '';
    if (this.serviceName === '') {
      this.year = '';
      this.month = '';
    }
    this.getClientInvoiceReport();
  }

  onSelectMonth(event: any): void {
    this.paginator.firstPage();
    this.month = event.value;

    this.month = event.value ? event.value : '';
    if (this.month === '') {
    }
    this.fetchMonthlyGrandTotal();
    this.getClientInvoiceReport();
  }

  onSelectYear(event: any): void {
    this.paginator.firstPage();
    this.year = event.value;

    this.year = event.value ? event.value : '';
    if (this.year === '') {
      this.month = '';
    }
    this.fetchMonthlyGrandTotal();
    this.getClientInvoiceReport();
  }
  fetchConsumptionYear(): void {
    console.log(this.Consumption_Year);

    this.commonService.getRefDetailsByType(this.Consumption_Year).subscribe({
      next: (types) => {
        this.consumptionYearList = types;
      },
      error: (error: any) => {
        console.error('Error fetching lead types:', error);
      },
    });
  }

  loadClientsByServiceName() {
    this.clientService.getClientByIdServiceName(1).subscribe({
      next: (resp) => {
        this.clientData = resp;
      },
      error: (err) => {
        console.error('Error loading projects', err);
      },
    });
  }

  viewClientInvoiceReport(index: any, monthlyInvoiceReportData: any) {
    console.log(index);
    console.log(monthlyInvoiceReportData);
    console.log(monthlyInvoiceReportData.clientId);

    // Extract clientId from the input data
    const clientId = monthlyInvoiceReportData.clientId;

    // Use the extracted clientId in the service call
    this.clientinvoicereportService
      .getClientInvoiceById(monthlyInvoiceReportData.clientInvoiceReportId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          console.log(data);
          // Navigate with the required data
          this.router.navigate(
            ['layout/facility/management/addClientinvoicereport'],
            {
              state: {
                clientInvoiceReportId: this.clientInvoiceReportId,
                referenceKey: this.referenceKey,
                pageIndex: this.pageIndex,

                expandedIndex: index,
                invoice: data,
              },
            }
          );
          console.log(this.expandedIndex.filter((i) => i !== index));
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  openConfirmDialog(clientInvoiceReportId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Customerconsumption' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteCustomerconsumption(clientInvoiceReportId);
        }
      }
    );
  }

  // editCustomerconsumption(customerconsumptionData: any) {
  //   this.router.navigate(['layout/facility/management/addajnaconsumption'], {
  //     state: { customerconsumption: customerconsumptionData },
  //   });
  // }

  deleteCustomerconsumption(clientInvoiceReportId: number) {
    this.clientinvoicereportService
      .deleteFacility(clientInvoiceReportId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Employee deleted successfully:', response);
          this.getClientInvoiceReport();
        },
        error: (error) => {
          console.error('Error deleting Employee:', error);
        },
      });
  }

  fetchMonthlyGrandTotal(): void {
    if (!this.selectedMonth || !this.selectedYear) {
      console.log('Month and Year must be selected');
      return;
    }

    this.clientinvoicereportService
      .getMonthlyGrandTotal(this.selectedMonth, this.selectedYear)
      .subscribe({
        next: (response) => {
          this.monthlyGrandTotal = response; // Update the monthly grand total
        },
        error: (error) => {
          console.error('Error fetching the monthly grand total:', error);
        },
      });
  }

  editClientInvoiceReport(monthlyInvoiceReportData: any) {
    console.log(monthlyInvoiceReportData.clientId);

    this.router.navigate(
      ['layout/facility/management/addClientinvoicereport'],
      {
        state: {
          clientId: monthlyInvoiceReportData.clientId,

          monthlyInvoiceReport: monthlyInvoiceReportData,
        },
      }
    );
  }

  addClientInvoiceReport() {
    this.router.navigate(['layout/facility/management/addClientinvoicereport']);
  }

  fetchRoles() {
    this.roleService.fetchAllRoles('', this.organizationId).subscribe({
      next: (roles: any) => {
        console.log(roles);
        this.roles = roles;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }
  onClear() {
    (this.projectLocation = ''),
      (this.serviceName = ''),
      (this.month = ''),
      (this.year = ''),
      this.getClientInvoiceReport();
  }

  onClickGenerateExcel(clientData: any) {
    this.isGenerateReport = true; // Set the flag to true when generating a report

    console.log(clientData); // Ensure it contains the specific client data

    this.clientinvoicereportService
      .generateExcel([clientData]) // Pass clientData in an array
      .subscribe((response) => {
        // Create a blob from the response data
        const blob = new Blob([response], {
          type: 'application/vnd.ms-excel',
        });

        // Generate a download link
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${clientData.projectLocation}_report.xls`; // Use the client's name/location for the file name
        document.body.appendChild(a);
        a.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        Swal.fire({
          position: 'center',
          icon: 'success',
          text: 'Report Downloaded Successfully',
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          // Call the getClientInvoiceReport method after the Swal notification
          this.getClientInvoiceReport();
        });
      });
  }
}
