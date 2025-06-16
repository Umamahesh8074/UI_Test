import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ServiceGroupService } from 'src/app/Services/WorkOrderService/ServiceGroup/ServiceGroup.service';
import {
  IServiceGroup,
  ServiceGroup,
} from 'src/app/Models/WorkOrder/ServiceGroup';
import {
  NAVIGATE_TO_DISPLAY_SERVICE_GROUP,
  SERVICE__GROUP_TYPE,
  SERVICE_GROUP_CATEGORY,
} from 'src/app/Constants/WorkOrder/workorder';
import { Subject, takeUntil } from 'rxjs';
import {
  COMMON_STATUS,
  searchTextLength,
  searchTextZero,
  TIME_OUT,
} from 'src/app/Constants/CommanConstants/Comman';
import { ToastrService } from 'ngx-toastr';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';

@Component({
  selector: 'service-group',
  templateUrl: './service-group.component.html',
  styleUrls: ['./service-group.component.css'],
})
export class AddServiceGroup implements OnInit {
  serviceGroup: IServiceGroup = new ServiceGroup();
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  organizationId: number = 0;
  formData!: FormGroup;
  statePageSize: number = 0;
  statePageIndex: number = 0;
  statuses: any;
  showServiceGroupCategoryError: boolean = false;
  showServiceGroupTypeError: boolean = false;

  serviceGroupCategories: any[] = [];
  serviceGroupCategoryName: string = '';
  serviceGroupCategoryId: number = 0;
  serviceGroupCategory: any = new FormControl([] as CommonReferenceType[]);
  selectedServiceGroupCategory: CommonReferenceType = new CommonReferenceType();

  serviceGroupTypes: any[] = [];
  serviceGroupTypeName: string = '';
  serviceGroupTypeId: number = 0;
  serviceGroupType: any = new FormControl([] as CommonReferenceType[]);
  selectedServiceGroupType: CommonReferenceType = new CommonReferenceType();

  ngOnInit(): void {
    this.initializeFormData();
    this.setUserFromLocalStorage();
    this.getDataFromState();
    this.fetchServiceGroupCategories();
    this.fetchServiceGroupTypes();
    this.getCommonStatuses();
  }

  constructor(
    private router: Router,
    private serviceGroupService: ServiceGroupService,
    private builder: FormBuilder,
    private commonService: CommanService,
    private toastrService: ToastrService,
    private loaderService: LoaderService,
    private commonRefDetailsService: CommonreferencedetailsService
  ) {}

