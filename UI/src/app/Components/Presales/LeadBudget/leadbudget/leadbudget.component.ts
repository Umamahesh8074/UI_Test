import { formatDate } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { ILeadBudget, LeadBudget } from 'src/app/Models/LeadBudget/leadBudget';
import { ILead, Lead } from 'src/app/Models/Presales/lead';
import { LeadSource } from 'src/app/Models/Presales/leadsource';
import { LeadSubSource } from 'src/app/Models/Presales/leadsubsource';
import { Project } from 'src/app/Models/Project/project';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LeadbudgetService } from 'src/app/Services/LeadBugetService/leadbudget.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';

@Component({
  selector: 'app-leadbudget',
  templateUrl: './leadbudget.component.html',
  styleUrls: ['./leadbudget.component.css'],
})
export class LeadbudgetComponent {
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<any>;
  formData!: any;
  sources: LeadSource[] = [];
  subSources: LeadSubSource[] = [];
  isAdding: boolean = true;
  leadBudget: ILeadBudget = new LeadBudget();

  destroy$ = new Subject<void>();
  organizationId: any;
  isSalesTeamLead: boolean = false;

  time: string = '12:00';
  minDate!: Date;
  constructor(
    private leadService: LeadService,
    private leadBudgetService: LeadbudgetService,
    private commonService: CommanService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.leadBudget = history.state.leadBudget;
    console.log(this.leadBudget);
    this.organizationId = history.state.organizationId;
    this.isAdding = !this.leadBudget;

    this.initForm();
    this.fetchLeadSources();
    if (!this.isAdding) {
      this.patchFormWithLeadData();
      // if (this.leadBudget.sourceId !== undefined) {
      //   this.fetchSubSources(this.leadBudget.sourceId);
      // }
    }
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      id: [0],
      sourceId: [0, Validators.required],
      paymentDate: ['', Validators.required],
      paymentTime: ['', Validators.required],
      organizationId: [this.organizationId, Validators.required],
      amount: ['', Validators.required],
    });
  }

  private patchFormWithLeadData(): void {
    this.formData.patchValue(this.leadBudget);
    this.patchFormWithPaymentData();
  }
  private patchFormWithPaymentData(): void {
    // Extract followup date
    const paymentDate = new Date(this.leadBudget.paymentDate);

    // Set minDate to a past date to allow updating past dates
    this.minDate = new Date(paymentDate.getFullYear() - 1, 0, 1); // For example, 1 year before the followup date

    // Extract date in YYYY-MM-DD format
    const date = paymentDate;

    // Extract time in 'h:mm AM/PM' format for Indian Standard Time
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    };
    const time = paymentDate.toLocaleString('en-IN', options); // e.g., '6:30 AM'

    // Patch the form with the extracted values
    this.formData.patchValue({
      ...this.formData,
      paymentDate: date,
      paymentTime: time,
    });
  }

  fetchLeadSources(): void {
    this.leadService.fetchLeadSources().subscribe({
      next: (sources: LeadSource[]) => {
        this.sources = sources;
      },
      error: (error: any) => {
        console.error('Error fetching lead sources:', error);
      },
    });
  }

  fetchSubSources(sourceId: number): void {
    // this.leadService.fetchLeadSubSources(sourceId).subscribe({
    //   next: (subSources) => {
    //     this.subSources = subSources;
    //   },
    //   error: (error) => {
    //     console.error('Error fetching lead sub-sources:', error);
    //   },
    // });
  }
  private handleErrorResponse(error: any): void {
    console.error('Error saving/updating lead:', error.error.message);
    this.toastrService.error('Failed', error.error.message, {
      timeOut: 3000, // Set success timeout
    });
    this.gotoLeadBudget();
  }
  private handleSuccessResponse(response: any): void {
    console.log('Success');

    this.toastrService.success('', response.message, {
      timeOut: 2000, // Set success timeout
    });
    this.gotoLeadBudget();
  }

  save(): void {
    console.log('save/update');
    console.log(this.isAdding);
    console.log(this.formData.value);
    if (this.formData.valid) {
      // Parse and combine date and time
      const followupDateTime = new Date(this.formData.value.paymentDate);
      console.log(this.formData.value.paymentDate);
      const timeParts = this.formData.value.paymentTime.split(':');
      let hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);

      // Adjust hours based on AM/PM
      const isPM = this.formData.value.paymentTime.includes('PM');
      if (isPM && hours !== 12) {
        hours += 12; // Convert PM hour to 24-hour format
      } else if (!isPM && hours === 12) {
        hours = 0; // Convert 12 AM to 0 hours
      }

      followupDateTime.setHours(hours);
      followupDateTime.setMinutes(minutes);

      // Format the combined date and time
      this.formData.value.paymentDate = this.formatDateTime(followupDateTime);
      console.log(this.formData);
      if (this.isAdding) {
        this.leadBudgetService.addLeadBudget(this.formData.value).subscribe({
          next: (response) => {
            this.handleSuccessResponse(response);
          },
          error: (error) => {
            console.error('Error saving lead budget:', error);
            this.handleErrorResponse(error);
          },
        });
      } else {
        this.leadBudgetService.updateLeadBudget(this.formData.value).subscribe({
          next: (response) => {
            this.handleSuccessResponse(response);
          },
          error: (error) => {
            console.error('Error updating lead budget:', error);
            this.handleErrorResponse(error);
          },
        });
      }
    }
  }

  gotoLeadBudget(): void {
    this.router.navigate(['layout/presales/leads/budget']);
  }

  clearForm(): void {
    this.formData.reset();
  }
  formatDateTime(date: Date): string {
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }
}
