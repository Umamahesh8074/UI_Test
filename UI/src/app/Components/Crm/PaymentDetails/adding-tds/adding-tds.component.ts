import { DecimalPipe, formatDate } from '@angular/common';
import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { TIME_OUT } from 'src/app/Constants/CommanConstants/Comman';
import { PAYMENT_TYPE, PAYMENT_SOURCE, NAVIGATE_TO_DISPLAY_PAYMENT_DETAILS } from 'src/app/Constants/Crm/CrmConstants';
import { Block, IBlock } from 'src/app/Models/Block/block';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { ApplicantInfo, IApplicantInfo } from 'src/app/Models/Crm/ApplicantInfo';
import { CustomerStages } from 'src/app/Models/Project/customerStages';
import { Level, ILevel } from 'src/app/Models/Project/level';
import { Project, IProject } from 'src/app/Models/Project/project';
import { UnitType, Unit } from 'src/app/Models/Project/unit';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { CustomerPaymentService } from 'src/app/Services/CrmServices/customer-payment.service';
import { CustomerStageService } from 'src/app/Services/CrmServices/customer-stages.service';
import { CustomerService } from 'src/app/Services/Customer/customer.service';
import { StageService } from 'src/app/Services/ProjectService/Stage/stage.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';

@Component({
  selector: 'app-adding-tds',
  templateUrl: './adding-tds.component.html',
  styleUrls: ['./adding-tds.component.css'],
})
export class AddingTdsComponent {
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
  paymentTypeModeFc: FormControl = new FormControl(
    [] as CommonReferenceType[],
    Validators.required
  );
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
  stages: any;
  paymentDetailsId: number = 0;
  @ViewChild('checkFileInput') checkFileInput!: ElementRef;
  @ViewChild('challanaFileInput') challanaFileInput!: ElementRef;
  @ViewChild('emailFileInput') emailFileInput!: ElementRef;

  fileNames: any = {
    check: null,
    challana: null,
    email: null,
  };

