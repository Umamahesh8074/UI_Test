import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import {
  COMMON_STATUS,
  TIME_OUT,
} from 'src/app/Constants/CommanConstants/Comman';
import { NAVIGATE_TO_DISPLAY_SAC_CODE } from 'src/app/Constants/WorkOrder/workorder';
import { SacCode } from 'src/app/Models/WorkOrder/SacCode';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { SacCodeService } from 'src/app/Services/WorkOrderService/SacCode/SacCode.service';

@Component({
  selector: 'sac-code',
  templateUrl: './sac-code.component.html',
  styleUrls: ['./sac-code.component.css'],
})
export class SacCodeComponent implements OnInit {
  sacCodeData: SacCode = new SacCode();
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  @ViewChild('sacCodeTextarea') sacCodeTextarea!: ElementRef;
  statePageSize: number = 0;
  statePageIndex: number = 0;
  formData!: FormGroup;
  organizationId: number = 0;
  unitOfMeasurements: any[] = [];
  statuses: any;

  ngOnInit(): void {
    this.initializeFormData();
    this.setUserFromLocalStorage();
    this.getDataFromState();
    this.getCommonStatuses();
  }

  constructor(
    private router: Router,
    private sacCodeService: SacCodeService,
    private builder: FormBuilder,
    private commonService: CommanService,
    private toastrService: ToastrService,
    private loaderService: LoaderService
  ) {}

  private initializeFormData(): void {
    this.formData = this.builder.group({
      id: [0],
      sacCode: ['', Validators.required],
      sacCodeDescription: ['', Validators.required],
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
    const { sacCodeData, isAdding, statePageSize, statePageIndex } =
      history.state;
    console.log(sacCodeData);
    this.isAdding = isAdding;
    this.statePageSize = statePageSize;
    this.statePageIndex = statePageIndex;
    this.sacCodeData = sacCodeData || this.sacCodeData;
    if (!this.isAdding) {
      this.patchFormDataWithSacCode();
    }
  }

  private patchFormDataWithSacCode() {
    this.formData.patchValue(this.sacCodeData);
  }

  save() {
    if (this.formData.valid) {
      this.showLoading();
      const saveOrUpdate$ = this.isAdding
        ? this.sacCodeService.addSacCode(this.formData.value)
        : this.sacCodeService.updateSacCode(this.formData.value);
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
    console.log(response.message);
    this.toastrService.success('', response.message, {
      timeOut: TIME_OUT,
    });
    this.gotoSacCodes();
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
    this.gotoSacCodes();
  }

  clearForm() {
    this.formData.reset();
  }
  gotoSacCodes() {
    this.router.navigate([NAVIGATE_TO_DISPLAY_SAC_CODE], {
      state: {
        statePageSize: this.statePageSize,
        statePageIndex: this.statePageIndex,
      },
    });
  }

  ngAfterViewInit() {
    this.autoResizeSacCodeDesc();
  }

  autoResizeSacCodeDesc() {
    const textarea = this.sacCodeTextarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
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
