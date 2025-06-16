import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import {
  COMMON_STATUS,
  TIME_OUT,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  NAVIGATE_TO_DISPLAY_PRIME_ACTIVITY,
  UNIT_OF_MEASUREMENT,
} from 'src/app/Constants/WorkOrder/workorder';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import {
  IPrimeActivityCode,
  PrimeActivityCode,
} from 'src/app/Models/WorkOrder/PrimeActivityCode';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { PrimeActivityCodeService } from 'src/app/Services/WorkOrderService/PrimeActivityCode/PrimeActivityCode.service';

@Component({
  selector: 'prime-activity-code',
  templateUrl: './prime-activity-code.component.html',
  styleUrls: ['./prime-activity-code.component.css'],
})
export class AddPrimeActivityCode implements OnInit {
  primeActivityCode: IPrimeActivityCode = new PrimeActivityCode();
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  formData!: FormGroup;
  organizationId: number = 0;
  unitOfMeasurements: any[] = [];
  uomId: number = 0;
  uomName: string = '';
  uom: any = new FormControl([] as CommonReferenceType[]);
  selectedUom: CommonReferenceType = new CommonReferenceType();
  statuses: any;
  showUomError: boolean = false;
  statePageSize: number = 0;
  statePageIndex: number = 0;

  ngOnInit(): void {
    this.initializeFormData();
    this.setUserFromLocalStorage();
    this.getDataFromState();
    this.fetchUnitOfMeasurements();
    this.getCommonStatuses();
  }

  constructor(
    private router: Router,
    private primeActivityCodeService: PrimeActivityCodeService,
    private builder: FormBuilder,
    private commonService: CommanService,
    private commonRefDetailsService: CommonreferencedetailsService,
    private toastrService: ToastrService,
    private loaderService: LoaderService
  ) {}

  private initializeFormData(): void {
    this.formData = this.builder.group({
      id: [0],
      primeActivityNumber: ['', Validators.required],
      primeActivityDescription: ['', Validators.required],
      primeActivityUomId: [null, Validators.required],
      status: ['A'],
      padCode: [null, Validators.required],
    });
  }

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
    }
  }

  private getDataFromState() {
    const { primeActivityCode, isAdding, statePageSize, statePageIndex } =
      history.state;
    this.isAdding = isAdding;
    this.primeActivityCode = primeActivityCode || this.primeActivityCode;
    this.statePageSize = statePageSize;
    this.statePageIndex = statePageIndex;
    if (!this.isAdding) {
      this.patchFormDataWithPrimeActivityData();
    }
  }

  private patchFormDataWithPrimeActivityData() {
    if (this.primeActivityCode.primeActivityUomId) {
      this.fetchUom(this.primeActivityCode.primeActivityUomId);
    }
    this.formData.patchValue(this.primeActivityCode);
  }

  private fetchUom(primeActivityUomId: number) {
    this.commonRefDetailsService
      .getById(primeActivityUomId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (uom) => {
          this.selectedUom = uom;
          this.formData.patchValue({ primeActivityUomId: uom.id });
        },
        error: (error: Error) => {},
      });
  }

  fetchUnitOfMeasurements(): void {
    this.commonService
      .getCommanReferanceDetailsWithFilters(UNIT_OF_MEASUREMENT, this.uomName)
      .subscribe({
        next: (uom) => {
          this.unitOfMeasurements = uom;
        },
        error: (error: any) => {
          console.error('Error fetching unit of measurements:', error);
        },
      });
  }

  onUOMSelect(event: any) {
    this.showUomError = false;
    this.uomId = event.option.value.id;
    this.formData.patchValue({ primeActivityUomId: this.uomId });
  }
  displayUom(uom: CommonReferenceType): string {
    return uom && uom.commonRefValue ? uom.commonRefValue : '';
  }

  searchUom(event: any): void {
    const query = event.target.value;
    this.uomName = query;
    this.fetchUnitOfMeasurements();
  }

  save() {
    // Check for validation
    if (this.formData.get('primeActivityUomId')?.invalid) {
      this.showUomError = true;
    }
    if (this.formData.valid) {
      this.showLoading();
      const saveOrUpdate$ = this.isAdding
        ? this.primeActivityCodeService.addPrimeActivity(this.formData.value)
        : this.primeActivityCodeService.updatePrimeActivity(
            this.formData.value
          );
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
  handleSuccessResponse(response: any): void {
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
    this.gotoPrimeActivities();
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
    this.gotoPrimeActivities();
  }

  clearForm() {
    this.formData.reset();
  }
  gotoPrimeActivities() {
    this.router.navigate([NAVIGATE_TO_DISPLAY_PRIME_ACTIVITY], {
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
