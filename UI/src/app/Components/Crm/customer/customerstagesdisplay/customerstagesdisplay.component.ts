import { Router } from '@angular/router';

import { Component, OnInit, Renderer2 } from '@angular/core';

import { Subject, takeUntil } from 'rxjs';
import { CustomerPaymentDto } from 'src/app/Models/Crm/PaymentDetails';
import { Unit } from 'src/app/Models/Project/unit';

import { OverlayContainer } from '@angular/cdk/overlay';
import Chart from 'chart.js/auto';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { CustomerUnitPaymentDetailsDto } from 'src/app/Models/Customer/StagesAndPayments';
import { User } from 'src/app/Models/User/User';
import { ApplicationInfoService } from 'src/app/Services/CrmServices/applicant-info.service';
import { CustomerStageService } from 'src/app/Services/CrmServices/customer-stages.service';
import { CustomerService } from 'src/app/Services/Customer/customer.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-customerstagesdisplay',
  templateUrl: './customerstagesdisplay.component.html',
  styleUrls: ['./customerstagesdisplay.component.css'],
})
export class CustomerstagesdisplayComponent implements OnInit {
  private destroy$ = new Subject<void>();
  private overlayClass = 'customerstages-overlay-class';
  units: any[] = [];
  stageAndPayments: CustomerUnitPaymentDetailsDto =
    new CustomerUnitPaymentDetailsDto();

