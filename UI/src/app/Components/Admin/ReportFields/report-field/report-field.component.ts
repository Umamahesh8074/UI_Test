import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { COMMON_STATUS } from 'src/app/Constants/CommanConstants/Comman';
import {
  IReportField,
  ReportFields,
} from 'src/app/Models/CommanModel/ReportField';
import { IReports, Reports } from 'src/app/Models/CommanModel/Reports';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ReportFieldsService } from 'src/app/Services/CommanService/report-fields.service';
import { ReportService } from 'src/app/Services/CommanService/report.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-report-field',
  templateUrl: './report-field.component.html',
  styleUrls: ['./report-field.component.css'],
})
export class ReportFieldComponent implements OnInit, OnDestroy {
  statuses: CommonReferenceType[] = [];
  formData!: FormGroup;
  reportField: IReportField = new ReportFields();
  reports: IReports[] = [];
  reportFieldId: number = 0;
  errorMessage: string | null = null;

  isAdding: boolean = true; // Assuming this flag controls whether you're adding or editing an item
  saveOrUpdateSubscription: Subscription = new Subscription();
  commonReferenceTypesSubscription: Subscription = new Subscription();
  getAllReportsSubscription: Subscription = new Subscription();
  constructor(
    private builder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private reportService: ReportService,
    private reportFieldService: ReportFieldsService,
    private commonReferenceDetailsService: CommanService,
    private toastrService: ToastrService
  ) {
    this.createFormBuilder();
  }

  ngOnInit(): void {
    this.setReportFromHistoryState();
    this.getCommonStatuses();
    this.initializeForm();
    this.getAllReports();
  }

  ngOnDestroy(): void {
    console.log('cleared data ngOnDestroy');
    this.saveOrUpdateSubscription.unsubscribe();
    this.commonReferenceTypesSubscription.unsubscribe();
    this.getAllReportsSubscription.unsubscribe();
  }
  //need to use it instead of getting reportField data as state , get reportFieldId based on that get reportField
  getReport() {
    this.reportFieldService.getReportFieldById(this.reportFieldId).subscribe({
      next: (data) => {
        console.log(data);
        this.reportField = data;
        console.log(this.reportField);
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  private createFormBuilder(): void {
    this.formData = this.builder.group({
      fieldName: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }
  private initializeForm(): void {
    this.formData = this.builder.group({
      fieldName: [this.reportField.fieldName, [Validators.required]],
      status: [this.reportField.status],
      reportId: [this.reportField.reportId, [Validators.required]],
    });
  }

  private setReportFromHistoryState(): void {
    if (history.state.reportField != null) {
      this.reportField = history.state.reportField;
      this.isAdding = false;
    }
  }

  submitForm(): void {
    if (this.formData.valid) {
      const formDataValue = this.formData.value;
      this.reportField.fieldName = formDataValue.fieldName;
      if (!this.isAdding) {
        this.reportField.status = formDataValue.status;
      }
      this.reportField.reportId = formDataValue.reportId;

      const saveOrUpdateObservable = this.isAdding
        ? this.reportFieldService.addReportField(this.reportField)
        : this.reportFieldService.updateReport(this.reportField); // Assuming you have an update method

      this.saveOrUpdateSubscription = saveOrUpdateObservable.subscribe({
        next: (resp) => {
          //TODO need to add alert like Tost or Dialog box
          this.router.navigate(['./report/fields'], {
            relativeTo: this.route.parent,
          });
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

  gotoItemCategory() {
    this.router.navigate(['./report/fields'], {
      relativeTo: this.route.parent,
    });
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
      (status) => status.commonRefKey === this.reportField?.status
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
  getAllReports() {
    console.log(this.isAdding);
    this.getAllReportsSubscription = this.reportService
      .fetchAllReports(this.isAdding)
      .subscribe({
        next: (data) => {
          console.log(data);

          this.reports = data;

          this.setDefaultReport();
        },
        error: (error) => {
          console.error(error?.message);
        },
      });
  }
  setDefaultReport() {
    const defaultStatus = this.reports.find(
      (report) => report.reportId === this.reportField?.reportId
    );
    if (defaultStatus) {
      this.formData.patchValue({ reportId: defaultStatus.reportId });
    }
  }
  reportValue(e: any) {
    if (e.value === '') {
      this.formData.get('reportId')?.setErrors({ required: true });
    } else if (e.value === null) {
      this.formData.get('reportId')?.setErrors({ required: true });
    } else {
      this.formData.get('reportId')?.setErrors(null);
    }
  }
}
