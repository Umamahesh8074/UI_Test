import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  COMPANY_TYPE,
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  ACTION_STATUS,
  CRM_MEMBER_ROLL_NAME,
  NAVIGATE_TO_ADD_CUSTOMER_PAYMENT_BY_CRM,
  STAGE_STATUS,
  TRANSACTION_TYPE,
  TRANSACTION_TYPE_PAYMENT,
  USER_MANAGE_CRM,
  USER_MANAGE_TYPE,
} from 'src/app/Constants/Crm/CrmConstants';
import { Block, IBlock } from 'src/app/Models/Block/block';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import {
  IPaymentLedgerDto,
  paymentLedger,
  PaymentLedgerDto,
} from 'src/app/Models/Crm/PaymentDetails';
import { Unit } from 'src/app/Models/Project/unit';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { IUserManageDto } from 'src/app/Models/User/UserManage';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { ApplicationInfoService } from 'src/app/Services/CrmServices/applicant-info.service';
import { DashBoardService } from 'src/app/Services/CrmServices/crm-dashboard.service';
import { CustomerStageService } from 'src/app/Services/CrmServices/customer-stages.service';
import { PaymentDetailsService } from 'src/app/Services/CrmServices/payment-details.service';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { PaymentPlanService } from 'src/app/Services/ProjectService/PaymentPlan/paymentPlan.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { StageService } from 'src/app/Services/ProjectService/Stage/stage.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-display-payment-ledger',
  templateUrl: './display-payment-ledger.component.html',
  styleUrls: ['./display-payment-ledger.component.css'],
})
export class DisplayPaymentLedgerComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  applicantName: string = '';
  actionStatusId: number = 0;
  projectId: any[] = [];
  stageId: any = [];
  projectName: string = '';
  // projects: Project[] = [];
  // project: any = new FormControl([] as IProject[]);
  unitName = '';
  unitId: number[] = [];
  units: Unit[] = [];
  userManageData: any;
  unit: any = new FormControl([] as Unit[]);
  transactionTypeAsPayment: CommonReferenceDetails =
    new CommonReferenceDetails();
  transactionData: Map<string, CommonReferenceDetails> = new Map();
  paymentTransactionTypeId: number = 0;
  transActionStatus: string = '';
  transActionTypes: CommonReferenceType[] = [];
  paymentLedger: IPaymentLedgerDto[] = [];
  selectedProject: any = null;
  organizationId: number = 0;
  userId: number = 0;
  roleName: string = '';
  transactionTypeId: number = 0;
  selectedStatus: string = 'All';
  actionStatus: string = '';
  paymentStatusNames: CommonReferenceType[] = [];
  actionStatusNames: CommonReferenceType[] = [];
  paymentStatusName: string = '';
  selectedLedgerData: paymentLedger = new paymentLedger();
  formattedApprovedAmount: string = '';
  formattedWaitingForApprovalAmount: string = '';
  approvedTdsAmount: string = '';
  waitingForApprovalTdsAmount: string = '';
  typeCommonReferenceDetailsId: number = 0;
  crmMemberRoleName = CRM_MEMBER_ROLL_NAME;
  typeId: number = 0;
  selectedBlock: IBlock = new Block();
  companyType: any;
  displayedColumns: string[] = [
    'paymentReceiptCode',
    'customerName',
    'projectName',
    'unit',

    'paymentDate',
    'referenceNumber',
    'bankName',
    'branchName',
    'sourceName',
    'paymentTypeName',
    'paidAmount',
    // 'paidAmountForApproval',
    'approvedStatus',
    'transactionType',
    'landOwnerOrBuilder',
    'createdDate',
    'remarks',
    'actions',
  ];
  isAdding: boolean = false;
  blockName: string = '';
  // blocks: any;
  block: any = new FormControl([] as IBlock[]);
  // blockId: number = 0;
  planId: any = [];
  project: any = new FormControl([] as IUserManageDto[]);
  @ViewChild('allProjectSelected') private allProjectSelected?: any;
  @ViewChild('allBlockSelected') private allBlockSelected?: MatCheckbox;
  selectedprojectIds: number[] = [];
  selectedUserManageIds: number[] = [];
  selectedBlockIds: any;
  fromComponent: boolean = false;
  selectedUserManages: any[] = [];
  userManageprojects: any[] = [];
  selectedBlocks: any[] = [];
  blockId: any = [];
  blocks: any[] = [];
  constructor(
    private paymentDetailsService: PaymentDetailsService,
    private router: Router,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private stageService: StageService,
    private commonService: CommanService,
    private commonRefDetailsService: CommonreferencedetailsService,
    private applicantInfoService: ApplicationInfoService,
    private projectService: ProjectService,
    private unitService: UnitService,
    private dashboardservice: DashBoardService,
    private customerStageService: CustomerStageService,
    private paymentPlanService: PaymentPlanService,
    private blockService: BlockService,
    private loaderService: LoaderService,
    private usermanageService: UsermanageService,
    private commanService: CommanService
  ) {}
  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.getDataFromState();
    // this.fetchProjects();
    this.getActionStatus();
    this.getCompanyTypes();
    this.getTransActionStatus();
    this.getUserManageTypes();
    this.getCompanyTypes();
  }
  getDataFromState() {
    if (history.state.actionStatus) {
      console.log(history.state);
      console.log(history.state.actionStatus);
      this.actionStatusId = history.state.actionStatus.id;
      console.log(this.actionStatusId);
      this.stageId = history.state.stageId;
      this.projectId = history.state.projectId;
      this.blockId = history.state.blockId;
      this.planId = history.state.planId;
      this.selectedUserManageIds = history.state.selectedUserManageIds;
      this.typeCommonReferenceDetailsId =
        history.state.typeCommonReferenceDetailsId;
      this.fromComponent = history.state.fromComponent;
      this.transactionTypeId = history.state.paymentTransactionTypeId;
      console.log(this.blockId);
      if (history.state.typeId > 0) {
        this.typeId = history.state.typeId;
      }
      if (
        this.selectedUserManageIds?.length > 0 &&
        this.projectId?.length > 0
      ) {
        this.patchStateProjectIds(
          this.selectedUserManageIds,
          this.projectId,
          this.typeCommonReferenceDetailsId
        );
      } else {
        this.fromComponent = false;
        this.getUserManageTypes();
      }
      if (this.blockId?.length > 0) {
        this.patchStateBlockIds(this.blockId);
      }
      this.getTransactionType();
    }
  }
  private fetchPaymentModeById(paymentModeId: number) {
    this.commonRefDetailsService
      .getById(paymentModeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          // this.selectedPaymnetMode = data;
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
      this.userId = user.userId;
      this.roleName = user.roleName;
    }
  }

  getAllPaymentLedger(): void {
    this.showLoading();
    console.log(this.projectId, this.typeCommonReferenceDetailsId);
    this.paymentDetailsService
      .getAllPaymentLedger(
        this.pageIndex,
        this.pageSize,
        this.projectId,
        this.typeCommonReferenceDetailsId,
        this.actionStatusId,
        this.unitId,
        this.transactionTypeId,
        this.applicantName,
        this.roleName,
        this.blockId,
        this.typeId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paymentLedger) => {
          this.paymentLedger = paymentLedger.records;
          this.totalItems = paymentLedger.totalRecords;
          this.hideLoading();
        },
        error: (error: Error) => {
          this.hideLoading();
          console.error('Error fetching payment details:', error);
        },
      });
  }

  fetchUnits() {
    this.unitService
      .getAllUnitsBasedOnProjectId(this.projectId, this.unitName, this.blockId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.units = data;
          console.log(data);
        },
        error: (error: Error) => {
          console.error('Error fetching units:', error);
        },
      });
  }

  onUnitSelect(event: any) {
    this.unitName = event.option.value.unitName;
    this.unitId = event.option.value.id;
    this.pageIndex = PAGE_INDEX;
    this.getAllPaymentLedger();
    this.getAllDashBoardCount();
  }
  displayUnit(unit: Unit): string {
    return unit && unit.unitName ? unit.unitName : '';
  }
  searchUnit(event: any): void {
    const query = event.target.value;
    console.log(this.unitName);
    this.fetchUnits();
    if (query.length >= 3) {
      this.unitName = query;
      this.fetchUnits();
      this.getAllPaymentLedger();
      this.getAllDashBoardCount();
    } else if (query.length == 0) {
      this.unitName = '';
      this.unitId = [];
      this.fetchUnits();
      this.getAllPaymentLedger();
      this.getAllDashBoardCount();
    }
  }
  getAllUnits(unitName: string) {
    this.unitService
      .getUnitByName(this.unitName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response.records);
          this.units = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  getTransactionType() {
    this.commonRefDetailsService.getTransactionType(TRANSACTION_TYPE).subscribe(
      (data) => {
        console.log('Transaction Data:', data);
        this.transactionData = new Map(Object.entries(data));
        console.log(this.transactionData);
        const transactionDetails = this.transactionData.get(
          TRANSACTION_TYPE_PAYMENT
        );
        if (transactionDetails) {
          this.transactionTypeAsPayment = transactionDetails;
          this.paymentTransactionTypeId = this.transactionTypeAsPayment.id;
          console.log(this.transactionTypeAsPayment);
          console.log(this.paymentTransactionTypeId);
          this.getAllPaymentLedger();
          this.getAllDashBoardCount();
        } else {
          console.error(
            `No transaction details found for key: ${TRANSACTION_TYPE_PAYMENT}`
          );
        }
      },
      (error) => {
        console.error('Error fetching transaction type:', error);
      }
    );
  }
  getTransActionStatus() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(
        TRANSACTION_TYPE,
        this.transActionStatus
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.transActionTypes = data;
          console.log(this.transActionTypes);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  onTransActionTypeSelect(event: any) {
    console.log(event.value);
    if (event.value.commonRefValue === 'All') {
      let val = 0;
      this.transactionTypeId = val;
    } else {
      this.transactionTypeId = event.value.id;
    }
    this.getAllPaymentLedger();
    this.getAllDashBoardCount();
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
          const allOption = new CommonReferenceType();
          allOption.id = 0;
          allOption.commonRefValue = 'All';
          this.actionStatusNames = [allOption, ...data];
          console.log(this.actionStatusNames);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  onActionStatusSelect(event: any) {
    console.log(event);
    console.log(event.value);
    if (event.value == 'All') {
      let val = 0;
      this.actionStatusId = val;
    } else {
      this.actionStatusId = event.value;
    }
    this.getAllPaymentLedger();
    this.getAllDashBoardCount();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'approved';
      case 'Rejected':
        return 'rejected';
      case 'Waiting For Approval':
        return 'WaitingForApproval';
      case 'Not Paid':
        return 'Not';
      default:
        return '';
    }
  }
  generatePaymentReceipt(
    paymentLedgerId?: number,
    paymentReceiptUrl?: string,
    projectName?: string
  ): void {
    this.showLoading();
    console.log('File Path Received', paymentReceiptUrl, paymentLedgerId);
    // if (paymentReceiptUrl) {
    //   console.log('File path already exists:', paymentReceiptUrl);
    //   this.downloadPaymentReceipt(paymentReceiptUrl);
    //   return;
    // }
    console.log('Generating payment receipt for:', paymentLedgerId);
    this.paymentDetailsService
      .generateReceipt(paymentLedgerId!, projectName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (filePath: string) => {
          this.hideLoading();
          console.log('PDF URL received:', filePath);
          Swal.fire({
            title: 'Payment Receipt Generated',
            text: 'Your Payment Receipt has been generated successfully!',
            icon: 'success',
            // showCancelButton: true,
            confirmButtonText: 'OK',
            // cancelButtonText: 'Close',
          });
          this.getAllPaymentLedger();

          // .then((result) => {
          //   if (result.isConfirmed) {
          //     this.downloadPaymentReceipt(filePath);
          //   }
          // });
        },
        error: (error: Error) => {
          this.hideLoading();
          console.error('Error generating payment receipt:', error.message);
          Swal.fire({
            title: 'Error',
            text: 'Failed to generate the Payment Receipt. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
  }

  downloadPaymentReceipt(filePath: string): void {
    this.showLoading();
    const decodedUrl = decodeURIComponent(filePath);
    let fileName = 'Payment Receipt'; // Default file name
    if (decodedUrl) {
      fileName =
        decodedUrl.split('?')[0].split('/').pop()?.split('.pdf')[0] || fileName;
    }

    this.customerStageService
      .generateDemandLetterPdf(filePath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          this.hideLoading();
          console.log('PDF file received:', response);
          this.downloadFile(response, fileName);
          Swal.fire({
            title: 'Downloaded',
            text: 'Your Payment Receipt has been downloaded successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        error: (error: Error) => {
          this.hideLoading();
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
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllPaymentLedger();
    this.getAllDashBoardCount();
  }
  addCustomerPayment() {
    this.router.navigate(['/layout/crm/addingcrmpayment'], {
      state: { isAdding: true },
    });
  }
  fetchPaymentLedgerByPaymentLedgerId(paymentLedger: PaymentLedgerDto) {
    this.showLoading();
    console.log(event);
    // this.projectId = paymentLedger.projectId;
    // this.unitId = paymentLedger.unitId;
    console.log(this.projectId, this.unitId);
    this.paymentDetailsService
      .getPaymentLedgerById(paymentLedger.paymentLedgerId)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.selectedLedgerData = data;
          this.edit();
          this.hideLoading();
        },
        error: (error: any) => {
          this.hideLoading();
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  edit() {
    const route = NAVIGATE_TO_ADD_CUSTOMER_PAYMENT_BY_CRM;
    this.router.navigate([route], {
      state: {
        customerInfo: this.selectedLedgerData,
        projectId: this.projectId,
        unitId: this.unitId,
        isAdding: this.isAdding,
      },
    });
  }
  getApprovedAMount() {
    this.dashboardservice
      .getApprovedAndWaitingForApprovalAmount(
        this.projectId,
        this.typeCommonReferenceDetailsId,
        this.applicantName,
        this.actionStatusId,
        this.unitId,
        this.transactionTypeId,
        STAGE_STATUS,
        this.typeId,
        this.blockId
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.formattedApprovedAmount = data.formattedApprovedAmount;
          this.formattedWaitingForApprovalAmount =
            data.formattedWaitingForApprovalAmount;
          this.approvedTdsAmount = data.approvedTdsAmount;
          this.waitingForApprovalTdsAmount = data.waitingForApprovalTdsAmount;
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  onSearch(customerName: string) {
    if (
      customerName.length >= searchTextLength ||
      customerName.length === searchTextZero
    ) {
      this.applicantName = customerName;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllPaymentLedger();
      this.getAllDashBoardCount();
    }
  }
  getAllDashBoardCount() {
    this.getApprovedAMount();
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
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
  }

  viewFiles(response: Blob, fileName: string) {
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    let mimeType = 'application/octet-stream'; // default fallback

    switch (fileExtension) {
      case 'pdf':
        mimeType = 'application/pdf';
        break;
      case 'jpg':
      case 'jpeg':
        mimeType = 'image/jpeg';
        break;
      case 'png':
        mimeType = 'image/png';
        break;
      case 'gif':
        mimeType = 'image/gif';
        break;
    }

    const blob = new Blob([response], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    window.open(url);
  }

  getShortDescription(description: string): string {
    if (!description) return '';
    return description.length > 10
      ? description.slice(0, 10) + '...'
      : description;
  }

  goBack() {
    const stateData = {
      stageId: this.stageId,
      blockId: this.blockId,
      planId: this.planId,
      projectId: this.selectedprojectIds,
      selectedUserManageIds: this.selectedUserManageIds,
      typeCommonReferenceDetailsId: this.typeCommonReferenceDetailsId,
      fromComponent: true,
      typeId: this.typeId,
      paymentTransactionTypeId: this.transactionTypeId,
    };
    console.log(stateData);
    this.router.navigate(['layout/crm/crmuser/dashboard'], {
      state: stateData,
    });
  }
  onUnitTypeBelongsChange(event: any) {
    console.log(event);
    if (event.value === 'All') {
      let val = 0;
      this.typeId = val;
    } else {
      this.typeId = event.value;
    }
    this.pageIndex = PAGE_INDEX;
    this.getAllPaymentLedger();
    this.getAllDashBoardCount();
  }

  getCompanyTypes() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(COMPANY_TYPE)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.companyType = data;
          const allOption = new CommonReferenceType();
          allOption.id = 0;
          allOption.commonRefValue = 'All';
          this.companyType = [allOption, ...data];
          console.log(this.companyType);
          console.log(this.companyType);
        },
        error: (error: any) => {
          console.error('Error fetching Company Types :', error);
        },
      });
  }

  downloadDocuments(fileType: string, filePath: string): void {
    this.showLoading();
    const decodedUrl = decodeURIComponent(filePath);
    let fileName =
      decodedUrl.split('?')[0].split('/').pop() || `${fileType}-document.pdf`;

    this.projectService
      .downloadFile(fileType, filePath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          console.log(`${fileType} file received:`, response);
          this.downloadFile(response, fileName);
          this.hideLoading();
          Swal.fire({
            title: 'Downloaded',
            text: `Your ${fileType} file has been downloaded successfully!`,
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        error: (error: Error) => {
          this.hideLoading();
          console.error(`Error downloading ${fileType} file:`, error);
          Swal.fire({
            title: 'Error',
            text: `Failed to download the ${fileType} file. Please try again later.`,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
  }

  viewDocuments(fileType: string, filePath: string): void {
    this.showLoading();
    const decodedUrl = decodeURIComponent(filePath);
    let fileName =
      decodedUrl.split('?')[0].split('/').pop() || `${fileType}-document.pdf`;

    this.projectService
      .downloadFile(fileType, filePath)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: Blob) => {
          console.log(`${fileType} file received:`, response);
          this.viewFiles(response, fileName);
          this.hideLoading();
        },
        error: (error: Error) => {
          this.hideLoading();
          console.error(`Error downloading ${fileType} file:`, error);
        },
      });
  }
  searchProject(event: any): void {
    if (event.target.value.length >= 3) {
      this.projectName = event.target.value;
    } else if (event.target.value.length === 0) {
      this.projectName = '';
      this.projectId = [];
    }
  }
  onAllSelectProject() {
    console.log(this.allProjectSelected.checked);
    // this.allProjectChecked=this.allProjectSelected.checked
    if (this.allProjectSelected.checked) {
      this.selectedprojectIds = this.userManageprojects.map(
        (p: any) => p.projectId,
        0
      );
      this.selectedUserManageIds = this.userManageprojects.map(
        (p: any) => p.id,
        0
      );
      this.displayProjectNames();
    } else {
      this.selectedprojectIds = [];
      this.selectedBlockIds = [];
      this.selectedUserManageIds = [];
      this.blockId = this.selectedBlockIds;
    }
  }
  displayProjectNames() {
    console.log(this.selectedprojectIds);
    this.usermanageService
      .fetchProjectsBasedOnUserId(
        this.userId,
        this.typeCommonReferenceDetailsId,
        '',
        '',
        this.selectedprojectIds
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects: any) => {
          console.log(projects);
          console.log(this.selectedprojectIds);
          console.log(this.userManageprojects);
          this.userManageprojects = this.sortProject(
            this.userManageprojects,
            this.selectedprojectIds
          );
          const selectedNames = projects
            .map((project: any) => project.projectName)
            .join(', ');
          console.log(selectedNames);
          this.project.patchValue(selectedNames);
        },
      });
  }
  sortProject(projects: any[], selectedprojectIds: any): any[] {
    return projects.sort((a, b) => {
      const aSelected = selectedprojectIds.includes(a.projectId);
      const bSelected = selectedprojectIds.includes(b.projectId);
      // Place selected items first, then unselected items
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }
  isProjectAllSelected(): boolean {
    const allProjectIds = this.userManageprojects.map((p) => p.projectId);
    return (
      Array.isArray(this.selectedprojectIds) &&
      allProjectIds.length > 0 &&
      allProjectIds.every((id) => this.selectedprojectIds.includes(id))
    );
  }
  isSelectedProject(projectId?: number, id?: number): boolean {
    return this.selectedprojectIds?.includes(projectId ? projectId : 0);
  }
  onProjectSelect(umproject: any, event: any) {
    this.project.patchValue('');
    const selectedProject = umproject.projectId;
    const selectedUserManageId = umproject.id;
    if (event.checked) {
      if (!this.selectedprojectIds) this.selectedprojectIds = [];
      if (!this.selectedUserManageIds) this.selectedUserManageIds = [];
      if (!this.selectedprojectIds.includes(selectedProject)) {
        this.selectedprojectIds.push(selectedProject);
      }
      if (!this.selectedUserManageIds.includes(selectedUserManageId)) {
        this.selectedUserManageIds.push(selectedUserManageId);
      }
      this.displayProjectNames();
    } else {
      this.selectedprojectIds = this.selectedprojectIds?.filter(
        (projectId: any) => projectId !== selectedProject
      );
      this.selectedUserManageIds = this.selectedUserManageIds?.filter(
        (id: any) => id !== selectedUserManageId
      );
      // --- Deselect related blocks ---
      let relatedBlockIds: number[] = [];
      if (this.selectedBlockIds?.length > 0) {
        relatedBlockIds = this.selectedBlocks
          .filter((b) => b.projectId === selectedProject)
          .map((b) => b.id);

        this.selectedBlockIds = this.selectedBlockIds.filter(
          (id: any) => !relatedBlockIds.includes(id)
        );
        this.selectedBlocks = this.selectedBlocks.filter((block) =>
          this.selectedBlockIds.includes(block.id)
        );
        this.blockId = [...this.selectedBlockIds];
        const selectedNames = this.selectedBlocks
          .map((block: any) => block.name + ' ( ' + block.projectCode + ' )')
          .join(', ');
        this.block.patchValue(selectedNames);
      }
      // If no blocks left, set blockId to empty array
      if (!this.selectedBlockIds || this.selectedBlockIds.length === 0) {
        this.blockId = [];
      }
      // --- Deselect related payment plans and stages for the deselected project ---
      if (this.planId?.length > 0) {
        this.paymentPlanService
          .getAllPaymentPlansByProjectId([selectedProject], [])
          .subscribe((removedProjectPlans: any[]) => {
            const removedPlanIds = removedProjectPlans.map((plan) => plan.id);
            // Remove those planIds from planId array
            if (Array.isArray(this.planId)) {
              this.planId = this.planId.filter(
                (id: any) => !removedPlanIds.includes(id)
              );
            } else if (this.planId && removedPlanIds.includes(this.planId)) {
              this.planId = [];
            }
            // Remove related stages for the removed planIds
            if (removedPlanIds.length > 0 && this.stageId?.length > 0) {
              this.stageService
                .getStages(
                  '',
                  [selectedProject],
                  removedPlanIds,
                  '',
                  this.stageId
                )
                .subscribe((removedStages: any[]) => {
                  const removedStageIds = removedStages.map(
                    (stage) => stage.stageId
                  );
                  if (Array.isArray(this.stageId)) {
                    this.stageId = this.stageId.filter(
                      (id: any) => !removedStageIds.includes(id)
                    );
                  } else if (
                    this.stageId &&
                    removedStageIds.includes(this.stageId)
                  ) {
                    this.stageId = [];
                  }
                });
            }
          });
      }
      if (this.selectedprojectIds?.length > 0) {
        this.displayProjectNames();
      } else if (this.selectedprojectIds?.length == 0) {
        this.project.patchValue('');
      }
    }
    this.projectId = this.selectedprojectIds;
  }
  onProjectSelectButtonClick() {
    this.projectId = this.selectedprojectIds;
    if (this.projectId.length > 0) {
      this.fetchBlocks();
      this.getAllPaymentLedger();
      this.getAllDashBoardCount();
    } else {
      this.block.setValue(null);
      this.blocks = [];
      this.unit.setValue(null);
      this.unitId = [];
      this.fromComponent = false;
      this.getAllPaymentLedger();
      this.getAllDashBoardCount();
    }
  }
  searchBlock(event: any): void {
    if (event.target.value.length >= 3) {
      this.blockName = event.target.value;
      this.fetchBlocks();
    } else if (event.target.value.length === 0) {
      this.blockName = '';
      this.blockId = 0;
    }
  }
  fetchBlocks() {
    this.blockService
      .fetchBlocksByBlockIds(this.selectedprojectIds, '', this.blockName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blocks) => {
          this.blocks = blocks;
          console.log(this.blocks);
          if (this.selectedBlockIds?.length > 0) {
            this.selectedBlocks = this.blocks.filter((block) =>
              this.selectedBlockIds.includes(block.id)
            );
            this.blocks = this.sortBlock(this.blocks, this.selectedBlockIds);
            const selectedNames = this.selectedBlocks
              .map(
                (block: any) => block.name + ' ( ' + block.projectCode + ' )'
              )
              .join(', ');
            console.log(selectedNames);
            console.log(this.blocks);
            this.block.patchValue(selectedNames);
          } else {
            this.block.setValue(null);
          }
        },
        error: (error: Error) => {
          console.error('Error fetching blocks:', error);
        },
      });
  }
  sortBlock(block: any[], selectedBlockIds: any): any[] {
    return block.sort((a, b) => {
      const aSelected = selectedBlockIds.includes(a.id);
      const bSelected = selectedBlockIds.includes(b.id);
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }
  onAllSelectBlock() {
    if (this.allBlockSelected?.checked) {
      this.selectedBlockIds = (this.blocks || []).map((p: any) => p.id);
      this.displayBlockNames();
    } else {
      this.selectedBlockIds = [];
    }
  }
  isBlockAllSelected(): boolean {
    const allBlockIds = this.blocks.map((b) => b.id);
    return (
      Array.isArray(this.selectedBlockIds) &&
      allBlockIds.length > 0 &&
      allBlockIds.every((id: any) => this.selectedBlockIds.includes(id))
    );
  }
  isSelectedBlock(blockId?: number): boolean {
    return blockId != null && this.selectedBlockIds?.includes(blockId);
  }
  displayBlockNames() {
    this.blockService
      .fetchBlocksByBlockIds(this.selectedprojectIds, this.selectedBlockIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blocks: any) => {
          console.log(blocks);
          this.blocks = this.sortBlock(this.blocks, this.selectedBlockIds);
          const selectedNames = blocks
            .map((block: any) => block.name + ' ( ' + block.projectCode + ' )')
            .join(', ');
          console.log(selectedNames);
          this.block.patchValue(selectedNames);
        },
      });
  }
  onBlockSelect(block: any, event: any) {
    this.block.patchValue('');
    const selectedBlock = block.id;
    if (event.checked) {
      if (!this.selectedBlockIds) this.selectedBlockIds = [];
      if (!this.selectedBlocks) this.selectedBlocks = [];
      if (!this.selectedBlockIds.includes(selectedBlock)) {
        this.selectedBlockIds.push(selectedBlock);
        this.selectedBlocks.push(block);
      }
      this.displayBlockNames();
    } else {
      this.selectedBlockIds = this.selectedBlockIds?.filter(
        (id: any) => id !== selectedBlock
      );
      this.selectedBlocks = this.selectedBlocks?.filter(
        (b: any) => b.id !== selectedBlock
      );
      if (this.selectedBlockIds?.length > 0) {
        this.displayBlockNames();
      } else {
        this.block.patchValue('');
      }
      // Always remove related payment plans and stages for the deselected block
      if (this.planId?.length > 0) {
        this.paymentPlanService
          .getAllPaymentPlansByProjectId(this.selectedprojectIds, [
            selectedBlock,
          ])
          .subscribe((removedBlockPlans: any[]) => {
            const removedPlanIds = removedBlockPlans.map((plan) => plan.id);
            // Remove those planIds from planId array
            if (Array.isArray(this.planId)) {
              this.planId = this.planId.filter(
                (id: any) => !removedPlanIds.includes(id)
              );
            } else if (this.planId && removedPlanIds.includes(this.planId)) {
              this.planId = [];
            }
            // Remove related stages for the removed planIds
            if (removedPlanIds.length > 0 && this.stageId?.length > 0) {
              this.stageService
                .getStages(
                  '',
                  this.selectedprojectIds,
                  removedPlanIds,
                  [selectedBlock],
                  this.stageId
                )
                .subscribe((removedStages: any[]) => {
                  const removedStageIds = removedStages.map(
                    (stage) => stage.stageId
                  );
                  if (Array.isArray(this.stageId)) {
                    this.stageId = this.stageId.filter(
                      (id: any) => !removedStageIds.includes(id)
                    );
                  } else if (
                    this.stageId &&
                    removedStageIds.includes(this.stageId)
                  ) {
                    this.stageId = [];
                  }
                });
            }
          });
      }
    }
  }
  onBlockSelectButtonClick() {
    this.blockId = this.selectedBlockIds;
    this.fetchUnits();
    this.getAllPaymentLedger();
    this.getAllDashBoardCount();
  }
  getUserManageTypes() {
    this.commanService
      .getRefDetailsId(USER_MANAGE_TYPE, USER_MANAGE_CRM)
      .subscribe({
        next: (data) => {
          this.typeCommonReferenceDetailsId = data;
          this.fetchProjects();
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  fetchProjects() {
    this.usermanageService
      .fetchProjectsBasedOnUserId(
        this.userId,
        this.typeCommonReferenceDetailsId,
        '',
        ''
      )
      .subscribe({
        next: (userManegeProjects) => {
          console.log(userManegeProjects);
          this.userManageprojects = userManegeProjects;
          if (!this.fromComponent) {
            this.projectId = this.userManageprojects.map(
              (p: { projectId: any }) => p.projectId,
              0
            );
            this.getTransactionType();
          }
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  patchStateProjectIds(
    selectedUserManageIds: number[],
    selectedProjectIds?: number[],
    typeCommonReferenceDetailsId: number = 0
  ): void {
    this.project.patchValue('');
    console.log(selectedUserManageIds);
    console.log(selectedProjectIds);
    console.log(typeCommonReferenceDetailsId);
    this.typeCommonReferenceDetailsId = typeCommonReferenceDetailsId ?? 0;

    this.usermanageService
      .fetchProjectsBasedOnUserId(
        this.userId,
        this.typeCommonReferenceDetailsId,
        '',
        selectedUserManageIds,
        selectedProjectIds
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          console.log(projects);
          console.log(this.userManageprojects);
          this.userManageprojects = this.sortProject(
            projects,
            this.selectedprojectIds
          );
          const selectedNames = projects
            .map((project: IUserManageDto) => project.projectName)
            .join(', ');
          console.log(selectedNames);
          this.project.patchValue(selectedNames);
          this.selectedprojectIds = selectedProjectIds
            ? selectedProjectIds
            : [];
          this.projectId = this.selectedprojectIds;
          console.log(this.selectedprojectIds);
          this.fetchBlocks();
        },
      });
  }
  patchStateBlockIds(selectedBlockIds?: number[]): void {
    // this.block.patchValue('');
    this.selectedBlockIds = selectedBlockIds;
    console.log(this.selectedBlockIds);
    this.blockService
      .fetchBlocksByBlockIds(this.selectedprojectIds, this.selectedBlockIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blocks) => {
          console.log(blocks);
          this.blocks = this.sortProject(blocks, this.selectedBlockIds);
          const selectedNames = blocks
            .map((block: any) => block.name + ' ( ' + block.projectCode + ' )')
            .join(', ');
          console.log(selectedNames);
          this.block.patchValue(selectedNames);
          this.selectedBlockIds = selectedBlockIds;
          this.blockId = this.selectedBlockIds;
          console.log(this.selectedBlockIds);
          this.fetchUnits();
        },
      });
  }
}
