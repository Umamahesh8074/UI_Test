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
import { Subject, takeUntil } from 'rxjs';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { ChannelPartnerRegisterService } from 'src/app/Services/Presales/CPRegisterService/channel-partner-register.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-channel-patner-register',
  templateUrl: './channel-patner-register.component.html',
  styleUrls: ['./channel-patner-register.component.css'],
})
export class ChannelPatnerRegisterComponent implements OnInit {
  @ViewChild('ownerPanCardFileInput') ownerPanCardFileInput!: ElementRef;
  @ViewChild('reraFileInput') reraFileInput!: ElementRef;
  @ViewChild('ownerAadharFileInput') ownerAadharFileInput!: ElementRef;
  @ViewChild('personAadharFileInput') personAadharFileInput!: ElementRef;
  @ViewChild('gstCertificateFileInput') gstCertificateFileInput!: ElementRef;
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
  fileNames: any = {
    ownerPanCard: null,
    rera: null,
    ownerAadhar: null,
    personAadhar: null,
    gst: null,
  };
  fileErrors: any = {
    ownerPanCard: null,
    rera: null,
    ownerAadhar: null,
    personAadhar: null,
    gst: null,
  };
  isFromNewChannelPartner: any;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private cpService: ChannelPartnerRegisterService,
    private loaderService: LoaderService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Check if data is passed for editing
    const data = history.state.channelPartnerData;
    this.isToggled = true;
    if (data) {
      this.isAdding = false;
      this.patchFormData(data);
    }
  }

  private initForm(): void {
    this.formData = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[6789]\d{9}$/)],
      ],
      password: [''],
      officeNumber: ['', Validators.required],
      address: [''],
      companyName: ['', Validators.required],
      companyWebsite: [''],
      registeredDate: [new Date()],
      dateOfBirth: [],
      idProofs: [[]],
      idProofNumber: [''],
      showAdditionalFields: [false],
      personName: [''],
      personPhoneNumber: [''],
      personemail: [''],
      designation: [''],
      aadharUrl: [''],
      panUrl: [''],
      reraUrl: [''],
      personUrl: [''],
      pageUrl: [''],
      alternatePhoneNumber: [''],
      aadharNumber: [''],
      panNumber: [''],
      //reraExpDate:[Validators.required, this.dateNotInPastValidator()],
      reraNumber: [''],
      gstNumber: [''],
      reraExpDate: [],
      gstCertificateUrl: [''],
      // isToggled: [],
      isCallSupportAvailable: ['Y'],
      status: [],
      bulkUploadLimit: [],
      isCanBulkUpload: [],
    });
  }

  private patchFormData(data: any): void {
    if (data.length > 0) {
      console.log(data[0]);
      const formValue = { ...data[0] };
      this.formData.patchValue(data[0]);

      formValue.reraUrl = this.renameFile(
        data[0].reraUrl,
        'channelpartner',
        'reraUrl'
      );
      formValue.aadharUrl = this.renameFile(
        data[0].aadharUrl,
        'channelpartner',
        'aadharUrl'
      );
      formValue.panUrl = this.renameFile(
        data[0].panUrl,
        'channelpartner',
        'panUrl'
      );
      formValue.gstCertificateUrl = this.renameFile(
        data[0].gstCertificateUrl,
        'channelpartner',
        'gstCertificateUrl'
      );

      formValue.personUrl = this.renameFile(
        data[0].personUrl,
        'channelpartner',
        'personUrl'
      );
      // formValue.panUrl = this.renameFile(data[0].panUrl, 'employee', 'panCard'); // if needed

      this.formData.patchValue(formValue);
      this.formData.get('companyName')?.disable();
      // this.employeeBasicDetails.value.panUrl = this.renameFile(
      //   this.employeeBasicDetails.value.panUrl,
      //   'employee',
      //   'panCard'
      // );
      // this.fileNames.ownerPanCard = data.ownerPanCardUrl || null;
      // this.fileNames.rera = data.reraUrl || null;
      // this.fileNames.ownerAadhar = data.ownerAadharUrl || null;
      // this.fileNames.personAadhar = data.personAadharUrl || null;
      // this.fileNames.gst = data.gstUrl || null;
    }
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
  onGstCertificateFileChange(event: Event): void {
    this.handleFileChange(event, 'gstCertificate');
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
      } else if (
        !['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)
      ) {
        // Allowed types
        this.fileErrors[key] = 'Only JPEG, PNG and PDF files are allowed.';
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

  save(): void {
    const files = this.getFilesObject();

    if (this.isAdding && !this.validateRequiredFiles(files)) {
      this.showFileErrors(files);
      return;
    }

    if (this.formData.valid) {
      // Copy form data to avoid modifying the original form data object
      // const formData = { ...this.formData.value };
      const formData = { ...this.formData.getRawValue() };
      this.isFromNewChannelPartner = false;
      formData.isFromNewChannelPartner = this.isFromNewChannelPartner;

      const filesToSend: {
        ownerPanCard: File | null;
        rera: File | null;
        ownerAadhar: File | null;
        personAadhar: File | null;
        gstCertificate: File | null;
      } = {
        ownerPanCard: files['ownerPanCard'],
        rera: files['rera'],
        ownerAadhar: files['ownerAadhar'],
        personAadhar: files['personAadhar'],
        gstCertificate: files['gstCertificate'],
      };

      if (this.isAdding) {
        console.log(files);
        console.log('files ' + filesToSend);
        this.showLoading();
        this.cpService
          .registerChannelPartner(formData, filesToSend)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              console.log(response.message);
              this.hideLoading();
              Swal.fire('Success', response.message, 'success');
              this.router.navigate(['layout/presales/cp/register']);
            },
            error: (err) => {
              console.log(err);
              const errorMessage = err.error.error;
              console.log('Error:', errorMessage);
              this.hideLoading();
              if (err.status === 409) {
                Swal.fire('Failed', errorMessage, 'error');
                this.router.navigate(['layout/presales/cp/register']);
              }
            },
          });
      } else {
        console.log(filesToSend);
        this.showLoading();
        this.cpService
          .updateChannelPartner(formData, filesToSend)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res) => {
              console.log('Success' + res);
              this.hideLoading();
              Swal.fire(
                'Success',
                'Channel partner updated successfully',
                'success'
              );
              this.router.navigate(['layout/presales/cp/register']);
            },
            error: (err) => {
              console.log(err);
              this.hideLoading();
              Swal.fire('Error', 'Failed to update channel partner', 'error');
            },
          });
      }
    } else {
      Swal.fire(
        'Validation Error',
        'Please fill in all required fields.',
        'warning'
      );
    }
  }

  getFilesObject(): { [key: string]: File | null } {
    return {
      ownerPanCard:
        this.ownerPanCardFileInput?.nativeElement?.files?.length > 0
          ? this.ownerPanCardFileInput.nativeElement.files[0]
          : null,
      rera:
        this.reraFileInput?.nativeElement?.files?.length > 0
          ? this.reraFileInput.nativeElement.files[0]
          : null,
      ownerAadhar:
        this.ownerAadharFileInput?.nativeElement?.files?.length > 0
          ? this.ownerAadharFileInput.nativeElement.files[0]
          : null,
      personAadhar:
        this.personAadharFileInput?.nativeElement?.files?.length > 0
          ? this.personAadharFileInput.nativeElement.files[0]
          : null,
      gstCertificate:
        this.gstCertificateFileInput?.nativeElement?.files?.length > 0
          ? this.gstCertificateFileInput.nativeElement.files[0]
          : null,
    };
  }
  validateRequiredFiles(files: { [key: string]: File | null }): boolean {
    // Ensure required files are present for adding, not for updating
    // if (this.isAdding) {
    //   return files['rera'] !== null && files['gstCertificate'] !== null;
    // }
    // Ensure required files are present for adding, not for updating
    if (this.isAdding) {
      return files['rera'] !== null;
    }
    return true; // For updates, any files are optional
  }
  showFileErrors(files: { [key: string]: File | null }): void {
    if (this.isAdding) {
      if (!files['rera']) {
        this.fileErrors.rera = 'RERA file is required.';
        this.reraFileInput.nativeElement.required = true;
      } else {
        this.fileErrors.rera = null;
        this.reraFileInput.nativeElement.required = false;
      }
      // if (!files['gstCertificate']) {
      //   this.fileErrors.gst = 'GST file is required.';
      // } else {
      //   this.fileErrors.gst = null;
      // }
    } else {
      this.fileErrors.rera = null;
      this.fileErrors.gst = null;
    }
  }

  handleError(err: any): string {
    return 'An error occurred. Please try again later.';
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
    this.router.navigate(['layout/presales/cp/register']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  // private requiredFileTypeValidator(): ValidatorFn {
  //   return (control: AbstractControl): { [key: string]: any } | null => {
  //     const file = control.value;
  //     if (!file) {
  //       return { required: true }; // No file selected
  //     }
  //     // Additional file type validation logic can be added here
  //     return null; // Validation passed
  //   };
  // }

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
  isToggled: boolean = false;

  onToggle(event: any) {
    this.isToggled = event.checked;
    console.log('Toggled state:', this.isToggled);
    if (this.isToggled === true) {
      this.formData.patchValue({ isCallSupportAvailable: 'Y' });
    } else {
      this.formData.patchValue({ isCallSupportAvailable: 'N' });
    }
    console.log(this.formData.get('isCallSupportAvailable')?.value);
  }
  renameFile(fileUrl: string, lastName: string, fileType: string): string {
    if (!fileUrl) return '';
    console.log(fileUrl);

    const fileNameWithExtension = fileUrl.split('/').pop()?.split('?')[0] || '';
    // const match = fileNameWithExtension.match(/(\w+\.pdf)/);
    console.log(fileNameWithExtension);

    const fileExtension = fileNameWithExtension.split('.').pop();
    const originalFileName = fileNameWithExtension.replace(/\.\w+$/, '');
    const newFileName = `${fileType}_${lastName}_${originalFileName}.${fileExtension}`;
    console.log(newFileName);

    return newFileName;
  }

  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
