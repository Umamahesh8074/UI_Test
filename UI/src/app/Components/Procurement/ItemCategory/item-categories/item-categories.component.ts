import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { ReusableComponent } from 'src/app/Comman-Components/base-component/base.component';
import { ConfirmdialogComponent } from 'src/app/Comman-Components/Dialog/confirmdialog/confirmdialog.component';
import {
  PAGE_INDEX,
  searchTextLength,
  searchTextZero,
  WORK_TYPE,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  IItemCategoryDto,
  ItemCategoryDto,
} from 'src/app/Models/Procurement/ItemCategory';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ItemCategoryService } from 'src/app/Services/ProcurementService/item-category.service';

@Component({
  selector: 'app-item-categories',
  templateUrl: './item-categories.component.html',
  styleUrls: ['./item-categories.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ItemCategoriesComponent
  extends ReusableComponent
  implements OnInit
{
  categoryName: string = '';
  categoryCode: string = '';
  workTypeId: number = 0;
  options: CommonReferenceDetails[] = [];
  itemCategories: IItemCategoryDto[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    'rowNumber',
    'workTypeName',
    'categoryCode',
    'categoryName',
    'status',
  ];

  customHeaderNames = {
    rowNumber: 'S.No',
    categoryCode: 'Category Code',
    workTypeName: 'Category Type',
    categoryName: 'Category Name',
    status: 'Status',
  };

  actionButtons: any[] = [
    { label: 'Edit', icon: 'edit', action: 'edit' },
    { label: 'Delete', icon: 'delete_forever', action: 'delete' },
  ];

  constructor(
    private itemCategoryService: ItemCategoryService,
    router: Router,
    route: ActivatedRoute,
    private dialog: MatDialog,
    commanService: CommanService
  ) {
    super(commanService, router, route);
  }

  ngOnInit(): void {
    this.getDataFromState();
    this.getItemCategories();
    this.getWorkTypes();
  }

  getDataFromState() {
    const { statePageSize, statePageIndex, displayPageData } = history.state;
    this.pageSize = statePageSize ?? this.pageSize;
    this.pageIndex = statePageIndex ?? this.pageIndex;
    if (displayPageData) {
      const displayStatePageData = displayPageData;
      this.workTypeId = displayStatePageData.selectedCategoryType;
      this.categoryCode = displayStatePageData.searchedCategoryCode;
      this.categoryName = displayStatePageData.searchedCategoryName;
    }
  }

  /**
   * Fetches item categories from the service and updates state.
   */
  getItemCategories(): void {
    this.itemCategoryService
      .getItemCategories(
        this.categoryName,
        '',
        this.pageIndex,
        this.pageSize,
        this.workTypeId,
        this.categoryCode
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: { records: ItemCategoryDto[]; totalRecords: number }) => {
          this.totalItems = data.totalRecords;
          if (this.paginator) {
            this.paginator.pageIndex = this.pageIndex;
            this.paginator.pageSize = this.pageSize;
          }
          this.itemCategories = data.records;
        },
        error: (error: Error) => {
          console.error(error);
        },
      });
  }

  /**
   * Opens the confirmation dialog before deleting an item category.
   * @param itemCategory - The category to delete.
   */
  openConfirmDialog(itemCategory: IItemCategoryDto): void {
    console.log(itemCategory);
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      data: {
        displayedData: 'Delete Item Category :' + itemCategory.categoryName,
      },
    });

    dialogRef.componentInstance.isConfirmDelete.subscribe(
      (isDelete: boolean) => {
        if (isDelete) {
          this.deleteMenu(itemCategory.categoryId);
        }
      }
    );
  }

  /**
   * Fetches work types from the service and updates the state.
   */
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

  /**
   * Deletes an item category by its ID.
   * @param categoryId - The ID of the category to delete.
   */
  deleteMenu(itemCategoryId: number): void {
    this.itemCategoryService.deleteItemCategory(itemCategoryId).subscribe({
      next: (data) => {
        this.getItemCategories();
      },
      error: (err) => {
        if (err) {
          console.error(err.message);
        }
      },
    });
  }

  /**
   * Navigates to the item category edit page.
   * @param itemCategory - The category to edit.
   */
  onEdit = (itemCategory: IItemCategoryDto): void => {
    this.itemCategoryService
      .getCategoryById(itemCategory.categoryId)
      .subscribe({
        next: (data) => {
          this.router.navigate(['./itemcategory'], {
            relativeTo: this.route.parent,
            state: {
              itemCategory: data,
              isAdding: false,
              statePageSize: this.pageSize,
              statePageIndex: this.pageIndex,
              displayPage: {
                selectedCategoryType: this.workTypeId,
                searchedCategoryCode: this.categoryCode,
                searchedCategoryName: this.categoryName,
              },
            },
          });
        },
        error: (err) => {
          if (err) {
            console.error(err.message);
          }
        },
      });
  };

  /**
   * Navigates to the item category addition page.
   */

  addItemCategory = (): void => {
    this.router.navigate(['./itemcategory'], {
      relativeTo: this.route.parent,
      state: {
        isAdding: true,
        statePageSize: this.pageSize,
        statePageIndex: this.pageIndex,
        displayPage: {
          selectedCategoryType: this.workTypeId,
          searchedCategoryCode: this.categoryCode,
          searchedCategoryName: this.categoryName,
        },
      },
    });
  };

  /**
   * Handles the search input change and updates the item list.
   * @param categoryName - The search input string.
   */
  onSearch = (categoryName: string): void => {
    console.log(categoryName);
    if (
      categoryName.length === searchTextZero ||
      categoryName.length > searchTextLength
    ) {
      console.log('entered');
      this.categoryName = categoryName;
      this.pageIndex = PAGE_INDEX;
      this.getItemCategories();
    }
  };

  onSearchCategoryCode = (categoryCode: string): void => {
    console.log(categoryCode);
    if (
      categoryCode.length === searchTextZero ||
      categoryCode.length > searchTextLength
    ) {
      console.log('entered');
      this.categoryCode = categoryCode;
      this.pageIndex = PAGE_INDEX;
      this.getItemCategories();
    }
  };

  /**
   * Handles changes to the work type filter and updates the item list.
   * @param event - The event containing the selected work type.
   */
  onWorkTypeChange = (event: MatSelectChange): void => {
    this.workTypeId = event.value === 'All' ? 0 : (event.value as number);
    this.getItemCategories();
  };

  /**
   * Handles pagination changes and updates the item list.
   * @param event - The pagination event.
   */

  onPageChange(event: any): void {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getItemCategories();
  }

  onActionClicked(event: any): void {
    const { action, row } = event;
    if (action === 'edit') {
      this.onEdit(row);
    } else if (action === 'delete') {
      this.openConfirmDialog(row);
    }
  }

  resetForm() {
    this.workTypeId = 0;
    this.categoryCode = '';
    this.categoryName = '';
    this.getItemCategories();
  }
}
