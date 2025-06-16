import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import {
  COMMON_STATUS,
  TIME_OUT,
} from 'src/app/Constants/CommanConstants/Comman';
import { NAVIGATE_TO_DISPLAY_WORK_ORDER_HEADER } from 'src/app/Constants/WorkOrder/workorder';
import {
  IWorkOrderHeader,
  WorkOrderHeader,
} from 'src/app/Models/WorkOrder/WorkOrderHeader';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { WorkOrderHeaderService } from 'src/app/Services/WorkOrderService/WorkOrderHeader/WorkOrderHeader.service';

@Component({
  selector: 'work-order-header',
  templateUrl: './work-order-header.component.html',
  styleUrls: ['./work-order-header.component.css'],
})
export class WorkOrderHeaderComponent implements OnInit {
  workOrderHeaderData: IWorkOrderHeader = new WorkOrderHeader();
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  formData!: FormGroup;
  organizationId: number = 0;
  statuses: any;
  @ViewChild('headerTextarea') headerTextarea!: ElementRef;
  statePageSize: number = 0;
  statePageIndex: number = 0;

  ngOnInit(): void {
    this.initializeFormData();
    this.setUserFromLocalStorage();
    this.getDataFromState();
    this.getCommonStatuses();
  }

  constructor(
    private router: Router,
    private workOrderHeaderService: WorkOrderHeaderService,
    private builder: FormBuilder,
    private commonService: CommanService,
    private toastrService: ToastrService,
    private loaderService: LoaderService
  ) {}

  private initializeFormData(): void {
    this.formData = this.builder.group({
      id: [0],
      headerName: ['', Validators.required],
      headerTermsAndConditions: ['', Validators.required],
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
    const { workOrderHeaderData, isAdding, statePageSize, statePageIndex } =
      history.state;
    this.isAdding = isAdding;
    this.statePageSize = statePageSize;
    this.statePageIndex = statePageIndex;
    this.workOrderHeaderData = workOrderHeaderData || this.workOrderHeaderData;
    if (!this.isAdding) {
      this.patchFormDataWithWorkOrderHeader();
    }
  }

  private patchFormDataWithWorkOrderHeader() {
    this.formData.patchValue(this.workOrderHeaderData);
  }

  save() {
    if (this.formData.valid) {
      this.showLoading();
      const saveOrUpdate$ = this.isAdding
        ? this.workOrderHeaderService.addWorkOrder(this.formData.value)
        : this.workOrderHeaderService.updateWorkOrder(this.formData.value);
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
    this.gotoWorkOrderHeaders();
  }
  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: TIME_OUT,
    });
    this.gotoWorkOrderHeaders();
  }

  clearForm() {
    this.formData.reset();
  }
  gotoWorkOrderHeaders() {
    this.router.navigate([NAVIGATE_TO_DISPLAY_WORK_ORDER_HEADER], {
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

  ngAfterViewInit() {
    this.autoResizeHeaderName();
  }

  autoResizeHeaderName() {
    const textarea = this.headerTextarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
