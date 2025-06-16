import { Component, HostListener, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
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
  NAVIGATE_TO_ADD_CUSTOMER_TDS_BY_CRM,
  NAVIGATE_TO_ADD_PAYMENT_DETAILS,
  PAYMENT_STATUS,
  STAGE_STATUS,
  TRANSACTION_TYPE,
  TRANSACTION_TYPE_PAYMENT,
  USER_MANAGE_CRM,
  USER_MANAGE_TYPE,
} from 'src/app/Constants/Crm/CrmConstants';
import { Block, BlockDto, IBlock } from 'src/app/Models/Block/block';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import {
  CustomerPaymentDto,
  IPaymentDetailsDto,
  PaymentDetailsDto,
} from 'src/app/Models/Crm/PaymentDetails';
import { CustomerStages } from 'src/app/Models/Project/customerStages';
import { IPaymentPlan, PaymentPlan } from 'src/app/Models/Project/PaymentPlan';
import { IStage, Stage, StageDto } from 'src/app/Models/Project/stage';
import { Unit } from 'src/app/Models/Project/unit';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { User } from 'src/app/Models/User/User';
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
  selector: 'app-display-payment-details',
  templateUrl: './display-payment-details.component.html',
  styleUrls: ['./display-payment-details.component.css'],
})
export class DisplayPaymentDetailsComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  landOwnerOrBuilder: string = '';
  companyType: any;
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
  selectedStatus: string = 'All';
  filePath: string = '';
  roleName: string = '';
  selectedProject: any = null;
  userManageData: any;
  typeCommonReferenceDetailsId: number = 0;
  typeId: number = 0;
  // paymentDetails: IPaymentDetailsDto =new IPaymentDetailsDto() ;
  displayedColumns: string[] = [
    'rowNumber',
    'customerName',
    'firstApplicantPhoneNumber',
    'stageName',
    'projectName',
    // 'block',
    'unit',
    // 'unitType',
    'paymentDate',
    'stageTotalAmount',
    'paidAmount',
    'pendingAmount',
    'paymenetStatus',
    'transactionType',
    'landOwnerOrBuilder',
    'actions',
  ];
  stageId: any = [];
  stageName: any;
  statuses: string[] = ['All', 'Not Done', 'Pending', 'Completed'];
  status: string = 'All';
  stageStatus = [
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
  actionStatus: string = '';
  selectedStageId: any;
  selectedStage: CustomerStages = new CustomerStages();
  paymentStatusNames: CommonReferenceType[] = [];
  actionStatusNames: CommonReferenceType[] = [];
  actionStatusId: number = 0;
  paymentStatusName: string = '';
  selectedPaymentStatus: number[] = [];
  isAllSelected: boolean = false;
  selectedPaymentStatuses: any[] = [];
  paymentStatusId: any;
  selectedPaymentStatusesValue: CommonReferenceType[] = [
    {
      id: -1,
      commonRefValue: 'All',
      commonRefKey: '',
    },
  ];
  selectedPaymnetStatus: CommonReferenceType = new CommonReferenceType();
  selectedPaymentStatusesId: any;
  paymentStatusNames1: CommonReferenceType[] = [];
  paymentStatusControl = new FormControl<CommonReferenceType[]>([]);
  selectedPayment: any[] = [];
  customerInfo: CustomerPaymentDto = new CustomerPaymentDto();
  isAdding: boolean = false;
  projectId: any = [];
  projectName: string = '';
  userManageprojects: IUserManageDto[] = [];
  // projects: IProject[] = [];
  project: any = new FormControl([] as IUserManageDto[]);
  unitName = '';
  unitId: number = 0;
  units: Unit[] = [];
  unit: any = new FormControl([] as Unit[]);
  formData!: FormGroup;
  dateRange: any = '';
  customStartDate: any = '';
  customEndDate: any = '';
  showAdvancedSearch: boolean = false;
  formatedPaidAmount: string = '';
  formatedPendingAmount: string = '';
  totalAmount: number = 0;
  formatedTotalAmount: string = '';
  totalPaidAmount: number = 0;
  totalPendingAmount: number = 0;
  showDropdown: boolean = false;
  dropdownPosition: any = {};
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;
  menuOpen: boolean = false;
  phoneNumber: string = '';
  transactionTypeAsPayment: CommonReferenceDetails =
    new CommonReferenceDetails();
  transactionData: Map<string, CommonReferenceDetails> = new Map();
  paymentTransactionTypeId: number = 0;
  transActionStatus: string = '';
  transActionTypes: CommonReferenceType[] = [];
  transActionTypeId: number = 0;
  paymentPlans: any[] = [];
  selectedPaymentPlan: IPaymentPlan = new PaymentPlan();
  stage: IStage = new Stage();
  paymentPlan: any = new FormControl([] as IPaymentPlan[]);
  planName: any;
  planId: any;
  blocks: any[] = [];
  blockName: string = '';
  blockId: number[] = [];
  block: any = new FormControl([] as IBlock[]);
  stageFc: any = new FormControl([] as StageDto[]);
  selectedBlock: IBlock = new Block();
  crmMemberRoleName = CRM_MEMBER_ROLL_NAME;
  paymentStatus: string = '';
  @ViewChild('allSelected') private allSelected?: MatOption;
  @ViewChild('allProjectSelected') private allProjectSelected?: any;
  @ViewChild('allBlockSelected') private allBlockSelected?: any;
  @ViewChild('allStageSelected')
  private allStageSelected?: MatCheckbox;
  selectedprojectIds: number[] = [];
  user: User = new User();
  selectedUserManageIds: number[] = [];
  selectedBlockIds: any;
  allBlocks: BlockDto[] = [];
  fromComponent: boolean = false;
  selectedBlocks: any[] = [];
  selectedPaymentPlanIds: any;
  @ViewChild('allPaymentPlanSelected')
  private allPaymentPlanSelected?: MatCheckbox;
  selectedPaymentPlans: any[] = [];
  selectedStageIds: any[] = [];
  selectedStages: any[] = [];
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
    // this.getTransactionType();
    this.getPaymentStatus();
    // this.getAllStages();
    this.getActionStatus();
    this.getTransActionStatus();
    // this.getAllPaymentDetails();
    this.getCompanyTypes();
    this.getUserManageTypes();
    this.getDetailsFromState();
    // this.onPaymentStatusSelect({ value: this.selectedPaymentStatusesValue });
  }
  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
      this.userId = user.userId;
      this.roleName = user.roleName;
    }
  }
  getDetailsFromState() {
    console.log(history.state);
    const state = history.state;
    this.stageId = history.state.stageId;
    this.projectId = history.state.projectId;
    this.blockId = history.state.blockId;
    this.planId = history.state.planId;
    if (history.state.typeId > 0) {
      this.typeId = history.state.typeId;
    }
    const values = history.state.paymentStatusValue;
    this.typeCommonReferenceDetailsId =
      history.state.typeCommonReferenceDetailsId;

    this.fromComponent = history.state.fromComponent;
    this.paymentTransactionTypeId = history.state.paymentTransactionTypeId;
    console.log('From component:', this.fromComponent);
    this.selectedUserManageIds = history.state.selectedUserManageIds;
    if (state) {
      if (history.state.paymentTransactionTypeId) {
        this.transActionTypeId = history.state.paymentTransactionTypeId;
      }
      if (history.state.phoneNumber) {
        this.phoneNumber = history.state.phoneNumber;
      }
      if (state.filterBlockId && state.filterBlockId !== 0) {
        this.blockId = state.filterBlockId;
        this.fetchPaymentPlans();
      }
      // if (state.filterPlanId && state.filterPlanId !== 0) {
      //   this.planId = state.filterPlanId;
      //   this.getAllStages();
      // }
      // if (state.filterStageId && state.filterStageId !== 0) {
      //   this.stageId = state.filterStageId;
      // }
      if (values != null) {
        this.paymentStatusControl.setValue(values);
        this.paymentStatusId = values.map((val: any) => val.id);
        // this.getAllPaymentDetails();
        // this.getAllDashBoardCount();
      }
      // if (this.projectId != null && this.projectId !== 0) {
      //   this.fetchProjectById(this.projectId);
      // }
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
      if (this.planId?.length > 0) {
        this.patchStatePaymentPlanIds(this.planId);
      }
      if (this.stageId?.length > 0) {
        this.patchStateStageIds(this.stageId);
      }
      this.patchDashboardValues(this.selectedPaymentStatusesValue);
    }
  }
  patchDashboardValues(preSelectedStatuses: CommonReferenceType[]): void {
    const allSelected = preSelectedStatuses.some(
      (status) => status.commonRefValue === 'All'
    );
    if (allSelected) {
      // If "All" is part of the pre-selected statuses, select all options
      // this.paymentStatusControl.setValue(this.paymentStatusNames);
    } else {
      // Otherwise, patch only the pre-selected statuses
      if (preSelectedStatuses) {
        this.paymentStatusControl.setValue(preSelectedStatuses);
      }
    }
    console.log('Patched selected values:', this.paymentStatusControl.value);
  }
  private fetchProjectById(projectId: number) {
    this.projectService
      .getProjectById(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedProject = data;
          this.project.setValue(this.selectedProject);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  private fetchBlockById(blockId: number) {
    this.blockService
      .getBlockById(blockId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedBlock = data;
          this.block.setValue(this.selectedBlock);
          this.fetchPaymentPlans();
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  fetchPaymentPlansById(paymentPlanById: number) {
    console.log(paymentPlanById);
    console.log(this.blockId);
    this.paymentPlanService
      .getPaymentPlanById(paymentPlanById)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paymentPlans) => {
          this.selectedPaymentPlan = paymentPlans;
          this.paymentPlan.setValue(this.selectedPaymentPlan);
          this.getAllStages();
        },
        error: (error: Error) => {
          console.error('Error fetching payment Plans:', error);
        },
      });
  }
  AddPaymentDetails(paymentDetails: IPaymentDetailsDto) {
    console.log('projectId from display page' + paymentDetails.projectId);

    this.fetchPaymentDetailsByIdForBooking(
      paymentDetails.paymentDetailsId,
      paymentDetails.projectId,
      paymentDetails.blockId,
      paymentDetails.levelId,
      paymentDetails.unitId,
      paymentDetails.stageId,
      paymentDetails.applicantId,
      true
    );
  }
  editPaymentDetails(paymentDetails: IPaymentDetailsDto) {
    console.log('projectId from display page' + paymentDetails.projectId);

    this.fetchPaymentDetailsById(
      paymentDetails.paymentDetailsId,
      paymentDetails.projectId,
      paymentDetails.blockId,
      paymentDetails.levelId,
      paymentDetails.unitId,
      false
    );
  }
  getAllPaymentDetails(): void {
    this.showLoading();
    console.log(`Stage ID: ${this.stageId}`);
    let stageOrder: number[] | undefined = undefined;
    if (this.roleName === 'sales member') {
      stageOrder = [1, 2];
    }
    this.paymentDetailsService
      .getAllPaymentDetails(
        this.fristapplicantName,
        this.stageId ?? 0,
        this.pageIndex,
        this.pageSize,
        this.paymentDetailsId ?? 0,
        this.paymentStatusId ?? '',
        this.actionStatusId ?? 0,
        this.projectId ?? '',
        this.customStartDate || '',
        this.customEndDate || '',
        this.phoneNumber || '',
        stageOrder,
        this.typeId,
        this.unitId,
        this.transActionTypeId,
        this.blockId,
        this.planId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paymentDetails) => {
          this.hideLoading();
          this.paymentDetails = paymentDetails.records;
          // console.log('Payment details:', this.paymentDetails);
          this.totalItems = paymentDetails.totalRecords;
        },
        error: (error: Error) => {
          this.hideLoading();
          console.error('Error fetching payment details:', error);
        },
      });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllPaymentDetails();
  }
  onSearch(customerName: string) {
    if (
      customerName.length >= searchTextLength ||
      customerName.length === searchTextZero
    ) {
      this.fristapplicantName = customerName;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllPaymentDetails();
      this.getAllDashBoardCount();
    }
  }
  fetchPaymentDetailsById(
    paymentDetailsId: number,
    projectId: number,
    blockId: number,
    levelId: number,
    unitId: number,
    isAdding?: boolean
  ) {
    this.paymentDetailsService
      .getpaymentDetailsById(paymentDetailsId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paymentDetailsData) => {
          // console.log(paymentDetailsData);
          const stageTotalAmount = paymentDetailsData.stageTotalAmount;
          const stageTds = paymentDetailsData.stageTds;
          const navigateToRoute = isAdding
            ? NAVIGATE_TO_ADD_PAYMENT_DETAILS
            : NAVIGATE_TO_ADD_PAYMENT_DETAILS;
          this.router.navigate([navigateToRoute], {
            state: {
              paymentDetailsData: paymentDetailsData,
              projectId: projectId,
              blockId: blockId,
              levelId: levelId,
              unitId: unitId,
              isAdding: isAdding,
              stageTotalAmount: stageTotalAmount,
              stageTds: stageTds,
            },
          });
        },
        error: (error) => {
          // console.error(error);
          console.error('Error fetching payment details by id:', error);
        },
      });
  }

  getAllStages() {
    this.stageService
      .getStages(this.stageName, this.projectId, this.planId, this.blockId)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.stages = data;
          if (this.selectedStageIds?.length > 0) {
            this.selectedStages = this.stages.filter((stage) =>
              this.selectedStageIds.includes(stage.stageId)
            );
            this.stages = this.sortStages(this.stages, this.selectedStageIds);
            const selectedNames = this.selectedStages
              .map(
                (stage: any) => stage.planName + ' ( ' + stage.planCode + ' )'
              )
              .join(', ');
            this.stageFc.patchValue(selectedNames);
          } else {
            this.stageFc.setValue(null);
          }
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  // displayStage(stage: StagesDto): string {
  //   return stage && stage.stageName ? stage.stageName : '';
  // }
  // onStageSelectSelect(event: any) {
  //   console.log(event.option.value);
  //   if (event?.option?.value) {
  //     this.stageId = event.option.value.stageId;
  //     // this.stageName = event.option.value.stageName;
  //     console.log(this.stageName);
  //     this.pageIndex = PAGE_INDEX;
  //     this.paginator.firstPage();
  //     this.getAllPaymentDetails();
  //     this.getAllDashBoardCount();
  //   }
  // }
  // searchStage(event: any): void {
  //   const query = event.target.value;
  //   if (query.length >= searchTextLength) {
  //     this.stageName = query;
  //     this.getAllStages();
  //     this.getAllPaymentDetails();
  //     this.getAllDashBoardCount();
  //   }
  //   if (query.length === searchTextZero) {
  //     this.stageId = 0;
  //     this.getAllStages();
  //     this.getAllPaymentDetails();
  //     this.getAllDashBoardCount();
  //   }
  // }
  handleModel() {
    this.isModelView = true;
  }
  getDetailsByPaymentDetailsId(paymentDetailsId: number) {
    this.paymentDetailsId = paymentDetailsId;
    this.paymentDetailsService
      .getAllPaymentDetails(
        this.fristapplicantName,
        this.stageId,
        this.stageName,
        this.pageIndex,
        this.pageSize,
        this.paymentDetailsId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paymentDetail) => {
          this.paymentDetail = paymentDetail.records[0];
          // console.log(this.paymentDetail);
          this.totalItems = paymentDetail.totalRecords;
          this.handleModel();
        },
        error: (error: Error) => {
          console.error('Error fetching prime activity code:', error);
        },
      });
  }
  fetchPaymentDetailsByIdForBooking(
    paymentDetailsId: number,
    projectId: number,
    blockId: number,
    levelId: number,
    unitId: number,
    stageId: number,
    applicantId: number,
    isAdding?: boolean
  ) {
    this.paymentDetailsService
      .getpaymentDetailsByIdForAdding(applicantId, stageId, paymentDetailsId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paymentDetailsData) => {
          // console.log(paymentDetailsData);
          const stageTotalAmount = paymentDetailsData.stageTotalAmount;
          const stageTds = paymentDetailsData.stageTds;
          const navigateToRoute = isAdding
            ? NAVIGATE_TO_ADD_PAYMENT_DETAILS
            : NAVIGATE_TO_ADD_PAYMENT_DETAILS;
          this.router.navigate([navigateToRoute], {
            state: {
              paymentDetailsData: paymentDetailsData,
              projectId: projectId,
              blockId: blockId,
              levelId: levelId,
              unitId: unitId,
              isAdding: isAdding,
              stageTotalAmount: stageTotalAmount,
              stageTds: stageTds,
            },
          });
        },
        error: (error) => {
          // console.error(error);
          console.error('Error fetching payment details by id:', error);
        },
      });
  }
  onStatusSelect(event: any) {
    console.log(event?.value);
    if (event?.value === 'All') {
      let val = '';
      this.status = val;
      console.log(this.status);
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllPaymentDetails();
      this.getAllDashBoardCount();
    } else {
      if (event?.value) {
        this.status = event.value;
        console.log(this.status);
        this.pageIndex = PAGE_INDEX;
        this.paginator.firstPage();
        this.getAllPaymentDetails();
        this.getAllDashBoardCount();
      }
    }
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
  onStatusChange(selectedValue: string): void {
    this.selectedStatus = selectedValue;
    if (selectedValue === 'All') {
      this.actionStatus = '';
    } else {
      this.actionStatus = selectedValue;
    }
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    this.getAllPaymentDetails();
    this.getAllDashBoardCount();
  }

  private fetchStagesById(stageId: number) {
    this.stageService.getStageByID(stageId).subscribe({
      next: (data) => {
        console.log(data);
        this.selectedStage = data;
        this.stageFc.setValue(this.selectedStage);
      },
      error: (error: any) => {
        console.error('Error fetching Project Charge Charge Ins :', error);
      },
    });
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
  comparePaymentStatus(option: any, selected: any): boolean {
    return option?.id === selected?.id;
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
    if (event.value.commonRefValue === 'All') {
      let val = 0;
      this.actionStatusId = val;
    } else {
      this.actionStatusId = event.value.id;
    }
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    this.getAllPaymentDetails();
    this.getAllDashBoardCount();
  }
  onPaymentStatusSelect(event: any) {
    this.selectedPaymentStatuses = [];
    this.selectedPaymentStatusesValue = [];
    this.selectedPayment = [];
    if (Array.isArray(event)) {
      console.log('Processing pre-selected values from dashboard:', event);

      for (const selected of event) {
        if (selected.commonRefValue === 'All') {
          this.selectedPaymentStatusesValue = [...this.paymentStatusNames];
          this.selectedPaymentStatuses = this.paymentStatusNames.map(
            (item) => item.id
          );

          this.paymentStatusId = [];
          console.log('All selected from dashboard');
          console.log(this.selectedPaymentStatusesValue);
          break;
        } else {
          this.selectedPaymentStatuses.push(selected.id);
          this.selectedPaymentStatusesValue.push(selected);
          this.selectedPayment.push(selected.commonRefValue);
        }
      }
      this.paymentStatusId = [...this.selectedPaymentStatuses];
      console.log('Final selected Payment Status IDs:', this.paymentStatusId);
      this.pageIndex = PAGE_INDEX;
      // this.paginator.firstPage();
      this.getAllPaymentDetails();
      this.getAllDashBoardCount();
      return;
    }
    console.log('Processing user selection from dropdown:', event);
    if (event && event.value) {
      const selectedValues = event.value;

      for (const selected of selectedValues) {
        console.log('Selected value:', selected);

        if (selected.commonRefValue === 'All') {
          this.selectedPaymentStatusesValue = [...this.paymentStatusNames];
          this.selectedPaymentStatuses = this.paymentStatusNames.map(
            (item) => item.id
          );
          this.paymentStatusId = [];
          console.log('All selected from dropdown');
          break;
        } else {
          this.selectedPaymentStatuses.push(selected.id);
          this.selectedPaymentStatusesValue.push(selected);
        }
      }
      this.paymentStatusId = [...this.selectedPaymentStatuses];
      console.log('Final selected Payment Status IDs:', this.paymentStatusId);
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllPaymentDetails();
      this.getAllDashBoardCount();
    }
  }
  getStageDetails(paymentDetails: IPaymentDetailsDto) {
    const route = paymentDetails.transactionType
      .toLocaleLowerCase()
      .includes('payment')
      ? NAVIGATE_TO_ADD_CUSTOMER_PAYMENT_BY_CRM
      : NAVIGATE_TO_ADD_CUSTOMER_TDS_BY_CRM;
    this.router.navigate([route], {
      // state: {
      //   customerInfo: this.customerInfo,
      //   isAdding: this.isAdding,
      //   stageId: paymentDetails.stageId,
      //   transactionTypeId: paymentDetails.transactionTypeId,
      //   paidTds: paymentDetails.paidTds,
      // },
    });
  }
  goToAdd() {
    const route = NAVIGATE_TO_ADD_CUSTOMER_PAYMENT_BY_CRM;
    this.router.navigate([route]);
  }

  displayProject(project: IUserManageDto): string {
    return project && project.projectName ? project.projectName : '';
  }
  searchProject(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.projectName = query;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
    } else if (query.length == 0) {
      this.projectName = '';
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
    }
  }

  fetchUnits() {
    this.unitService
      .getAllUnitsBasedOnProjectId(this.projectId, this.unitName, this.blockId)
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
    console.log(event);
    this.unitName = event.option.value.unitName;
    this.unitId = event.option.value.id;
    // this.getAllApplicantInfos()
    this.getAllPaymentDetails();
    this.getAllDashBoardCount();
  }
  displayUnit(unit: Unit): string {
    return unit && unit.unitName ? unit.unitName : '';
  }
  searchUnit(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.unitName = query;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.fetchUnits();
      this.getAllPaymentDetails();
      this.getAllDashBoardCount();
    } else if (query.length == 0) {
      this.unitName = '';
      this.unitId = 0;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.fetchUnits();
      this.getAllPaymentDetails();
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
  onDateChange() {
    this.pageIndex = 0;
    this.paginator.firstPage();
    const startDate = this.formData.get('customStartDate')?.value;
    const endDate = this.formData.get('customEndDate')?.value;
    if (startDate !== null && endDate !== null) {
      this.dateRange = '';
      this.getAllPaymentDetails();
    } else {
      this.dateRange = 0;
    }
  }

  clearDateRange(): void {
    this.formData.get('customStartDate')?.setValue('');
    this.formData.get('customEndDate')?.setValue('');
    this.customStartDate = '';
    this.customEndDate = '';
    this.getAllPaymentDetails();
    console.log(this.formData.get('customStartDate')?.value);
    console.log(this.formData.get('customEndDate')?.value);
  }
  getTotalPaidAmount() {
    this.dashboardservice
      .getPaidAmount(
        this.projectId,
        this.stageId,
        this.fristapplicantName,
        this.paymentStatusId,
        this.actionStatusId,
        this.phoneNumber,
        this.unitId,
        this.paymentTransactionTypeId,
        this.blockId,
        this.planId,
        STAGE_STATUS,
        this.typeId
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.totalPaidAmount = data.totalAmount;
          this.formatedPaidAmount = data.formatedAmount;
          console.log(this.totalPaidAmount);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  getTotalPendingAmount() {
    this.dashboardservice
      .getPendingAmount(
        this.projectId,
        this.stageId,
        this.fristapplicantName,
        this.paymentStatusId,
        this.actionStatusId,
        this.phoneNumber,
        this.unitId,
        this.paymentTransactionTypeId,
        this.blockId,
        this.planId,
        STAGE_STATUS,
        this.typeId
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.totalPendingAmount = data.totalAmount;
          this.formatedPendingAmount = data.formatedAmount;
          console.log(this.totalPendingAmount);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  getTotalAmount() {
    this.dashboardservice
      .getTotalAmount(
        this.projectId,
        this.stageId,
        this.fristapplicantName,
        this.paymentStatusId,
        this.actionStatusId,
        this.phoneNumber,
        this.unitId,
        this.paymentTransactionTypeId,
        this.blockId,
        this.planId,
        STAGE_STATUS,
        this.typeId
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.totalAmount = data.totalAmount;
          this.formatedTotalAmount = data.formatedAmount;
          console.log(this.totalAmount);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  getAllDashBoardCount() {
    this.getTotalAmount();
    this.getTotalPendingAmount();
    this.getTotalPaidAmount();
  }

  onMenuClick(event: MouseEvent) {
    console.log('Menu clicked', event);
  }
  toggleMenu(event: MouseEvent) {
    this.menuOpen = !this.menuOpen;
    if (this.menuOpen) {
      this.setDropdownPosition(event);
    }
  }
  setDropdownPosition(event: MouseEvent) {
    const button = event.target as HTMLElement;
    const rect = button.getBoundingClientRect();
    this.dropdownPosition = {
      top: `${rect.bottom + window.scrollY}px`,
    };
  }

  closeMenu() {
    this.menuOpen = false;
  }
  onPhoneNumberSearch(phoneNumber: string) {
    if (phoneNumber.length >= 7 || phoneNumber.length === searchTextZero) {
      this.phoneNumber = phoneNumber;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getAllPaymentDetails();
      this.getAllDashBoardCount();
    }
  }

  generatePaymentReceipt(
    paymentDetailsId?: number,
    paymentReceiptUrl?: string
  ): void {
    console.log('File Path Received', paymentReceiptUrl, paymentDetailsId);
    if (paymentReceiptUrl) {
      console.log('File path already exists:', paymentReceiptUrl);
      this.downloadPaymentReceipt(paymentReceiptUrl);
      return;
    }
    console.log('Generating payment receipt for:', paymentDetailsId);
    this.paymentDetailsService
      .generateReceipt(paymentDetailsId!)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (filePath: string) => {
          console.log('PDF URL received:', filePath);
          Swal.fire({
            title: 'Payment Receipt Generated',
            text: 'Your Payment Receipt has been generated successfully!',
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Download',
            cancelButtonText: 'Close',
          }).then((result) => {
            if (result.isConfirmed) {
              this.downloadPaymentReceipt(filePath);
            }
          });
        },
        error: (error: Error) => {
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
    if (event.value == 'All') {
      let val = 0;
      this.transActionTypeId = val;
    } else {
      this.transActionTypeId = event.value;
    }
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    this.getAllPaymentDetails();
    this.getAllDashBoardCount();
  }
  fetchPaymentPlans() {
    // Only fetch payment plans if at least one block is selected
    if (!this.selectedBlockIds || this.selectedBlockIds.length === 0) {
      this.paymentPlans = [];
      this.paymentPlan.setValue(null);
      return;
    }
    this.paymentPlanService
      .getAllPaymentPlansByProjectId(
        this.selectedprojectIds,
        this.selectedBlockIds
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paymentPlans) => {
          this.paymentPlans = paymentPlans;
          if (this.selectedPaymentPlanIds?.length > 0) {
            this.selectedPaymentPlans = this.paymentPlans.filter(
              (paymentPlan) =>
                this.selectedPaymentPlanIds.includes(paymentPlan.id)
            );
            this.paymentPlans = this.sortPaymentPlans(
              this.paymentPlans,
              this.selectedPaymentPlanIds
            );
            const selectedNames = this.selectedPaymentPlans
              .map(
                (paymentPlan: any) =>
                  paymentPlan.planName + ' ( ' + paymentPlan.planCode + ' )'
              )
              .join(', ');
            this.paymentPlan.patchValue(selectedNames);
          } else {
            this.paymentPlan.setValue(null);
          }
        },
        error: (error: Error) => {
          console.error('Error fetching payment Plans:', error);
        },
      });
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
  // onBlockSelect(event: any, stageAuto: MatAutocomplete) {
  //   this.blockId = 0;
  //   this.planId = 0;
  //   if (event.option.value.id == this.blockId) {
  //     console.log('Same Block selected {}');
  //     return;
  //   }
  //   this.blockId = event.option.value.id;
  //   console.log(this.blockId);
  //   this.paymentPlan.setValue(null);
  //   this.stageFc.setValue(null);
  //   this.planId = 0;
  //   this.stageId = 0;
  //   stageAuto.options.forEach((option) => option.deselect());
  //   this.pageIndex = PAGE_INDEX;
  //   this.paginator.firstPage();
  //   this.fetchPaymentPlans();
  //   this.getAllStages();
  //   this.getAllPaymentDetails();
  //   this.getAllDashBoardCount();
  // }
  displayBlock(block: IBlock) {
    return block && block.name ? block.name : '';
  }
  // searchBlock(
  //   event: any,
  //   paymentPlanAuto: MatAutocomplete,
  //   stageAuto: MatAutocomplete
  // ) {
  //   const query = event.target.value;
  //   this.blockName = query;
  //   if (query.length == 0) {
  //     this.blockName = '';
  //     this.pageIndex = PAGE_INDEX;
  //     this.paginator.firstPage();
  //     this.blockId = 0;
  //     this.paymentPlan.setValue(null);
  //     this.stageFc.setValue(null);
  //     paymentPlanAuto.options.forEach((option) => option.deselect());
  //     stageAuto.options.forEach((option) => option.deselect());
  //     this.planId = 0;
  //     this.stageId = 0;
  //     this.fetchBlocks();
  //     this.fetchPaymentPlans();
  //     this.getAllStages();
  //     this.getAllPaymentDetails();
  //     this.getAllDashBoardCount();
  //   }
  //   this.fetchBlocks();
  // }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
  goBack() {
    console.log(this.projectId);
    const stateData = {
      stageId: this.stageId,
      blockId: this.blockId,
      planId: this.planId,
      typeId: this.typeId,
      projectId: this.selectedprojectIds,
      selectedUserManageIds: this.selectedUserManageIds,
      typeCommonReferenceDetailsId: this.typeCommonReferenceDetailsId,
      fromComponent: true,
      paymentTransactionTypeId: this.paymentTransactionTypeId,
    };
    console.log(stateData);
    this.router.navigate(['layout/crm/crmuser/dashboard'], {
      state: stateData,
    });
  }

  goToFollowups(
    applicantId: number,
    stageId: number,
    paymentStatusId: number,
    status: string
  ) {
    let stateData: any = {
      applicantId,
      stageId,
      phoneNumber: this.phoneNumber,
      filterBlockId: this.blockId,
      filterPlanId: this.planId,
      filterStageId: this.stageId,
      status: status,
    };

    if (paymentStatusId > 0) {
      this.commonRefDetailsService.getById(paymentStatusId).subscribe({
        next: (response) => {
          console.log(response);
          this.paymentStatus = response?.commonRefValue
            ? response.commonRefValue
            : '';
          console.log(this.paymentStatus);
          stateData.paymentStatus = this.paymentStatus;
          this.router.navigate(['/layout/crm/followup'], { state: stateData });
        },
        error: (err) => {
          console.error('Failed to fetch payment status', err);
          this.router.navigate(['/layout/crm/followup'], { state: stateData });
        },
      });
    } else {
      this.router.navigate(['/layout/crm/followup'], { state: stateData });
    }
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
    this.getAllPaymentDetails();
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

  // menu on right click

  selectedRow: any;
  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };
  selectedRowData: any = null;

  onTableRightClick(event: MouseEvent, rowData: any) {
    console.log('Right-click triggered');
    console.log('Ctrl pressed:', event.ctrlKey);
    console.log(rowData);

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

  onGlobalMenuAction(action: any) {
    this.contextMenuVisible = false;
    if (action === 'Followups') {
      console.log(this.selectedRowData);

      this.goToFollowups(
        this.selectedRowData.applicantId,
        this.selectedRowData.stageId,
        this.selectedRowData.paymentStatusId,
        this.selectedRowData.status
      );
    } else if (action === 'Delete') {
    }
  }

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

  isSelectedProject(projectId?: number): boolean {
    return this.selectedprojectIds?.includes(projectId ? projectId : 0);
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
  onProjectSelectButtonClick() {
    this.projectId = this.selectedprojectIds;
    if (this.projectId.length > 0) {
      this.fetchBlocks();
      this.getAllPaymentDetails();
      this.getAllDashBoardCount();
    } else {
      this.block.setValue(null);
      this.paymentPlan.setValue(null);
      this.stageFc.setValue(null);
      this.blocks = [];
      this.paymentPlans = [];
      this.stages = [];
      this.projectId = this.userManageprojects.map((p) => p.projectId, 0);
      this.getAllPaymentDetails();
      this.getAllDashBoardCount();
    }
  }

  isProjectAllSelected(): boolean {
    const allProjectIds = this.userManageprojects.map((p) => p.projectId);
    return (
      Array.isArray(this.selectedprojectIds) &&
      allProjectIds.length > 0 &&
      allProjectIds.every((id) => this.selectedprojectIds.includes(id))
    );
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
            this.projectId = this.userManageprojects.map((p) => p.projectId, 0);
            this.getTransactionType();
            this.getAllPaymentDetails();
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
          this.getAllPaymentDetails();
          this.getTransactionType();
        },
      });
  }

  onProjectSelect(umproject: any, event: any) {
    // Deselect or select a project and update related blocks and payment plans
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
      if (this.selectedBlockIds?.length > 0) {
        const relatedBlockIds = this.selectedBlocks
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

      // --- Deselect related payment plans ---
      let relatedPaymentPlanIds: number[] = [];
      if (this.selectedPaymentPlanIds?.length > 0) {
        relatedPaymentPlanIds = this.selectedPaymentPlans
          .filter((plan) => plan.projectId === selectedProject)
          .map((plan) => plan.id);

        this.selectedPaymentPlanIds = this.selectedPaymentPlanIds.filter(
          (id: any) => !relatedPaymentPlanIds.includes(id)
        );
        this.selectedPaymentPlans = this.selectedPaymentPlans.filter((plan) =>
          this.selectedPaymentPlanIds.includes(plan.id)
        );
        this.planId = [...this.selectedPaymentPlanIds];
        const selectedNames = this.selectedPaymentPlans
          .map((plan: any) => plan.planName + ' ( ' + plan.planCode + ' )')
          .join(', ');
        this.paymentPlan.patchValue(selectedNames);
      }

      // --- Deselect related stages for removed payment plans ---
      if (
        this.selectedStageIds?.length > 0 &&
        relatedPaymentPlanIds.length > 0
      ) {
        const relatedStageIds = this.selectedStages
          .filter((stage: any) => relatedPaymentPlanIds.includes(stage.planId))
          .map((stage: any) => stage.stageId);

        this.selectedStageIds = this.selectedStageIds.filter(
          (id: any) => !relatedStageIds.includes(id)
        );
        this.selectedStages = this.selectedStages.filter(
          (stage: any) => !relatedStageIds.includes(stage.stageId)
        );
        this.stageId = [...this.selectedStageIds];
        if (this.selectedStages.length > 0) {
          const selectedStageNames = this.selectedStages
            .map(
              (stage: any) => stage.stageName + ' ( ' + stage.planCode + ' )'
            )
            .join(', ');
          this.stageFc.patchValue(selectedStageNames);
        } else {
          this.stageFc.patchValue('');
        }
        this.displayStageNames();
      }

      if (this.selectedprojectIds?.length > 0) {
        this.displayProjectNames();
      } else if (this.selectedprojectIds?.length == 0) {
        this.project.patchValue('');
      }
    }
    this.projectId = this.selectedprojectIds;
    this.fetchPaymentPlans();
  }
  searchBlock(event: any): void {
    if (event.target.value.length >= 3) {
      this.blockName = event.target.value;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.fetchBlocks();
    } else if (event.target.value.length === 0) {
      this.blockName = '';
      this.blockId = [];
    }
  }
  onAllSelectBlock() {
    if (this.allBlockSelected.checked) {
      this.selectedBlockIds = this.blocks.map((p: any) => p.id, 0);
      this.displayBlockNames();
    } else {
      this.selectedBlockIds = [];
    }
  }
  isBlockAllSelected(): boolean {
    const allBlockIds = this.blocks.map((b: any) => b.id);
    return (
      Array.isArray(this.selectedBlockIds) &&
      allBlockIds.length > 0 &&
      allBlockIds.every((id: any) => this.selectedBlockIds.includes(id))
    );
  }
  isSelectedBlock(blockId?: number): boolean {
    return blockId != null && this.selectedBlockIds?.includes(blockId);
  }
  onBlockSelect(block: any, event: any) {
    //this.allProjectChecked=false;
    this.block.patchValue('');
    console.log(event);
    const selectedBlock = block.id;
    console.log('selected Block id' + selectedBlock);
    console.log(this.selectedBlockIds);
    if (event.checked) {
      if (!this.selectedBlockIds) {
        this.selectedBlockIds = [];
      }
      this.selectedBlocks?.push(block);
      this.selectedBlockIds?.push(selectedBlock);
      this.displayBlockNames();
    } else {
      this.selectedBlockIds = this.selectedBlockIds?.filter(
        (id: any) => id !== selectedBlock
      );
      this.selectedBlocks = this.selectedBlocks?.filter(
        (b: any) => b.id !== selectedBlock
      );
      // --- Deselect related payment plans ---
      let relatedPaymentPlanIds: number[] = [];
      if (this.selectedPaymentPlanIds?.length > 0) {
        relatedPaymentPlanIds = this.selectedPaymentPlans
          .filter((plan) => plan.blockId === selectedBlock)
          .map((plan) => plan.id);

        this.selectedPaymentPlanIds = this.selectedPaymentPlanIds.filter(
          (id: any) => !relatedPaymentPlanIds.includes(id)
        );
        this.selectedPaymentPlans = this.selectedPaymentPlans.filter((plan) =>
          this.selectedPaymentPlanIds.includes(plan.id)
        );
        this.planId = [...this.selectedPaymentPlanIds];
        const selectedNames = this.selectedPaymentPlans
          .map((plan: any) => plan.planName + ' ( ' + plan.planCode + ' )')
          .join(', ');
        this.paymentPlan.patchValue(selectedNames);
      }
      // --- Deselect related stages for removed payment plans ---
      if (
        this.selectedStageIds?.length > 0 &&
        relatedPaymentPlanIds.length > 0
      ) {
        const relatedStageIds = this.selectedStages
          .filter((stage: any) => relatedPaymentPlanIds.includes(stage.planId))
          .map((stage: any) => stage.stageId);

        this.selectedStageIds = this.selectedStageIds.filter(
          (id: any) => !relatedStageIds.includes(id)
        );
        this.selectedStages = this.selectedStages.filter(
          (stage: any) => !relatedStageIds.includes(stage.stageId)
        );
        this.stageId = [...this.selectedStageIds];
        if (this.stageId.length > 0) {
          const selectedStageNames = this.selectedStages
            .map(
              (stage: any) => stage.stageName + ' ( ' + stage.planCode + ' )'
            )
            .join(', ');
          this.stageFc.patchValue(selectedStageNames);
        } else {
          this.stageFc.patchValue('');
        }
        this.displayStageNames();
      }
      if (this.selectedBlockIds?.length > 0) {
        this.displayBlockNames();
      } else if (this.selectedBlockIds?.length == 0) {
        this.block.patchValue('');
      }
    }
    console.log(this.blockId);
  }
  onBlockSelectButtonClick() {
    this.blockId = this.selectedBlockIds;
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    if (this.blockId.length > 0) {
      this.fetchPaymentPlans();
      this.fetchUnits();
      this.getAllPaymentDetails();
      this.getAllDashBoardCount();
    } else {
      this.block.setValue(null);
      this.paymentPlan.setValue(null);
      this.stageFc.setValue(null);
      this.paymentPlans = [];
      this.stages = [];
      this.fromComponent = false;
      this.getAllPaymentDetails();
      this.getAllDashBoardCount();
    }
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
  sortBlock(block: any[], selectedBlockIds: any): any[] {
    return block.sort((a, b) => {
      const aSelected = selectedBlockIds.includes(a.id);
      const bSelected = selectedBlockIds.includes(b.id);
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
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
          this.fetchPaymentPlans();
        },
      });
  }
  searchPaymentPlan(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.planName = query;
    } else if (query.length == 0) {
      this.planName = '';
      this.stageFc.setValue(null);
      this.stageName = '';
      this.stageId = 0;
      this.planId = 0;
    }
  }
  onAllPaymentPlan() {
    if (this.allPaymentPlanSelected?.checked) {
      this.selectedPaymentPlanIds = (this.paymentPlans || []).map(
        (p: any) => p.id
      );
      this.displayPaymentPlanNames();
    } else {
      this.selectedPaymentPlanIds = [];
    }
  }

  isPaymentPlanAllSelected(): boolean {
    const allPaymentPlanIds = this.paymentPlans.map((b) => b.id);
    return (
      Array.isArray(this.selectedPaymentPlanIds) &&
      allPaymentPlanIds.length > 0 &&
      allPaymentPlanIds.every((id: any) =>
        this.selectedPaymentPlanIds.includes(id)
      )
    );
  }
  isSelectedPaymentPlan(paymentPlanId?: number): boolean {
    return (
      paymentPlanId != null &&
      this.selectedPaymentPlanIds?.includes(paymentPlanId)
    );
  }
  onPaymentPlanSelect(paymentPlan: any, event: any) {
    //this.allProjectChecked=false;
    console.log(paymentPlan);
    this.paymentPlan.patchValue('');
    console.log(event);
    const selectedpaymentPlan = paymentPlan.id;
    console.log('selected paymentPlan id' + selectedpaymentPlan);
    console.log(this.selectedPaymentPlanIds);
    if (event.checked) {
      if (!this.selectedPaymentPlanIds) {
        this.selectedPaymentPlanIds = [];
      }
      this.selectedPaymentPlans?.push(paymentPlan);
      this.selectedPaymentPlanIds?.push(selectedpaymentPlan);
      this.displayPaymentPlanNames();
    } else {
      this.selectedPaymentPlanIds = this.selectedPaymentPlanIds?.filter(
        (id: any) => id !== selectedpaymentPlan
      );
      this.selectedPaymentPlans = this.selectedPaymentPlans?.filter(
        (plan: any) => plan.id !== selectedpaymentPlan
      );
      // Deselect related stages
      let relatedStageIds: number[] = [];
      if (this.selectedStageIds?.length > 0) {
        relatedStageIds = this.selectedStages
          .filter((stage: any) => stage.planId === selectedpaymentPlan)
          .map((stage: any) => stage.stageId);
        this.selectedStageIds = this.selectedStageIds.filter(
          (id: any) => !relatedStageIds.includes(id)
        );
        this.selectedStages = this.selectedStages.filter(
          (stage: any) => !relatedStageIds.includes(stage.stageId)
        );
        this.stageId = [...this.selectedStageIds];
        if (this.stageId.length > 0) {
          const selectedStageNames = this.selectedStages
            .map(
              (stage: any) => stage.stageName + ' ( ' + stage.planCode + ' )'
            )
            .join(', ');
          this.stageFc.patchValue(selectedStageNames);
        } else {
          this.stageFc.patchValue('');
        }
        this.displayStageNames();
      }
      // Update payment plan display name
      if (this.selectedPaymentPlanIds?.length > 0) {
        const selectedNames = this.selectedPaymentPlans
          .map((plan: any) => plan.planName + ' ( ' + plan.planCode + ' )')
          .join(', ');
        this.paymentPlan.patchValue(selectedNames);
      } else if (this.selectedPaymentPlanIds?.length == 0) {
        this.paymentPlan.patchValue('');
      }
    }
    console.log(this.selectedPaymentPlanIds);
  }
  displayPaymentPlanNames() {
    this.paymentPlanService
      .getAllPaymentPlansByProjectId(
        this.selectedprojectIds,
        this.selectedBlockIds
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paymentPlans: any) => {
          console.log(paymentPlans);
          this.paymentPlans = paymentPlans;
          this.paymentPlans = this.sortPaymentPlans(
            this.paymentPlans,
            this.selectedPaymentPlanIds
          );
          const selectedNames = paymentPlans
            .map(
              (paymentPlan: any) =>
                paymentPlan.planName + ' ( ' + paymentPlan.planCode + ' )'
            )
            .join(', ');
          console.log(selectedNames);
          this.paymentPlan.patchValue(selectedNames);
        },
      });
  }
  sortPaymentPlans(paymentPlans: any[], selectedPaymentPlanIds: any): any[] {
    return paymentPlans.sort((a, b) => {
      const aSelected = selectedPaymentPlanIds.includes(a.id);
      const bSelected = selectedPaymentPlanIds.includes(b.id);
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }

  onPaymentPlanSelectButtonClick() {
    console.log(this.selectedPaymentPlanIds);
    this.planId = this.selectedPaymentPlanIds;
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    if (this.planId.length > 0) {
      this.getAllStages();
      this.getAllPaymentDetails();
      this.getAllDashBoardCount();
    } else {
      this.paymentPlan.setValue(null);
      this.stageFc.setValue(null);
      this.stages = [];
      this.fromComponent = false;
      this.getAllPaymentDetails();
      this.getAllDashBoardCount();
    }
  }

  patchStatePaymentPlanIds(selectedPaymentPlanIds?: number[]): void {
    this.paymentPlan.patchValue('');
    this.selectedPaymentPlanIds = selectedPaymentPlanIds;
    console.log(this.selectedPaymentPlanIds);
    this.paymentPlanService
      .getAllPaymentPlansByProjectId(
        this.selectedprojectIds,
        this.selectedBlockIds
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paymentPlans: any) => {
          console.log(paymentPlans);
          this.paymentPlans = this.sortPaymentPlans(
            this.paymentPlans,
            this.selectedPaymentPlanIds
          );
          if (this.selectedPaymentPlanIds.length > 0) {
            const selectedNames = paymentPlans
              .map(
                (paymentPlan: any) =>
                  paymentPlan.planName + ' ( ' + paymentPlan.planCode + ' )'
              )
              .join(', ');
            console.log(selectedNames);
            this.paymentPlan.patchValue(selectedNames);
            this.selectedPaymentPlanIds = selectedPaymentPlanIds;
            this.planId = this.selectedPaymentPlanIds;
            console.log(this.selectedPaymentPlanIds);
            this.getAllStages();
          }
        },
      });
  }
  onAllStageSelect() {
    if (this.allStageSelected?.checked) {
      this.selectedStageIds = (this.stages || []).map((s: any) => s.stageId);
      this.selectedStages = [...this.stages]; // Add this line
      this.displayStageNames();
    } else {
      this.selectedStageIds = [];
      this.selectedStages = [];
      this.displayStageNames();
    }
  }

  isStageAllSelected(): boolean {
    const allStageIds = this.stages.map((s) => s.stageId);
    return (
      Array.isArray(this.selectedStageIds) &&
      allStageIds.length > 0 &&
      allStageIds.every((id: any) => this.selectedStageIds.includes(id))
    );
  }

  isSelectedStage(stageId?: number): boolean {
    return stageId != null && this.selectedStageIds?.includes(stageId);
  }

  onStageSelect(stage: any, event: any) {
    this.stageFc.patchValue('');
    const selectedStage = stage.stageId;
    if (event.checked) {
      if (!this.selectedStageIds) {
        this.selectedStageIds = [];
      }
      this.selectedStages?.push(stage);
      this.selectedStageIds?.push(selectedStage);
      this.displayStageNames();
    } else {
      this.selectedStageIds = this.selectedStageIds?.filter(
        (stageId: any) => stageId !== selectedStage
      );
      this.selectedStages = this.selectedStages?.filter(
        (s: any) => s.id !== selectedStage
      );
      if (this.selectedStageIds?.length > 0) {
        this.displayStageNames();
      } else if (this.selectedStageIds?.length == 0) {
        this.stageFc.patchValue('');
      }
    }
  }

  displayStageNames() {
    if (this.selectedStageIds && this.selectedStageIds.length > 0) {
      this.stageService
        .getStages(
          this.stageName,
          this.projectId,
          this.planId,
          this.blockId,
          this.selectedStageIds
        )
        .subscribe({
          next: (stages: any[]) => {
            this.selectedStages = stages;
            const selectedNames = stages
              .map(
                (stage: any) => stage.stageName + ' ( ' + stage.planCode + ' )'
              )
              .join(', ');
            this.stageFc.patchValue(selectedNames);
          },
          error: () => {
            this.stageFc.patchValue('');
          },
        });
    } else {
      this.stageFc.patchValue('');
      this.selectedStages = [];
    }
  }

  onStageSelectButtonClick() {
    console.log(this.selectedStageIds);
    this.stageId = this.selectedStageIds;
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    if (this.planId.length > 0) {
      this.getAllPaymentDetails();
      this.getAllDashBoardCount();
    } else {
      this.stageFc.setValue(null);
      this.stages = [];
      this.fromComponent = false;
      this.getAllPaymentDetails();
      this.getAllDashBoardCount();
    }
  }

  patchStateStageIds(selectedStageIds?: number[]): void {
    console.log(selectedStageIds);
    this.stageFc.patchValue('');
    this.selectedStageIds = selectedStageIds || [];
    console.log(this.selectedStageIds);
    this.stageService
      .getStages(
        this.stageName,
        this.projectId,
        this.planId,
        this.blockId,
        this.stageId
      )
      .subscribe({
        next: (stages: any[]) => {
          console.log(stages);
          // Sort and filter stages by selectedStageIds
          this.stages = this.sortStages(this.stages, this.selectedStageIds);
          if (this.selectedStageIds.length > 0) {
            const selectedNames = stages
              .map(
                (stage: any) => stage.stageName + ' ( ' + stage.planCode + ' )'
              )
              .join(', ');
            this.stageFc.patchValue(selectedNames);
            this.selectedStages = stages;
            this.stageId = this.selectedStageIds;
          } else {
            this.stageFc.patchValue('');
            this.selectedStages = [];
          }
        },
        error: () => {
          this.stageFc.patchValue('');
          this.selectedStages = [];
        },
      });
  }
  sortStages(stages: any[], selectedStageIds: any): any[] {
    return stages.sort((a, b) => {
      const aSelected = selectedStageIds.includes(a.stageId);
      const bSelected = selectedStageIds.includes(b.stageId);
      return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
    });
  }
  searchStage(event: any): void {
    const query = event.target.value;
    if (query.length >= searchTextLength) {
      this.stageName = query;
      this.getAllDashBoardCount();
    }
    if (query.length === searchTextZero) {
      this.stageId = [];
      this.getAllDashBoardCount();
    }
  }
}
