import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, map, startWith, takeUntil } from 'rxjs';
import {
  COMMON_STATUS,
  INVENTORY_UNIT,
  searchTextLength,
  searchTextZero,
  WORK_TYPE,
} from 'src/app/Constants/CommanConstants/Comman';
import { ItemCategory } from 'src/app/Models/Procurement/ItemCategory';
import { ItemSpecification } from 'src/app/Models/Procurement/itemspecification';
import { ItemSubCategory } from 'src/app/Models/Procurement/itemsubcategory';
import { IItemUnit, ItemUnit } from 'src/app/Models/Procurement/itemunit';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { CommomReferenceDetailsService } from 'src/app/Services/Presales/CommonRefernceDetails/commomreferencedetails.service';
import { ItemCategoryService } from 'src/app/Services/ProcurementService/item-category.service';
import { ItemSpecificationService } from 'src/app/Services/ProcurementService/ItemSpecification/item-specification.service';
import { ItemSubCategoryService } from 'src/app/Services/ProcurementService/ItemSubCategory/item-sub-category.service';
import { ItemUnitService } from 'src/app/Services/ProcurementService/ItemUnit/item-unit.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-item-unit',
  templateUrl: './add-item-unit.component.html',

  styleUrls: ['./add-item-unit.component.css'],
})
export class AddItemUnitComponent implements OnInit {
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  unitId: number = 0;
  statuses: any = [];
  formData!: FormGroup;
  options: CommonReferenceDetails[] = [];
  inventoryUnits: CommonReferenceDetails[] = [];
  workTypeId: number = 0;
  categoryName: string = '';
  itemCategories: any = [];
  itemsubcategoryName: string = '';
  itemCategoryId: number = 0;
  itemSubCategoryData: any = [];
  itemSubCategoryId: number = 0;
  category: any = new FormControl([] as ItemCategory[]);
  subCategory: any = new FormControl([] as ItemSubCategory[]);
  itemUnit: IItemUnit = new ItemUnit();
  inventoryUnit: any = new FormControl([] as ItemSubCategory[]);
  inventoryUnitId: number = 0;
  inventoryUnitName: string = '';

  itemSpecifications: any = [];
  specification: any = new FormControl([] as ItemSpecification[]);
  specificationId: number = 0;
  specificationName: string = '';
  displayPageData: any;
  statePageSize: number = 0;
  statePageIndex: number = 0;

  constructor(
    private router: Router,
    private itemUnitService: ItemUnitService,
    private builder: FormBuilder,
    private commanService: CommanService,
    private itemCategoryService: ItemCategoryService,
    private itemSubCategoryService: ItemSubCategoryService,
    private route: ActivatedRoute,
    private itemSpecificationService: ItemSpecificationService,
    private comRefDetailsService: CommomReferenceDetailsService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getDataFromState();
    this.getInventoryUnits();
    this.getWorkTypes();
    this.getCommonStatuses();
  }

  initializeForm() {
    this.formData = this.builder.group({
      unitId: [0],
      workTypeId: [0],
      inventoryUnitId: ['', Validators.required],
      categoryId: ['', Validators.required],
      subCategoryId: ['', Validators.required],
      specificationId: ['', Validators.required],
      status: [''],
    });
  }

  getDataFromState() {
    const {
      itemUnitData,
      isAdding,
      displayPage,
      statePageSize,
      statePageIndex,
    } = history.state;
    this.isAdding = isAdding;
    console.log(this.isAdding);
    itemUnitData && (this.itemUnit = itemUnitData);
    !isAdding && this.patchFormDataWithMeterialCode();
    this.statePageSize = statePageSize;
    this.statePageIndex = statePageIndex;
    if (displayPage) {
      this.displayPageData = displayPage;
    }
  }

  patchFormDataWithMeterialCode() {
    console.log(this.itemUnit);
    this.itemSubCategoryId = this.itemUnit.subCategoryId;
    if (this.itemUnit.categoryId) {
      this.fetchCategoryById(this.itemUnit.categoryId);
    }
    if (this.itemUnit.subCategoryId) {
      this.fetchSubCategoryById(this.itemUnit.subCategoryId);
    }
    if (this.itemUnit.specificationId) {
      this.fetchSpecificationById(this.itemUnit.specificationId);
    }
    if (this.itemUnit.inventoryUnitId) {
      console.log('inventory');
      this.fetchInventoryUnitById(this.itemUnit.inventoryUnitId);
    }
    this.getItemCategories();
    this.getItemSubCategory();
    this.getItemSpecification();
    this.formData.patchValue(this.itemUnit);
  }

