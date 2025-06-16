import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { isBefore } from 'date-fns';
import { Subject, take, takeUntil } from 'rxjs';
import {
  ChannelPartnerRegisterBean,
  IChannelPartnerRegisterBean,
} from 'src/app/Models/Presales/channelPartner';
import { ChannelPartnerRegisterService } from 'src/app/Services/Presales/CPRegisterService/channel-partner-register.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-channel-patner-approval',
  templateUrl: './edit-channel-patner-approval.component.html',
  styleUrls: ['./edit-channel-patner-approval.component.css'],
})
export class EditChannelPatnerApprovalComponent implements OnInit {
  @ViewChild('ownerPanCardFileInput') ownerPanCardFileInput!: ElementRef;
  @ViewChild('reraFileInput') reraFileInput!: ElementRef;
  @ViewChild('ownerAadharFileInput') ownerAadharFileInput!: ElementRef;
  @ViewChild('personAadharFileInput') personAadharFileInput!: ElementRef;
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<any>;
  destroy$ = new Subject<void>();
  isAdding: boolean = true;
  minDate: Date = new Date();
  formData!: FormGroup;
  idProof: string[] = [
    'Driving License',
    'Voters ID',
    'Passport',
    'Aadhar Card',
  ];
  channelPartner: IChannelPartnerRegisterBean =
    new ChannelPartnerRegisterBean();
  fileNames: any = {
    ownerPanCard: null,
    rera: null,
    ownerAadhar: null,
    personAadhar: null,
  };
  fileErrors: any = {
    ownerPanCard: null,
    rera: null,
    ownerAadhar: null,
    personAadhar: null,
  };
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cpService: ChannelPartnerRegisterService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Check if data is passed for editing
    const data = history.state.channelPartnerData;
    console.log(data);
    if (data) {
      this.isAdding = false;
      this.channelPartner = data;
      this.patchFormData(this.channelPartner);
    }
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      organisationName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: [''],
      officeNumber: [''],
      address: [''],
      companyName: [''],
      companyWebsite: [''],
      registeredDate: [null, Validators.required],
      dateOfBirth: [],
      idProofs: [[]],
      idProofNumber: [''],
      showAdditionalFields: [false],
      personName: [''],
      personPhoneNumber: [''],
      personemail: [''],
      designation: [''],
      pageUrl: [''],
      reraExpDate: [Validators.required, this.dateNotInPastValidator()],
      isCanBulkUpload: [false],
      bulkUploadLimit: [0],
    });
  }

  save(): void {
    if (this.formData.dirty) {
      console.log(this.formData.value);
      if (this.formData.value['isCanBulkUpload']) {
        console.log(this.formData.value['isCanBulkUpload']);
        this.channelPartner.isCanBulkUpload = 'Yes';
      } else {
        this.channelPartner.isCanBulkUpload = 'No';
      }
      if (this.formData.controls['bulkUploadLimit'].dirty) {
        this.channelPartner.bulkUploadLimit =
          this.formData.value['bulkUploadLimit'];
      }
      console.log('=========>' + JSON.stringify(this.channelPartner));
      this.cpService
        .updateApprovedChannelPartner(this.channelPartner)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log(response);

            Swal.fire(
              'Success',
              'Channel partner Updated successfully',
              'success'
            );
            this.router.navigate(['layout/presales/view/cp/approvals/VCP']);
          },

          error: (err) => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              text: 'No Changes Found !',
              timer: 2000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          },
        });
    } else {
      Swal.fire({
        icon: 'info',
        text: 'No Changes Found !',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
    }
  }

  private patchFormData(data: ChannelPartnerRegisterBean): void {
    if (data) {
      // Convert 'Yes'/'No' to boolean
      const isCanBulkUpload = data.isCanBulkUpload === 'Yes';
      // console.log(JSON.stringify(data));
      // Prepare the data with the converted boolean value
      const patchedData = {
        ...data,
        isCanBulkUpload, // Include the converted value
      };
      // console.log('converted data = = = > ' + JSON.stringify(data));
      // Patch all the data into the form
      this.formData.patchValue(patchedData, { emitEvent: false });
    }
    console.log(this.formData.value);
  }

  onOwnerPanCardFileChange(event: Event): void {
    this.handleFileChange(event, 'ownerPanCard');
  }

  onReraChange(event: Event): void {
    this.handleFileChange(event, 'rera');
  }

  onOwnerAadharCardFileChange(event: Event): void {
    this.handleFileChange(event, 'ownerAadhar');
  }

  onPersonAadharFileChange(event: Event): void {
    this.handleFileChange(event, 'personAadhar');
  }

  handleFileChange(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;

    if (file) {
      console.log(`File selected for ${key}:`, file);

      // Validate file size and type
      if (file.size > 1 * 1024 * 1024) {
        // 5 MB limit
        this.fileErrors[key] = 'File size should not exceed 5 MB.';
      } else if (!['image/jpeg', 'image/png'].includes(file.type)) {
        // Allowed types
        this.fileErrors[key] = 'Only JPEG and PNG files are allowed.';
      } else {
        this.fileNames[key] = file.name;
        this.fileErrors[key] = null; // Clear any previous errors
      }
    } else {
      this.fileNames[key] = null;
      this.fileErrors[key] = 'No file selected.';
    }

    console.log(`File errors for ${key}:`, this.fileErrors[key]);
  }

  // Utility function to format date to 'YYYY-MM-DD'
  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  clearForm(): void {
    this.formData.reset();
    this.fileNames = {
      ownerPanCard: null,
      rera: null,
      ownerAadhar: null,
      personAadhar: null,
    };
    this.fileErrors = {
      ownerPanCard: null,
      rera: null,
      ownerAadhar: null,
      personAadhar: null,
    };
  }

  gotoCpRegister(): void {
    this.router.navigate(['layout/presales/view/cp/approvals/VCP']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  dateNotInPastValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedDate = control.value;
      const currentDate = new Date();

      // Check if the selected date is before the current date
      return selectedDate && isBefore(new Date(selectedDate), currentDate)
        ? { dateInPast: true }
        : null;
    };
  }

  getData() {
    console.log(this.formData.value);
  }
}
