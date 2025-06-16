import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  INITIATE_TYPE,
  PAGE_INDEX,
  TIME_OUT,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
} from 'src/app/Constants/CommanConstants/Comman';
import { ICustomerStagesDto } from 'src/app/Models/Project/customerStages';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ApplicationInfoService } from 'src/app/Services/CrmServices/applicant-info.service';
import { CustomerStageService } from 'src/app/Services/CrmServices/customer-stages.service';
import Swal from 'sweetalert2';
import { StageService } from 'src/app/Services/ProjectService/Stage/stage.service';
import { StagesDto } from 'src/app/Models/WorkOrder/WorkOrderBilling';
import { IPaymentPlan, PaymentPlan } from 'src/app/Models/Project/PaymentPlan';
import { IStage, Stage, StageDto } from 'src/app/Models/Project/stage';
import { FormControl } from '@angular/forms';
import { IBlock } from 'src/app/Models/Block/block';
import { PaymentPlanService } from 'src/app/Services/ProjectService/PaymentPlan/paymentPlan.service';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { SALES_MEMBER } from 'src/app/Constants/Crm/CrmConstants';

@Component({
  selector: 'app-displayCustomerStages',
  templateUrl: './displayCustomerStages.component.html',
  styleUrls: ['./displayCustomerStages.component.css'],
})
export class DisplayCustomerStagesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  destroy$ = new Subject<void>();
  pageSize: number = 14;
  // pageIndex: number = 0;
  totalItems: number = 0;
  customerStagesDto: ICustomerStagesDto[] = [];
  pageSizeOptions = pageSizeOptions;
  organizationId: number = 0;
  // bookingName: string ='';
  // bookingId: number = 0;
  stageId: number = 0;
  stageName: string = '';
  initiated: string = '';
  initiate: any;
  stages: any;
  stageOrder: number = 0;
  paymentPlans: any[] = [];
  selectedPaymentPlan: IPaymentPlan = new PaymentPlan();
  stage: IStage = new Stage();
  paymentPlan: any = new FormControl([] as IPaymentPlan[]);
  planName: any;
  blocks: any;
  blockName: string = '';
  block: any = new FormControl([] as IBlock[]);
  stageFc: any = new FormControl([] as StageDto[]);
  @Input() projectName: string = '';
  @Input() projectId: any;
  @Input() blockId: any;
  @Input() planId: number = 0;
  @Input() firstApplicantName: string = '';
  @Input() bookingId: number = 0;
  @Input() unitName: string = '';
  @Input() typeId: number = 0;
  @Output() refreshRequired = new EventEmitter<void>();
  @Input() pageIndex: number = 0;
  @Input() roleName: string = '';
  totalPages: number = 0;
  @Input() bookedById: number = 0;
  @Input() userId: number = 0;
  @Input() typeCommonReferenceDetailsId: number = 0;

  ngOnInit(): void {
    this.getAllCustomerStages();
    this.getInitiateTypes();
    this.setUserFromLocalStorage();
    this.setDisplayedColumnsBasedOnRole();
    // this.customerStageService.refreshRequired.subscribe(() => {
    //   this.getAllCustomerStages();
    // });
  }

  constructor(
    public dialog: MatDialog,
    private customerStageService: CustomerStageService,
    private router: Router,
    private toastrService: ToastrService,
    private commonService: CommanService,
    private applicationInfoService: ApplicationInfoService,
    private commanService: CommanService,
    private stageService: StageService,
    private cdr: ChangeDetectorRef,
    private loaderService: LoaderService
  ) {}

  displayedColumns: string[] = [
    // 'rowNumber',
    'bookingCode',
    'bookingName',
    'stageName',
    'planName',
    'stageOrder',
    'description',
    'unitName',
    'landOwnerOrBuilder',
    'percentage',
    // 'expectedDate',
    // 'actualDate',
    // 'finalPrice',
    'expectedAmount',
    'TDS',
    'initiated',
    // 'status',
    'actions',
  ];

  ngOnChanges(changes: SimpleChanges) {
    const relevantKeys = [
      'projectId',
      'projectName',
      'firstApplicantName',
      'unitName',
      'typeId',
      'pageIndex',
      'roleName',
      'typeCommonReferenceDetailsId',
    ];

    if (
      relevantKeys.some((key) => key in changes) ||
      (changes['bookingId'] && this.bookingId)
    ) {
      this.getAllCustomerStages();
    }
    const stageKeys = ['projectId', 'blockId', 'planId'];
    console.log(stageKeys);
    if (stageKeys.some((key) => key in changes)) {
      console.log('Stage-related change detected:', changes);

      // If any of the stageKeys were cleared, reset related fields
      if (
        stageKeys.some(
          (key) =>
            changes[key]?.currentValue === null ||
            changes[key]?.currentValue === '' ||
            changes[key]?.currentValue === undefined
        )
      ) {
        this.stageName = '';
        this.stageId = 0;
        this.stageFc.setValue(null);
      }
      if (this.roleName?.toLowerCase() === SALES_MEMBER) {
        this.bookedById = this.userId;
      }
      this.pageIndex = 0;
      this.totalPages = 0;
      this.paginator.firstPage();
      this.getAllStages();
      this.getAllCustomerStages();
    }
  }

  private setUserFromLocalStorage(): void {
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
      // this.roleName = user.roleName;
    }
  }
  getAllCustomerStages() {
    this.showLoading();
    this.customerStageService
      .getAllCustomerStages(
        this.pageIndex,
        this.pageSize,
        this.projectId,
        this.typeCommonReferenceDetailsId,
        this.firstApplicantName,
        this.stageName,
        this.initiated,
        this.unitName,
        this.projectName,
        this.stageOrder,
        this.stageId,
        this.typeId,
        this.blockId,
        this.planId,
        this.roleName,
        this.bookedById
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (customerStagesDto) => {
          this.customerStagesDto = customerStagesDto.records;
          this.totalItems = customerStagesDto.totalRecords;
          this.hideLoading();
        },
        error: (error) => {
          console.log(error.error);
        },
      });
  }

  // openConfirmDialog(id: any) {
  //   const dialogRef = this.dialog.open(ConfirmdialogComponent, {
  //     data: { displayedData: ' delete Applicant Info' },
  //   });

  //   dialogRef.componentInstance.isConfirmDelete.subscribe(
  //     (isDelete: boolean) => {
  //       if (isDelete) {
  //         this.deleteApplicantInfo(id);
  //       }
  //     }
  //   );
  // }

  editApplicantInfo(customerStagesDto: any) {
    this.fetchApplicantInfoById(customerStagesDto.bookingId);
  }

  fetchApplicantInfoById(id: number) {
    this.applicationInfoService
      .getApplicantInfoById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (applicantInfoData) => {
          this.router.navigate(['/layout/crm/booking'], {
            state: {
              applicantInfoData: applicantInfoData,
              isAdding: false,
              activeStep: 'Stage Details',
            },
          });
        },
        error: (error) => {
          console.error(error);
          console.error('Error fetching applicantInfo plan  by id:', error);
        },
      });
  }

  // deleteApplicantInfo(id: number) {
  //   this.applicationInfoService.deleteApplicantInfo(id).subscribe({
  //     next: (response: any) => {
  //       this.handleSuccessResponse(response);
  //     },
  //     error: (error: Error) => {
  //       console.error('Error deleting applicant info:', error);
  //     },
  //   });
  // }
  handleSuccessResponse(response: any): void {
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
  }

  addBookingForm() {
    this.router.navigate(['/layout/crm/booking'], {
      state: { isAdding: true },
    });
  }

  // onSearch(customerName: string) {
  //   if (
  //     customerName.length >= searchTextLength ||
  //     customerName.length === searchTextZero
  //   ) {
  //     this.bookingName = customerName;
  //     this.pageIndex = PAGE_INDEX;
  //     this.paginator.firstPage();
  //     this.getAllCustomerStages();
  //   }
  // }
  onSearchStageName(stageName: string) {
    if (
      stageName.length >= searchTextLength ||
      stageName.length === searchTextZero
    ) {
      this.stageName = stageName;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllCustomerStages();
    }
  }

  onSearchStageOrder(stageOrder: number) {
    this.stageOrder = stageOrder;
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    this.getAllCustomerStages();
  }
  onInitiateChange(event: any) {
    this.initiated = event.value;
    this.getAllCustomerStages();
  }

  getInitiateTypes() {
    this.commonService.fetchCommonReferenceTypes(INITIATE_TYPE).subscribe({
      next: (data) => {
        this.initiate = data;
        //this.setDefaultStatus();
        // this.getAllCustomerStages();
      },

      error: (error) => {
        console.error(error?.message);
      },
    });
  }
  downloadDocument(filePath: string) {
    this.showLoading();
    const documentUrl = filePath;
    const decodedUrl = decodeURIComponent(documentUrl);
    let fileName = '';
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] ?? '';
    } else {
      fileName = 'Demand Letter';
    }

    // Pass the filePath directly to the service method
    this.customerStageService
      .generateDemandLetterPdf(filePath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          this.downloadFile(response, fileName);
          this.hideLoading();
        },
        error: (error: Error) => {
          this.hideLoading();
          console.error('Error downloading PDF:', error);
        },
      });
  }

  downloadFile(response: Blob, fileName: string) {
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    // window.open(url);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName; // Ensure the filename is used correctly
    link.click();
    window.URL.revokeObjectURL(url);
  }
  viewDocument(filePath: string) {
    this.showLoading();
    const documentUrl = filePath;
    const decodedUrl = decodeURIComponent(documentUrl);
    let fileName = '';
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] ?? '';
    } else {
      fileName = 'Demand Letter';
    }

    // Pass the filePath directly to the service method
    this.customerStageService
      .generateDemandLetterPdf(filePath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          this.viewFile(response, fileName);
          this.hideLoading();
        },
        error: (error: Error) => {
          this.hideLoading();
          console.error('Error downloading PDF:', error);
        },
      });
  }
  viewFile(response: Blob, fileName: string) {
    const blob = new Blob([response], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = fileName; // Ensure the filename is used correctly
    // link.click();
    // window.URL.revokeObjectURL(url);
  }
  sendEmail(bookingId: number, stageId: number): void {
    this.showLoading();
    this.customerStageService
      .sendDemandLetter(bookingId, stageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.hideLoading();
          if (response.status === 'success') {
            Swal.fire({
              icon: 'success',
              title: 'Email Sent',
              text: response.message,
              confirmButtonText: 'OK',
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.message || 'Unknown error occurred.',
              confirmButtonText: 'OK',
            });
          }
        },
        error: (error: any) => {
          this.hideLoading();
          console.error('Error while sending email:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to send the demand notice email. Please try again later.',
            confirmButtonText: 'OK',
          });
        },
      });
  }

  generateIndividualDemandLetter(bookingId: number): void {
    this.showLoading();
    this.customerStageService
      .generateIndividualDemandLetter(bookingId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: string) => {
          this.hideLoading();
          Swal.fire({
            title: 'PDF Generated',
            text: 'Your PDF has been generated successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
          // Refresh customer stages
          this.getAllCustomerStages();
        },
        error: (error: Error) => {
          this.hideLoading();
          console.error('Error fetching PDF URL:', error.message);

          Swal.fire({
            title: 'Error',
            text: 'Failed to generate the PDF. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllCustomerStages();
  }

  getAllStages() {
    this.stageService
      .getStages(this.stageName, this.projectId, this.planId, this.blockId)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.stages = data;
          //  this.getAllCustomerStages();
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  displayStage(stage: StagesDto): string {
    return stage && stage.stageName ? stage.stageName : '';
  }
  onStageSelect(event: any) {
    if (event?.option?.value) {
      this.stageId = event.option.value.stageId;
      this.getAllCustomerStages();
    }
  }

  searchStage(event: any): void {
    const query = event.target.value;
    if (query.length >= searchTextLength) {
      this.stageName = query;
      this.getAllStages();
    }
    if (query.length === searchTextZero) {
      this.stageId = 0;
      this.stageName = '';
      this.getAllStages();
      this.getAllCustomerStages();
    }
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }

  setDisplayedColumnsBasedOnRole() {
    if (this.roleName === SALES_MEMBER) {
      this.displayedColumns = this.displayedColumns.filter(
        (displayedColumn) => displayedColumn !== 'actions'
      );
    }
  }
}
