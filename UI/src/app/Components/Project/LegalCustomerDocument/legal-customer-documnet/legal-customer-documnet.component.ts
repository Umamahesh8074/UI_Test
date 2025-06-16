import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  OnInit,
  Output,
ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IProject, Project } from 'src/app/Models/Project/project';

import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LeadsCommonService } from 'src/app/Services/CommanService/leads-common.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';

@Component({
  selector: 'app-legal-customer-documnet',
  templateUrl: './legal-customer-documnet.component.html',
  styleUrls: ['./legal-customer-documnet.component.css']
})
export class LegalCustomerDocumnetComponent {

  destroy$ = new Subject<void>();
  
  formData: any;

  organizationId: number = 0;
  
  user: User = new User();
   projects: Project[] = [];
  project: FormControl = new FormControl('');
   
    projectName: string = '';
    projectId: number = 0;
 
  // file selection propertiesF
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;

  isCheckBoxChecked = false;
  ngOnInit(): void {
    this.setUserFromLocalStorage();
    this.initializeForm();
    this.fetchProjects();

  }

  constructor(
    private builder: FormBuilder,
    private router: Router,
    
    //@Inject(MAT_DIALOG_DATA) public data: any,
    private commanService: CommanService,
    private commonService: CommanService,
    private leadCommonService: LeadsCommonService,
    private projectService: ProjectService,
    private leadservice:LeadService,
    private loaderService: LoaderService  ) {}

  private initializeForm(): void {
    this.formData = this.builder.group({
      referanceId: [0],
      documentName: [''],
 
      createdBy:[this.user.userId],
      isVisibleToCrmTeam:[]
    });
  }

  //getting logged in user data from local storage
  private setUserFromLocalStorage(): void {
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      this.user = user;
    }
  }


  private patchFormWithProjectData(): void {
    // console.log(this.projectData);
    // this.formData.patchValue(this.projectData);
    // const phoneNumber = this.projectData.phoneNumber?.trim() || '';
    // console.log(this.projectData.phoneNumber);
    // console.log(phoneNumber);
    // if (phoneNumber) {
    //   const phoneParts = phoneNumber.match(/^(\+\d{1,3})\s*(\d+)$/);
    //   if (phoneParts) {
    //     const countryCode = phoneParts[1]?.trim();
    //     this.countryCode = countryCode;
    //     const phoneNumber = phoneParts[2].trim();
    //     console.log(countryCode);
    //     console.log(phoneNumber);
    //     this.formData.patchValue({
    //       ...this.projectData,
    //       phoneNumber: phoneNumber ?? '',
    //       countryCode: countryCode ?? '',
    //     });
    //   }
    // }
    // console.log(this.formData.value);
  }




 
  isAdding: boolean = true;

  clearForm() {
    this.formData.reset();
  }

  goBack() {
    this.router.navigate(['layout/legalcustomerdocument']);
  }



  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log('Selected file:', this.selectedFile);
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
  
  save(): void {
    this.showLoading()
    this.formData.patchValue({isVisibleToCrmTeam:this.isCheckBoxChecked})
    let formDataCopy = { ...this.formData.value };
      if (this.isAdding) {
        
        this.projectService.addCustomerLegalDocument(formDataCopy, this.selectedFile).subscribe({
          next: (response) => {
            this.goBack()
            //this.handleSuccessResponse(response);
          },
          error: (error) => {
            console.error('Error saving lead budget:', error);
            //this.handleErrorResponse(error);
          },
        });
      } else {
        this.projectService.addCustomerLegalDocument(formDataCopy,this.selectedFile).subscribe({
          next: (response) => {
           // this.handleSuccessResponse(response);
          },
          error: (error) => {
            console.error('Error updating lead budget:', error);
            //this.handleErrorResponse(error);
          },
        });
      }
    
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

  fetchProjects() {
    this.leadservice
      .fetchProjects(this.projectName, this.user.organizationId)
      .subscribe({
        next: (projects) => {
          console.log(projects);
          this.projects = projects;
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
 onProjectSelect(event: any) {
    console.log(event.option.value);
    this.projectId = event.option.value.projectId;
    this.formData.patchValue({ referanceId: this.projectId });
    
    
    //  this.projectService.getSalesAggrementTemplateByProjectI()
   
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }

  onCheckBoxChecked(event: any) {
    this.isCheckBoxChecked = event.checked;
  }

    private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
}
