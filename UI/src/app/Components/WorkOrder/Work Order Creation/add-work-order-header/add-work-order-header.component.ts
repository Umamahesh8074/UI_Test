import {
  AfterViewInit,
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

import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { WorkOrderCreationService } from 'src/app/Services/WorkOrderService/WorkOrderCreation/WorkOrderCreation.service';
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
import { DocumentSharedService } from 'src/app/Apis/SharedServices/DocumnetSharedService';
import { DocumentComponent } from 'src/app/Comman-Components/Dialog/documentmodel/document.component';
import { IWorkOrderHeader } from 'src/app/Models/WorkOrder/WorkOrderHeader';
import { WorkOrderHeaderService } from 'src/app/Services/WorkOrderService/WorkOrderHeader/WorkOrderHeader.service';
import { IworkOrderGST } from 'src/app/Models/WorkOrder/WorkOrderGstDetails';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'add-work-order-header',
  templateUrl: './add-work-order-header.component.html',
  styleUrls: ['./add-work-order-header.component.css'],
})
export class AddWorkOrderHeaderCreationComponent
  implements OnInit, AfterViewInit
{
  isAdding: boolean | undefined;
  private destroy$ = new Subject<void>();
  formData!: FormGroup;
  removedHeaders: any;
  workOrderDto: any;
  openDialog: boolean | undefined;
  workOrderStatus: string = '';
  title: string = '';
  options: any[] = [];
  showAdditionalFieldsForTermsAndCnditions: any[] = [];
  gstFromKarnataka: IworkOrderGST[] = [];
  gstOutOfKarnataka: IworkOrderGST[] = [];
  isQuantityExists: boolean[] = [];
  matchedObject: any;
  @ViewChild('headerTextarea') headerTextarea!: ElementRef;
  stagesData: any;
  workOrderId: number = 0;
  documentType: string = 'WORK_ORDER_DOCUMENTS';
  workOrderDocuments: any;

  //modal pagination
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  //project auto complete fields
  projectId: number = 0;
  projectName: string = '';
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);
  selectedProject: any = new Project();
  workOrderHeadersDto: any[] = [];

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

  //documents
  documents: any[] = [];
  selectedFiles: File[] | undefined;
  isForView!: boolean;

  showPlantCodeError: boolean = false;
  showVendorError: boolean = false;
  headerErrors: any[] = [];
  duplicateHeaderErrors: any[] = [];
  headerNameErrors: any[] = [];
  headerTermsAndConditionsErrors: any[] = [];

  //documents pagination
  documentTotalItems: number = TOTAL_ITEMS;
  documentPageSize: number = 15;
  documentPageIndex: number = PAGE_INDEX;
  documentPageSizeOptions = pageSizeOptions;

  @ViewChild(CdkVirtualScrollViewport) viewport:
    | CdkVirtualScrollViewport
    | undefined;
  @ViewChildren(MatAutocompleteTrigger)
  autocompleteTriggers!: QueryList<MatAutocompleteTrigger>;

  woStatus: string[] = ['OLD', 'NEW'];
  totalAmount: number = 0;
  selectedWorkOrderCategory: string = 'NEW';
  private observer: MutationObserver | undefined;
  private scrollListener: any;

  statePageIndex: number = 0;
  statePageSize: number = 0;
  activePageSize: number = 0;
  activePageIndex: number = 0;

  stateHeaderId: number = 0;
  stateSelectedHeader: IServiceCodeDto = new ServiceCodeDto();
  selectedIndex: number = -1;
  selectedHeaderIndex: number = -1;
  selectedOptions: any[] = [];
  selectedHeaders: any[] = [];
  headerOrderIndex: number = 0;
  displayPageData: any;

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

  ngOnInit(): void {
    this.initializeFormData();
    this.setUserFromLocalStorage();
    this.fetchProjects();
    this.fetchVendors();
    this.fetchHeaders();
    this.getDataFromState();
  }

  constructor(
    private router: Router,
    private workOrderCreationService: WorkOrderCreationService,
    private builder: FormBuilder,
    private commonService: CommanService,
    private toastrService: ToastrService,
    private projectService: ProjectService,
    private vendorService: vendorService,
    public dialog: MatDialog,
    private documentService: DocumentSharedService,
    private workOrderHeaderService: WorkOrderHeaderService,
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
      workOrderHeaders: this.builder.array([this.createWorkOrderHeaders()]),
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

  //get data rom state to update
  getDataFromState() {
    const {
      workOrderCreationDto,
      isAdding,
      isForView,
      workOrderStatus,
      title,
      vendors,
      projects,
      totalAmount,
      workOrderHeader,
      pageSize,
      pageIndex,
      statePageSize,
      statePageIndex,
      headerId,
      selectedHeader,
      displayPage,
    } = history.state;

    if (projects) {
      this.projects = projects;
    }
    if (vendors) {
      this.vendors = vendors;
    }
    this.displayPageData = displayPage ?? this.displayPageData;
    if (headerId) {
      this.stateHeaderId = headerId;
    }
    if (selectedHeader) {
      this.stateSelectedHeader = selectedHeader;
    }

    this.activePageSize = pageSize ?? this.activePageSize;
    this.activePageIndex = pageIndex ?? this.activePageIndex;
    this.statePageIndex = statePageIndex ?? this.statePageIndex;
    this.statePageSize = statePageSize ?? this.statePageSize;
    if (workOrderHeader) {
      this.workOrderHeadersDto = workOrderHeader;
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

    this.workOrderDto = workOrderCreationDto || this.workOrderDto;
    this.totalAmount = totalAmount;
    if (workOrderCreationDto?.workOrderId > 0) {
      this.workOrderId = workOrderCreationDto.workOrderId;
      this.getDocumentsBasedOnId();
    }
    this.patchFormDataWithWorkOrder();
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

    if (!this.isAdding) {
      this.populateWorkOrderTermsAndConditions();
    }
  }

  private patchBasicFormData() {
    if (this.workOrderDto.workOrderCategory === 'OLD') {
      this.selectedWorkOrderCategory = this.workOrderDto.workOrderCategory;
      var workOrderNumber = this.workOrderDto.workOrderNumber;
    } else {
      this.workOrderDto.workOrderCategory = 'NEW';
    }
    if (this.workOrderDto.mobilizationIn === 'no') {
      this.workOrderDto.mobilizationIn = '2';
    } else {
      this.workOrderDto.mobilizationIn = '1';
    }
    this.formData.patchValue({
      id: this.workOrderDto.id,
      plantCodeId: this.workOrderDto.plantCodeId,
      vendorId: this.workOrderDto.vendorId,
      status: this.workOrderDto.status,
      vendorName: this.workOrderDto.vendorName,
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
    this.workOrderHeaders.clear();
    this.workOrderHeadersDto.forEach((item: any, index: number) => {
      const workOrderHeadersGroup = this.builder.group({
        id: item.id,
        headerId: item,
        headerName: item.headerName,
        headerTermsAndConditions: item.headerTermsAndConditions,
        headerOrder: item.headerOrder,
        headingName: item.headerName,
      });
      this.handleHeaderValueChanges(workOrderHeadersGroup);
      this.workOrderHeaders.push(workOrderHeadersGroup);
    });
    this.selectedHeaders.forEach((_, index) => {
      this.checkAndUpdateHeaderDuplicateErrors(index);
    });
  }

  private handleHeaderValueChanges(workOrderHeaderGroup: FormGroup) {
    const headerNameControl = workOrderHeaderGroup.get('headerName');
    const headerTermsAndConditionsControl = workOrderHeaderGroup.get(
      'headerTermsAndConditions'
    );

    headerNameControl?.valueChanges.subscribe(() => {
      this.validateHeaderName();
    });
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
    this.projectService.getProjectById(plantCodeId).subscribe((project) => {
      this.project.patchValue(project);
    });
  }
  private fetchVendorById(vendorId: number) {
    this.vendorService.getAllvendorsById(vendorId).subscribe({
      next: (response) => {
        this.vendor.patchValue(response);
      },
      error: (error: Error) => {
        console.error(error);
      },
    });
  }

  //getting user from local storage to set organization id
  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
    }
  }

  get workOrderHeaders(): FormArray {
    return this.formData.get('workOrderHeaders') as FormArray;
  }

  addTermsAndConditions(i: number): void {
    const newWoHeader = {
      headerName: '',
      headerTermsAndConditons: '',
      headerOrder: '',
    };
    console.log(this.headerOrderIndex);
    this.headerOrderIndex = i + 1;
    this.showAdditionalFieldsForTermsAndCnditions.splice(i + 1, 0, newWoHeader);
    const newWorkOrderHeader = this.createWorkOrderHeaders();
    (this.formData.get('workOrderHeaders') as FormArray).insert(
      i + 1,
      newWorkOrderHeader
    );
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

  removeWorkOrderHeaderIcons(index: number) {
    if (!this.isAdding) {
      const workOrderHeadersArray = this.formData.get(
        'workOrderHeaders'
      ) as FormArray;
      const formGroupAtIndex = workOrderHeadersArray.at(index) as FormGroup;
      const dataToRemove = formGroupAtIndex.value;
      this.removedHeaders = dataToRemove;
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

        this.validateHeaderTermsAndConditions();
      } else {
        console.error('item should be atleast one');
      }
    }
  }

  openConfirmationDialog(id: any, index: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Work Order Header' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteWorkOrderHeader(id, index);
        }
      }
    );
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
          // workOrderHeadersArray.removeAt(index);
          // this.formData.setControl(
          //   'workOrderHeaders',
          //   this.builder.array(workOrderHeadersArray.controls)
          // );
          workOrderHeadersArray.removeAt(index);

          // Remove the error at the corresponding index
          if (
            this.headerTermsAndConditionsErrors &&
            this.headerTermsAndConditionsErrors.length > index
          ) {
            this.headerTermsAndConditionsErrors.splice(index, 1);
          }
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
    // this.autoResizeProjectDesc();
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
    console.log(woHeader.value);
    this.headerErrors[index] = false;
    const selectedHeaderId = event.option.value.id;

    console.log(event.option.value);
    console.log(selectedHeaderId);
    // this.selectedHeaders[index] = selectedHeaderId;
    // this.fetchAndUpdateHeaders(selectedHeaderId, index);
    // this.checkAndUpdateHeaderDuplicateErrors(index);
    this.validateHeader(selectedHeaderId, woHeader.value.id).subscribe({
      next: (response: string) => {
        console.log(response);
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
    const selectedVendor = event.option.value;
    const vendorId = event.option.value.id;
    const vendorGst = event.option.value.gstNumber;

    this.selectedVendor.vendorName = selectedVendor.vendorName;
    this.formData.patchValue({
      vendorId: vendorId,
      vendorGst: vendorGst,
    });
    this.showVendorError = false;
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
    const selectedVendor = event.option.value;
    const vendorId = event.option.value.id;
    const vendorGst = event.option.value.gstNumber;
    this.selectedVendor.vendorCode = selectedVendor.vendorCode;
    this.formData.patchValue({
      vendorId: vendorId,
      vendorGst: vendorGst,
    });
  }
  displayVendorName(vendor: Vendor) {
    return vendor && vendor.vendorName ? vendor.vendorName : '';
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

  isThisHeaderSelected(headerId: any): boolean {
    return this.formData.value.workOrderHeaders.some(
      (wo: any) => wo.headerId === headerId
    );
  }

  save() {
    if (this.duplicateHeaderErrors.some((error) => error)) {
      return;
    }

    this.showPlantCodeError = false;
    this.showVendorError = false;

    this.headerErrors = [];
    this.headerTermsAndConditionsErrors = [];
    this.headerNameErrors = [];
    this.formData.get('plantCodeId')?.markAsTouched();
    this.formData.get('vendorId')?.markAsTouched();
    if (this.formData.get('plantCodeId')?.invalid) {
      this.showPlantCodeError = true;
    }
    if (this.formData.get('vendorId')?.invalid) {
      this.showVendorError = true;
    }

    // Validate headerName and headerTermsAndConditions for each header
    const workOrderHeaders = this.formData.get('workOrderHeaders') as FormArray;
    let hasHeaderError = false;
    let hasTermsAndConError = false;
    for (let i = 0; i < workOrderHeaders.length; i++) {
      const headerNameControl = workOrderHeaders.at(i).get('headerName');
      const headerControl = workOrderHeaders.at(i).get('headerId');
      const headerTermsAndConditionsControl = workOrderHeaders
        .at(i)
        .get('headerTermsAndConditions');
      if (headerNameControl?.invalid) {
        this.headerNameErrors[i] = true;
      } else {
        this.headerNameErrors[i] = false;
      }

      // Validate headerTermsAndConditions
      const value = headerTermsAndConditionsControl?.value;
      if (headerTermsAndConditionsControl?.invalid || !value?.trim()) {
        this.headerTermsAndConditionsErrors[i] = true;
        hasTermsAndConError = true;
      } else {
        this.headerTermsAndConditionsErrors[i] = false;
      }

      if (headerControl?.invalid) {
        this.headerErrors[i] = true;
        hasHeaderError = true;
      } else {
        this.headerErrors[i] = false;
      }
    }

    if (this.formData.invalid || hasHeaderError || hasTermsAndConError) {
      return;
    }
    const dataToSend = this.preparePayload();

    const transformedWo = {
      workOrderHeaders: dataToSend.workOrderHeaders.map((item: any) => {
        let headerId: any;

        if (this.isAdding) {
          headerId = item.headerId?.id;
        } else {
          // When editing
          if (
            typeof item.headerId === 'object' &&
            item.id > 0 &&
            item.headerId?.headerId !== undefined &&
            item.headerId?.headerId !== ''
          ) {
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

    //stringify starts
    const formData = new FormData();
    const workOrderData = transformedWo;
    const documents = this.documents;

    // Get an array of files instead of an object
    this.selectedFiles = this.getDocumentsArray(documents);

    // Check if selectedFiles is empty
    if (this.selectedFiles.length === 0) {
      formData.append(
        'files',
        new File([''], '', {
          type: '',
        })
      ); //
    } else {
      // Append actual files
      this.selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
    }
    formData.append('workOrderDto', JSON.stringify(workOrderData));

    if (this.formData.touched && this.formData.valid) {
      this.showLoading();
      const saveOrUpdate$ = this.isAdding
        ? this.workOrderCreationService.addWorkOrderHeader(
            formData,
            this.workOrderId
          )
        : this.workOrderCreationService.updateWorkOrderHeader(
            formData,
            this.workOrderId
          );
      saveOrUpdate$.subscribe({
        next: (response) => {
          this.handleSuccessResponse(response);
          this.hideLoading();
          this.documentService.setDocuments([]);
        },
        error: (error: Error) => {
          this.handleErrorResponse(error);
          this.hideLoading();
        },
      });
    } else {
      this.hideLoading();
    }
  }

  // Function to convert value to number
  convertToNumbers = (dto: any) => {
    dto.mobilizationInAmount =
      dto.mobilizationInAmount != null && dto.mobilizationInAmount != 0
        ? Number(dto.mobilizationInAmount.replace(/,/g, ''))
        : 0;
    return dto;
  };

  //files upload part

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
    return {
      workOrderHeaders: formValues.workOrderHeaders.map((header: any) => ({
        id: header.id,
        headerId: header.headerId,
        headerName: header.headerName,
        headerTermsAndConditions: header.headerTermsAndConditions,
        headerOrder: header.headerOrder,
        woId: this.workOrderId,
      })),
    };
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
    this.router.navigate(['layout/workorder/addandeditworkorderheader'], {
      state: {
        isAdding: true,
        workOrder: this.workOrderDto,
        projects: this.projects,
        vendors: this.vendors,
        activePageIndex: this.activePageIndex,
        activePageSize: this.activePageSize,
        statePageIndex: this.statePageIndex,
        statePageSize: this.statePageSize,
        stateHeaderId: this.stateHeaderId,
        stateSelectedHeader: this.stateSelectedHeader,
        displayPage: this.displayPageData,
      },
    });
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
    this.documents = uploadedDocuments;
  }

  ngAfterViewInit() {
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

  autoResize(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  autoResizeHeaderName() {
    const textarea = this.headerTextarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  viewStageDetails() {
    this.openDialog = true;
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

  greaterThanZeroValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return { required: true };
      }
      if (value == 0 || value < 0) {
        return { greaterThanZero: true };
      }
      return null;
    };
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
