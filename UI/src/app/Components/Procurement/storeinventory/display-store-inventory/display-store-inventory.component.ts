import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  WORK_TYPE,
} from 'src/app/Constants/CommanConstants/Comman';
import { ItemCategory } from 'src/app/Models/Procurement/ItemCategory';
import { ItemSpecification } from 'src/app/Models/Procurement/itemspecification';
import { ItemSubCategory } from 'src/app/Models/Procurement/itemsubcategory';
import { ItemUnit, ItemUnitDto } from 'src/app/Models/Procurement/itemunit';
import {
  IPurcahseOrder,
  PurchaseOrder,
} from 'src/app/Models/Procurement/purchaseorder';
import { Store } from 'src/app/Models/Procurement/store';
import { IStoreInventoryDto } from 'src/app/Models/Procurement/storeinventory';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ItemCategoryService } from 'src/app/Services/ProcurementService/item-category.service';
import { ItemSpecificationService } from 'src/app/Services/ProcurementService/ItemSpecification/item-specification.service';
import { ItemSubCategoryService } from 'src/app/Services/ProcurementService/ItemSubCategory/item-sub-category.service';
import { ItemUnitService } from 'src/app/Services/ProcurementService/ItemUnit/item-unit.service';
import { PurchaseOrderService } from 'src/app/Services/ProcurementService/PurchaseOrder/purchaseorder.service';
import { StoreService } from 'src/app/Services/ProcurementService/Store/store.service';
import { StoreInventoryService } from 'src/app/Services/ProcurementService/StoreInventory/store-inventory.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';

