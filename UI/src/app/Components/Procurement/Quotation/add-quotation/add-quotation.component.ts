import { DecimalPipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { DocumentSharedService } from 'src/app/Apis/SharedServices/DocumnetSharedService';
import { ReusableComponent } from 'src/app/Comman-Components/base-component/base.component';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { DocumentComponent } from 'src/app/Comman-Components/Dialog/documentmodel/document.component';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  searchTextLength,
  searchTextZero,
  WORK_TYPE,
} from 'src/app/Constants/CommanConstants/Comman';
import { CGST_OR_SGST, GST } from 'src/app/Constants/WorkOrder/workorder';
import { ApprovalIndentDto } from 'src/app/Models/Procurement/approvals';
import { ItemUnitDto } from 'src/app/Models/Procurement/itemunit';
import {
  IQuotation,
  Quotation,
  QuotationItems,
} from 'src/app/Models/Procurement/quotation';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';

import { IVendor, Vendor } from 'src/app/Models/WorkOrder/VendorData';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { IndentService } from 'src/app/Services/ProcurementService/Indent/indent.service';
import { ItemUnitService } from 'src/app/Services/ProcurementService/ItemUnit/item-unit.service';
import { QuotationService } from 'src/app/Services/ProcurementService/Quotation/quotation.service';
import { vendorService } from 'src/app/Services/WorkOrderService/Vendor Data/vendor.service';
import { WorkOrderGstService } from 'src/app/Services/WorkOrderService/WoGst/wo-gst-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quotation',
  templateUrl: './add-quotation.component.html',
  styleUrls: ['./add-quotation.component.css'],
})
export class AddQuotationComponent extends ReusableComponent implements OnInit {
  quotationId: number = 0;
  basicQuotation: ApprovalIndentDto = new ApprovalIndentDto();
  isAdding: boolean = true;
  quoItems: QuotationItems[] = [];
  indentItems: any;
  indentId: number = 0;
  finalQuotation: IQuotation = new Quotation();
  dataSource!: MatTableDataSource<any>;
  vendors: IVendor[] = [];
  vendorPopUpData: IVendor[] = [];
  vendorPopUp: IVendor[] = [];
  vendorName: string = '';
  vendorCode: string = '';
  vendorId: number = 0;

  gstFromKarnataka: any[] = [];
  gstOutOfKarnataka: any[] = [];
  isFromKarnatakaGst: boolean = true;

  //item units fields
  itemUnits: ItemUnitDto[] = [];
  filteredItemUnits: ItemUnitDto[] = [];
  itemUnit: ItemUnitDto = new ItemUnitDto();
  displayPageData: any;
  pageDataFromCreateQuotation: any;

  workTypeId: number = 0;
  materialCodeId: number = 0;
  materialCode: string = '';
  options: CommonReferenceDetails[] = [];
  quotationDataForEdit: Quotation = new Quotation();
  selectedVendor: IVendor = new Vendor();
  quotationType: string = '';
  status: string = '';
  isVendorPresent: boolean = false;

