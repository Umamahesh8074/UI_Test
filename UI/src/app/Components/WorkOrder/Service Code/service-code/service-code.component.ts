import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { delay, Subject, takeUntil } from 'rxjs';
import {
  COMMON_STATUS,
  PAGE_INDEX,
  PAGE_SIZE,
  searchTextLength,
  searchTextZero,
  TIME_OUT,
  TOTAL_ITEMS,
  pageSizeOptions,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  NAVIGATE_TO_DISPLAY_SERVICE_CODE,
  SAC_CODES,
  SERVICE_CODE_UOM,
  UNIT_OF_MEASUREMENT,
} from 'src/app/Constants/WorkOrder/workorder';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import {
  IPrimeActivityCode,
  IPrimeActivityCodeDto,
  PrimeActivityCode,
} from 'src/app/Models/WorkOrder/PrimeActivityCode';
import { SacCode } from 'src/app/Models/WorkOrder/SacCode';

import {
  IServiceCode,
  IServiceCodeDto,
  ServiceCode,
  ServiceCodeDto,
} from 'src/app/Models/WorkOrder/ServiceCode';
import {
  IServiceGroup,
  IServiceGroupDto,
  ServiceGroup,
} from 'src/app/Models/WorkOrder/ServiceGroup';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { PrimeActivityCodeService } from 'src/app/Services/WorkOrderService/PrimeActivityCode/PrimeActivityCode.service';
import { SacCodeService } from 'src/app/Services/WorkOrderService/SacCode/SacCode.service';
import { ServiceCodeService } from 'src/app/Services/WorkOrderService/ServiceCode/ServiceCode.service';
import { ServiceGroupService } from 'src/app/Services/WorkOrderService/ServiceGroup/ServiceGroup.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'service-code',
  templateUrl: './service-code.component.html',
  styleUrls: ['./service-code.component.css'],
})
export class AddServiceCode implements OnInit {
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  organizationId: number = 0;
  formData!: FormGroup;
  @ViewChild('sacCodeTextarea') sacCodeTextarea!: ElementRef;
  @ViewChild('serviceCodeTextarea') serviceCodeTextarea!: ElementRef;
  //auto complete fields for service group
  serviceGroupCodes: IServiceGroupDto[] = [];
  serviceGroupName: string = '';
  serviceGroupId: number = 0;
  serviceGroupCode: any = new FormControl([] as IServiceGroup[]);
  selectedServiceGroup: IServiceGroup = new ServiceGroup();
  statePageSize: number = 0;
  statePageIndex: number = 0;

  //prime activity auto complete fields
  primeActivityCodes: IPrimeActivityCodeDto[] = [];
  primeActivity: any = new FormControl([] as IPrimeActivityCode[]);
  primeActivityCode: string = '';
  primeActivityId: number = 0;
  selectedPrimeActivity: IPrimeActivityCode = new PrimeActivityCode();
  primeActivityUomId: number = 0;

  //getting data from state and patch that state to service code
  serviceCode: IServiceCode = new ServiceCode();

  //auto complete fields for service code uom
  serviceCodeUoms: CommonReferenceType[] = [];
  serviceUom: any = new FormControl([] as CommonReferenceType[]);
  serviceCodeUomName: string = '';
  serviceCodeUomId: number = 0;
  selectedServiceUom: CommonReferenceType = new CommonReferenceType();

  sacCodes: SacCode[] = [];
  sacCode: any = new FormControl([] as SacCode[]);
  sacCodeName: string = '';
  sacCodeId: number = 0;
  selectedSacCode: SacCode = new SacCode();

  statuses: any;

  //errors
  showPrimeActivityError: boolean = false;
  showServiceGroupCodeError: boolean = false;
  showServiceUomError: boolean = false;
  showSACCodeError: boolean = false;

  //Service Code modal data
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChildren('radioButton') radioButtons!: QueryList<ElementRef>;
  serviceCodeDtos: IServiceCodeDto[] = [];
  modalServiceCodeDtos: IServiceCodeDto[] = [];
  serviceCodeIdFromModel: number | null = null;
  serviceCodeIndexForModal: number | null = null;
  modifiedServiceCode: IServiceCodeDto = new ServiceCodeDto();

  //modal pagination
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;

  modalServiceCode: string = '';
  modalSCDescription: string = '';
  modalSCUom: string = '';
  modalSGCode: string = '';
  modalSGDescription: string = '';
  modalPACode: string = '';
  modalPADescription: string = '';

