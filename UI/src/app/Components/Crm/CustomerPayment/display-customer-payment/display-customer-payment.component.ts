import { formatDate } from '@angular/common';
import { Component, ViewChild, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  ACTION_STATUS,
  NAVIGATE_TO_ADD_CUSTOMER_PAYMENT,
  NAVIGATE_TO_ADD_PAYMENT_DETAILS,
  PAYMENT_STATUS,
} from 'src/app/Constants/Crm/CrmConstants';
import {
  IPaymentDetailsDto,
  PaymentDetailsDto,
} from 'src/app/Models/Crm/PaymentDetails';
import { StageDto } from 'src/app/Models/Project/stage';
import { StagesDto } from 'src/app/Models/WorkOrder/WorkOrderBilling';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { CustomerPaymentService } from 'src/app/Services/CrmServices/customer-payment.service';
import { CustomerStageService } from 'src/app/Services/CrmServices/customer-stages.service';
import { StageService } from 'src/app/Services/ProjectService/Stage/stage.service';
import Chart from 'chart.js/auto';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';

@Component({
  selector: 'app-display-customer-payment',
  templateUrl: './display-customer-payment.component.html',
  styleUrls: ['./display-customer-payment.component.css'],
})
export class DisplayCustomerPaymentComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  private overlayClass = 'customerpayment-overlay-class';
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  projectChargeName: string = '';
  paymentDetails: IPaymentDetailsDto[] = [];
  paymentDetail: IPaymentDetailsDto = new PaymentDetailsDto();
  fristapplicantName: string = '';
  stages: StageDto[] = [];
  isVisible: boolean = false;
  organizationId: number = 0;
  userId: number = 0;
  paymentDetailsId: number = 0;
  isModelView: boolean = false;
  remarks: string = '';
  stageId: number = 0;
  stageName: string = '';
  selectedStatus: string = 'All';
  actionBy: string = '';
  chart: Chart | any;

  formData!: FormGroup;
  dateRange: any = '';
  customStartDate: any = '';
  customEndDate: any = '';
  customerPaymentId: number = 0;
  customerPayment: any;
  enable:boolean=false;

  displayedColumns: string[] = [
    'rowNumber',
    'referenceNumber',
    'stageName',
    'createdDate',
    'projectName',
    // 'block',
    // 'level',
    'unit',
    'paymentDate',
    'paidAmount',
    'bankName',
    'branchName',
    'ifscCode',
    'actionStatus',
    'remarks',
    'actionDate',
    'actionDoneBy',
    'check',
    'email',
    'challana',
    'actions',
  ];

  statuses = [
    {
      id: 1,
      value: 'All',
    },
    {
      id: 3,
      value: 'Pending',
    },
    {
      id: 4,
      value: 'Approved',
    },
    {
      id: 2,
      value: 'Rejected',
    },
  ];
  paymentStatusName: string ='';
 actionStatusNames: CommonReferenceType[] = [];
 actionStatusId:number=0
  constructor(
    public customerPaymentService: CustomerPaymentService,
    private router: Router,
    public dialog: MatDialog,
    private stageService: StageService,
    private commonService: CommanService,
    private formBuilder: FormBuilder,
    private customerStageService: CustomerStageService,
    private renderer: Renderer2,
    private overlayContainer: OverlayContainer
  ) {}
  ngOnInit(): void {
    this.setUserFromLocalStorage();
    // this.getDetailsFromState();
    this.initForm();
    this.getAllCustomerPayments();
    this.getAllStages();
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
      this.getActionStatus();
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

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
      this.userId = user.userId;
    }
  }
  // getDetailsFromState(){
  //   console.log(history.state);
  //   this.status = history.state.status;
  // }

  AddPaymentDetails(paymentDetails: IPaymentDetailsDto) {
    console.log('projectId from display page' + paymentDetails.projectId);
  }

  AddCustomerPayment() {
    const navigateToRoute = NAVIGATE_TO_ADD_CUSTOMER_PAYMENT;
    this.router.navigate([navigateToRoute], {
      state: {
        isAdding: true,
      },
    });
  }

  getAllCustomerPayments() {
    this.customerPaymentService
      .getAllCustomerPayments(
        this.customerPaymentId,
        this.stageId,
        this.stageName,
        this.pageIndex,
        this.pageSize,
        this.userId,
        this.actionBy,
        this.customStartDate,
        this.customEndDate,
        this.actionStatusId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (customerPayments) => {
          this.paymentDetails = customerPayments.records;
          console.log(this.paymentDetails);
          this.totalItems = customerPayments.totalRecords;
        },
        error: (error: Error) => {
          console.error('Error fetching prime activity code:', error);
        },
      });
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllCustomerPayments();
  }

  getAllStages() {
    this.stageService.getStages(this.stageName).subscribe({
      next: (data) => {
        this.stages = data;
      },
      error: (error: any) => {
        console.error('Error fetching Project Charge Charge Ins :', error);
      },
    });
  }
  displayStage(stage: StagesDto): string {
    return stage && stage.stageName ? stage.stageName : '';
  }
  onStageSelectSelect(event: any) {
    if (event?.option?.value) {
      this.stageId = event.option.value.stageId;
      this.getAllCustomerPayments();
    }
  }
  searchStage(event: any): void {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.stageName = query;
      this.getAllStages();
    }
    if (query.length === searchTextZero) {
      this.stageId = 0;
      this.getAllCustomerPayments();
    }
  }
  handleModel() {
    this.isModelView = true;
  }
  handleApprovalStatus(status: string) {
    this.isModelView = true;
  }

  close() {
    this.isModelView = false;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'approved';
      case 'Rejected':
        return 'rejected';
      case 'Waiting For Approval':
        return 'Not';
      case 'Pending':
        return 'pending';
      default:
        return '';
    }
  }

  editCustomerPayment(data: any) {
    console.log(data.customerPaymentId);
    this.fetchCustomerPaymentById(data.customerPaymentId);
  }

  fetchCustomerPaymentById(customerPaymentId: number) {
    console.log(customerPaymentId);
    this.customerPaymentId = customerPaymentId;
    this.customerPaymentService
      .getCustomerPaymentById(this.customerPaymentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.customerPayment = response;
          this.router.navigate([NAVIGATE_TO_ADD_CUSTOMER_PAYMENT], {
            state: {
              customerPayment: this.customerPayment,
              isAdding: false,
            },
          });
        },
        error: (error: Error) => {},
      });
  }

  onStatusChange(selectedValue: string): void {
    this.selectedStatus = selectedValue;
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    this.getAllCustomerPayments();
  }

  onSearchActionBy(actionBy: string) {
    if (
      actionBy.length >= searchTextLength ||
      actionBy.length === searchTextZero
    ) {
      this.actionBy = actionBy;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllCustomerPayments();
    }
  }

  goToApprovals(customerPayment: any) {
    console.log(customerPayment.remarks);
    this.remarks = customerPayment.remarks;
    this.isModelView = true;
  }

  resizeTextarea(event: any) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      customStartDate: [],
      customEndDate: [],
    });
    this.formData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formDataValue) => {
        if (formDataValue.customStartDate && formDataValue.customEndDate) {
          const startDate = this.formatDateTime(formDataValue.customStartDate);
          const endDate = this.formatDateTime(
            formDataValue.customEndDate,
            true
          );
          this.customStartDate = startDate;
          this.customEndDate = endDate;
          this.getAllCustomerPayments();
        }
      });
  }

  formatDateTime(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }

  //date filter
  onDateChange() {
    this.pageIndex = 0;
    this.paginator.firstPage();
    const startDate = this.formData.get('customStartDate')?.value;
    const endDate = this.formData.get('customEndDate')?.value;
    if (startDate !== null && endDate !== null) {
      this.dateRange = '';
      this.getAllCustomerPayments();
    } else {
      this.dateRange = 0;
    }
  }

  clearDateRange(): void {
    this.formData.get('customStartDate')?.setValue('');
    this.formData.get('customEndDate')?.setValue('');
    this.customStartDate = '';
    this.customEndDate = '';
    this.getAllCustomerPayments();
    console.log(this.formData.get('customStartDate')?.value);
    console.log(this.formData.get('customEndDate')?.value);
  }

  download(fileUrl: string, documentType: string) {
    console.log(fileUrl, documentType);
    this.customerStageService
      .generateDemandLetterPdf(fileUrl)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.downloadFile(response, documentType);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  downloadFile(response: Blob, fileName: string) {
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }
    getActionStatus() {
      this.commonService
        .getCommanReferanceDetailsWithFilters(
          ACTION_STATUS,
          this.paymentStatusName
        )
        .subscribe({
          next: (data) => {
            console.log(data);
            this.actionStatusNames = data;
            console.log(this.actionStatusNames);
          },
          error: (error: any) => {
            console.error('Error fetching Project Charge Charge Ins :', error);
          },
        });
    }
      onActionStatusSelect(event: any) {
        console.log(event.value);
        if(event.value.commonRefValue==='All'){
          let val = 0;
            this.actionStatusId = val;
        }
        else{
          this.actionStatusId = event.value.id;
        }
          this.getAllCustomerPayments();
        }
}
