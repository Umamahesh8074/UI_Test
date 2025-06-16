import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { pageSizeOptions } from 'src/app/Constants/CommanConstants/Comman';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { CustomerStagesPaymentsDto, FollowUpApplicantAndPaymentsDto } from 'src/app/Models/Customer/StagesAndPayments';
import { LeadFollowupDto } from 'src/app/Models/Presales/leadFollowup';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { CRMFollowupServiceService } from 'src/app/Services/CrmServices/crmfollowup-service.service';
import { PaymentDetailsService } from 'src/app/Services/CrmServices/payment-details.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crmfollowup',
  templateUrl: './crmfollowup.component.html',
  styleUrls: ['./crmfollowup.component.css'],
})
export class CRMFollowupComponent implements OnInit {
  projectFilterCtrl = new FormControl('');

  isAdding = true;
  followupForm!: FormGroup;
  followupStatusList: CommonReferenceType[] = [];
  // followup!: ILeadFollowup;

  private destroy$ = new Subject<void>();
  followups: LeadFollowupDto[] = [];
  isSalesTeamFollowUp: boolean = false;
  displayedColumns: string[] = [
    'rowNum',
    'createdDate',
    'followupDate',
    'stage',
    'status',
    // 'subStatus',
    // 'type',

    'createdBy',
    'remarks',
  ];
  followupStatusType: string = 'CRM_Followup_Status';
  totalItems: number = 0;
  pageSize: number = 20;
  pageIndex: number = 0;
  pageSizeOptions = pageSizeOptions;
  time: string = '12:00';
  maxDate = new Date();
  minDate!: Date;
  custName: string = '';
  applicantId: number = 0;
  stageId: number = 0;
  followUp: FollowUpApplicantAndPaymentsDto =
    new FollowUpApplicantAndPaymentsDto();
  applicantName: string = '';
  applicantPhNumber: number = 0;
  filterStageId: number = 0;
  filterBlockId: number = 0;
  filterPlanId: number = 0;
  isDisplayAddFollowup: boolean = true;
  paymentStatus: string = '';
  status:string='';
  typeId: number = 0;
  transActionTypeId: number = 0;
  phoneNumber: string = '';
  fristapplicantName: string = '';
  paymentStatusId: number[] = []; 
  ngOnInit(): void {
    this.initForm();
    this.initializeState();
    this.fetchFollowupStatusList();
  }
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private paymentDetailsService: PaymentDetailsService,
    private commonRefDetailService: CommonreferencedetailsService,
    private crmFollowupServiceService: CRMFollowupServiceService,
    private loaderService: LoaderService
  ) {}
  private initForm(): void {
    const currentTime = new Date();
    const hours24 = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const ampm = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12; // Convert '0' to '12'
    const currentTimeString = `${String(hours12).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')} ${ampm}`;
    this.followupForm = this.formBuilder.group({
      id: [0],
      applicantId: [this.applicantId, Validators.required],
      followupDate: [new Date(), Validators.required],
      followupTime: [
        currentTimeString,
        [
          Validators.required,
          this.timeValidator(currentTimeString, new Date()),
        ],
      ],
      followupType: [''],
      typeId: [0],
      statusId: [0, Validators.required],
      remarks: ['', Validators.required],
      subStatusId: [0],
      stageId: [0],
    });

    // if (!this.isAdding && this.followup) {
    //   this.followupForm.patchValue(this.followup);
    //   // this.patchFormWithFollowupData();
    // } else {
    //this.minDate = new Date();
    this.minDate = new Date(new Date().setMonth(this.maxDate.getMonth() - 2));
    // }
  }
  onPageChange(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.fetchFollowups();
  }
  clearForm(): void {
    this.followupForm.reset();
  }
  onChange() {
    const timeControl = this.followupForm.get('followupTime');
    const dateControl = this.followupForm.get('followupDate');
    const selectedDate = dateControl?.value;

    if (timeControl) {
      timeControl.updateValueAndValidity();
    } else if (dateControl) {
      dateControl.updateValueAndValidity();
    }
  }

  save() {
    console.log(this.followupForm.value);
    if (this.followupForm.value.statusId <= 0) {
      this.followupForm
        .get('statusId')
        ?.setErrors({ lessThanOrEqualToZero: true });
    }

    this.followupForm.patchValue({
      applicantId: this.applicantId,
      stageId: this.stageId,
    });

    if (this.followupForm.valid) {
      const formData = this.followupForm.value;
      // Parse and combine date and time
      const followupDateTime = new Date(formData.followupDate);
      const timeParts = formData.followupTime.split(':');
      let hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);

      // Adjust hours based on AM/PM
      const isPM = formData.followupTime.includes('PM');
      if (isPM && hours !== 12) {
        hours += 12; // Convert PM hour to 24-hour format
      } else if (!isPM && hours === 12) {
        hours = 0; // Convert 12 AM to 0 hours
      }

      followupDateTime.setHours(hours);
      followupDateTime.setMinutes(minutes);

      // Format the combined date and time
      formData.followupDate = this.formatDateTime(followupDateTime);
      console.log(formData);
      this.showLoading();
      this.crmFollowupServiceService.save(formData).subscribe({
        next: (response) => {
          this.hideLoading();
          this.handleSuccessResponse(response);
          this.fetchFollowups();
          this.clearForm();
        },
        error: (error) => {
          this.hideLoading();
          console.error('Error fetching applicant info:', error);
          this.handleErrorResponse(error);
        },
      });
    } else {
      this.followupForm.markAllAsTouched();
      Object.keys(this.followupForm.controls).forEach((field) => {
        const control = this.followupForm.get(field);
        if (control && control.invalid) {
          console.log(`Invalid field: ${field}`, control.errors);
        }
      });
    }
  }

  gotoPayments() {
    const state = {
      phoneNumber: this.applicantPhNumber,
      filterBlockId: this.filterBlockId,
      filterPlanId: this.filterPlanId,
      filterStageId: this.filterStageId,
      fristapplicantName:this.fristapplicantName,
      typeId: this.typeId,
      paymentTransactionTypeId: this.transActionTypeId, 
      paymentStatusValue:this.paymentStatusId,

    };
    this.router.navigate(['/layout/crm/paymentdetails'], { state: state });
  }
  initializeState() {
    console.log(history.state);
    const stateData = history.state;
    this.applicantId = stateData.applicantId;
    this.stageId = stateData.stageId;
    this.applicantPhNumber = stateData.phoneNumber;
    this.filterBlockId = stateData.filterBlockId;
    this.filterPlanId = stateData.filterPlanId;
    this.filterStageId = stateData.filterStageId;
    this.paymentStatus = stateData.paymentStatus;
    this.status=stateData.status
    
    if (this.paymentStatus.toLowerCase() === 'completed' || this.status==='I') {
      this.isDisplayAddFollowup = false;
    }
    this.followupForm.patchValue({
      stageId: this.stageId,
      applicantId: this.applicantId,
    });
    if (history.state.typeId > 0) {
      this.typeId = history.state.typeId;
    }
    if (history.state.transActionTypeId) {
      this.transActionTypeId = history.state.transActionTypeId;
    }
    if (history.state.phoneNumber) {
      this.phoneNumber = history.state.phoneNumber;
    }
    if (history.state.fristapplicantName) {
     this.fristapplicantName=history.state.fristapplicantName;
    }
    const values = history.state.paymentStatusValue;
    console.log(history.state.paymentStatusValue);
    
    if (values != null) {
      this.paymentStatusId = values.map((val: any) => val.id);
    }

    this.fetchApplicantDetails();
    this.fetchFollowups();
  }

  private fetchFollowupStatusList(): void {
    this.commonRefDetailService
      .fetchCommomRefDetailsByType(this.followupStatusType)
      .subscribe({
        next: (status: any) => {
          this.followupStatusList = status;
        },
        error: (error) => console.log(error),
      });
  }

  timeValidator(currentTime: string, currentDate: Date): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (!control.value) return null;

      const selectedDate = control.parent?.get('followupDate')?.value;
      const selectedTime = control.value;

      // If selected date is greater than current date, allow any time
      if (new Date(selectedDate) > currentDate) {
        return null;
      }

      // Extract time parts
      const currentTimeParts = currentTime.match(/(\d+):(\d+) (AM|PM)/);
      const selectedTimeParts = selectedTime.match(/(\d+):(\d+) (AM|PM)/);

      if (!currentTimeParts || !selectedTimeParts) return null;

      const currentHours =
        (+currentTimeParts[1] % 12) + (currentTimeParts[3] === 'PM' ? 12 : 0);
      const currentMinutes = +currentTimeParts[2];

      const selectedHours =
        (+selectedTimeParts[1] % 12) + (selectedTimeParts[3] === 'PM' ? 12 : 0);
      const selectedMinutes = +selectedTimeParts[2];

      // Validate the time only if the selected date is the same as the current date
      if (
        new Date(selectedDate).toDateString() === currentDate.toDateString()
      ) {
        if (
          selectedHours < currentHours ||
          (selectedHours === currentHours && selectedMinutes < currentMinutes)
        ) {
          return { timeInvalid: true };
        }
      }

      return null;
    };
  }

  fetchApplicantDetails() {
    if (this.applicantId) {
      this.paymentDetailsService
        .getFollowUpPayments(this.applicantId, this.stageId)
        .subscribe({
          next: (data) => {
            this.followUp = data;
          },
          error: (error) => {
            console.error('Error fetching applicant info:', error);
          },
        });
    }
  }

  fetchFollowups() {
    this.crmFollowupServiceService
      .fetchAll(
        this.pageIndex,
        this.pageSize,
        this.applicantId,
        this.applicantName,
        this.stageId
      )
      .subscribe({
        next: (response) => {
          this.followups = response.records;
          this.totalItems = response.totalRecords;
        },
        error: (error) => {
          console.error('Error fetching applicant info:', error);
        },
      });
  }

  handleSuccessResponse(response: any): void {
    Swal.fire({
      title: 'Success!',
      text: response.message || 'Followup added successfully.',
      icon: 'success',
      confirmButtonText: 'OK',
    });
  }

  handleErrorResponse(response: any): void {
    Swal.fire({
      title: 'Error!',
      text: response.error?.message || 'An error occurred. Please try again.',
      icon: 'error',
      confirmButtonText: 'Close',
    });
  }

  showLoading() {
    this.loaderService.show();
  }

  hideLoading() {
    this.loaderService.hide();
  }

  formatDateTime(date: Date): string {
    return formatDate(date, 'yyyy-MM-ddTHH:mm:ss.SSSSSS', 'en-IN');
  }
}
