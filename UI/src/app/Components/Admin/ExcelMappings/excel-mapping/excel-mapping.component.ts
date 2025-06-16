import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { COMMON_STATUS } from 'src/app/Constants/CommanConstants/Comman';
import {
  ExcelMapping,
  IExcelMapping,
} from 'src/app/Models/CommanModel/excelMapping';
import { IReportField } from 'src/app/Models/CommanModel/ReportField';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ExcelMappingService } from 'src/app/Services/CommanService/excel-mapping.service';
import { ReportFieldsService } from 'src/app/Services/CommanService/report-fields.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-excel-mapping',
  templateUrl: './excel-mapping.component.html',
  styleUrls: ['./excel-mapping.component.css'],
})
export class ExcelMappingComponent implements OnInit, OnDestroy {
  statuses: CommonReferenceType[] = [];
  formData!: FormGroup;
  excelMapping: IExcelMapping = new ExcelMapping();
  reportFields: IReportField[] = [];
  excelMappingId: number = 0;
  errorMessage: string | null = null;
  isAdding: boolean = true; // Assuming this flag controls whether you're adding or editing an item
  saveOrUpdateSubscription: Subscription = new Subscription();
  commonReferenceTypesSubscription: Subscription = new Subscription();
  getAllReportsSubscription: Subscription = new Subscription();
  constructor(
    private builder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private excelMappingService: ExcelMappingService,
    private reportFieldService: ReportFieldsService,
    private commonReferenceDetailsService: CommanService,
    private toastrService: ToastrService
  ) {
    // this.createFormBuilder();
  }

  ngOnInit(): void {
    this.setReportFromHistoryState();
    this.getCommonStatuses();
    this.initializeForm();
    this.getAllReportFields();
  }

