import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { ReusableComponent } from 'src/app/Comman-Components/base-component/base.component';
import {
  COMMON_STATUS,
  WORK_TYPE,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  IItemCategory,
  ItemCategory,
} from 'src/app/Models/Procurement/ItemCategory';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ItemCategoryService } from 'src/app/Services/ProcurementService/item-category.service';

@Component({
  selector: 'app-add-item-category',
  templateUrl: './add-item-category.component.html',
  styleUrls: ['./add-item-category.component.css'],
})
export class AddItemCategoryComponent
  extends ReusableComponent
  implements OnInit, OnDestroy
{
  itemCategory: IItemCategory = new ItemCategory();
  isAdding: boolean = true;
  statePageSize: number = 0;
  statePageIndex: number = 0;
  options: CommonReferenceDetails[] = [];
  statuses: CommonReferenceDetails[] = [];
  displayPageData: any;

  constructor(
    private builder: FormBuilder,
    router: Router,
    route: ActivatedRoute,
    private itemCategoryService: ItemCategoryService,
    commanService: CommanService
  ) {
    super(commanService, router, route);
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setItemCategoryFromHistoryState();
    this.getCommonStatuses();
    this.getWorkTypes();
  }

  private initializeForm(): void {
    this.formData = this.builder.group({
      workTypeId: [0],
      categoryId: [0],
      name: ['', [Validators.required]],
      status: ['A', Validators.required],
    });
  }

  private setItemCategoryFromHistoryState(): void {
    const {
      itemCategory,
      isAdding,
      statePageSize,
      statePageIndex,
      displayPage,
    } = history.state;
    this.isAdding = isAdding;
    this.statePageSize = statePageSize;
    this.statePageIndex = statePageIndex;
    if (displayPage) {
      this.displayPageData = displayPage;
    }
    itemCategory && (this.itemCategory = itemCategory);
    !isAdding && this.patchFormDataWithItemCategory();
  }

  private patchFormDataWithItemCategory() {
    this.formData.patchValue(this.itemCategory);
  }
  submitForm(): void {
    if (this.formData.valid && this.formData.touched) {
      const formDataValue = this.formData.value;
      const saveOrUpdateObservable = this.isAdding
        ? this.itemCategoryService.saveItemCategory(formDataValue)
        : this.itemCategoryService.updateItemCategory(formDataValue);

      saveOrUpdateObservable.pipe(takeUntil(this.destroy$)).subscribe({
        next: (resp) => {
          const navigateExtras = {
            relativeTo: this.route.parent,
          };
          this.handleSuccessResponse(resp);
          this.router.navigate(['./item/category'], navigateExtras);
        },
        error: (err) => {
          this.handleErrorResponse(err);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  gotoItemCategory() {
    this.router.navigate(['./item/category'], {
      relativeTo: this.route.parent,
      state: {
        statePageSize: this.statePageSize,
        statePageIndex: this.statePageIndex,
        displayPageData: this.displayPageData,
      },
    });
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
}
