import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import {
  COMMON_STATUS,
  TIME_OUT,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  NAVIGATE_TO_DISPLAY_STAND_IN_USER,
  UNIT_OF_MEASUREMENT,
} from 'src/app/Constants/WorkOrder/workorder';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import {
  IStandInUser,
  StandInUser,
} from 'src/app/Models/WorkOrder/StandInUser';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { StandInUserService } from 'src/app/Services/WorkOrderService/StandInUser/stand-in-user.service';

@Component({
  selector: 'stand-in-user',
  templateUrl: './stand-in-user.component.html',
  styleUrls: ['./stand-in-user.component.css'],
})
export class AddStandInUser implements OnInit {
  StandInUser: IStandInUser = new StandInUser();
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

  ngOnInit(): void {
    this.initializeFormData();
    this.setUserFromLocalStorage();
    this.getDataFromState();
    this.fetchUnitOfMeasurements();
    this.getCommonStatuses();
  }

  constructor(
    private router: Router,
    private StandInUserService: StandInUserService,
    private builder: FormBuilder,
    private commonService: CommanService,
    private commonRefDetailsService: CommonreferencedetailsService,
    private toastrService: ToastrService
  ) {}

  private initializeFormData(): void {
    this.formData = this.builder.group({
     id:[0],
managerId:[0],
userId:[0],
status:['A'],

    });
  }

  private setUserFromLocalStorage(): void {
    const user = this.commonService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
    }
  }

  private getDataFromState() {
    const { StandInUser, isAdding } = history.state;
    console.log(StandInUser);
    this.isAdding = isAdding;
    this.StandInUser = StandInUser || this.StandInUser;
    if (!this.isAdding) {
      this.patchFormDataWithStandInUserData();
    }
  }

  private patchFormDataWithStandInUserData() {
    this.formData.patchValue(this.StandInUser);
  }

  private fetchUom(primeActivityUomId: number) {
    this.commonRefDetailsService
      .getById(primeActivityUomId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (uom) => {
          this.selectedUom = uom;
          console.log(uom);
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
    if (this.formData.valid) {
      const saveOrUpdate$ = this.isAdding
        ? this.StandInUserService.addStandInUser(this.formData.value)
        : this.StandInUserService.updateStandInUser(
            this.formData.value
          );
      saveOrUpdate$.subscribe({
        next: (response) => {
          this.handleSuccessResponse(response);
        },
        error: (error) => {
          this.handleErrorResponse(error);
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
    console.log(response.message);
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
    this.gotoStandInUsers();
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
    this.gotoStandInUsers();
  }

  clearForm() {
    this.formData.reset();
  }
  gotoStandInUsers() {
    this.router.navigate([NAVIGATE_TO_DISPLAY_STAND_IN_USER]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
