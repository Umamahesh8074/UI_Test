import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, of, Subject, takeUntil } from 'rxjs';
import { IProject, Project } from 'src/app/Models/Project/project';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { vendorService } from 'src/app/Services/WorkOrderService/Vendor Data/vendor.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { IVendor, Vendor } from 'src/app/Models/WorkOrder/VendorData';
import {
  NAVIGATE_TO_DISPLAY_VENDOR,
  VENDOR_TYPE,
} from 'src/app/Constants/WorkOrder/workorder';
import {
  CommonReferenceDetails,
  ICommonReferenceDetails,
} from 'src/app/Models/User/CommonReferenceDetails';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';
import { DocumentSharedService } from 'src/app/Apis/SharedServices/DocumnetSharedService';
import { MatDialog } from '@angular/material/dialog';
import { DocumentComponent } from 'src/app/Comman-Components/Dialog/documentmodel/document.component';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import {
  PAGE_INDEX,
  pageSizeOptions,
  TOTAL_ITEMS,
} from 'src/app/Constants/CommanConstants/Comman';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css'],
})
export class AddvendorComponent implements OnInit {
  vendor: IVendor = new Vendor();
  isAdding: boolean | undefined = true;
  private destroy$ = new Subject<void>();
  formData!: FormGroup;
  statePageSize: number = 0;
  statePageIndex: number = 0;
  selectedFileName: string | null = null;
  showAdditionalFields: any[] = [];
  selectedFiles: File[] | undefined;
  documents: any;
  vendorDocuments: any;
  vendorId: number = 0;
  documentType: string = 'VENDOR_DOCUMENTS';
  isFormSubmitted = false;
  @ViewChild('address1Textarea') address1Textarea!: ElementRef;
  @ViewChild('address2Textarea') address2Textarea!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  organizationId: number = 0;
  projectId: number = 0;
  projectName: string = '';
  projects: Project[] = [];
  project: any = new FormControl([] as IProject[]);
  selectedProject: IProject = new Project();

  //vendor auto complete
  vendorType: string = '';
  vendorTypes: ICommonReferenceDetails[] = [];
  vendorTypeId: number = 0;
  typeVendor: any = new FormControl([] as ICommonReferenceDetails[]);
  selectedVendorType: ICommonReferenceDetails = new CommonReferenceDetails();

  //documents pagination
  documentTotalItems: number = TOTAL_ITEMS;
  documentPageSize: number = 15;
  documentPageIndex: number = PAGE_INDEX;
  documentPageSizeOptions = pageSizeOptions;

  ngOnInit(): void {
    this.initializeFormData();
    this.setUserFromLocalStorage();
    this.getDataFromState();
    this.fetchProjects();
    this.fetchVendorTypes();
    this.loadDocuments();
  }

  constructor(
    private router: Router,
    private vendorService: vendorService,
    private commanService: CommanService,
    private builder: FormBuilder,
    private projectService: ProjectService,
    private toastrService: ToastrService,
    public dialog: MatDialog,
    private commonRefDetailsService: CommonreferencedetailsService,
    private documentService: DocumentSharedService,
    private loaderService: LoaderService
  ) {}

