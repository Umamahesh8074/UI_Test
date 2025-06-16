import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, Subject, takeUntil } from 'rxjs';
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
import { StagesDto } from 'src/app/Models/WorkOrder/WorkOrderBilling';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { CustomerPaymentService } from 'src/app/Services/CrmServices/customer-payment.service';
import { ApprovalsService } from 'src/app/Services/ProcurementService/Approvals/approvals.service';
import { StageService } from 'src/app/Services/ProjectService/Stage/stage.service';
import {
  ACTION_STATUS,
  CRM_UI_NAVIGATIONS,
  PAYMENT_STATUS,
  TRANSACTION_TYPE,
} from 'src/app/Constants/Crm/CrmConstants';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { IUnit, Unit } from 'src/app/Models/Project/unit';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { IProject, Project } from 'src/app/Models/Project/project';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import Swal from 'sweetalert2';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { Block, IBlock } from 'src/app/Models/Block/block';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';

@Component({
  selector: 'app-customer-approval-payment',
  templateUrl: './customer-approval-payment.component.html',
  styleUrls: ['./customer-approval-payment.component.css'],
})
export class CustomerApprovalPaymentComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  organizationId: number = 0;
  userId: number = 0;
  isModelView: boolean = false;
  remarks: string = '';
  paymentDetails: any;
  stages: any;
  selectedStatus: any;
  isRemarksPresent: boolean = false;
  actionBy: string = '';
  customerName: string = '';
  unitName = '';
  unitId: number = 0;
  units: Unit[] = [];
  projectId: number = 0;
  projectName: string = '';
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);
  unit: any = new FormControl([] as Unit[]);
  selectedUnit: IUnit = new Unit();
  formData!: FormGroup;
  dateRange: any = '';
  customStartDate: any = '';
  customEndDate: any = '';
  transActionTypes: CommonReferenceType[] = [];
  transActionStatus: string = '';
  transActionTypeId: number = 0;

  displayedColumns: string[] = [
    'rowNumber',
    'customerName',
    'projectName',
    'blockName',
    'levelName',
    'unitName',
    'transactionType',
    'createdDate',
    // 'stageName',
    'paymentDate',
    'referenceNumber',
    'bankName',
    'branchName',
    'ifscCode',

    'paidAmount',
    // 'paidAmountForApproval',

    'stageStatus',
    'actionDate',
    'actionDoneBy',
    'companyType',
    'actions',
  ];

  status = [
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
  statuses: string[] = ['Pending', 'Completed'];

  stageId: number = 0;
  stageName: string = '';
  workFlowTypeId: number = 0;
  customerPaymentId: number = 0;
  paymentStatus: string = '';
  selectedBlock: IBlock = new Block();
  selectedPaymentStatus: string = 'All';
  paymentStatusName: string = '';
  paymentStatusNames: CommonReferenceType[] = [];
  actionStatusNames: CommonReferenceType[] = [];
  paymentStatusId: number = 0;
  actionStatusId: number = 0;
  userManageData: any;
  blockId: any;
  blockName: string = '';
  blocks: any;
  block: any = new FormControl([] as IBlock[]);
  isSubmitted: boolean = false;
  typeId: number = 0;
  companyType: any;
   isAccountTeam:boolean=false;
   roleId:number=0;
   navigation: Map<string, CommonReferenceDetails> = new Map();
    commonRefDetailsForRoute: CommonReferenceDetails =
 new CommonReferenceDetails();
  route:string='';

  constructor(
    public customerPaymentService: CustomerPaymentService,
    public dialog: MatDialog,
    private commonService: CommanService,
    private stageService: StageService,
    private approvalsService: ApprovalsService,
    private router: Router,
    private formBuilder: FormBuilder,
    private unitService: UnitService,
    private projectService: ProjectService,
    private loaderService: LoaderService,
    private usermanageService: UsermanageService,
    private blockService: BlockService,
     private commonReferenceDetailsService: CommonreferencedetailsService,
  ) {}
  ngOnInit(): void {
    this.setUserFromLocalStorage();
     this.initForm();
    this.getTransActionStatus();
    this.getPaymentStatus();
    this.getActionStatus();
    this.fetchBlocks();
    this.getCompanyTypes();
    this.getDetailsFromState();
     
    this.getAllStages();
   

    // this.fetchProjects();
  }
  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
      this.userId = user.userId;
      this.roleId=user.roleId
      this.getUsermanageByUserId();
      this.getNavigationRoute();
    }
  }
  getDetailsFromState() {
    console.log(history.state);
    if (history.state.actionStatus.id > 0) {
      this.actionStatusId = history.state.actionStatus.id;
    }

    this.projectId = history.state.projectId;
    this.blockId = history.state.blockId;
    if (history.state.status.length > 0) {
      this.paymentStatus = history.state.status;
    }
    this.unitId = history.state.unitId;
     this.isAccountTeam=history.state.isAccountTeam
     console.log(this.isAccountTeam);
     
    if (this.blockId != null) {
      this.fetchBlockById(this.blockId);
    }
    if (this.unitId != null) {
      this.fetchUnitById(this.unitId);
    }
  }
  private fetchBlockById(blockId: number) {
    this.blockService
      .getBlockById(blockId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedBlock = data;
          this.block.setValue(this.selectedBlock);
          this.blockId = this.selectedBlock.id;
          this.fetchUnits(this.projectId, this.blockId);
          this.getCustomerPaymentsByLoggedInUserId();
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  private fetchUnitById(unitId: number) {
    this.unitService
      .getUnitByUnitId(unitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedUnit = data;
          this.unit.setValue(this.selectedUnit);
          this.unitId = this.selectedUnit.id;
          this.getCustomerPaymentsByLoggedInUserId();
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  getCustomerPaymentsByLoggedInUserId() {
    this.showLoading();
    console.log(this.blockId);
    console.log(this.unitId);
    this.customerPaymentService
      .getCustomerPaymentsForApprove(
        this.pageIndex,
        this.pageSize,
        this.userId,
        this.customStartDate,
        this.customEndDate,
        this.customerName,
        '',
        this.actionBy,
        this.stageId,
        this.stageName,
        this.paymentStatusId,
        this.actionStatusId,
        this.projectId,
        this.unitName,
        this.transActionTypeId,
        this.blockId,
        this.unitId,
        this.typeId
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          this.hideLoading();
          this.paymentDetails = response.records;
          console.log(this.paymentDetails);
          this.totalItems = response.totalRecords;
        },
        error: (error: Error) => {
          this.hideLoading();
          console.log(error);
        },
      });
  }

  goToApprovals(customerPayment: any) {
    this.workFlowTypeId = customerPayment.workFlowTypeId;
    this.customerPaymentId = customerPayment.customerPaymentId;
    console.log(this.workFlowTypeId, this.customerPaymentId);
    this.isRemarksPresent = false;
    this.isModelView = true;
    // this.unitName = customerPayment.unitName;
    // this.paymentId=customerPayment.paymentId;
    console.log(this.unitName);
  }

  ViewRemarks(value: any) {
    this.remarks = value.remarks;
    this.isRemarksPresent = true;
    this.isModelView = true;
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
  onStageSelect(event: any) {
    if (event?.option?.value) {
      this.stageId = event.option.value.stageId;
      this.getCustomerPaymentsByLoggedInUserId();
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
      this.getCustomerPaymentsByLoggedInUserId();
    }
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getCustomerPaymentsByLoggedInUserId();
  }
  dleModel() {
    this.isModelView = true;
  }
  // handleApprovalStatus(status: string) {
  //   console.log(status, this.remarks);
  //   this.isModelView = false;
  //   if (status == 'Approval') {

  //     this.uploadPaymentReceipts().subscribe((result) => {
  //       console.log(result); // 'uploaded', 'error', or 'No file selected'
  //     });
  //   }
  //   if (this.remarks) {
  //     // this.updateApprovalStatus(status);
  //     if (status == 'Approval') {
  //       // this.uploadPaymentReceipts();
  //     }
  //   }
  // }

  handleApprovalStatus(status: string) {
    console.log('Status:', status, 'Remarks:', this.remarks);
    this.isSubmitted = true;
    if (!this.remarks) {
      return; // Stop here if any field is missing
    }
    this.updateApprovalStatus(status);
    this.isModelView = false;
    this.remarks = '';
    console.log('Remarks exist:', this.remarks);
  }

  onClose() {
    this.isModelView = false;
    this.remarks = '';
    // this.getCustomerPaymentsByLoggedInUserId();
  }

  resizeTextarea(event: any) {
    const textarea = event.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  updateApprovalStatus(status: string) {
    this.showLoading();
    console.log(
      this.customerPaymentId,
      this.workFlowTypeId,
      this.userId,
      status,
      this.remarks
    );
    this.approvalsService
      .updateApprovalStatus(
        this.customerPaymentId,
        this.workFlowTypeId,
        this.userId,
        status,
        this.remarks
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('updated successfully');
          this.getCustomerPaymentsByLoggedInUserId();
          this.hideLoading();
        },
        error: (err) => {
          this.hideLoading();
          console.error('Error updating Approvals', err);
        },
      });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Approved':
        return 'approved';
      case 'Rejected':
        return 'rejected';
      case 'Waiting For Approval':
        return 'pending';
      default:
        return '';
    }
  }
  getPaymentStatusClass(status: string): string {
    switch (status) {
      case 'Pending':
        return 'Pending';
      case 'Payment Completed':
        return 'Completed';
      case 'Partially Paid':
        return 'Not';
      default:
        return '';
    }
  }

  onStatusChange(event: any): void {
    console.log(event);
    console.log(event.value.id);
    if (event.value.commonRefValue === 'All') {
      let val = 0;
      this.actionStatusId = val;
    } else {
      this.actionStatusId = event.value.id;
    }
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    this.getCustomerPaymentsByLoggedInUserId();
  }
  onSearchActionBy(actionBy: string) {
    if (
      actionBy.length >= searchTextLength ||
      actionBy.length === searchTextZero
    ) {
      this.actionBy = actionBy;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getCustomerPaymentsByLoggedInUserId();
    }
  }
  onSearchByCustomerName(value: any) {
    if (value.length >= searchTextLength || value.length === searchTextZero) {
      this.customerName = value;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getCustomerPaymentsByLoggedInUserId();
    }
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
          console.log(startDate);
          console.log(endDate);
          this.customStartDate = startDate;
          this.customEndDate = endDate;
          this.getCustomerPaymentsByLoggedInUserId();
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
    console.log(this.formData.value);
    
    this.pageIndex = 0;
    this.paginator.firstPage();
    const startDate = this.formData.get('customStartDate')?.value;
    const endDate = this.formData.get('customEndDate')?.value;
    if (startDate !== null && endDate !== null) {
     console.log(this.formData.get('customStartDate')?.value);
     console.log(this.formData.get('customEndDate')?.value);
      this.dateRange = '';
      this.getCustomerPaymentsByLoggedInUserId();
    } else {
      this.dateRange = 0;
    }
  }

  clearDateRange(): void {
    this.formData.get('customStartDate')?.setValue('');
    this.formData.get('customEndDate')?.setValue('');
    this.customStartDate = '';
    this.customEndDate = '';
    this.getCustomerPaymentsByLoggedInUserId();
    console.log(this.formData.get('customStartDate')?.value);
    console.log(this.formData.get('customEndDate')?.value);
  }
  onStatusSelect(event: any) {
    console.log(event?.value);
    if (event?.value === 'All') {
      let val = '';
      this.paymentStatus = val;
      console.log(this.paymentStatus);
      this.getCustomerPaymentsByLoggedInUserId();
    } else {
      if (event?.value) {
        this.paymentStatus = event.value;
        console.log(this.paymentStatus);
        this.getCustomerPaymentsByLoggedInUserId();
      }
    }
  }
  getPaymentStatus() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(
        PAYMENT_STATUS,
        this.paymentStatusName
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.paymentStatusNames = data;
          console.log(this.paymentStatusNames);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
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
          const allOption = new CommonReferenceType();
          allOption.id = 0;
          allOption.commonRefValue = 'All';
          this.actionStatusNames = [allOption, ...data];
          console.log(this.actionStatusNames);
          // this.actionStatusNames = data;
          this.selectedStatus = allOption;
          console.log(this.actionStatusNames);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  onPaymentStatusSelect(event: any) {
    console.log(event.value);
    if (event.value.commonRefValue === 'All') {
      let val = 0;
      this.paymentStatusId = val;
    } else {
      this.paymentStatusId = event.value.id;
    }
    this.getCustomerPaymentsByLoggedInUserId();
  }
  onActionStatusSelect(event: any) {
    console.log(event.value);
    if (event.value.commonRefValue === 'All') {
      let val = 0;
      this.actionStatusId = val;
      this.getCustomerPaymentsByLoggedInUserId();
    } else {
      this.actionStatusId = event.value;
      this.getCustomerPaymentsByLoggedInUserId();
    }
  }

  selectedFile: File | null = null; // Store the single selected file
  fileSizeDisplay: string = 'No file chosen'; // Display file information
  fileTypeError: boolean = false; // Error flag for invalid file type

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement; // Get the input element
    this.selectedFile = null; // Reset the selected file
    this.fileTypeError = false; // Reset the error flag

    if (input && input.files && input.files.length > 0) {
      const file = input.files[0]; // Get the first selected file

      // if (validExtensions.includes(fileExtension!)) {
      this.selectedFile = file;
      //   this.fileSizeDisplay = `Selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`; // Display file size in KB
      // } else {
      //   this.fileTypeError = true;
      //   this.fileSizeDisplay = 'Invalid file type. Please select a valid file.';
      // }
    } else {
      this.fileSizeDisplay = 'No file chosen';
    }

    console.log('Selected File:', this.selectedFile);
  }

  uploadPaymentReceipts(): Observable<any> {
    console.log('Selected file:', this.selectedFile);
    console.log('this.paymentId:', this.customerPaymentId);
    const fileName = this.unitName + ' ' + this.customerPaymentId;
    if (!this.selectedFile) {
      return of('No file selected'); // Return an observable with a default message
    }

    return this.approvalsService
      .uploadPaymentReceipts(
        this.customerPaymentId,
        this.selectedFile,
        fileName
      )
      .pipe(
        takeUntil(this.destroy$),
        map(() => 'uploaded'), // Map the response to a success message
        catchError((err: any) => {
          console.error('Error uploading Approvals', err);
          return of('error'); // Return an observable with the error message
        })
      );
  }

  fetchUnits(projectId: number, blockId?: number) {
    this.unitService
      .getAllUnitsBasedOnProjectId(projectId, this.unitName, this.blockId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (units) => {
          console.log(units);
          this.units = units;
        },
        error: (error: Error) => {
          console.error('Error fetching units:', error);
        },
      });
  }

  onUnitSelect(event: any) {
    this.unitName = event.option.value.unitName;
    this.unitId = event.option.value.id;
    // this.getAllApplicantInfos()
    this.getCustomerPaymentsByLoggedInUserId();
  }
  displayUnit(unit: Unit): string {
    return unit && unit.unitName ? unit.unitName : '';
  }
  searchUnit(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.unitName = query;
      this.fetchUnits(this.projectId);
      this.getCustomerPaymentsByLoggedInUserId();
    } else if (query.length == 0) {
      this.unitName = '';
      this.unitId = 0;
      this.unit.setValue(null);
      this.fetchUnits(this.projectId);
      this.getCustomerPaymentsByLoggedInUserId();
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
          // this.fetchUnits(this.projectId);
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  onProjectSelect(event: any) {
    this.projectName = event.option.value.projectName;
    this.projectId = event.option.value.projectId;
    this.unit.setValue(null);
    this.fetchUnits(this.projectId);
    this.getCustomerPaymentsByLoggedInUserId();
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }

  searchProject(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.projectName = query;
      this.fetchProjects();
      this.getCustomerPaymentsByLoggedInUserId();
    } else if (query.length == 0) {
      this.projectName = '';
      this.fetchProjects();
      this.projectId = 0;
      this.getCustomerPaymentsByLoggedInUserId();
    }
  }

  showAdvancedSearch: boolean = false;

  toggleAdvancedSearch(checked: boolean) {
    console.log(checked);
    if (!checked) {
      this.customerName = '';
      this.actionBy = '';
      this.paymentStatusId = 0;
      this.stageId = 0;
      this.getCustomerPaymentsByLoggedInUserId();
    }
    this.showAdvancedSearch = checked;
  }
  private downloadFile(blob: Blob, fileName: string): void {
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  }

  downloadDocument(fileType: string, filePath: string): void {
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
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
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
          // this.transActionTypes = data;
          const allOption = new CommonReferenceType();
          allOption.id = 0;
          allOption.commonRefValue = 'All';
          this.transActionTypes = [allOption, ...data];
          console.log(this.transActionTypes);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  onTransActionTypeSelect(event: any) {
    console.log(event.value);
    if (event.value === 'All') {
      let val = 0;
      this.transActionTypeId = val;
    } else {
      this.transActionTypeId = event.value;
    }
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    this.getCustomerPaymentsByLoggedInUserId();
  }
  viewDocument(fileType: string, filePath: string): void {
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
          this.viewFile(response, fileName);
          this.hideLoading();
        },
        error: (error: Error) => {
          this.hideLoading();
          console.error(`Error downloading ${fileType} file:`, error);
        },
      });
  }
  // viewFile(response: Blob, fileName: string) {
  //   const blob = new Blob([response], { type: 'application/pdf' });
  //   const url = window.URL.createObjectURL(blob);
  //   window.open(url);
  // }

  viewFile(response: Blob, fileName: string) {
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
  private getUsermanageByUserId(): void {
    console.log(this.userId);
    this.usermanageService.getUserManage(this.userId).subscribe({
      next: (response) => {
        console.log('User manage data:', response);
        this.userManageData = response;
        this.projectId = response[0].projectId;
        console.log(this.projectId);
        this.fetchUnits(this.projectId);
        this.getCustomerPaymentsByLoggedInUserId();
      },

      error: (err) => {
        // Handle the error here
        console.error('Error fetching user manage data:', err);
      },
    });
  }
  searchBlock(event: any) {
    const query = event.target.value;
    this.blockName = query;
    if (query.length == 0) {
      this.blockId = 0;
      this.unit.setValue(null);
      this.unitId = 0;
      this.unitName = '';
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.fetchBlocks();
      this.fetchUnits(this.projectId, this.blockId);
      this.getCustomerPaymentsByLoggedInUserId();
    }
    this.fetchBlocks();
  }
  fetchBlocks() {
    this.blockService
      .getBlocks(this.projectId, this.blockName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blocks) => {
          this.blocks = blocks;
          console.log(blocks);
        },
        error: (error: Error) => {
          console.error('Error fetching blocks:', error);
        },
      });
  }
  onBlockSelect(event: any) {
    this.blockId = 0;
    if (event.option.value.id == this.blockId) {
      console.log('Same Block selected {}');
      return;
    }
    this.blockId = event.option.value.id;
    this.unit.setValue(null);
    this.unitId = 0;
    this.unitName = '';
    console.log(this.blockId);
    this.fetchUnits(this.projectId, this.blockId);
    this.getCustomerPaymentsByLoggedInUserId();
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
  }
  displayBlock(block: IBlock) {
    return block && block.name ? block.name : '';
  }
  goBack() {
    const stateData = {
      blockId: this.blockId,
      projectId: this.projectId,
      unitId: this.unitId,
    };
    console.log(stateData);
    this.router.navigate([this.route], {
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
    this.getCustomerPaymentsByLoggedInUserId();
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

  getNavigationRoute() {
      this.commonReferenceDetailsService
        .getTransactionType(CRM_UI_NAVIGATIONS)
        .subscribe({
         next: (data) => { console.log('Transaction Data:', data);
            this.navigation = new Map(Object.entries(data));
            console.log(this.navigation);
            const navigationRoute = this.navigation.get(this.roleId.toString());
             console.log(navigationRoute);
            if (navigationRoute) {
              this.commonRefDetailsForRoute = navigationRoute;
              this.route = this.commonRefDetailsForRoute.commonRefValue;
              console.log( this.route);
              
            } else {
              console.error(
                `No transaction details found for key: ${CRM_UI_NAVIGATIONS}`
              );
            }
          },
          error: (error: Error) => {
            console.error('Error fetching transaction type:', error);
          },
   } );
    }

}
