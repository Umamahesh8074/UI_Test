import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  NAVIGATE_TO_DISPLAY_SALE_AGREEMENTS,
  USER_MANAGE_CRM,
  USER_MANAGE_TYPE,
} from 'src/app/Constants/Crm/CrmConstants';
import { SaleAgreementDto } from 'src/app/Models/Crm/PaymentDetails';
import { IProject, Project } from 'src/app/Models/Project/project';
import {
  GenerateSalesAggrementTemplateDto,
  SalesAggrementTemplate,
} from 'src/app/Models/Project/salesAggrementTemplate';
import { CommonReferenceType } from 'src/app/Models/User/CommonReferenceType';
import { User } from 'src/app/Models/User/User';
import { IUserManageDto } from 'src/app/Models/User/UserManage';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { LoaderService } from 'src/app/Services/CommanService/loader.service';
import { LeadService } from 'src/app/Services/Presales/Leads/lead.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { UnitService } from 'src/app/Services/ProjectService/Unit/unit.service';
import { UsermanageService } from 'src/app/Services/UserManageService/usermanage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-generatesalesaggrement',
  templateUrl: './generatesalesaggrement.component.html',
  styleUrls: ['./generatesalesaggrement.component.css'],
})
export class GeneratesalesaggrementComponent {
  constructor(
    private router: Router,
    private leadService: LeadService,
    private builder: FormBuilder,
    private projectService: ProjectService,
    private unitService: UnitService,
    private loaderService: LoaderService,
    private userManageService: UsermanageService,
    private commanService: CommanService
  ) {}
  private destroy$ = new Subject<void>();
  selectedProject: IProject = new Project();
  showAdditionalFields: any[] = [];
  formData!: FormGroup;
  errorMessage: string | null = null;
  isView = false;
  projects: IUserManageDto[] = [];
  templates: SalesAggrementTemplate[] = [];
  projectName: string = '';
  projectId: number = 0;
  unitId: number = 0;
  isAdding: boolean = true;
  user: User = new User();
  organizationId: number = 0;
  selectedTemplateId: number = 0;
  project: FormControl = new FormControl('');
  fieldValues: SaleAgreementDto[] = [];
  fields: any[] = [];
  fileType: string = '';
  unitName: string = '';
  projectDetailsId: number = 0;
  userId: number = 0;
  typeCommonReferenceDetailsId: number = 0;
  usermanageTypeCommonRefernce: any;

  ngOnInit(): void {
    this.setUserFromLocalStorage();
    const user = localStorage.getItem('user');
    if (user != null) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      console.log(this.user.organizationId);
      console.log('ORG ID ' + this.organizationId);
    }

    console.log('ID:', this.unitId);
    console.log('Project ID:', this.projectId);

