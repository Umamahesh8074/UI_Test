import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import {
  ACTION_STATUS,
  TRANSACTION_TYPE,
  TRANSACTION_TYPE_PAYMENT,
} from 'src/app/Constants/Crm/CrmConstants';
import { Block, IBlock } from 'src/app/Models/Block/block';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { IUnit, Unit } from 'src/app/Models/Project/unit';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { Login } from 'src/app/Models/User/Login';
import { User } from 'src/app/Models/User/User';
import { UserDto } from 'src/app/Models/User/UserDto';
import { AuthService } from 'src/app/Services/CommanService/auth.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { DashBoardService } from 'src/app/Services/CrmServices/crm-dashboard.service';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accounts-crm-dashboard',
  templateUrl: './accounts-crm-dashboard.component.html',
  styleUrls: ['./accounts-crm-dashboard.component.css'],
})
export class AccountsCrmDashboardComponent implements OnInit {
  today: any;
  actionStatusValue: any;
  stageId: number = 0;
  projectId: any;
  blockId: number = 0;
  planId: number = 0;
  formattedWaitingForApprovalAmount: string = '';
  actionStatusNamesForAmount: CommonReferenceType[] = [];
  block: any = new FormControl([] as IBlock[]);
  paymentTransactionTypeId: number = 0;
  pendingSaleAgreementCount: number = 0;
  UserDetails: UserDto[] = [];
  Mainuser: User = new User();
  userName: string = '';
  userId: number = 0;
  user: User = new User();
  public login: Login = new Login('', '');
  User: any = new FormControl([] as UserDto[]);
  blockName: string = '';
  private destroy$ = new Subject<void>();
  blocks: any;
  organizationId: number = 0;
  userManageData: any;
  transactionData: Map<string, CommonReferenceDetails> = new Map();
  transactionTypeAsPayment: CommonReferenceDetails =
    new CommonReferenceDetails();
  paymentStatusName: string = '';
  actionStatusNames: CommonReferenceType[] = [];
  unitName: string = '';
  units: Unit[] = [];
  unitId: number = 0;
  unit: any = new FormControl([] as Unit[]);
  selectedBlock: IBlock = new Block();
  selectedUnit: IUnit = new Unit();

  constructor(
    private router: Router,
    private dashboardservice: DashBoardService,
    private userService: UserService,
    private authService: AuthService,
    private blockService: BlockService,
    private usermanageService: UsermanageService,
    private commonReferenceDetailsService: CommonreferencedetailsService,
    private commonService: CommanService,
    private unitService: UnitService
  ) {}
  ngOnInit(): void {
    this.today = new Date().toDateString();
    const MainUser = localStorage.getItem('Mainuser');
    if (MainUser) {
      this.Mainuser = JSON.parse(MainUser);
      this.fetchUser();
    }
    this.setUserFromLocalStorage();
    this.getUsermanageByUserId();
    this.getActionStatusforAmount();
    this.getDetailsFromState();
  }
  getDetailsFromState() {
    this.blockId = history.state.blockId;
    this.unitId = history.state.unitId;
    console.log(this.blockId);
    console.log(this.unitId);
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
          this.getAllDashBoardCount();
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
          this.getAllDashBoardCount();
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
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
  private getUsermanageByUserId(): void {
    console.log(this.userId);
    this.usermanageService.getUserManage(this.userId).subscribe({
      next: (response) => {
        console.log('User manage data:', response);
        this.userManageData = response;
        this.projectId = response[0].projectId;
        console.log(this.projectId);
        this.fetchBlocks();
        this.getTransactionType();
      },

      error: (err) => {
        // Handle the error here
        console.error('Error fetching user manage data:', err);
      },
    });
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
  navigateToWaitingForApprovalAmount(status1: string) {
    const route = 'layout/crm/customerpaymentapproval';
    this.getActionStatusIdByStatusForAmount(status1);
    const state = {
      actionStatus: this.actionStatusValue,
      projectId: this.projectId,
      blockId: this.blockId,
      unitId: this.unitId,
    };
    this.router.navigate([route], {
      state: state,
    });
  }
  getActionStatusIdByStatusForAmount(status1: string) {
    console.log(status1);
    console.log(this.actionStatusNamesForAmount);
    this.actionStatusValue = this.actionStatusNamesForAmount.find(
      (status) => status.commonRefValue == status1
    );
    console.log(this.actionStatusValue);
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
  resetAutoInput(blockAuto: MatAutocomplete, unitAuto: MatAutocomplete) {
    this.block.reset();
    this.unit.reset();
    blockAuto.options.forEach((option) => option.deselect());
    unitAuto.options.forEach((option) => option.deselect());
    this.block.setValue(null);
    this.unit.setValue(null);
    this.blockId = 0;
    this.unitId = 0;
    this.fetchUnits(this.projectId, this.blockId);
    this.getAllDashBoardCount();
  }
  getAllDashBoardCount() {
    this.getWaitingForApprovalAmount();
  }
  getWaitingForApprovalAmount() {
    console.log(this.paymentTransactionTypeId);
    this.dashboardservice
      .getwaitingForApprovalAmount(this.projectId, this.blockId, this.unitId,'',true)
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
  searchBlock(event: any) {
    const query = event.target.value;
    this.blockName = query;
    if (query.length == 0) {
      this.blockId = 0;
      this.unit.setValue(null);
      this.unitId = 0;
      this.unitName = '';
      this.fetchUnits(this.projectId, this.blockId);
      this.getAllDashBoardCount();
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
    this.getAllDashBoardCount();
  }
  displayBlock(block: IBlock) {
    return block && block.name ? block.name : '';
  }
  searchUnit(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.unitName = query;
      this.fetchUnits(this.projectId, this.blockId);
      this.getAllDashBoardCount();
    } else if (query.length == 0) {
      this.unitName = '';
      this.unitId = 0;
      this.unit.setValue(null);
      this.fetchUnits(this.projectId);
      this.getAllDashBoardCount();
    }
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
    console.log(event);
    this.unitId = event.option.value.id;
    console.log(this.unitId);
    this.getAllDashBoardCount();
  }
  displayUnit(unit: Unit): string {
    return unit && unit.unitName ? unit.unitName : '';
  }
}
