import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { COMPANY_TYPE } from 'src/app/Constants/CommanConstants/Comman';
import { IProject, Project } from 'src/app/Models/Project/project';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { CommonreferencedetailsService } from 'src/app/Services/UserService/commonreferencedetails.service';

@Component({
  selector: 'app-addsalesaggrementtemplate',
  templateUrl: './addsalesaggrementtemplate.component.html',
  styleUrls: ['./addsalesaggrementtemplate.component.css'],
})
export class AddsalesaggrementtemplateComponent {
  constructor(
    private router: Router,
    private builder: FormBuilder,
    private leadService: LeadService,
    private projectService: ProjectService,
    private commonRefDetailsService: CommonreferencedetailsService,
    private commonService: CommanService,
    private loaderService:LoaderService
  ) {}
  private destroy$ = new Subject<void>();
  formData!: FormGroup;
  user: User = new User();
  organizationId = 0;
  selectedFiles: File[] = [];
  errorMessage: string | null = null;
  isView = false;
  projects: Project[] = [];
  projectName: string = '';
  projectId: number = 0;
  isAdding: boolean = true;
  project: FormControl = new FormControl('');
  fileTypeError: boolean = false;
  fileSizeDisplay: string = 'No file chosen';
  companyType: any;
  landOwnerOrBuilder: string = '';
  companyTypeId: number = 0;
  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      console.log(this.user.organizationId);
      console.log('ORG ID ' + this.organizationId);
    }
    this.initialize();
    this.fetchProjects();
    this.getCompanyTypes();
  }
  private initialize(): void {
    this.formData = this.builder.group({
      salesAgreementTemplateBean: this.builder.group({
        // Add your sales agreement fields here
        projectId: [''],
        salesAggrementTemplateName: [''],
        templateUrl: [''],
        status: ['A'],
        companyTypeId: [],

        // Add other fields as needed
      }),
    });
  }

  save() {
    console.log(this.formData.value);
    this.showLoading();

    if (this.isAdding) {
      console.log(this.selectedFiles);

      this.projectService
        .addSalesAggrementTemplate(this.formData.value, this.selectedFiles)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
             this.hideLoading()
            this.router.navigate(['layout/crm/displaysalesaggrementtemplate']);
            console.log(resp);
           
          },
          error: (err) => {
             this.hideLoading()
            console.error('Error adding leave request', err);
          },
        });
    } else {
      console.log(this.formData.value.projectId);
      // this.projectService.addSalesAggrementTemplate(this.formData.value,this.selectedFiles)
      // {
    }
  }
  clearForm() {}

  gotoTemplates() {
    this.router.navigate(['layout/crm/displaysalesaggrementtemplate']);
  }
  onSelect(event: any) {
    console.log(event);
  }
  searchProject(event: any) {
    if (event.target.value.length >= 3) {
      console.log(event.target.value);
      this.projectName = event.target.value;
      this.fetchProjects();
    } else {
      this.projectName = '';
      this.fetchProjects();
    }
  }
  getCompanyTypes() {
    this.commonService.fetchCommonReferenceTypes(COMPANY_TYPE).subscribe({
      next: (data) => {
        console.log(data);
        this.companyType = data;
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  fetchProjects() {
    this.leadService
      .fetchProjects(this.projectName, this.user.organizationId)
      .subscribe({
        next: (projects) => {
          console.log(this.projects);
          this.projects = projects;
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }

  // onProjectSelect(event: any) {
  //   console.log(event.option.value);
  //   this.projectId = event.option.value.projectId;
  //   this.formData.patchValue({ projectId: this.projectId });

  // }
  onProjectSelect(event: any) {
    console.log(event.option.value);
    this.projectId = event.option.value.projectId;

    // Update the nested form control correctly:
    this.formData
      .get('salesAgreementTemplateBean')
      ?.patchValue({ projectId: this.projectId });
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }
  fileName: string = 'No file selected'; // Stores the selected file's name
  // Flag for invalid file type
  customFileName: string = ''; // Stores the custom file name

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      // Assign the first selected file to this.selectedFiles
      const selectedFile = input.files[0];
      const allowedExtensions = ['doc', 'docx', 'xlsx', 'docm']; // Allowed file types
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

      if (allowedExtensions.includes(fileExtension!)) {
        this.fileName = selectedFile.name; // Set the selected file's name
        this.fileTypeError = false; // Reset error
        this.selectedFiles = [selectedFile]; // Assign selected file to the array
      } else {
        this.fileTypeError = true; // Set error flag
        this.fileName = 'No file selected'; // Reset file name
        this.selectedFiles = []; // Clear selected files
      }
    } else {
      this.fileName = 'No file selected'; // Reset file name
      this.selectedFiles = []; // Clear selected files
    }
  }

  onUnitTypeBelongsChange(event: any) {
    console.log(event);
    this.landOwnerOrBuilder = event.value.commonRefValue;
    this.companyTypeId = event.value.id;
    console.log(this.companyTypeId);
    this.formData
      .get('salesAgreementTemplateBean')
      ?.patchValue({ companyTypeId: this.companyTypeId });
  }
  uploadFiles(): void {
    if (this.selectedFiles.length === 0) {
      this.errorMessage = 'No files selected for upload.';
      return;
    }

    // const formData = new FormData();
    // this.selectedFiles.forEach((file) => {
    //   formData.append('files', file, file.name); // Append each selected file
    // });

    // console.log('Uploading file:', this.selectedFiles);
    // console.log('Custom file name:', this.customFileName);
  }

    private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
