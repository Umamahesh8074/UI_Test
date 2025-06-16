import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommanService } from 'src/app/Services/CommanService/comman.service';

import {
  CGST_OR_SGST,
  GST,
  NAVIGATE_TO_REWORK_WORK_ORDER,
  NAVIGATE_TO_WORK_ORDER_CREATION,
  QUANTITY_CHECK,
} from 'src/app/Constants/WorkOrder/workorder';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { WorkOrderCreationService } from 'src/app/Services/WorkOrderService/WorkOrderCreation/WorkOrderCreation.service';
import { ServiceCodeService } from 'src/app/Services/WorkOrderService/ServiceCode/ServiceCode.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { vendorService } from 'src/app/Services/WorkOrderService/Vendor Data/vendor.service';
import { IProject, Project } from 'src/app/Models/Project/project';
import { IVendor, Vendor } from 'src/app/Models/WorkOrder/VendorData';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TIME_OUT,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  IServiceCodeDto,
  ServiceCodeDto,
} from 'src/app/Models/WorkOrder/ServiceCode';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { DocumentSharedService } from 'src/app/Apis/SharedServices/DocumnetSharedService';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DocumentComponent } from 'src/app/Comman-Components/Dialog/documentmodel/document.component';
import { IWorkOrderHeader } from 'src/app/Models/WorkOrder/WorkOrderHeader';
import { WorkOrderHeaderService } from 'src/app/Services/WorkOrderService/WorkOrderHeader/WorkOrderHeader.service';
import { WorkOrderGstService } from 'src/app/Services/WorkOrderService/WoGst/wo-gst-service';
import { IworkOrderGST } from 'src/app/Models/WorkOrder/WorkOrderGstDetails';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'work-order-creation',
  templateUrl: './work-order-creation.component.html',
  styleUrls: ['./work-order-creation.component.css'],
})
export class AddWorkOrderCreation implements OnInit, AfterViewInit {
  isAdding: boolean | undefined;
  private destroy$ = new Subject<void>();
  formData!: FormGroup;
  workOrderQuantitiesData: any[] = [];
  woStatus: string[] = ['OLD', 'NEW'];
  totalAmount: number = 0;
  selectedWorkOrderCategory: string = 'NEW';
  private observer: MutationObserver | undefined;
  private quantityIndex: number = 0;
  private headerOrderIndex: number = 0;
  private scrollListener: any;
  workOrderDto: any;
  openDialog: boolean | undefined;
  documents: any[] = [];
  selectedFiles: File[] | undefined;
  isForView!: boolean;
  workOrderStatus: string = '';
  title: string = '';
  options: any[] = [];
  isMobilizationInAmount: boolean = true;
  isFromKarnatakaGst: boolean = true;
  stagesData: any;
  workOrderId: number = 0;
  documentType: string = 'WORK_ORDER_DOCUMENTS';
  workOrderDocuments: any;
  gstFromKarnataka: IworkOrderGST[] = [];
  gstOutOfKarnataka: IworkOrderGST[] = [];
  isQuantityExists: boolean[] = [];
  displayPageData: any;

  //modal pagination
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  //stages pagination
  stageTotalItems: number = TOTAL_ITEMS;
  stagePageSize: number = 1;
  stagePageIndex: number = PAGE_INDEX;
  stagePageSizeOptions = pageSizeOptions;

  //documents pagination
  documentTotalItems: number = TOTAL_ITEMS;
  documentPageSize: number = 15;
  documentPageIndex: number = PAGE_INDEX;
  documentPageSizeOptions = pageSizeOptions;

