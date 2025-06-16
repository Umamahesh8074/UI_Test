import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupName,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IProject, Project } from './../../../../Models/Project/project';

import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';

import { OrganizationBean } from 'src/app/Models/User/Organization';
import { Role } from 'src/app/Models/User/Role';
import { EmployeeService } from 'src/app/Services/Employee/employee.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { OrganizationService } from 'src/app/Services/UserService/organization.service';
import { RoleService } from 'src/app/Services/UserService/role.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';
import Swal from 'sweetalert2';
import {
  NO,
  PERMANENT,
  TEMPORARY,
  YES,
} from 'src/app/Constants/CommanConstants/Comman';
import {
  EmployeeDto,
  EmployeeSaveDto,
  IEmployee,
} from 'src/app/Models/Employee/employee';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CommonReferenceDetails } from 'src/app/Models/User/CommonReferenceDetails';
import { CommomReferenceDetailsService } from 'src/app/Services/Presales/CommonRefernceDetails/commomreferencedetails.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  isView = false;
  isAdding: boolean = true;
  private destroy$ = new Subject<void>();
  public user: User = new User();
  organizationId: number = 0;
  emailExists: boolean = false;
  formData!: FormGroup;
  addressForm!: FormGroup;
  empFamilyDetails!: FormGroup;
  educationDetails!: FormGroup;
  empBankDetails!: FormGroup;
  isModalVisible = false;
  departmentList: CommonReferenceType[] = [];
  Department_Type: string = 'Department_Type';
  Divisions: string = 'Divisions';
  divisionList: CommonReferenceType[] = [];
  grades: string = 'Grades';
  gradesList: CommonReferenceType[] = [];
  costCenter: string = 'cost_center';
  costCenterList: CommonReferenceType[] = [];
  designationList: CommonReferenceType[] = [];
  designation_Type: string = 'Designation_Type';
  qualificationList: CommonReferenceType[] = [];
  qualification: string = 'Qualification_Type';
  qualificationAreaList: CommonReferenceType[] = [];
  qualificationArea: string = 'Qualification_Area';
  employeeStatusList: CommonReferenceType[] = [];
  Employee_Status: string = 'Employee_Status';
  shiftIdList: CommonReferenceType[] = [];
  Shift_Timings: string = 'Shift_Timings';
  roles: Role[] = [];
  maritalStatusOptions: string[] = ['Single', 'Married'];
  project: Project[] = [];
  projectName: string = '';
  selectedProject: IProject = new Project();
  organization: OrganizationBean[] = [];
  roleNames = [
    'Manager',
    'Operation Manager',
    'Field Officer',
    'presales manager',
    'sales manager',
  ]; // Example list of role names
  defaultValue = 'No';
  status = 'A';
  projectFc: FormControl = new FormControl([] as Project[]);
  employeefc: FormControl = new FormControl([] as IEmployee[]);
  projectId: number = 0;
  isFieldDisabled: boolean = false;
  users: User[] = [];
  backEndData = history.state.employeeData;
  employeeData: EmployeeDto[] = [];
  firstName: string = '';
  id: number = 0;
  isEsicChecked = false;
  loggedInUserRole: string = '';
  heading = 'ADD EMPLOYEE';

  submitting = 'ADD';
  employeesave: EmployeeSaveDto = new EmployeeSaveDto();
  roleName: string = '';
  formStatusDetails: CommonReferenceDetails = new CommonReferenceDetails();
  showstatus: boolean = false;

  approvalStatus!: boolean;
  selectedEmployee: number = 0;
  indianStates: string[] = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ];
  dialog: any;

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private builder: FormBuilder,
    private commonService: CommanService,
    private roleService: RoleService,
    private projectService: ProjectService,
    private userService: UserService,
    private organizationService: OrganizationService,
    private commonRefDetails: CommomReferenceDetailsService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    this.initializeForm();
    if (user) {
      this.user = JSON.parse(user);
      this.organizationId = this.user.organizationId;
      this.roleName = this.user.roleName;
      // this.loggedInUserRole=this.user.
      console.log(this.user);
      console.log(this.addressForm.controls);
      console.log(this.user.roleName == 'HR');
    }
    this.fetchDesignationType();
    this.fetchEmployeeStatusType();
    this.getProjects();
    this.fetchRoles();
    this.fetchUsers();
    this.fetchShifts();
    this.isUserAdded();
    this.fetchDepartmentType();
    this.fetchDivisionNames();
    this.fetchCostCenter();
    this.getEmployeeDetails();
    this.fetchGrades();
    this.fetchQualification();
    this.fetchQualificationArea();
    this.checkEmployee();

    const data = history.state.employeeData;
    if (data) {
      this.selectedEmployee = history.state.employeeData.employeeBean.id;
      this.heading = 'UPDATE EMPLOYEE';
      this.submitting = 'UPDATE';
      this.isAdding = false;
      // const commonrefId = history.state.employeeData.employeeBean.formStatusOne;
      // alert(commonrefId);
      // this.getcommonRefDetailsById(commonrefId).subscribe({
      //   next: (response) => {
      //     if (response.commonRefKey === 'esd' && history.state.approvalStatus) {
      //       this.disableFormFields();
      //     } else if (!history.state.approvalStatus) {
      //     }
      //   },
      //   error: (error) => {
      //     console.error('Error fetching common reference details:', error);
      //   },
      // });

      this.patchFormData(data);
    }
  }
  // async getCommonStatuses(type: string) {
  //   this.commonService.fetchCommonReferenceTypesByKey(type).subscribe({
  //     next: (data) => {
  //       console.log(data);
  //       this.formStatusDetails = data;
  //       console.log(this.formStatusDetails);
  //     },
  //     error: (error) => {
  //       console.error(error?.message);
  //     },
  //   });
  // }
  getEmployeesById(id: number) {
    return this.employeeService
      .getEmployeesDetailsByEmployeeId(id)
      .pipe(takeUntil(this.destroy$));
  }
  getcommonRefDetailsById(id: number) {
    return this.commonRefDetails.getById(id).pipe(takeUntil(this.destroy$));
  }
  setSubmitting(action: string): void {
    this.submitting = action;
  }

  async getCommonStatuses(
    type: string,
    callback: (data: any) => void
  ): Promise<void> {
    this.commonService.fetchCommonReferenceTypesByKey(type).subscribe({
      next: (data) => {
        console.log(data);
        this.formStatusDetails = data;
        console.log(this.formStatusDetails);

        // Call the callback function with the updated data
        callback(this.formStatusDetails);
      },
      error: (error) => {
        console.error(error?.message);
      },
    });
  }

  async checkEmployee() {
    this.getCommonStatuses('esd', (formStatusDetails) => {
      // alert(formStatusDetails.id + 'hhhhhhhhhhhhhh');

      if (
        !(
          this.user.roleName == 'HR Super Admin' ||
          this.user.roleName == 'HR Admin'
        )
      ) {
        this.isAdding = false;
        this.getEmployeesById(this.user.employeeId).subscribe({
          next: (response) => {
            // Pass a callback to handle the result when formStatusDetails is updated

            this.employeesave = response;
            this.backEndData = response;

            this.heading = 'UPDATE PROFILE';
            this.submitting = 'SUBMIT';

            console.log(this.employeesave);
            if (this.employeesave.employeeBean.stepperOneStatus > 0) {
              this.showstatus = true;
            }
            this.patchFormData(this.employeesave);
          },
          error: (error) => {
            console.error(error);
          },
        });
      } else if (
        (this.user.roleName == 'HR Super Admin' ||
          this.user.roleName == 'HR Admin') &&
        !this.isAdding &&
        history.state.employeeData.employeeBean.formStatusOne ===
          formStatusDetails.id
      ) {
        setTimeout(() => {
          this.isAdding = false;
          this.approvalStatus = true;
          this.submitting = 'APPROVE';

          this.patchFormData(this.employeesave);
          this.cdRef.detectChanges(); // Manually trigger change detection
        });
      }
    });
  }

  private isUserAdded(): void {
    if (!this.isAdding) {
      const currentValue =
        this.employeeBasicDetails.get('isAddAsUserNeeded')?.value;
      console.log(currentValue);

      // Prevent recursive calls by using a flag or check
      let isProcessing = false;

      // Only enable or disable based on currentValue initially
      if (currentValue === 'Yes') {
        this.employeeBasicDetails.get('isAddAsUserNeeded')?.disable();
      } else {
        this.employeeBasicDetails.get('isAddAsUserNeeded')?.enable();
      }

      // Subscribe to valueChanges only after the initial setup
      this.employeeBasicDetails
        .get('isAddAsUserNeeded')
        ?.valueChanges.pipe(
          takeUntil(this.destroy$) // Clean up subscriptions properly
        )
        .subscribe((value) => {
          // Prevent recursive changes
          if (!isProcessing) {
            isProcessing = true; // Set the flag to prevent recursive calls
            // Perform action only if the value changes
            if (value === 'Yes') {
              this.employeeBasicDetails.get('isAddAsUserNeeded')?.disable();
            } else {
              this.employeeBasicDetails.get('isAddAsUserNeeded')?.enable();
            }
            isProcessing = false; // Reset the flag after the action is performed
          }
        });
    } else {
      this.employeeBasicDetails.get('isAddAsUserNeeded')?.enable();
    }
  }

  private initializeForm(): void {
    // this.employeeBasicDetails = this.builder.group({
    //   id: [0],
    //   employeeId: ['', Validators.required],
    //   firstName: [''],
    //   lastName: [''],
    //   email: ['', [Validators.required, Validators.email]],
    //   phoneNumber: ['', Validators.required],

    //   dateOfBirth: ['', [this.noFutureDateValidator]],

    //   gender: [''],
    //   address: [''],
    //   city: [''],
    //   state: [''],
    //   postalCode: [''],
    //   department: [0],
    //   // designation: [''],
    //   dateOfJoining: ['', [this.noFutureDateValidator]],
    //   employeeStatus: [''],
    //   reportingManager: [0],
    //   employeeRoleId: [0],
    //   workLocation: [''],
    //   maritalStatus: [''],
    //   nationalId: [''],
    //   projectAssigned: [0],

    //   dateOfResignation: ['', [this.noFutureDateValidator]],
    //   noticePeriodEndDate: ['', [this.noFutureDateValidator]],
    //   lastWorkingDay: ['', [this.noFutureDateValidator]],
    //   panId: [''],

    //   shiftId: [0],
    //   status: ['A'],
    //   userId: [0],
    //   organizationId: [0],
    //   isAddAsUserNeeded: ['No'],
    //   shift: [''],
    //   disignation: [''],

    //   title: [''],

    //   religion: [''],

    //   cast: [''],

    //   bloodGroup: [''],

    //   height: [''],

    //   weight: [''],

    //   identificationMark: [''],

    //   fatherName: [''],

    //   marriageDate: ['', [this.noFutureDateValidator]],

    //   spouseName: [''],

    //   nationality: [''],

    //   country: [''],

    //   plcaeOfBirth: [''],

    //   physicallyChallenged: [''],

    //   personalEmail: [''],
    //   age: [0],

    //   emergencyContactName: [''],

    //   emergencyContactNumber: [''],

    //   policeStationLimits: [''],

    //   esiNumber: [''],

    //   esiDisrubbed: [''],

    //   pfUanNo: [''],

    //   adharUrl: [null],

    //   panUrl: [null],
    //   voterIdUrl: [null],
    //   passPortUrl: [null],
    //   rationCardUrl: [null],
    //   divisionId: [0],

    //   costCenterId: [0],

    //   confirmationDate: [new Date()],

    //   probationPeriod: [0],

    //   referredBy: [0],

    //   gradeId: [0],

    //   company: [''],

    //   isPmsEligible: [''],
    //   formStatus: [0],
    //   stepperOneStatus: [0],
    //   stepperTwoStatus: [0],
    //   stepperThreeStatus: [0],
    // });

    this.employeeBasicDetails = this.createEmployeeBasicDetails();
    this.empFamilyDetails = this.builder.group({
      familyDetails: this.builder.array([this.createFamilyDetail()]),
    });

    this.permanentAddress = this.createAddress(PERMANENT);

    this.temporaryAddress = this.createAddress(TEMPORARY);

    // this.addressForm = this.builder.group({
    //   addresses: this.builder.array([
    //     this.createAddress(PERMANENT), // Permanent address at index 0
    //     this.createAddress(TEMPORARY), // Temporary address at index 1
    //   ]),
    // });
    this.addressForm = this.builder.group({
      addresses: this.builder.array([
        this.permanentAddress,
        this.temporaryAddress,
      ]),
    });

    this.educationDetails = this.builder.group({
      education: this.builder.array([this.createEducation()]),
    });
    this.empBankDetails = this.createBankDetails();
  }
  employeeBasicDetails!: FormGroup;
  permanentAddress!: FormGroup;
  temporaryAddress!: FormGroup;
  noFutureDateValidator(control: AbstractControl) {
    const selectedDate = control.value;
    const today = new Date();
    if (selectedDate && selectedDate > today) {
      return { futureDate: true };
    }
    return null;
  }
  searchProject(event: any): void {
    const query = event.target.value;
    this.projectName = query;
    this.getProjects();
  }
  onProjectSelect(event: any) {
    console.log(event);

    console.log(event.option.value);
    if (event?.option?.value) {
      this.projectId = event.option.value.projectId;
      console.log(this.projectId);

      this.employeeBasicDetails.patchValue({ projectAssigned: this.projectId });
      console.log(this.employeeBasicDetails);
    }
  }
  getProjects() {
    this.projectService
      .getProjects(this.projectName, this.organizationId)
      .subscribe({
        next: (data) => {
          console.log(data);
          this.project = data;
          console.log(this.project);
        },
        error: (error: any) => {
          console.error('Error fetching Project Charge Charge Ins :', error);
        },
      });
  }

  get dateOfBirth() {
    return this.employeeBasicDetails.get('dateOfBirth');
  }
  get marriageDate() {
    return this.employeeBasicDetails.get('marriageDate');
  }
  fetchDepartmentType(): void {
    console.log(this.Department_Type);
    this.commonService.getRefDetailsByType(this.Department_Type).subscribe({
      next: (types) => {
        this.departmentList = types;
        console.log(this.departmentList);
      },
      error: (error: any) => {
        console.error('Error fetching  types:', error);
      },
    });
  }
  fetchShifts(): void {
    console.log(this.Shift_Timings);
    this.commonService.getRefDetailsByType(this.Shift_Timings).subscribe({
      next: (types) => {
        this.shiftIdList = types;
      },
      error: (error: any) => {
        console.error('Error fetching  shifts:', error);
      },
    });
  }
  fetchDivisionNames(): void {
    console.log(this.Divisions);
    this.commonService.getRefDetailsByType(this.Divisions).subscribe({
      next: (types) => {
        this.divisionList = types;
        console.log(this.divisionList);
      },
      error: (error: any) => {
        console.error('Error fetching  types:', error);
      },
    });
  }

  fetchCostCenter(): void {
    console.log(this.costCenter);
    this.commonService.getRefDetailsByType(this.costCenter).subscribe({
      next: (types) => {
        this.costCenterList = types;
        console.log(this.costCenterList);
      },
      error: (error: any) => {
        console.error('Error fetching  types:', error);
      },
    });
  }

  fetchGrades(): void {
    console.log(this.grades);
    this.commonService.getRefDetailsByType(this.grades).subscribe({
      next: (types) => {
        this.gradesList = types;
        console.log(this.gradesList);
      },
      error: (error: any) => {
        console.error('Error fetching  types:', error);
      },
    });
  }

  fetchDesignationType(): void {
    console.log(this.designation_Type);
    this.commonService.getRefDetailsByType(this.designation_Type).subscribe({
      next: (types) => {
        this.designationList = types;
      },
      error: (error: any) => {
        console.error('Error fetching  types:', error);
      },
    });
  }

  fetchQualification(): void {
    console.log(this.qualification);
    this.commonService.getRefDetailsByType(this.qualification).subscribe({
      next: (types) => {
        this.qualificationList = types;
        console.log(this.qualificationList);
      },
      error: (error: any) => {
        console.error('Error fetching  types:', error);
      },
    });
  }

  fetchQualificationArea(): void {
    console.log(this.qualificationArea);
    this.commonService.getRefDetailsByType(this.qualificationArea).subscribe({
      next: (types) => {
        this.qualificationAreaList = types;
        console.log(this.qualificationAreaList);
      },
      error: (error: any) => {
        console.error('Error fetching  types:', error);
      },
    });
  }
  displayProject(project: Project): string {
    return project && project.projectName ? project.projectName : '';
  }
  getOrganizationName(organizationId: number): void {
    // Simulate a service call to fetch organization name
    this.organizationId = organizationId;
    this.organizationService
      .getOrganizationById(this.organizationId)
      .subscribe({
        next: (organization: any) => {
          console.log(organization);

          this.organization = organization;
        },
        error: (error: any) => {
          console.error('Error fetching  organization:', error);
        },
      });
  }
  fetchEmployeeStatusType(): void {
    console.log(this.Employee_Status);
    this.commonService.getRefDetailsByType(this.Employee_Status).subscribe({
      next: (types) => {
        this.employeeStatusList = types;
      },
      error: (error: any) => {
        console.error('Error fetching  types:', error);
      },
    });
  }
  get employeeIdControl() {
    return this.employeeBasicDetails.get('employeeId');
  }
  get phoneNumberControl() {
    return this.employeeBasicDetails.get('phoneNumber');
  }
  get emailControl() {
    return this.employeeBasicDetails.get('email');
  }
  fetchRoles() {
    this.roleService.fetchAllRoles('', this.organizationId).subscribe({
      next: (roles: any) => {
        console.log(roles);
        this.roles = roles;
      },
      error: (error: any) => {
        console.error(error);
      },
    });
  }
  fetchUsers(): void {
    this.userService
      .fetchUsersByRolesAndOrganization(this.roleNames, this.organizationId)
      .subscribe({
        next: (users: any) => {
          console.log(users);
          this.users = users;
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }

  private fetchProjectById(projectId: number) {
    this.projectService
      .getProjectById(projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.selectedProject = data;
          console.log(data);
          this.employeeBasicDetails.patchValue({ projectId: data.projectId });
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
  save() {
    if (this.isAdding && this.employeeBasicDetails.invalid) {
      console.error('Form is invalid. Please fill in all required fields.');
      return;
    }

    // if (this.isAdding) {
    //   this.employeeService
    //     .addEmployee(this.formData.value)
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe({
    //       next: () => {
    //         this.router.navigate(['layout/employee/displayemployee']);
    //       },
    //       error: (err: any) => {
    //         console.error('Error adding employee', err);
    //       },
    //     });
    // } else {
    //   this.employeeService
    //     .updateEmployee(this.formData.getRawValue())
    //     .pipe(takeUntil(this.destroy$))
    //     .subscribe({
    //       next: () => {
    //         this.router.navigate(['layout/employee/displayemployee']);
    //       },
    //       error: (err: any) => {
    //         console.error('Error updating employee', err);
    //       },
    //     });
    // }
  }

  async patchFormData(data: any): Promise<void> {
    const projectId = data.employeeBean.projectAssigned;
    this.fetchProjectById(projectId);
    console.log(data.toString + 'data for update');

    this.empBankDetails.patchValue(data.employeeBankDetails);

    this.employeeBasicDetails.value.adharUrl = this.renameFile(
      this.employeeBasicDetails.value.adharUrl,
      'employee',
      'adharCard'
    );
    this.employeeBasicDetails.value.panUrl = this.renameFile(
      this.employeeBasicDetails.value.panUrl,
      'employee',
      'panCard'
    );
    this.employeeBasicDetails.value.voterIdUrl = this.renameFile(
      this.employeeBasicDetails.value.voterIdUrl,
      'employee',
      'VoterId'
    );
    this.employeeBasicDetails.value.passPortUrl = this.renameFile(
      this.employeeBasicDetails.value.passPortUrl,
      'employee',
      'PassPort'
    );
    this.employeeBasicDetails.value.rationCardUrl = this.renameFile(
      this.employeeBasicDetails.value.rationCardUrl,
      'employee',
      'RationCard'
    );

    this.employeeBasicDetails.patchValue(data.employeeBean);
    console.log(data.employeeFamilyBeanList.length);
    if (data.employeeFamilyBeanList && data.employeeFamilyBeanList.length) {
      const familyFormArray = this.familyDetails;

      // Ensure that the FormArray has enough controls (form groups)
      while (familyFormArray.length < data.employeeFamilyBeanList.length) {
        familyFormArray.push(this.createFamilyDetail()); // Add more controls if needed
      }

      // Now patch the data into the FormArray
      data.employeeFamilyBeanList.forEach(
        (familyDetail: any, index: number) => {
          if (familyFormArray.at(index)) {
            familyFormArray.at(index).patchValue(familyDetail);
            console.log(familyDetail);
            familyFormArray.at(index).value.familyMemberId = this.renameFile(
              familyFormArray.at(index).value.familyMemberId,
              'employee',
              'familyMemberId'
            );
          }
        }
      );
    }
    if (
      data.employeeEducationBeanList &&
      data.employeeEducationBeanList.length
    ) {
      const educationFormArray = this.education;

      // Ensure that the FormArray has enough controls (form groups)
      while (
        educationFormArray.length < data.employeeEducationBeanList.length
      ) {
        educationFormArray.push(this.createEducation()); // Add more controls if needed
      }

      console.log(this.qualificationAreaList);

      // Now patch the data into the FormArray
      data.employeeEducationBeanList.forEach(
        (education: any, index: number) => {
          if (educationFormArray.at(index)) {
            educationFormArray.at(index).patchValue(education);
            console.log(educationFormArray.at(index));
            console.log(education.qualification);
          }
        }
      );
    }

    if (data.addressBeanList && data.addressBeanList.length) {
      data.addressBeanList.forEach((address: any) => {
        if (address.type === 'permanent') {
          this.permanentAddress.patchValue(address);
          if (this.permanentAddress.value.isPointOfContact === YES) {
            this.selectedContactControl.patchValue(PERMANENT);
          }
        } else if (address.type === 'temporary') {
          this.temporaryAddress.patchValue(address);
          if (this.temporaryAddress.value.isPointOfContact === YES) {
            this.selectedContactControl.patchValue(TEMPORARY);
          }
        }
      });
    }
  }
  clearForm() {
    this.employeeBasicDetails.reset();
  }

  gotoEmployee() {
    this.router.navigate(['layout/employee/displayemployee']);
  }

  checkEmailUniqueness() {
    const email = this.employeeBasicDetails.get('email')?.value;
    this.userService.checkEmail(email).subscribe(
      (response) => {
        // Handle success case if needed
        console.log(response);
      },
      (error) => {
        if (error.status === 409) {
          // Show SweetAlert if email already exists
          Swal.fire({
            icon: 'error',
            title: 'Email already exists',
            text: 'Please enter a different email address.',
            confirmButtonText: 'OK',
          });
        } else {
          // Handle other errors if needed
          console.error('Error occurred:', error);
        }
      }
    );
  }

  checkPhoneNumberExists() {
    const phoneNumber = this.employeeBasicDetails.get('phoneNumber')?.value;
    this.userService.checkPhoneNumber(phoneNumber).subscribe(
      (response) => {
        // Handle success case if needed
        console.log(response);
      },
      (error) => {
        if (error.status === 409) {
          // Show SweetAlert if phone number already exists
          Swal.fire({
            icon: 'error',
            title: 'Phone number already exists',
            text: 'Please enter a different phone number.',
            confirmButtonText: 'OK',
          });
        } else {
          // Handle other errors if needed
          console.error('Error occurred:', error);
        }
      }
    );
  }

  // Create a new form group for family details
  createFamilyDetail(): FormGroup {
    return this.builder.group({
      id: [0],
      name: [''],
      relationship: [''],
      contactNo: [''],
      dateOfBirth: [new Date(), [this.noFutureDateValidator]],
      age: [0],
      remarks: [''],
      address: [''],
      email: [''],
      country: [''],
      pincode: [''],
      city: [''],
      employeeId: [0],
      stepperStatus: [0],
      familyMemberId: [''],
    });
  }
  createEducation(): FormGroup {
    return this.builder.group({
      id: [0],
      qualification: [''],
      institute: [''],
      qualificationArea: [''],
      grade: [''],
      remarks: [''],
      startDate: [new Date(), [this.noFutureDateValidator]], // assuming noFutureDateValidator is a custom date validation
      endDate: [new Date(), [this.noFutureDateValidator]], // applying the same validation for endDate
      employeeId: [0],
      stepperStatus: [0],
    });
  }
  // Getter for the familyDetails FormArray
  get familyDetails(): FormArray {
    return this.empFamilyDetails.get('familyDetails') as FormArray;
  }

  // Method to add new family details
  addFamilyDetail(): void {
    this.familyDetails.push(this.createFamilyDetail());
  }

  // Method to remove a family detail form
  removeFamilyDetail(index: number): void {
    this.familyDetails.removeAt(index);
  }

  get education(): FormArray {
    return this.educationDetails.get('education') as FormArray;
  }

  addEducation(): void {
    this.education.push(this.createEducation());
  }

  removeEducation(index: number): void {
    this.education.removeAt(index);
  }

  async submitAllForms(): Promise<void> {
    this.employeeBasicDetails.value.organizationId = this.organizationId;

    // Get the selected value from the FormControl
    const selectedContact = this.selectedContactControl.value;
    if (selectedContact === PERMANENT) {
      this.permanentAddress.value.isPointOfContact = YES;
      this.temporaryAddress.value.isPointOfContact = NO;
    } else if (selectedContact === TEMPORARY) {
      this.permanentAddress.value.isPointOfContact = NO;
      this.temporaryAddress.value.isPointOfContact = YES;
      // console.log(temporaryAddress);
    }
    const addressArray = this.addressForm.get('addresses') as FormArray; // Get the 'addresses' FormArray
    const permanentAddress = addressArray.at(0); // Get the address at index 0
    permanentAddress.patchValue(this.permanentAddress.value);

    const temporaryAddress = addressArray.at(1); // Get the address at index 0
    temporaryAddress.patchValue(this.temporaryAddress.value);

    this.employeeBasicDetails
      .get('organizationId')
      ?.patchValue(this.organizationId);

    // Patch the values of the employeeBasicDetails form group

    // Get the values of each form

    const employeeData = this.employeeBasicDetails.value;
    const familyDetailsData = this.empFamilyDetails.get('familyDetails')?.value; // FormArray will also have .value
    const addressData = this.addressForm.get('addresses')?.value; // FormArray will also have .value
    const educationDetails = this.educationDetails.get('education')?.value;
    const bankDetails = this.empBankDetails.value;
    // Create the final object with all form data values
    const allFormData = {
      employeeBean: employeeData,
      employeeFamilyBeanList: familyDetailsData, // Array of family details (should not be null)
      addressBeanList: addressData,
      employeeEducationBeanList: educationDetails,
      employeeBankDetails: bankDetails,
    };

    if (this.isAdding) {
      // Make sure to handle the asynchronous call to get form status first
      this.getCommonStatuses('ews', (formStatusDetails) => {
        // Update the form data with the form status
        allFormData.employeeBean.formStatusOne = formStatusDetails.id;

        //   formStatus: formStatusDetails.id,
        // });

        console.log('Updated Employee Bean:', allFormData.employeeBean);

        // Proceed with submitting the form data
        this.employeeService
          .submitEmployee(allFormData, this.selectedFiles)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              // Navigate or handle post-submit actions
              this.router.navigate(['layout/employee/displayemployee']);
            },
            error: (err: any) => {
              console.error('Error adding employee', err);
            },
          });
      });
    } else {
      if (this.submitting == 'SUBMIT') {
        await this.getCommonStatuses('esd', (formStatusDetails) => {
          console.log(formStatusDetails.id);
          console.log(this.employeeBasicDetails);
          allFormData.employeeBean.formStatusOne = formStatusDetails.id; // Updating formStatusOne
          // Continue with the employee update
          this.employeeBasicDetails.value.id = this.backEndData.employeeBean.id;
          this.employeeService
            .updateEmployee(allFormData, this.selectedFiles)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: () => {
                // this.router.navigate(]);
              },
              error: (err: any) => {
                console.error('Error updating employee', err);
              },
            });
        });
      } else {
        this.employeeBasicDetails.value.id = this.backEndData.employeeBean.id;
        // this.empFamilyDetails.get('familyDetails')?.value.employeeId=this.backEndData.employeeBean.id;
        this.employeeService
          .updateEmployee(allFormData, this.selectedFiles)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.router.navigate(['layout/employee/displayemployee']);
            },
            error: (err: any) => {
              console.error('Error updating employee', err);
            },
          });
      }
    }
    console.log('All Form Data:', allFormData);
  }
  createAddress(type: 'permanent' | 'temporary'): FormGroup {
    return this.builder.group({
      addressId: [0],
      employeeId: [0],
      type: [type], // Type is either permanent or temporary
      doorNo: [''],
      houseOwnerName: [''],
      streetOrRoad: [''],
      post: [''],
      city: [''],
      pincode: [''],
      state: [''],
      policeStationLimits: [''],
      isPointOfContact: [NO],
      stepperStatus: [0],
    });
  }
  createBankDetails() {
    return this.builder.group({
      id: [0], // Integer, assumed to be numeric
      employeeId: [0], // String, can add required validation
      bankName: [''], // String, required
      bankAccountNumber: [''], // String, required
      bankIfscCode: [''], // String, required
      accountType: [''], // String, required
      accountOpeningDate: [new Date()], // Date, required
      aadhaarNumber: [''], // String, required
      panNumber: [''], // String, required
      esicInclude: [''], // Boolean, default false
      esicNumber: [''], // String, required
      pfInclude: [''], // Boolean, default false
      pfNumber: [''], // String, required
      uanNumber: [''], // String, required
      lwfInclude: [''], // Boolean, default false
      mobileNumber: [''], // String, mobile number validation
      status: ['A'],
      stepperStatus: [0],
    });
  }

  selectedContactControl = new FormControl('');

  sameAsPermanent() {
    const permanentAddress = this.permanentAddress.value;
    console.log(permanentAddress);
    this.permanentAddress.value.type = PERMANENT;
    this.temporaryAddress.patchValue(permanentAddress);
    this.temporaryAddress.value.type = TEMPORARY;
  }

  createEmployeeBasicDetails() {
    return this.builder.group({
      id: [0],
      employeeId: ['', Validators.required],
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],

      dateOfBirth: [new Date(), [this.noFutureDateValidator]],

      gender: [''],
      address: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      department: [0],
      // designation: [''],
      dateOfJoining: [new Date()],
      employeeStatus: [''],
      reportingManager: [0],
      employeeRoleId: [0],
      workLocation: [''],
      maritalStatus: [''],
      nationalId: [''],
      projectAssigned: [0],

      dateOfResignation: [new Date()],
      noticePeriodEndDate: [new Date()],
      lastWorkingDay: [''],
      panId: [''],

      shiftId: [0],
      status: ['A'],
      userId: [0],
      organizationId: [0],
      isAddAsUserNeeded: ['No'],
      shift: [''],
      disignation: [''],

      title: [''],

      religion: [''],

      cast: [''],

      bloodGroup: [''],

      height: [''],

      weight: [''],

      identificationMark: [''],

      fatherName: [''],

      marriageDate: [new Date(), [this.noFutureDateValidator]],

      spouseName: [''],

      nationality: [''],

      country: [''],

      plcaeOfBirth: [''],

      physicallyChallenged: [''],

      personalEmail: [''],
      age: [0],

      emergencyContactName: [''],

      emergencyContactNumber: [''],

      policeStationLimits: [''],

      esiNumber: [''],

      esiDisrubbed: [''],

      pfUanNo: [''],

      adharUrl: [''],

      panUrl: [''],
      voterIdUrl: [''],
      passPortUrl: [''],
      rationCardUrl: [''],
      divisionId: [0],

      costCenterId: [0],

      confirmationDate: [new Date()],

      probationPeriod: [0],

      referredBy: [0],

      gradeId: [0],

      company: [''],

      isPmsEligible: [''],
      formStatusOne: [0],
      stepperOneStatus: [0],
      stepperTwoStatus: [0],
      stepperThreeStatus: [0],
    });
  }

  fileTypeError: boolean = false;

  // Define a list to store selected files
  selectedFiles: File[] = [];

  onFileChange(event: Event, docType: string, index?: number): void {
    this.handleFileChange(event, docType);
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const selectedFile = input.files[0]; // Only one file can be selected at a time
      const allowedExtensions = ['pdf']; // Only allow .pdf files
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

      if (allowedExtensions.includes(fileExtension!)) {
        this.fileTypeError = false; // Reset error flag
        var newFileName = '';
        if (index != undefined) {
          newFileName = `${docType}_${index}_${selectedFile.name}`;
        } else {
          newFileName = `${docType}_${selectedFile.name}`;
        }
        // Create a new File with the document type added to the name

        // Create a new File object with the updated file name
        const updatedFile = new File([selectedFile], newFileName, {
          type: selectedFile.type,
        });

        // Now, add the updated file to the array
        this.selectedFiles.push(updatedFile);

        console.log(this.selectedFiles, 'Selected Files'); // Logging for debugging
      } else {
        this.fileTypeError = true; // Set error flag if file type is not allowed
      }
    } else {
      console.log('No file selected');
    }
  }
  downloadFile(fileName: string) {
    // Handle the file download logic (you can use your service to fetch the file)
    console.log('Downloading file for:', fileName);
  }

  getEmployeeDetails() {
    this.employeeService
      .getAllEmployeesByOrg(this.organizationId, this.firstName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employeeData: any) => {
          this.employeeData = employeeData;
          this.employeeBasicDetails.patchValue({ id: employeeData.id });
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }

  displayEmployeeName(employee: IEmployee): string {
    return employee && employee.firstName ? employee.firstName : '';
  }

  searchEmployee(event: any): void {
    const query = event.target.value;
    if (query.length >= 3) {
      this.firstName = query;
      this.getEmployeeDetails();
    } else if (query.length == 0) {
      this.firstName = '';
      this.getEmployeeDetails();
    }
  }

  onEmployeeSelect(event: any) {
    this.firstName = event.option.value.firstName;
    this.id = event.option.value.id;
    this.employeeBasicDetails.patchValue({ employeeId: this.id });
    this.getEmployeeDetails();
  }
  onDateChange(event: any): void {
    console.log('Selected Date:', event.value);
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
  fileNames: any = {
    Adhar_card: null,
    Pan_card: null,
    Voter_card: null,
    PassPort_card: null,
    Ration_card: null,
    family_member: null,
  };
  handleFileChange(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files ? input.files[0] : null;

    if (file) {
      // Ensure the key is valid before accessing it
      console.log('Before update:', this.fileNames[key]); // This will log the current value (likely null initially)
      console.log('Selected file name:', file.name); // This logs the selected file's name

      this.fileNames[key] = file.name; // Update the file name for the given key
      console.log('After update:', this.fileNames[key]); // This should now log the file name
    } else {
      // If no file is selected, reset the key to null
      this.fileNames[key] = null;
      console.log('After reset:', this.fileNames[key]); // Should log null
    }
  }
}
// Method to disable all form fields except approval status radio buttons
// disableFormFields() {
//   this.approvalStatus = true;
//   this.disableFormGroupFields(this.employeeBasicDetails);

//   this.disableFormGroupFields(this.empFamilyDetails);
//   this.disableFormGroupFields(this.educationDetails);
//   this.disableFormGroupFields(this.empBankDetails);
//   this.disableFormGroupFields(this.permanentAddress);
//   this.disableFormGroupFields(this.temporaryAddress);
// }

// // Method to disable a given form group's fields
// disableFormGroupFields(formGroup: FormGroup) {
//   const controls = formGroup.controls;

//   Object.keys(controls).forEach((controlName) => {
//     if (!controlName.includes('stepper')) {
//       controls[controlName].disable(); // Disable all fields except those with 'stepper' in the name
//     } else {
//       console.log(`Skipping stepper control: ${controlName}`);
//     }
//   });
// }

// This method will be used to toggle the approval status and disable/enable form fields
// toggleApprovalStatus() {
//   this.approvalStatus = history.state.approvalStatus;
//   if (this.approvalStatus) {
//     this.disableFormFields(); // Disable form fields
//   } else {
//     alert('enable');
//     this.enableFormFields(); // Enable form fields
//   }
// }

// Method to enable all form fields
// enableFormFields() {
//   this.enableFormGroupFields(this.formData);

//   this.enableFormGroupFields(this.empFamilyDetails);
//   this.enableFormGroupFields(this.educationDetails);
//   this.enableFormGroupFields(this.empBankDetails);
//   this.enableFormGroupFields(this.permanentAddress);
//   this.enableFormGroupFields(this.temporaryAddress);
// }
// enableFormGroupFields(formGroup: FormGroup) {
//   const controls = formGroup.controls;

//   Object.keys(controls).forEach((controlName) => {
//     if (!controlName.includes('stepper')) {
//       console.log(`Skipping stepper control: ${controlName}`);
//       controls[controlName].enable(); // Disable all fields except those with 'stepper' in the name
//     } else {
//       console.log(`Skipping stepper control: ${controlName}`);
//     }
//   });
// }
