import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import {
  COMPANY_TYPE,
  searchTextLength,
  searchTextZero,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  ACTION_STATUS,
  PAYMENT_STATUS,
  SALE_AGREEMENT_STATUS,
  STAGE_STATUS,
  TRANSACTION_TYPE,
  TRANSACTION_TYPE_PAYMENT,
  USER_MANAGE_CRM,
  USER_MANAGE_TYPE,
} from 'src/app/Constants/Crm/CrmConstants';
import { IBlock } from 'src/app/Models/Block/block';
import {
  CommonReferenceDto,
  CommonReferenceType,
} from 'src/app/Models/CommanModel/menuDto';
import { CustomerStages } from 'src/app/Models/Project/customerStages';
import { IPaymentPlan, PaymentPlan } from 'src/app/Models/Project/PaymentPlan';
import { StageDto } from 'src/app/Models/Project/stage';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { Login } from 'src/app/Models/User/Login';
import { User } from 'src/app/Models/User/User';
import { UserDto } from 'src/app/Models/User/UserDto';
import { IUserManageDto } from 'src/app/Models/User/UserManage';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { DashBoardService } from 'src/app/Services/CrmServices/crm-dashboard.service';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { PaymentPlanService } from 'src/app/Services/ProjectService/PaymentPlan/paymentPlan.service';
import { StageService } from 'src/app/Services/ProjectService/Stage/stage.service';
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crm-dash-board',
  templateUrl: './crm-dash-board.component.html',
  styleUrls: ['./crm-dash-board.component.css'],
})
export class CrmDashBoardComponent implements OnInit {
  private destroy$ = new Subject<void>();
  today: any;
  totalPaidAmount: number = 0;
  totalPendingAmount: number = 0;
  formattedPaidAmount: string = '';
  formattedPendingAmount: string = '';
  totalAmount: number = 0;
  formattedTotalAmount: string = '';
  stageName: string = '';
  stages: StageDto[] = [];
  stageId: any = [];
  projectName: string = '';
  user: User = new User();
  organizationId: number = 0;
  projectId: number[] = [];
  project: any = new FormControl([] as IUserManageDto[]);
  paymentStatusNames: CommonReferenceDto[] = [];
  paymentStatusName: string = '';
  paymentStatusValue: any;
  transactionTypeAsPayment: CommonReferenceDetails =
    new CommonReferenceDetails();
  transactionData: Map<string, CommonReferenceDetails> = new Map();
  paymentTransactionTypeId: number = 0;
  blocks: any[] = [];
  blockName: string = '';
  blockId: any = [];
  block: any = new FormControl([] as IBlock[]);
  paymentPlan: any = new FormControl([] as IPaymentPlan[]);
  planName: any;
  planId: any = [];
  stageFc: any = new FormControl([] as StageDto[]);
  paymentPlans: any[] = [];
  roleName: string = '';
  selectedPaymentPlan: IPaymentPlan = new PaymentPlan();
  pendingSaleAgreementCount: number = 0;
  actionStatusNames: CommonReferenceType[] = [];
  selectedStatus: any;
  actionStatusId: number = 0;
  actionStatusValue: any;
  waitingForApprovalSaleAgreementCount: number = 0;
  blockedCount: number = 0;
  bookedCount: number = 0;
  availableCount: number = 0;
  formattedWaitingForApprovalAmount: string = '';
  actionStatusNamesForAmount: CommonReferenceType[] = [];
  userId: number = 0;
  userManageData: any;
  userName: string = '';
  Mainuser: User = new User();
  UserDetails: UserDto[] = [];
  User: any = new FormControl([] as UserDto[]);
  public login: Login = new Login('', '');
  userRole: string = '';
  selectedBlocks: any[] = [];
  selectedPaymentPlans: any[] = [];
  selectedStage: CustomerStages = new CustomerStages();
  reworkSaleAgreementCount: number = 0;
  typeId: number = 0;
  companyType: any;
  selectedLandOwner: string = '';
  typeCommonReferenceDetailsId: number = 0;
  userManageprojects: any[] = [];
  @ViewChild('allProjectSelected') private allProjectSelected?: any;
  @ViewChild('allBlockSelected') private allBlockSelected?: MatCheckbox;
  @ViewChild('allPaymentPlanSelected')
  private allPaymentPlanSelected?: MatCheckbox;
  @ViewChild('allStageSelected')
  private allStageSelected?: MatCheckbox;
  selectedprojectIds: number[] = [];
  selectedUserManageIds: number[] = [];
  selectedBlockIds: any;
  selectedPaymentPlanIds: any;
  fromComponent: boolean = false;
  selectedUserManages: any[] = [];
  selectedStageIds: any[] = [];
  selectedStages: any[] = [];
  constructor(
    private dashboardservice: DashBoardService,
    private router: Router,
    private stageService: StageService,
    private authService: AuthService,
    private commonService: CommanService,
    private commonReferenceDetailsService: CommonreferencedetailsService,
    private blockService: BlockService,
    private paymentPlanService: PaymentPlanService,
    private usermanageService: UsermanageService,
    private userService: UserService,
    private loaderService: LoaderService,
    private commanService: CommanService
  ) {}
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    const MainUser = localStorage.getItem('Mainuser');
    if (user) {
      this.user = JSON.parse(user);
      this.userRole = this.user.roleName;
      this.organizationId = this.user.organizationId;
    }
    if (MainUser) {
      this.Mainuser = JSON.parse(MainUser);
      this.fetchUser();
    }
    this.today = new Date().toDateString();
    this.setUserFromLocalStorage();
    this.getUserManageTypes();
    this.getActionStatus();
    this.getCompanyTypes();
    this.getActionStatusforAmount();
    //this.getProjects();
    // this.getAllStages();
    this.getPaymentStatus();
    //this.fetchBlocks();
    this.getDetailsFromState();
  }
  private setUserFromLocalStorage(): void {
    const user = this.authService.getUser();
    console.log(user);
    if (user != null) {
      this.user = JSON.parse(user);
      console.log(this.user.roleName);
      this.organizationId = this.user.organizationId;
      this.userId = this.user.userId;
    }
  }
  getTotalPaidAmount() {
    console.log(this.paymentTransactionTypeId);
    this.dashboardservice
      .getPaidAmount(
        this.projectId,
        this.stageId,
        '',
        '',
        0,
        '',
        0,
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
          this.formattedPaidAmount = data.formatedAmount;
          console.log(this.totalPaidAmount);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  getTotalPendingAmount() {
    console.log(this.paymentTransactionTypeId);
    this.dashboardservice
      .getPendingAmount(
        this.projectId,
        this.stageId,
        '',
        '',
        0,
        '',
        0,
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
          this.formattedPendingAmount = data.formatedAmount;
          console.log(this.totalPendingAmount);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  getTotalAmount() {
    console.log(this.paymentTransactionTypeId);
    this.dashboardservice
      .getTotalAmount(
        this.projectId,
        this.stageId,
        '',
        '',
        0,
        '',
        0,
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
          this.formattedTotalAmount = data.formatedAmount;
          console.log(this.totalAmount);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  navigateToPaymentDetails(status1: string, status2: string, status3?: string) {
    console.log(status1, status2, status3);
    const route = 'layout/crm/paymentdetails';
    this.getStatusIdByStatus(status1, status2, status3);
    console.log(this.paymentStatusValue);
    console.log(this.selectedUserManageIds);
    const state = {
      paymentStatusValue: this.paymentStatusValue,
      stageId: this.stageId,
      paymentTransactionTypeId: this.paymentTransactionTypeId,
      projectId: this.projectId,
      blockId: this.blockId,
      planId: this.planId,
      typeId: this.typeId,
      selectedUserManageIds: this.selectedUserManageIds,
      typeCommonReferenceDetailsId: this.typeCommonReferenceDetailsId,
      fromComponent: true,
    };
    console.log(state);
    this.router.navigate([route], {
      state: state,
    });
  }
  navigateToSaleAgreement(status: string) {
    const route = 'layout/crm/displaysaleagreement';
    this.getActionStatusIdByStatus(status);
    console.log(this.actionStatusValue);
    const state = {
      actionStatus: this.actionStatusValue,
      stageId: this.stageId,
      projectId: this.projectId,
      blockId: this.blockId,
      planId: this.planId,
      typeId: this.typeId,
      selectedUserManageIds: this.selectedUserManageIds,
      typeCommonReferenceDetailsId: this.typeCommonReferenceDetailsId,
      fromComponent: true,
      paymentTransactionTypeId: this.paymentTransactionTypeId,
    };
    this.router.navigate([route], {
      state: state,
    });
  }
  navigateToWaitingForApprovalAmount(status1: string) {
    console.log(this.paymentTransactionTypeId);
    const route = 'layout/crm/paymentledger';
    this.getActionStatusIdByStatusForAmount(status1);
    const state = {
      actionStatus: this.actionStatusValue,
      stageId: this.stageId,
      projectId: this.projectId,
      blockId: this.blockId,
      planId: this.planId,
      typeId: this.typeId,
      selectedUserManageIds: this.selectedUserManageIds,
      typeCommonReferenceDetailsId: this.typeCommonReferenceDetailsId,
      fromComponent: true,
      paymentTransactionTypeId: this.paymentTransactionTypeId,
    };
    this.router.navigate([route], {
      state: state,
    });
  }
  navigateToUnits(status: string) {
    console.log(this.paymentTransactionTypeId);
    const route = 'layout/project/unit';
    // this.getActionStatusIdByStatus(status);
    console.log(status);
    const state = {
      status: status,
      stageId: this.stageId,
      projectId: this.projectId,
      blockId: this.blockId,
      planId: this.planId,
      typeId: this.typeId,
      selectedUserManageIds: this.selectedUserManageIds,
      typeCommonReferenceDetailsId: this.typeCommonReferenceDetailsId,
      fromComponent: true,
      paymentTransactionTypeId: this.paymentTransactionTypeId,
    };
    this.router.navigate([route], {
      state: state,
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
                (stage: any) => stage.stageName + ' ( ' + stage.planCode + ' )'
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

  searchProject(event: any): void {
    if (event.target.value.length >= 3) {
      this.projectName = event.target.value;
    } else if (event.target.value.length === 0) {
      this.projectName = '';
      this.projectId = [];
    }
  }
  displayProject(project: IUserManageDto): string {
    return project && project.projectName ? project.projectName : '';
  }
  getAllDashBoardCount() {
    this.getTotalAmount();
    this.getTotalPendingAmount();
    this.getTotalPaidAmount();
    this.getWaitingForApprovalAmount();
    this.getUnitsCount();
    this.getSaleAgreementCount();
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

  getStatusIdByStatus(status1: string, status2: string, status3?: string) {
    console.log(status1, status2, status3);

    const completedStatus = this.paymentStatusNames.find(
      (status) => status.commonRefKey === status1
    );
    const partiallyPaidStatus = this.paymentStatusNames.find(
      (status) => status.commonRefKey === status2
    );
    const notPaidStatus = this.paymentStatusNames.find(
      (status) => status.commonRefKey === status3
    );
    this.paymentStatusValue = [];

    if (completedStatus) {
      this.paymentStatusValue.push(completedStatus);
    }
    console.log(completedStatus);
    if (partiallyPaidStatus) {
      this.paymentStatusValue.push(partiallyPaidStatus);
    }
    if (notPaidStatus) {
      this.paymentStatusValue.push(notPaidStatus);
    }
    console.log(partiallyPaidStatus);
  }
  getActionStatusIdByStatus(status1: string) {
    console.log(status1);
    console.log(this.actionStatusNames);

    this.actionStatusValue = this.actionStatusNames.find(
      (status) => status.commonRefValue == status1
    );
    console.log(this.actionStatusValue);
  }
  getActionStatusIdByStatusForAmount(status1: string) {
    console.log(status1);
    console.log(this.actionStatusNamesForAmount);

    this.actionStatusValue = this.actionStatusNamesForAmount.find(
      (status) => status.commonRefValue == status1
    );
    console.log(this.actionStatusValue);
  }
  getTransactionType() {
    this.commonReferenceDetailsService
      .getTransactionType(TRANSACTION_TYPE)
      .subscribe(
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
            this.getAllDashBoardCount();
            console.log(this.transactionTypeAsPayment);
            console.log(this.paymentTransactionTypeId);
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
  // onBlockSelect(event: any) {
  //   if (event.option.value.id == this.blockId) {
  //     console.log('Same Block selected {}');
  //     return;
  //   }
  //   this.blockId = event.option.value.id;
  //   console.log(this.blockId);
  //   this.planId = 0;
  //   this.stageId = 0;
  //   this.paymentPlan.setValue(null);
  //   this.stageFc.setValue(null);
  //   this.planId = 0;
  //   this.stageId = 0;
  //   this.fetchPaymentPlans();
  //   this.getAllStages();
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
  //     this.blockId = 0;
  //     this.paymentPlan.setValue(null);
  //     this.stageFc.setValue(null);
  //     paymentPlanAuto.options.forEach((option) => option.deselect());
  //     stageAuto.options.forEach((option) => option.deselect());
  //     this.planId = 0;
  //     this.stageId = 0;
  //     this.fetchPaymentPlans();
  //     this.getAllStages();
  //     this.getAllDashBoardCount();
  //   }
  //   this.fetchBlocks();
  // }

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

  displayPaymentPlan(paymentPlan: IPaymentPlan): string {
    return paymentPlan && paymentPlan.planName
      ? paymentPlan.planName + ' ( ' + paymentPlan.projectCode + ' )'
      : '';
  }

  searchPaymentPlan(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.planName = query;
      this.fetchPaymentPlans();
      // this.getAllStages();
    } else if (query.length == 0) {
      this.planName = '';
      this.stageFc.setValue(null);
      this.stageName = '';
      this.stageId = [];
      this.planId = 0;
      // this.getAllDashBoardCount();
      // this.getAllStages();
      // this.fetchPaymentPlans();
    }
  }
  getSaleAgreementCount() {
    console.log(this.paymentTransactionTypeId);
    this.dashboardservice
      .getSaleAgreementsCount(
        this.projectId,
        this.blockId,
        STAGE_STATUS,
        this.typeId
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.pendingSaleAgreementCount = data.pendingSaleAgreementCount;
          this.waitingForApprovalSaleAgreementCount = data.saleAgreementCount;
          this.reworkSaleAgreementCount = data.reworkSaleAgreementCount;
          console.log(this.pendingSaleAgreementCount);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  getWaitingForApprovalAmount() {
    console.log(this.paymentTransactionTypeId);
    this.dashboardservice
      .getwaitingForApprovalAmount(
        this.projectId,
        this.blockId,
        0,
        STAGE_STATUS,
        false,
        this.planId,
        this.typeId
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.formattedWaitingForApprovalAmount =
            data.formattedWaitingForApprovalAmount;
          console.log(this.pendingSaleAgreementCount);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  getActionStatus() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(
        SALE_AGREEMENT_STATUS,
        this.paymentStatusName
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.actionStatusNames = data;
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  getActionStatusforAmount() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(
        ACTION_STATUS,
        this.paymentStatusName
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.actionStatusNamesForAmount = data;
          console.log(this.actionStatusNames);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  getUnitsCount() {
    console.log(this.paymentTransactionTypeId);
    console.log(this.selectedprojectIds);
    this.dashboardservice
      .getUnitsCount(this.projectId, this.blockId, this.stageId)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.bookedCount = data.bookedCount;
          this.blockedCount = data.blockedCount;
          this.availableCount = data.availableCount;
          console.log(this.pendingSaleAgreementCount);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  searchUser(event: any) {
    if (event.target.value.length >= 3 || event.target.value.length == 0) {
      this.userName = event.target.value;
      this.fetchUser();
    }
  }
  fetchUser() {
    this.userService
      .getUserByManagerId(this.Mainuser.userId, this.userName)
      .subscribe({
        next: (UserDetails) => {
          this.UserDetails = UserDetails;
        },
        error: (error) => {
          console.error('Error fetching UserDetails:', error);
        },
      });
  }
  onUserSelect(event: any) {
    this.userId = event.option.value.userId;
    this.login.identifier = event.option.value.email;
    this.login.password = event.option.value.showPassword;

    this.userService.login(this.login).subscribe({
      next: (response) => {
        this.user = response.userDto;
        // Swal.fire('Login!', 'success');
        this.authService.setUser(JSON.stringify(this.user));
        this.authService.setRole(this.user.roleName);
        this.authService.setAccessToken(response.accessToken);
        this.authService.setRefreshToken(response.token);
        console.log(this.user.homePath);
        this.navigateToDashBoard(this.user.homePath);
      },
      error: (err) => {
        if (err.status === 0) {
          Swal.fire('Failed', 'Failed to connect to server', 'error');
        } else if (err.status === 403 || err.status == 401) {
          Swal.fire('Failed', 'Invalid Credentials', 'error');
        } else {
          Swal.fire('Failed', 'An unexpected error occurred', 'error');
        }
        console.error('Failed to fetch:', err);
      },
    });
  }
  private navigateToDashBoard(homePath: string) {
    this.authService.setDashBoardPath(homePath);
    this.router.navigate(['/layout']).then(() => {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe(() => {
          window.location.reload();
        });
    });
  }
  displayUser(user: User): string {
    return user && user.userName ? user.userName : '';
  }
  resetAutoInput() {
    this.project.reset(); // Clear input
    this.block.reset(); // Clear input
    this.blockId = []; // Clear selected IDs'
    this.projectId = []; // Clear selected IDs
    this.selectedBlockIds = []; // Clear selected IDs
    this.selectedprojectIds = []; // Clear selected IDs
    this.selectedPaymentPlanIds = [];
    this.selectedUserManageIds = [];
    this.paymentPlans = [];
    this.allBlockSelected!.checked = false; // Uncheck 'All'
    this.paymentPlan.reset();
    this.stageFc.reset();
    this.selectedStageIds = [];
    this.planId = [];
    this.stageId = [];
    this.blocks = [];
    this.paymentPlans = [];
    this.stages = [];
    this.fromComponent = false;
    this.getUserManageTypes();
    this.typeId = 0;
    this.getCompanyTypes();
  }
  getDetailsFromState() {
    const state = history.state;
    this.stageId = history.state.stageId;
    this.blockId = history.state.blockId;
    this.planId = history.state.planId;
    this.projectId = history.state.projectId;
    this.selectedUserManageIds = history.state.selectedUserManageIds;
    this.typeCommonReferenceDetailsId =
      history.state.typeCommonReferenceDetailsId;
    console.log(state);
    this.fromComponent = history.state.fromComponent;
    if (history.state.typeId > 0) {
      this.typeId = history.state.typeId;
    }
    this.paymentTransactionTypeId = history.state.paymentTransactionTypeId || 0;
    console.log('From component:', this.fromComponent);
    if (state) {
      if (this.selectedUserManageIds?.length > 0) {
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
        console.log(this.stageId);
        this.patchStateStageIds(this.stageId);
      }
      this.getAllDashBoardCount();
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
          this.selectedStatus = allOption;
          console.log(this.companyType);
        },
        error: (error: any) => {
          console.error('Error fetching Company Types :', error);
        },
      });
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
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
      this.getAllDashBoardCount();
    } else {
      this.block.setValue(null);
      this.paymentPlan.setValue(null);
      this.stageFc.setValue(null);
      this.blocks = [];
      this.paymentPlans = [];
      this.stages = [];
      this.fromComponent = false;
      this.getUserManageTypes();
    }
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
            .map((stage: any) => stage.planName + ' ( ' + stage.planCode + ' )')
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
      this.fetchBlocks();
    } else if (event.target.value.length === 0) {
      this.blockName = '';
      this.blockId = 0;
    }
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
        // --- Deselect related stages for removed payment plans ---
        if (
          this.selectedStageIds?.length > 0 &&
          relatedPaymentPlanIds.length > 0
        ) {
          const relatedStageIds = this.selectedStages
            .filter((stage: any) =>
              relatedPaymentPlanIds.includes(stage.planId)
            )
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
                (stage: any) => stage.planName + ' ( ' + stage.planCode + ' )'
              )
              .join(', ');
            this.stageFc.patchValue(selectedStageNames);
          } else {
            this.stageFc.patchValue('');
          }
          this.displayStageNames();
        }
      }
      if (this.selectedBlockIds?.length > 0) {
        this.displayBlockNames();
      } else {
        this.block.patchValue('');
      }
    }
  }
  onBlockSelectButtonClick() {
    this.blockId = this.selectedBlockIds;
    if (this.blockId.length > 0) {
      this.fetchPaymentPlans();
      this.getTransactionType();
    } else {
      this.block.setValue(null);
      this.paymentPlan.setValue(null);
      this.stageFc.setValue(null);
      this.paymentPlans = [];
      this.stages = [];
      this.fromComponent = false;
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
          if (this.blockId.length > 0) {
            this.fetchPaymentPlans();
          }
        },
      });
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
    this.paymentPlan.patchValue('');
    const selectedpaymentPlan = paymentPlan.id;
    if (event.checked) {
      if (!this.selectedPaymentPlanIds) this.selectedPaymentPlanIds = [];
      if (!this.selectedPaymentPlans) this.selectedPaymentPlans = [];
      if (!this.selectedPaymentPlanIds.includes(selectedpaymentPlan)) {
        this.selectedPaymentPlanIds.push(selectedpaymentPlan);
        this.selectedPaymentPlans.push(paymentPlan);
      }
      this.displayPaymentPlanNames();
    } else {
      this.selectedPaymentPlanIds = this.selectedPaymentPlanIds?.filter(
        (id: any) => id !== selectedpaymentPlan
      );
      this.selectedPaymentPlans = this.selectedPaymentPlans?.filter(
        (plan: any) => plan.id !== selectedpaymentPlan
      );
      // Deselect related stages
      if (this.selectedStageIds?.length > 0) {
        const relatedStageIds = this.selectedStages
          .filter((stage: any) => stage.planId === selectedpaymentPlan)
          .map((stage: any) => stage.stageId);

        this.selectedStageIds = this.selectedStageIds.filter(
          (id: any) => !relatedStageIds.includes(id)
        );
        this.selectedStages = this.selectedStages.filter(
          (stage: any) => !relatedStageIds.includes(stage.stageId)
        );
        this.stageId = [...this.selectedStageIds];
        if (this.selectedStages.length > 0) {
          const selectedNames = this.selectedStages
            .map(
              (stage: any) => stage.stageName + ' ( ' + stage.planCode + ' )'
            )
            .join(', ');
          this.stageFc.patchValue(selectedNames);
        } else {
          this.stageFc.patchValue('');
        }
        this.displayStageNames();
      }
      if (this.selectedPaymentPlanIds?.length > 0) {
        this.displayPaymentPlanNames();
      } else {
        this.paymentPlan.patchValue('');
      }
    }
  }
  displayPaymentPlanNames() {
    this.paymentPlanService
      .getAllPaymentPlansByProjectId(
        this.selectedprojectIds,
        this.selectedBlockIds,
        this.selectedPaymentPlanIds
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paymentPlans: any) => {
          console.log(paymentPlans);
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
    this.getAllStages();
    this.getTransactionType();
  }
  patchStatePaymentPlanIds(selectedPaymentPlanIds?: number[]): void {
    this.paymentPlan.patchValue('');
    this.selectedPaymentPlanIds = selectedPaymentPlanIds;
    console.log(this.selectedPaymentPlanIds);
    this.paymentPlanService
      .getAllPaymentPlansByProjectId(
        this.selectedprojectIds,
        this.selectedBlockIds,
        this.selectedPaymentPlanIds
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
    console.log(stage);

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
            this.stages = this.sortStages(this.stages, this.selectedStageIds);
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
    this.stageId = this.selectedStageIds;
    this.getAllDashBoardCount();
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
