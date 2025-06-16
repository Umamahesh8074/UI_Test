import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { WorkOrderBillingService } from 'src/app/Services/WorkOrderService/WorkOrderBilling/WorkOrderBilling.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import {
  PAGE_INDEX,
  pageSizeOptions,
  TIME_OUT,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  CGST_OR_SGST,
  GST,
  NAVIGATE_TO_WORK_ORDER_BILLING,
  WO_BILLLING_RETENSION,
  WOB_CHECKED_BY,
} from 'src/app/Constants/WorkOrder/workorder';
import {
  InvoiceBillings,
  IWorkOrderBillingQuantities,
  IWorkOrderBillingsDto,
  WorkOrderBillingsDto,
} from 'src/app/Models/WorkOrder/WorkOrderBilling';

import { WorkOrderCreationService } from 'src/app/Services/WorkOrderService/WorkOrderCreation/WorkOrderCreation.service';
import {
  searchTextLength,
  searchTextZero,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  IWorkOrderDto,
  WorkOrderDto,
} from 'src/app/Models/WorkOrder/WorkOrderCreation';
import { DecimalPipe } from '@angular/common';
import { Gst1 } from 'src/app/Constants/Procurement/ConfigurationTabsIndexes';
import { MatDialog } from '@angular/material/dialog';
import { DocumentComponent } from 'src/app/Comman-Components/Dialog/documentmodel/document.component';
import { DocumentSharedService } from 'src/app/Apis/SharedServices/DocumnetSharedService';
import { WorkOrderGstService } from 'src/app/Services/WorkOrderService/WoGst/wo-gst-service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';

@Component({
  selector: 'work-order-billing',
  templateUrl: './work-order-billing.component.html',
  styleUrls: ['./work-order-billing.component.css'],
})
export class AddWorkOrderBilling implements OnInit {
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  workOrderBillingsDto: IWorkOrderBillingsDto = new WorkOrderBillingsDto();
  formData!: FormGroup;
  organizationId = 0;
  workOrders: any = new FormControl([] as any[]);
  workOrder: any;
  workOrderDto: IWorkOrderDto = new WorkOrderDto();
  workOrderNumber: string = '';
  validationMessage: string | null = null;
  shouldAddEmptyGroups: boolean = true;
  emptyGroupCount: number = 0;
  allBillingQuantities: any[] = [];
  showWorkOrderError: boolean = false;
  totalWorkOrderAmount: number = 0;
  amountTillReleased: number = 0;
  gstOutOfKarnataka: any;
  checkedBy: any;
  retensions: any;
  selectedGST: number = 0;
  selectedCheckedBy: number = 0;
  selectedRetension: number = 0;
  showRanNumberField: boolean = false;
  displayPageData: any;

  billingId: number = 0;
  documentType: string = 'WORK_ORDER_BILLING_DOCUMENTS';
  billingDocuments: any;
  documents: any[] = [];
  selectedFiles: File[] = [];
  selectedWOB: IWorkOrderBillingsDto = new WorkOrderBillingsDto();
  gstFromKarnataka: any[] = [];
  isFromKarnatakaGst: boolean = true;

  wobQuantities: any;
  workOrderBillingStatus: string = '';

  @ViewChildren('serviceDescriptionTextarea')
  serviceDescriptionTextareas!: QueryList<ElementRef>;

  //documents pagination
  documentTotalItems: number = TOTAL_ITEMS;
  documentPageSize: number = 15;
  documentPageIndex: number = PAGE_INDEX;
  documentPageSizeOptions = pageSizeOptions;

  ngOnInit(): void {
    this.initializeFormData();
    this.setUserFromLocalStorage();
    this.getDataFromState();
    this.fetchGST();
    this.fetchRetension();
    this.fetchCGST();
    this.fetchWobCheckedBy();
    this.fetchWorkOrderCreationByNumber();
  }

