import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Form, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, takeUntil, tap } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TOTAL_ITEMS,
  WORK_TYPE,
} from 'src/app/Constants/CommanConstants/Comman';
import { ItemCategory } from 'src/app/Models/Procurement/ItemCategory';
import { ItemSpecification } from 'src/app/Models/Procurement/itemspecification';
import { ItemSubCategory } from 'src/app/Models/Procurement/itemsubcategory';
import { ItemUnit } from 'src/app/Models/Procurement/itemunit';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ItemCategoryService } from 'src/app/Services/ProcurementService/item-category.service';
import { ItemSpecificationService } from 'src/app/Services/ProcurementService/ItemSpecification/item-specification.service';
import { ItemSubCategoryService } from 'src/app/Services/ProcurementService/ItemSubCategory/item-sub-category.service';
import { ItemUnitService } from 'src/app/Services/ProcurementService/ItemUnit/item-unit.service';

@Component({
  selector: 'app-displayitem-unit',
  templateUrl: './display-item-unit.component.html',
  styleUrls: ['./display-item-unit.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DisplayitemUnitComponent implements OnInit {
  private destroy$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  options: CommonReferenceDetails[] = [];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  workTypeId: number = 0;

  //category fields
  categoryName: string = '';
  itemCategories: ItemCategory[] = [];
  itemCategoryId: number = 0;
  category: FormControl<ItemCategory | null> =
    new FormControl<ItemCategory | null>(null);

  //sub category fields
  itemsubcategoryName: string = '';
  itemSubCategoryData: ItemSubCategory[] = [];
  itemSubCategoryId: number = 0;
  subCategory: FormControl<ItemSubCategory | null> =
    new FormControl<ItemSubCategory | null>(null);

  //spec fields
  itemSpecifications: ItemSpecification[] = [];
  specification: FormControl<ItemSpecification | null> =
    new FormControl<ItemSpecification | null>(null);
  specificationId: number = 0;
  specificationName: string = '';

  //item unit fields
  itemUnitData: ItemUnit[] = [];
  materialCode: string = '';

  selectedCategory: ItemCategory = new ItemCategory();
  selectedSubCategory: ItemSubCategory = new ItemSubCategory();
  selectedSpecification: ItemSpecification = new ItemSpecification();

  displayedColumns: string[] = [
    'rowNumber',
    'workTypeName',
    'materialCode',
    'subCategory',
    'category',
    'itemSpecificationName',
    'itemUnitName',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    this.getDataFromState();
    this.getWorkTypes();
    this.getItemCategories();
    this.getItemUnit();
    this.itemUnitService.refreshRequired.subscribe(() => {
      this.getItemUnit();
    });
  }

  constructor(
    private itemUnitService: ItemUnitService,
    private router: Router,
    public dialog: MatDialog,
    private itemCategoryService: ItemCategoryService,
    private itemSubCategoryService: ItemSubCategoryService,
    private commanService: CommanService,
    private itemSpecificationService: ItemSpecificationService,
    private route: ActivatedRoute
  ) {}

  getDataFromState() {
    const { statePageSize, statePageIndex, displayPageData } = history.state;
    this.pageSize = statePageSize ?? this.pageSize;
    this.pageIndex = statePageIndex ?? this.pageIndex;
    if (displayPageData) {
      const displayStatePageData = displayPageData;
      this.workTypeId = displayStatePageData.selectedCategoryType;
      this.selectedCategory = displayStatePageData.selectedCategory;
      this.selectedSubCategory = displayStatePageData.selectedSubCategory;
      this.selectedSpecification = displayStatePageData.selectedSpecification;
      this.materialCode = displayPageData.materialCode;
      this.patchFormValues();
    }
  }

  // Patch values into form controls
  patchFormValues() {
    if (this.selectedCategory) {
      this.category.patchValue(this.selectedCategory);
      this.itemCategoryId = this.selectedCategory.categoryId;
    }
    if (this.selectedSubCategory) {
      this.subCategory.patchValue(this.selectedSubCategory);
      this.itemSubCategoryId = this.selectedSubCategory.subCategoryId;
    }
    if (this.selectedSpecification) {
      this.specification.patchValue(this.selectedSpecification);
      this.specificationId = this.selectedSpecification.specificationId;
    }
  }

  addItemUnit() {
    this.router.navigate(['./itemunit'], {
      relativeTo: this.route.parent,
      state: {
        isAdding: true,
        statePageSize: this.pageSize,
        statePageIndex: this.pageIndex,
        displayPage: {
          selectedCategoryType: this.workTypeId,
          selectedCategory: this.selectedCategory,
          selectedSubCategory: this.selectedSubCategory,
          selectedSpecification: this.selectedSpecification,
          materialCode: this.materialCode,
        },
      },
    });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getItemUnit();
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
    this.getItemUnit();
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
    this.selectedCategory = event.option.value;
    if (this.itemCategoryId) {
      this.getItemSubCategory();
      this.subCategory.patchValue({} as ItemSubCategory);
    }
    this.subCategory.patchValue({} as ItemSubCategory);
    this.itemSubCategoryId = 0;
    this.itemSubCategoryData = [];
    this.getItemUnit();
  }

  getItemSubCategory() {
    this.itemSubCategoryService
      .fetchItemSubCategory(this.itemCategoryId, this.itemsubcategoryName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (itemSubCategoryData) => {
          this.itemSubCategoryData = itemSubCategoryData;
          console.log(itemSubCategoryData);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  onSubCategorySelectionChange(event: any) {
    this.itemSubCategoryId = event.option.value.subCategoryId;
    this.selectedSubCategory = event.option.value;
    if (this.itemSubCategoryId) {
      this.getItemSpecification();
      this.specification.patchValue({} as ItemSpecification);
    }
    this.specification.patchValue({} as ItemSpecification);
    this.specificationId = 0;
    this.itemSpecifications = [];
    this.getItemUnit();
  }

  onSpecificationSelectionChange(event: any) {
    this.specificationId = event.option.value.specificationId;
    this.selectedSpecification = event.option.value;
    this.getItemUnit();
  }

  getItemSpecification() {
    this.itemSpecificationService
      .getAllItemSpecificationByItemCategoryId(
        this.itemSubCategoryId,
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

  onSearchItemCategories(itemCategory: any) {
    const query = itemCategory.target.value;
    console.log(query);
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.categoryName = query;
      this.getItemCategories();
    }
    if (query.length === searchTextZero) {
      this.itemCategoryId = 0;
      this.getItemUnit();
    }
  }
  onSearchItemSubCategory(itemSubCategory: any) {
    const query = itemSubCategory.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.itemsubcategoryName = query;
      this.getItemSubCategory();
    }
    if (query.length === searchTextZero) {
      this.itemSubCategoryId = 0;
      this.getItemUnit();
    }
  }
  onSearchItemSpecification(itemSpec: any) {
    console.log(itemSpec.target.value);
    const query = itemSpec.target.value;
    if (query.length === searchTextZero || query.length > searchTextLength) {
      this.specificationName = query;
      this.getItemSpecification();
    }
    if (query.length === searchTextZero) {
      this.specificationId = 0;
      this.getItemUnit();
    }
  }

  onSearch(itemUnit: any) {
    console.log(itemUnit.target.value);
    const query = itemUnit.target.value;
    this.materialCode = query;
    this.pageIndex = PAGE_INDEX;
    this.paginator.firstPage();
    this.getItemUnit();
  }

  getItemUnit() {
    this.itemUnitService
      .getAllItemUnit(
        this.materialCode,
        this.itemCategoryId,
        this.itemSubCategoryId,
        this.specificationId,
        0,
        this.pageIndex,
        this.pageSize,
        this.workTypeId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (itemUnitData) => {
          this.itemUnitData = itemUnitData.records;
          if (this.paginator) {
            this.paginator.pageIndex = this.pageIndex;
            this.paginator.pageSize = this.pageSize;
          }
          this.totalItems = itemUnitData.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ///opening confirm dialog
  openConfirmDialog(itemUnitId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Item Unit' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteItemUnit(itemUnitId);
        }
      }
    );
  }

  //delete item-unit by item-unit id
  deleteItemUnit(itemUnitId: number) {
    this.itemUnitService
      .deleteItemUnit(itemUnitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (itemUnitData) => {
          console.log(itemUnitData);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  editItemUnit(itemUnitData: any) {
    this.itemUnitService
      .getItemUnitByUnitId(itemUnitData.unitId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.router.navigate(['./itemunit'], {
            relativeTo: this.route.parent,
            state: {
              itemUnitData: data,
              isAdding: false,
              statePageSize: this.pageSize,
              statePageIndex: this.pageIndex,
              displayPage: {
                selectedCategoryType: this.workTypeId,
                selectedCategory: this.selectedCategory,
                selectedSubCategory: this.selectedSubCategory,
                selectedSpecification: this.selectedSpecification,
                materialCode: this.materialCode,
              },
            },
          });
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  resetForm() {
    const itemCat = new ItemCategory();
    itemCat.categoryId = 0;
    itemCat.name = 'All';
    this.category.reset(itemCat);
    this.itemCategoryId = 0;

    const itemSubCat = new ItemSubCategory();
    itemSubCat.subCategoryId = 0;
    itemSubCat.name = 'All';
    this.subCategory.reset(itemSubCat);
    this.itemSubCategoryId = 0;

    const itemSpec = new ItemSpecification();
    itemSpec.specificationId = 0;
    itemSpec.name = 'All';
    this.specification.reset(itemSpec);
    this.specificationId = 0;

    this.workTypeId = 0;
    this.materialCode = '';
    this.selectedCategory = new ItemCategory();
    this.selectedSubCategory = new ItemSubCategory();
    this.selectedSpecification = new ItemSpecification();

    this.getItemUnit();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