  //project auto complete fields
  projectId: number = 0;
  projectName: string = '';
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);
  selectedProject: any = new Project();

  //headers
  headerIdId: number = 0;
  header: string = '';
  headers: IWorkOrderHeader[] = [];
  headerFormControll: any = new FormControl([] as any[]);
  selectedheader: { [index: number]: any } = {};
  workOrderHeadersPerIndex: { [key: number]: any[] } = {};

  //vendor autocomplete fields
  vendors: IVendor[] = [];
  vendorCode: string = '';
  vendorName: string = '';
  vendorId: number = 0;
  vendor: any = new FormControl([] as IVendor[]);
  selectedVendor: IVendor = new Vendor();
  organizationId: number = 0;

  //service CodesAuto complte fields
  serviceCodes: IServiceCodeDto[] = [];
  serviceCodeName: string = '';
  serviceCodeId: number = 0;
  serviceCodeControl: any = new FormControl([] as IServiceCodeDto[]);
  selectedServicecodes: { [index: number]: any } = {};

  //to show additional fileds
  showAdditionalFields: any[] = [];
  serviceCodesPerIndex: { [key: number]: any[] } = {};
  //show fields for terms and conditions
  showAdditionalFieldsForTermsAndCnditions: any[] = [];

  displayedStageColumns: string[] = [
    'stageId',
    'stageName',
    'stageOrder',
    'actionDoneBy',
    'woReceivedDate',
    'actionDate',
    'stageStatus',
    'actionComments',
  ];

  selectedSGST: number[] = [];
  selectedCGST: number[] = [];
  selectedGST: number[] = [];
  selectedQuantityOrRo: number[] = [];
  matchedObject: any;

  @ViewChild('serviceDescriptionTextarea')
  serviceDescriptionTextarea!: ElementRef;
  @ViewChild('wbsElementsTextarea')
  wbsElementsTextarea!: ElementRef;
  @ViewChild('headerTextarea') headerTextarea!: ElementRef;
  @ViewChild('projectDescTextArea') projectDescTextArea!: ElementRef;
  @ViewChildren('serviceDescriptionTextarea')
  serviceDescriptionTextareas!: QueryList<ElementRef>;
  @ViewChild(CdkVirtualScrollViewport) viewport:
    | CdkVirtualScrollViewport
    | undefined;
  @ViewChildren(MatAutocompleteTrigger)
  autocompleteTriggers!: QueryList<MatAutocompleteTrigger>;

  public Editor = ClassicEditor;
  showPlantCodeError: boolean = false;
  showVendorError: boolean = false;
  serviceCodeErrors: any[] = [];
  headerErrors: any[] = [];
  duplicateHeaderErrors: any[] = [];
  headerNameErrors: any[] = [];
  headerTermsAndConditionsErrors: any[] = [];

  selectedIndex: number = -1;
  selectedHeaderIndex: number = -1;
  selectedOptions: any[] = [];
  selectedServiceCodes: any[] = [];
  selectedHeaders: any[] = [];
  statePageSize: number = 0;
  statePageIndex: number = 0;

  amendmentNumber: number = 0;

  isAmendmentWorkOrder: boolean = false;

  ngOnInit(): void {
    this.fetchQuantityCheck();
    this.fetchGST();
    this.fetchCGST();
    this.initializeFormData();
    this.setUserFromLocalStorage();
    this.fetchProjects();
    this.fetchVendors();
    this.fetchHeaders();
    this.fetchServiceCodes();
    this.getDataFromState();
  }

  constructor(
    private router: Router,
    private workOrderCreationService: WorkOrderCreationService,
    private builder: FormBuilder,
    private commonService: CommanService,
    private toastrService: ToastrService,
    private serviceCodeService: ServiceCodeService,
    private projectService: ProjectService,
    private vendorService: vendorService,
    public dialog: MatDialog,
    private documentService: DocumentSharedService,
    private workOrderHeaderService: WorkOrderHeaderService,
    private cd: ChangeDetectorRef,
    private workOrderGstService: WorkOrderGstService,
    private loaderService: LoaderService
  ) {}

  private initializeFormData() {
    this.formData = this.builder.group({
      id: [0],
      workOrderNumber: [''],
      plantCodeId: [null, Validators.required],
      vendorId: [null, Validators.required],
      status: ['A'],
      termsAndConditions: [''],
      contactPersonName: [''],
      personContactNumber: [
        '',
        [Validators.required, Validators.pattern(/^(?:[6789]\d{9})$/)],
      ],
      subject: [''],
      vendorName: [],
      vendorGst: [''],
      plantDescription: [''],
      plantGst: [''],
      projectName: [''],
      mobilizationIn: [''],
      mobilizationInAmount: [0],
      mobilizationInPercentage: [0],
      workOrderCategory: ['NEW'],
      workOrderQuantities: this.builder.array([
        this.createWorkOrderQuantities(),
      ]),
      workOrderHeaders: this.builder.array([this.createWorkOrderHeaders()]),
    });

    // Subscribe to changes in rate and quantity
    this.formData.get('mobilizationInAmount')?.valueChanges.subscribe(() => {
      this.updateMobilizationAmount();
    });

    this.showAdditionalFields.push({
      serviceCode: '',
      serviceDescription: '',
      serviceUom: '',
      quantity: '',
      rate: '',
      value: '',
      wbsElements: '',
      serviceGroup: '',
      primeActivity: '',
      budgetQuantity: '',
      gst: '',
      sgst: '',
      cgst: '',
      gstWithAmount: '',
    });

    this.showAdditionalFieldsForTermsAndCnditions.push({
      headerName: '',
      headerTermsAndConditons: '',
      headerOrder: '',
    });
  }

  createWorkOrderHeaders(): FormGroup {
    const workOrderHeaders = this.builder.group({
      id: [0],
      headerId: [null, Validators.required],
      headerName: ['', Validators.required],
      headerTermsAndConditions: ['', Validators.required],
      headerOrder: [this.headerOrderIndex],
      headingName: [''],
    });
    this.handleHeaderValueChanges(workOrderHeaders);
    return workOrderHeaders;
  }

  createWorkOrderQuantities(): FormGroup {
    const workOrderQuantities = this.builder.group({
      id: [0],
      serviceCodeId: [, Validators.required],
      quantity: [''],
      amendmentQuantity: [0],
      rate: [''],
      value: [''],
      amendmentAmount: [0],
      gstWithAmountAfterAmendment: [0],
      wbsElements: [''],
      budgetQuantity: [0],
      amendmentBudgetQuantity: [0],
      serviceCode: [''],
      serviceDescription: [''],
      serviceUom: [''],
      serviceGroup: [''],
      primeActivity: [''],
      workOrderCreationId: [0],
      quantityOrder: [0],
      gst: [''],
      cgst: [''],
      sgst: [''],
      quantityOrRo: ['', Validators.required],
      gstWithAmount: [''],
      quantityIndex: [this.quantityIndex],
    });
    this.handleValueChanges(workOrderQuantities);
    return workOrderQuantities;
  }

  private updateMobilizationAmount() {
    const currentValue =
      this.formData.get('mobilizationInAmount')?.value || '0';

    const mobilizationAmount = parseFloat(
      currentValue.toString().replace(/,/g, '')
    );
    const formattedValue = mobilizationAmount.toLocaleString();

    if (currentValue !== formattedValue) {
      this.formData.patchValue(
        {
          mobilizationInAmount: formattedValue,
        },
        { emitEvent: false }
      );
    }
  }

  // Method to calculate and patch the value
  private updateValue(workOrderQuantities: FormGroup) {
    const quantity = parseFloat(
      (workOrderQuantities.get('quantity')?.value || '0')
        .toLocaleString()
        .replace(/,/g, '')
    );

    const amendmentQuantity = parseFloat(
      (workOrderQuantities.get('amendmentQuantity')?.value || '0')
        .toLocaleString()
        .replace(/,/g, '')
    );

    const rate = parseFloat(
      (workOrderQuantities.get('rate')?.value || '0')
        .toLocaleString()
        .replace(/,/g, '')
    );

    const value = quantity * rate;
    const formattedValue = value.toLocaleString();
    workOrderQuantities.patchValue({ value: formattedValue });

    const amendmentValue = amendmentQuantity * rate;
    const formattedAmendmentValue = amendmentValue.toLocaleString();

    workOrderQuantities.patchValue({
      amendmentAmount: formattedAmendmentValue,
    });
  }

  private updateCgstAndSgstWithAmount(workOrderQuantities: FormGroup) {
    const value = parseFloat(
      (workOrderQuantities.get('value')?.value || '0')
        .toLocaleString()
        .replace(/,/g, '')
    );

    const amendmentAmount = parseFloat(
      (workOrderQuantities.get('amendmentAmount')?.value || '0')
        .toLocaleString()
        .replace(/,/g, '')
    );
    const cgst = parseFloat(
      (workOrderQuantities.get('cgst')?.value || '0')
        .toLocaleString()
        .replace(/,/g, '')
    );

    const cgstObject = this.gstFromKarnataka.find((item) => item.id == cgst);

    if (cgstObject) {
      var totalCgstAndSgst = cgstObject.gstPercentage * 2;
      const gstWithAmount = value * (1 + totalCgstAndSgst / 100);
      const amendmentAmountWithGst =
        amendmentAmount * (1 + totalCgstAndSgst / 100);
      const formattedValue = gstWithAmount.toLocaleString();
      const formattedAmendmentWithGstValue =
        amendmentAmountWithGst.toLocaleString();
      workOrderQuantities.patchValue({ gstWithAmount: formattedValue });
      workOrderQuantities.patchValue({
        gstWithAmountAfterAmendment: formattedAmendmentWithGstValue,
      });
    }
  }

  private updateGstWithAmount(workOrderQuantities: FormGroup) {
    const value = parseFloat(
      (workOrderQuantities.get('value')?.value || '0')
        .toLocaleString()
        .replace(/,/g, '')
    );

    const amendmentAmount = parseFloat(
      (workOrderQuantities.get('amendmentAmount')?.value || '0')
        .toLocaleString()
        .replace(/,/g, '')
    );

    const gst = parseFloat(
      (workOrderQuantities.get('gst')?.value || '0')
        .toLocaleString()
        .replace(/,/g, '')
    );

    const gstObject = this.gstOutOfKarnataka.find((item) => item.id == gst);
    if (gstObject) {
      const gstWithAmount = value * (1 + gstObject.gstPercentage / 100);
      const formattedValue = gstWithAmount.toLocaleString();

      const amendmentAmountWithGst =
        amendmentAmount * (1 + gstObject.gstPercentage / 100);
      const formattedAmendmentWithGstValue =
        amendmentAmountWithGst.toLocaleString();

      workOrderQuantities.patchValue({ gstWithAmount: formattedValue });
      workOrderQuantities.patchValue({
        gstWithAmountAfterAmendment: formattedAmendmentWithGstValue,
      });
    }
  }

  get isAmountSelected() {
    return this.formData.get('mobilizationIn')?.value == '1';
  }

  get isPercentageSelected() {
    const percentageSelected =
      this.formData.get('mobilizationIn')?.value == '2';
    this.formData
      .get('mobilizationInPercentage')
      ?.setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]);
    return percentageSelected;
  }

  //get data rom state to update
  getDataFromState() {
    const {
      workOrderCreationDto,
      isAdding,
      isForView,
      workOrderStatus,
      title,
      stagesData,
      vendors,
      projects,
      totalAmount,
      displayPage,
      statePageSize,
      statePageIndex,
    } = history.state;

    console.log('state data', history.state);
    this.amendmentNumber =
      workOrderCreationDto?.amendmentNumber ?? this.amendmentNumber;
    console.log(this.amendmentNumber);
    if (projects) {
      this.projects = projects;
    }
    if (vendors) {
      this.vendors = vendors;
    }

    if (displayPage) {
      this.displayPageData = displayPage;
    }

    if (workOrderStatus === 'Amendment') {
      this.title = 'AMENDMENT WORK ORDER';
      this.isForView = true;
      this.isAdding = false;
      this.workOrderStatus = 'Amendment_Editing';
    } else if (workOrderStatus === 'Reworking') {
      this.title = 'EDIT WORK ORDER';
      this.isAdding = false;

      this.workOrderStatus = 'Rework_Editing';
    } else {
      this.isAdding = isAdding ?? this.isAdding;
      this.isForView = isForView ?? this.isForView;

      this.workOrderStatus = workOrderStatus ?? this.workOrderStatus;
      this.title = title ?? this.title;
    }

    console.log('workOrderStatus', workOrderStatus);

    this.isAmendmentWorkOrder =
      this.amendmentNumber && workOrderStatus !== 'Approved' ? true : false;
    console.log('isAmendmentWorkOrder', this.isAmendmentWorkOrder);
    this.isForView = this.isAmendmentWorkOrder
      ? true
      : isForView ?? this.isForView;
    this.statePageSize = statePageSize;
    this.statePageIndex = statePageIndex;
    if (stagesData) {
      this.stagesData = stagesData;
    }
    this.workOrderDto = workOrderCreationDto || this.workOrderDto;
    this.totalAmount = totalAmount;
    if (workOrderCreationDto?.id > 0) {
      this.workOrderId = workOrderCreationDto.id;
      this.getDocumentsBasedOnId();
    }
    console.log(this.isForView);
    if (!this.isAdding) {
      this.patchFormDataWithWorkOrder();
      this.patchAdditionalFields();
      this.patchTermsAndConFields();
    }
  }

  private patchAdditionalFields() {
    if (this.workOrderDto && this.workOrderDto.workOrderQuantitiesDto) {
      this.showAdditionalFields = this.workOrderDto.workOrderQuantitiesDto.map(
        (item: any) => ({
          serviceCode: item.serviceCode,
          serviceDescription: item.serviceDescription,
          serviceUom: item.serviceUom,
          quantity: item.quantity,
          rate: item.rate,
          value: item.value,
          wbsElements: item.wbsElements,
          serviceGroup: item.serviceGroup,
          primeActivity: item.primeActivity,
          budgetQuantity: item.budgetQuantity,
        })
      );
    }
  }

  private patchTermsAndConFields() {
    if (
      this.workOrderDto &&
      this.workOrderDto.workOrderHeaderTermsAndConditions
    ) {
      this.showAdditionalFieldsForTermsAndCnditions =
        this.workOrderDto.workOrderHeaderTermsAndConditions.map(
          (item: any) => ({
            headerName: item.headerName,
            headerTermsAndConditions: item.headerTermsAndConditions,
            headerOrder: item.headerOrder,
            headingName: item.headerName,
          })
        );
    }
  }

  private patchFormDataWithWorkOrder() {
    const plantCodeId = this.workOrderDto.plantCodeId;
    const vendorId = this.workOrderDto.vendorId;
    if (plantCodeId) {
      this.fetchPlantCodeById(plantCodeId);
    }
    if (vendorId) {
      this.fetchVendorById(vendorId);
    }
    this.patchBasicFormData();
    this.populateWorkOrderQuantities();
    this.populateWorkOrderTermsAndConditions();
  }

  private patchBasicFormData() {
    const vendorGst = this.workOrderDto.vendorGstNumber;
    if (vendorGst && vendorGst.startsWith(29)) {
      this.isFromKarnatakaGst = true;
    } else {
      this.isFromKarnatakaGst = false;
    }
    if (this.workOrderDto.workOrderCategory === 'OLD') {
      this.selectedWorkOrderCategory = this.workOrderDto.workOrderCategory;
      var workOrderNumber = this.workOrderDto.workOrderNumber;
    } else {
      this.workOrderDto.workOrderCategory = 'NEW';
    }

    this.formData.patchValue({
      id: this.workOrderDto.id,
      plantCodeId: this.workOrderDto.plantCodeId,
      vendorId: this.workOrderDto.vendorId,
      status: this.workOrderDto.status,
      vendorName: this.workOrderDto.vendorName,
      plantDescription: this.workOrderDto.plantCodeDescription,
      termsAndConditions: this.workOrderDto.termsAndConditions,
      contactPersonName: this.workOrderDto.contactPersonName,
      personContactNumber: this.workOrderDto.personContactNumber,
      vendorGst: this.workOrderDto.vendorGstNumber,
      plantGst: this.workOrderDto.projectNumber,
      subject: this.workOrderDto.subject,
      mobilizationIn: this.workOrderDto.mobilizationIn,
      mobilizationInAmount:
        this.workOrderDto.mobilizationInAmount.toLocaleString(),
      mobilizationInPercentage: this.workOrderDto.mobilizationInPercentage,
      workOrderCategory: this.workOrderDto.workOrderCategory,
      workOrderNumber: workOrderNumber,
    });
  }

  private populateWorkOrderTermsAndConditions() {
    const workOrderHeadersArray = this.formData.get(
      'workOrderHeaders'
    ) as FormArray;
    workOrderHeadersArray.clear();
    this.workOrderDto.workOrderHeaderTermsAndConditions.forEach(
      (item: any, index: number) => {
        const workOrderHeadersGroup = this.builder.group({
          id: item.id,
          headerId: item,
          headerName: item.headerName,
          headerTermsAndConditions: item.headerTermsAndConditions,
          headerOrder: item.headerOrder,
          headingName: item.headerName,
        });
        this.handleHeaderValueChanges(workOrderHeadersGroup);
        workOrderHeadersArray.push(workOrderHeadersGroup);
      }
    );
    this.selectedHeaders.forEach((_, index) => {
      this.checkAndUpdateHeaderDuplicateErrors(index);
    });
  }

  private populateWorkOrderQuantities() {
    const workOrderQuantitiesArray = this.formData.get(
      'workOrderQuantities'
    ) as FormArray;
    workOrderQuantitiesArray.clear();

    this.workOrderDto.workOrderQuantitiesDto.forEach(
      (item: any, index: number) => {
        console.log(item);
        if (item.quantityOrRo == 'RO') {
          this.isQuantityExists[index] = false;
        } else {
          this.isQuantityExists[index] = true;
        }
        const workOrderQuantityGroup = this.builder.group({
          id: item.workOrderQuantityid,
          serviceCodeId: item,
          quantity: this.isAmendmentWorkOrder
            ? item.quantity.toLocaleString()
            : item.totalQuantityAfterAmendment.toLocaleString(),
          amendmentQuantity: !this.isAmendmentWorkOrder
            ? '0'
            : item.amendmentQuantity.toLocaleString(),
          rate: item.rate.toLocaleString(),
          value: item.totalAmountAfterAmedment.toLocaleString(),
          amendmentAmount: !this.isAmendmentWorkOrder
            ? '0'
            : item.amendmentAmount.toLocaleString(),
          wbsElements: item.wbsElements,
          budgetQuantity: this.isAmendmentWorkOrder
            ? item.budgetQuantity.toLocaleString()
            : item.totalBudgetQuantityAfterAmendment.toLocaleString(),
          amendmentBudgetQuantity: !this.isAmendmentWorkOrder
            ? '0'
            : item.amendmentBudgetQuantity.toLocaleString(),
          serviceCode: item.serviceCode,
          serviceDescription: item.serviceDescription,
          serviceUom: item.scUomRefValue,
          serviceGroup: item.serviceGroupCode,
          primeActivity: item.primeActivityNumber,
          workOrderCreationId: item.workOrderCreationId,
          quantityOrder: item.quantityOrder,
          gst: item.gstId,
          cgst: item.cgstId,
          sgst: item.sgstId,
          gstWithAmount: this.isAmendmentWorkOrder
            ? item.gstWithAmount.toLocaleString()
            : item.totalAmountWthGstAfterAmendment.toLocaleString(),
          gstWithAmountAfterAmendment: !this.isAmendmentWorkOrder
            ? '0'
            : item.gstWithAmountAfterAmendment.toLocaleString(),
          quantityOrRo: item.quantityOrRoId,
          quantityIndex: item.quantityIndex,
        });
        this.handleValueChanges(workOrderQuantityGroup);
        workOrderQuantitiesArray.push(workOrderQuantityGroup);
        this.updateValue(workOrderQuantityGroup);
      }
    );
    // After populating the form, check for duplicates
    this.selectedServiceCodes.forEach((_, index) => {
      this.checkAndUpdateDuplicateErrors(index);
    });
  }

  private handleHeaderValueChanges(workOrderHeaderGroup: FormGroup) {
    const headerNameControl = workOrderHeaderGroup.get('headerName');
    const headerTermsAndConditionsControl = workOrderHeaderGroup.get(
      'headerTermsAndConditions'
    );

    // const headerOrderControl = workOrderHeaderGroup.get('headerOrder');
    headerNameControl?.valueChanges.subscribe(() => {
      this.validateHeaderName();
    });

    // Listen for changes on the 'headerTermsAndConditions' field
    headerTermsAndConditionsControl?.valueChanges.subscribe(() => {
      this.validateHeaderTermsAndConditions();
    });
  }

  private validateHeaderName(): void {
    const workOrderHeaders = this.formData.get('workOrderHeaders') as FormArray;
    this.headerNameErrors = [];

    for (let i = 0; i < workOrderHeaders.length; i++) {
      const headerNameControl = workOrderHeaders.at(i).get('headerName');
      if (headerNameControl?.invalid || headerNameControl?.value === '') {
        this.headerNameErrors[i] = true;
        headerNameControl?.setErrors({ required: true });
      } else {
        this.headerNameErrors[i] = false;
        headerNameControl?.setErrors(null);
      }
    }
  }
  private validateHeaderTermsAndConditions(): void {
    const workOrderHeaders = this.formData.get('workOrderHeaders') as FormArray;
    this.headerTermsAndConditionsErrors = [];
    for (let i = 0; i < workOrderHeaders.length; i++) {
      const headerTermsAndConditionsControl = workOrderHeaders
        .at(i)
        .get('headerTermsAndConditions');
      const value = headerTermsAndConditionsControl?.value?.trim();
      if (headerTermsAndConditionsControl?.invalid || !value) {
        this.headerTermsAndConditionsErrors[i] = true;
        headerTermsAndConditionsControl?.setErrors({ required: true });
        headerTermsAndConditionsControl?.markAsTouched();
      } else {
        this.headerTermsAndConditionsErrors[i] = false;
      }
    }
  }

  private handleValueChanges(workOrderQuantityGroup: FormGroup) {
    workOrderQuantityGroup.get('quantityOrRo')?.valueChanges.subscribe(() => {
      this.updateValue(workOrderQuantityGroup);
      this.updateCgstAndSgstWithAmount(workOrderQuantityGroup);
      this.validateFields(workOrderQuantityGroup);
    });

    workOrderQuantityGroup.get('quantity')?.valueChanges.subscribe(() => {
      this.updateValue(workOrderQuantityGroup);
      this.updateCgstAndSgstWithAmount(workOrderQuantityGroup);
      this.validateFields(workOrderQuantityGroup);
    });

    workOrderQuantityGroup
      .get('amendmentQuantity')
      ?.valueChanges.subscribe(() => {
        console.log('Amendment Quantity changed');
        this.updateValue(workOrderQuantityGroup);
        this.updateGstWithAmount(workOrderQuantityGroup);
        this.updateCgstAndSgstWithAmount(workOrderQuantityGroup);
        this.validateFields(workOrderQuantityGroup);
      });

    workOrderQuantityGroup.get('rate')?.valueChanges.subscribe(() => {
      this.updateValue(workOrderQuantityGroup);
      this.updateGstWithAmount(workOrderQuantityGroup);
      this.updateCgstAndSgstWithAmount(workOrderQuantityGroup);
      this.validateFields(workOrderQuantityGroup);
    });

    workOrderQuantityGroup.get('value')?.valueChanges.subscribe(() => {
      this.updateGstWithAmount(workOrderQuantityGroup);
      this.updateCgstAndSgstWithAmount(workOrderQuantityGroup);
    });

    workOrderQuantityGroup
      .get('mobilizationInPercentage')
      ?.valueChanges.subscribe(() => {
        this.validateFields(workOrderQuantityGroup);
      });

    workOrderQuantityGroup.get('gst')?.valueChanges.subscribe(() => {
      this.updateGstWithAmount(workOrderQuantityGroup);
      this.validateFields(workOrderQuantityGroup);
    });

    workOrderQuantityGroup.get('cgst')?.valueChanges.subscribe(() => {
      this.updateCgstAndSgstWithAmount(workOrderQuantityGroup);
      this.validateFields(workOrderQuantityGroup);
    });

    workOrderQuantityGroup.get('sgst')?.valueChanges.subscribe(() => {
      this.updateCgstAndSgstWithAmount(workOrderQuantityGroup);
      this.validateFields(workOrderQuantityGroup);
    });
  }

  fetchWorkOrderHeaderById(headerId: number, index: number) {
    this.workOrderHeaderService.getWorkOrderHeaderById(headerId).subscribe({
      next: (workOrderHeaders) => {
        this.selectedheader[index] = workOrderHeaders;
      },
      error: (error: Error) => {
        console.error(error);
      },
    });
  }

  private fetchPlantCodeById(plantCodeId: number) {
    const filteredProject = this.projects.find(
      (project) => project.projectId === plantCodeId
    );
    this.project.patchValue(filteredProject);
  }
  private fetchVendorById(vendorId: number) {
    const filteredVendor = this.vendors.find(
      (vendor) => vendor.id === vendorId
    );
    this.vendor.patchValue(filteredVendor);
  }

  //getting user from local storage to set organization id
  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
    }
  }

  get workOrderQuantities(): FormArray {
    return this.formData.get('workOrderQuantities') as FormArray;
  }

  get workOrderHeaders(): FormArray {
    return this.formData.get('workOrderHeaders') as FormArray;
  }

  // remove indent items
  removeIcons(index: any) {
    if (!this.isAdding) {
      const workOrderQuantitiesArray = this.formData.get(
        'workOrderQuantities'
      ) as FormArray;
      const formGroupAtIndex = workOrderQuantitiesArray.at(index) as FormGroup;
      const dataToRemove = formGroupAtIndex.value;
      this.openConfirmDialog(dataToRemove.id, index);
    } else {
      if (this.showAdditionalFields.length > 1 && this.isAdding) {
        this.showAdditionalFields.splice(index, 1);
        const workOrderQuantitiesArray = this.formData.get(
          'workOrderQuantities'
        ) as FormArray;
        workOrderQuantitiesArray.removeAt(index);
        this.formData.setControl(
          'workOrderQuantities',
          this.builder.array(workOrderQuantitiesArray.controls)
        );
      } else {
        console.error('item should be atleast one');
      }
    }

    // if (this.showAdditionalFields.length > 1 && this.isAdding) {
    //   this.showAdditionalFields.splice(index, 1);
    //   const workOrderQuantitiesArray = this.formData.get(
    //     'workOrderQuantities'
    //   ) as FormArray;
    //   workOrderQuantitiesArray.removeAt(index);
    // } else {
    //   console.error('item should be atleast one');
    // }
  }
  addServiceCodes(i: number): void {
    const newServiceCode = {
      serviceCode: '',
      serviceDescription: '',
      serviceUom: '',
      quantity: '',
      rate: '',
      value: '',
      wbsElements: '',
      serviceGroup: '',
      primeActivity: '',
      budgetQuantity: '',
    };
    this.quantityIndex = i + 1;
    this.showAdditionalFields.splice(i + 1, 0, newServiceCode);
    const newWorkOrderQuantity = this.createWorkOrderQuantities();
    this.workOrderQuantities.controls.splice(i + 1, 0, newWorkOrderQuantity);
    this.formData.setControl(
      'workOrderQuantities',
      this.builder.array(this.workOrderQuantities.controls)
    );
  }

  addTermsAndConditions(i: number): void {
    const newWoHeader = {
      headerName: '',
      headerTermsAndConditons: '',
      headerOrder: '',
    };

    this.headerOrderIndex = i + 1;
    this.showAdditionalFieldsForTermsAndCnditions.splice(i + 1, 0, newWoHeader);
    const newWorkOrderHeader = this.createWorkOrderHeaders();
    (this.formData.get('workOrderHeaders') as FormArray).insert(
      i + 1,
      newWorkOrderHeader
    );
  }

  removeWorkOrderHeaderIcons(index: number) {
    if (!this.isAdding) {
      const workOrderHeadersArray = this.formData.get(
        'workOrderHeaders'
      ) as FormArray;
      const formGroupAtIndex = workOrderHeadersArray.at(index) as FormGroup;
      const dataToRemove = formGroupAtIndex.value;
      this.openConfirmationDialog(dataToRemove.id, index);
    } else {
      if (
        this.showAdditionalFieldsForTermsAndCnditions.length > 1 &&
        this.isAdding
      ) {
        this.showAdditionalFieldsForTermsAndCnditions.splice(index, 1);
        const workOrderHeadersArray = this.formData.get(
          'workOrderHeaders'
        ) as FormArray;
        workOrderHeadersArray.removeAt(index);
        this.formData.setControl(
          'workOrderHeaders',
          this.builder.array(workOrderHeadersArray.controls)
        );
      } else {
        console.error('item should be atleast one');
      }
    }
  }

  openConfirmationDialog(id: any, index: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Work Order' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteWorkOrderHeader(id, index);
          // if (this.showAdditionalFieldsForTermsAndCnditions.length > 1) {
          //   this.showAdditionalFieldsForTermsAndCnditions.splice(index, 1);
          //   const workOrderHeadersArray = this.formData.get(
          //     'workOrderHeaders'
          //   ) as FormArray;
          //   workOrderHeadersArray.removeAt(index);
          // }
        }
      }
    );
  }

  // openConfirmDialog(id: number) {}
  openConfirmDialog(workOrderId: any, index: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Work Order' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteWorkOrderQuantity(workOrderId, index);
          // if (this.showAdditionalFields.length > 1) {
          //   this.showAdditionalFields.splice(index, 1);
          //   const workOrderQuantitiesArray = this.formData.get(
          //     'workOrderQuantities'
          //   ) as FormArray;
          //   workOrderQuantitiesArray.removeAt(index);
          // }
        }
      }
    );
  }

  deleteWorkOrderQuantity(woQId: number, index: number) {
    this.workOrderCreationService.deleteWorkOrderQuantity(woQId).subscribe({
      next: () => {
        const workOrderQuantitiesArray = this.formData.get(
          'workOrderQuantities'
        ) as FormArray;
        workOrderQuantitiesArray.removeAt(index);
        this.formData.setControl(
          'workOrderQuantities',
          this.builder.array(workOrderQuantitiesArray.controls)
        );
      },
      error: (error: Error) => {
        console.error(error);
      },
    });
  }

  deleteWorkOrderHeader(id: number, index: number) {
    this.showLoading();
    this.workOrderHeaderService
      .deleteWorkOrderTermsAndConditions(id)
      .subscribe({
        next: () => {
          const workOrderHeadersArray = this.formData.get(
            'workOrderHeaders'
          ) as FormArray;
          workOrderHeadersArray.removeAt(index);
          // this.formData.setControl(
          //   'workOrderHeaders',
          //   this.builder.array(workOrderHeadersArray.controls)
          // );
          if (
            this.headerTermsAndConditionsErrors &&
            this.headerTermsAndConditionsErrors.length > index
          ) {
            this.headerTermsAndConditionsErrors.splice(index, 1);
          }
          this.hideLoading();
        },
        error: (error: Error) => {
          console.error(error);
          this.hideLoading();
        },
      });
  }

  //fetch projects based on organization id
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
          this.projects = projects;
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  displayProject(project: IProject) {
    return project && project.displayProjectName
      ? project.displayProjectName
      : '';
  }
  onProjectSelect(project: any) {
    const projectData = project.option.value;
    if (projectData) {
      this.formData.patchValue({
        plantCodeId: projectData.projectId,
        plantDescription: projectData.description,
        projectName: projectData.projectName,
        plantGst: projectData.projectGstinUin,
      });
    }
    this.showPlantCodeError = false;
  }
  searchProject(project: any) {
    const query = project.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.projectName = query;
      this.fetchProjects();
    }
  }

  fetchHeaders() {
    this.workOrderHeaderService
      .getWorkOrderHeaders(this.header)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (woHeaders) => {
          this.headers = woHeaders;
          this.workOrderHeadersPerIndex = {};
        },
        error: (error: Error) => {
          console.error('Error fetching woHeaders:', error);
        },
      });
  }

  displayHeader(woHeader: IWorkOrderHeader) {
    return woHeader && woHeader.headerName ? woHeader.headerName : '';
  }

  searchHeader(event: any, index: number) {
    const query = event.target.value.trim().toLowerCase();
    const filteredHeaders = this.headers.filter((header) =>
      header.headerName.toLowerCase().includes(query)
    );
    this.workOrderHeadersPerIndex[index] = filteredHeaders;
  }

  getFilteredHeaders(index: number): any[] {
    const woHeaders = this.workOrderHeadersPerIndex[index] || this.headers;
    return woHeaders;
  }

  onHeaderSelect(event: any, index: number, woHeader: any): void {
    this.headerErrors[index] = false;
    const selectedHeaderId = event.option.value.id;
    this.validateHeader(selectedHeaderId, woHeader.value.id).subscribe({
      next: (response: string) => {
        this.selectedHeaders[index] = selectedHeaderId;
        this.fetchAndUpdateHeaders(selectedHeaderId, index);
        this.checkAndUpdateHeaderDuplicateErrors(index);
      },
      error: (error: any) => {
        this.duplicateHeaderErrors[index] = true;
      },
    });
  }

  private validateHeader(selectedHeaderId: number, tcId: number) {
    return this.workOrderHeaderService
      .validatHeader(this.workOrderId, selectedHeaderId, tcId)
      .pipe(takeUntil(this.destroy$));
  }

  private fetchAndUpdateHeaders(headerId: number, index: number): void {
    this.workOrderHeaderService.getWorkOrderHeaderById(headerId).subscribe({
      next: (response) => {
        const headersData = response;
        if (headersData) {
          this.updateFormGroupWithHeaderData(headersData, index);
        }
      },
      error: (error) => {
        console.error('Error fetching service codes', error);
      },
    });
  }

  private updateFormGroupWithHeaderData(headerData: any, index: number): void {
    const workOrderHeadersArray = this.formData.get(
      'workOrderHeaders'
    ) as FormArray;
    if (index < workOrderHeadersArray.length) {
      const workOrderHeaderGroup = workOrderHeadersArray.at(index) as FormGroup;
      workOrderHeaderGroup.patchValue({
        headerId: headerData,
        headerName: headerData.headerName,
        headerTermsAndConditions: headerData.headerTermsAndConditions,
      });
    }
  }

  //added siva
  fetchVendors() {
    this.vendorService
      .getVendorCodesWithOutPage(this.vendorCode, this.vendorName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vendorCode) => {
          this.vendors = vendorCode;
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  onVendorCodeSelect(event: any) {
    if (!this.isAdding && this.workOrderDto.vendorId == event.option.value.id) {
      this.populateWorkOrderQuantities();
    }
    const selectedVendor = event.option.value;
    const vendorId = event.option.value.id;
    const vendorGst = event.option.value.gstNumber;
    this.isFromKarnatakaGst = vendorGst.startsWith('29');
    this.selectedVendor.vendorName = selectedVendor.vendorName;
    this.formData.patchValue({
      vendorId: vendorId,
      vendorGst: vendorGst,
    });
    this.showVendorError = false;
  }

  validateFieldsOnSave() {
    this.workOrderQuantities.controls.forEach((control) => {
      if (this.isFromKarnatakaGst) {
        control.get('gst')?.clearValidators();
        control.get('gst')?.reset();
        control.get('cgst')?.setValidators([Validators.required]);
        control.get('sgst')?.setValidators([Validators.required]);
      } else {
        control.get('gst')?.setValidators([Validators.required]);
        control.get('cgst')?.clearValidators();
        control.get('cgst')?.reset();
        control.get('sgst')?.clearValidators();
        control.get('sgst')?.reset();
      }
      control.get('gst')?.updateValueAndValidity();
      control.get('cgst')?.updateValueAndValidity();
      control.get('sgst')?.updateValueAndValidity();
    });
  }

  displayVendorCode(vendor: Vendor) {
    return vendor && vendor.vendorCode ? vendor.vendorCode : '';
  }

  searchVendorCode(event: any) {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.vendorCode = query;
      this.fetchVendors();
    }
  }

  searchVendorName(event: any) {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.vendorName = query;
      this.fetchVendors();
    }
  }

  onVendorNameSelect(event: any) {
    if (!this.isAdding && this.workOrderDto.vendorId == event.option.value.id) {
      this.populateWorkOrderQuantities();
    }
    const selectedVendor = event.option.value;
    const vendorId = event.option.value.id;
    const vendorGst = event.option.value.gstNumber;
    this.isFromKarnatakaGst = vendorGst.startsWith('29');
    this.selectedVendor.vendorCode = selectedVendor.vendorCode;
    this.formData.patchValue({
      vendorId: vendorId,
      vendorGst: vendorGst,
    });
  }
  displayVendorName(vendor: Vendor) {
    return vendor && vendor.vendorName ? vendor.vendorName : '';
  }

  fetchServiceCodes(): void {
    this.serviceCodeService
      .getServiceCodeDtosWithOutPage(this.serviceCodeName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (serviceCodes) => {
          this.serviceCodes = serviceCodes;
          this.serviceCodesPerIndex = {};
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  onServiceCodeSelectionChange(event: any, index: number): void {
    this.serviceCodeErrors[index] = false;
    const selectedServiceCodeId = event.option.value.serviceCodeId;
    this.selectedServiceCodes[index] = selectedServiceCodeId;
    this.fetchAndUpdateServiceCodes(selectedServiceCodeId, index);
    this.checkAndUpdateDuplicateErrors(index);
  }

  checkAndUpdateDuplicateErrors(selectedIndex: number): void {
    const selectedServiceCodeId = this.selectedServiceCodes[selectedIndex];
    for (let i = 0; i < this.selectedServiceCodes.length; i++) {
      if (
        i !== selectedIndex &&
        this.selectedServiceCodes[i] === selectedServiceCodeId
      ) {
        break;
      }
    }
  }

  checkAndUpdateHeaderDuplicateErrors(selectedIndex: number): void {
    this.duplicateHeaderErrors = this.duplicateHeaderErrors.map(() => false);
    const selectedHeaderId = this.selectedHeaders[selectedIndex];
    for (let i = 0; i < this.selectedHeaders.length; i++) {
      if (i !== selectedIndex && this.selectedHeaders[i] === selectedHeaderId) {
        this.duplicateHeaderErrors[selectedIndex] = true;
        break;
      }
    }
  }

  isThisServiceCodeSelected(
    selectedServiceCodeId: any,
    currentIndex: number
  ): boolean {
    return this.formData.value.workOrderQuantities.some(
      (wo: any, index: number) => {
        return (
          wo.serviceCodeId === selectedServiceCodeId && index !== currentIndex
        );
      }
    );
  }

  isThisHeaderSelected(headerId: any): boolean {
    return this.formData.value.workOrderHeaders.some(
      (wo: any) => wo.headerId === headerId
    );
  }

  searchServiceCode(event: any, index: number) {
    const query = event.target.value.trim().toLowerCase();
    const filteredServiceCodes = this.serviceCodes.filter((serviceCode) =>
      serviceCode.serviceCode.toLowerCase().includes(query)
    );
    this.serviceCodesPerIndex[index] = filteredServiceCodes;
  }

  getFilteredServiceCodes(index: number): any[] {
    const serviceCodes = this.serviceCodesPerIndex[index] || this.serviceCodes;
    return serviceCodes;
  }

  private fetchAndUpdateServiceCodes(
    serviceCodeId: number,
    index: number
  ): void {
    this.serviceCodeService
      .getServiceCodesByServiceCode(serviceCodeId)
      .subscribe({
        next: (response) => {
          const serviceData = response;
          if (serviceData) {
            this.updateFormGroupWithServiceData(serviceData, index);
          }
        },
        error: (error) => {
          console.error('Error fetching service codes', error);
        },
      });
  }

  private updateFormGroupWithServiceData(
    serviceData: any,
    index: number
  ): void {
    const workOrderQuantitiesArray = this.formData.get(
      'workOrderQuantities'
    ) as FormArray;
    if (index < workOrderQuantitiesArray.length) {
      const workOrderGroup = workOrderQuantitiesArray.at(index) as FormGroup;
      workOrderGroup.patchValue({
        serviceCodeId: serviceData,
        serviceDescription: serviceData.serviceDescription,
        primeActivity: serviceData.primeActivityNumber,
        serviceUom: serviceData.scUomRefValue,
        serviceGroup: serviceData.serviceGroupCode,
      });
    }
    this.autoResizeServiceDescription(index);
  }

  displayServiceCode(serviceCode: any) {
    return serviceCode && serviceCode.serviceCode
      ? serviceCode.serviceCode
      : '';
  }

  save() {
    if (this.duplicateHeaderErrors.some((error) => error)) return;

    this.validateFieldsOnSave();
    this.markRequiredFields();
    const hasErrors = this.validateFormArrays();

    if (this.formData.invalid || hasErrors) return;

    const dataToSend = this.preparePayload();
    const transformedWo = this.transformWorkOrder(dataToSend);
    const convertedWorkOrderDto = this.convertToNumbers(transformedWo);
    const formData = this.buildFormData(transformedWo);

    if (this.formData.touched && this.formData.valid) {
      this.showLoading();
      const saveOrUpdate$ = this.isAdding
        ? this.workOrderCreationService.addWorkOrderCreation(formData)
        : this.workOrderCreationService.updateWorkOrderCreation(
            formData,
            this.workOrderStatus
          );

      saveOrUpdate$.subscribe({
        next: (response) => {
          this.handleSuccessResponse(response);
          this.hideLoading();
          this.documentService.setDocuments([]);
        },
        error: (error: Error) => {
          console.error(error);
          this.handleErrorResponse(error);
          this.hideLoading();
        },
      });
    } else {
      this.hideLoading();
    }
  }

  private markRequiredFields() {
    this.showPlantCodeError = false;
    this.showVendorError = false;

    const plantCodeControl = this.formData.get('plantCodeId');
    const vendorControl = this.formData.get('vendorId');

    plantCodeControl?.markAsTouched();
    vendorControl?.markAsTouched();

    if (plantCodeControl?.invalid) this.showPlantCodeError = true;
    if (vendorControl?.invalid) this.showVendorError = true;
  }
  private validateFormArrays(): boolean {
    let hasServiceCodeError = false;
    let hasHeaderError = false;
    let hasTermsAndConError = false;

    this.serviceCodeErrors = [];
    this.headerErrors = [];
    this.headerTermsAndConditionsErrors = [];
    this.headerNameErrors = [];

    const workOrderQuantities = this.formData.get(
      'workOrderQuantities'
    ) as FormArray;
    workOrderQuantities.controls.forEach((group, i) => {
      const serviceCodeIdControl = group.get('serviceCodeId');
      if (serviceCodeIdControl?.invalid) {
        this.serviceCodeErrors[i] = true;
        hasServiceCodeError = true;
      } else {
        this.serviceCodeErrors[i] = false;
      }
    });

    const workOrderHeaders = this.formData.get('workOrderHeaders') as FormArray;
    workOrderHeaders.controls.forEach((group, i) => {
      const headerNameControl = group.get('headerName');
      const headerControl = group.get('headerId');
      const termsControl = group.get('headerTermsAndConditions');
      const termsValue = termsControl?.value;

      this.headerNameErrors[i] = headerNameControl?.invalid || false;
      this.headerErrors[i] = headerControl?.invalid || false;
      this.headerTermsAndConditionsErrors[i] =
        termsControl?.invalid || !termsValue?.trim();

      if (headerControl?.invalid) hasHeaderError = true;
      if (termsControl?.invalid || !termsValue?.trim())
        hasTermsAndConError = true;
    });

    return hasServiceCodeError || hasHeaderError || hasTermsAndConError;
  }

  private transformWorkOrder(dataToSend: any): any {
    return {
      ...this.formData.value,
      workOrderQuantities: dataToSend.workOrderQuantities.map((item: any) => ({
        ...item,
        serviceCodeId:
          typeof item.serviceCodeId === 'object'
            ? item.serviceCodeId.serviceCodeId
            : item.serviceCodeId,
      })),
      workOrderHeaders: dataToSend.workOrderHeaders.map((item: any) => {
        let headerId: any;

        if (this.isAdding) {
          headerId = item.headerId?.id;
        } else {
          if (typeof item.headerId === 'object' && item.id > 0) {
            headerId = item.headerId.headerId;
          } else {
            headerId = item.headerId?.id;
          }
        }

        return {
          ...item,
          headerId,
        };
      }),
    };
  }

  private buildFormData(workOrderData: any): FormData {
    const formData = new FormData();
    this.selectedFiles = this.getDocumentsArray(this.documents);
    if (this.selectedFiles.length === 0) {
      formData.append('files', new File([''], '', { type: '' }));
    } else {
      this.selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
    }
    formData.append('workOrderDto', JSON.stringify(workOrderData));
    return formData;
  }

  // Function to convert value to number
  convertToNumbers = (dto: any) => {
    dto.workOrderQuantities = dto.workOrderQuantities.map((quantity: any) => ({
      ...quantity,
      value: Number(quantity.value.replace(/,/g, '')),
      quantity: Number(quantity.quantity.toLocaleString().replace(/,/g, '')),
      rate: Number(quantity.rate.toLocaleString().replace(/,/g, '')),
      budgetQuantity: Number(
        quantity.budgetQuantity.toLocaleString().replace(/,/g, '')
      ),
      gstWithAmount: Number(
        quantity.gstWithAmount.toLocaleString().replace(/,/g, '')
      ),

      amendmentAmount: Number(quantity.amendmentAmount.replace(/,/g, '')),
      amendmentQuantity: Number(
        quantity.amendmentQuantity.toLocaleString().replace(/,/g, '')
      ),
      amendmentBudgetQuantity: Number(
        quantity.amendmentBudgetQuantity.toLocaleString().replace(/,/g, '')
      ),
      gstWithAmountAfterAmendment: Number(
        quantity.gstWithAmountAfterAmendment.toLocaleString().replace(/,/g, '')
      ),
    }));

    dto.mobilizationInAmount =
      dto.mobilizationInAmount != null && dto.mobilizationInAmount != 0
        ? Number(dto.mobilizationInAmount.replace(/,/g, ''))
        : 0;
    return dto;
  };

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

  //files upload part ended

  private preparePayload(): any {
    const formValues = this.formData.value;
    console.log(formValues);
    return {
      id: formValues.id,
      workOrderNumber: formValues.workOrderNumber,
      plantCodeId: formValues.plantCodeId,
      projectName: formValues.projectName,
      vendorId: formValues.vendorId,
      status: formValues.status,
      termsAndConditions: formValues.termsAndConditions,
      contactPersonName: formValues.contactPersonName,
      personContactNumber: formValues.personContactNumber,
      subject: formValues.subject,
      mobilizationIn: formValues.mobilizationIn,
      mobilizationInAmount: formValues.mobilizationInAmount,
      mobilizationInPercentage: formValues.mobilizationInPercentage,
      workOrderCateory: formValues.workOrderCateory,
      workOrderQuantities: formValues.workOrderQuantities.map(
        (quantity: any) => ({
          id: quantity.id,
          serviceCodeId: quantity.serviceCodeId,
          quantity: quantity.quantity,
          amendmentQuantity: quantity.amendmentQuantity,
          amendmentAmount: quantity.amendmentAmount,
          gstWithAmountAfterAmendment: quantity.gstWithAmountAfterAmendment,
          rate: quantity.rate,
          value: quantity.value,
          wbsElements: quantity.wbsElements,
          budgetQuantity: quantity.budgetQuantity,
          amendmentBudgetQuantity: quantity.amendmentBudgetQuantity,
          workOrderCreationId: quantity.workOrderCreationId,
          quantityOrder: quantity.quantityOrder,
          gst: quantity.gst || 0,
          cgst: quantity.cgst || 0,
          sgst: quantity.sgst || 0,
          gstWithAmount: quantity.gstWithAmount,
          quantityOrRo: quantity.quantityOrRo,
          quantityIndex: quantity.quantityIndex,
        })
      ),

      workOrderHeaders: formValues.workOrderHeaders.map((header: any) => ({
        id: header.id,
        headerId: header.headerId,
        headerName: header.headerName,
        headerTermsAndConditions: header.headerTermsAndConditions,
        headerOrder: header.headerOrder,
      })),
    };
  }

  //model methods
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChildren('radioButton') radioButtons!: QueryList<ElementRef>;
  serviceCodeDtos: IServiceCodeDto[] = [];
  modalServiceCodeDtos: IServiceCodeDto[] = [];
  serviceCodeIdFromModel: number | null = null;
  serviceCodeIndexForModal: number | null = null;
  modifiedServiceCode: IServiceCodeDto = new ServiceCodeDto();
  modalServiceCode: string = '';
  modalSCDescription: string = '';
  modalSCUom: string = '';
  modalSGCode: string = '';
  modalSGDescription: string = '';
  modalPACode: string = '';
  modalPADescription: string = '';

  setServiceCodeIndexForModal(index: number): void {
    this.serviceCodeIndexForModal = index;
    this.getAllServiceCodesWithFilters();
  }
  onServiceCodeSelect(serviceCode: any) {
    this.serviceCodeIdFromModel = serviceCode.serviceCodeId;
    this.modifiedServiceCode = serviceCode;
    this.clearModalFilters();
  }
  selectServiceCode() {
    if (
      this.serviceCodeIdFromModel !== null &&
      this.serviceCodeIndexForModal !== null
    ) {
      this.fetchAndUpdateServiceCodes(
        this.serviceCodeIdFromModel,
        this.serviceCodeIndexForModal
      );
      this.selectedServicecodes[this.serviceCodeIndexForModal] =
        this.modifiedServiceCode;
      this.radioButtons.forEach((radioButton) => {
        radioButton.nativeElement.checked = false;
      });
    } else {
      Swal.fire({
        icon: 'info',
        text: 'No Selection !',
        timerProgressBar: true,
        timer: 2000,
      });
      console.error(
        'Either serviceCodeIdFromModel or serviceCodeIndexForModal is null, skipping fetch.'
      );
    }
    // Clear the selection after processing
    this.serviceCodeIdFromModel = null;
    this.serviceCodeIndexForModal = null;
  }

  //model methods
  handleSuccessResponse(response: any): void {
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });

    this.gotoWorkOrderCreation();
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', ' Error While Save/Update WO', {
      timeOut: TIME_OUT,
    });
  }

  gotoWorkOrderCreation() {
    if (this.workOrderDto?.woStatus) {
      if (
        this.workOrderDto.woStatus === 'Pending' ||
        this.workOrderDto.woStatus === ''
      ) {
        this.router.navigate([NAVIGATE_TO_WORK_ORDER_CREATION], {
          state: {
            statePageSize: this.statePageSize,
            statePageIndex: this.statePageIndex,
            displayPageData: this.displayPageData,
          },
        });
      } else if (
        this.workOrderDto.woStatus === 'Rework' ||
        this.workOrderDto.woStatus === 'Amendment' ||
        this.workOrderDto.woStatus === 'Approved' ||
        this.workOrderDto.woStatus === 'Reworking' ||
        this.workOrderDto.woStatus === 'Amendment Rework Editing' ||
        this.workOrderDto.woStatus === 'Amendment Rework'
      ) {
        this.router.navigate([NAVIGATE_TO_REWORK_WORK_ORDER], {
          state: {
            statePageSize: this.statePageSize,
            statePageIndex: this.statePageIndex,
            displayPageData: this.displayPageData,
          },
        });
      }
    } else if (this.workOrderStatus) {
      if (this.workOrderStatus === 'Create') {
        this.router.navigate([NAVIGATE_TO_WORK_ORDER_CREATION], {
          state: {
            statePageSize: this.statePageSize,
            statePageIndex: this.statePageIndex,
            displayPageData: this.displayPageData,
          },
        });
      }
    } else {
      this.router.navigate([NAVIGATE_TO_WORK_ORDER_CREATION], {
        state: {
          statePageSize: this.statePageSize,
          statePageIndex: this.statePageIndex,
          displayPageData: this.displayPageData,
        },
      });
    }

    this.emptyDocumentsArray();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.scrollListener) {
      window.removeEventListener('scroll', this.scrollListener, true);
    }
  }
  clearForm() {
    this.formData.reset();
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllServiceCodesWithFilters();
  }

  onStagePageChange(event: any) {
    this.stagePageSize = event.pageSize;
    this.stagePageIndex = event.pageIndex;
    this.viewStageDetails();
  }
  getAllServiceCodesWithFilters() {
    const trimmedModalServiceCode = this.modalServiceCode.trim();
    const trimmedModalSCDescription = this.modalSCDescription.trim();
    const trimmedModalSCUom = this.modalSCUom.trim();
    const trimmedModalSGCode = this.modalSGCode.trim();
    const trimmedModalSGDescription = this.modalSGDescription.trim();
    const trimmedModalPACode = this.modalPACode.trim();
    const trimmedModalPADescription = this.modalPADescription.trim();

    this.serviceCodeService
      .getAllServiceCodesWithFilters(
        trimmedModalServiceCode,
        trimmedModalSCDescription,
        trimmedModalSCUom,
        trimmedModalSGCode,
        trimmedModalSGDescription,
        trimmedModalPACode,
        trimmedModalPADescription,
        this.pageIndex,
        this.pageSize
      )
      .subscribe({
        next: (serviceCodeData) => {
          this.serviceCodeDtos = serviceCodeData.records;
          this.totalItems = serviceCodeData.totalRecords;
        },
        error: (error: any) => {
          console.error(error);
        },
      });
  }

  clearModalFilters() {
    this.modalServiceCode = '';
    this.modalSCDescription = '';
    this.modalSCUom = '';
    this.modalSGCode = '';
    this.modalSGDescription = '';
    this.modalPACode = '';
    this.modalPADescription = '';
  }
  btnModalClear() {
    if (
      this.modalServiceCode ||
      this.modalSCDescription ||
      this.modalSCUom ||
      this.modalSGCode ||
      this.modalSGDescription ||
      this.modalPACode ||
      this.modalPADescription
    ) {
      this.clearModalFilters();
      this.getAllServiceCodesWithFilters();
    }
  }
  goToFirstPage() {
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
  }
  modalServiceCodeSearch() {
    if (
      this.modalServiceCode.length > 2 ||
      this.modalServiceCode.length === 0
    ) {
      this.goToFirstPage();
      this.getAllServiceCodesWithFilters();
    }
  }
  modalSCDescriptionSearch() {
    if (
      this.modalSCDescription.length > 2 ||
      this.modalSCDescription.length === 0
    ) {
      this.goToFirstPage();
      this.getAllServiceCodesWithFilters();
    }
  }
  modalSCUomSearch() {
    if (this.modalSCUom.length > 2 || this.modalSCUom.length === 0) {
      this.goToFirstPage();
      this.getAllServiceCodesWithFilters();
    }
  }
  modalSGCodeSearch() {
    if (this.modalSGCode.length > 2 || this.modalSGCode.length === 0) {
      this.goToFirstPage();
      this.getAllServiceCodesWithFilters();
    }
  }
  modalSGDescriptionSearch() {
    if (
      this.modalSGDescription.length > 2 ||
      this.modalSGDescription.length === 0
    ) {
      this.goToFirstPage();
      this.getAllServiceCodesWithFilters();
    }
  }
  modalPACodeSearch() {
    if (this.modalPACode.length > 2 || this.modalPACode.length === 0) {
      this.goToFirstPage();
      this.getAllServiceCodesWithFilters();
    }
  }
  modalPADescriptionSearch() {
    if (
      this.modalPADescription.length > 2 ||
      this.modalPADescription.length == 0
    ) {
      this.goToFirstPage();
      this.getAllServiceCodesWithFilters();
    }
  }

  viewDownLoads() {
    const dialogRef = this.dialog.open(DocumentComponent, {
      width: '60%',
      height: '500px',
      data: {
        documents: this.workOrderDocuments,
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
    console.log(uploadedDocuments);
    this.documents = uploadedDocuments;
  }

  ngAfterViewInit() {
    this.resizeAllTextareas();
    this.autoResizeWbsElements();

    const targetNode = document.getElementById('quill-editor');
    if (targetNode) {
      this.observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {});
      });

      const config = { childList: true, subtree: true };
      this.observer.observe(targetNode, config);
    }

    this.scrollListener = (event: Event) => {
      const target = event.target as HTMLElement;

      // Ignore scrolls inside autocomplete dropdowns
      if (target.closest('.cdk-overlay-pane')) {
        return;
      }

      // Loop through all autocomplete triggers and close any open one
      this.autocompleteTriggers?.forEach((trigger) => {
        if (trigger.panelOpen) {
          trigger.closePanel();
          (trigger as any)._elementRef.nativeElement.blur();
        }
      });
    };

    window.addEventListener('scroll', this.scrollListener, true);
  }

  resizeAllTextareas() {
    this.serviceDescriptionTextareas.forEach((textarea) => {
      this.autoResize(textarea.nativeElement);
    });
  }

  autoResize(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  autoResizeServiceDescription(index: number) {
    const textarea =
      this.serviceDescriptionTextareas.toArray()[index]?.nativeElement;
    this.autoResize(textarea);
  }

  autoResizeWbsElements() {
    const textarea = this.wbsElementsTextarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  autoResizeHeaderName() {
    const textarea = this.headerTextarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  viewStageDetails() {
    this.showLoading();
    this.workOrderCreationService
      .getStages(this.workOrderId, this.stagePageIndex, this.stagePageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stages) => {
          this.stagesData = stages.records;
          this.stageTotalItems = stages.totalRecords;
          console.log('stagesData', this.stagesData);
          this.hideLoading();
          this.openDialog = true;
        },
        error: () => {
          this.hideLoading();
        },
      });
  }

  onGstChange(value: string, index: number) {
    const control = (this.formData.get('workOrderQuantities') as FormArray).at(
      index
    );
    control.get('gst')?.setValue(value);
  }

  onSgstChange(value: any, index: number) {
    const control = (this.formData.get('workOrderQuantities') as FormArray).at(
      index
    );
    control.get('sgst')?.setValue(value);
    control.get('cgst')?.setValue(value);

    this.formData.patchValue({
      sgst: value.id,
      cgst: value.id,
    });
  }

  onCgstChange(value: any, index: number) {
    const control = (this.formData.get('workOrderQuantities') as FormArray).at(
      index
    );
    control.get('cgst')?.setValue(value);
    control.get('sgst')?.setValue(value);
  }

  onClose() {
    this.openDialog = false;
  }
  get formArryHeaders(): FormArray {
    return this.formData.get('workOrderHeaders') as FormArray;
  }

  getDocumentsBasedOnId() {
    this.commonService
      .getDocumentById(
        this.workOrderId,
        this.documentType,
        this.documentPageIndex,
        this.documentPageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.workOrderDocuments = response;
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  onQuantityOrROChange(data: any, index: number): void {
    const id = data.value;
    const matchedObject = this.options.find((item) => item.id === id);
    this.selectedOptions[index] = matchedObject;

    const isRO = matchedObject?.commonRefValue === 'RO';

    // Access the specific form group by index
    const quantitiesArray = this.formData.get(
      'workOrderQuantities'
    ) as FormArray;
    const formGroup = quantitiesArray.at(index) as FormGroup;

    // Dynamically update validators
    if (isRO) {
      this.isQuantityExists[index] = false;
      // For RO, only rate is required
      formGroup.get('quantity')?.clearValidators();
      formGroup.get('budgetQuantity')?.clearValidators();

      if (this.isAdding) {
        formGroup.patchValue({ quantity: 0, budgetQuantity: 0, rate: 0 });
      }
      formGroup.get('quantity')?.setErrors(null);
      formGroup.get('budgetQuantity')?.setErrors(null);

      formGroup
        .get('rate')
        ?.setValidators([Validators.required, this.greaterThanZeroValidator()]);
    } else {
      this.isQuantityExists[index] = true;

      if (this.isAdding) {
        formGroup.patchValue({ rate: 0 });
      }
      // For Quantity, both quantity and rate are required
      if (!this.isAmendmentWorkOrder) {
        formGroup
          .get('quantity')
          ?.setValidators([
            Validators.required,
            this.greaterThanZeroValidator(),
          ]);
      } else {
        formGroup.get('quantity')?.setErrors(null);
      }

      formGroup
        .get('rate')
        ?.setValidators([Validators.required, this.greaterThanZeroValidator()]);
    }

    // Update value and validity of fields
    formGroup.get('quantity')?.updateValueAndValidity();
    formGroup.get('budgetQuantity')?.updateValueAndValidity();
    formGroup.get('rate')?.updateValueAndValidity();

    this.cd.detectChanges(); // Trigger change detection
  }

  private validateFields(formGroup: FormGroup, index?: number): void {
    formGroup.get('quantity')?.setErrors(null);
    formGroup.get('rate')?.setErrors(null);
    const rawQuantity = formGroup.get('quantity')?.value;
    const rawQuantityORRo = formGroup.get('quantityOrRo')?.value;
    const rawRate = formGroup.get('rate')?.value;
    const quantity = parseFloat(
      rawQuantity?.toString().replace(/,/g, '').trim() || 'NaN'
    );

    const rate = parseFloat(
      rawRate?.toString().replace(/,/g, '').trim() || 'NaN'
    );
    if (isNaN(rate) || rate === 0) {
      formGroup.get('rate')?.setErrors({ rateInvalid: true });
      this.greaterThanZeroValidator();
    }

    const rawQuantityORRoId = this.options.find(
      (data) => data.commonRefValue == 'Quantity'
    );
    if (rawQuantityORRo === rawQuantityORRoId.id) {
      // if (isNaN(quantity) || quantity === 0) {
      //   formGroup.get('quantity')?.setErrors({ quantityInvalid: true });
      //   this.greaterThanZeroValidator();
      // }

      if (
        (isNaN(quantity) || quantity == 0) &&
        !(
          this.workOrderDto?.woStatus === 'Approved' ||
          this.workOrderDto?.woStatus === 'Amendment' ||
          this.isAmendmentWorkOrder
        )
      ) {
        formGroup.get('quantity')?.setErrors({ quantityInvalid: true });
        this.greaterThanZeroValidator();
      }
    }
    if (index == undefined) {
      return;
    }
    const selectedObject = this.selectedOptions[index];
    if (!selectedObject) {
      return;
    }

    if (this.isQuantityExists[index]) {
      // if (selectedObject.commonRefValue === 'Quantity') {
      //   if (isNaN(quantity) || quantity === 0) {
      //     formGroup.get('quantity')?.setErrors({ quantityInvalid: true });
      //   }
      // } else {
      //   formGroup.get('quantity')?.setErrors(null);
      // }

      if (selectedObject.commonRefValue === 'Quantity') {
        if (
          (isNaN(quantity) || quantity == 0) &&
          !(
            this.workOrderDto?.woStatus === 'Approved' ||
            this.workOrderDto?.woStatus === 'Amendment'
          )
        ) {
          formGroup.get('quantity')?.setErrors({ quantityInvalid: true });
        }
      } else {
        formGroup.get('quantity')?.setErrors(null);
      }
    }

    this.cd.detectChanges();
  }

  fetchQuantityCheck(): void {
    this.commonService
      .getCommanReferanceDetailsWithFilters(QUANTITY_CHECK)
      .subscribe({
        next: (quantitycheck) => {
          this.options = quantitycheck;
        },
        error: (error: any) => {
          console.error('Error fetching unit of measurements:', error);
        },
      });
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

  greaterThanZeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return { required: true };
      }
      // if (value == 0 || value < 0) {
      //   return { greaterThanZero: true };
      // }
      return null;
    };
  }

  refreshServicecodes() {
    this.fetchServiceCodes();
  }
  refreshWoHeader() {
    this.fetchHeaders();
  }

  emptyDocumentsArray() {
    this.documentService.setDocuments([]);
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
  // restrictToNumbers(event: KeyboardEvent): boolean {
  //   const inputElement = event.target as HTMLInputElement;
  //   const allowedKeys = [
  //     'Backspace',
  //     'ArrowLeft',
  //     'ArrowRight',
  //     'Delete',
  //     'Tab',
  //     '.',
  //   ];

  //   const isNumber = /^[0-9]$/.test(event.key);
  //   const isDecimalAllowed =
  //     event.key === '.' && !inputElement.value.includes('.');

  //   return isNumber || allowedKeys.includes(event.key) || isDecimalAllowed;
  // }

  restrictToNumbers(event: KeyboardEvent): boolean {
    const inputElement = event.target as HTMLInputElement;
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Tab',
      '.',
      '-',
    ];

    const isNumber = /^[0-9]$/.test(event.key);
    const isDecimalAllowed =
      event.key === '.' && !inputElement.value.includes('.');
    const isMinusAllowed =
      event.key === '-' &&
      inputElement.selectionStart === 0 &&
      !inputElement.value.includes('-');

    if (
      isNumber ||
      allowedKeys.includes(event.key) ||
      isDecimalAllowed ||
      isMinusAllowed
    ) {
      return true;
    }

    event.preventDefault();
    return false;
  }

  trackByIndex(index: number, item: any): number {
    return index;
  }

  workOrderCategoryChange(event: any) {
    this.selectedWorkOrderCategory = event.value;
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
