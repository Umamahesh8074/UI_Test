import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, takeUntil } from 'rxjs';
import { ReusableComponent } from 'src/app/Comman-Components/base-component/base.component';
import {
  Defalut_Status,
  PAGE_INDEX,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';
import { IndentItems } from 'src/app/Models/Procurement/indentDto';
import {
  IPurchaseOrderDto,
  PurchaseOrderDto,
} from 'src/app/Models/Procurement/purchaseorder';
import { IStagesDto } from 'src/app/Models/WorkOrder/WorkOrderBilling';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { IndentService } from 'src/app/Services/ProcurementService/Indent/indent.service';
import { PurchaseOrderService } from 'src/app/Services/ProcurementService/PurchaseOrder/purchaseorder.service';
import { QuotationService } from 'src/app/Services/ProcurementService/Quotation/quotation.service';
import { StoreService } from 'src/app/Services/ProcurementService/Store/store.service';

@Component({
  selector: 'app-purchaseorder',
  templateUrl: './purchaseorder.component.html',
  styleUrls: ['./purchaseorder.component.css'],
})
export class PurchaseOrderComponent
  extends ReusableComponent
  implements OnInit
{
  purchaseOrderData: PurchaseOrderDto | undefined;
  purchaseOrderDetails: IPurchaseOrderDto = new PurchaseOrderDto();
  purchaseOrder: any;

  quotationData: any;
  quotationItems: any[] = [];
  quotationId: number = 0;

  indentItems: IndentItems[] = [];
  indentData: any;
  indentTotalItems: number = 0;
  indentId: number = 0;

  stages: IStagesDto[] = [];
  indentStages: IStagesDto[] = [];
  isAdding: boolean = true;

  openDialog: boolean | undefined;
  openQuotationDialog: boolean | undefined;
  isLoading: boolean = false;
  termsAndConditions: any;

  stores: any[] = [];
  storeId: number = 0;
  storeName: string = '';
  displayPageData: any;
  displayApprovedQuotationPage: any;
  storeProjectId: number = 0;

  //documents pagination
  termsAndConTotalItems: number = TOTAL_ITEMS;
  termsAndConPageSize: number = 15;
  termsAndConPageIndex: number = PAGE_INDEX;
  termsAndConPageSizeOptions = pageSizeOptions;
  quotationCharges: any[] = [];

  quotationItemsDisplayedColumns = [
    'category',
    'subcategory',
    'specification',
    'unit',
    'cost',
    'discount',
    'gst',
  ];
  chargesColumns = ['chargeType', 'cost'];

  displayedColumns: string[] = [
    'ItemId',
    'category',
    'subCategory',
    'specification',
    'unit',
    'cost',
    'quantity',
    'quotationItemCostWithOutGst',
    'gst',
    'discount',
    'quotationItemCostWithGst',
  ];
  displayedColumnsTermsAndCon = ['rowNumber', 'termsAndConditions'];
  displayedColumns2: string[] = [
    'id',
    'transportCharge',
    'loadingCharge',
    'unLoadingCharge',
    'installationCharge',
    'otherCharge',
  ];
  ngOnInit(): void {
    this.getDataFromState();
    this.setUserFromLocalStorage();
    this.initializeFromHistoryState();
  }

  constructor(
    private quotationService: QuotationService,
    private formBuilder: FormBuilder,
    private indentService: IndentService,
    private storeService: StoreService,
    private purchaseOrderService: PurchaseOrderService,
    commanService: CommanService,
    router: Router,
    route: ActivatedRoute
  ) {
    super(commanService, router, route);
  }

  private initializeFromHistoryState() {
    const { quotation } = history.state;
    if (quotation) {
      this.purchaseOrderDetails = quotation;
      this.quotationData = quotation;
      this.indentTotalItems = this.indentItems.length;
      this.indentId = quotation.indentId;
      this.indentItems = quotation.indentItems;
      this.quotationId = quotation.quotationId;
    }
    this.initializeForm();
    this.loadDetails();
  }

  private initializeForm(): void {
    this.formData = this.formBuilder.group({
      id: [],
      orgId: [1],
      projectId: [this.purchaseOrderDetails.projectId],
      indentId: [this.purchaseOrderDetails.indentId],
      quotationId: [this.purchaseOrderDetails.quotationId],
      storeId: [],
      code: [''],
      status: [Defalut_Status],
    });
  }

  getDataFromState() {
    const {
      purchaseOrder,
      isAdding,
      displayPage,
      quotation,
      quotationId,
      displayApprovedQuotationPage,
    } = history.state;

    this.isAdding = isAdding;

    if (displayPage) {
      this.displayPageData = displayPage;
    }
    if (displayApprovedQuotationPage) {
      this.displayApprovedQuotationPage = displayApprovedQuotationPage;
    }
    if (quotationId) {
      this.quotationId = quotationId;
    }
    if (quotation) {
      this.storeProjectId = quotation.projectId;
      if (this.storeProjectId > 0) {
        this.getAllStores();
      }
    }
    if (purchaseOrder) {
      this.purchaseOrder = purchaseOrder;
      this.patchValueToForm();
      this.getStoreById(purchaseOrder.storeId);
    }
  }

  patchValueToForm() {
    this.formData.patchValue({ id: this.purchaseOrder.id });
  }

  getStoreById(storeId: number) {
    this.storeService
      .getStoreById(storeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.storeIdControl.patchValue(response);
          }
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  loadDetails() {
    this.isLoading = true;
    forkJoin({
      quotationData: this.quotationService.fetchQuotationBasedonQuotationId(
        this.quotationId,
        this.pageIndex,
        this.pageSize
      ),
      stages: this.quotationService.getStages(this.quotationId, this.userId),
      indentStages: this.indentService.getStages(this.indentId, this.userId),
      quotationCharges: this.quotationService.getQuotationCharges(
        this.quotationId
      ),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ quotationData, stages, indentStages, quotationCharges }) => {
          this.quotationItems = quotationData.records;
          this.totalItems = quotationData.totalRecords;
          this.stages = stages;
          this.quotationCharges = quotationCharges;
          this.indentStages = indentStages;
        },
        error: (err) => {
          console.error(err);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }

  save() {
    const transformedQuotation = {
      ...this.formData.value,
      storeId:
        typeof this.formData.value.storeId === 'object' &&
        this.formData.value.storeId !== null
          ? this.formData.value.storeId.storeId
          : this.formData.value.storeId,
    };

    if (this.formData.touched && this.formData.valid) {
      const saveOrUpdate$ = this.isAdding
        ? this.purchaseOrderService.savePurchaseOrder(transformedQuotation)
        : this.purchaseOrderService.updatePurchaseOrder(transformedQuotation);
      saveOrUpdate$.subscribe({
        next: (response) => {
          const navigateExtras = {
            relativeTo: this.route.parent,
            state: {
              quotationId: this.quotationId,
              quotation: this.quotationData,
            },
          };
          this.handleSuccessResponse(response);
          this.router.navigate(['./display/po'], navigateExtras);
        },
        error: (error) => {
          this.handleErrorResponse(error);
        },
      });
    }
  }

  // getAllStores() {
  //   this.storeService
  //     .getAllStoreWithOutPage(this.storeName)
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (response: any) => {
  //         this.stores = response;
  //       },
  //       error: (error: Error) => {
  //         console.log(error);
  //       },
  //     });
  // }

  getAllStores() {
    this.storeService
      .getAllStoreWithOutPage(this.storeName, this.userId, this.storeProjectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (storeData) => {
          this.stores = storeData;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  searchStore(event: any) {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.storeName = query;
      this.getAllStores();
    }
  }

  onStoreSelect(event: any) {
    this.storeId = event.option.value.storeId;
    if (this.formData.get('storeId')?.value !== this.storeId) {
      this.formData.patchValue({ storeId: this.storeId });
    }
  }

  displayStore(store: any) {
    if (typeof store === 'number' && store != undefined) {
      const selectedStore = this.stores.find((s) => s.storeId === store);
      return selectedStore && selectedStore.storeName;
    } else if (store != undefined) {
      return store && store.storeName ? store.storeName : '';
    }
  }

  get storeIdControl(): FormControl {
    return this.formData.get('storeId') as FormControl;
  }

  gotoPurchaseOrder() {
    this.router.navigate(['layout/procurement/display/po'], {
      state: {
        quotationId: this.quotationId,
        indentId: this.indentId,
        quotation: this.quotationData,
        displayPageData: this.displayPageData,
        displayApprovedQuotationPage: this.displayApprovedQuotationPage,
      },
    });
  }

  gotoQuotation() {
    this.router.navigate(['layout/procurement/display/purchase/order'], {});
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadDetails();
  }

  onClose() {
    this.openDialog = false;
  }
  onCloseQuotation() {
    this.openQuotationDialog = false;
  }
  viewIndent() {
    this.openDialog = true;
  }
  viewQuotation() {
    this.openQuotationDialog = true;
  }
  viewTermsAndConditions() {
    this.getTermsAndConBasedOnId();
  }

  onTermsAndCondPageChange(event: any) {
    this.termsAndConPageSize = event.pageSize;
    this.termsAndConPageIndex = event.pageIndex;
    this.getTermsAndConBasedOnId();
  }

  getTermsAndConBasedOnId() {
    this.commanService
      .getTermsAndCond(
        this.quotationId,
        this.termsAndConPageIndex,
        this.termsAndConPageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.termsAndConditions = response.records;
          this.termsAndConTotalItems = response.totalRecords;
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }
}
