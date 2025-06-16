import { CurrencyPipe, formatDate } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { TIME_OUT } from 'src/app/Constants/CommanConstants/Comman';
import {
  NAVIGATE_TO_DISPLAY_PAYMENT_DETAILS,
  PAYMENT_SOURCE,
  PAYMENT_TYPE,
} from 'src/app/Constants/Crm/CrmConstants';
import { Block, IBlock } from 'src/app/Models/Block/block';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import {
  ApplicantInfo,
  ApplicationInfoDto,
  IApplicantInfo,
  IApplicantInfoDto,
} from 'src/app/Models/Crm/ApplicantInfo';
import { CustomerStages } from 'src/app/Models/Project/customerStages';
import { ILevel, Level } from 'src/app/Models/Project/level';
import { IProject, Project } from 'src/app/Models/Project/project';
import { Unit, UnitType } from 'src/app/Models/Project/unit';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ApplicationInfoService } from 'src/app/Services/CrmServices/applicant-info.service';
import { CustomerStageService } from 'src/app/Services/CrmServices/customer-stages.service';
import { PaymentDetailsService } from 'src/app/Services/CrmServices/payment-details.service';
import { ProjectChargeService } from 'src/app/Services/CrmServices/project-charge.service';
import { BlockService } from 'src/app/Services/ProjectService/Block/block.service';
import { LevelService } from 'src/app/Services/ProjectService/Level/level.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { StageService } from 'src/app/Services/ProjectService/Stage/stage.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { UnitTypeService } from 'src/app/Services/ProjectService/UnitType/unittype.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css'],
  providers: [CurrencyPipe],
})
export class PaymentDetailsComponent implements OnInit {
  organizationId: number = 0;
  projectName: string = '';
  projectsData: Project[] = [];
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  selectedProject: IProject = new Project();
  formData!: FormGroup;
  projectId: any;
  projectFc: FormControl = new FormControl([] as Project[]);
  applicantDetails: any;
  applicantName: string = '';
  applicantId: number = 0;
  applicantFc: FormControl = new FormControl([] as ApplicantInfo[]);
  bookingId: number = 0;
  customerStageDetails: CustomerStages[] = [];
  paymentName: string = '';
  paymentTypes: CommonReferenceType[] = [];
  paymentTypeId: any;
  sourceName: string = '';
  paymentSources: CommonReferenceType[] = [];
  paymentSourceId: number = 0;
  selectedPaymnetMode: CommonReferenceType = new CommonReferenceType();
  selectedPaymnetSource: CommonReferenceType = new CommonReferenceType();
  paymentTypeModeFc: FormControl = new FormControl([] as CommonReferenceType[]);
  paymentTypeSourceFc: FormControl = new FormControl(
    [] as CommonReferenceType[]
  );
  stageName: string = '';
  stageId: number = 0;
  stageFc: FormControl = new FormControl([] as CustomerStages[]);
  selectedStage: CustomerStages = new CustomerStages();
  totalPrice: any;
  paymentDetails: any;
  selectedApplicant: IApplicantInfo = new ApplicantInfo();
  blockData: Block[] = [];
  blockId: number = 0;
  blockName: string = '';
  levelData: Level[] = [];
  levelId: number = 0;
  levelName: string = '';
  unitName: string = '';
  unitData: any;
  unitId: any;
  unitTypeData: UnitType[] = [];
  selectedBlock: IBlock = new Block();
  selectedLevel: ILevel = new Level();
  selectedUnit: Unit = new Unit();
  @ViewChild('checkFileInput') checkFileInput!: ElementRef;
  fileNames: any = {
    check: null,
  };
  fileErrors: any = {
    check: null,
  };
  paidAmount: number = 0;
  formattedBalance: string = '';

  constructor(
    private router: Router,
    private builder: FormBuilder,
    private commonService: CommanService,
    private commonRefDetailsService: CommonreferencedetailsService,
    private toastrService: ToastrService,
    private projectService: ProjectService,
    private projectChargeService: ProjectChargeService,
    private levelService: LevelService,
    private applicantInfoService: ApplicationInfoService,
    private customerStageService: CustomerStageService,
    private paymentDetailsService: PaymentDetailsService,
    private blockService: BlockService,
    private unitService: UnitService,
    private decimalPipe: DecimalPipe,
    private stageService: StageService,
    private currencyPipe: CurrencyPipe
  ) {}
  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.initializeFormData();
    this.getDataFromState();
    this.getProjects();
    this.getPaymentSources();
    this.getPaymentTypes();
    let initialBalanceAmount = this.formData.get('balanceAmount')?.value || 0;

