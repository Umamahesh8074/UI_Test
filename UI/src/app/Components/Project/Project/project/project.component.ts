import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { COMMON_STATUS, COMMON_YES_NO } from 'src/app/Constants/CommanConstants/Comman';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { IProject, Project } from 'src/app/Models/Project/project';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LeadsCommonService } from 'src/app/Services/CommanService/leads-common.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  projectTypes: any[] = [];
  currencyTypes: any[] = [];
  projectStatus: any[] = [];
  projectData: IProject = new Project();
  destroy$ = new Subject<void>();
  isView = false;
  formData: any;
  countryCode: any;
  @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
  organizationId: number = 0;
  statuses: any;
  user: User = new User();
  @ViewChild('projectAddressTextarea') projectAddressTextarea!: ElementRef;
  @ViewChild('descriptionTextarea') descriptionTextarea!: ElementRef;
  countryCodes: CommonReferenceType[] = [];
  countryCodeType: string = 'Country_Code';
  filteredCountries: CommonReferenceType[] = this.countryCodes;
  // file selection properties
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
   yesNoOption:any=[]
  ngAfterViewInit() {
    this.autoResize();
    this.autoResizeDescription();
  }
  autoResize() {
    const textarea = this.projectAddressTextarea.nativeElement;
    textarea.style.height = 'auto'; // Reset height to auto to calculate new height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height based on scrollHeight
  }

  autoResizeDescription() {
    const textarea = this.descriptionTextarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.getCommonStatuses();
    this.fetchCountryCodes();
    this.initializeForm();
    this.getStateData();
    this.getCurrencyTypes();
    this.getProjectTypes();
    this.getProjectStatus();
    this.getCommonYesRNo();
  }

  constructor(
    private builder: FormBuilder,
    private router: Router,
    private projectService: ProjectService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commanService: CommanService,
    private commonService: CommanService,
    private leadCommonService: LeadsCommonService
  ) {}

  private initializeForm(): void {
    this.formData = this.builder.group({
      projectId: [],
      projectName: ['', Validators.required],
      projectCode: ['', Validators.required],
      projectAddress: ['', Validators.required],
      projectLocation: ['', Validators.required],
      currencyId: [],
      typeId: [],
      landArea: [
        '',
        [
          Validators.required,
          Validators.min(0),
          Validators.pattern('^[0-9]+(\\.[0-9]+)?$'), // Allows only numbers and decimals
        ],
      ],
      blocks: [],
      levels: [],
      noOfUnits: ['', [Validators.pattern('^[0-9]+$')]],
      description: [''],
      status: ['A', Validators.required],
      organizationId: [this.organizationId],
      projectStatus: [''],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^[6789]\d{9}$/)],
      ],
      countryCode: ['', Validators.required],
      email: [''],
      projectCity: [''],
      projectPincode: [''],
      projectGstinUin: [''],
      projectState: [''],
      projectPan: [''],
      companyName: [''],
      companyAddress: [''],
      ifscCode: [''],
      bankName: [''],
      bankAddress: [''],
      typeOfAccount: [''],
      accountNumber: [''],
      reraNumber: [''],
      displayProjectName: [''],
      displayProject:["Y"],
      projectOrder:[]
    });
  }

  //getting logged in user data from local storage
  private setUserFromLocalStorage(): void {
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      this.user = user;
    }
  }

  private getStateData() {
    console.log('hiiii');
    if (history.state.project != null && history.state.project != undefined) {
      console.log('hiiii');
      this.projectData = history.state.project;
      this.isAdding = false;
      this.isView = false;
      this.patchFormWithProjectData();
    }

    if (this.data.projectData != null) {
      console.log('allow');
      this.isView = this.data.send;
      console.log(this.isView);
      this.projectData = this.data.projectData;
      console.log(this.projectData);
      this.patchFormWithProjectData();
    }
  }

  private patchFormWithProjectData(): void {
    console.log(this.projectData);
    this.formData.patchValue(this.projectData);
    console.log(this.formData)
    const phoneNumber = this.projectData.phoneNumber?.trim() || '';
    console.log(this.projectData.phoneNumber);
    console.log(phoneNumber);
    if (phoneNumber) {
      const phoneParts = phoneNumber.match(/^(\+\d{1,3})\s*(\d+)$/);
      if (phoneParts) {
        const countryCode = phoneParts[1]?.trim();
        this.countryCode = countryCode;
        const phoneNumber = phoneParts[2].trim();
        console.log(countryCode);
        console.log(phoneNumber);
        this.formData.patchValue({
          ...this.projectData,
          phoneNumber: phoneNumber ?? '',
          countryCode: countryCode ?? '',
        });
      }
    }
    console.log(this.formData.value);
  }

  getCurrencyTypes() {
    const refType = 'Currency_Type';
    this.commanService
      .getRefDetailsByType(refType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (currencyTypesData: any) => {
          console.log(currencyTypesData);
          this.currencyTypes = currencyTypesData;
        },
        error: (error: Error) => {
          console.log('Error while fetching currency types', error);
        },
      });
  }

  getProjectTypes() {
    const refType = 'Project_Type';
    this.commanService
      .getRefDetailsByType(refType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (prjectTypesData: any) => {
          console.log(prjectTypesData);
          this.projectTypes = prjectTypesData;
        },
        error: (error: Error) => {
          console.log('Error while fetching projects', error);
        },
      });
  }

  getProjectStatus() {
    const refType = 'Project_Status';
    this.commanService
      .getRefDetailsByType(refType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (prjectStatusData: any) => {
          console.log(prjectStatusData);
          this.projectStatus = prjectStatusData;
        },
        error: (error: Error) => {
          console.log('Error while fetching projects', error);
        },
      });
  }
  isAdding: boolean = true;

  save() {
    // Update organizationId before form submission
    this.formData.patchValue({ organizationId: this.user.organizationId });

    // Check if the form is valid
    if (this.formData.valid) {
      let formDataCopy = { ...this.formData.value };

      // Format phone number with country code
      formDataCopy.phoneNumber = `${formDataCopy.countryCode} ${formDataCopy.phoneNumber}`;

      // Decide whether to add or update based on 'isAdding'
      const projectOperation$ =
        this.isAdding && this.user.organizationId !== undefined
          ? this.projectService.addProject(formDataCopy, this.selectedFile)
          : this.projectService.updateProject(formDataCopy, this.selectedFile);

      // Execute the observable and handle the response
      projectOperation$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (res) => {
          console.log(res);
          console.log(res.message);

          this.router.navigate(['layout/project/management/projects']);
          Swal.fire({
            icon: 'success',
            title: this.isAdding ? 'Project Added!' : 'Project Updated!',
            text: `The project has been successfully ${
              this.isAdding ? 'added' : 'updated'
            }.`,
            confirmButtonText: 'OK',
          }).then(() => {
            this.router.navigate(['layout/project/management/projects']);
          });
        },
        error: (err: any) => {
          console.log(err);
          const errorMessage = err?.error?.message || 'An error occurred';
          console.error('Error:', errorMessage);
          this.leadCommonService.handleErrorResponse(err);
        },
      });
    } else {
      // Handle invalid form fields (logging missing required fields)
      this.handleFormErrors();
    }
  }

  // A method to handle form validation errors
  private handleFormErrors(): void {
    Object.keys(this.formData.controls).forEach((key) => {
      const controlErrors = this.formData.get(key)?.errors;
      if (controlErrors?.['required']) {
        console.log(`${key} is required`);
      }
    });
  }

  clearForm() {
    this.formData.reset();
  }

  gotoProjects() {
    this.router.navigate(['layout/project/management/projects']);
  }

  // close dialog
  closeDialog() {
    this.onClose.emit();
  }

  getCommonStatuses() {
    this.commanService.fetchCommonReferenceTypes(COMMON_STATUS).subscribe({
      next: (data) => {
        this.statuses = data;
        console.log(data);
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  searchCountry(event: any) {
    const searchTerm = event.target.value.toLowerCase();

    // Filter countries based on the searchTerm
    const filteredCountries = this.countryCodes.filter(
      (country) =>
        country.commonRefValue.toLowerCase().includes(searchTerm) ||
        country.commonRefValue.toLowerCase().includes(searchTerm)
    );
    this.filteredCountries = filteredCountries;
    console.log(filteredCountries);
  }

  fetchCountryCodes() {
    //this.initForm();
    this.commonService.getRefDetailsByType(this.countryCodeType).subscribe({
      next: (countryCodes) => {
        console.log(countryCodes);
        this.countryCodes = countryCodes;
        const india = this.countryCodes.find(
          (country) => country.commonRefValue === 'India'
        );

        console.log(india);
        if (india && !this.countryCode) {
          this.formData.get('countryCode')?.setValue(india.commonRefKey);
        }

        this.filteredCountries = countryCodes;
      },
      error: (error) => {
        console.error('Error fetching lead types:', error);
      },
    });
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile);
    }
  }
  getCommonYesRNo() {
    this.commanService.fetchCommonReferenceTypes(COMMON_YES_NO).subscribe({
      next: (data) => {
        this.yesNoOption = data;
        console.log(data);
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }
}
