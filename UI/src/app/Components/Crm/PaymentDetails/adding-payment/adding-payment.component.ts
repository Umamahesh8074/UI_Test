import { DecimalPipe } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { formatDate } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { TIME_OUT } from 'src/app/Constants/CommanConstants/Comman';
import {
  PAYMENT_TYPE,
  PAYMENT_SOURCE,
  NAVIGATE_TO_DISPLAY_CUSTOMER_PAYMENT,
  NAVIGATE_TO_DISPLAY_PAYMENT_DETAILS,
  TRANSACTION_TYPE,
  NAVIGATE_TO_DISPLAY_PAYMENT_LEDGER,
} from 'src/app/Constants/Crm/CrmConstants';
import { Block } from 'src/app/Models/Block/block';
import { IBlock } from 'src/app/Models/Block/iblock';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import {
  ApplicantInfo,
  IApplicantInfo,
  IApplicantInfoDto,
} from 'src/app/Models/Crm/ApplicantInfo';
import { CustomerStages } from 'src/app/Models/Project/customerStages';
import { ILevel, Level } from 'src/app/Models/Project/level';
import { IProject, Project } from 'src/app/Models/Project/project';
import { Unit, UnitType } from 'src/app/Models/Project/unit';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { CustomerPaymentService } from 'src/app/Services/CrmServices/customer-payment.service';
import { CustomerStageService } from 'src/app/Services/CrmServices/customer-stages.service';
import { CustomerService } from 'src/app/Services/Customer/customer.service';
import { StageService } from 'src/app/Services/ProjectService/Stage/stage.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { ApplicationInfoService } from 'src/app/Services/CrmServices/applicant-info.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { paymentLedger } from 'src/app/Models/Crm/PaymentDetails';

