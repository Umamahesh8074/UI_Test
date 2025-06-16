import { formatDate } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
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
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { TIME_OUT } from 'src/app/Constants/CommanConstants/Comman';
import {
  NAVIGATE_TO_DISPLAY_CUSTOMER_PAYMENT,
  PAYMENT_SOURCE,
  PAYMENT_TYPE,
} from 'src/app/Constants/Crm/CrmConstants';
import { Block, IBlock } from 'src/app/Models/Block/block';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import {
  ApplicantInfo,
  IApplicantInfo,
} from 'src/app/Models/Crm/ApplicantInfo';
import { CustomerStages } from 'src/app/Models/Project/customerStages';
import { ILevel, Level } from 'src/app/Models/Project/level';
import { IProject, Project } from 'src/app/Models/Project/project';
import { Unit, UnitType } from 'src/app/Models/Project/unit';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { CustomerStageService } from 'src/app/Services/CrmServices/customer-stages.service';
import { PaymentDetailsService } from 'src/app/Services/CrmServices/payment-details.service';
import { StageService } from 'src/app/Services/ProjectService/Stage/stage.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { DecimalPipe } from '@angular/common';
import { CustomerPaymentService } from 'src/app/Services/CrmServices/customer-payment.service';
import { CustomerService } from 'src/app/Services/Customer/customer.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-customer-payment',
  templateUrl: './customer-payment.component.html',
  styleUrls: ['./customer-payment.component.css'],
})
export class CustomerPaymentComponent implements OnInit {
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

    // let initialBalanceAmount = this.formData.get('balanceAmountForApproval')?.value || 0;
    // console.log( initialBalanceAmount);

    // this.formData.get('paidAmountForApproval')?.valueChanges.subscribe((paidAmount) => {
    //   paidAmount = paidAmount || 0;
    //   const newBalanceAmount = initialBalanceAmount - paidAmount;
    //   console.log(paidAmount);
    //   console.log(newBalanceAmount);

    //   this.formData.patchValue(
    //     {
    //       balanceAmountForApproval: newBalanceAmount >= 0 ? newBalanceAmount : 0,
    //     },
    //     { emitEvent: false }
    //   );
    // });
    this.renderer.addClass(document.body, 'customer-bg-color');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.chart) {
      this.chart.destroy();
    }
    this.renderer.removeClass(document.body, 'customer-bg-color');
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
      referenceNumber: [''],
      sourceId: [],
      paymentTypeId: ['', []],
      paymentDate: [Validators.required],
      bankName: [''],
      branchName: [''],
      ifcCode: [''],
      paidAmount: [],
      balanceAmount: [],
      paidAmountForApproval: [, [Validators.required,Validators.min(0.01)]],
      challanaUrl: [],
      checkUrl: [],
      status: ['A'],
      emailUrl: [''],
      applicantId: [],
      unitId: [null, Validators.required],
      accountNumber: [
        ,
      ],
    });
  }

  getDataFromState() {
    // const { customerPayment, isAdding} = history.state;
    // if (customerPayment) {
    //   this.isAdding = false;
    //   this.customerPayment = customerPayment || this.customerPayment;
    // }
    const { customerInfo, status, isAdding, stageId } = history.state;
    console.log(customerInfo);

    if (customerInfo) {
      this.isAdding = isAdding;
      this.customerPayment = customerInfo;
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

    // this.formData.patchValue(this.customerPayment);
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
    this.router.navigate([NAVIGATE_TO_DISPLAY_CUSTOMER_PAYMENT]);
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
    dto.paidAmountForApproval = Number(
      dto.paidAmountForApproval.toLocaleString().replace(/,/g, '')
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
    this.getCustomerPaymentUnits(this.selectedUnitId, this.stageIdValue);
  }
  getCustomerPaymentUnits(selectedUnitId: number, stageId: number) {
    this.customerPaymentService
      .getCustomerPaymentUnits(selectedUnitId, stageId)
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