    this.initialize();
    this.getUserManageTypes();
  }
  private setUserFromLocalStorage(): void {
    const user = this.commanService.getUserFromLocalStorage();
    if (user) {
      console.log(user.organizationId);
      this.organizationId = user.organizationId;
      this.userId = user.userId;
    }
  }
  private getDataFromState(): void {
    const state = history.state;
    const { id, projectId } = state;

    if (id && projectId) {
      this.unitId = id;
      this.projectId = projectId;
    }
    this.getUnitName(this.unitId);
    this.getProjectName(projectId);
  }
  private initialize(): void {
    // Initialize the form with static fields and a dynamic fields group
    this.formData = this.builder.group({
      project: new FormControl(''),
      salesAggrementTemplateId: new FormControl(''),
      flatNumber: [''], // Ensure validation if needed
      bookingId: [0],
      projectDetailsId: [0],
      dynamicFields: this.builder.group({}),
      // dynamicFields: this.builder.array([]),   // Group for dynamic fields
    });
  }

  onTemplateSelect(event: any): void {
    // Get the selected template ID
    const selectedTemplateId = event.value;
    this.selectedTemplateId = selectedTemplateId;

    // Patch the selected template ID to the formData
    this.formData.patchValue({
      salesAggrementTemplateId: selectedTemplateId,
    });
    this.getFields(this.projectId, selectedTemplateId);

    console.log('Selected Template ID:', selectedTemplateId);
  }

  createSalesAggrementTemplateFields(): FormGroup {
    return this.builder.group({
      fieldName: new FormControl(''),
    });
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
    this.userManageService
      .fetchProjectsBasedOnUserId(
        this.userId,
        this.typeCommonReferenceDetailsId
      )
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
    this.formData.patchValue({ projectId: this.projectId });
    //  this.projectService.getSalesAggrementTemplateByProjectI()
    this.getTemplates(this.projectId, this.projectDetailsId);
  }

  displayProject(project: Project): string {
    return project && project.projectName ? project.projectName : '';
  }
  getTemplates(projectId: number, projectDetailsId: number) {
    this.projectService
      .getSalesAggrementTemplateByProjectI(projectId, projectDetailsId)
      .subscribe({
        next: (templates) => {
          this.templates = templates;
          console.log(templates);
          this.onTemplateSelect({
            value: this.templates[0].salesAggrementTemplateId,
          });
        },
        error: (error) => {
          console.error('Error fetching projects:', error);
        },
      });
  }
  getUnitName(unitId: number): void {
    this.unitService.getUnitById(unitId).subscribe({
      next: (response) => {
        // Log the complete response to see the structure
        console.log('Response:', response);

        if (response && response.units && response.units.length > 0) {
          const unitName = response.units[0].unitName;
          const projectDetailsId = response.units[0].projectDetailsId;
          console.log('Unit Name:', unitName); // Log the unitName to ensure it is fetched correctly

          if (unitName) {
            // Patch the unitName to the flatNumber form control
            this.formData.patchValue({
              flatNumber: unitName,
              projectDetailsId: projectDetailsId,
            });

            // Log the form control value after patching
            console.log('Form value after patching:', this.formData.value);
            this.projectDetailsId = projectDetailsId;
            this.getTemplates(this.projectId, projectDetailsId);
          } else {
            console.warn('Unit name not found for the given ID.');
          }
        } else {
          console.warn('No units found in the response.');
        }
      },
      error: (error) => {
        console.error('Error fetching unit name:', error);
      },
    });
  }
  // Fetch the project name from the service
  getProjectName(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe({
      next: (data) => {
        this.selectedProject = data;
        console.log(data);
        this.formData.patchValue({ projectId: data.projectId });
      },
      error: (error) => {
        console.error('Error fetching project name:', error);
      },
    });
  }
  getFields(projectId: number, templateId: number) {
    this.projectService.getFieldsForTemplates(projectId, templateId).subscribe({
      next: (fields) => {
        this.fields = fields;
        const dynamicFieldsGroup = this.formData.get(
          'dynamicFields'
        ) as FormGroup;

        if (dynamicFieldsGroup) {
          fields.forEach((field: any) => {
            const fieldName = field.templateFields;

            // Process placeholder
            const placeholder =
              typeof field.placeholder === 'string' && field.placeholder.trim()
                ? field.placeholder
                : field.templateFields; // Fallback to fieldName if placeholder is null or empty

            // Convert isMandatory string to boolean
            const isMandatory = field.isMandatory === 'true'; // Convert string 'true' or 'false' to boolean

            // Process validation message and apply only if isMandatory is true
            const validationMessage =
              isMandatory && field.validationMessage
                ? field.validationMessage
                : ''; // Only apply validation message if isMandatory is true

            // Add the processed validation message to the field
            field.processedValidateMessage = validationMessage;

            // Add control to the form group if it doesn't exist
            const validators = isMandatory ? [Validators.required] : [];

            if (!dynamicFieldsGroup.contains(fieldName)) {
              dynamicFieldsGroup.addControl(
                fieldName,
                this.builder.control(field.defaultValue || '', validators)
              );
            }

            // Store processed placeholder for UI
            field.processedPlaceholder = placeholder;
          });
        }
      },
      error: (error) => {
        console.error('Error fetching fields:', error);
      },
    });
  }

  // clearForm() {
  //   this.formData.reset();

  // }

  getFlatDetails() {
    const flatNumber = this.formData.get('flatNumber')?.value;

    this.projectService
      .getValuesForFillingForm(this.projectId, flatNumber)
      .subscribe({
        next: (dtoList: any[]) => {
          console.log('Retrieved DTO List:', dtoList);
          this.fieldValues = dtoList;

          // Check if dtoList is valid
          if (!Array.isArray(dtoList) || dtoList.length === 0) {
            console.warn('No data received or invalid format.');
            return;
          }

          // Use the first object to patch values (adjust logic if needed)
          const firstRecord = dtoList[0];

          this.unitId = firstRecord.unitId; // Extract and store unitId
          this.unitName = firstRecord.unitName; // Extract and store unitId
          this.projectName = firstRecord.projectName;
          console.log('First Record to Patch:', firstRecord);

          // Access the dynamicFields FormGroup
          const dynamicFieldsGroup = this.formData.get(
            'dynamicFields'
          ) as FormGroup;
          console.log('Dynamic Fields Group:', dynamicFieldsGroup);

          // Iterate over 'fields' array to match and patch values
          this.fields.forEach((field) => {
            const fieldName = field.templateFields;

            // Check if the field exists in 'firstRecord'
            if (
              firstRecord.hasOwnProperty(fieldName) ||
              fieldName.includes('amount') ||
              fieldName.includes('payment')
            ) {
              const fieldControl = dynamicFieldsGroup.get(fieldName);

              if (fieldControl) {
                console.log(`Patching field: ${fieldName}`);

                if (
                  fieldName.includes('amount') ||
                  fieldName.includes('payment')
                ) {
                  // Extract the numeric index (e.g., 'amount1' -> 1, 'payment2' -> 2)
                  const index = this.extractIndexFromFieldName(fieldName);

                  if (index !== null && dtoList[index - 1]) {
                    const fieldNameWithoutIndex = fieldName.replace(/\d+$/, '');
                    const patchValue =
                      dtoList[index - 1][fieldNameWithoutIndex]; // Use the specific value from dtoList
                    console.log(
                      `Patching ${fieldNameWithoutIndex} with value from dtoList at index ${
                        index - 1
                      }: ${patchValue}`
                    );
                    fieldControl.patchValue(patchValue); // Patch the correct value
                  } else {
                    console.warn(
                      `No valid value found for ${fieldName} at index ${index}`
                    );
                  }
                } else {
                  // For all other fields, directly patch the value from firstRecord
                  const patchValue = firstRecord[fieldName];
                  console.log(
                    `Patching ${fieldName} with value from firstRecord: ${patchValue}`
                  );
                  fieldControl.patchValue(patchValue);
                }
              } else {
                console.warn(
                  `Field '${fieldName}' does not exist in dynamicFieldsGroup.`
                );
              }
            } else {
              console.warn(`Field '${fieldName}' is missing in firstRecord.`);
            }
          });
        },
        error: (error) => {
          console.error('Error fetching fields:', error);
        },
      });
  }

  // Helper function to extract the numeric index from a field name like 'amount1', 'payment2'
  private extractIndexFromFieldName(fieldName: string): number | null {
    const match = fieldName.match(/\d+$/); // Match digits at the end of the field name

    return match ? parseInt(match[0], 10) : null; // Return index or null if no number is found
  }

  get generateSalesAgreementItem(): FormArray {
    return this.formData.get('generateSalesAgreementItem') as FormArray;
  }
  addItems(): void {
    this.showAdditionalFields.push({
      templateFields: '',
      templateFieldsValues: '',
    });

    const indentItemsArray = this.formData.get(
      'generateSalesAgreementItem'
    ) as FormArray;
    indentItemsArray.push(this.createGenerateSalesAgreementItemGroup());
  }
  createGenerateSalesAgreementItemGroup(): FormGroup {
    return this.builder.group({
      templateFields: new FormControl(''),
      templateFieldsValues: new FormControl(''),
    });
  }

  addSalesAgreementItem(): void {
    // Create a new FormGroup for a sales agreement item
    const item = this.builder.group({
      projectId: [null], // Required field
      templateId: [null], // Required field
      templateFields: [null], // Optional field
      templateFieldsValues: [null], // Optional field
      unitId: [null],
      bookingId: [], // Required field
    });

    // Retrieve the FormArray from the form and add the new item
    const salesAgreementArray = this.formData.get(
      'generateSalesAgreementItem'
    ) as FormArray;
    salesAgreementArray.push(item);
  }
  generateData(): void {
    if (this.formData.valid) {
      const formValue = this.formData.value;

      // Prepare payload
      const payload: GenerateSalesAggrementTemplateDto = {
        generateSalesAgreement: Array.isArray(
          formValue.generateSalesAgreementItem
        )
          ? formValue.generateSalesAgreementItem.map((item: any) => ({
              projectId: item.projectId,
              templateId: item.templateId,
              templateFields: item.templateFields,
              templateFieldsValues: item.templateFieldsValues || '', // Ensure empty values are included
              flatNo: item.unitId,
              bookingId: item.bookingId,
            }))
          : [],
      };

      const dynamicFieldsGroup = this.formData.get(
        'dynamicFields'
      ) as FormGroup;

      // Add dynamic fields
      if (dynamicFieldsGroup) {
        this.fields.forEach((field) => {
          const controlValue =
            dynamicFieldsGroup.get(field.templateFields)?.value || '';
          payload.generateSalesAgreement.push({
            id: 0,
            projectId: this.projectId, // Use the selected project ID
            templateId: this.selectedTemplateId, // Use the selected template ID
            templateFields: field.templateFields, // Field name from the backend
            templateFieldsValues: controlValue, // Ensure empty values are included
            flatNo: this.fieldValues[0]?.unitId || 0,
            bookingId: this.fieldValues[0]?.bookingId || 0,
          });
        });
      }

      console.log('Generated Sales Agreement:', payload);

      // Submit to backend
      this.sendFormDataToBackend(payload);
    } else {
      console.error('Form is not valid');
    }
  }

  // Send the data to the backend (Assuming you have a service to handle the API call)
  // sendFormDataToBackend(data: any): void {
  //   this.projectService.submitSalesAgreement(data).subscribe({
  //     next: (response) => {
  //       Swal.fire({
  //         text: 'Sales Agreement Generated. Do you want to download it?',
  //         showCancelButton: true,
  //         confirmButtonText: 'Yes, download it!',
  //         cancelButtonText: 'No, thanks',z
  //         reverseButtons: true,
  //         customClass: {
  //           popup: 'small-popup',
  //         },
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           const fileURL = window.URL.createObjectURL(response);
  //           const link = document.createElement('a');
  //           link.href = fileURL;
  //           link.download =
  //             this.formData.get('flatNumber')?.value + 'Sales Agreement';
  //           link.click();
  //           window.URL.revokeObjectURL(fileURL);
  //         } else {
  //           console.log('Download canceled.');
  //         }
  //       });
  //     },
  //     error: (error) => {
  //       console.error('Error creating Sales Agreement:', error);
  //     },
  //   });
  // }

  // sendFormDataToBackend(data: any): void {
  //   this.projectService.submitSalesAgreement(data).subscribe({
  //     next: (response) => {
  //       Swal.fire({
  //         text: 'Sales Agreement Generated. Choose file format to download.',
  //         showDenyButton: true,
  //         showCancelButton: true,
  //         confirmButtonText: 'Download PDF',
  //         denyButtonText: 'No, Thanks',
  //         cancelButtonText: 'Download DOCX',
  //         reverseButtons: true,
  //         customClass: {
  //           popup: 'small-popup',
  //         },
  //       }).then((result) => {
  //         if (result.isConfirmed) {
  //           // Download PDF
  //           this.downloadSalesAgreement('pdf');
  //         } else if (result.isDenied) {
  //           // No, Thanks action
  //           console.log('User chose not to download the file.');
  //         } else if (result.dismiss === Swal.DismissReason.cancel) {
  //           // Download DOCX
  //           this.downloadSalesAgreement('docx');
  //         }
  //       });
  //     },
  //     error: (error) => {
  //       console.error('Error creating Sales Agreement:', error);
  //     },
  //   });
  // }

  sendFormDataToBackend(data: any): void {
    this.showLoading();
    console.log('sendFormDataToBackend called with data:', data);

    this.projectService.generateSalesAgreementExcel(data).subscribe({
      next: () => {
        console.log('Sales Agreement Excel generated successfully.');
        this.hideLoading();
        console.log('Triggering Swal.fire...');
        Swal.fire({
          text: 'Sales Agreement Excel Generated. Proceed to download the ZIP file.',
          icon: 'success',
          confirmButtonText: 'Download ZIP',
          cancelButtonText: 'Cancel',
          showCancelButton: true,
        }).then((result) => {
          console.log('Swal dialog result:', result);
          if (result.isConfirmed) {
            console.log('User confirmed, downloading ZIP...');
            this.downloadSalesAgreementZip(
              data.generateSalesAgreement[0].projectId,
              data.generateSalesAgreement[0].flatNo,
              data.generateSalesAgreement[0].templateId
            );
          } else {
            console.log('User cancelled ZIP download.');
          }
        });
      },
      error: (error) => {
        console.error('Error creating Sales Agreement Excel:', error);
      },
    });
  }

  private downloadSalesAgreementZip(
    projectId: number,
    flatNo: number,
    templateId: number
  ): void {
    this.showLoading();
    this.projectService
      .getSalesAgreementZip(projectId, flatNo, templateId)
      .subscribe(
        (response) => {
          const blob = response.body;
          if (!blob) {
            console.error('Error: Received null or undefined blob');
            return;
          }

          const contentDisposition = response.headers.get(
            'Content-Disposition'
          );
          let fileName =
            'Sales_Agreement_' +
            this.projectName +
            '_' +
            this.unitName +
            '.zip'; // Default filename

          if (contentDisposition) {
            const matches = contentDisposition.match(/filename="(.+?)"/);
            if (matches && matches.length >= 2) {
              fileName = matches[1]; // Extract filename from header
            }
          }

          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(objectUrl);
          this.hideLoading();
          this.goBackToSaleAgreement();
        },
        (error) => {
          this.hideLoading();
          console.error('Error downloading ZIP:', error);
        }
      );
  }

  downloadSalesAgreement(fileType: string): void {
    // Ensure `this.formData` has valid values or use fallback defaults
    const id = this.unitId || 0; // Fallback to 0 if `this.unitId` is undefined
    const projectId = this.projectId || 0; // Fallback to 0 if `this.projectId` is undefined
    const unitName = this.unitName; // Fallback if `unitName` is undefined

    this.projectService
      .downloadSalesAgreementPdfOrDocx(id, projectId, unitName, fileType)
      .subscribe({
        next: (response) => {
          const fileURL = window.URL.createObjectURL(response);
          const link = document.createElement('a');
          link.href = fileURL;
          link.download = `${unitName}SalesAgreement.${fileType}`;
          link.click();
          window.URL.revokeObjectURL(fileURL);
        },
        error: (error) => {
          console.error(
            `Error downloading ${fileType.toUpperCase()} file:`,
            error
          );
        },
      });
  }
  getUserManageTypes() {
    this.commanService
      .getRefDetailsId(USER_MANAGE_TYPE, USER_MANAGE_CRM)
      .subscribe({
        next: (data) => {
          this.usermanageTypeCommonRefernce = data;
          this.typeCommonReferenceDetailsId = data;
          this.getDataFromState();
          this.fetchProjects();
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  //getRefDetailsId

  gotobooking() {
    this.router.navigate(['layout/crm/displaysaleagreement']);
  }
  private showLoading() {
    this.loaderService.show();
  }

  private hideLoading() {
    this.loaderService.hide();
  }
  goBackToSaleAgreement() {
    this.router.navigate([NAVIGATE_TO_DISPLAY_SALE_AGREEMENTS]);
  }
}