@Component({
  selector: 'display-store-inventory',
  templateUrl: './display-store-inventory.component.html',
  styleUrls: ['./display-store-inventory.component.css'],
})
export class DisplayStoreInventoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  private destroy$ = new Subject<void>();
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  totalItems: number = 0;
  selectedProject: IProject = new Project();
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  projectId: any = 0;
  project: Project[] = [];
  public user: User = new User();
  itemCat: any[] = [];
  itemCategoryFc: FormControl = new FormControl([] as ItemCategory[]);
  category: any = new FormControl([] as ItemCategory[]);
  storeId: any = 0;
  organizationId = 0;
  subCategoryId: any;
  projectFc: FormControl = new FormControl([] as Project[]);
  itemCategorySerachText: string = '';
  projectName: string = '';
  categoryId: any;
  storeName: string = '';
  specificationId: any;
  specificationName: string = '';
  itemsubcategoryName: string = '';
  itemCategoryId: number = 0;
  workTypeId: number = 0;
  storeInventoryData: IStoreInventoryDto[] = [];
  options: CommonReferenceDetails[] = [];
  itemSubCategoryData: ItemSubCategory[] = [];
  specification: FormControl<ItemSpecification | null> =
    new FormControl<ItemSpecification | null>(null);
  itemSpecifications: ItemSpecification[] = [];
  subCategory: FormControl<ItemSubCategory | null> =
    new FormControl<ItemSubCategory | null>(null);
  unitId: any;
  unitFc: FormControl = new FormControl([] as ItemUnit[]);
  storeFc: FormControl = new FormControl([] as Store[]);
  itemUnitName: string = '';
  storeData: Store[] = [];
  itemSubCategoryId: any;
  itemUnitData: ItemUnitDto[] = [];
  purchaseOrderFc: FormControl = new FormControl([] as PurchaseOrder[]);
  code: any;
  selectedPo: IPurcahseOrder = new PurchaseOrder();
  poId: any;
  purchaseOrder: PurchaseOrder[] = [];

  selectedCategory: ItemCategory = new ItemCategory();
  selectedSubCategory: ItemSubCategory = new ItemSubCategory();
  selectedSpecification: ItemSpecification = new ItemSpecification();
  selectedItemUnit: ItemUnit = new ItemUnit();
  selectedStore: Store = new Store();
  displayedColumns: string[] = [
    'rowNumber',
    'projectName',
    'categoryType',
    'materialCode',
    'categoryName',
    'itemSubCategoryName',
    'specificationName',
    'itemUnitName',
    'storeName',
    'storeStock',
    'execeedQuantity',
    'totalQuantity',
    'actions',
  ];

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
    }
    this.getAllStoreInventories();
    this.getProjects();
    this.getAllItemCategories();
    this.getAllPurchaseOrder();
    this.getWorkTypes();
    this.fetchStore();
    this.fetchItemUnit();
    this.patchFormData();
  }
  patchFormData() {
    this.selectedProject = history.state.displayPage.selectedProject;
    this.workTypeId = history.state.displayPage.selectedWorkTypeId;
    this.selectedCategory = history.state.displayPage.selectedCategory;
    this.selectedSubCategory = history.state.displayPage.selectedSubCategory;
    this.selectedSpecification =
      history.state.displayPage.selectedSpecification;
    this.selectedItemUnit = history.state.displayPage.selectedItemUnit;
    this.selectedStore = history.state.displayPage.selectedStore;
    history.state.displayPage.selectedSpecification;

    this.pageIndex = history.state.displaypage.pageIndex;
    this.patchFormValues();
  }
  patchFormValues() {
    if (this.selectedProject) {
      this.projectFc.patchValue(this.selectedProject);
      this.projectId = this.selectedProject.projectId;
    }
    if (this.selectedCategory) {
      this.category.patchValue(this.selectedCategory);
      this.categoryId = this.selectedCategory.categoryId;
    }
    if (this.selectedSubCategory) {
      this.subCategory.patchValue(this.selectedSubCategory);
      this.subCategoryId = this.selectedSubCategory.subCategoryId;
    }

    if (this.selectedSpecification) {
      this.specification.patchValue(this.selectedSpecification);
      this.specificationId = this.selectedSpecification.specificationId;
    }
    if (this.selectedItemUnit) {
      this.unitFc.patchValue(this.selectedItemUnit);
      this.unitId = this.selectedItemUnit.unitId;
    }

    if (this.selectedStore) {
      this.storeFc.patchValue(this.selectedStore);
      this.storeId = this.selectedStore.storeId;
    }

    this.getAllStoreInventories();
  }

  constructor(
    private storeInventoryService: StoreInventoryService,
    private router: Router,
    public dialog: MatDialog,
    private toastrService: ToastrService,
    private projectService: ProjectService,
    private itemCategoryService: ItemCategoryService,
    private commanService: CommanService,
    private itemSubCategoryService: ItemSubCategoryService,
    private itemSpecificationService: ItemSpecificationService,
    private storeService: StoreService,
    private itemUnitService: ItemUnitService,
    private purchaseOrderService: PurchaseOrderService
  ) {}

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getAllStoreInventories();
  }

  getAllStoreInventories() {
    this.storeInventoryService
      .getAllStoreInventories(
        this.projectId,
        this.poId,
        this.categoryId,
        this.subCategoryId,
        this.specificationId,
        this.unitId,
        this.workTypeId,
        this.storeId,
        this.pageIndex,
        this.pageSize,
        this.user.userId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (storeInventories) => {
          this.storeInventoryData = storeInventories.records;
          this.totalItems = storeInventories.totalRecords;
        },
        error: (error: Error) => {
          console.error('Error fetching store inventory:', error);
        },
      });
  }

  onSearch(storeName: string) {
    this.storeName = storeName;
    this.pageIndex = 0;
    this.paginator.firstPage();
    this.getAllStoreInventories();
  }

  openConfirmDialog(storeInventoryId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Store Inventory' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteStoreInventory(storeInventoryId);
        }
      }
    );
  }

  deleteStoreInventory(storeInventoryId: number) {
    this.storeInventoryService
      .deleteStoreInventory(storeInventoryId)
      .subscribe({
        next: (response: any) => {
          this.handleSuccessResponse(response);
        },
        error: (error: Error) => {
          console.error('Error deleting store inventory:', error);
        },
      });
  }

  editStoreInventory(storeInventory: any) {
    console.log(this.selectedCategory);

    this.router.navigate(['/layout/procurement/addstoreinventory'], {
      state: {
        storeInventory: storeInventory,
        isAdding: false,
        displayPage: {
          selectedProject: this.selectedProject,
          selectedCategory: this.selectedCategory,
          selectedWorkTypeId: this.workTypeId,
          selectedSubCategory: this.selectedSubCategory,
          selectedSpecification: this.selectedSpecification,
          selectedItemUnit: this.selectedItemUnit,
          selectedStore: this.selectedStore,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      },
    });
  }

  handleSuccessResponse(response: any): void {
    this.toastrService.success('', response.message);
    this.getAllStoreInventories(); // Refresh data after successful operation
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onStoreSearch(searchText: string) {
    this.storeName = searchText;
    this.pageIndex = 0;
    this.paginator.firstPage();
    this.getAllStoreInventories();
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
      this.poId = '';
      this.categoryId = '';

      this.subCategoryId = '';
      this.specificationId = '';
      this.unitId = '';
      this.storeId = '';
    }

    this.getAllStoreInventories();
  }

  displayProject(project: IProject) {
    return project && project.displayProjectName
      ? project.displayProjectName
      : 'All';
  }

  onWorkTypeChange(event: any) {
    event.value == 'All'
      ? (this.workTypeId = 0)
      : (this.workTypeId = event.value);
    this.getAllItemCategories();
    this.getAllStoreInventories();
  }
  searchCategory(event: any) {
    this.paginator.firstPage();

    const query = event.target.value;
    console.log(query);
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.itemCategorySerachText = query;
      this.getAllItemCategories();
    }
    if (query.length === searchTextZero) {
      this.itemCategoryId = 0;
      this.getAllItemCategories();
    }
  }

  onCategorySelectionChange(event: any) {
    console.log(event.option.value);

    this.paginator.firstPage();
    this.categoryId = event.option.value.categoryId
      ? event.option.value.categoryId
      : '';
    this.selectedCategory = event.option.value;

    if (this.categoryId === '') {
      this.subCategoryId = '';
      this.specificationId = '';
      this.unitId = '';
      this.storeId = '';
    }

    this.getItemSubCategory();
    this.getAllStoreInventories();
  }

  getAllItemCategories() {
    this.itemCategoryService
      .fetchItemCategories(this.itemCategorySerachText, this.workTypeId)
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

  onSearchItemSubCategory(itemSubCategory: any) {
    this.paginator.firstPage();

    const query = itemSubCategory.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.itemsubcategoryName = query;
      this.getItemSubCategory();
    }
  }
  onSubCategorySelectionChange(event: any) {
    this.paginator.firstPage();
    this.subCategoryId = event.option.value.subCategoryId
      ? event.option.value.subCategoryId
      : '';
    this.selectedSubCategory = event.option.value;
    if (this.subCategoryId === '') {
      this.specificationId = '';
      this.unitId = '';
      this.storeId = '';
    }

    this.getAllStoreInventories();
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
      this.unitId = '';
      this.storeId = '';
    }
    this.fetchItemUnitBySpecificationId();
    this.getAllStoreInventories();
  }

  onSearchStore(event: any) {
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
      this.storeId = '';
    }
    this.getAllStoreInventories();
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
  onSearchItemUnit(event: any) {
    this.paginator.firstPage();
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
      this.projectId = '';
      this.storeId = '';
    }
    this.getAllStoreInventories();
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
    this.poId = event.option.value.id ? event.option.value.id : '';
    if (this.poId === '') {
      this.poId = '';
      this.categoryId = '';
      this.subCategoryId = '';
      this.specificationId = '';
      this.unitId = '';
      this.storeId = '';
    }
    this.getAllStoreInventories();
  }

  resetForm() {
    const project = new Project();
    project.projectId = 0;
    project.displayProjectName = 'All';
    this.projectFc.reset(project);
    this.projectId = 0;

    const itemCat = new ItemCategory();
    itemCat.categoryId = 0;
    itemCat.name = 'All';
    this.category.reset(itemCat);
    this.categoryId = 0;

    const itemSubCat = new ItemSubCategory();
    itemSubCat.subCategoryId = 0;
    itemSubCat.name = 'All';
    this.subCategory.reset(itemSubCat);
    this.subCategoryId = 0;

    const itemSpec = new ItemSpecification();
    itemSpec.specificationId = 0;
    itemSpec.name = 'All';
    this.specification.reset(itemSpec);
    this.specificationId = 0;

    const itemUnit = new ItemUnit();
    itemUnit.unitId = 0;
    itemUnit.name = 'All';
    this.unitFc.reset(itemUnit);
    this.unitId = 0;

    const store = new Store();
    store.storeId = 0;
    store.storeName = 'All';
    this.storeFc.reset(store);
    this.storeId = 0;

    this.workTypeId = 0;
    this.specificationName = '';

    this.getAllStoreInventories();
  }

  addStoreInventory() {
    this.router.navigate(['/layout/procurement/addstoreinventory'], {
      state: {
        isAdding: true,
        displayPage: {
          selectedProject: this.selectedProject,
          selectedCategory: this.selectedCategory,
          selectedWorkTypeId: this.workTypeId,
          selectedSubCategory: this.selectedSubCategory,
          selectedSpecification: this.selectedSpecification,
          selectedItemUnit: this.selectedItemUnit,
          selectedStore: this.selectedStore,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      },
    });
  }
}
