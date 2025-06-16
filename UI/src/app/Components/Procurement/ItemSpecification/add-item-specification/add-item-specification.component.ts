import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  COMMON_STATUS,
  PAGE_INDEX,
  PAGE_SIZE,
  searchTextLength,
  searchTextZero,
  WORK_TYPE,
} from 'src/app/Constants/CommanConstants/Comman';
import { ItemCategory } from 'src/app/Models/Procurement/ItemCategory';
import {
  IItemSpecification,
  ItemSpecification,
} from 'src/app/Models/Procurement/itemspecification';
import { ItemSubCategory } from 'src/app/Models/Procurement/itemsubcategory';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ItemCategoryService } from 'src/app/Services/ProcurementService/item-category.service';
import { ItemSpecificationService } from 'src/app/Services/ProcurementService/ItemSpecification/item-specification.service';
import { ItemSubCategoryService } from 'src/app/Services/ProcurementService/ItemSubCategory/item-sub-category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-item-specification',
  templateUrl: './add-item-specification.component.html',
  styleUrls: ['./add-item-specification.component.css'],
})
export class AddItemSpecificationComponent implements OnInit {
  itemSpecification: IItemSpecification = new ItemSpecification();
  //auto complete
  itemSubCategories: any[] = [];
  itemSubCategoryId: number = 0;
  statuses: any;
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  subCateId: number = 0;
  category: any = new FormControl([] as ItemCategory[]);
  subCategory: any = new FormControl([] as ItemSubCategory[]);
  formData!: FormGroup;
  itemCategories: any = [];
  categoryName: string = '';
  itemCategoryId: number = 0;
  stateItemCategoryId: number = 0;
  itemsubcategoryName: string = '';
  workTypeId: number = 0;
  stateWorkType: number = 0;
  itemSubCategoryData: any = [];
  options: CommonReferenceDetails[] = [];
  selectedCategory = new ItemCategory();
  selectedSubCategory = new ItemSubCategory();
  itemSpecificationName: string = '';
  itemSpecificationNameCode: string = '';
  pageSize: number = PAGE_SIZE;
  pageIndex: number = PAGE_INDEX;
  displayPageData: any;

  constructor(
    private router: Router,
    private itemSpecificationService: ItemSpecificationService,
    private builder: FormBuilder,
    private itemSubCategoryService: ItemSubCategoryService,
    private itemCategoryService: ItemCategoryService,
    private commanService: CommanService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getDataFromState();
    this.getWorkTypes();
    this.getCommonStatuses();
  }

  initializeForm() {
    this.formData = this.builder.group({
      specificationId: [0],
      workTypeId: [0],
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      subCategoryId: [0, Validators.required],
      status: ['A'],
    });
  }

  getDataFromState() {
    const { itemSpecification, isAdding, displayPage } = history.state;
    console.log(itemSpecification);
    if (displayPage) {
      this.displayPageData = displayPage;
    }
    this.isAdding = isAdding;
    itemSpecification && (this.itemSpecification = itemSpecification);
    !isAdding && this.patchFormDataWithItemSpecification();
  }

  patchFormDataWithItemSpecification() {
    if (this.itemSpecification.categoryId) {
      this.fetchItemCategoryById(this.itemSpecification.categoryId);
    }
    if (this.itemSpecification.subCategoryId) {
      this.fetchItemSubCategoryById(this.itemSpecification.subCategoryId);
    }
    this.getItemCategories();
    this.getItemSubCategory();
    this.formData.patchValue(this.itemSpecification);
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
            this.getWorkTypes();
          }
        },
        error: (err: any) =>
          console.error('Error adding ItemSpecification', err),
      });
  }

  fetchItemSubCategoryById(id: number) {
    this.itemSubCategoryService
      .getSubCategoryById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp) => {
          this.subCategory.patchValue(resp);
        },
        error: (err: any) =>
          console.error('Error adding ItemSpecification', err),
      });
  }

  save() {
    if (this.formData.valid && this.formData.touched) {
      const formDataValue = this.formData.value;

      const saveOrUpdateObservable = this.isAdding
        ? this.itemSpecificationService.addItemSpecification(formDataValue)
        : this.itemSpecificationService.updateItemSpecification(formDataValue);

      saveOrUpdateObservable.pipe(takeUntil(this.destroy$)).subscribe({
        next: (resp) => {
          this.handleSuccessResponse(resp);
          // this.router.navigate(['./item/specification'], state);
          this.router.navigate(['./item/specification'], {
            relativeTo: this.route.parent,
            state: {
              itemSpecification: resp,
              isAdding: false,
              workTypeId: this.workTypeId,
              selectedCategory: this.selectedCategory,
              selectedSubCategory: this.selectedSubCategory,
              itemSpecificationName: this.itemSpecificationName,
              itemSpecificationNameCode: this.itemSpecificationNameCode,
            },
          });
        },
        error: (err) => {
          this.handleErrorResponse(err);
        },
      });
    } else {
      console.log('Form is invalid');
    }
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
    this.workTypeId = event.value;
    this.category.patchValue({});
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
      this.formData.get('categoryId')?.patchValue(this.itemCategoryId);
    }
    this.formData.get('subCategoryId')?.patchValue('');
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

  displayFn(input: any) {
    return input && input.name ? input.name : '';
  }

  onSubCategorySelectionChange(event: any) {
    this.itemSubCategoryId = event.option.value.subCategoryId;
    this.formData.get('subCategoryId')?.patchValue(this.itemSubCategoryId);
  }

  onSearchItemCategories(itemCategory: any) {
    const query = itemCategory.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.categoryName = query;
      this.getItemCategories();
    }
  }
  onSearchItemSubCategory(itemSubCategory: any) {
    const query = itemSubCategory.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.itemsubcategoryName = query;
      this.getItemSubCategory();
    }
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

  gotoItemSpecifications() {
    this.router.navigate(['./item/specification'], {
      relativeTo: this.route.parent,
      state: {
        displayPageData: this.displayPageData,
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
      this.gotoItemSpecifications();
    });
  }

  private handleErrorResponse(error: any): void {
    console.log(error);

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

  clearForm() {
    this.formData.reset();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