  ngOnInit(): void {
    this.initializeFormData();
    this.fetchAllServiceGroups();
    this.fetchPrimeActivityCodes();
    this.getDataFromState();
    this.fetchAllServiceCodes();
    this.getCommonStatuses();
    this.fetchAllSacCodes();
  }

  constructor(
    private router: Router,
    private serviceGroup: ServiceGroupService,
    private primeActivityService: PrimeActivityCodeService,
    private serviceCodeService: ServiceCodeService,
    private builder: FormBuilder,
    private toastrService: ToastrService,
    private commonRefDetailsService: CommonreferencedetailsService,
    private commonService: CommanService,
    private sacCodeService: SacCodeService,
    private loaderService: LoaderService
  ) {}

  private initializeFormData() {
    this.formData = this.builder.group({
      id: [0],
      serviceGroupId: [null, Validators.required],
      primeActivityId: [null, Validators.required],
      serviceUomId: [null, Validators.required],
      serviceDescription: [''],
      sacCodeId: [null, Validators.required],

      // sacCode: [''],
      serviceGroupName: [''], // Additional fields for patching
      serviceGroupDescription: [''], // Additional fields for patching
      primeActivityDescription: [''], // Additional fields for patching
      primeActivityUom: [''], // Additional fields for patching
      status: ['A'],
      serviceCode: [''],
      sacCodeDescription: [''],
    });
  }

  getDataFromState() {
    const { serviceCode, isAdding, statePageSize, statePageIndex } =
      history.state;
    this.isAdding = isAdding;
    this.serviceCode = serviceCode || this.serviceCode;
    console.log(statePageIndex,statePageSize);
    this.statePageSize = statePageSize;
    this.statePageIndex = statePageIndex;
    if (!this.isAdding) {
      this.patchFormDataWithServiceCodeData();
    }
  }

  private patchFormDataWithServiceCodeData() {
    if (this.serviceCode.serviceGroupId) {
      this.fetchServiceGroupById(this.serviceCode.serviceGroupId);
    }
    if (this.serviceCode.primeActivityId) {
      this.fetchPrimeActivityById(this.serviceCode.primeActivityId);
    }

    if (this.serviceCode.serviceUomId) {
      this.fetchServiceUomById(this.serviceCode.serviceUomId);
    }
    if (this.serviceCode.sacCodeId) {
      this.fetchSacCodeById(this.serviceCode.sacCodeId);
    }
    this.formData.patchValue(this.serviceCode);
  }

