import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { COMPANY_TYPE } from 'src/app/Constants/CommanConstants/Comman';
import { IProject, Project, ProjectDetails } from 'src/app/Models/Project/project';
import {
  SalesAggrementTemplate,
  SalesAgreementTemplateFieldsDto,
} from 'src/app/Models/Project/salesAggrementTemplate';
import { User } from 'src/app/Models/User/User';
import { ClientCustomerconsumptionService } from 'src/app/Services/ClientCustomerconsumption/clientcustomerconsumption.service';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addsaleaggrementtemplatefields',
  templateUrl: './addsaleaggrementtemplatefields.component.html',
  styleUrls: ['./addsaleaggrementtemplatefields.component.css'],
})
export class AddsaleaggrementtemplatefieldsComponent {
  constructor(
    private router: Router,
    private leadService: LeadService,
    private builder: FormBuilder,
    private projectService: ProjectService,
    private clientcustomerconsumptionService: ClientCustomerconsumptionService,
    private commonService:CommanService
  ) {}
  private destroy$ = new Subject<void>();

  showAdditionalFields: any[] = [];
  formData!: FormGroup;
  errorMessage: string | null = null;
  isView = false;
  projects: Project[] = [];
  templates: SalesAggrementTemplate[] = [];
  projectName: string = '';
  projectId: number = 0;
  isAdding: boolean = true;
  user: User = new User();
  organizationId: number = 0;
  selectedTemplateId: number = 0;
  fieldName: string = '';
  project: FormControl = new FormControl('');
  projectDetailsId:number =0 
  companyType: any;
  companyTypeId:number=0
  projectDetails:ProjectDetails=new ProjectDetails();
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
      projectId: [0],
      salesAggrementTemplateId: [0],

      salesAggrementTemplateFields: this.builder.array([
        this.createSalesAggrementTemplateFields(),
      ]),
    });
  }
  onTemplateSelect(event: any): void {
    // Get the selected template ID
    const selectedTemplateId = event.value;

    // Patch the selected template ID to the formData
    this.formData.patchValue({
      salesAggrementTemplateId: selectedTemplateId,
    });

    console.log('Selected Template ID:', selectedTemplateId);
  }

  // createSalesAggrementTemplateFields(): FormGroup {
  //   return this.builder.group({
  //     fieldName: new FormControl(''),
  //   });
  // }
  generatePlaceholder(fieldName: any): string {
    console.log('Generating placeholder for:', fieldName); // Log the field name
    if (fieldName) {
      return `Enter ${fieldName.replace(/([A-Z])/g, ' $1').trim()}`; // Format camelCase to space-separated
    }
    return ''; // Default placeholder if no field name is provided
  }

  createSalesAggrementTemplateFields(
    templateField: string = 'defaultFieldName'
  ): FormGroup {
    const formGroup = this.builder.group({
      fieldName: new FormControl(templateField),
      isMandatory: new FormControl(false),
      placeholder: new FormControl(this.generatePlaceholder(templateField)),
      validationMessage: new FormControl(''),
    });

    // Watch for changes in 'fieldName' and update the placeholder dynamically
    formGroup.get('fieldName')?.valueChanges.subscribe((fieldName) => {
      const placeholder = this.generatePlaceholder(fieldName);
      formGroup.get('placeholder')?.setValue(placeholder);
    });

    return formGroup;
  }

  isMandatoryField(item: AbstractControl): boolean {
    const formGroup = item as FormGroup; // Cast to FormGroup
    const isMandatoryControl = formGroup.get('isMandatory');
    return isMandatoryControl ? isMandatoryControl.value === true : false;
  }

  get salesAggrementTemplateFields(): FormArray {
    return this.formData.get('salesAggrementTemplateFields') as FormArray;
  }
  addItems(): void {
    const newFieldName = ''; // The new field name could be set dynamically based on input
    this.showAdditionalFields.push({
      fieldName: newFieldName,
    });

    const indentItemsArray = this.formData.get(
      'salesAggrementTemplateFields'
    ) as FormArray;
    indentItemsArray.push(
      this.createSalesAggrementTemplateFields(newFieldName)
    );
  }

  removeIcons(index: any) {
    if (this.showAdditionalFields.length > 1) {
      this.showAdditionalFields.splice(index, 1);
      const indentItemsArray = this.formData.get(
        'salesAggrementTemplateFields'
      ) as FormArray;
      indentItemsArray.removeAt(index);
    } else {
      console.log('item should be at least one');
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
    this.leadService
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

  fetchProjectDetails() {
    this.projectService
      .getProjectDetailsByProjectAndType(this.projectId, this.companyTypeId)
      .subscribe({
        next: (ProjectDetails) => {
          console.log(ProjectDetails);
          this.projectDetails = ProjectDetails;
          this.projectDetailsId=this.projectDetails.id
          this.getTemplates(this.projectId,this.projectDetailsId)
        },
        error: (error) => {
          console.error('Error fetching projectsdetails:', error);
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
    this.formData.patchValue({ projectId: this.projectId });
    //  this.projectService.getSalesAggrementTemplateByProjectI()
    // this.getTemplates(this.projectId,this.projectDetailsId);
  }

  displayProject(project: IProject): string {
    return project && project.projectName ? project.projectName : '';
  }
  getTemplates(projectId: number,projectDetailsId:number) {
    this.projectService
      .getSalesAggrementTemplateByProjectI(projectId,projectDetailsId)
      .subscribe({
        next: (templates) => {
          this.templates = templates;
          console.log(templates);
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  // onTemplateSelect(templateId: number) {
  //   this.formData.patchValue({
  //     salesAggrementTemplateId: templateId
  //   });
  // }
  save(): void {
    const formValue = this.formData.value;

    // Prepare the payload including the placeholder for each field
    const payload: SalesAgreementTemplateFieldsDto = {
      salesAgreementTemplateFields: formValue.salesAggrementTemplateFields.map(
        (item: any) => ({
          templateFields: item.fieldName,
          isMandatory: item.isMandatory,
          validationMessage: item.validationMessage,
          projectId: formValue.projectId,
          projectTemplateId: formValue.salesAggrementTemplateId,
          placeholder: item.placeholder, // Ensure placeholder is included
        })
      ),
    };

    console.log(payload);

    // Proceed to save data
    if (this.isAdding) {
      this.projectService
        .addSalesAggrementTemplateFields(payload)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            Swal.fire({
              title: 'Success!',
              text: 'Fields have been saved successfully.',
              icon: 'success',
              confirmButtonText: 'OK',
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: 'Something went wrong while saving fields.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          },
        });
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
      onUnitTypeBelongsChange(event: any) {
    console.log(event);
    this.companyTypeId = event.value.id;
    console.log(this.companyTypeId);
    this.fetchProjectDetails()
      }

  clearForm(): void {
    this.formData.reset();
  }
}