@Component({
  selector: 'app-adding-payment',
  templateUrl: './adding-payment.component.html',
  styleUrls: ['./adding-payment.component.css'],
})
export class AddingPaymentComponent implements OnInit {
  organizationId: number = 0;
  projectName: string = '';
  projectsData: Project[] = [];
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  selectedProject: IProject = new Project();
  formData!: FormGroup;
  projectId: any;
  projectFc: FormControl = new FormControl(
    [] as Project[],
    Validators.required
  );
  applicantDetails: IApplicantInfoDto[] = [];
  applicantName: string = '';
  applicantId: number = 0;
  applicantFc: FormControl = new FormControl(
    [] as IApplicantInfoDto[],
    Validators.required
  );
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
  transTractionTypeModeFc: FormControl = new FormControl(
    [] as CommonReferenceType[]
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
  customerInfoPayment: paymentLedger = new paymentLedger();
  status: string = '';
  stageIdValue: number = 0;
  isFromCustomePayment: boolean = true;
  chart: Chart | any;
  // transactionTypeId: number = 0;
  unitFc: any = new FormControl([] as Unit[], Validators.required);
  isPatchingApplicant: boolean = false;
  transactionTypename: any;
  transactionType: CommonReferenceType[] = [];
  selectedTransactionType: CommonReferenceType = new CommonReferenceType();
  @ViewChild('textArea') textArea!: ElementRef;
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
    private renderer: Renderer2,
    private projectService: ProjectService,
    private applicantInfoService: ApplicationInfoService,
    private loaderService: LoaderService
  ) {}
  ngOnInit(): void {
    this.initializeFormData();
    this.setUserFromLocalStorage();
    this.getDataFromState();
    this.getProjects();
    this.getPaymentSources();
    this.getPaymentTypes();
    this.getTransactionType();
    // this.getStages();
    this.getUnitsBookedByCustomerId();
    // this.transTractionTypeModeFc?.setValidators(Validators.required);
    // this.formData.get('transactionTypeId')?.setValidators(Validators.required);
    // this.paymentTypeModeFc?.setValidators(Validators.required);
    // this.formData.get('paymentTypeId')?.setValidators(Validators.required);
    // this.paymentTypeSourceFc?.setValidators(Validators.required);
    // this.formData.get('paymentSourceId')?.setValidators(Validators.required);
    this.projectFc?.setValidators(Validators.required);
    // // this.formData.get('paymentSourceId')?.setValidators(Validators.required);
    this.unitFc?.setValidators(Validators.required);
    // // this.formData.get('paymentSourceId')?.setValidators(Validators.required);
    this.applicantFc?.setValidators(Validators.required);
    this.formData.get('applicantId')?.setValidators(Validators.required);
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
      paymentLedgerId: [0],
      referenceNumber: ['', Validators.required],
      sourceId: ['', Validators.required],
      paymentTypeId: ['', Validators.required],
      paymentDate: [Validators.required],
      bankName: ['', Validators.required],
      branchName: [''],
      ifscCode: [''],
      // receivedAmount: [],
      balanceAmount: [],
      // paidAmountForApproval: [, [Validators.required, Validators.min(0.01)]],
      receivedAmount: [, Validators.required],
      challanaUrl: [],
      checkUrl: [],
      status: ['A'],
      emailUrl: [''],
      applicantId: [Validators.required],
      accountNumber: [,],
      transactionTypeId: ['', Validators.required],
      paymentStatusId: [Validators.required],
      actionStatusId: [],
      paymentReceiptUrl: [],
      paymentReceiptCode: [],
      description: ['', Validators.required],
      // project: [null, Validators.required],
    });
  }

  getDataFromState() {
    const { customerInfo, status, isAdding, projectId, unitId } = history.state;
    console.log(customerInfo);
    if (!isAdding) {
      if (customerInfo) {
        this.customerPayment = customerInfo;
        this.isAdding = isAdding;
        this.projectId = projectId;
        this.unitId = unitId;
        if (!this.isAdding) {
          this.paymentDetailsId = customerInfo.paymentDetailsId;
          this.patchFormDataWithCustomerPayment();
        }
      }
    }
  }

  patchFormDataWithCustomerPayment() {
    if (this.customerPayment.applicantId) {
      this.fetchApplicantById(this.customerPayment.applicantId);
    }
    if (this.projectId) {
      this.fetchProjectById(this.projectId);
    }
    if (this.unitId) {
      this.fetchUnitById(this.unitId);
    }
    this.formData.patchValue(this.customerPayment);
    if (this.customerPayment.checkUrl) {
      const renamedCheck = this.renameFile(this.customerPayment.checkUrl);
      this.formData.patchValue({ check: renamedCheck });

      // If using a text field to show filename:
      this.fileNames.check = renamedCheck || 'File';
    }
    if (this.customerPayment.challanaUrl) {
      const renamedCheck = this.renameFile(this.customerPayment.challanaUrl);
      this.formData.patchValue({ challana: renamedCheck });

      // If using a text field to show filename:
      this.fileNames.challana = renamedCheck || 'File';
    }
    if (this.customerPayment.emailUrl) {
      const renamedCheck = this.renameFile(this.customerPayment.emailUrl);
      this.formData.patchValue({ email: renamedCheck });

      // If using a text field to show filename:
      this.fileNames.email = renamedCheck || 'File';
    }
  }
  private fetchProjectById(projectId: number) {
    this.projectService
      .getProjectById(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedProject = data;
          this.projectFc.setValue(this.selectedProject);
          console.log(data);
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
          this.unitFc.setValue(this.selectedUnit);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  private fetchApplicantById(applicantId: number) {
    this.applicantInfoService
      .getApplicantInfoByApplicantId(applicantId)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.selectedApplicant = data;
          this.applicantFc.setValue(this.selectedApplicant);
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
          this.paymentTypeSourceFc.setValue(this.selectedPaymnetSource);
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }
  private fetchTranactionTypeById(transactionTypeId: number) {
    this.commonRefDetailsService
      .getById(transactionTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedTransactionType = data;
          this.transTractionTypeModeFc.setValue(this.selectedTransactionType);
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
          this.paymentTypeModeFc.setValue(this.selectedPaymnetMode);
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
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
    if (
      this.formData.invalid ||
      this.projectFc.invalid ||
      this.unitFc.invalid ||
      this.applicantFc.invalid
    ) {
      this.formData.markAllAsTouched();
      return;
    }
    // if (this.formData.valid) {
    console.log(this.formData.valid);

    this.showLoading();
    if (!this.isAdding) {
      this.formData.patchValue({ paymentDetailsId: this.paymentDetailsId });
    }
    this.formData.value.paymentDate = this.formatDateTime(
      this.formData.value.paymentDate
    );
    console.log(this.formData.value);
    console.log(this.applicantId);
    console.log(this.formData.value);
    this.formData.patchValue({ orgId: this.organizationId });

    console.log(this.formData.value);
    const formData = { ...this.formData.value };
    this.convertToNumbers(formData);
    const files = this.getFilesObject();
    const filesToSend1 = { check: files['check'] };
    const filesToSend2 = { challana: files['challana'] };
    const filesToSend3 = { email: files['email'] };
    if (this.formData.valid) {
      console.log('saving');

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
          this.hideLoading();
          this.handleSuccessResponse(response);
        },
        error: (error) => {
          this.hideLoading();
          this.handleErrorResponse(error);
        },
      });
    }
    // }
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
    this.router.navigate([NAVIGATE_TO_DISPLAY_PAYMENT_LEDGER]);
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
    dto.receivedAmount = Number(
      dto.receivedAmount.toLocaleString().replace(/,/g, '')
    );
    return dto;
  };

  // onUnitSelected(event: any) {
  //   const unitId = event?.value !== undefined ? event.value : event;

  //   console.log(unitId);
  //   this.selectedUnitId = unitId;
  //   console.log(this.selectedUnitId);
  //   console.log(this.stageId);
  //   this.formData.patchValue({ unitId: this.selectedUnitId });
  //   // this.getCustomerPaymentUnits(
  //   //   this.selectedUnitId,
  //   //   this.stageIdValue,
  //   //   this.transactionTypeId
  //   // );
  // }
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
    this.projectFc.reset();
    this.unitFc.reset();
    this.applicantFc.reset();
    this.paymentTypeModeFc.reset();
    this.paymentTypeSourceFc.reset();
    this.transTractionTypeModeFc.reset();
  }

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
  onProjectSelect(event: any) {
    console.log(event.option.value);
    if (event?.option?.value) {
      this.projectId = event.option.value.projectId;
      console.log(this.projectId);
      this.unitFc.setValue(null);
      this.unitId = 0;
      this.applicantFc.setValue(null);
      this.getUnitsBasedOnProjectId();
      this.getApplicantsByProjectIdAndUnitId();
      console.log(this.formData);
    }
  }
  searchProject(event: any): void {
    const query = event.target.value;
    this.projectId = 0;
    if (query.length <= 0) {
      this.projectFc?.setValidators(Validators.required);
      this.projectId.setValidators(Validators.required);
    }
    this.projectName = query;
    this.getProjects();
  }
  displayProject(project: Project): string {
    return project && project.projectName ? project.projectName : '';
  }
  getUnitsBasedOnProjectId() {
    console.log(this.projectId);
    this.unitService
      .getAllUnitsBasedOnProjectId(this.projectId, this.unitName)
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
      this.applicantFc.setValue(null);
      this.isPatchingApplicant = true;
      this.getApplicantsByProjectIdAndUnitId();
    }
  }
  displayUnit(unit: any): string {
    return unit && unit.unitName ? unit.unitName : '';
  }
  searchUnit(event: any): void {
    const query = event.target.value;
    this.unitName = query;
    this.applicantFc.setValue(null);
    this.getUnitsBasedOnProjectId();
  }
  getApplicantsByProjectIdAndUnitId() {
    console.log(this.projectId);
    this.applicantInfoService
      .getAllApplicantInfoByProjectIdAndUnitId(
        this.projectId,
        this.applicantName,
        this.unitId
      )
      .subscribe({
        next: (data) => {
          console.log(data);
          this.applicantDetails = data;
          console.log(this.applicantDetails);
          // if(this.isPatchingApplicant){
          //   console.log('Before patching:', this.applicantFc.value);
          // this.applicantFc.setValue(this.applicantDetails[0]);
          // console.log('after patching:', this.applicantFc.value);
          // }
          this.isPatchingApplicant = false;
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
    }
  }
  searchApplicant(event: any): void {
    const query = event.target.value;
    this.applicantName = query;
    this.getApplicantsByProjectIdAndUnitId();
  }
  displayApplicant(applicant: ApplicantInfo): string {
    return applicant && applicant.firstApplicantName
      ? applicant.firstApplicantName
      : '';
  }
  getTransactionType() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(
        TRANSACTION_TYPE,
        this.transactionTypename
      )
      .subscribe({
        next: (data) => {
          this.transactionType = data;
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  searchTransactionType(event: any): void {
    console.log(event.option);

    if (event.option.value.length <= 0) {
      this.formData.get('transactionTypeId')?.setValue(null);
      this.transTractionTypeModeFc.setValidators(Validators.required);
      this.transTractionTypeModeFc.setErrors({ required: true });
      this.formData
        .get('transactionTypeId')
        ?.setValidators(Validators.required);
      this.formData.get('transactionTypeId')?.setErrors({ required: true });
    }
    const query = event.option?.value?.commonRefValue;
    this.transactionTypename = query;
    this.getTransactionType();
  }
  // onTransactionTypeSelect(event: any) {
  //   console.log(event);
  //   this.transactionTypeId = event.option.value.id;
  //   console.log(this.transactionTypeId);
  //   this.formData.patchValue({ transactionTypeId: this.transactionTypeId });
  //   // const selected = event.option.value;
  //   // this.transactionTypeId = selected.id;

  //   // // Update the actual form control
  //   // this.transTractionTypeModeFc.setValue(selected); // Wrap in array since it's expecting array
  //   // this.transTractionTypeModeFc.markAsTouched();
  //   // this.transTractionTypeModeFc.updateValueAndValidity();

  //   // // Optionally update your form group if you're using one too
  //   // this.formData.patchValue({ transactionTypeId: this.transactionTypeId });
  // }
  displayTransActionType(transactionType: CommonReferenceType): string {
    return transactionType && transactionType.commonRefValue
      ? transactionType.commonRefValue
      : '';
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
  autoResize() {
    const textarea = this.textArea.nativeElement;
    textarea.style.height = 'auto'; // Reset height to auto to calculate new height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height based on scrollHeight
  }
  convertFirstLetterToUpperCase(controlName: string): void {
    const control = this.formData.get(controlName);
    if (control) {
      const value = control.value || '';
      const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
      control.setValue(capitalized, { emitEvent: false });
    }
  }
  renameFile(fileUrl: string): string {
    if (!fileUrl) return '';
    const fileNameWithExtension = fileUrl.split('/').pop()?.split('?')[0] || '';
    const match = fileNameWithExtension.match(/(\w+\.pdf)/);
    const fileExtension = fileNameWithExtension.split('.').pop();
    const originalFileName = fileNameWithExtension.replace(/\.\w+$/, '');
    const newFileName = `${originalFileName}.${fileExtension}`;
    return newFileName;
  }
}