  fetchServiceUomById(serviceUomId: number) {
    this.commonRefDetailsService
      .getById(serviceUomId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (serviceUom) => {
          this.selectedServiceUom = serviceUom;
          this.serviceCodeUomId = serviceUom.id;
          this.formData.patchValue({ serviceUomId: serviceUom.id });
        },
        error: () => {},
      });
  }

  fetchSacCodeById(sacCodeId: number) {
    this.sacCodeService
      .getSacCodeById(sacCodeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sacCode) => {
          this.selectedSacCode = sacCode;
          this.formData.patchValue({
            sacCodeId: sacCode.id,
            sacCodeDescription: this.selectedSacCode.sacCodeDescription,
          });
        },
        error: () => {},
      });
  }

  fetchAllServiceCodes() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(
        UNIT_OF_MEASUREMENT,
        this.serviceCodeUomName
      )
      .subscribe({
        next: (serviceCodeUom) => {
          this.serviceCodeUoms = serviceCodeUom;
        },
        error: (error: any) => {
          console.error('Error fetching unit of measurements:', error);
        },
      });
  }

  fetchAllSacCodes() {
    this.sacCodeService.getSacCodes(this.sacCodeName).subscribe({
      next: (sacCode) => {
        this.sacCodes = sacCode;
      },
      error: (error: any) => {
        console.error('Error fetching unit of measurements:', error);
      },
    });
  }

  fetchServiceGroupById(serviceGroupId: number) {
    this.serviceGroup
      .getServiceGroupById(serviceGroupId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (serviceGroup) => {
          this.selectedServiceGroup = serviceGroup;
          if (this.selectedServiceGroup) {
            this.formData.patchValue({
              serviceGroupId: this.selectedServiceGroup.id,
              serviceGroupName: this.selectedServiceGroup.serviceGroupName,
              serviceGroupDescription:
                this.selectedServiceGroup.serviceGroupDescription,
            });
          }
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  fetchPrimeActivityById(primeActivityId: number) {
    this.primeActivityService
      .getPrimeActivityCodeById(primeActivityId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (primeActivity) => {
          this.selectedPrimeActivity = primeActivity;
          this.primeActivityUomId = primeActivity.primeActivityUomId;
          if (this.primeActivityUomId) {
            this.fetchUomById(this.primeActivityUomId);
          }
          if (this.selectedPrimeActivity) {
            this.formData.patchValue({
              primeActivityCodeId: this.selectedPrimeActivity.id,
              primeActivityDescription:
                this.selectedPrimeActivity.primeActivityDescription,
            });
          }
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  fetchUomById(primeActivityUomId: number) {
    this.commonRefDetailsService
      .getById(primeActivityUomId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((uom) => {
        const paUom = uom;
        if (paUom) {
          this.formData.patchValue({
            primeActivityUom: paUom.commonRefValue,
          });
        }
      });
  }

  fetchAllServiceGroups() {
    this.serviceGroup
      .getAllServiceGroupsWithOutPage(this.serviceGroupName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (serviceGroups) => {
          this.serviceGroupCodes = serviceGroups;
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  onServiceGroupCodeSelect(event: any) {
    this.showServiceGroupCodeError = false;
    this.serviceGroupId = event.option.value.serviceGroupId;
    const selectedServiceGroup = this.serviceGroupCodes.find(
      (group) => group.serviceGroupId === this.serviceGroupId
    );

    if (selectedServiceGroup) {
      this.formData.patchValue({
        serviceGroupId: selectedServiceGroup.serviceGroupId,
        serviceGroupName: selectedServiceGroup.serviceGroupName,
        serviceGroupDescription: selectedServiceGroup.serviceGroupDescription,
      });
    }
  }

  onServiceCodeUomSelect(event: any) {
    this.showServiceUomError = false;
    this.serviceCodeUomId = event.option.value.id;
    this.formData.patchValue({ serviceUomId: this.serviceCodeUomId });
  }

  onSacCodeSelect(event: any) {
    this.showSACCodeError = false;
    this.sacCodeId = event.option.value.id;

    const selectSacCode = this.sacCodes.find(
      (sac) => sac.id === this.sacCodeId
    );

    this.formData.patchValue({
      sacCodeId: this.sacCodeId,
      sacCodeDescription: selectSacCode?.sacCodeDescription,
    });
    this.autoResizeSacCodeDesc();
  }

  searchSacCode(event: any) {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.sacCodeName = query;
      this.fetchAllSacCodes();
    }
  }

  displaySacCode(serviceCode: any): string {
    return serviceCode && serviceCode.sacCode ? serviceCode.sacCode : '';
  }

  searchServiceGroupCode(event: any) {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.serviceGroupName = query;
      this.fetchAllServiceGroups();
    }
  }

  searchServiceCode(event: any) {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.serviceCodeUomName = query;
      this.fetchAllServiceCodes();
    }
  }

  displayServicegroupCode(serviceGroup: IServiceGroup): string {
    return serviceGroup && serviceGroup.serviceGroupCode
      ? serviceGroup.serviceGroupCode
      : '';
  }

  displayServiceCodeUom(serviceCode: any): string {
    return serviceCode && serviceCode.commonRefValue
      ? serviceCode.commonRefValue
      : '';
  }
  fetchPrimeActivityCodes() {
    this.primeActivityService
      .getAllPrimeActivityCodeWithOutPage(this.primeActivityCode)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (primeActivities: IPrimeActivityCodeDto[]) => {
          this.primeActivityCodes = primeActivities;
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  searchPrimeActivityCode(event: any) {
    this.showPrimeActivityError = false;
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.primeActivityCode = query;
      this.fetchPrimeActivityCodes();
    }
  }
  displayPrimeActivityCode(primeActivityCode: IPrimeActivityCode): string {
    return primeActivityCode && primeActivityCode.primeActivityNumber
      ? primeActivityCode.primeActivityNumber
      : '';
  }
  onPrimeActivityCodeSelect(event: any) {
    this.showPrimeActivityError = false;
    this.primeActivityId = event.option.value.primeActivityId;
    const selectPrirmeActivity = this.primeActivityCodes.find(
      (pa) => pa.primeActivityId === this.primeActivityId
    );

    if (selectPrirmeActivity) {
      this.formData.patchValue({
        primeActivityId: this.primeActivityId,
        primeActivityDescription: selectPrirmeActivity.primeActivityDescription,
        primeActivityUom: selectPrirmeActivity.primeActivityUom,
      });
    }
  }
  save() {
    // Check for validation

    if (this.formData.get('primeActivityId')?.invalid) {
      this.showPrimeActivityError = true;
    }

    // Check for validation
    if (this.formData.get('serviceGroupId')?.invalid) {
      this.showServiceGroupCodeError = true;
    }

    // Check for validation
    if (this.formData.get('serviceUomId')?.invalid) {
      this.showServiceUomError = true;
    }

    if (this.formData.get('sacCodeId')?.invalid) {
      this.showSACCodeError = true;
    }

    if (this.formData.valid) {
      this.showLoading();
      const formValuesToSend = this.extractRelevantValues();

      const serviceCode = this.generateServiceCode(
        formValuesToSend.primeActivityId,
        formValuesToSend.serviceGroupId
      );
      const dataToSend = {
        ...formValuesToSend,
        serviceCode,
      };
      const saveOrUpdate$ = this.isAdding
        ? this.serviceCodeService.addServiceCodeData(dataToSend)
        : this.serviceCodeService.updateServiceCode(dataToSend);
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
    }
  }

  generateServiceCode(primeActivityId: number, serviceGroupId: number): string {
    const serviceGroup = this.serviceGroupCodes.find(
      (serviceGroup) => serviceGroup.serviceGroupId === serviceGroupId
    );
    const primeActivity = this.primeActivityCodes.find(
      (activity) => activity.primeActivityId === primeActivityId
    );
    const serviceUom = this.serviceCodeUoms.find(
      (uom) => uom.id === this.serviceCodeUomId
    );
    if (serviceGroup && primeActivity) {
      const code =
        serviceGroup.serviceGroupType +
        serviceGroup.serviceGroupCode +
        primeActivity.primeActivityNumber.replace('-', '') +
        '-' +
        serviceUom?.commonRefValue +
        '-' +
        primeActivity.padCode;
      return code;
    }
    return '';
  }

  handleSuccessResponse(response: any): void {
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
    this.gotoServiceCode();
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
    this.gotoServiceCode();
  }

  private extractRelevantValues() {
    const {
      id,
      serviceGroupId,
      primeActivityId,
      serviceUomId,
      serviceDescription,
      sacCodeId,
      status,
    } = this.formData.value;

    return {
      id,
      serviceGroupId,
      primeActivityId,
      serviceUomId,
      serviceDescription,
      sacCodeId,
      status,
    };
  }

  getCommonStatuses() {
    this.commonService.fetchCommonReferenceTypes(COMMON_STATUS).subscribe({
      next: (data) => {
        this.statuses = data;
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }
  gotoServiceCode() {
    this.router.navigate([NAVIGATE_TO_DISPLAY_SERVICE_CODE], {
      state: {
        statePageSize: this.statePageSize,
        statePageIndex: this.statePageIndex,
      },
    });
  }

  clearForm() {
    this.formData.reset();
  }

  ngAfterViewInit() {
    this.autoResizeSacCodeDesc();
    this.autoResizeServiceCodeDesc();
  }

  autoResizeSacCodeDesc() {
    const textarea = this.sacCodeTextarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  autoResizeServiceCodeDesc() {
    const textarea = this.serviceCodeTextarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
    if (this.modalSCUom.length >= 1 || this.modalSCUom.length === 0) {
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
  onServiceCodeSelect(serviceCode: IServiceCodeDto) {
    this.serviceCodeIdFromModel = serviceCode.serviceCodeId;
    this.modifiedServiceCode = serviceCode;
    console.log(this.modifiedServiceCode);
    this.clearModalFilters();
  }
  onRowClick(serviceCode: IServiceCodeDto): void {
    this.onServiceCodeSelect(serviceCode);
  }

  selectServiceCode() {
    console.log(this.modifiedServiceCode);
    if (this.serviceCodeIdFromModel !== null) {
      this.fetchServiceCodeById(this.serviceCodeIdFromModel);
      console.log(this.serviceCode);
      if (this.serviceCode) {
        this.patchFormDataWithServiceCodeData();
        this.formData.patchValue({ id: 0 });
      } else {
        console.error('Failed to fetch service code data');
      }
      console.log(this.formData.controls);
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

  fetchServiceCodeById(serviceCodeId: number) {
    this.serviceCodeService
      .getServiceCodeServiceById(serviceCodeId)
      .pipe(
        delay(2000), // Wait for 1 second before processing the data
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (serviceCodeData) => {
          this.serviceCode = serviceCodeData;
          console.log('Fetched Service Code:', this.serviceCode); // Check structure
        },
        error: (error) => {
          console.error('Error fetching service code:', error);
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

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllServiceCodesWithFilters();
  }
  loadServiceCodes() {
    this.getAllServiceCodesWithFilters();
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