  //getting user from local storage to set organization id
  private setUserFromLocalStorage(): void {
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      this.organizationId = user.organizationId;
    }
  }

  //initialize form data
  private initializeFormData(): void {
    this.formData = this.builder.group({
      id: [0],
      orgId: [this.organizationId],
      dateOfJoining: [],
      projectId: [, Validators.required],
      vendorCode: [''],
      vendorName: ['', Validators.required],
      vendorTypeId: ['', Validators.required],
      companyName: [''],
      permanentAddress: [''],
      presentAddress: [''],
      contactNumber: [
        '',
        [Validators.required, Validators.pattern(/^[6789]\d{9}$/)],
      ],
      email: [''],
      gstNumber: [''],
      panNumber: [''],
      aadharNumber: [''],
      msmeNumber: [''],
      bocwLicenseNumber: [''],
      bankName: [''],
      ifscCode: [''],
      accountNumber: [],
      msmeExists: ['', Validators.required],
    });
  }

  onMsmeExistsChange(msmeExists: boolean): void {
    // this.showMsmeNumber = msmeExists;
    const msmeNumberControl = this.formData.get('msmeNumber');
    if (msmeExists) {
      // Add required validator when "Yes" is selected
      msmeNumberControl?.setValidators([Validators.required]);
    } else {
      // Remove all validators when "No" is selected
      msmeNumberControl?.clearValidators();
    }
    msmeNumberControl?.updateValueAndValidity();
  }

  private getDataFromState() {
    const { vendor, isAdding, statePageSize, statePageIndex } = history.state;
    this.isAdding = isAdding;
    this.statePageSize = statePageSize;
    this.statePageIndex = statePageIndex;
    if (vendor) {
      this.vendor = vendor;
      this.vendorId = vendor.id;
      if (this.vendorId > 0) {
        this.getDocumentsBasedOnId();
      }
      if (!this.isAdding) {
        this.patchFormDataWithVendorData();
      }
    }
  }

  private patchFormDataWithVendorData() {
    if (this.vendor.projectId) {
      this.fetchProject(this.vendor.projectId);
    }
    if (this.vendor.vendorTypeId) {
      this.fetchVendorType(this.vendor.vendorTypeId);
    }
    if (this.vendor && this.vendor.msmeNumber) {
      this.formData.patchValue({ msmeExists: true });
    } else {
      this.formData.patchValue({ msmeExists: false });
    }
    this.formData.patchValue(this.vendor);
  }

  private fetchProject(projectId: number): void {
    this.projectService
      .getProjectById(projectId)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          this.toastrService.error('Error fetching project', error.message);
          return of(new Project());
        })
      )
      .subscribe((project) => {
        this.selectedProject = project;
        this.formData.patchValue({ projectId: project.projectId });
      });
  }

  onProjectSelect(event: any) {
    this.projectId = event.option.value.projectId;
    this.formData.patchValue({ projectId: this.projectId });
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }

  searchProject(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.projectName = query;
      this.fetchProjects();
    } else if (query.length == 0) {
      this.projectName = '';
      this.fetchProjects();
    }
  }

  //fetch projects based on organization id
  fetchProjects() {
    this.projectService
      .getProjectsByOrgIdWithProjectFilter(
        this.organizationId,
        '',
        this.projectName
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (projects) => {
          this.projects = projects;
        },
        error: (error: Error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  getDocumentsBasedOnId() {
    this.commanService
      .getDocumentById(
        this.vendorId,
        this.documentType,
        this.documentPageIndex,
        this.documentPageSize
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.vendorDocuments = response;
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  onVendorTypeSelect(event: any) {
    this.vendorTypeId = event.option.value.id;
    this.formData.patchValue({ vendorTypeId: this.vendorTypeId });
  }

  displayVendorType(vendorType: any) {
    return vendorType && vendorType.commonRefValue
      ? vendorType.commonRefValue
      : '';
  }

  searchVendorType(event: any) {
    const query = event.target.value;
    if (query.length >= 3) {
      this.vendorType = query;
      this.fetchVendorTypes();
    } else if (query.length == 0) {
      this.vendorType = '';
      this.fetchVendorTypes();
    }
  }

  fetchVendorTypes() {
    this.commanService
      .getCommanReferanceDetailsWithFilters(VENDOR_TYPE, this.vendorType)
      .subscribe({
        next: (vendorTypes) => {
          this.vendorTypes = vendorTypes;
        },
        error: (error: any) => {
          console.error('Error fetching vendor types:', error);
        },
      });
  }

  fetchVendorType(vendorTypeId: number) {
    this.commonRefDetailsService
      .getById(vendorTypeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (vendorType) => {
          this.selectedVendorType = vendorType;
          this.formData.patchValue({ vendorTypeId: vendorType.id });
        },
        error: (error: Error) => {
          console.log('Error fetching vendor type', error);
        },
      });
  }

  save() {
    this.isFormSubmitted = true;
    const formData = new FormData();
    const vendorData = this.formData.value;
    const documents = this.documents;

    this.selectedFiles = this.getDocumentsArray(documents);

    if (this.selectedFiles.length === 0) {
      formData.append(
        'files',
        new File([''], '', {
          type: '',
        })
      ); //
    } else {
      this.selectedFiles.forEach((file) => {
        formData.append('files', file);
      });
    }

    formData.append('vendor', JSON.stringify(vendorData));
    const saveOrUpdate$ = this.isAdding
      ? this.vendorService.addvendor(formData)
      : this.vendorService.updatevendor(formData);

    if (this.formData.valid) {
      this.showLoading();
      saveOrUpdate$.subscribe({
        next: (response) => {
          this.handleSuccessResponse(response), this.hideLoading();
        },
        error: (error) => {
          this.handleErrorResponse(error);
          this.hideLoading();
        },
      });
    } else {
      this.logFormErrors();
    }
  }

  getDocumentsArray(
    documents: { documentName: string; documentPath: File; file: any }[]
  ): File[] {
    const filesArray: File[] = [];
    documents.forEach((document) => {
      const { documentName, documentPath } = document;
      if (documentPath) {
        const originalFileName = document.file;
        const extension = originalFileName.substring(
          originalFileName.lastIndexOf('.')
        );
        const newFileName = `${documentName}${extension}`;
        const newFile = new File([documentPath], newFileName, {
          type: documentPath.type,
        });
        filesArray.push(newFile);
      }
    });
    return filesArray;
  }

  handleSuccessResponse(response: any): void {
    this.toastrService.success('', response.message, {
      timeOut: 3000,
    });
    this.gotoVendors();
  }

  handleErrorResponse(error: any): void {
    this.toastrService.error('', error.error.message, {
      timeOut: 3000,
    });
    this.gotoVendors();
  }

  clearForm(): void {
    this.formData.reset();
  }

  gotoVendors() {
    this.router.navigate([NAVIGATE_TO_DISPLAY_VENDOR], {
      state: {
        statePageSize: this.statePageSize,
        statePageIndex: this.statePageIndex,
      },
    });
  }

  viewDownLoads() {
    const dialogRef = this.dialog.open(DocumentComponent, {
      width: '60%',
      height: '500px',
      data: {
        documents: this.vendorDocuments,
        isAdding: this.isAdding,
        documentType: this.documentType,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.loadDocuments();
    });
  }

  loadDocuments() {
    const uploadedDocuments = this.documentService.getDocuments();
    this.documents = uploadedDocuments;
  }

  logFormErrors(): void {
    Object.keys(this.formData.controls).forEach((key) => {
      const controlErrors = this.formData.get(key)?.errors;
      if (controlErrors) {
        console.error(`Error in ${key}:`, controlErrors);
      }
    });
  }

  ngAfterViewInit() {
    this.autoResizeAddress1();
    this.autoResizeAddress2();
  }
  autoResizeAddress1() {
    const textarea = this.address1Textarea.nativeElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

  autoResizeAddress2() {
    const textarea = this.address2Textarea.nativeElement;
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
