import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TIME_OUT,
  WORK_TYPE,
} from 'src/app/Constants/CommanConstants/Comman';
import { GetInventoryReceivablesDto } from 'src/app/Models/Procurement/inventory-receivable';
import { InventoryReceivableService } from 'src/app/Services/ProcurementService/InventoryReceivable/inventory-receivable.service';
import { InventoryReceivableDetailsPopupComponent } from '../../inventory-receivable-details-popup/inventory-receivable-details-popup.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IProject, Project } from 'src/app/Models/Project/project';
import { IVendor, Vendor } from 'src/app/Models/WorkOrder/VendorData';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { User } from 'src/app/Models/User/User';
import { vendorService } from 'src/app/Services/WorkOrderService/Vendor Data/vendor.service';
import { ItemCategoryService } from 'src/app/Services/ProcurementService/item-category.service';
import { ItemCategory } from 'src/app/Models/Procurement/ItemCategory';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { ItemSubCategoryService } from 'src/app/Services/ProcurementService/ItemSubCategory/item-sub-category.service';
import { ItemSubCategory } from 'src/app/Models/Procurement/itemsubcategory';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ItemUnitService } from 'src/app/Services/ProcurementService/ItemUnit/item-unit.service';
import { ItemUnit, ItemUnitDto } from 'src/app/Models/Procurement/itemunit';
import { ItemSpecification } from 'src/app/Models/Procurement/itemspecification';
import { ItemSpecificationService } from 'src/app/Services/ProcurementService/ItemSpecification/item-specification.service';
import { StoreService } from 'src/app/Services/ProcurementService/Store/store.service';
import { Store } from 'src/app/Models/Procurement/store';
import {
  IPurcahseOrder,
  PurchaseOrder,
} from 'src/app/Models/Procurement/purchaseorder';
import { PurchaseOrderService } from 'src/app/Services/ProcurementService/PurchaseOrder/purchaseorder.service';
import { formatDate } from '@angular/common';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';

