import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import { ItemSpecification } from 'src/app/Models/Procurement/itemspecification';
import { ItemSpecificationService } from 'src/app/Services/ProcurementService/ItemSpecification/item-specification.service';
import { MatTableDataSource } from '@angular/material/table';
import {
  PAGE_INDEX,
  PAGE_SIZE,
  pageSizeOptions,
  searchTextLength,
  searchTextZero,
  TOTAL_ITEMS,
  WORK_TYPE,
} from 'src/app/Constants/CommanConstants/Comman';
import { ItemCategoryService } from 'src/app/Services/ProcurementService/item-category.service';
import { ItemSubCategoryService } from 'src/app/Services/ProcurementService/ItemSubCategory/item-sub-category.service';
import { FormControl } from '@angular/forms';
import { ItemCategory } from 'src/app/Models/Procurement/ItemCategory';
import { ItemSubCategory } from 'src/app/Models/Procurement/itemsubcategory';
import { MatPaginator } from '@angular/material/paginator';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';

@Component({
  selector: 'app-displayitem-specification',
  templateUrl: './display-item-specification.component.html',
  styleUrls: ['./display-item-specification.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class DisplayItemSpecificationComponent implements OnInit {
  private destroy$ = new Subject<void>();
  itemSpecificationDetails = new MatTableDataSource<ItemSpecification>([]);
  itemSpecificationName: string = '';
  itemSpecificationNameCode: string = '';
  displayedColumns: string[] = [
    'rowNumber',
    'workType',
    'specificationCode',
    'category',
    'subCategory',
    'itemSpecificationName',
    'status',
    'actions',
  ];
  dialogRef: MatDialogRef<ConfirmdialogComponent> | undefined;
  categoryName: string = '';
  totalItems: number = TOTAL_ITEMS;
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  pageSizeOptions = pageSizeOptions;
  id: number = 0;
  itemSubCategoryData: any;
  itemCategories: any = [];
  itemCategoryId: number = 0;
  itemsubcategoryName: string = '';
  category: any = new FormControl([] as ItemCategory[]);
  subCategory: any = new FormControl([] as ItemSubCategory[]);
  itemSubCategoryId: number = 0;
  workTypeId: number = 0;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  options: CommonReferenceDetails[] = [];

  selectedCategory = new ItemCategory();
  selectedSubCategory = new ItemSubCategory();
  constructor(
    private itemSpecificationService: ItemSpecificationService,
    private router: Router,
    public dialog: MatDialog,
    public itemCategoryService: ItemCategoryService,
    private route: ActivatedRoute,
    public itemSubCategoryService: ItemSubCategoryService,
    private commanService: CommanService
  ) {}

  ngOnInit(): void {
    this.getDataFromState();
    this.getWorkTypes();
    this.getItemCategories();
    this.getItemSpecification();
    this.itemSpecificationService.refreshRequired.subscribe(() => {
      this.getItemSpecification();
    });
  }

  getDataFromState() {
    const { displayPageData } = history.state;
    if (displayPageData) {
      const displayStatePageData = displayPageData;
      this.workTypeId = displayStatePageData.selectedCategoryType;
      this.selectedCategory = displayStatePageData.selectedCategory;
      this.selectedSubCategory = displayStatePageData.selectedSubCategory;
      this.itemSpecificationName = displayPageData.itemSpecificationName;
      this.itemSpecificationNameCode =
        displayPageData.itemSpecificationNameCode;
      this.pageSize = displayPageData.pageSize;
      this.pageIndex = displayPageData.pageIndex;
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
  }

  getItemSpecification() {
    this.itemSpecificationService
      .getAllItemSpecification(
        this.workTypeId,
        this.itemSpecificationNameCode,
        this.itemSpecificationName,
        this.itemCategoryId,
        this.itemSubCategoryId,
        '',
        this.pageIndex,
        this.pageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (itemSpecificationData) => {
          this.itemSpecificationDetails.data = itemSpecificationData.records;
          if (this.paginator) {
            this.paginator.pageIndex = this.pageIndex;
            this.paginator.pageSize = this.pageSize;
          }
          this.totalItems = itemSpecificationData.totalRecords;
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

  onWorkTypeChange(event: any) {
    event.value == 'All'
      ? (this.workTypeId = 0)
      : (this.workTypeId = event.value);
    this.getItemCategories();
    this.getItemSpecification();
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
    }
    this.itemSubCategoryData = [];
    this.selectedCategory = event.option.value;
    this.subCategory.patchValue({} as ItemSubCategory);
    this.getItemSpecification();
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
    this.selectedSubCategory = event.option.value;
    this.getItemSpecification();
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
      this.getItemSpecification();
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
      this.getItemSpecification();
    }
  }
  onSearchItemSpecification(itemSpecification: any) {
    console.log(itemSpecification.target.value);
    const query = itemSpecification.target.value;
    if (query.length === searchTextZero || query.length > searchTextLength) {
      this.itemSpecificationName = query;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getItemSpecification();
    }
  }
  onSearchItemSpecificationCode(itemSpecificationNameCode: any) {
    console.log(itemSpecificationNameCode.target.value);
    const query = itemSpecificationNameCode.target.value;
    if (query.length === searchTextZero || query.length > searchTextLength) {
      this.itemSpecificationNameCode = query;
      this.pageIndex = PAGE_INDEX;
      this.paginator.firstPage();
      this.getItemSpecification();
    }
  }

  editItemSpecification(itemSpecificationData: any) {
    this.itemSpecificationService
      .getSpecificationById(itemSpecificationData.specificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.router.navigate(['./itemspecification'], {
            relativeTo: this.route.parent,
            state: {
              itemSpecification: resp,
              isAdding: false,
              displayPage: {
                selectedCategoryType: this.workTypeId,
                selectedCategory: this.selectedCategory,
                selectedSubCategory: this.selectedSubCategory,
                itemSpecificationName: this.itemSpecificationName,
                itemSpecificationNameCode: this.itemSpecificationNameCode,
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
              },
            },
          });
        },
        error: (err: any) =>
          console.error('Error adding ItemSpecification', err),
      });
  }

  openConfirmDialog(itemSpecificationId: number) {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: { displayedData: 'delete Item Specification' },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteItemSpecification(itemSpecificationId);
        }
      }
    );
  }

  deleteItemSpecification(itemSpecificationId: number) {
    this.itemSpecificationService
      .deleteItemSpecification(itemSpecificationId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.getItemSpecification();
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  addItemSpecification() {
    this.router.navigate(['./itemspecification'], {
      relativeTo: this.route.parent,
      state: {
        isAdding: true,
        displayPage: {
          selectedCategoryType: this.workTypeId,
          selectedCategory: this.selectedCategory,
          selectedSubCategory: this.selectedSubCategory,
          itemSpecificationName: this.itemSpecificationName,
          itemSpecificationNameCode: this.itemSpecificationNameCode,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      },
    });
  }

  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getItemSpecification();
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

    const itemSubCat = new ItemSubCategory();
    itemSubCat.subCategoryId = 0;
    itemSubCat.name = 'All';
    this.subCategory.reset(itemSubCat);
    this.itemSubCategoryId = 0;

    this.workTypeId = 0;
    this.itemSpecificationName = '';
    this.itemSpecificationNameCode = '';
    this.selectedCategory = new ItemCategory();
    this.selectedSubCategory = new ItemSubCategory();
    this.getItemSpecification();
  }
}