  ngOnDestroy(): void {
    console.log('cleared data ngOnDestroy');
    this.saveOrUpdateSubscription.unsubscribe();
    this.commonReferenceTypesSubscription.unsubscribe();
    this.getAllReportsSubscription.unsubscribe();
  }
  //need to use it instead of getting reportField data as state , get reportFieldId based on that get reportField
  getExcelMapping() {
    this.excelMappingService
      .getExcelMappingById(this.excelMappingId)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.excelMapping = data;
          console.log(this.excelMapping);
        },
        error: (error) => {
          console.error(error?.message);
        },
      });
  }

  // private createFormBuilder(): void {
  //   this.formData = this.builder.group({
  //     status: ['', [Validators.required]],
  //     expectedHeader: ['', [Validators.required]],
  //   });
  // }
  private initializeForm(): void {
    this.formData = this.builder.group({
      fieldId: [this.excelMapping.fieldId, [Validators.required]],
      status: [this.excelMapping.status],
      expectedHeader: [this.excelMapping.expectedHeader, [Validators.required]],
    });
  }

  private setReportFromHistoryState(): void {
    if (history.state.excelMapping != null) {
      this.excelMapping = history.state.excelMapping;
      this.isAdding = false;
    }
  }

  // submitForm(): void {
  //   if (this.formData.valid) {
  //     const formDataValue = this.formData.value;
  //     this.excelMapping.expectedHeader = formDataValue.expectedHeader;
  //     if (!this.isAdding) {
  //       this.excelMapping.status = formDataValue.status;
  //     }
  //     this.excelMapping.fieldId = formDataValue.fieldId;

  //     const saveOrUpdateObservable = this.isAdding
  //       ? this.excelMappingService.addExcelMapping(this.excelMapping)
  //       : this.excelMappingService.updateExcelMapping(this.excelMapping); // Assuming you have an update method

  //     this.saveOrUpdateSubscription = saveOrUpdateObservable.subscribe({
  //       next: (resp) => {
  //         //TODO need to add alert like Tost or Dialog box
  //         this.router.navigate(['/layout/excel/mappings']);
  //       },
  //       error: (err) => {
  //         console.error('Error while adding/editing Report', err.message);
  //         // You can display error messages to the user here
  //       },
  //     });
  //   } else {
  //     console.error('Form is invalid');
  //     // You can display error messages to the user here
  //     Object.keys(this.formData.controls).forEach((key) => {
  //       this.formData.controls[key].markAsTouched(); // Mark each field as touched to trigger error messages
  //     });
  //   }
  // }
  submitForm(): void {
    if (
      this.formData.valid &&
      this.formData.dirty &&
      this.formData.value.fieldId
    ) {
      const formDataValue = this.formData.value;
      this.excelMapping.expectedHeader = formDataValue.expectedHeader;
      if (!this.isAdding) {
        this.excelMapping.status = formDataValue.status;
      }
      this.excelMapping.fieldId = formDataValue.fieldId;

      const saveOrUpdateObservable = this.isAdding
        ? this.excelMappingService.addExcelMapping(this.excelMapping)
        : this.excelMappingService.updateExcelMapping(this.excelMapping); // Assuming you have an update method

      this.saveOrUpdateSubscription = saveOrUpdateObservable.subscribe({
        next: (resp) => {
          //TODO need to add alert like Tost or Dialog box
          this.router.navigate(['/layout/excel/mappings']);
        },
        error: (err) => {
          console.error('Error adding Menu Item:', err);
          this.handleError(err);  // Handle the error
      },
      });
    } else {
      console.error('Form is invalid');
      // You can display error messages to the user here
      Object.keys(this.formData.controls).forEach((key) => {
        this.formData.controls[key].markAsTouched(); // Mark each field as touched to trigger error messages
      });
      if (!this.formData.value.fieldId) {
        this.formData.get('fieldId')?.setErrors({ required: true });
      }
      if (!this.formData.dirty && !this.isAdding) {
        Swal.fire({
          icon: 'info',
          text: 'No changes are detected in page !',
          timerProgressBar: true,
          timer: 2000,
        });
      }
    }
  }
  private handleError(err: any): void {
    console.error('Error saving/updating menu:', err.error.message);
    this.toastrService.error('Failed', err.error.message, {
      timeOut: 3000, // Set success timeout
    });

  }
  clearForm() {
    this.formData.reset();
  }

  gotoExcelMappings() {
    this.router.navigate(['/layout/excel/mappings']);
  }

  getCommonStatuses() {
    this.commonReferenceTypesSubscription = this.commonReferenceDetailsService
      .fetchCommonReferenceTypes(COMMON_STATUS)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.statuses = data;
          this.setDefaultStatus();
        },
        error: (error) => {
          console.error(error?.message);
        },
      });
  }
  setDefaultStatus() {
    const defaultStatus = this.statuses.find(
      (status) => status.commonRefKey === this.excelMapping?.status
    );
    if (defaultStatus) {
      this.formData.patchValue({ status: defaultStatus.commonRefKey });
    }
  }
  statusValue(e: any) {
    if (e.value === '') {
      this.formData.get('status')?.setErrors({ required: true });
    } else {
      this.formData.get('status')?.setErrors(null);
    }
  }
  getAllReportFields() {
    this.getAllReportsSubscription = this.reportFieldService
      .fetchAllReportFields(this.isAdding)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.reportFields = data;
          this.setDefaultReportField();
        },
        error: (error) => {
          console.error(error?.message);
        },
      });
  }
  setDefaultReportField() {
    const defaultStatus = this.reportFields.find(
      (reportField) => reportField.fieldId === this.excelMapping?.fieldId
    );
    if (defaultStatus) {
      this.formData.patchValue({ reportId: defaultStatus.reportId });
    }
  }
  reportFieldValue(e: any) {
    if (e.value === '') {
      this.formData.get('fieldId')?.setErrors({ required: true });
    } else {
      this.formData.get('fieldId')?.setErrors(null);
    }
  }
  
}