  private initializeFormData() {
    this.formData = this.builder.group({
      id: [0],
      serviceGroupCategoryId: ['', Validators.required],
      serviceGroupName: [''],
      serviceGroupCode: ['', Validators.required],
      serviceGroupTypeId: ['', Validators.required],
      serviceGroupDescription: [''],
      status: ['A'],
    });
  }

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
    }
  }

  private getDataFromState() {
    const { serviceGroup, isAdding, statePageSize, statePageIndex } =
      history.state;
    this.isAdding = isAdding;
    this.serviceGroup = serviceGroup || this.serviceGroup;
    this.statePageSize = statePageSize;
    this.statePageIndex = statePageIndex;
    if (!this.isAdding) {
      this.patchFormDataWithServiceGroupData();
    }
  }

  private patchFormDataWithServiceGroupData() {
    if (this.serviceGroup.serviceGroupCategoryId) {
      this.fetchServiceGroupCategory(this.serviceGroup.serviceGroupCategoryId);
    }
    if (this.serviceGroup.serviceGroupTypeId) {
      this.fetchServiceGroupType(this.serviceGroup.serviceGroupTypeId);
    }
    this.formData.patchValue(this.serviceGroup);
  }

  private fetchServiceGroupCategory(serviceGroupCategoryId: number) {
    this.commonRefDetailsService
      .getById(serviceGroupCategoryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (serviceGroupCategory) => {
          this.selectedServiceGroupCategory = serviceGroupCategory;
          this.formData.patchValue({
            serviceGroupCategoryId: serviceGroupCategory.id,
          });
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  private fetchServiceGroupType(serviceGroupTypeId: number) {
    this.commonRefDetailsService
      .getById(serviceGroupTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (serviceGroupType) => {
          this.selectedServiceGroupType = serviceGroupType;
          this.formData.patchValue({ serviceGroupTypeId: serviceGroupType.id });
        },
        error: () => {},
      });
  }
  onServiceGroupCategory(event: any) {
    this.showServiceGroupCategoryError = false;
    this.serviceGroupCategoryId = event.option.value.id;
    this.formData.patchValue({
      serviceGroupCategoryId: this.serviceGroupCategoryId,
    });
  }
  displayServicegroupCategory(
    serviceGroupCategory: CommonReferenceType
  ): string {
    return serviceGroupCategory && serviceGroupCategory.commonRefValue
      ? serviceGroupCategory.commonRefValue
      : '';
  }

  searchServiceGroupCategory(event: any) {
    const query = event.target.value;
    if (query.length >= searchTextLength || query.length === searchTextZero) {
      this.serviceGroupCategoryName = query;
      this.fetchServiceGroupCategories();
    }
  }

  onServiceGroupType(event: any) {
    this.showServiceGroupTypeError = false;
    this.serviceGroupTypeId = event.option.value.id;
    this.formData.patchValue({ serviceGroupTypeId: this.serviceGroupTypeId });
  }
  displayServiceGroupType(serviceGroupType: CommonReferenceType): string {
    return serviceGroupType && serviceGroupType.commonRefValue
      ? serviceGroupType.commonRefValue
      : '';
  }

  searchServiceGroupType(event: any) {
    const query = event.target.value;
    this.serviceGroupTypeName = query;
    this.fetchServiceGroupTypes();
  }
  fetchServiceGroupCategories() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(
        SERVICE_GROUP_CATEGORY,
        this.serviceGroupCategoryName
      )
      .subscribe({
        next: (serviceGroupCategories) => {
          this.serviceGroupCategories = serviceGroupCategories;
        },
        error: (error: any) => {
          console.error('Error fetching service group categories :', error);
        },
      });
  }

  fetchServiceGroupTypes() {
    this.commonService
      .getCommanReferanceDetailsWithFilters(
        SERVICE__GROUP_TYPE,
        this.serviceGroupTypeName
      )
      .subscribe({
        next: (serviceGroupTypes) => {
          this.serviceGroupTypes = serviceGroupTypes;
        },
        error: (error: any) => {
          console.error('Error fetching service group types:', error);
        },
      });
  }

  save() {
    // Check for validation
    if (this.formData.get('serviceGroupCategoryId')?.invalid) {
      this.showServiceGroupCategoryError = true;
    }

    if (this.formData.get('serviceGroupTypeId')?.invalid) {
      this.showServiceGroupTypeError = true;
    }
    if (this.formData.valid) {
      this.showLoading();
      const saveOrUpdate$ = this.isAdding
        ? this.serviceGroupService.addServiceGroup(this.formData.value)
        : this.serviceGroupService.updateServiceGroup(this.formData.value);
      saveOrUpdate$.subscribe({
        next: (response) => {
          this.handleSuccessResponse(response);
          this.hideLoading();
        },
        error: (error) => {
          this.handleErrorResponse(error);
          this.hideLoading();
        },
      });
    }
  }

  handleSuccessResponse(response: any): void {
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
    this.gotoServiceGroup();
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
    this.gotoServiceGroup();
  }

  getCommonStatuses() {
    this.commonService.fetchCommonReferenceTypes(COMMON_STATUS).subscribe({
      next: (data) => {
        this.statuses = data;
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  clearForm() {
    this.formData.reset();
  }

  gotoServiceGroup() {
    this.router.navigate([NAVIGATE_TO_DISPLAY_SERVICE_GROUP], {
      state: {
        statePageSize: this.statePageSize,
        statePageIndex: this.statePageIndex,
      },
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