  finalPrice: number = 0;
  pendingAmount: number = 0;
  receivedAmount: number = 0;
  initiatedPayment: number = 0;
  displayedColumns: string[] = [
    'applicantName',
    'paidAmountForApproval',
    'paidAmount',
    'paymentDate',
    'paymentMode',
    'bankName',
    'status',
    'paymentstatus',
    'paymentReceiptUrl',
  ];
  selectedUnitId: number = 0;
  user: User = new User();
  // paymentDto: any;
  userId: number = 0;
  bookingId: number = 0;
  selectedUnit: Unit = new Unit();
  cunsterInfo: CustomerPaymentDto = new CustomerPaymentDto();
  paymentStatus: string = '';
  isAdding: boolean = false;
  chart: Chart | any;
  commonRefDetails: CommonReferenceType = new CommonReferenceType();
  paymentStatusId: number = 0;
  commonRefValues: any;
  constructor(
    private customerService: CustomerService,
    private customerStages: CustomerStageService,
    private applicantInfoService: ApplicationInfoService,
    private router: Router,
    private unitService: UnitService,
    private renderer: Renderer2,
    private overlayContainer: OverlayContainer,
    private commonRefDetailsService: CommonreferencedetailsService
  ) {}
  expandedStageStates: { [key: number]: boolean } = {};

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user) {
      console.log(user, 'user');

      this.user = JSON.parse(user);
      this.userId = this.user.userId;
    }
    this.getUnitsBookedByCustomerId();

    //this.getStagesAndPayments();

    // Add light bg CSS to the body
    this.renderer.addClass(document.body, 'customer-dashboard-bg');
    // Change CSS for customer layout `head-div` class
    const headDivs = document.querySelectorAll('.head-div');
    headDivs.forEach((element) => {
      this.renderer.setStyle(
        element,
        'background-color',
        'rgba(213, 216, 220, 0.9)'
      ); // Example CSS property
    });
    //Change CSS in particular Component and update css in style.css
    this.overlayContainer
      .getContainerElement()
      .classList.add(this.overlayClass);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.chart) {
      this.chart.destroy();
    }
    // Cleanup for body class
    this.renderer.removeClass(document.body, 'customer-dashboard-bg');
    // Reset the CSS for customer layout `head-div` class
    const headDivs = document.querySelectorAll('.head-div');
    headDivs.forEach((element) => {
      this.renderer.removeStyle(element, 'background-color'); // Reset the style
    });
    //Change CSS in particular Component
    this.overlayContainer
      .getContainerElement()
      .classList.remove(this.overlayClass);
  }

  getUnitsBookedByCustomerId() {
    this.customerService
      .getUnitsBookedByCustomerId(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (units) => {
          this.units = units;
          if (units.length === 1) {
            console.log(units);

            this.selectedUnitId = units[0].unitId;
            console.log(units[0].unitId);
            // Assign the unit ID if there's only one unit
            this.getStagesAndPayments(this.selectedUnitId);
            // Directly call getStagesAndPayments with the selected unit ID
          }
        },
        error: (error: Error) => {
          console.error('Error fetching bookings:', error);
        },
      });
  }

  getStagesAndPayments(selectedUnitId: number) {
    this.customerService
      .getStagesAndPayments(selectedUnitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stages) => {
          console.log(stages);

          this.stageAndPayments = stages;
          console.log(this.stageAndPayments);
        },
        error: (error: Error) => {
          console.error('Error fetching bookings:', error);
        },
      });
  }

  getInitiatedStageAmount(bookingId: number) {
    this.customerService
      .getInitiatedStageAmount(bookingId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (initiatedPayment) => {
          console.log(initiatedPayment);
          this.initiatedPayment = initiatedPayment;
        },
        error: (error: Error) => {
          console.error('Error fetching bookings:', error);
        },
      });
  }

  // expandedStageIds = new Set<number>();

  // toggleExpandedStage(stageId: number) {
  //   if (this.expandedStageIds.has(stageId)) {
  //     this.expandedStageIds.delete(stageId);
  //   } else {
  //     this.expandedStageIds.add(stageId);
  //   }
  // }

  // Method to set the expanded state for each stage
  setExpandedState(stageId: number, isExpanded: boolean) {
    this.expandedStageStates[stageId] = isExpanded;
  }

  onUnitSelected(event: any) {
    // Access the selected value (event.value contains the selected id)
    this.selectedUnitId = event.value;
    this.getStagesAndPayments(this.selectedUnitId);
  }
  downloadDemandLetter(demandLetterUrl: string) {
    const decodedUrl = decodeURIComponent(demandLetterUrl);
    let fileName = 'Demand Letter'; // Default file name
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] || fileName;
    }

    this.customerStages
      .generateDemandLetterPdf(demandLetterUrl)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          console.log('PDF file received:', response);
          this.downloadFile(response, fileName);
          Swal.fire({
            title: 'Downloaded',
            text: 'Your Demand Letter has been downloaded successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        error: (error: Error) => {
          console.error('Error downloading PDF:', error);
          Swal.fire({
            title: 'Error',
            text: 'Failed to download the PDF. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
  }
  downloadFile(response: Blob, fileName: string): void {
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  getStageDetails(bookingId: number, stageId: number) {
    console.log('hello');
    this.applicantInfoService
      .getApplicantStageDetails(bookingId, stageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (info) => {
          console.log(info);
          this.cunsterInfo = info;
          this.getPaymentStatusByStageId(stageId);
          console.log(this.paymentStatus);
          //  this.fetchStatusById(this.paymentStatusId);
          this.getCommonRefValue(this.paymentStatus);
          // if (this.paymentStatusId == this.commonRefDetails.id) {
          if (this.paymentStatus == 'Not Paid') {
            console.log(this.paymentStatus);

            this.isAdding = false;
            console.log(this.isAdding);
          } else {
            this.isAdding = true;
            console.log(this.isAdding);
          }
          this.router.navigate(['custlayout/addcustomerpayment'], {
            state: {
              customerInfo: this.cunsterInfo,
              isAdding: this.isAdding,
              stageId: stageId,
            },
          });
        },
        error: (error: Error) => {
          console.error('Error fetching bookings:', error);
        },
      });
  }
  getPaymentStatusByStageId(stageId: number) {
    if (this.stageAndPayments && this.stageAndPayments.stagesDto.length > 0) {
      const stageRecord = this.stageAndPayments.stagesDto.find(
        (stage: { stageId: number }) => stage.stageId == stageId
      );
      if (
        stageRecord &&
        stageRecord.paymentDto &&
        stageRecord.paymentDto.length > 0
      ) {
        const paymentStatus = stageRecord.paymentDto[0].paymenetStatus;
        console.log(`Payment Status for Stage ID ${stageId}:`, paymentStatus);
        this.paymentStatus = paymentStatus;
        this.paymentStatusId = stageRecord.paymentDto[0].paymentStatusId;
      }
    }
  }
  private fetchStatusById(paymentSourceId: number) {
    this.commonRefDetailsService
      .getById(paymentSourceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.commonRefDetails = data;
          console.log(data);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  getCommonRefValue(status: string) {
    console.log(status);
    this.commonRefDetailsService
      .getByRefDetails(status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (commonRefValues) => {
          console.log(commonRefValues);
          this.commonRefValues = commonRefValues;
        },
        error: (error: Error) => {
          console.error('Error fetching bookings:', error);
        },
      });
  }

  downloadReceipt(filePath: string) {
    const documentUrl = filePath;
    const decodedUrl = decodeURIComponent(documentUrl);
    let fileName = '';
    console.log(filePath);

    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] ?? '';
    } else {
      fileName = 'Document';
    }

    // Pass the filePath directly to the service method
    this.customerStages
      .generateDemandLetterPdf(filePath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          // Trigger file download
          this.downloadFile(response, fileName);

          // Show success message using Swal.fire
          Swal.fire({
            title: 'Success!',
            text: 'The Document has been downloaded successfully.',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        error: (error: Error) => {
          console.error('Error downloading Document:', error);

          // Show error message using Swal.fire
          Swal.fire({
            title: 'Error!',
            text: 'There was an error downloading the Document. Please try again.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
  }
}