  quotationDocuments: any;
  documentType: string = 'QUOTATION_DOCUMENTS';
  documents: any[] = [];
  selectedFiles: File[] | undefined;
  vendorDataFromPopUp: IVendor = new Vendor();
  vendor: any = new FormControl([] as IVendor[]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  modalMaterilCode: string = '';
  VendorIdFromModel: number | null = null;
  PopUpVendorName: string = '';
  PopUpVendorCode: string = '';
  popUpvendorIdControl: any = new FormControl([] as IVendor[]);
  PopUpVendor: any = new FormControl([] as IVendor[]);
  @ViewChild(MatAutocompleteTrigger) vendorAutoTrigger!: MatAutocompleteTrigger;
  paymentTerms: string[] = [
    'CREDIT',
    'ADVANCE IN PERCENTAGE',
    'ADVANCE IN AMOUNT',
  ];
  paymentTermType: string = '';
  totalCostWithGst: number = 0;
  isGreaterThenAmount: boolean | undefined;
  @ViewChildren('qoTermsTextarea') qoTermsTextareas!: QueryList<ElementRef>;

  constructor(
    private quotationService: QuotationService,
    private indentService: IndentService,
    router: Router,
    route: ActivatedRoute,
    public dialog: MatDialog,
    commanService: CommanService,
    private vendorService: vendorService,

    private builder: FormBuilder,
    private itemUnitService: ItemUnitService,
    private cdr: ChangeDetectorRef,
    private decimalPipe: DecimalPipe,
    private workOrderGstService: WorkOrderGstService,
    private loaderService: LoaderService,
    private documentService: DocumentSharedService
  ) {
    super(commanService, router, route);
  }

  ngOnInit(): void {
    this.initializeFormData();
    this.getDataFromState();
    this.fetchVendors();
    this.indentId = history.state.indentId;
    if (this.indentId != undefined) {
      this.fetchIndentItemsByIndentId();
    }
    this.getWorkTypes();
    this.fetchGST();
    this.fetchCGST();
  }

  private initializeFormData() {
    this.formData = this.builder.group({
      indentId: [],
      quotationId: [],
      projectId: [],
      projectName: [''],
      vendorId: ['', Validators.required],
      deliveryInDays: ['', Validators.required],
      quotationCode: [],
      vendorGst: [],
      quotationSeries: [],
      paymentTermType: [],
      numberOfDays: [],
      advanceAmountOrPercentage: [],
      quotationItems: this.builder.array([]),
      quotationCharges: this.builder.array([this.createQuotationChargeGroup()]),
      qoTermsAndConditions: this.builder.array([
        this.createTermsAndConditionGroup(),
      ]),
    });
  }
  private getDataFromState() {
    const {
      quotationData,
      isAdding,
      quotationType,
      displayPage,
      indentId,
      status,
      statePageDataFromCreateQuotation,
    } = history.state;

    this.isAdding = isAdding;
    this.quotationType = quotationType;
    this.indentId = indentId;
    this.status = status;

    if (displayPage) {
      this.displayPageData = displayPage;
    }
    if (statePageDataFromCreateQuotation) {
      this.pageDataFromCreateQuotation = statePageDataFromCreateQuotation;
    }

    if (quotationData) {
      this.quotationId = quotationData.quotationId;
      this.getDocumentsBasedOnId();
    }

    if (!isAdding) {
      this.quotationDataForEdit = quotationData;
      this.patchformData();
    }
  }
  private patchformData() {
    this.formData.patchValue(this.quotationDataForEdit);
    this.totalCostWithGst = this.quotationDataForEdit.totalCostWithGst;
    if (this.quotationDataForEdit.vendorId) {
      this.fetchVendorById(this.quotationDataForEdit.vendorId);
    }
    if (this.quotationDataForEdit.indentId) {
      this.indentId = this.quotationDataForEdit.indentId;
      this.paymentTermType = this.quotationDataForEdit.paymentTermType;
      this.fetchIndentItemsByIndentId();
    }
    this.populateQuotatioItems();
    this.populateTermsAndConditions();
    this.getWorkTypes();
    this.fetchMaterialCodes();
    this.initializeValueChanges();
  }

  private populateQuotatioItems() {
    const quotationIteams = this.quotationItems;
    quotationIteams.clear();
    this.quotationDataForEdit.quotationItems.forEach(
      (item: any, index: number) => {
        if (item.materialCodeId) {
          this.workTypeId = item.categoryTypeId;
          this.fetchMaterialCodeById(item.materialCodeId, index);
        }
        const quotationItemGroup = this.builder.group({
          indentItemId: item.indentItemId,
          subCategoryId: item.subCategoryId,
          specificationId: item.specificationId,
          unitId: item.unitId,
          quantity: item.quantity,
          materialCodeId: [item],
          workType: item.categoryTypeId,
          itemCategory: item.itemCategoryName,
          itemUnit: item.unitName,
          price: item.price,
          gst: item.gst,
          cgst: item.cgst,
          sgst: item.sgst,
          discount: item.discount,
          quotationItemCostWithGst: item.quotationItemCostWithGst,
          quotationItemCostWithOutGst: item.quotationItemCostWithOutGst,
          itemSubcategory: item.subCategoryName,
          itemSpecification: item.specification,
          quotationItemId: item.quotationItemId,
          quotationId: item.quotationId,
        });
        quotationIteams.push(quotationItemGroup);
      }
    );
  }

  populateTermsAndConditions() {
    this.qoTermsAndConditions.clear();
    this.quotationDataForEdit.qoTermsAndConditions.forEach(
      (item: any, index: number) => {
        const quotationTermsAndConGroup = this.builder.group({
          id: item.id,
          qoTermsAndConditionDes: item.qoTermsAndConditionDes,
          quotationId: item.quotationId,
        });
        this.qoTermsAndConditions.push(quotationTermsAndConGroup);
      }
    );
  }

  createQuotationGroup(): FormGroup {
    return this.builder.group({
      indentItemId: [0],
      workType: [''],
      materialCodeId: [0],
      quantity: [''],
      itemCategory: [''],
      itemSubcategory: [''],
      itemSpecification: [''],
      itemUnit: [''],
      price: [''],
      gst: [''],
      cgst: [''],
      sgst: [''],
      discount: [],
      quotationItemCostWithGst: [''],
      quotationItemCostWithOutGst: [''],
      quotationId: [],
      quotationItemId: [0],
    });
  }

  createTermsAndConditionGroup(): FormGroup {
    return this.builder.group({
      qoTermaAndConditionId: [0],
      qoTermsAndConditionDes: [''],
    });
  }

  createQuotationChargeGroup(): FormGroup {
    return this.builder.group({
      id: [0],
      transportCharge: [0],
      loadingCharge: [0],
      unLoadingChange: [0],
      installationCharge: [0],
      otherCharge: [0],
    });
  }

  get quotationItems(): FormArray {
    return this.formData.get('quotationItems') as FormArray;
  }

  get qoTermsAndConditions(): FormArray {
    return this.formData.get('qoTermsAndConditions') as FormArray;
  }

  get quotationCharges(): FormArray {
    return this.formData.get('quotationCharges') as FormArray;
  }

  initializeValueChanges() {
    this.quotationItems.controls.forEach((control, index) => {
      const group = control as FormGroup;
      group.get('quantity')?.valueChanges.subscribe(() => {
        this.updateValue(index);
      });
      group.get('price')?.valueChanges.subscribe(() => {
        this.updateValue(index);
      });
      group.get('gst')?.valueChanges.subscribe(() => {
        this.updateValue(index);
      });
      group.get('cgst')?.valueChanges.subscribe(() => {
        this.updateValue(index);
      });
      group.get('sgst')?.valueChanges.subscribe(() => {
        this.updateValue(index);
      });
      group.get('discount')?.valueChanges.subscribe(() => {
        this.updateValue(index);
      });

      group.get('discount')?.valueChanges.subscribe(() => {
        this.updateValue(index);
      });

      group.get('transportCharge')?.valueChanges.subscribe(() => {
        this.updateValue(index);
      });

      group.get('loadingCharge')?.valueChanges.subscribe(() => {
        this.updateValue(index);
      });

      group.get('unLoadingChange')?.valueChanges.subscribe(() => {
        this.updateValue(index);
      });

      group.get('installationCharge')?.valueChanges.subscribe(() => {
        this.updateValue(index);
      });

      group.get('otherCharge')?.valueChanges.subscribe(() => {
        this.updateValue(index);
      });
    });
  }

  private updateValue(index: number) {
    const itemGroup = this.quotationItems.at(index) as FormGroup;

    // Parse base values
    const quantity =
      parseFloat(String(itemGroup.get('quantity')?.value).replace(/,/g, '')) ||
      0;
    const rate =
      parseFloat(String(itemGroup.get('price')?.value).replace(/,/g, '')) || 0;

    const gst = parseFloat(itemGroup.get('gst')?.value) || 0;

    const cgst = parseFloat(itemGroup.get('cgst')?.value) || 0;

    const sgst = parseFloat(itemGroup.get('sgst')?.value) || 0;

    const discount = parseFloat(itemGroup.get('discount')?.value) || 0;

    // Parse charges
    const transportCharge =
      parseFloat(itemGroup.get('transportCharge')?.value) || 0;
    const loadingCharge =
      parseFloat(itemGroup.get('loadingCharge')?.value) || 0;
    const unLoadingCharge =
      parseFloat(itemGroup.get('unLoadingChange')?.value) || 0;
    const installationCharge =
      parseFloat(itemGroup.get('installationCharge')?.value) || 0;
    const otherCharge = parseFloat(itemGroup.get('otherCharge')?.value) || 0;

    // Step 1: Base value
    const baseValue = quantity * rate;

    // Step 2: Apply discount
    const discountedValue = baseValue - (baseValue * discount) / 100;

    // Step 3: Add all charges
    const valueWithCharges =
      discountedValue +
      transportCharge +
      loadingCharge +
      unLoadingCharge +
      installationCharge +
      otherCharge;

    // Step 4: Apply GST

    var costWithGst = 0;
    if (this.isFromKarnatakaGst) {
      const cgstObject = this.gstFromKarnataka.find((item) => item.id == cgst);
      if (cgstObject) {
        var totalCgstAndSgst = cgstObject.gstPercentage * 2;
        costWithGst =
          valueWithCharges + (valueWithCharges * totalCgstAndSgst) / 100;
      }
    } else {
      const gstObject = this.gstOutOfKarnataka.find((item) => item.id == gst);
      console.log(gstObject);
      if (gstObject) {
        costWithGst =
          valueWithCharges + (valueWithCharges * gstObject.gstPercentage) / 100;
      }
    }

    // Format values
    const formattedValue = valueWithCharges
      ? this.decimalPipe.transform(valueWithCharges, '1.2-2')
      : '0.00';
    const formattedCostWithGst = costWithGst
      ? this.decimalPipe.transform(costWithGst, '1.2-2')
      : '0.00';

    // Patch values back
    itemGroup.patchValue(
      {
        quotationItemCostWithOutGst: formattedValue,
        quotationItemCostWithGst: formattedCostWithGst,
      },
      { emitEvent: false }
    );
  }

  convertToNumbers = (dto: any) => {
    dto.quotationItems = dto.quotationItems.map((item: any) => ({
      ...item,
      price: Number(String(item.price).replace(/,/g, '')),
      quantity: Number(String(item.quantity).replace(/,/g, '')),
      quotationItemCostWithOutGst: Number(
        String(item.quotationItemCostWithOutGst).replace(/,/g, '')
      ),
      quotationItemCostWithGst: Number(
        String(item.quotationItemCostWithGst).replace(/,/g, '')
      ),
    }));
    return dto;
  };

  gotoQuotations() {
    if (this.status === 'PendingQuotation') {
      this.router.navigate(['layout/procurement/createquotation'], {
        state: {
          indentId: this.indentId,
          displayPageData: this.displayPageData,
          pageDataFromCreateQuotation: this.pageDataFromCreateQuotation,
        },
      });
    } else if (this.status === 'ApprovedQuotation') {
      this.router.navigate(['layout/procurement/app/rej/rework/quotation'], {
        state: {
          indentId: this.indentId,
          displayPageData: this.displayPageData,
          pageDataFromCreateQuotation: this.pageDataFromCreateQuotation,
        },
      });
    }
  }

  getWorkTypes = () => {
    this.commanService.fetchCommonReferenceTypes(WORK_TYPE).subscribe({
      next: (data) => {
        this.options = data;
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  };
  onWorkTypeChange = (event: MatSelectChange): void => {
    this.workTypeId = event.value === 'All' ? 0 : (event.value as number);
    this.fetchMaterialCodes();
  };

  fetchMaterialCodes = (): void => {
    this.itemUnitService
      .getMaterialCodes(this.workTypeId, this.materialCode, this.materialCodeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ItemUnitDto[]) => {
          this.itemUnits = response;
          this.cdr.detectChanges();
        },
        error: (error: Error) => {
          console.error('error While Fetching Material Codes', error);
        },
      });
  };

  filteredUnits(): any[] {
    const units = this.itemUnits;
    return units;
  }

  displayUnit(unitData: any): string {
    return unitData && unitData.materialCode ? unitData.materialCode : '';
  }

  onUnitSelectionChange(event: any, index: number): void {
    const materialCodeId = event.option.value.unitId;
    if (materialCodeId) {
      this.fetchAndUpdateMaterialCodes(materialCodeId, index);
    }
  }

  private fetchAndUpdateMaterialCodes(
    materialCodeId: number,
    index: number
  ): void {
    this.filteredItemUnits = this.itemUnits.filter(
      (unit) => unit.unitId === materialCodeId
    );
    this.updateFormGroupWithmaterialCodeData(index);
  }

  private updateFormGroupWithmaterialCodeData(index: number): void {
    if (index < this.quotationItems.length) {
      const indent = this.quotationItems.at(index) as FormGroup;
      const itemUnit = this.filteredItemUnits[0];
      indent.patchValue({
        materialCodeId: itemUnit,
        itemCategory: itemUnit.itemCategoryName,
        itemSubcategory: itemUnit.itemSubCategoryName,
        itemSpecification: itemUnit.itemSpecificationName,
        itemUnit: itemUnit.inventoryUnitName,
      });
    }
  }

  searchUnit(event: any) {
    const query = event.target.value.trim().toLowerCase();
  }

  searchVendor(event: any) {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.vendorCode = query;
      this.fetchVendors();
    }
  }

  onVendorSelect(event: any) {
    if (
      !this.isAdding &&
      this.quotationDataForEdit.vendorId == event.option.value.id
    ) {
      this.populateQuotatioItems();
    }
    this.vendorId = event.option.value.id;
    const selectedVendor = event.option.value;
    const vendorGst = event.option.value.gstNumber;
    this.vendor.setValue(selectedVendor, { emitEvent: false });
    this.isFromKarnatakaGst = vendorGst.startsWith('29');
    this.formData.patchValue({
      vendorGst: vendorGst,
    });
    if (this.formData.get('vendorId')?.value !== this.vendorId) {
      this.formData.patchValue({ vendorId: this.vendorId });
    }
  }

  validateVendor() {
    this.quotationService
      .validateVendor(this.vendorId, this.indentId, this.quotationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: boolean) => {
          this.isVendorPresent = response;

          if (this.isVendorPresent) {
            // Swal.fire({
            //   icon: 'warning',
            //   text: 'Vendor has already given a quotation for this indent.',
            // });
            // this.vendorIdControl.setValue(null);
            // this.vendor.setValue(null);
          }
        },
        error: (error: Error) => {
          console.error('Vendor validation error:', error);
        },
      });
  }

  displayVendor(vendor: any) {
    if (typeof vendor === 'number' && vendor != undefined) {
      const selectedVendor = this.vendors.find((v) => v.id === vendor);
      return selectedVendor && selectedVendor.vendorCode;
    } else if (vendor != undefined) {
      return vendor && vendor.vendorCode ? vendor.vendorCode : '';
    }
  }

  get vendorIdControl(): FormControl {
    return this.formData.get('vendorId') as FormControl;
  }

  searchVendorName(event: any) {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.vendorName = query;
      this.fetchVendors();
    }
  }

  onVendorNameSelect(event: any) {
    if (
      !this.isAdding &&
      this.quotationDataForEdit.vendorId == event.option.value.id
    ) {
      this.populateQuotatioItems();
    }
    const selectedVendor = event.option.value;
    const vendorGst = event.option.value.gstNumber;
    const vendorId = event.option.value.id;
    this.selectedVendor.vendorCode = selectedVendor.vendorCode;
    this.vendorIdControl.setValue(selectedVendor, { emitEvent: false });
    this.isFromKarnatakaGst = vendorGst.startsWith('29');
    this.formData.patchValue({
      vendorId: vendorId,
      vendorGst: vendorGst,
    });
  }

  displayVendorName(vendor: Vendor) {
    return vendor && vendor.vendorName ? vendor.vendorName : '';
  }

  save() {
    this.validateFieldsOnSave();
    const transformedQuotation = {
      ...this.formData.value,
      quotationItems: this.formData.value.quotationItems.map((item: any) => ({
        ...item,
        materialCodeId:
          typeof item.materialCodeId === 'object'
            ? item.materialCodeId.unitId
            : item.materialCodeId,
      })),
      vendorId:
        typeof this.formData.value.vendorId === 'object' &&
        this.formData.value.vendorId !== null
          ? this.formData.value.vendorId.id
          : this.formData.value.vendorId,
    };

    this.convertToNumbers(transformedQuotation);
    const formData = this.buildFormData(transformedQuotation);

    if (this.formData.touched && this.formData.valid && !this.isVendorPresent) {
      this.showLoading();
      const saveOrUpdate$ = this.isAdding
        ? this.quotationService.addQuotation(formData)
        : this.quotationService.updateQuotation(formData, this.quotationType);
      saveOrUpdate$.subscribe({
        next: (response) => {
          this.handleSuccessResponse(response);
          // this.router.navigate(['./createquotation'], navigateExtras);
          this.hideLoading();
          this.gotoQuotations();
        },
        error: (error) => {
          this.handleErrorResponse(error);
          this.hideLoading();
        },
      });
    }
  }

  private buildFormData(quotationData: any): FormData {
    const formData = new FormData();
    this.selectedFiles = this.getDocumentsArray(this.documents);
    if (this.selectedFiles.length === 0) {
      formData.append('files', new File([''], '', { type: '' }));
    } else {
      this.selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
    }
    formData.append('quotationDataDto', JSON.stringify(quotationData));
    return formData;
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

  getDocumentsBasedOnId() {
    this.commanService
      .getDocumentById(
        this.quotationId,
        this.documentType,
        this.pageIndex,
        this.pageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.quotationDocuments = response;
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  fetchIndentItemsByIndentId() {
    this.indentService
      .getIndentItemsByIndentId(this.indentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.indentItems = response;
          this.formData.patchValue({
            indentId: response[0].indentId,
            projectId: response[0].projectId,
            projectName: response[0].projectName,
          });
          if (this.isAdding) {
            this.patchIndentItems();
          }
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  patchIndentItems() {
    this.indentItems.forEach((item: any, index: number) => {
      this.fetchMaterialCodeById(item.unitId, index);
      const formGroup = this.builder.group({
        indentItemId: item.indentItemId,
        itemCategory: item.categoryName,
        workType: item.categoryTypeId,
        materialCodeId: [item],
        itemSubcategory: item.subCategoryName,
        itemSpecification: item.specification,
        itemUnit: item.unitName,
        quantity: item.quantity,
        price: ['', Validators.required],
        gst: [''],
        cgst: [''],
        sgst: [''],
        quotationItemCostWithOutGst: [''],
        quotationItemCostWithGst: [''],
        discount: [''],
      });
      this.quotationItems.push(formGroup);
    });
    this.initializeValueChanges();
  }

  fetchMaterialCodeById(materialCodeId: number, index: number) {
    this.showLoading();
    this.itemUnitService
      .getMaterialCodes(this.workTypeId, this.materialCode, materialCodeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ItemUnitDto[]) => {
          if (response.length > 0) {
            if (!response || response.length === 0) {
              return;
            }
            const selectedMaterial = response[0];

            const control = this.quotationItems.at(index);
            if (control) {
              control.patchValue({
                materialCodeId: selectedMaterial,
                itemCategory: selectedMaterial.itemCategoryName,
                itemSubcategory: selectedMaterial.itemSubCategoryName,
                itemSpecification: selectedMaterial.itemSpecificationName,
                itemUnit: selectedMaterial.inventoryUnitName,
              });
            }
          }
          this.hideLoading();
        },
        error: (error: Error) => {
          console.error('Error While Fetching Material Codes', error);
          this.hideLoading();
        },
      });
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
  fetchVendorsPopUp() {
    this.vendorService
      .getVendorCodesWithOutPage(this.PopUpVendorCode, this.PopUpVendorName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vendorCode) => {
          this.vendorPopUp = vendorCode;
        },
        error: (error: Error) => {
          console.error(error);
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

  onGstChange(value: string, index: number) {
    const control = (this.formData.get('quotationItems') as FormArray).at(
      index
    );
    control.get('gst')?.setValue(value);
  }

  onSgstChange(value: any, index: number) {
    console.log(value);
    const control = (this.formData.get('quotationItems') as FormArray).at(
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
    console.log(value);
    const control = (this.formData.get('quotationItems') as FormArray).at(
      index
    );
    console.log(control);
    control.get('cgst')?.setValue(value);
    control.get('sgst')?.setValue(value);
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  addAdditionalQuotationItems() {
    this.quotationItems.push(this.createQuotationGroup());
    this.initializeValueChanges();
  }

  removeIcons(index: number) {
    const items = this.formData.get('quotationItems') as FormArray;
    const formGroupAtIndex = items.at(index) as FormGroup;
    const dataToRemove = formGroupAtIndex.value;
    this.openConfirmDialog(dataToRemove.quotationItemId, index);
  }

  openConfirmDialog(quotationItemId: any, index: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Quotation Item' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteQuotationItem(quotationItemId, index);
          const items = this.formData.get('quotationItems') as FormArray;
          items.removeAt(index);
          this.initializeValueChanges();
        }
      }
    );
  }

  deleteQuotationItem(quotationItemId: number, index: number) {
    if (quotationItemId > 0) {
      this.quotationService
        .deleteQuotationItem(quotationItemId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (reponse) => {
            console.log(reponse);
          },
          error: (error: Error) => {
            console.log(error);
          },
        });
    }
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

  formatRate(event: any): void {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;
    if (value.includes('.')) {
      const [integerPart, decimalPart] = value.split('.');
      value = `${integerPart}.${decimalPart.substring(0, 2)}`;
    }
    inputElement.value = value;
  }

  private fetchVendorById(vendorId: number) {
    this.vendorService.getAllvendorsById(vendorId).subscribe({
      next: (vendor) => {
        this.selectedVendor = vendor;
        this.vendorIdControl.patchValue(this.selectedVendor);
        this.vendor.patchValue(this.selectedVendor);
        this.formData.patchValue({
          vendorGst: this.selectedVendor.gstNumber,
        });
        const vendorGst = this.selectedVendor.gstNumber;
        if (vendorGst && vendorGst.startsWith('29')) {
          this.isFromKarnatakaGst = true;
        } else {
          this.isFromKarnatakaGst = false;
        }
      },
      error: (error: Error) => {
        console.error(error);
      },
    });
  }

  addQoTermsAndConditions() {
    this.qoTermsAndConditions.push(this.createTermsAndConditionGroup());
  }

  removeQoTermsAndConditions(index: number, item: any) {
    const items = this.formData.get('qoTermsAndConditions') as FormArray;
    const formGroupAtIndex = items.at(index) as FormGroup;
    const dataToRemove = formGroupAtIndex.value;
    items.removeAt(index);
    this.openConfirmDialogForQuotationTermsAndCon(dataToRemove.id, index);
  }

  openConfirmDialogForQuotationTermsAndCon(id: any, index: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Terms And Condition' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteTermsAndCon(id);
        }
      }
    );
  }

  deleteTermsAndCon(id: number) {
    this.quotationService
      .deleteQuoTermsAndCond(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (reponse) => {
          console.log(reponse);
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  viewDownLoads() {
    const dialogRef = this.dialog.open(DocumentComponent, {
      width: '60%',
      height: '500px',
      data: {
        documents: this.quotationDocuments,
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

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
  clearModalFilters() {
    this.modalMaterilCode = '';
  }
  onVendorCodeSelect(data: any) {
    this.vendorDataFromPopUp = data;
    this.VendorIdFromModel = data.id;
  }
  selectVendorCode() {
    if (this.VendorIdFromModel != null) {
      this.patchPopUpSelectedData(this.vendorDataFromPopUp);
    } else {
      Swal.fire({
        icon: 'info',
        text: 'No Selection !',
        timerProgressBar: true,
        timer: 2000,
      });
    }
    this.VendorIdFromModel = null;
  }
  patchPopUpSelectedData(vendorDataFromPopUp: Vendor) {
    const selectedVendor = vendorDataFromPopUp;
    const vendorId = vendorDataFromPopUp.id;
    const vendorGst = vendorDataFromPopUp.gstNumber;
    this.selectedVendor.vendorCode = selectedVendor.vendorCode;
    this.isFromKarnatakaGst = vendorGst.startsWith('29');
    this.vendor.setValue(selectedVendor, { emitEvent: false });
    this.vendorIdControl.setValue(selectedVendor, { emitEvent: false });
    this.formData.patchValue({
      vendorId: vendorId,
      vendorGst: vendorGst,
    });
  }

  fetchVendorsForPopUp() {
    this.showLoading();
    this.vendorService
      .getAllvendors(
        this.pageIndex,
        this.pageSize,

        this.PopUpVendorName,
        this.PopUpVendorCode,
        '',
        '',
        '',
        '',
        0
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vendorData) => {
          this.totalItems = vendorData.totalRecords;
          this.paginator.pageIndex = this.pageIndex;
          this.paginator.pageSize = this.pageSize;
          this.vendorPopUpData = vendorData.records;
          console.log(this.vendorPopUpData);
          this.hideLoading();
        },
        error: (error) => {
          this.hideLoading();
          console.error(error);
        },
      });
  }
  onPopUpPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    // this.fetchMaterialCodesForModel();
    this.fetchVendorsForPopUp();
  }
  setVendor() {
    this.fetchVendorsForPopUp();
  }

  popUpSearchVendor(event: any) {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.PopUpVendorCode = query;
      this.fetchVendorsForPopUp();
    }
  }

  onPopVendorSelect(event: any) {
    const selectedVendor = event.option.value;
    this.PopUpVendorCode = selectedVendor.vendorCode;
    this.popUpvendorIdControl.setValue(selectedVendor, { emitEvent: false });
    this.fetchVendorsForPopUp();
  }

  displayPopUpVendor(vendor: any) {
    return vendor && vendor.vendorCode ? vendor.vendorCode : '';
  }
  searchPopUpVendorName(event: any) {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.PopUpVendorName = query;
      this.fetchVendorsForPopUp();
    }
  }

  onPopUpVendorNameSelect(event: any) {
    const selectedVendor = event.option.value;
    this.PopUpVendorName = selectedVendor.vendorName;
    this.PopUpVendor.setValue(selectedVendor, { emitEvent: false });

    this.fetchVendorsForPopUp();
  }
  displayPopUpVendorName(vendor: any) {
    return vendor && vendor.vendorName ? vendor.vendorName : '';
  }
  resetForm(
    popUpVendorCodeAuto: MatAutocomplete,
    PopUpVendorNameAuto: MatAutocomplete
  ) {
    const vendor = new Vendor();
    this.PopUpVendorName = '';
    this.PopUpVendorCode = '';
    this.PopUpVendor.reset(vendor);
    this.popUpvendorIdControl.reset(vendor);
    this.fetchVendorsForPopUp();
    this.pageSize = PAGE_SIZE;
    this.pageIndex = PAGE_INDEX;
    popUpVendorCodeAuto.options.forEach((option) => option.deselect());
    PopUpVendorNameAuto.options.forEach((option) => option.deselect());
  }

  paymentTermChange(event: any) {
    this.paymentTermType = event.value;
    const control = this.formData.get('advanceAmountOrPercentage');
    const control2 = this.formData.get('numberOfDays');
    control?.reset('');
    control2?.reset('');
    if (this.paymentTermType === 'CREDIT') {
      this.isGreaterThenAmount = false;
    }
    const quotationItems = this.quotationItems;
    let totalCostWithGst = 0;
    quotationItems.value.forEach((item: any) => {
      let costWithGst = item.quotationItemCostWithGst || '0';
      if (typeof costWithGst === 'string') {
        costWithGst = costWithGst.replace(/,/g, '');
      }
      const numericValue = parseFloat(costWithGst) || 0;
      totalCostWithGst += numericValue;
    });
    this.totalCostWithGst = totalCostWithGst;
  }

  onAdvanceAmountOrPercentageChange() {
    const control = this.formData.get('advanceAmountOrPercentage');
    const advanceAmountOrPercentage = parseFloat(control?.value || 0);
    control?.clearValidators();
    if (this.paymentTermType === 'ADVANCE IN PERCENTAGE') {
      this.isGreaterThenAmount = advanceAmountOrPercentage > 100;
      control?.setValidators([Validators.max(100)]);
    } else if (this.paymentTermType === 'ADVANCE IN AMOUNT') {
      console.log(this.totalCostWithGst);
      this.isGreaterThenAmount =
        advanceAmountOrPercentage > this.totalCostWithGst;
      control?.setValidators([Validators.max(this.totalCostWithGst)]);
    }
    control?.markAsTouched();
    control?.markAsDirty();
    control?.updateValueAndValidity({ emitEvent: false });
  }

  validateFieldsOnSave() {
    this.quotationItems.controls.forEach((control) => {
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

  ngAfterViewInit() {
    this.resizeAllTextareas();
  }

  resizeAllTextareas() {
    this.qoTermsTextareas.forEach((textarea) => {
      this.autoResize(textarea.nativeElement);
    });
  }

  autoResize(textarea: HTMLTextAreaElement) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
