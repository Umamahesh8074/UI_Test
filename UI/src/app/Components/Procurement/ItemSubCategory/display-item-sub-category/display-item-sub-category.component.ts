import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
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
import { ItemSubCategory } from 'src/app/Models/Procurement/itemsubcategory';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ItemCategoryService } from 'src/app/Services/ProcurementService/item-category.service';
import { ItemSubCategoryService } from 'src/app/Services/ProcurementService/ItemSubCategory/item-sub-category.service';

@Component({
  selector: 'app-displayitem-sub-category',
  templateUrl: './display-item-sub-category.component.html',
  styleUrls: ['./display-item-sub-category.component.css'],
  encapsulation: ViewEncapsulation.None, // Set ViewEncapsulation to None
})
export class DisplayItemSubCategoryComponent implements OnInit {
  private destroy$ = new Subject<void>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  itemSubCategoryData: ItemSubCategory[] = [];

  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  id: number = 0;
  itemCat: any[] = [];
  category: any = new FormControl([] as ItemCategory[]);
  itemCategoryId: number = 0;
  options: CommonReferenceDetails[] = [];

  workTypeId: number = 0;
  itemSubCategorySerachText: string = '';
  itemsubcategoryName: string = '';
  itemSubCategoryCode: string = '';
  selectedCategory: ItemCategory = new ItemCategory();

  displayedColumns: string[] = [
    'rowNumber',
    'workTypeName',
    'itemCategoryName',
    'subCategoryCode',
    'itemSubCategoryName',
    'status',
    'actions',
  ];

  ngOnInit(): void {
    this.getAllItemCategories();
    this.getDataFromState();
    this.getItemSubCategory();
    this.itemSubCategoryService.refreshRequired.subscribe(() => {
      this.getItemSubCategory();
    });
    this.getWorkTypes();
  }

  constructor(
    private itemSubCategoryService: ItemSubCategoryService,
    private router: Router,
    public dialog: MatDialog,
    private itemCategoryService: ItemCategoryService,
    private route: ActivatedRoute,
    private commanService: CommanService
  ) {}

  getDataFromState() {
    const { statePageSize, statePageIndex, displayPageData } = history.state;
    this.pageSize = statePageSize ?? this.pageSize;
    this.pageIndex = statePageIndex ?? this.pageIndex;
    if (displayPageData) {
      const displayStatePageData = displayPageData;
      this.workTypeId = displayStatePageData.selectedCategoryType;
      this.itemsubcategoryName =
        displayStatePageData.searchedItemSubCategorySerachText;
      this.itemSubCategoryCode =
        displayStatePageData.searchedItemSubCategoryCode;
      this.selectedCategory = displayStatePageData.selectedCategory;
      this.patchFormValues();
    }
  }

  // Patch values into form controls
  patchFormValues() {
    if (this.selectedCategory) {
      this.category.patchValue(this.selectedCategory);
      this.itemCategoryId = this.selectedCategory.categoryId;
    }
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getItemSubCategory();
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
    this.getItemSubCategory();
    this.getAllItemCategories();
  }

  getItemSubCategory() {
    this.itemSubCategoryService
      .getAllItemSubCategory(
        this.itemsubcategoryName,
        this.itemCategoryId,
        0,
        this.pageIndex,
        this.pageSize,
        this.itemSubCategoryCode,
        this.workTypeId
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (itemSubCategoryData) => {
          this.itemSubCategoryData = itemSubCategoryData.records;
          if (this.paginator) {
            this.paginator.pageIndex = this.pageIndex;
            this.paginator.pageSize = this.pageSize;
          }
          this.totalItems = itemSubCategoryData.totalRecords;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  ///opening confirm dialog
  openConfirmDialog(itemsubcategoryId: any) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'Item SubCategory' }, // Pass the property as data to the dialog
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteItemSubCategory(itemsubcategoryId);
        }
      }
    );
  }

  //delete item-sub-category by item-sub-category id
  deleteItemSubCategory(itemsubcategoryId: number) {
    this.itemSubCategoryService
      .deleteItemSubCategory(itemsubcategoryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (itemSubCategoryData) => {
          console.log(itemSubCategoryData);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  addItemSubCategory() {
    this.router.navigate(['./itemsubcategory'], {
      relativeTo: this.route.parent,
      state: {
        isAdding: true,
        statePageSize: this.pageSize,
        statePageIndex: this.pageIndex,
        displayPage: {
          selectedCategoryType: this.workTypeId,
          searchedItemSubCategorySerachText: this.itemsubcategoryName,
          searchedItemSubCategoryCode: this.itemSubCategoryCode,
          selectedCategory: this.selectedCategory,
        },
      },
    });
  }

  //edit item sub category
  editItemSubCategory(itemSubCategoryData: any) {
    this.itemSubCategoryService
      .getSubCategoryById(itemSubCategoryData.subCategoryId)
      .subscribe({
        next: (response) => {
          this.router.navigate(['./itemsubcategory'], {
            relativeTo: this.route.parent,
            state: {
              itemSubCategory: response,
              isAdding: false,
              statePageSize: this.pageSize,
              statePageIndex: this.pageIndex,
              displayPage: {
                selectedCategoryType: this.workTypeId,
                searchedItemSubCategorySerachText: this.itemsubcategoryName,
                searchedItemSubCategoryCode: this.itemSubCategoryCode,
                selectedCategory: this.selectedCategory,
              },
            },
          });
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  displayFn(input: any) {
    return input && input.name ? input.name : 'All';
  }

  onCategorySelectionChange(event: any) {
    this.itemCategoryId = event.option.value.categoryId;
    this.selectedCategory = event.option.value;
    console.log(event.option.value);
    this.getItemSubCategory();
  }

  onSearch(subCategoryName: any) {
    if (
      subCategoryName.length === searchTextZero ||
      subCategoryName.length > searchTextLength
    ) {
      this.itemsubcategoryName = subCategoryName;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getItemSubCategory();
    }
  }

  searchCategory(event: any) {
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

  onSearchSubCatCode(event: any) {
    const query = event.target.value;
    console.log(query);
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.itemSubCategoryCode = query;
      this.getItemSubCategory();
    }
    if (query.length === searchTextZero) {
      this.itemCategoryId = 0;
      this.getItemSubCategory();
    }
  }

  //getting all item categories for display dropdown
  getAllItemCategories() {
    this.itemCategoryService
      .fetchItemCategories(this.itemSubCategorySerachText, this.workTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const allOption = new ItemCategory();
          allOption.categoryId = 0;
          allOption.name = 'All';
          this.itemCat = [allOption, ...response];
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetForm() {
    const itemCat = new ItemCategory();
    itemCat.categoryId = 0;
    itemCat.name = 'All';
    this.category.reset(itemCat);
    this.itemCategoryId = 0;
    this.workTypeId = 0;
    this.itemsubcategoryName = '';
    this.itemSubCategoryCode = '';
    this.selectedCategory = new ItemCategory();
    this.getItemSubCategory();
  }
}
