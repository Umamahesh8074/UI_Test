import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import {
  COMPANY_TYPE,
  PAGE_INDEX,
  searchTextLength,
  searchTextZero,
} from 'src/app/Constants/CommanConstants/Comman';
import { IProject, Project } from 'src/app/Models/Project/project';
import { IUnit, IUnitType, Unit, UnitType } from 'src/app/Models/Project/unit';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { DisplayCustomerStagesComponent } from '../displayCustomerStages/displayCustomerStages.component';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { IPaymentPlan, PaymentPlan } from 'src/app/Models/Project/PaymentPlan';
import { IStage, Stage } from 'src/app/Models/Project/stage';
import { Block, IBlock } from 'src/app/Models/Block/block';
import { PaymentPlanService } from 'src/app/Services/ProjectService/PaymentPlan/paymentPlan.service';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';
import { CRM_MEMBER_ROLL_NAME } from 'src/app/Constants/Crm/CrmConstants';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';

@Component({
  selector: 'app-displayBookingOverview',
  templateUrl: './displayBookingOverview.component.html',
  styleUrls: ['./displayBookingOverview.component.css'],
})
export class DisplayBookingOverviewComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() goToCustomerStages: EventEmitter<void> = new EventEmitter();
  selectedUnitTypeData: IUnit = new Unit();
  userManageData: any;
  destroy$ = new Subject<void>();
  selectedTabIndex: number = 0;
  projectName: string = '';
  projects: Project[] = [];
  units: Unit[] = [];
  projectId: any;
  project: any = new FormControl([] as IProject[]);
  unit: FormControl = new FormControl([] as Unit[]);
  organizationId: number = 0;
  name: string = '';
  firstApplicantName: string = '';
  pageIndex: number = 0;
  unitId: number = 0;
  unitName: string = '';
  selectedUnitType: string = '';
  commonRefValues: any;
  company: string = '';
  companyType: any;
  typeId: number = 0;
  paymentPlans: any[] = [];
  selectedPaymentPlan: IPaymentPlan = new PaymentPlan();
  stage: IStage = new Stage();
  paymentPlan: any = new FormControl([] as IPaymentPlan[]);
  planName: any;
  planId: any;
  blocks: any;
  blockName: string = '';
  blockId: number = 0;
  block: any = new FormControl([] as IBlock[]);
  selectedProject: IProject = new Project();
  roleName: string = '';
  bookingId: number = 0;
  @ViewChild(DisplayCustomerStagesComponent)
  displayCustomerStagesComponent!: DisplayCustomerStagesComponent;
  selectedUnitName: Unit = new Unit();
  pagination: any;
  pageSize: any;
  userId: number = 0;
  typeCommonReferenceDetailsId: number = 0;
  crmMemberRollName = CRM_MEMBER_ROLL_NAME;
  triggerRefresh: boolean = false;
  selectedBlock: IBlock = new Block();
  selectedUnit: Unit = new Unit();
  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.getDataFromState();
    if (CRM_MEMBER_ROLL_NAME.includes(this.roleName)) {
      this.getUsermanageByUserId();
    } else {
      this.fetchProjects();
    }
    // this.fetchProjects();
    this.getCompanyTypes();
    //this.getUsermanageByUserId();
  }

  constructor(
    public dialog: MatDialog,
    private projectService: ProjectService,
    private commanService: CommanService,
    private unitService: UnitService,
    private commonService: CommanService,
    private paymentPlanService: PaymentPlanService,
    private blockService: BlockService,
    private cdr: ChangeDetectorRef,
    private usermanageService: UsermanageService
  ) {}
  searchValue: string = '';
  getDataFromState() {
    const historyState = history.state;
    console.log(historyState.pageSize, historyState.pageIndex);
    console.log(this.firstApplicantName);
    if (historyState.firstApplicantName != undefined) {
      this.searchValue = historyState.firstApplicantName;
    }
    if (historyState.pageSize != undefined) {
      this.pageSize = historyState.pageSize;
    }
    if (historyState.pageIndex != undefined) {
      this.pageIndex = historyState.pageIndex;
    }
    if (history.state.blockId != undefined) {
      this.blockId = history.state.blockId;
      console.log(' blockId', this.blockId);
      this.fetchBlockById(this.blockId);
    }
    if (history.state.planId != undefined) {
      this.planId = history.state.planId;
      console.log('planId', this.planId);
      this.fetchPaymentPlanById(this.planId);
    }
    if (history.state.projectId != undefined) {
      this.projectId = history.state.projectId;
      console.log('projectId', this.projectId);
    }
    if (history.state.unitId != undefined) {
      this.unitId = history.state.unitId;
      console.log('unitId', this.unitId);
      this.fetchUnitById(this.unitId)
    }
    if (history.state.typeId != undefined) {
      this.typeId = history.state.typeId;
      console.log('typeId', this.typeId);
    }
    if (history.state.firstApplicantName != undefined) {
      this.firstApplicantName = history.state.firstApplicantName;
      console.log(this.firstApplicantName);
    }
    // Only restore unitName if blockId matches, otherwise clear it
    if (history.state.unitName !== undefined && history.state.blockId === this.blockId) {
      this.unitName = history.state.unitName;
    } else {
      this.unitName = '';
    }
  }
  onNavigateToCustomerStages(event: {
    bookingId: number;
    firstApplicantName: string;
    unitName: string;
    projectId: number;
    typeCommonReferenceDetailsId: number;
  }) {
    const {
      bookingId,
      firstApplicantName,
      unitName,
      projectId,
      typeCommonReferenceDetailsId,
    } = event;
    this.bookingId = bookingId;
    this.firstApplicantName = firstApplicantName;
    this.selectedTabIndex = 2;
    this.unitName = unitName;
    this.projectId = projectId;
    this.typeCommonReferenceDetailsId = typeCommonReferenceDetailsId;
    console.log('Booking ID:', this.bookingId);
    console.log('Booking ID:', this.unitId);
    console.log('First Applicant Name:', this.firstApplicantName);
    let names: string[] = [];
    if (this.firstApplicantName) {
      names.push(this.firstApplicantName);
    }
    this.searchValue = names.join(' ').trim();
    this.searchUnit(this.unitName);
    this.unitName = this.unitName;
    this.onSearch(this.searchValue);
  }
  private setUserFromLocalStorage(): void {
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      console.log(user.organizationId);
      this.organizationId = user.organizationId;
      this.roleName = user.roleName;
      this.userId = user.userId;
      console.log(this.userId);
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
        this.typeCommonReferenceDetailsId =
          response[0].typeCommonReferenceDetailsId;
        console.log(this.typeCommonReferenceDetailsId);
        this.fetchBlocks();
      },
      error: (err) => {
        // Handle the error here
        console.error('Error fetching user manage data:', err);
      },
    });
  }

  // private patchFormData(data: any): void {
  //   console.log(data);
  //   const unitId = data.unitId;
  //   this.fetchUnitsById(unitId);
  //   console.log(data.toString + 'data for update');

  // }

  fetchProjects() {
    this.projectService
      .getProjectsByOrgIdWithProjectFilter(
        this.organizationId,
        '',
        this.projectName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          // const allOption = new Project();
          // allOption.projectId = 0;
          // allOption.projectName = 'All';
          this.projects = projects;
          this.triggerRefresh = !this.triggerRefresh;
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  displayProject(project: IProject) {
    return project && project.projectName ? project.projectName : '';
  }
  onProjectSelect(event: any) {
    console.log(event.option.value);
    this.block.setValue(null);
    this.paymentPlan.setValue(null);
    this.unit.setValue(null);
    this.unitName = '';
    this.blockId = 0;
    this.blockName = '';
    this.selectedProject = event.option.value;
    this.projectName = event.option.value.projectName;
    this.projectId = event.option.value.projectId;
    this.fetchBlocks();
    this.fetchPaymentPlans();
    this.fetchUnits();
    // this.getAllApplicantInfos()
  }
  searchProject(project: any) {
    const query = project.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.projectName = query;
      this.fetchProjects();
    }
    if (query.length === searchTextZero) {
      this.projectId = 0;
      this.blockId = 0;
      this.unitId = 0;
      this.fetchUnits();
      this.fetchBlocks();
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
          this.selectedUnitName = response[0];
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  fetchUnits() {
    console.log(this.unitName );
    
    this.unitService
      .getAllUnitsBasedOnProjectId(this.projectId, this.unitName, this.blockId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.units = data;
          console.log(data);
          // const allOption = new Unit();
          // this.unit.setValue(allOption);
          // allOption.id = 0;
          // allOption.unitName = 'All';
          // this.units = [allOption, ...data];
          this.units = data;
        },
        error: (error: Error) => {
          console.error('Error fetching units:', error);
        },
      });
  }
  onUnitSelect(event: any) {
    console.log(event.option.value);
    this.unitName = event.option.value.unitName;
    this.unitId = event.option.value.id;
    console.log(this.unitId);
    this.pageIndex = PAGE_INDEX;
  }
  displayUnit(unit: Unit): string {
    return unit && unit.unitName ? unit.unitName : '';
  }
  searchUnit(event: any): void {
    console.log(event);
    const query = event.target.value;
    this.unitName = query;
    console.log(this.unitName);

    this.fetchUnits();
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
  onSearch(customerName: string) {
    if (
      customerName.length >= searchTextLength ||
      customerName.length === searchTextZero
    ) {
      this.firstApplicantName = customerName.trim() || '';
      // this.pageIndex = PAGE_INDEX;
    }
  }
  fetchBlocks() {
    this.blockService
      .getBlocks(this.projectId, this.blockName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blocks) => {
          this.blocks = blocks;
          console.log(blocks);
          // const allOption = new Block();
          // this.block.setValue(allOption);
          // allOption.id = 0;
          // allOption.name = 'All';
          this.blocks = blocks;
        },
        error: (error: Error) => {
          console.error('Error fetching blocks:', error);
        },
      });
  }
  onBlockSelect(event: any) {
    this.blockId = 0;
    this.planId = 0;
    this.unitId = 0;
    console.log(event.option.value);

    if (event.option.value.id == this.blockId) {
      console.log('Same Block selected {}');
      return;
    }
    this.blockId = event.option.value.id;
    this.blockName = event.option.value.name;
    this.pageIndex = PAGE_INDEX;
    this.unitName = '';
    this.unit.setValue(''); // Clear the unit input field as well
    this.triggerRefresh = !this.triggerRefresh; // Toggle to force child update
    console.log(this.blockId);
    console.log("UnitName in booking overview "+this.unitName);
    this.paymentPlan.setValue(null);
    // this.unit.setValue(null);  // Already set above
    this.cdr.detectChanges();
    this.fetchUnits();
    this.fetchPaymentPlans();
  }
  displayBlock(block: IBlock) {
    return block && block.name ? block.name : '';
  }
  searchBlock(event: any) {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.blockId = event.target.value.id;
      this.blockName = query;
      this.planId = 0;
      this.planName = '';
      this.unitId = 0;
      this.unitName = '';
      this.paymentPlan.setValue(null);
      this.unit.setValue(null);
      this.fetchBlocks();
    }
    if (query.length === searchTextZero) {
      this.blockId = 0;
      this.unitId = 0;
      this.planId = 0;
      // this.fetchPaymentPlans();
      // this.fetchUnits();
      this.fetchBlocks();
    }
  }

  fetchPaymentPlans() {
    console.log(this.projectId);
    console.log(this.blockId);
    this.paymentPlanService
      .getAllPaymentPlansByProjectId(this.projectId, this.blockId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (paymentPlans) => {
          this.paymentPlans = paymentPlans;
          // const allOption = new PaymentPlan();
          // this.paymentPlan.setValue(allOption);
          // allOption.id = 0;
          // allOption.planName = 'All';
          // this.paymentPlans = [allOption, ...paymentPlans];
        },
        error: (error: Error) => {
          console.error('Error fetching payment Plans:', error);
        },
      });
  }
  onPaymentPlanSelect(event: any) {
    const selectedPaymentPlan = event.option.value;
    console.log('Selected Payment Plan:', selectedPaymentPlan);
    this.planName = event.option.value.planName;
    console.log(this.planName);
    this.planId = event.option.value.id;
    console.log(this.planId);
    // this.stageFc.setValue(null);
    // this.getAllStages();
  }

  displayPaymentPlan(paymentPlan: IPaymentPlan): string {
    return paymentPlan && paymentPlan.planName ? paymentPlan.planName : '';
  }

  searchPaymentPlan(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.planName = query;
      this.planId = event.target.value.id;
      this.fetchPaymentPlans();
    } else if (query.length == 0) {
      this.planName = '';

      this.fetchPaymentPlans();
    }
    // this.getAllStages();
  }

  refreshChildComponent() {
    if (this.displayCustomerStagesComponent) {
      this.displayCustomerStagesComponent.getAllCustomerStages();
    }
  }
  private fetchUnitById(unitId: number) {
    this.unitService
      .getUnitByUnitId(unitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedUnit = data;
          this.unit.setValue(this.selectedUnit);
        },
        error: (error: Error) => {},
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
        },
        error: (error: Error) => {},
      });
  }
  private fetchPaymentPlanById(blockId: number) {
    this.paymentPlanService
      .getPaymentPlanById(blockId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedPaymentPlan = data;
          this.paymentPlan.setValue(this.selectedPaymentPlan);
        },
        error: (error: Error) => {},
      });
  }
}