  fileErrors: any = {
    check: null,
    challana: null,
    email: null,
  };
  paidAmount: number = 0;
  userId: number = 0;
  units: any[] = [];
  selectedUnitId: number = 0;
  projectInfo: any;
  customerPayment: any;
  customerInfoPayment: any;
  status: string = '';
  stageIdValue: number = 0;
  isFromCustomePayment: boolean = true;
  chart: Chart | any;
  transactionTypeId: number = 0;
  paidTds: number = 0;
  constructor(
    private router: Router,
    private builder: FormBuilder,
    private commonService: CommanService,
    private commonRefDetailsService: CommonreferencedetailsService,
    private toastrService: ToastrService,
    private customerStageService: CustomerStageService,
    private decimalPipe: DecimalPipe,
    private stageService: StageService,
    private customerPaymentService: CustomerPaymentService,
    private customerService: CustomerService,
    private unitService: UnitService,
    private renderer: Renderer2
  ) {}
  ngOnInit(): void {
    this.initializeFormData();
    this.setUserFromLocalStorage();
    this.getDataFromState();
    this.getPaymentSources();
    this.getPaymentTypes();
    this.getStages();
    this.getUnitsBookedByCustomerId();
  }

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
      this.userId = user.userId;
    }
  }

  private initializeFormData(): void {
    this.formData = this.builder.group({
      paymentDetailsId: [0],
      stageId: [''],
      referenceNumber: ['', Validators.required],
      sourceId: [],
      paymentTypeId: ['', []],
      paymentDate: [Validators.required],
      bankName: ['', Validators.required],
      branchName: [''],
      ifcCode: [''],
      paidAmount: [],
      balanceAmount: [],
      paidTdsForApproval: [, [Validators.required, Validators.min(0.01)]],
      challanaUrl: [],
      checkUrl: [],
      status: ['A'],
      emailUrl: [''],
      applicantId: [],
      unitId: [null, Validators.required],
      accountNumber: [,],
      transactionTypeId: [],
      paidTds: [],
    });
  }

  getDataFromState() {
    const {
      customerInfo,
      status,
      isAdding,
      stageId,
      transactionTypeId,
      paidTds,
    } = history.state;
    console.log(customerInfo);
    if (customerInfo) {
      this.isAdding = isAdding;
      this.customerPayment = customerInfo;
      this.transactionTypeId = transactionTypeId;
      this.paidTds = paidTds;
      console.log(this.transactionTypeId);

      if (!this.isAdding) {
        this.paymentDetailsId = customerInfo.paymentDetailsId;
      }
      this.stageIdValue = customerInfo.stageId;
      this.applicantId = customerInfo.applicantId;
      console.log(this.paymentDetailsId);
      console.log(customerInfo.stageId);
      console.log(this.applicantId);

      this.status = status;
      console.log(this.status);
      console.log(customerInfo);
      this.unitName = customerInfo.unitName;
      console.log(this.isAdding);
      console.log(this.transactionTypeId);
    }
    this.patchFormDataWithCustomerPayment();
  }

  patchFormDataWithCustomerPayment() {
    if (this.customerPayment.stageId) {
      this.fetchStagesById(this.customerPayment.stageId);
    }
    if (this.customerPayment.sourceId) {
      this.fetchPaymentSourceById(this.customerPayment.sourceId);
    }

    if (this.customerPayment.paymentTypeId) {
      this.fetchPaymentModeById(this.customerPayment.paymentTypeId);
    }
    if (this.customerPayment.unitId) {
      console.log(this.customerPayment.unitId);

      this.onUnitSelected(this.customerPayment.unitId);
    }
  }

  private fetchStagesById(stageId: number) {
    this.stageService.getStageByID(stageId).subscribe({
      next: (data) => {
        this.selectedStage = data;
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
        },
        error: (error: Error) => {
          console.error(error);
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
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  getStagesByCustomerId() {
    this.customerStageService
      .getCustomerStagesByBookingId(this.applicantId, this.stageName)
      .subscribe({
        next: (data) => {
          this.customerStageDetails = data;
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
    if (event?.option?.value) {
      this.stageId = event.option.value.stageId;
      this.formData.patchValue({ stageId: this.stageId });
      this.formData.patchValue({
        stageTotalAmount: event.option.value.expectedAmount,
      });
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
          this.paymentTypes = data;
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  getStages() {
    this.stageService
      .getStages(this.stageName, this.projectId, 0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.stages = response;
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
          this.paymentSources = data;
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
    if (this.formData.valid) {
      if (!this.isAdding) {
        this.formData.patchValue({ paymentDetailsId: this.paymentDetailsId });
      }
      // this.formData.patchValue({ paidTds: this.paidTds });
      this.formData.patchValue({ transactionTypeId: this.transactionTypeId });
      this.formData.value.paymentDate = this.formatDateTime(
        this.formData.value.paymentDate
      );
      console.log(this.applicantId);
      console.log(this.formData.value);
      this.formData.patchValue({ applicantId: this.applicantId });
      this.formData.patchValue({ orgId: this.organizationId });

      console.log(this.formData.value);
      const formData = { ...this.formData.value };
      this.convertToNumbers(formData);
      const files = this.getFilesObject();
      const filesToSend1 = { check: files['check'] };
      const filesToSend2 = { challana: files['challana'] };
      const filesToSend3 = { email: files['email'] };
      if (this.formData.valid) {
        const saveOrUpdate$ = this.isAdding
          ? this.customerPaymentService.addCustomerPaymentDetails(
              formData,
              filesToSend1,
              filesToSend2,
              filesToSend3,
              this.isFromCustomePayment
            )
          : this.customerPaymentService.updateCustomerPaymentDetails(
              formData,
              filesToSend1,
              filesToSend2,
              filesToSend3
            );
        saveOrUpdate$.subscribe({
          next: (response) => {
            this.handleSuccessResponse(response);
          },
          error: (error) => {
            this.handleErrorResponse(error);
          },
        });
      }
    }
  }
  handleSuccessResponse(response: any): void {
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
    this.router.navigate([NAVIGATE_TO_DISPLAY_PAYMENT_DETAILS]);
  }

  getFilesObject(): { [key: string]: File | null } {
    return {
      check:
        this.checkFileInput?.nativeElement?.files?.length > 0
          ? this.checkFileInput.nativeElement.files[0]
          : null,
      challana:
        this.challanaFileInput?.nativeElement?.files?.length > 0
          ? this.challanaFileInput.nativeElement.files[0]
          : null,

      email:
        this.emailFileInput?.nativeElement?.files?.length > 0
          ? this.emailFileInput.nativeElement.files[0]
          : null,
    };
  }
  onCheckFileChange(event: Event, documentType: string): void {
    console.log(event);
    this.handleFileChange(event, documentType);
  }
  handleFileChange(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;

    if (file) {
      this.fileNames[key] = file.name;
    } else {
      this.fileNames[key] = null;
      this.fileErrors[key] = 'No file selected.';
    }
  }
  formatRate(event: any): void {
    const value = event.target.value.replace(/,/g, '');
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
    dto.paidTdsForApproval = Number(
      dto.paidTdsForApproval.toLocaleString().replace(/,/g, '')
    );
    return dto;
  };

  onUnitSelected(event: any) {
    const unitId = event?.value !== undefined ? event.value : event;

    console.log(unitId);
    this.selectedUnitId = unitId;
    console.log(this.selectedUnitId);
    console.log(this.stageId);
    this.formData.patchValue({ unitId: this.selectedUnitId });
    this.getCustomerPaymentUnits(
      this.selectedUnitId,
      this.stageIdValue,
      this.transactionTypeId
    );
  }
  getCustomerPaymentUnits(
    selectedUnitId: number,
    stageId: number,
    transactionTypeId: number
  ) {
    this.customerPaymentService
      .getCustomerPaymentUnits(selectedUnitId, stageId, transactionTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projectInfo) => {
          this.projectInfo = projectInfo;
        },
        error: (error: Error) => {
          console.error('Error fetching bookings:', error);
        },
      });
  }

  getUnitsBookedByCustomerId() {
    this.customerService
      .getUnitsBookedByCustomerId(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (units) => {
          this.units = units;
        },
        error: (error: Error) => {
          console.error('Error fetching bookings:', error);
        },
      });
  }

  clearForm() {
    this.formData.reset();
  }

  noPastDateValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value) {
      const selectedDate = new Date(control.value);
      const today = new Date();
      // Strip time from today
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
  
      if (selectedDate < today) {
        return { pastDate: true };
      }
    }
    return null;
  }
  
}