  constructor(
    private router: Router,
    private workOrderCreationService: WorkOrderCreationService,
    private workOrderBillingService: WorkOrderBillingService,
    private builder: FormBuilder,
    private commonService: CommanService,
    private toastrService: ToastrService,
    public dialog: MatDialog,
    private documentService: DocumentSharedService,
    private workOrderGstService: WorkOrderGstService,
    private loaderService: LoaderService
  ) {}

  private initializeFormData() {
    this.formData = this.builder.group({
      woBillingId: [0],
      status: ['A'],
      workOrderId: [],
      workOrderNumber: [''],
      vendorId: [0],
      vendorCode: [''],
      vendorName: [''],
      vendorGstNumber: [''],
      projectId: [0],
      projectCode: [''],
      projectName: [''],
      projectAddress: [''],
      projectLocation: [''],
      projectDescription: [''],
      billPeriodFromDate: [],
      billPeriodToDate: [],
      workOrderBillingId: [0],
      debitAmount: [0],
      advanceRecoveredUptoPreviousBill: [0],
      advanceRecoveredOnThisBill: [0],
      retension: [0],
      raNumber: [],
      otherRecoveries: [0],
      billingMobilizationAmount: [0],
      checkedBy: ['PM-Projects'],
      workOrderBillingQuantities: this.builder.array([
        this.createWorkOrderBillingQuantities(),
      ]),

      wobInvoices: this.builder.array([this.wobInvoicesControll()]),
    });

    // Subscribe to changes in rate and quantity
    this.formData
      .get('billingMobilizationAmount')
      ?.valueChanges.subscribe(() => {
        this.updateMobilizationAmount();
      });
  }

  createWorkOrderBillingQuantities(): FormGroup {
    const workOrderQuantities = this.builder.group({
      woBillingQuantitiesId: [0],
      releasedTillPrevious: [0],
      currentPeriod: ['', Validators.required],
      currentPeriodAmount: [0, [Validators.min(0)]],
      cumulative: [0],
      balance: [0, [Validators.min(0)]],

      serviceCodeId: [0],
      serviceCode: [''],
      serviceDescription: [''],
      serviceUomId: [0],
      scUomRefValue: [''],

      woQuantitiesId: [0],

      quantity: [0],
      rate: [0],
      value: [0],
      gstWithAmount: [0],
      amendmentQuantity: [],
      amendmentAmount: [],
      gstWithAmountAfterAmendment: [],
      totalQuantityAfterAmendment: [],
      totalAmountAfterAmendment: [],
      totalAmountWthGstAfterAmendment: [],

      totalAmountWthGst: [0],
      wbsElements: [''],
      budgetQuantity: [0],

      serviceGroupCode: [''],
      primeActivityNumber: [''],
      workOrderGstPercentage: [],
    });

    // Subscribe to changes in rate and quantity
    workOrderQuantities
      .get('releasedTillPrevious')
      ?.valueChanges.subscribe(() => {
        this.updateValue(workOrderQuantities);
      });

    workOrderQuantities.get('currentPeriod')?.valueChanges.subscribe(() => {
      this.updateValue(workOrderQuantities);
    });

    return workOrderQuantities;
  }

  wobInvoicesControll() {
    const wobInvoices = this.builder.group({
      invoiceBillingId: [0],
      billingId: [0],
      invoiceBillNumber: [''],
      invoiceBillDate: [],
    });
    return wobInvoices;
  }

  private updateMobilizationAmount() {
    const mobilizationAmount = parseFloat(
      (this.formData.get('billingMobilizationAmount')?.value || '0')
        .toLocaleString()
        .replace(/,/g, '')
    );
    console.log(mobilizationAmount);
    this.formData.patchValue({
      billingMobilizationAmount: mobilizationAmount.toLocaleString(),
    });
  }

