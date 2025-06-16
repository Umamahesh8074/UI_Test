import { formatDate } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  Subject,
  takeUntil,
} from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  COMPANY_TYPE,
  PAGE_INDEX,
  PAGE_SIZE,
  TIME_OUT,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  NAVIGATE_TO_BOOKING_OVERVIEW,
  STAGE_STATUS,
  SALES_MEMBER,
  NAVIGATE_TO_ADD_CUSTOMER_PAYMENT_BY_CRM,
  USER_MANAGE_CRM,
  CRM_MEMBER_ROLL_NAME,
  BOOKED_STATUS,
  BOOKING_STATUS,
} from 'src/app/Constants/Crm/CrmConstants';
import { IApplicantInfoDto } from 'src/app/Models/Crm/ApplicantInfo';
import {
  IPaymentLedgerDto,
  paymentLedger,
  PaymentLedgerDto,
} from 'src/app/Models/Crm/PaymentDetails';
import { IProject, Project } from 'src/app/Models/Project/project';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { ApplicationInfoService } from 'src/app/Services/CrmServices/applicant-info.service';
import { CustomerStageService } from 'src/app/Services/CrmServices/customer-stages.service';
import { PaymentDetailsService } from 'src/app/Services/CrmServices/payment-details.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-displayBookingForm',
  templateUrl: './displayBookingForm.component.html',
  styleUrls: ['./displayBookingForm.component.css'],
})
export class DisplayBookingFormComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('saleAgreementUrl') saleAgreementUrl!: ElementRef;
  @Output() goToCustomerStages = new EventEmitter<{
    bookingId: number;
    firstApplicantName: string;
    unitName: string;
    projectId: number;
    typeCommonReferenceDetailsId: number;
  }>();
  destroy$ = new Subject<void>();
  pageSize: number = PAGE_SIZE;
  totalPages: number = 0;
  applicantInfoData: IApplicantInfoDto[] = [];
  pageSizeOptions = pageSizeOptions;
  // fristapplicantName: string='';
  organizationId: number = 0;
  salesMemberRoleName = SALES_MEMBER;
  selectedLedgerData: paymentLedger = new paymentLedger();

  @Input() projectName: string = '';
  @Input() firstApplicantName: string = '';
  @Input() unitName: string = '';
  @Input() typeId: number = 0;
  @Input() blockId: number = 0;
  @Input() planId: number = 0;
  @Input() pageIndex: number = 0;
  projects: Project[] = [];
  @Input() projectId: number = 0;
  @Input() unitId: number = 0;
  isAdding: boolean = false;
  project: any = new FormControl([] as IProject[]);
  bookedByName: string = '';
  applicantInfo: any;
  @Input() roleName: string = '';
  isEmailSent = false; // Track whether the email has been sent
  crmUserId: number = 0;
  paymentLedgerDto: IPaymentLedgerDto[] = [];
  @Input() typeCommonReferenceDetailsId: number = 0;
  userManageData: any;
  bookedById: number = 0;
  @Input() userId: number = 0;
  isModelView: boolean = false;
  user: User[] = [];
  remarks: string = '';
  cancelledBookingDate: any;
  bookingId: number = 0;
  fileName: string = '';
  isSubmitted: boolean = false;
  bookingStatusData: any;
  @ViewChild('cancelledBookingDate')
  cancelledBookingDateInput!: MatDatepicker<any>;
  cancelledDate: any;
  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.getDataFromState();
    if (!CRM_MEMBER_ROLL_NAME.includes(this.roleName)) {
      this.getAllApplicantInfos();
    }
    // this.fetchProjects();
  }

  constructor(
    public dialog: MatDialog,
    private projectService: ProjectService,
    private applicationInfoService: ApplicationInfoService,
    private router: Router,
    private toastrService: ToastrService,
    private commanService: CommanService,
    private customerStageService: CustomerStageService,
    private loaderService: LoaderService,
    private paymentDetailsService: PaymentDetailsService,
    private commonService: CommanService
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['projectId'] ||
      changes['typeCommonReferenceDetailsId'] ||
      changes['projectName'] ||
      changes['firstApplicantName'] ||
      changes['unitName'] ||
      changes['typeId'] ||
      changes['blockId'] ||
      changes['planId'] ||
      changes['pageIndex'] ||
      changes['pagination'] ||
      changes['roleName'] ||
      changes['unitId'] ||
      changes['triggerRefresh']
    ) {
      if (this.roleName?.toLowerCase() === SALES_MEMBER) {
        this.bookedById = this.userId;
      }
      console.log('blockId123456ty ' + this.blockId);
      console.log('unitname5678909876789098' + this.unitName);

      // this.pageIndex = 0;
      // this.totalPages = 0;
      this.paginator.firstPage();
      this.getAllApplicantInfos();
      // this.onPageChange(this.pageIndex)
    }
  }

  displayedColumns: string[] = [
    // 'rowNumber',
    'bookingCode',
    'firstApplicantName',
    'projectName',
    'levelName',
    'blockName',
    'unitName',
    'bookedByName',
    'crmUser',
    'landOwnerOrBuilder',
    'description',
    // 'basePrice',
    // 'totalCharges',
    'finalPrice',
    'receivedAmount',
    'bookingDate',
    'bookingStatus',
    'actions',
  ];

  navigateToCustomerStages(
    bookingId: number,
    firstApplicantName: string,
    unitName: string,
    projectId: number,
    typeCommonReferenceDetailsId: number
  ) {
    console.log(unitName);

    this.goToCustomerStages.emit({
      bookingId: bookingId,
      firstApplicantName: firstApplicantName,
      unitName: unitName,
      projectId: projectId,
      typeCommonReferenceDetailsId: typeCommonReferenceDetailsId,
    });
  }
  getDataFromState() {
    const historyState = history.state;
    console.log(historyState.pageSize, historyState.pageIndex);

    if (historyState.pageSize != undefined) {
      this.pageSize = historyState.pageSize;
      console.log('page size', this.pageSize);
    }
    if (historyState.pageIndex != undefined) {
      this.pageIndex = historyState.pageIndex;
      console.log('page index', this.pageIndex);
    }
    if (historyState.blockId != undefined) {
      this.blockId = historyState.blockId;
      console.log(' blockId', this.blockId);
    }
    if (historyState.planId != undefined) {
      this.planId = historyState.planId;
      console.log('planId', this.planId);
    }
    if (historyState.projectId != undefined) {
      this.projectId = historyState.projectId;
      console.log('projectId', this.projectId);
    }
    if (historyState.unitId != undefined) {
      this.unitId = historyState.unitId;
      console.log('unitId', this.unitId);
    }
    if (historyState.unitName != undefined) {
      this.unitName = historyState.unitName;
      console.log('unitName', this.unitName);
    }
    if (historyState.typeId != undefined) {
      this.typeId = historyState.typeId;
      console.log('typeId', this.typeId);
    }
    if (historyState.firstApplicantName != undefined) {
      this.firstApplicantName = historyState.firstApplicantName;
      console.log(this.firstApplicantName);
    }
  }
  getAllApplicantInfos() {
    console.log();

    console.log(this.pageSize, this.pageIndex);
    this.showLoading();
    console.log(this.projectName);
    console.log(this.projectId, this.typeCommonReferenceDetailsId);
    const bookedByIdToSend =
      this.roleName?.toLowerCase() === SALES_MEMBER ? this.bookedById : 0;

    this.applicationInfoService
      .getAllApplicantInfo(
        this.pageIndex,
        this.pageSize,
        // STAGE_STATUS,
        this.typeCommonReferenceDetailsId,
        this.projectId,
        this.firstApplicantName,
        this.projectName,
        this.unitName,
        this.bookedById,
        this.typeId,
        '',
        this.blockId,
        0,
        0,
        this.planId,
        this.roleName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (applicantInfo) => {
          this.applicantInfoData = applicantInfo.records;
          this.totalPages = applicantInfo.totalRecords;
          this.paginator.pageIndex = this.pageIndex;
          this.paginator.pageSize = this.pageSize;
          // this.getCommonRefDetailsBYTypeAndKey(applicantInfoData.bookingStatus)
          this.hideLoading();
        },
        error: (error) => {
          console.log(error.error);
          this.hideLoading();
        },
      });
  }
  private setUserFromLocalStorage(): void {
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      console.log(user.organizationId);
      this.organizationId = user.organizationId;
      this.roleName = user.roleName;
    }
  }

  //fetch projects based on organization id
  fetchProjects() {
    this.projectService
      .getProjectsByOrgIdWithProjectFilter(
        this.organizationId,
        this.projectName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          console.log(projects);
          this.projects = projects;
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  onProjectSelect(event: any) {
    this.projectName = event.option.value.projectName;
    this.projectId = event.option.value.projectId;
    this.getAllApplicantInfos();
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }

  searchProject(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.projectName = query;
      this.fetchProjects();
      this.getAllApplicantInfos();
    } else if (query.length == 0) {
      this.projectName = '';
      this.fetchProjects();
      this.getAllApplicantInfos();
    }
  }

  openConfirmDialog(id: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: ' delete Applicant Info' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteApplicantInfo(id);
        }
      }
    );
  }
  // fetchPaymentLedgerByPaymentLedgerId(applicantId: number) {
  //   this.showLoading();
  //   this.paymentDetailsService
  //     .getPaymentLedgerByApplicantId(applicantId)
  //     .subscribe({
  //       next: (data) => {
  //         console.log(data);
  //         this.selectedLedgerData = data;
  //         this.router.navigate(['/layout/crm/booking'], {
  //           state: {
  //             customerInfo: data,
  //             isAdding: false,
  //             pageIndex: this.pageIndex,
  //             pageSize: this.pageSize,
  //           },
  //         });
  //         this.hideLoading();
  //       },
  //       error: (error: any) => {
  //         this.hideLoading();
  //         console.error('Error fetching Project Charge Charge Ins :', error);
  //       },
  //     });
  // }

  // editApplicantInfo(applicantInfoData: any) {
  //   this.fetchApplicantInfoById(applicantInfoData.bookingId);
  //   this.fetchPaymentLedgerByPaymentLedgerId(applicantInfoData.bookingId);
  // }

  // fetchApplicantInfoById(id: number) {
  //   this.applicationInfoService
  //     .getApplicantInfoById(id)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (applicantInfoData) => {
  //         console.log(applicantInfoData);
  //         this.router.navigate(['/layout/crm/booking'], {
  //           state: {
  //             applicantInfoData: applicantInfoData,
  //             isAdding: false,
  //             activeStep: 'Unit Details',
  //             pageIndex: this.pageIndex,
  //             pageSize: this.pageSize,
  //           },
  //         });
  //       },
  //       error: (error) => {
  //         console.error(error);
  //         console.error('Error fetching applicantInfo plan  by id:', error);
  //       },
  //     });
  // }

  editApplicantInfo(applicantInfoData: any) {
    // Wait for both HTTP requests to complete before navigating
    forkJoin([
      this.fetchApplicantInfoById(applicantInfoData.bookingId),
      this.fetchPaymentLedgerByPaymentLedgerId(applicantInfoData.bookingId),
    ]).subscribe({
      next: ([applicantInfoData, paymentLedgerData]) => {
        console.log(applicantInfoData, paymentLedgerData);
        // Both requests completed, navigate now
        this.router.navigate(['/layout/crm/booking'], {
          state: {
            applicantInfoData: applicantInfoData,
            customerInfo: paymentLedgerData,
            isAdding: false,
            activeStep: 'Unit Details',
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            firstApplicantName: this.firstApplicantName,
            projectId: this.projectId,
            blockId: this.blockId,
            planId: this.planId,
            typeId: this.typeId,
            unitId: this.unitId,
            unitName: this.unitName,
          },
        });
      },
      error: (error) => {
        console.error(
          'Error fetching applicant info or payment ledger:',
          error
        );
      },
    });
  }

  fetchApplicantInfoById(id: number) {
    return this.applicationInfoService
      .getApplicantInfoById(id)
      .pipe(takeUntil(this.destroy$));
  }

  fetchPaymentLedgerByPaymentLedgerId(applicantId: number) {
    return this.paymentDetailsService
      .getPaymentLedgerByApplicantId(applicantId)
      .pipe(takeUntil(this.destroy$));
  }

  sendWelcomeEmail(applicationInfo: any) {
    const userId = applicationInfo?.userId;
    const bookingId = applicationInfo?.bookingId;

    if (userId) {
      this.isEmailSent = false; // Ensure the button is enabled when the email sending starts
      this.applicationInfoService
        .sendWelcomeEmail(userId, bookingId)
        .subscribe({
          next: (response) => {
            console.log('Backend Response:', response);

            // Update the flag to show email has been sent and disable the button
            this.isEmailSent = true;

            Swal.fire({
              icon: 'success',
              title: 'Email Sent!',
              text: response || 'The Credentials have been sent successfully.',
            });
            this.getAllApplicantInfos();
          },
          error: (error) => {
            console.error('Error Response:', error);

            Swal.fire({
              icon: 'error',
              title: 'Failed!',
              text:
                error?.error || 'There was an error sending the Credentials.',
            });
          },
        });
    } else {
      console.error('User ID not found in application info');
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'User ID not found in application info.',
      });
    }
  }

  deleteApplicantInfo(id: number) {
    this.applicationInfoService.deleteApplicantInfo(id).subscribe({
      next: (response: any) => {
        this.handleSuccessResponse(response);
      },
      error: (error: Error) => {
        console.error('Error deleting applicant info:', error);
      },
    });
  }
  handleSuccessResponse(response: any): void {
    console.log(response.message);
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
  }

  onSearch(bookedByName: string) {
    if (
      bookedByName.length >= searchTextLength ||
      bookedByName.length === searchTextZero
    ) {
      this.bookedByName = bookedByName;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllApplicantInfos();
    }
  }

  addBookingForm() {
    this.router.navigate(['/layout/crm/booking'], {
      state: {
        isAdding: true,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      },
    });
  }

  onPageChange(event: any) {
    console.log(event);
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    console.log(this.pageSize, this.pageIndex);
    this.getAllApplicantInfos();
  }
  generateCostSheet(bookingId?: number, costSheet?: string): void {
    this.showLoading();
    console.log('File Path Received', bookingId, costSheet);
    if (costSheet) {
      console.log('File path already exists:', costSheet);
      this.downloadGeneratedCostSheet(costSheet);
      return;
    }
    console.log(bookingId);
    this.applicationInfoService
      .generateCostSheet(bookingId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (filePath: string) => {
          console.log('PDF URL received:', filePath);
          this.hideLoading();
          // Show Swal with a Download button
          Swal.fire({
            title: 'Cost Sheet Generated',
            text: 'Your Cost Sheet has been generated successfully!',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Download',
            cancelButtonText: 'Close',
          }).then((result) => {
            if (result.isConfirmed) {
              this.downloadGeneratedCostSheet(filePath);
            }
          });

          // Optionally refresh other related data
          this.getAllApplicantInfos();
        },
        error: (error: Error) => {
          this.hideLoading();
          console.error('Error generating cost sheet:', error.message);
          Swal.fire({
            title: 'Error',
            text: 'Failed to generate the Cost Sheet. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
  }

  downloadGeneratedCostSheet(filePath: string): void {
    const decodedUrl = decodeURIComponent(filePath);
    let fileName = 'Cost Sheet'; // Default file name
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] || fileName;
    }

    this.customerStageService
      .generateDemandLetterPdf(filePath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          console.log('PDF file received:', response);
          this.downloadFile(response, fileName);
          Swal.fire({
            title: 'Downloaded',
            text: 'Your Cost Sheet has been downloaded successfully!',
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

  downloadUploadedSalesAgreement(filePath: string): void {
    const decodedUrl = decodeURIComponent(filePath);
    let fileName = 'Sale Agreement'; // Default file name
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] || fileName;
    }

    this.customerStageService
      .generateDemandLetterPdf(filePath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          console.log('PDF file received:', response);
          this.downloadFile(response, fileName);
          Swal.fire({
            title: 'Downloaded',
            text: 'Your Sale Agreeement has been downloaded successfully!',
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

  downloadDocuments(filePath: string) {
    const documentUrl = filePath;
    const decodedUrl = decodeURIComponent(documentUrl);
    let fileName = '';

    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] ?? '';
    } else {
      fileName = 'Document';
    }

    // Pass the filePath directly to the service method
    this.customerStageService
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

  getShortDescription(description: string): string {
    if (!description) return '';
    const words = description.split(' ');
    return words.slice(0, 3).join(' ') + (words.length > 3 ? '...' : '');
  }
  // selectedFile: File ;// Store the single selected file
  selectedFile: any;

  uploadsSaleAgreement(): void {
    console.log('Selected file:', this.selectedFile);
    console.log('Booking ID:', this.selectedBookingId);

    if (!this.selectedFile) {
      console.warn('No file selected for upload.');
      // return of(null); // Return null instead of a string
    }

    const fileName = this.projectName + '_' + this.unitName;
    const validBookingId = this.selectedBookingId ?? 0;
    console.log(validBookingId);

    this.applicationInfoService
      .uploadSaleAgreement(validBookingId, this.selectedFile, fileName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.closeModal();
          this.handleSuccessResponse(response);
          this.getAllApplicantInfos();
          // this.router.navigate([NAVIGATE_TO_BOOKING_OVERVIEW]);
        },
        error: (error: any) => {
          console.error(error);
        },
      });
  }

  fileSizeDisplay: string = 'No file chosen'; // Display file information
  fileTypeError: boolean = false; // Error flag for invalid file type

  // onFileChange(event: Event): void {
  //   const input = event.target as HTMLInputElement; // Get the input element
  //   this.selectedFile = new File([''], 'default.txt', { type: 'text/plain' }); // Reset the selected file
  //   this.fileTypeError = false; // Reset the error flag

  //   if (input && input.files && input.files.length > 0) {
  //     const file = input.files[0]; // Get the first selected file
  //     this.selectedFile = file;
  //   } else {
  //     this.fileSizeDisplay = 'No file chosen';
  //   }

  //   console.log('Selected File:', this.selectedFile);
  // }
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    this.selectedFile = null; // ✅ Reset to null
    this.fileTypeError = false;
    this.fileSizeDisplay = 'No file chosen';

    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];

      // Optional: Check file size or type here
      if (file.size === 0) {
        console.warn('Empty file selected.');
        return;
      }

      this.selectedFile = file;
      this.fileSizeDisplay = file.name;
    }

    console.log('Selected File:', this.selectedFile);
  }

  selectedBookingId: number | null = null;
  isModalOpen = false;

  openUploadModal(bookingId: number) {
    this.selectedBookingId = bookingId; // Set booking ID
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
  sendForApproval(applicantInfo: any) {
    console.log(applicantInfo);
    this.applicationInfoService
      .moveSaleAgreementToWorkFlow(applicantInfo.bookingId, this.crmUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          Swal.fire('Success', response.message, 'success');
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  sendForApprovalAfterRework(applicantInfo: any) {
    console.log(applicantInfo);
    this.applicationInfoService
      .moveSaleAgreementAfterWorkFlow(applicantInfo.bookingId, this.crmUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          Swal.fire('Success', response.message, 'success');
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  shouldShowForRole(allowedRoles: string[]): boolean {
    return allowedRoles.includes(this.roleName);
  }
  cancelBooking(applicantInfo: any) {
    this.isModelView = true;
    this.bookingId = applicantInfo.bookingId;
    this.fileName = applicantInfo.projectName + '_' + applicantInfo.unitName;
  }
  onClose() {
    this.isModelView = false;
    this.remarks = '';
  }
  resizeTextarea(event: any) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
  handleApprovalStatus() {
    console.log('Status:', 'Remarks:', this.remarks);
    this.isSubmitted = true;
    console.info(this.selectedFile);
    if (!this.remarks || !this.selectedFile) {
      return; // Stop here if any field is missing
    }
    this.isModelView = false;
    this.updateCancelRemarks();

    this.remarks = '';
    console.log('Remarks exist:', this.remarks);
  }
  updateCancelRemarks() {
    this.showLoading();
    console.log(this.remarks);
    this.applicationInfoService
      .updateCancelRemarks(
        this.bookingId,
        this.remarks,
        this.userId,
        this.fileName,
        this.selectedFile,
        this.formatDateTime(this.cancelledDate)
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.hideLoading();
          Swal.fire('Success', response.message, 'success');
          this.getAllApplicantInfos();
        },
        error: (error: Error) => {
          this.hideLoading();
          console.log(error);
        },
      });
  }
  getCommonRefDetailsBYTypeAndKey(status: string) {
    this.commonService
      .getCommanReferanceDetailsWithFilters(BOOKING_STATUS, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.bookingStatusData = response;
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  formatDateTime(date: Date): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-IN');
  }

  selectedRow: any;
  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedRowData: any = null;

  onTableRightClick(event: MouseEvent, rowData: any) {
    if (event.ctrlKey) {
      this.selectedRow = rowData;
      event.preventDefault(); // This blocks the browser menu
      this.contextMenuPosition = {
        x: event.clientX,
        y: event.clientY,
      };
      this.contextMenuVisible = true;
      this.selectedRowData = rowData;
      console.log('Context Menu Position:', this.contextMenuPosition);

      console.log(this.contextMenuVisible);
    } else {
      this.contextMenuVisible = false;
    }
  }

  // onGlobalMenuAction(action: any) {
  //   this.contextMenuVisible = false;
  //   if (action === 'Edit') {
  //     console.log(this.selectedRowData);
  //   } else if (action === 'Generate Cost Sheet') {
  //     console.log(this.selectedRowData);
  //   } else if (action === 'Send Credentials') {
  //     console.log(this.selectedRowData);
  //   }
  // }

  @HostListener('document:click')
  onClickOutside() {
    this.contextMenuVisible = false;
  }

  onRightClick(event: MouseEvent) {
    console.log('Ctrl pressed:', event.ctrlKey);

    if (event.ctrlKey) {
      event.preventDefault(); // This blocks the browser menu
      this.contextMenuPosition = {
        x: event.clientX,
        y: event.clientY,
      };
      this.contextMenuVisible = true;
    } else {
      this.contextMenuVisible = false;
    }
  }
}
