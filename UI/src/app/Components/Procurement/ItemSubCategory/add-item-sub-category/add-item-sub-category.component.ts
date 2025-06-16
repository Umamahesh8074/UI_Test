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
  searchTextLength,
  searchTextZero,
  WORK_TYPE,
} from 'src/app/Constants/CommanConstants/Comman';
import { ItemCategory } from 'src/app/Models/Procurement/ItemCategory';
import {
  IItemSubCategory,
  ItemSubCategory,
} from 'src/app/Models/Procurement/itemsubcategory';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ItemSubCategoryService } from 'src/app/Services/ProcurementService/ItemSubCategory/item-sub-category.service';

import { ItemCategoryService } from 'src/app/Services/ProcurementService/item-category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-item-sub-category',
  templateUrl: './add-item-sub-category.component.html',
  styleUrls: ['./add-item-sub-category.component.css'],
})
export class AddItemSubCategoryComponent implements OnInit {
  itemSubCategory: IItemSubCategory = new ItemSubCategory();
  categoryId: number = 0;
  itemSubCat: any[] = [];
  itemCat: any[] = [];
  filteredItemCategories: Observable<any> | undefined;
  category: any = new FormControl([] as ItemCategory[]);
  statuses: any = [];
  categoryName: any = '';
  formData!: FormGroup;
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  workTypeId: number = 0;
  options: CommonReferenceDetails[] = [];
  displayPageData: any;
  statePageSize: number = 0;
  statePageIndex: number = 0;

  constructor(
    private router: Router,
    private itemSubCategoryService: ItemSubCategoryService,
    private builder: FormBuilder,
    private itemCategoryService: ItemCategoryService,
    private commanService: CommanService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getDataFromState();
    this.getCommonStatuses();
    this.getWorkTypes();
  }

  initializeForm() {
    this.formData = this.builder.group({
      subCategoryId: [0],
      workTypeId: [0],
      name: ['', Validators.required],
      categoryId: [0, Validators.required],
      status: ['A'],
    });
  }

  getDataFromState() {
    const {
      itemSubCategory,
      isAdding,
      statePageSize,
      statePageIndex,
      displayPage,
    } = history.state;
    this.isAdding = isAdding;
    itemSubCategory && (this.itemSubCategory = itemSubCategory);
    !isAdding && this.patchFormDataWithItemSubCategory();
    this.statePageSize = statePageSize;
    this.statePageIndex = statePageIndex;
    if (displayPage) {
      this.displayPageData = displayPage;
    }
  }

  private patchFormDataWithItemSubCategory() {
    if (this.itemSubCategory.categoryId) {
      this.fetchItemCategoryById(this.itemSubCategory.categoryId);
    }
    this.formData.patchValue(this.itemSubCategory);
  }

  fetchItemCategoryById(id: number) {
    this.itemCategoryService
      .getCategoryById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.category.patchValue(resp);
          this.workTypeId = resp.workTypeId;
          this.formData.get('workTypeId')?.patchValue(resp.workTypeId);
          if (this.workTypeId > 0) {
            this.getAllItemCategories();
          }
        },
        error: (err: any) => {
          console.error(
            'Error Getting ItemSubCategory for id this.itemSubCategory.itemCategoryId',
            err
          );
        },
      });
  }

  save() {
    if (this.formData.valid && this.formData.touched) {
      const formDataValue = this.formData.value;
      const saveOrUpdateObservable = this.isAdding
        ? this.itemSubCategoryService.addItemSubCategory(formDataValue)
        : this.itemSubCategoryService.updateItemSubCategory(formDataValue);

      saveOrUpdateObservable.pipe(takeUntil(this.destroy$)).subscribe({
        next: (resp) => {
          const navigateExtras = {
            relativeTo: this.route.parent,
          };
          this.handleSuccessResponse(resp);
          this.router.navigate(['./item/subcategory'], navigateExtras);
        },
        error: (err) => {
          this.handleErrorResponse(err);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  clearForm() {
    this.formData.reset();
  }

  gotoItemSubCategorys() {
    this.router.navigate(['./item/subcategory'], {
      relativeTo: this.route.parent,
      state: {
        statePageSize: this.statePageSize,
        statePageIndex: this.statePageIndex,
        displayPageData: this.displayPageData,
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

  //getting all item categories for display dropdown
  getAllItemCategories() {
    this.itemCategoryService
      .fetchItemCategories(this.categoryName, this.workTypeId)
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

  displayFn(input: any) {
    return input && input.name ? input.name : 'Select';
  }

  onCategorySelectionChange(event: any) {
    console.log(event.option.value);
    this.formData.get('categoryId')?.patchValue(event.option.value.categoryId);
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

  onWorkTypeChange(event: any) {
    console.log(event.value);
    this.workTypeId = event.value;
    this.category.patchValue({});
    this.getAllItemCategories();
  }
  onSearchItemCategory(itemCategory: any) {
    const query = itemCategory.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.categoryName = query;
      this.getAllItemCategories();
    }
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
    }).then(() => {});
  }

  private handleErrorResponse(error: any): void {
    Swal.fire({
      title: 'Error',
      text: error.error.message,
      icon: 'error',
      confirmButtonText: 'OK',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