  private updateValue(workOrderQuantities: FormGroup) {
    const releasedTillPrevious = parseFloat(
      (workOrderQuantities.get('releasedTillPrevious')?.value || '0')
        .toLocaleString()
        .replace(/,/g, '')
    );

    const currentPeriod = parseFloat(
      (workOrderQuantities.get('currentPeriod')?.value || '0')
        .toLocaleString()
        .replace(/,/g, '')
    );

    const quantity = parseFloat(
      (workOrderQuantities.get('totalQuantityAfterAmendment')?.value || '0')
        .toLocaleString()
        .replace(/,/g, '')
    );

    const rate = parseFloat(
      (workOrderQuantities.get('rate')?.value || '0')
        .toLocaleString()
        .replace(/,/g, '')
    );

    let cumulative = releasedTillPrevious + currentPeriod;
    let currentPeriodAmount = currentPeriod * rate;
    const balance = quantity - cumulative;
    workOrderQuantities.patchValue({ cumulative: cumulative.toLocaleString() });
    workOrderQuantities.patchValue({
      currentPeriod: currentPeriod.toLocaleString(),
    });
    workOrderQuantities.patchValue({
      currentPeriodAmount: currentPeriodAmount.toLocaleString(),
    });
    workOrderQuantities.patchValue({ balance: balance.toLocaleString() });
  }

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
    }
  }
  get workOrderBillingQuantities(): FormArray {
    return this.formData.get('workOrderBillingQuantities') as FormArray;
  }

  save() {
    this.convertToNumbers(this.formData.value);

    const formData = new FormData();
    const billingData = this.formData.value;

    for (const key in billingData) {
      if (billingData.hasOwnProperty(key) && key !== 'totalAmountWthGst') {
        formData.append(key, billingData[key]);
      }
    }
    const documents = this.documents;
    this.selectedFiles = this.getDocumentsArray(documents);

    if (this.selectedFiles.length === 0) {
      formData.append(
        'files',
        new File([''], '', {
          type: '',
        })
      ); //
    } else {
      this.selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
    }

    formData.append('workOrderBilling', JSON.stringify(billingData));

    if (this.formData.touched && this.formData.valid) {
      this.showLoading();
      const saveOrUpdate$ = this.isAdding
        ? this.workOrderBillingService.addWorkOrderBilling(formData)
        : this.workOrderBillingService.updateWorkOrderBilling(
            formData,
            this.workOrderBillingStatus
          );

      saveOrUpdate$.subscribe({
        next: (response) => {
          this.handleSuccessResponse(response);
          this.hideLoading();
        },
        error: (error) => {
          this.handleErrorResponse(error);
          this.hideLoading();
        },
      });
    } else {
      console.error('No changes found in Work Order Billing ');
      this.hideLoading();
    }
  }

  getDocumentsArray(
    documents: { documentName: string; documentPath: File; file: any }[]
  ): File[] {
    const filesArray: File[] = [];
    documents.forEach((document) => {
      const { documentName, documentPath } = document;
      if (documentPath) {
        const originalFileName = document.file;
        const extension = originalFileName.substring(
          originalFileName.lastIndexOf('.')
        );
        const newFileName = `${documentName}${extension}`;
        const newFile = new File([documentPath], newFileName, {
          type: documentPath.type,
        });
        filesArray.push(newFile);
      }
    });
    return filesArray;
  }

  onSelectWorkOrderBilling(event: any) {
    this.showWorkOrderError = false;
    const workOrder = event.option.value;
    this.getWorkOrderQuantitiesById(workOrder);
  }

  getWorkOrderQuantitiesById(workOrder: any) {
    this.showLoading();
    this.workOrderCreationService
      .getWorkorderQuantitiesById(workOrder.workOrderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          const billingQuantities = response;
          this.wobQuantities = response;
          console.log(this.wobQuantities);
          this.allBillingQuantities = billingQuantities;
          this.totalWorkOrderAmount = workOrder.totalWorkOrderAmount ?? 0;
          if (billingQuantities && billingQuantities.length > 0) {
            const billingQuantity = billingQuantities[0];
            if (billingQuantity.workOrderBillingQuantityStatus === 'Pending') {
              this.validationMessage = ' Your Previous work order is pending.';
              this.hideLoading();
              return;
            } else {
              this.validationMessage = null;
            }
          }
          if (workOrder.ranumber) {
            this.formData.patchValue({
              raNumber: workOrder.ranumber,
            });
            this.showRanNumberField = true;
          }

          this.patchWorkOrderBillings(workOrder);
          this.hideLoading();
        },
        error: (error: Error) => {
          console.log(error);
          this.hideLoading();
        },
      });
  }

  patchWorkOrderBillings(workOrder: any) {
    console.log(workOrder);
    this.formData.patchValue({
      workOrderId: workOrder.workOrderId,
      workOrderNumber: workOrder.workOrderNumber,
      vendorId: workOrder.vendorId,
      vendorCode: workOrder.vendorCode,
      vendorName: workOrder.vendorName,
      vendorGstNumber: workOrder.vendorGstNumber,
      projectId: workOrder.plantCodeId,
      projectCode: workOrder.projectCode,
      billingMobilizationAmount: workOrder.mobilizationAmount.toLocaleString(),
    });

    this.isFromKarnatakaGst = workOrder.vendorGstNumber.startsWith('29');

    // Get the FormArray from the form
    const workOrderBillingQuantitiesArray = this.formData.get(
      'workOrderBillingQuantities'
    ) as FormArray;

    workOrderBillingQuantitiesArray.clear();

    console.log(this.wobQuantities);

    this.wobQuantities.forEach((value: any) => {
      const emptyBillingQuantityGroup = this.createWorkOrderBillingQuantities();

      var gstPercentage = 0;
      if (value.woCgst) {
        gstPercentage = value.woCgst + value.woCgst;
        console.log(gstPercentage);
      } else {
        gstPercentage = value.workOrderGstPercentage;

        console.log(value.workOrderGstPercentage);
        console.log(gstPercentage);
      }

      let releasesTillPrevious = value.cumulative;
      let balance = value.totalQuantityAfterAmendment - releasesTillPrevious;
      emptyBillingQuantityGroup.patchValue({
        woBillingQuantitiesId: 0,
        workOrderId: value.workOrderId,
        serviceCodeId: value.serviceCodeId,
        serviceCode: value.serviceCode,
        serviceDescription: value.serviceDescription,
        serviceUomId: value.serviceUomId,
        scUomRefValue: value.scUomRefValue,
        serviceGroupCode: value.serviceGroupCode,
        primeActivityNumber: value.primeActivityNumber,
        woQuantitiesId: value.woQuantitiesId,
        quantity: value.quantity.toLocaleString(),
        rate: value.rate.toLocaleString(),
        value: value.value.toLocaleString(),
        gstWithAmount: value.gstWithAmount.toLocaleString(),

        amendmentQuantity: value.amendmentQuantity.toLocaleString(),
        amendmentAmount: value.amendmentAmount.toLocaleString(),
        gstWithAmountAfterAmendment:
          value.gstWithAmountAfterAmendment.toLocaleString(),

        totalQuantityAfterAmendment:
          value.totalQuantityAfterAmendment.toLocaleString(),
        totalAmountAfterAmendment:
          value.totalAmountAfterAmendment.toLocaleString(),
        totalAmountWthGstAfterAmendment:
          value.totalAmountWthGstAfterAmendment.toLocaleString(),

        wbsElements: value.wbsElements,
        budgetQuantity: value.totalBudgetQuantity.toLocaleString(),
        releasedTillPrevious:
          releasesTillPrevious != null
            ? releasesTillPrevious.toLocaleString()
            : 0,
        cumulative:
          value.cumulative != null ? value.cumulative.toLocaleString() : 0,
        balance: balance != null ? balance.toLocaleString() : 0,
        workOrderGstPercentage: gstPercentage,
      });

      workOrderBillingQuantitiesArray.push(emptyBillingQuantityGroup);
    });

    workOrderBillingQuantitiesArray.controls.forEach((control, index) => {
      this.autoResizeServiceDescription(index);
    });
  }

  searchWorkOrderNumber(event: any) {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.workOrderNumber = query;
      this.fetchWorkOrderCreationByNumber();
    }
  }
  fetchWorkOrderCreationByNumber() {
    this.showLoading();
    this.workOrderCreationService
      .getAllWorkOrderWithOutPageByNumber(this.workOrderNumber)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.workOrder = resp;
          this.patchTotalWorkOrderAmountWhileEditing(this.workOrder);
          this.hideLoading();
        },
        error: (err) => {
          console.error('Error loading service codes', err);
          this.hideLoading();
        },
      });
  }

  displayWorkOrder(workOrder: any) {
    return workOrder && workOrder.workOrderNumber
      ? workOrder.workOrderNumber
      : '';
  }

  handleSuccessResponse(response: any): void {
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
    this.gotoWorkOrderBilling();
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
    this.gotoWorkOrderBilling();
  }
  gotoWorkOrderBilling() {
    this.router.navigate([NAVIGATE_TO_WORK_ORDER_BILLING], {
      state: {
        displayPageData: this.displayPageData,
      },
    });
  }

  getDataFromState() {
    const { workOrderBilling, isAdding, workOrderBillingStatus, displayPage } =
      history.state;
    this.isAdding = isAdding ?? this.isAdding;
    this.workOrderBillingsDto = workOrderBilling || this.workOrderBillingsDto;
    console.log(workOrderBilling);

    if (displayPage) {
      this.displayPageData = displayPage;
    }

    if (workOrderBillingStatus) {
      this.workOrderBillingStatus = workOrderBillingStatus;
    }
    if (workOrderBilling?.workOrderBillingId > 0) {
      this.billingId = workOrderBilling.workOrderBillingId;
      this.getDocumentsBasedOnId();
    }
    if (!isAdding) {
      this.patchFormDataWithWorkOrderBillingData(this.workOrderBillingsDto);
    }
  }

  getDocumentsBasedOnId() {
    this.commonService
      .getDocumentById(
        this.billingId,
        this.documentType,
        this.documentPageIndex,
        this.documentPageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.billingDocuments = response;
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  fetchWorkOrderCreationById(workOrderBillingId: number): void {
    this.workOrderBillingService
      .getWorkOrderBillingById(workOrderBillingId)
      .subscribe({
        next: (resp) => {
          this.selectedWOB = resp;
        },
        error: (err) => {
          console.error('Error loading service codes', err);
        },
      });
  }
  patchFormDataWithWorkOrderBillingData(
    workOrderBilling: IWorkOrderBillingsDto
  ): void {
    this.showLoading();
    if (workOrderBilling.workOrderBillingId) {
      this.fetchWorkOrderCreationById(workOrderBilling.workOrderBillingId);
    }

    if (workOrderBilling) {
      this.formData.patchValue({
        woBillingId: workOrderBilling.woBillingId,
        workOrderId: workOrderBilling.workOrderId,
        workOrderBillingId: workOrderBilling.workOrderBillingId,
        workOrderNumber: workOrderBilling.workOrderNumber,
        vendorId: workOrderBilling.vendorId,
        vendorCode: workOrderBilling.vendorCode,
        vendorName: workOrderBilling.vendorName,
        vendorGstNumber: workOrderBilling.vendorGstNumber,
        projectId: workOrderBilling.projectId,
        projectCode: workOrderBilling.projectCode,
        projectName: workOrderBilling.projectName,
        projectAddress: workOrderBilling.projectAddress,
        projectLocation: workOrderBilling.projectLocation,
        projectDescription: workOrderBilling.projectDescription,
        billPeriodFromDate: workOrderBilling.billPeriodFromDate,
        billPeriodToDate: workOrderBilling.billPeriodToDate,
        invoiceBillNumber: workOrderBilling.invoiceBillNumber,
        invoiceBillDate: workOrderBilling.invoiceBillDate,
        debitAmount: workOrderBilling.debitAmount.toLocaleString(),
        advanceRecoveredUptoPreviousBill:
          workOrderBilling.advanceRecoveredUptoPreviousBill.toLocaleString(),
        advanceRecoveredOnThisBill:
          workOrderBilling.advanceRecoveredOnThisBill.toLocaleString(),

        retension: workOrderBilling.retension,
        otherRecoveries: workOrderBilling.otherRecoveries.toLocaleString(),
        billingMobilizationAmount: workOrderBilling.mobilizationAmount,
        checkedBy: workOrderBilling.checkedBy,
      });

      this.isFromKarnatakaGst =
        workOrderBilling.vendorGstNumber.startsWith('29');

      const workOrderBillingQuantitiesArray = this.formData.get(
        'workOrderBillingQuantities'
      ) as FormArray;
      workOrderBillingQuantitiesArray.clear();

      workOrderBilling.workOrderBillingQuantities.forEach(
        (woq: IWorkOrderBillingQuantities) => {
          const billingQuantityGroup = this.createWorkOrderBillingQuantities();
          billingQuantityGroup.patchValue({
            serviceCodeId: woq.serviceCodeId,
            serviceCode: woq.serviceCode,
            serviceDescription: woq.serviceDescription,
            serviceUomId: woq.serviceUomId,
            scUomRefValue: woq.scUomRefValue,
            serviceGroupCode: woq.serviceGroupCode,
            primeActivityNumber: woq.primeActivityNumber,
            woQuantitiesId: woq.woQuantitiesId,
            woBillingQuantitiesId: woq.woBillingQuantitiesId,
            quantity: woq.quantity.toLocaleString(),
            rate: woq.rate.toLocaleString(),
            value: woq.value.toLocaleString(),
            wbsElements: woq.wbsElements,
            budgetQuantity: woq.budgetQuantity.toLocaleString(),
            releasedTillPrevious: woq.releasedTillPrevious.toLocaleString(),
            currentPeriod: woq.currentPeriod.toLocaleString(),
            cumulative: woq.cumulative.toLocaleString(),
            balance: woq.balance.toLocaleString(),
            workOrderGstPercentage: woq.workOrderGstPercentage,

            amendmentQuantity: (woq.amendmentQuantity || 0).toLocaleString(),
            amendmentAmount: (woq.amendmentAmount || 0).toLocaleString(),
            gstWithAmountAfterAmendment: (
              woq.gstWithAmountAfterAmendment || 0
            ).toLocaleString(),
            totalQuantityAfterAmendment: (
              woq.totalQuantityAfterAmendment || 0
            ).toLocaleString(),
            totalAmountAfterAmendment: (
              woq.totalAmountAfterAmendment || 0
            ).toLocaleString(),
            totalAmountWthGstAfterAmendment: (
              woq.totalAmountWthGstAfterAmendment || 0
            ).toLocaleString(),
          });

          workOrderBillingQuantitiesArray.push(billingQuantityGroup);
        }
      );

      workOrderBillingQuantitiesArray.controls.forEach((control, index) => {
        this.autoResizeServiceDescription(index);
      });

      const wobInvoices = this.wobInvoices;
      wobInvoices.clear();

      workOrderBilling.wobInvoices.forEach(
        (billingInvoices: InvoiceBillings) => {
          const invoiceGroup = this.builder.group({
            invoiceBillingId: billingInvoices.invoiceBillingId,
            billingId: billingInvoices.billingId,
            invoiceBillNumber: billingInvoices.invoiceBillNumber,
            invoiceBillDate: billingInvoices.invoiceBillDate,
          });
          this.wobInvoices.push(invoiceGroup);
        }
      );
    } else {
      console.error('No data found in the response array');
    }
    this.hideLoading();
  }

  clearForm() {
    this.formData.reset();
  }

  formatRate(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;
    if (value.includes('.')) {
      const [integerPart, decimalPart] = value.split('.');
      value = `${integerPart}.${decimalPart.substring(0, 2)}`;
    }
    inputElement.value = value;
  }
  restrictToNumbers(event: KeyboardEvent): boolean {
    const inputElement = event.target as HTMLInputElement;
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Tab',
      '.',
    ];

    const isNumber = /^[0-9]$/.test(event.key);
    const isDecimalAllowed =
      event.key === '.' && !inputElement.value.includes('.');

    return isNumber || allowedKeys.includes(event.key) || isDecimalAllowed;
  }
  convertToNumbers = (dto: any) => {
    dto.workOrderBillingQuantities = dto.workOrderBillingQuantities.map(
      (quantity: any) => ({
        ...quantity,
        value: Number(quantity.value.replace(/,/g, '')),
        quantity: Number(quantity.quantity.toLocaleString().replace(/,/g, '')),
        rate: Number(quantity.rate.toLocaleString().replace(/,/g, '')),

        gstWithAmount:
          quantity.gstWithAmount != null && quantity.gstWithAmount != 0
            ? Number(quantity.gstWithAmount.replace(/,/g, ''))
            : 0,
        amendmentQuantity:
          quantity.amendmentQuantity != null && quantity.amendmentQuantity != 0
            ? Number(quantity.amendmentQuantity.replace(/,/g, ''))
            : 0,
        amendmentAmount:
          quantity.amendmentAmount != null && quantity.amendmentAmount != 0
            ? Number(quantity.amendmentAmount.replace(/,/g, ''))
            : 0,
        gstWithAmountAfterAmendment:
          quantity.gstWithAmountAfterAmendment != null &&
          quantity.gstWithAmountAfterAmendment != 0
            ? Number(quantity.gstWithAmountAfterAmendment.replace(/,/g, ''))
            : 0,
        totalQuantityAfterAmendment:
          quantity.totalQuantityAfterAmendment != null &&
          quantity.totalQuantityAfterAmendment != 0
            ? Number(quantity.totalQuantityAfterAmendment.replace(/,/g, ''))
            : 0,
        totalAmountAfterAmendment:
          quantity.totalAmountAfterAmendment != null &&
          quantity.totalAmountAfterAmendment != 0
            ? Number(quantity.totalAmountAfterAmendment.replace(/,/g, ''))
            : 0,
        totalAmountWthGstAfterAmendment:
          quantity.totalAmountWthGstAfterAmendment != null &&
          quantity.totalAmountWthGstAfterAmendment != 0
            ? Number(quantity.totalAmountWthGstAfterAmendment.replace(/,/g, ''))
            : 0,

        budgetQuantity: Number(
          quantity.budgetQuantity.toLocaleString().replace(/,/g, '')
        ),
        releasedTillPrevious:
          quantity.releasedTillPrevious != null &&
          quantity.releasedTillPrevious != 0
            ? Number(quantity.releasedTillPrevious.replace(/,/g, ''))
            : 0,

        currentPeriod: Number(quantity.currentPeriod.replace(/,/g, '')),
        cumulative: Number(quantity.cumulative.replace(/,/g, '')),
        balance: Number(quantity.balance.replace(/,/g, '')),
        currentPeriodAmount: Number(
          quantity.currentPeriodAmount.replace(/,/g, '')
        ),
      })
    );

    dto.debitAmount =
      dto.debitAmount != null && dto.debitAmount != 0
        ? Number(dto.debitAmount.replace(/,/g, ''))
        : 0;
    dto.advanceRecoveredUptoPreviousBill =
      dto.advanceRecoveredUptoPreviousBill != null &&
      dto.advanceRecoveredUptoPreviousBill != 0
        ? Number(dto.advanceRecoveredUptoPreviousBill.replace(/,/g, ''))
        : 0;
    dto.advanceRecoveredOnThisBill =
      dto.advanceRecoveredOnThisBill != null &&
      dto.advanceRecoveredOnThisBill != 0
        ? Number(dto.advanceRecoveredOnThisBill.replace(/,/g, ''))
        : 0;
    dto.otherRecoveries =
      dto.otherRecoveries != null && dto.otherRecoveries != 0
        ? Number(dto.otherRecoveries.replace(/,/g, ''))
        : 0;

    dto.billingMobilizationAmount =
      dto.billingMobilizationAmount != null &&
      dto.billingMobilizationAmount != 0
        ? Number(dto.billingMobilizationAmount.replace(/,/g, ''))
        : 0;

    return dto;
  };

  viewDownLoads() {
    const dialogRef = this.dialog.open(DocumentComponent, {
      width: '60%',
      height: '500px',
      data: {
        documents: this.billingDocuments,
        isAdding: this.isAdding,
        documentType: this.documentType,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loadDocuments();
    });
  }

  loadDocuments() {
    const uploadedDocuments = this.documentService.getDocuments();
    this.documents = uploadedDocuments;
  }

  fetchGST(): void {
    this.workOrderGstService.fetchAllWorkOrderGst(GST).subscribe({
      next: (gst) => {
        this.gstOutOfKarnataka = gst;
      },
      error: (error: any) => {
        console.error('Error fetching unit of measurements:', error);
      },
    });
  }

  fetchCGST(): void {
    this.workOrderGstService.fetchAllWorkOrderGst(CGST_OR_SGST).subscribe({
      next: (cgst) => {
        this.gstFromKarnataka = cgst;
      },
      error: (error: any) => {
        console.error('Error fetching unit of measurements:', error);
      },
    });
  }

  fetchRetension(): void {
    this.workOrderGstService
      .fetchAllWorkOrderGst(WO_BILLLING_RETENSION)
      .subscribe({
        next: (retensions) => {
          this.retensions = retensions;
        },
        error: (error: any) => {
          console.error('Error fetching unit of measurements:', error);
        },
      });
  }

  fetchWobCheckedBy() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(WOB_CHECKED_BY, '')
      .subscribe({
        next: (users) => {
          this.checkedBy = users;
        },
        error: (error: any) => {
          console.error('Error fetching service group types:', error);
        },
      });
  }
  // onSgstChange(value: any) {
  //   this.formData.get('billingCgst')?.setValue(value);
  //   this.formData.get('billingSgst')?.setValue(value);
  // }

  // onCgstChange(value: any) {
  //   this.formData.get('billingCgst')?.setValue(value);
  //   this.formData.get('billingSgst')?.setValue(value);
  // }
  autoResize(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  autoResizeServiceDescription(index: number) {
    setTimeout(() => {
      const textarea =
        this.serviceDescriptionTextareas.toArray()[index]?.nativeElement;
      if (textarea) {
        this.autoResize(textarea);
      } else {
        console.warn(`Textarea not found for index ${index}`);
      }
    }, 0);
  }

  get wobInvoices(): FormArray {
    return this.formData.get('wobInvoices') as FormArray;
  }

  addInvoices() {
    console.log('addInvoices');
    this.wobInvoices.push(this.wobInvoicesControll());
  }

  removeIcons(index: number) {
    const items = this.wobInvoices;
    items.removeAt(index);
  }

  patchTotalWorkOrderAmountWhileEditing(workOrderes: any) {
    console.log('patchTotalWorkOrderAmountWhileEditing');
    if (!this.isAdding) {
      workOrderes.find((wo: any) => {
        if (wo.workOrderId === this.workOrderBillingsDto.workOrderId) {
          this.totalWorkOrderAmount = wo.totalWorkOrderAmount;
        }
      });
    }
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