@Component({
  selector: 'display-inventory-receivables',
  templateUrl: './display-inventory-receivables.component.html',
  styleUrls: ['./display-inventory-receivables.component.css'],
})
export class DisplayInventoryReceivableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  totalItems: number = 0;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  subCategory: FormControl<ItemSubCategory | null> =
    new FormControl<ItemSubCategory | null>(null);
  itemUnitData: ItemUnitDto[] = [];
  projectId: any;
  vendorId: any;
  options: CommonReferenceDetails[] = [];
  categoryId: any;
  category: any = new FormControl([] as ItemCategory[]);
  getInventoryReceivableData: GetInventoryReceivablesDto[] = [];
  projectFc: FormControl = new FormControl([] as Project[]);
  unitId: any;
  unitFc: FormControl = new FormControl([] as ItemUnit[]);
  itemCategoryFc: FormControl = new FormControl([] as ItemCategory[]);
  itemCat: any[] = [];
  vendor: any = new FormControl([] as IVendor[]);
  users: User[] = [];
  vendorName: string = '';
  projectName: string = '';
  vendors: IVendor[] = [];
  selectedProject: IProject = new Project();
  selectedVendor: IVendor = new Vendor();
  public user: User = new User();
  workTypeId: number = 0;
  itemSubCategorySerachText: string = '';
  itemCategoryId: number = 0;
  organizationId = 0;
  categoryName: any;
  storeFc: FormControl = new FormControl([] as Store[]);
  itemUnitName: string = '';
  categoryPerIndex: { [key: number]: any[] } = {};
  // Add your lists for autocomplete or other sources
  project: Project[] = [];
  itemCategories: ItemCategory[] = [];
  itemSubCategoryData: ItemSubCategory[] = [];
  //spec fields
  purchaseOrderFc: FormControl = new FormControl([] as PurchaseOrder[]);
  code: any;
  purchaseOrder: PurchaseOrder[] = [];
  itemSpecifications: ItemSpecification[] = [];
  specification: FormControl<ItemSpecification | null> =
    new FormControl<ItemSpecification | null>(null);
  specificationId: any;
  specificationName: string = '';
  itemsubcategoryName: string = '';
  inventoryUnitId: any;

  itemSubCategoryId: any;
  selectedPo: IPurcahseOrder = new PurchaseOrder();
  storeName: any;
  storeData: Store[] = [];
  subCategoryId: any;
  selectedCategory: ItemCategory = new ItemCategory();
  selectedSubCategory: ItemSubCategory = new ItemSubCategory();
  selectedItemUnit: ItemUnit = new ItemUnit();
  selectedStore: Store = new Store();
  selectedSpecification: ItemSpecification = new ItemSpecification();

  formData!: FormGroup;
  dateRange: any = '';
  customStartDate: any = '';
  customEndDate: any = '';

  displayedColumns: string[] = [
    'rowNumber',
    'projectName',
    'code',
    'vendorName',
    'materialCode',
    'categoryName',
    'itemSubCategoryName',
    'storeName',
    'quantity',
    'quantityReceived',
    'totalPendingQuantity',
    'totalQuantityExceed',
    'invoiceReceivableStatus',
    'itemApprovalStatus',
    'actions',
  ];

  expandedRows: Set<number> = new Set();
  irId: any;
  poId: any;
  storeId: any;

  ngOnInit(): void {
    this.initForm();
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
    }
    if (history.state.poId) {
      this.poId = history.state.poId;
    }

    this.getAllInventoryReceivables();
    this.getProjects();
    this.fetchVendors();

    this.getAllItemCategories();

    this.getWorkTypes();
    this.getAllPurchaseOrder();
    this.fetchStore();

    this.patchFormData();
  }

  patchFormData() {
    this.selectedProject = history.state.displaypage.selectedProject;
    this.selectedPo = history.state.displaypage.selectedPo;
    this.selectedVendor = history.state.displaypage.selectedVendor;
    this.selectedCategory = history.state.displaypage.selectedCategory;
    this.selectedSubCategory = history.state.displaypage.selectedSubCategory;
    this.selectedItemUnit = history.state.displaypage.selectedItemUnit;
    this.selectedStore = history.state.displaypage.selectedStore;
    this.selectedSpecification =
      history.state.displaypage.selectedSpecification;
    this.workTypeId = history.state.displaypage.selectedWorkTypeId;
    this.pageSize = history.state.displaypage.pageSize;
    this.pageIndex = history.state.displaypage.pageIndex;
    this.patchFormValues();
  }

  patchFormValues() {
    if (this.selectedProject) {
      this.projectFc.patchValue(this.selectedProject);
      this.projectId = this.selectedProject.projectId;
    }
    if (this.selectedPo) {
      this.purchaseOrderFc.patchValue(this.selectedPo);
      this.poId = this.selectedPo.id;
    }
    if (this.selectedVendor) {
      this.vendor.patchValue(this.selectedVendor);
      this.vendorId = this.selectedVendor.id;
    }
    if (this.selectedCategory) {
      this.category.patchValue(this.selectedCategory);
      this.categoryId = this.selectedCategory.categoryId;
    }
    if (this.selectedSubCategory) {
      this.subCategory.patchValue(this.selectedSubCategory);
      this.subCategoryId = this.selectedSubCategory.subCategoryId;
    }
    if (this.selectedItemUnit) {
      this.unitFc.patchValue(this.selectedItemUnit);
      this.unitId = this.selectedItemUnit.unitId;
    }

    if (this.selectedStore) {
      this.storeFc.patchValue(this.selectedStore);
      this.storeId = this.selectedStore.storeId;
    }

    if (this.selectedSpecification) {
      this.specification.patchValue(this.selectedSpecification);
      this.specificationId = this.selectedSpecification.specificationId;
    }
    this.getAllInventoryReceivables();
  }
  constructor(
    private inventoryReceivableService: InventoryReceivableService,
    private router: Router,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private projectService: ProjectService,
    private vendorService: vendorService,
    private itemCategoryService: ItemCategoryService,
    private itemSubCategoryService: ItemSubCategoryService,
    private commanService: CommanService,
    private itemUnitService: ItemUnitService,
    private itemSpecificationService: ItemSpecificationService,
    private storeService: StoreService,
    private formBuilder: FormBuilder,
    private purchaseOrderService: PurchaseOrderService,
    private loaderService: LoaderService
  ) {}

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    history.state.pageIndex = this.pageIndex;
    history.state.pageSize = this.pageSize;
    this.getAllInventoryReceivables();
  }

  getAllInventoryReceivables() {
    this.showLoading();
    this.inventoryReceivableService
      .getAllInventoryReceivables(
        this.projectId,
        this.vendorId,
        this.categoryId,
        this.irId,
        this.poId,
        this.subCategoryId,
        this.specificationId,
        this.inventoryUnitId,
        this.storeId,
        this.pageIndex,
        this.pageSize,
        this.workTypeId,
        this.user.userId
      )
      .subscribe((response) => {
        this.getInventoryReceivableData = response.records;
        this.totalItems = response.totalRecords;
        this.hideLoading();
      });
  }

  toggleRowExpansion(rowId: number) {
    if (this.expandedRows.has(rowId)) {
      this.expandedRows.delete(rowId);
    } else {
      this.expandedRows.add(rowId);
    }
  }

  isRowExpanded(rowId: number): boolean {
    return this.expandedRows.has(rowId);
  }

  addInventoryReceivable() {
    this.router.navigate(['layout/procurement/addgoodsreceived'], {
      state: {
        isAdding: true,
        displayPage: {
          selectedProject: this.selectedProject,
          selectedPo: this.selectedPo,
          selectedVendor: this.selectedVendor,
          selectedCategory: this.selectedCategory,
          selectedWorkTypeId: this.workTypeId,
          selectedSubCategory: this.selectedSubCategory,
          selectedSpecification: this.selectedSpecification,
          selectedItemUnit: this.selectedItemUnit,
          selectedStore: this.selectedStore,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          workTypeId: this.workTypeId,
        },
      },
    });
  }

  openConfirmDialog(irId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Inventory Receivable' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteInventoryReceivable(irId);
        }
      }
    );
  }

  deleteInventoryReceivable(irId: number) {
    this.inventoryReceivableService.deleteInventoryReceivable(irId).subscribe({
      next: (response) => {
        console.log(response);

        this.handleSuccessResponse(response);

        this.getAllInventoryReceivables();
      },
      error: (error) => {
        console.error('Error deleting inventory receivable:', error);
      },
    });
  }

  handleSuccessResponse(response: any): void {
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
  }

  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openDetailsPopup(row: any): void {
    const dialogRef = this.dialog.open(
      InventoryReceivableDetailsPopupComponent,
      {
        width: '100%',
        height: '80vh',
        data: row,
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed');
    });
  }

  editInventory(inventory: any) {
    console.log('Inventory id taking ', inventory.id);
    this.getInventoryById(inventory.irId).subscribe({
      next: (response) => {
        this.getInventoryReceivableData = response;

        this.router.navigate(['layout/procurement/goodsedit'], {
          state: {
            getInventoryReceivableData: this.getInventoryReceivableData,
            displayPage: {
              selectedProject: this.selectedProject,
              selectedPo: this.selectedPo,
              selectedVendor: this.selectedVendor,
              selectedCategory: this.selectedCategory,
              selectedWorkTypeId: this.workTypeId,
              selectedSubCategory: this.selectedSubCategory,
              selectedSpecification: this.selectedSpecification,
              selectedItemUnit: this.selectedItemUnit,
              selectedStore: this.selectedStore,
              pageIndex: this.pageIndex,
              pageSize: this.pageSize,
              workTypeId: this.workTypeId,
            },
          },
        });
      },
      error: (error) => {
        console.error(error);
      },
    });
  }
  getInventoryById(irId: number) {
    return this.inventoryReceivableService
      .getInventoryDetailsById(irId)
      .pipe(takeUntil(this.destroy$));
  }

  searchProject(event: any): void {
    this.paginator.firstPage();
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.projectName = query;
      this.getProjects();
    }
  }
  getProjects() {
    // alert(this.user.userId);
    this.projectService
      .getProjectsForPO(this.projectName, this.organizationId, this.user.userId)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.project = data;
          console.log(this.project);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  onProjectSelect(event: any) {
    this.paginator.firstPage();
    const selectedValue = event.option.value.projectId;
    this.selectedProject = event.option.value;
    console.log('Selected Project ID:', selectedValue);
    this.projectId = event.option.value.projectId
      ? event.option.value.projectId
      : '';

    if (this.projectId === '') {
      this.vendorId = '';
      this.categoryId = '';
      this.irId = '';
      this.projectId = '';
      this.poId = '';
      this.subCategoryId = '';
      this.specificationId = '';
      this.inventoryUnitId = '';
      this.storeId = '';
    }
    this.getAllInventoryReceivables();
  }

  displayProject(project: IProject) {
    return project && project.displayProjectName
      ? project.displayProjectName
      : 'All';
  }

  searchVendorCode(event: any) {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.vendorName = query;
      this.fetchVendors();
    }
  }
  fetchVendors() {
    this.vendorService
      .getVendorCodesWithOutPage('', this.vendorName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vendorName) => {
          this.vendors = vendorName;
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  onVendorCodeSelect(event: any) {
    this.paginator.firstPage();
    console.log(event.option.value.id);
    this.vendorId = event.option.value.id ? event.option.value.id : '';
    this.selectedVendor = event.option.value;

    if (this.vendorId === '') {
      this.categoryId = '';
      this.irId = '';

      this.subCategoryId = '';
      this.specificationId = '';
      this.inventoryUnitId = '';
      this.storeId = '';
    }

    this.getAllInventoryReceivables();
  }
  displayVendorCode(vendor: Vendor) {
    return vendor && vendor.vendorName ? vendor.vendorName : 'All';
  }

  getItemCategories() {
    this.itemCategoryService
      .getItemCategory(this.categoryName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.itemCategories = response;
          this.categoryPerIndex = {};
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  onWorkTypeChange(event: any) {
    event.value == 'All'
      ? (this.workTypeId = 0)
      : (this.workTypeId = event.value);
    this.getAllItemCategories();
    this.getAllInventoryReceivables();
  }

  searchCategory(event: any) {
    this.paginator.firstPage();

    const query = event.target.value;
    console.log(query);
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.itemSubCategorySerachText = query;
      this.getAllItemCategories();
    }
    if (query.length === searchTextZero) {
      this.itemCategoryId = 0;
      this.getAllItemCategories();
    }
  }

  onCategorySelectionChange(event: any) {
    this.paginator.firstPage();
    this.categoryId = event.option.value.categoryId
      ? event.option.value.categoryId
      : '';
    this.selectedCategory = event.option.value;
    if (this.categoryId === '') {
      this.irId = '';

      this.subCategoryId = '';
      this.specificationId = '';
      this.inventoryUnitId = '';
      this.storeId = '';
    }

    this.getItemSubCategory();
    this.getAllInventoryReceivables();
  }

  getAllItemCategories() {
    this.itemCategoryService
      .fetchItemCategories(this.itemSubCategorySerachText, this.workTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.itemCat = response;
          console.log(response);
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  getItemSubCategory() {
    this.itemSubCategoryService
      .fetchItemSubCategory(this.itemCategoryId, this.itemsubcategoryName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (itemSubCategoryData) => {
          this.itemSubCategoryData = itemSubCategoryData;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  getWorkTypes() {
    this.commanService.fetchCommonReferenceTypes(WORK_TYPE).subscribe({
      next: (data) => {
        this.options = data;
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  onSearchItemSubCategory(itemSubCategory: any) {
    this.paginator.firstPage();

    const query = itemSubCategory.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.itemsubcategoryName = query;
      this.getItemSubCategory();
    }
  }
  // getItemUnit() {
  //   this.itemUnitService
  //     .getAllItemUnit(
  //       this.itemUnitName,
  //       this.itemCategoryId,
  //       this.itemSubCategoryId,
  //       0,
  //       '',
  //       this.pageIndex,
  //       this.pageSize
  //     )
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe({
  //       next: (itemUnitData) => {
  //         this.itemUnitData = itemUnitData.records;
  //         this.totalItems = itemUnitData.totalRecords;
  //       },
  //       error: (error) => {
  //         console.error(error);
  //       },
  //     });
  // }

  onSubCategorySelectionChange(event: any) {
    this.paginator.firstPage();
    this.subCategoryId = event.option.value.subCategoryId
      ? event.option.value.subCategoryId
      : '';
    this.selectedSubCategory = event.option.value;
    if (this.subCategoryId === '') {
      this.irId = '';

      this.specificationId = '';
      this.inventoryUnitId = '';
      this.storeId = '';
    }

    this.getAllInventoryReceivables();
    if (this.subCategoryId) {
      this.getItemSpecification();
      this.specification.patchValue({} as ItemSpecification);
    }
    this.specification.patchValue({} as ItemSpecification);
    this.specificationId = 0;
    this.itemSpecifications = [];
  }
  getItemSpecification() {
    this.itemSpecificationService
      .getAllItemSpecificationByItemCategoryId(
        this.subCategoryId,
        this.specificationName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (itemSpecifications: ItemSpecification[]) => {
          this.itemSpecifications = itemSpecifications;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  displayFn(input: any) {
    return input && input.name ? input.name : 'All';
  }
  displayUnitFn(input: any) {
    return input && input.inventoryUnitName ? input.inventoryUnitName : 'All';
  }
  displayStoreFn(input: any) {
    return input && input.storeName ? input.storeName : 'All';
  }
  onSearchItemSpecification(itemSpec: any) {
    this.paginator.firstPage();
    console.log(itemSpec.target.value);
    const query = itemSpec.target.value;
    if (query.length === searchTextZero || query.length > searchTextLength) {
      this.specificationName = query;
      this.getItemSpecification();
    }
  }
  onSpecificationSelectionChange(event: any) {
    this.paginator.firstPage();

    this.specificationId = event.option.value.specificationId
      ? event.option.value.specificationId
      : '';
    this.selectedSpecification = event.option.value;
    if (this.specificationId === '') {
      this.irId = '';

      this.inventoryUnitId = '';
      this.storeId = '';
    }

    this.fetchItemUnitBySpecificationId();
    this.getAllInventoryReceivables();
  }

  fetchItemUnitBySpecificationId() {
    this.itemUnitService
      .getAllItemUnitBySpecificationId('', 0, 0, this.specificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (itemUnitData) => {
          this.itemUnitData = itemUnitData;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  onSearch(itemUnit: any) {
    console.log(itemUnit.target.value);
    const query = itemUnit.target.value;
    this.itemUnitName = query;
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
  }

  onSearchItemUnit(event: any) {
    this.paginator.firstPage();
    console.log(event.target.value);
    const query = event.target.value;

    if (query.length === searchTextZero || query.length > searchTextLength) {
      this.storeName = query;
      this.fetchItemUnit();
    }
    if (query.length === searchTextZero) {
      this.storeId = 0;
      this.fetchItemUnit();
    }
  }
  onItemUnitChange(event: any) {
    this.paginator.firstPage();

    this.unitId = event.option.value.unitId ? event.option.value.unitId : '';
    this.selectedItemUnit = event.option.value;
    if (this.unitId === '') {
      this.irId = '';

      this.storeId = '';
    }

    this.getAllInventoryReceivables();
  }

  fetchItemUnit() {
    this.itemUnitService
      .getAllItemUnitWithOutPage(
        this.itemUnitName,
        this.itemCategoryId,
        this.itemSubCategoryId,
        0
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (itemUnitData) => {
          this.itemUnitData = itemUnitData;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  onSearchStore(event: any) {
    console.log(event.target.value);
    const query = event.target.value;
    if (query.length === searchTextZero || query.length > searchTextLength) {
      this.storeName = query;
      this.fetchStore();
    }
    if (query.length === searchTextZero) {
      this.storeId = 0;
      this.fetchStore();
    }
  }

  onStoreChange(event: any) {
    this.paginator.firstPage();

    this.storeId = event.option.value.storeId ? event.option.value.storeId : '';
    this.selectedStore = event.option.value;

    if (this.unitId === '') {
      this.irId = '';
      this.projectId = '';
    }

    this.getAllInventoryReceivables();
  }
  fetchStore() {
    this.storeService
      .getAllStoreWithOutPage(this.storeName, this.user.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (storeData) => {
          this.storeData = storeData;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  searchPurchaseOrder(event: any): void {
    const query = event.target.value;
    this.code = query;
    this.getAllPurchaseOrder();
  }
  getAllPurchaseOrder() {
    this.purchaseOrderService
      .fetchAllPurchaseOrders(this.code, this.organizationId, this.user.userId)
      .subscribe({
        next: (purchaseOrder) => {
          console.log(purchaseOrder);
          this.purchaseOrder = purchaseOrder;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  displayPurchaseOrder(purchaseOrder: PurchaseOrder): string {
    return purchaseOrder && purchaseOrder.poCode ? purchaseOrder.poCode : 'All';
  }

  onPurchaseOrderSelect(event: any): void {
    console.log(event.option.value);
    this.poId = event.option.value.id ? event.option.value.id : '';
    this.selectedPo = event.option.value;

    if (this.poId === '') {
      this.vendorId = '';
      this.categoryId = '';
      this.irId = '';

      this.poId = '';
      this.subCategoryId = '';
      this.specificationId = '';
      this.inventoryUnitId = '';
      this.storeId = '';
    }

    this.getAllInventoryReceivables();
  }

  onDateChange() {
    this.pageIndex = 0;
    this.paginator.firstPage();
    const startDate = this.formData.get('customStartDate')?.value;
    const endDate = this.formData.get('customEndDate')?.value;
    if (startDate !== null && endDate !== null) {
      this.dateRange = '';
      this.getAllInventoryReceivables();
    } else {
      this.dateRange = 0;
    }
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      customStartDate: [],
      customEndDate: [],
    });
    this.formData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((formDataValue) => {
        if (formDataValue.customStartDate && formDataValue.customEndDate) {
          const startDate = this.formatDateTime(formDataValue.customStartDate);
          const endDate = this.formatDateTime(
            formDataValue.customEndDate,
            true
          );
          this.customStartDate = startDate;
          this.customEndDate = endDate;
          this.getAllInventoryReceivables();
        }
      });
  }

  formatDateTime(date: Date, isEndDate: boolean = false): string {
    if (isEndDate) {
      date.setHours(23, 59, 59, 999);
    }
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }

  clearDateRange(): void {
    this.formData.get('customStartDate')?.setValue('');
    this.formData.get('customEndDate')?.setValue('');
    this.customStartDate = '';
    this.customEndDate = '';
    this.getAllInventoryReceivables();
  }

  resetForm() {
    this.selectedProject = new Project();
    this.selectedProject.projectName = 'All';
    this.projectId = 0;

    const purchaseOrder = new PurchaseOrder();
    this.selectedPo = new PurchaseOrder();
    this.poId = 0;
    purchaseOrder.poCode = 'All';
    this.purchaseOrderFc.reset(purchaseOrder);

    const vendor = new Vendor();
    this.vendorId = 0;
    this.vendor.reset(vendor);
    vendor.vendorName = 'All';
    this.workTypeId = 0;

    const itemCategory = new ItemCategory();
    this.categoryId = 0;
    this.category.reset(itemCategory);
    itemCategory.name = 'All';

    const itemSubCategory = new ItemSubCategory();
    this.subCategoryId = 0;
    this.subCategory.reset(itemSubCategory);
    itemSubCategory.name = 'All';
    this.getAllInventoryReceivables();

    const specification = new ItemSpecification();
    this.specificationId = 0;
    this.specification.reset(specification);
    itemSubCategory.name = 'All';

    const itemUnit = new ItemUnit();
    this.inventoryUnitId = 0;
    this.unitFc.reset(itemUnit);
    itemUnit.name = 'All';

    const store = new Store();
    this.storeId = 0;
    this.storeFc.reset(store);
    store.storeName = 'All';

    this.pageSize = 15;
    this.pageIndex = 0;
    this.getAllInventoryReceivables();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'RECEIVED':
        return 'closed';
      case 'APPROVED':
        return 'closed';
      case 'PARTIALLY RECEIVED':
        return 'partially-received';
      case 'QUANTITY EXCEEDED':
        return 'short-closed';
      case 'SHORT CLOSED':
        return 'short-closed';
      case 'PENDING':
        return 'closed';
      case 'NOT APPLICABLE':
        return 'not-applicable';
      default:
        return 'OLD';
    }
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
