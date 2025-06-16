import { AfterContentInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { COMMON_STATUS } from 'src/app/Constants/CommanConstants/Comman';
import { IReports, Reports } from 'src/app/Models/CommanModel/Reports';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { ReportService } from 'src/app/Services/CommanService/report.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
})
export class ReportsComponent implements OnInit, OnDestroy {
  statuses: CommonReferenceType[] = [];
  formData!: FormGroup;
  report: IReports = new Reports();
  reportId: number = 0;
  errorMessage: string | null = null;
  isAdding: boolean = true; // Assuming this flag controls whether you're adding or editing an item
  saveOrUpdateSubscription: Subscription = new Subscription();
  commonReferenceTypesSubscription: Subscription = new Subscription();
  constructor(
    private builder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private reportService: ReportService,
    private commonReferenceDetailsService: CommanService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.createFormBuilder();
    this.setReporFromHistoryState();

    this.initializeForm();
    this.getCommonStatuses();
  }

  ngOnDestroy(): void {
    console.log('cleared data ngOnDestroy');
    this.saveOrUpdateSubscription.unsubscribe();
    this.commonReferenceTypesSubscription.unsubscribe();
  }

  //need to use it instead of getting report data as state , get report id based on that get report
  getReport() {
    this.reportService.getReportById(this.reportId).subscribe({
      next: (data) => {
        console.log(data);
        this.report = data;
        console.log(this.report);
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  private setReporFromHistoryState(): void {
    if (history.state.report != null) {
      this.report = history.state.report;
      this.isAdding = false;
    }
  }
  private createFormBuilder(): void {
    this.formData = this.builder.group({
      reportName: ['', [Validators.required]],
      status: ['', [Validators.required]],
    });
  }
  private initializeForm(): void {
    this.formData = this.builder.group({
      reportName: [this.report.reportName, [Validators.required]],
      status: [this.report.status],
    });
  }

  submitForm(): void {
    if (this.formData.valid) {
      const formDataValue = this.formData.value;
      this.report.reportName = formDataValue.reportName;
      if (!this.isAdding) {
        this.report.status = formDataValue.status;
      }

      const saveOrUpdateObservable = this.isAdding
        ? this.reportService.addReport(this.report)
        : this.reportService.updateReport(this.report); // Assuming you have an update method

      this.saveOrUpdateSubscription = saveOrUpdateObservable.subscribe({
        next: (resp) => {
          //TODO need to add alert like Tost or Dialog box
          this.router.navigate(['./reports'], {
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

  clearForm() {
    this.formData.reset();
    Object.keys(this.formData.controls).forEach((key) => {
      this.formData.controls[key].markAsTouched(); // Mark each field as touched to trigger error messages
    });
  }

  gotoItemCategory() {
    this.router.navigate(['./reports'], {
      relativeTo: this.route.parent,
    });
  }
  private handleError(err: any): void {
    console.error('Error saving/updating menu:', err.error.message);
    this.toastrService.error('Failed', err.error.message, {
      timeOut: 3000, // Set success timeout
    });

  }

  getCommonStatuses() {
    this.commonReferenceTypesSubscription = this.commonReferenceDetailsService
      .fetchCommonReferenceTypes(COMMON_STATUS)
      .subscribe({
        next: (data) => {
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
      (status) => status.commonRefKey === this.report?.status
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
}