    this.formData.get('paidAmount')?.valueChanges.subscribe((paidAmount) => {
      paidAmount = paidAmount || 0;
      const newBalanceAmount = initialBalanceAmount - paidAmount;
      console.log(paidAmount);
      console.log(newBalanceAmount);

      this.formData.patchValue(
        {
          balanceAmount: newBalanceAmount >= 0 ? newBalanceAmount : 0,
        },
        { emitEvent: false }
      );

      console.log(
        'Paid Amount:',
        paidAmount,
        'Balance Amount:',
        newBalanceAmount
      );
      // this.formattedBalance = this.currencyPipe.transform(
      //   newBalanceAmount >= 0 ? newBalanceAmount : 0,
      //   // 'INR'
      // ) || '0.00';
    });
  }

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
    }
  }
  private initializeFormData(): void {
    this.formData = this.builder.group({
      paymentDetailsId: [0],
      applicantId: ['', []],
      paymentTypeId: ['', []],
      paymentDate: ['', [Validators.required, this.noFutureDateValidator]],
      bankName: ['', [Validators.required]],
      branchName: ['', [Validators.required]],
      projectId: ['', []],
      ifcCode: ['', Validators.required],
      paidAmount: ['', Validators.required],
      balanceAmount: [''],
      stageId: [''],
      sourceId: [],
      referenceNumber: ['', Validators.required],
      stageTotalAmount: ['', []],
      unitTypeName: [],
      status: ['A'],
      stageTds: [''],
      pendingTds: [''],
      paidTds: [''],
      accountNumber: [
        ,
        [
          Validators.required,
          Validators.pattern(/^\d+$/), // Only digits
          Validators.minLength(9), // Minimum 9 digits
          Validators.maxLength(18), // Maximum 18 digits
        ],
      ],
    });
  }
  private getDataFromState() {
    const {
      paymentDetailsData,
      isAdding,
      projectId,
      blockId,
      levelId,
      unitId,
      // stageTotalAmount,
      stageTds,
    } = history.state;
    console.log(paymentDetailsData);
    this.isAdding = history.state.isAdding;
    this.paymentDetails = paymentDetailsData || this.paymentDetails;
    this.projectId = projectId;
    console.log('projectId from state' + projectId);

    this.levelId = levelId;
    this.blockId = blockId;
    this.unitId = unitId;
    this.paymentDetails.stageTds = stageTds;
    // this.paymentDetails.stageTotalAmount = stageTotalAmount;
    // console.log('State Data:', history.state); // Check all data passed in the state
    // console.log("swathi***********",stageTotalAmount )
    this.paidAmount = paymentDetailsData.paidAmount || 0;
    console.log(this.paidAmount);

    this.patchFormDataWithPaymentDetailsData();
  }

  private patchFormDataWithPaymentDetailsData() {
    console.log(this.paymentDetails);
    console.log(this.isAdding);
    this.paymentDetails.pendingAmount;
    this.formData.patchValue({
      balanceAmount: this.paymentDetails.balanceAmount,
      stageTotalAmount: this.paymentDetails.stageTotalAmount || '',
      stageTds: this.paymentDetails.stageTds,
    });
    if (!this.isAdding) {
      this.formData.patchValue(this.paymentDetails);
      console.log(this.paymentDetails);
      this.formData.patchValue({
        paymentDetailsId: this.paymentDetails.paymentDetailsId,
      });
      if (this.paymentDetails.sourceId) {
        this.fetchPaymentSourceById(this.paymentDetails.sourceId);
      }
      if (this.paymentDetails.paymentTypeId) {
        this.fetchPaymentModeById(this.paymentDetails.paymentTypeId);
      }
      this.formData.patchValue({
        balanceAmount: this.paymentDetails.balanceAmount,
        // stageTotalAmount: this.paymentDetails.stageTotalAmount || '',
        stageTds: this.paymentDetails.stageTds,
      });
    }

    console.log(this.formData);

    if (this.projectId != null) {
      console.log(this.projectId);
      this.fetchProjectById(this.projectId);
    }
    if (this.paymentDetails.applicantId) {
      this.applicantId = this.paymentDetails.applicantId;
      console.log(this.paymentDetails.applicantId);
      if (this.applicantId != null) {
        console.log(this.applicantId);
        this.fetchApplicantById(this.applicantId);
      }
    }
    if (this.paymentDetails.stageId) {
      this.stageId = this.paymentDetails.stageId;
      console.log(this.paymentDetails.stageId);
      if (this.stageId != null) {
        console.log(this.applicantId);
        this.fetchStagesById(this.stageId);
      }
    }

    if (this.blockId != null) {
      console.log(this.blockId);
      this.fetchBlockById(this.blockId);
    }
    if (this.levelId != null) {
      console.log(this.levelId);
      this.fetchLevelById(this.levelId);
    }
    if (this.unitId != null) {
      console.log(this.unitId);
      this.fetchUnitById(this.unitId);
    }
    console.log(
      'updating paymentDetailsId...' + this.paymentDetails.stageTotalAmount
    );

    console.log(this.formData);
  }
  getProjects() {
    this.projectService
      .getProjects(this.projectName, this.organizationId)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.projectsData = data;
          console.log(this.projectsData);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  getBlocksBasedOnProjectId() {
    console.log(this.projectId);

    this.blockService.getBlocks(this.projectId, this.blockName).subscribe({
      next: (data) => {
        console.log(data);
        this.blockData = data;
        console.log(this.blockData);
      },
      error: (error: any) => {
        console.error('Error fetching Project Charge Charge Ins :', error);
      },
    });
  }
  onProjectSelect(event: any) {
    console.log('dfghjkertyuio');
    console.log(event);

    console.log(event.option.value);
    if (event?.option?.value) {
      this.projectId = event.option.value.projectId;
      console.log(this.projectId);

      this.formData.patchValue({ projectId: this.projectId });
      console.log(this.formData);
      this.getBlocksBasedOnProjectId();
    }
  }
  searchProject(event: any): void {
    const query = event.target.value;
    this.projectName = query;
    this.getProjects();
  }
  displayProject(project: Project): string {
    return project && project.projectName ? project.projectName : '';
  }
  displayBlock(block: Block): string {
    return block && block.name ? block.name : '';
  }
  displayLevel(level: Level): string {
    return level && level.name ? level.name : '';
  }
  onBlockSelect(event: any) {
    console.log('dfghjkertyuio');
    console.log(event);

    console.log(event.option.value);
    if (event?.option?.value) {
      this.blockId = event.option.value.id;
      console.log(this.blockId);

      this.formData.patchValue({ blockId: this.blockId });
      console.log(this.formData);
      this.getLevelsBasedOnBlockId();
    }
  }
  searchBlock(event: any): void {
    const query = event.target.value;
    this.blockName = query;
    this.getBlocksBasedOnProjectId();
  }
  getLevelsBasedOnBlockId() {
    console.log(this.blockId);
    this.levelService.getLevels(this.blockId, this.levelName).subscribe({
      next: (data) => {
        console.log(data);
        this.levelData = data;
        console.log(this.levelData);
      },
      error: (error: any) => {
        console.error('Error fetching Project Charge Charge Ins :', error);
      },
    });
  }
  onLevelSelect(event: any) {
    console.log('dfghjkertyuio');
    console.log(event);
    console.log(event.option.value);
    if (event?.option?.value) {
      this.levelId = event.option.value.levelId;
      console.log(this.levelId);

      this.formData.patchValue({ levelId: this.levelId });
      console.log(this.formData);
      this.getUnitsBasedOnLevelId();
    }
  }
  searchLevel(event: any): void {
    const query = event.target.value;
    this.levelName = query;
    this.getLevelsBasedOnBlockId();
  }
  getUnitsBasedOnLevelId() {
    console.log(this.levelId);
    this.unitService
      .getUnitsBasedOnLevelId(this.levelId, this.unitName)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.unitData = data;
          console.log(this.unitData);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  onUnitSelect(event: any) {
    console.log('dfghjkertyuio');
    console.log(event);

    console.log(event.option.value);
    if (event?.option?.value) {
      this.unitId = event.option.value.id;
      console.log(this.unitId);

      this.formData.patchValue({ unitId: this.unitId });
      console.log(this.formData);
      this.getApplicantsByProjectId();
    }
  }
  displayUnit(unit: any): string {
    return unit && unit.unitName ? unit.unitName : '';
  }
  searchUnit(event: any): void {
    const query = event.target.value;
    this.unitName = query;
    this.getUnitTypeByUnitId();
  }
  getUnitTypeByUnitId() {
    console.log(this.unitId);
    this.unitService.getUnitTypeByUnitId(this.unitId).subscribe({
      next: (data) => {
        console.log(data);
        this.unitTypeData = data;
        console.log(this.unitTypeData);
        this.formData.patchValue({ unitTypeName: data.name });
      },
      error: (error: any) => {
        console.error('Error fetching Project Charge Charge Ins :', error);
      },
    });
  }

  private fetchProjectById(projectId: number) {
    this.projectService
      .getProjectById(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedProject = data;
          console.log(data);
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
          console.log(data);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  private fetchLevelById(levelId: number) {
    this.levelService
      .getLevelById(levelId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedLevel = data;
          console.log(data);
          console.log(this.selectedLevel);
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
          console.log(data);
          console.log(this.selectedUnit.unitName);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  clearForm() {
    this.formData.reset();
  }
  getApplicantsByProjectId() {
    console.log(this.projectId);
    this.applicantInfoService
      .getAllApplicantInfoByProjectIdAndUnitId(this.unitId, this.applicantName)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.applicantDetails = data;
          console.log(this.applicantDetails.basicPrice);

          console.log(this.applicantDetails);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  onApplicantSelectSelect(event: any) {
    console.log('dfghjkertyuio');
    console.log(event);
    console.log(event.option.value);
    if (event?.option?.value) {
      this.applicantId = event.option.value.bookingId;
      this.totalPrice = event.option.value.basicPrice;
      this.formData.patchValue({ applicantId: this.applicantId });
      console.log(this.formData);
      this.getStagesByCustomerId();
    }
  }
  searchApplicant(event: any): void {
    const query = event.target.value;
    this.applicantName = query;
    this.getApplicantsByProjectId();
  }
  displayApplicant(applicant: ApplicantInfo): string {
    return applicant && applicant.firstApplicantName
      ? applicant.firstApplicantName
      : '';
  }

  getStagesByCustomerId() {
    console.log('Booking Id:' + this.applicantId);
    this.customerStageService
      .getCustomerStagesByBookingId(this.applicantId, this.stageName)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.customerStageDetails = data;
          console.log(this.customerStageDetails);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  searchStage(event: any): void {
    const query = event.target.value;
    this.stageName = query;
    this.getStagesByCustomerId();
  }
  onStageSelectSelect(event: any) {
    console.log('dfghjkertyuio');
    console.log(event);
    console.log(event.option.value);
    if (event?.option?.value) {
      this.stageId = event.option.value.id;
      console.log(this.projectId);
      console.log(event.option.value.expectedAmount);

      this.formData.patchValue({ stageId: this.stageId });
      // this.formData.patchValue({
      //   stageTotalAmount: event.option.value.expectedAmount,
      // });
      console.log(this.formData);
    }
  }
  displayStage(stage: CustomerStages): string {
    return stage && stage.stageName ? stage.stageName : '';
  }
  getPaymentTypes() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(PAYMENT_TYPE, this.paymentName)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.paymentTypes = data;
          console.log(this.paymentTypes);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  searchPayments(event: any): void {
    const query = event.target.value;
    this.paymentName = query;
    this.getPaymentTypes();
  }
  onPaymentTypeSelect(event: MatAutocompleteSelectedEvent) {
    this.paymentTypeId = event.option.value.id;
    this.formData.patchValue({ paymentTypeId: this.paymentTypeId });
    console.log(this.formData);
  }
  displayPaymentMode(paymentType: CommonReferenceType): string {
    return paymentType && paymentType.commonRefValue
      ? paymentType.commonRefValue
      : '';
  }
  getPaymentSources() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(PAYMENT_SOURCE, this.sourceName)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.paymentSources = data;
          console.log(this.paymentSources);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  searchPaymentSource(event: any): void {
    const query = event.target.value;
    this.paymentName = query;
    this.getPaymentSources();
  }
  onPaymentSourceSelect(event: MatAutocompleteSelectedEvent) {
    this.paymentSourceId = event.option.value.id;
    this.formData.patchValue({ sourceId: this.paymentSourceId });
    console.log(this.formData);
  }
  displayPaymentSource(paymentType: CommonReferenceType): string {
    return paymentType && paymentType.commonRefValue
      ? paymentType.commonRefValue
      : '';
  }
  formatDateTime(date: Date): string {
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }

  save() {
    this.formData.value.paymentDate = this.formatDateTime(
      this.formData.value.paymentDate
    );
    this.formData.patchValue({ orgId: this.organizationId });
    console.log(this.formData.value);

    const formData = { ...this.formData.value };
    this.convertToNumbers(formData);
    const files = this.getFilesObject();
    console.log(files);

    const filesToSend = { check: files['check'] };

    if (this.formData.valid) {
      const saveOrUpdate$ = this.isAdding
        ? this.paymentDetailsService.addPaymentDetails(formData, filesToSend)
        : this.paymentDetailsService.updatePaymentDetails(
            formData,
            filesToSend
          );
      saveOrUpdate$.subscribe({
        next: (response) => {
          console.log(response);

          this.handleSuccessResponse(response);
        },
        error: (error) => {
          this.handleErrorResponse(error);
        },
      });
    }
  }
  handleSuccessResponse(response: any): void {
    console.log(response.message);
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
    this.goToPayments();
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
  }
  goToPayments() {
    console.log('display...........');
    this.router.navigate([NAVIGATE_TO_DISPLAY_PAYMENT_DETAILS]);
  }
  private fetchApplicantById(applicantId: number) {
    this.applicantInfoService
      .getApplicantInfoByApplicantId(applicantId)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.selectedApplicant = data;
          this.formData.patchValue({
            applicantId: applicantId,
          });
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }
  private fetchStagesById(stageId: number) {
    this.stageService.getStageByID(stageId).subscribe({
      next: (data) => {
        console.log(data);
        this.selectedStage = data;
        // this.formData.patchValue({
        //   stageTotalAmount: this.selectedStage.expectedAmount,
        // });
        this.formData.patchValue({
          stageId: stageId,
        });
      },
      error: (error: any) => {
        console.error('Error fetching Project Charge Charge Ins :', error);
      },
    });
  }
  private fetchPaymentSourceById(paymentSourceId: number) {
    this.commonRefDetailsService
      .getById(paymentSourceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedPaymnetSource = data;
          console.log(data);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  private fetchPaymentModeById(paymentModeId: number) {
    this.commonRefDetailsService
      .getById(paymentModeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedPaymnetMode = data;
          console.log(data);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  getFilesObject(): { [key: string]: File | null } {
    return {
      check:
        this.checkFileInput?.nativeElement?.files?.length > 0
          ? this.checkFileInput.nativeElement.files[0]
          : null,
    };
  }
  onCheckFileChange(event: Event): void {
    this.handleFileChange(event, 'check');
  }
  handleFileChange(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;

    if (file) {
      console.log(`File selected for ${key}:`, file);
      this.fileNames[key] = file.name;
    } else {
      this.fileNames[key] = null;
      this.fileErrors[key] = 'No file selected.';
    }

    console.log(`File errors for ${key}:`, this.fileErrors[key]);
  }
  formatRate(event: any): void {
    console.log(event.target.value);
    const value = event.target.value.replace(/,/g, '');
    console.log(value);
    event.target.value = event.target.value.replace(/,/g, '');
    if (!isNaN(Number(value))) {
      event.target.value = this.decimalPipe.transform(value, '1.0-0');
    }
  }
  restrictToNumbers(event: KeyboardEvent): boolean {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Tab',
    ];
    const isNumber = /^[0-9]$/.test(event.key);
    return isNumber || allowedKeys.includes(event.key);
  }

  convertToNumbers = (dto: any) => {
    dto.paidAmount = Number(dto.paidAmount.toLocaleString().replace(/,/g, ''));
    return dto;
  };

  noFutureDateValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    if (control.value) {
      const selectedDate = new Date(control.value);
      const today = new Date();
      if (selectedDate > today) {
        return { futureDate: true };
      }
    }
    return null;
  }
}