  fetchCategoryById(categoryId: number) {
    this.itemCategoryService
      .getCategoryById(categoryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.category.patchValue(resp);
          console.log(resp);
          this.workTypeId = resp.workTypeId;
          this.formData.get('workTypeId')?.patchValue(resp.workTypeId);
        },
        error: (err: any) => console.error('Error fetching ItemCategory', err),
      });
  }

  fetchSubCategoryById(subCategoryId: number) {
    this.itemSubCategoryService
      .getSubCategoryById(subCategoryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.subCategory.patchValue(resp);
        },
        error: (err: any) =>
          console.error('Error fetching ItemSubCategory', err),
      });
  }

  fetchSpecificationById(specificationId: number) {
    this.itemSpecificationService
      .getSpecificationById(specificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.specification.patchValue(response);
        },
        error: (error: Error) => {},
      });
  }
  fetchInventoryUnitById(inventoryUnitId: number) {
    this.comRefDetailsService
      .getById(inventoryUnitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.inventoryUnit.patchValue(response);
        },
        error: (error: Error) => {},
      });
  }

  getInventoryUnits() {
    this.commanService.fetchCommonReferenceTypes(INVENTORY_UNIT).subscribe({
      next: (data) => {
        this.inventoryUnits = data;
        console.log(data);
      },
      error: (error) => {
        console.error(error?.message);
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

  onWorkTypeChange(event: any) {
    event.value == 'All'
      ? (this.workTypeId = 0)
      : (this.workTypeId = event.value);
    this.getItemCategories();
  }

  getItemCategories() {
    this.itemCategoryService
      .fetchItemCategories(this.categoryName, this.workTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.itemCategories = data;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  onCategorySelectionChange(event: any) {
    this.itemCategoryId = event.option.value.categoryId;
    if (this.itemCategoryId) {
      this.getItemSubCategory();
      this.formData
        .get('categoryId')
        ?.patchValue(this.itemCategoryId ? this.itemCategoryId : '');
    }
    this.formData.get('subCategoryId')?.patchValue('');
    this.formData.get('specificationId')?.patchValue('');
    this.subCategory.patchValue({} as ItemSubCategory);
    this.itemSubCategoryData = [];
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
  onSubCategorySelectionChange(event: any) {
    this.itemSubCategoryId = event.option.value.subCategoryId;
    if (this.itemSubCategoryId) {
      this.getItemSpecification();
      this.formData
        .get('subCategoryId')
        ?.patchValue(this.itemSubCategoryId ? this.itemSubCategoryId : '');
    }
  }

  getItemSpecification() {
    this.itemSpecificationService
      .getAllItemSpecificationByItemCategoryId(
        this.itemSubCategoryId,
        this.specificationName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (itemSpecifications) => {
          this.itemSpecifications = itemSpecifications;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
  onSpecificationSelectionChange(event: any) {
    this.specificationId = event.option.value.specificationId;
    if (this.specificationId) {
      this.formData
        .get('specificationId')
        ?.patchValue(this.specificationId ? this.specificationId : '');
    }
  }

  onInventoryUnitSelectionChange(event: any) {
    this.inventoryUnitId = event.option.value.id;
    if (this.inventoryUnitId) {
      this.formData
        .get('inventoryUnitId')
        ?.patchValue(this.inventoryUnitId ? this.inventoryUnitId : '');
    }
  }

  onSearchItemCategories(event: any) {
    const query = event.target.value;
    console.log(query);
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.categoryName = query;
      this.getItemCategories();
    }
  }

  onSearchItemSubCategory(event: any) {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.itemsubcategoryName = query;
      this.getItemSubCategory();
    }
  }

  onSearchItemSpecification(event: any) {
    const query = event.target.value;
    if (query.length === searchTextZero || query.length > searchTextLength) {
      this.specificationName = query;
      this.getItemSpecification();
    }
  }
  onSearchInventoryUnit(event: any) {
    const query = event.target.value;
    if (query.length === searchTextZero || query.length > searchTextLength) {
      this.inventoryUnitName = query;
      this.getInventoryUnits();
    }
  }

  save() {
    if (this.formData.valid && this.formData.touched) {
      const formDataValue = this.formData.value;
      const saveOrUpdateObservable = this.isAdding
        ? this.itemUnitService.addItemUnit(formDataValue)
        : this.itemUnitService.updateItemUnit(formDataValue);

      saveOrUpdateObservable.pipe(takeUntil(this.destroy$)).subscribe({
        next: (resp) => {
          const navigateExtras = {
            relativeTo: this.route.parent,
          };
          this.handleSuccessResponse(resp);
          this.router.navigate(['./item/unit'], navigateExtras);
        },
        error: (err) => {
          this.handleErrorResponse(err);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  displayFn(input: any) {
    return input && input.name ? input.name : 'Select';
  }

  displayUnit(input: any) {
    return input && input.commonRefValue ? input.commonRefValue : 'Select';
  }

  getCommonStatuses() {
    this.commanService.fetchCommonReferenceTypes(COMMON_STATUS).subscribe({
      next: (data) => {
        this.statuses = data;
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  private handleSuccessResponse(response: any): void {
    Swal.fire({
      title: 'Success',
      text: response.message,
      icon: 'success',
      timer: 5000,
      timerProgressBar: true,
      showConfirmButton: false,
      allowOutsideClick: true,
    }).then(() => {
      this.gotoItemUnits();
    });
  }

  private handleErrorResponse(error: any): void {
    Swal.fire({
      title: 'Error',
      text: error.error.message,
      icon: 'error',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
    }).then((result) => {});
  }

  clearForm() {
    this.formData.reset();
  }

  gotoItemUnits() {
    this.router.navigate(['./item/unit'], {
      relativeTo: this.route.parent,
      state: {
        statePageSize: this.statePageSize,
        statePageIndex: this.statePageIndex,
        displayPageData: this.displayPageData,
      },
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
