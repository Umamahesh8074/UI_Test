import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApproveDialogComponent } from 'src/app/Comman-Components/Dialog/approvaldialog/approvedialog.component';
import {
  NO,
  PERMANENT,
  TEMPORARY,
  YES,
} from 'src/app/Constants/CommanConstants/Comman';
import { WorkOrderStatus } from 'src/app/Constants/WorkOrder/workorder';
import { CommonReferenceType } from 'src/app/Models/CommanModel/menuDto';
import { EmployeeDto } from 'src/app/Models/Employee/employee';
import { IProject, Project } from 'src/app/Models/Project/project';
import { Role } from 'src/app/Models/User/Role';
import { User } from 'src/app/Models/User/User';
import { CommanService } from 'src/app/Services/CommanService/comman.service';
import { EmployeeService } from 'src/app/Services/Employee/employee.service';
import { CommomReferenceDetailsService } from 'src/app/Services/Presales/CommonRefernceDetails/commomreferencedetails.service';
import { ApprovalsService } from 'src/app/Services/ProcurementService/Approvals/approvals.service';
import { ProjectService } from 'src/app/Services/ProjectService/Project/project.service';
import { OrganizationService } from 'src/app/Services/UserService/organization.service';
import { RoleService } from 'src/app/Services/UserService/role.service';
import { UserService } from 'src/app/Services/UserService/userservice.service';

@Component({
  selector: 'app-employee-details-approve',
  templateUrl: './employee-details-approve.component.html',
  styleUrls: ['./employee-details-approve.component.css'],
})
export class EmployeeDetailsApproveComponent implements OnInit {
  private destroy$ = new Subject<void>();
  public user: User = new User();
  organizationId: number = 0;
  users: User[] = [];
  employeeData: EmployeeDto[] = [];
  roleName: string = '';
  selectedProject: IProject = new Project();
  isReadOnly: boolean = true;
  roleNames = [
    'Manager',
    'Operation Manager',
    'Field Officer',
    'presales manager',
    'sales manager',
  ];
  grades: string = 'Grades';
  gradesList: CommonReferenceType[] = [];
  departmentList: CommonReferenceType[] = [];
  Department_Type: string = 'Department_Type';
  Divisions: string = 'Divisions';
  divisionList: CommonReferenceType[] = [];
  costCenter: string = 'cost_center';
  costCenterList: CommonReferenceType[] = [];
  designationList: CommonReferenceType[] = [];
  designation_Type: string = 'Designation_Type';
  qualificationList: CommonReferenceType[] = [];
  qualification: string = 'Qualification_Type';
  qualificationAreaList: CommonReferenceType[] = [];
  qualificationArearef: string = 'Qualification_Area';
  employeeStatusList: CommonReferenceType[] = [];
  Employee_Status: string = 'Employee_Status';
  shiftIdList: CommonReferenceType[] = [];
  Shift_Timings: string = 'Shift_Timings';
  roles: Role[] = [];
  projectName: string = '';
  project: Project[] = [];

  selectedRole: any;
  selectedShift: any;
  selectedDepartment: any;
  selectedCostCenter: any;
  selectedDivision: any;
  selectedGrade: any;
  referedByEmployee: any;
  selectedEmployeeStatus: any;
  selectedManager: any;
  backEndData = history.state.employeeData;
  empFamilyDetails!: FormGroup;
  educationDetails!: FormGroup;
  empBankDetails!: FormGroup;
  permanentAddress!: FormGroup;
  temporaryAddress!: FormGroup;
  addressForm!: FormGroup;
  selectedContactControl = new FormControl('');
  approveStatusBean = history.state.approveStatusBean;
  constructor(
    private approvalsService: ApprovalsService,
    public dialog: MatDialog,
    private router: Router,
    private datePipe: DatePipe,
    private builder: FormBuilder,
    private projectService: ProjectService,
    private commonService: CommanService,
    private roleService: RoleService,
    private employeeService: EmployeeService,
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
      this.getProjects();
      this.fetchRoles();
      this.fetchDepartmentType();
      this.fetchGrades();
      this.getEmployeeDetails();
      this.fetchShifts();
      this.fetchCostCenter();
      this.fetchDivision();
      this.fetchQualificationArea();
      this.fetchUsers();
    }

    const data = history.state.employeeData;

    if (data) {
      console.log(data);

      this.patchFormData(data);
    }
  }
  isModalVisible: boolean = false; // To control modal visibility (set as needed)
  firstName: string = '';
  openDialog: boolean | undefined;
  workOrderAmount: any;

  stages: any;
  openTermAndCondDialog: boolean | undefined;
  remarks: string = '';
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
  employeeBasicDetails!: FormGroup;
  private initializeForm(): void {
    this.employeeBasicDetails = this.createEmployeeBasicDetails();
    this.educationDetails = this.builder.group({
      education: this.builder.array([this.createEducation()]),
    });
    this.empBankDetails = this.createBankDetails();
    this.permanentAddress = this.createAddress(PERMANENT);

    this.temporaryAddress = this.createAddress(TEMPORARY);

    this.addressForm = this.builder.group({
      addresses: this.builder.array([
        this.permanentAddress,
        this.temporaryAddress,
      ]),
    });
    this.empFamilyDetails = this.builder.group({
      familyDetails: this.builder.array([this.createFamilyDetail()]),
    });
  }
  createEmployeeBasicDetails() {
    return this.builder.group({
      id: [0],
      employeeId: ['', Validators.required],
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],

      dateOfBirth: [''],

      gender: [''],
      address: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      department: [0],
      // designation: [''],
      dateOfJoining: [''],
      employeeStatus: [''],
      reportingManager: [0],
      employeeRoleId: [0],
      workLocation: [''],
      maritalStatus: [''],
      nationalId: [''],
      projectAssigned: [0],

      dateOfResignation: [''],
      noticePeriodEndDate: [''],
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

      marriageDate: [''],

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
      stepperOneStatus: [1],
      stepperTwoStatus: [1],
      stepperThreeStatus: [1],
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
      startDate: [''], // assuming noFutureDateValidator is a custom date validation
      endDate: [''], // applying the same validation for endDate
      employeeId: [0],
      stepperStatus: [0],
    });
  }
  createBankDetails() {
    return this.builder.group({
      id: [0], // Integer, assumed to be numeric
      employeeId: [''], // String, can add required validation
      bankName: [''], // String, required
      bankAccountNumber: [''], // String, required
      bankIfscCode: [''], // String, required
      accountType: [''], // String, required
      accountOpeningDate: [''], // Date, required
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
  createFamilyDetail(): FormGroup {
    return this.builder.group({
      id: [0],
      name: [''],
      relationship: [''],
      contactNo: [''],
      dateOfBirth: [''],
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

  async patchFormData(data: any): Promise<void> {
    const projectId = data.employeeBean.projectAssigned;
    this.fetchProjectById(projectId);
    this.empBankDetails.patchValue(data.employeeBankDetails);
    // console.log(this.employeeBasicDetails.value.id);
    console.log(data.employeeBean.id);

    this.employeeBasicDetails.patchValue(data.employeeBean);
    this.employeeBasicDetails.patchValue({
      id: data.employeeBean.id,
    });

    console.log(this.employeeBasicDetails.value);

    if (
      data.employeeEducationBeanList &&
      data.employeeEducationBeanList.length
    ) {
      const educationFormArray = this.education;

      while (
        educationFormArray.length < data.employeeEducationBeanList.length
      ) {
        educationFormArray.push(this.createEducation()); // Add more controls if needed
      }

      // Now patch the data into the FormArray
      data.employeeEducationBeanList.forEach(
        (education: any, index: number) => {
          if (educationFormArray.at(index)) {
            educationFormArray.at(index).patchValue(education); // Patch values into each form group
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
            familyFormArray.at(index).patchValue(familyDetail); // Patch values into each form group
          }
        }
      );
    }

    console.log(data);
  }

  fetchUsers(): void {
    this.userService
      .fetchUsersByRolesAndOrganization(this.roleNames, this.organizationId)
      .subscribe({
        next: (users: any) => {
          console.log(users);
          this.users = users;
          const data = history.state.employeeData;
          if (data) {
            this.selectedManager = this.users.find((user) => {
              return user.userId === data.employeeBean.reportingManager; // Assuming the employee object has a gradeId
            });
            console.log('Selected user:', this.selectedManager);
          }
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }
  getEmployeeDetails() {
    this.employeeService
      .getAllEmployeesByOrg(this.organizationId, this.firstName)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (employeeData: any) => {
          this.employeeData = employeeData;
          this.employeeBasicDetails.patchValue({ id: employeeData.id });
          const data = history.state.employeeData;
          if (data) {
            this.referedByEmployee = this.employeeData.find(
              (emp) => emp.id === data.employeeBean.referredBy
            );
            console.log('Selected employee:', this.referedByEmployee);
          }
        },
        error: (error) => {
          console.error('Error fetching users:', error);
        },
      });
  }

  fetchGrades(): void {
    console.log(this.grades);
    this.commonService.getRefDetailsByType(this.grades).subscribe({
      next: (grades) => {
        this.gradesList = grades;
        console.log('Fetched Grades:', this.gradesList);

        // Optional: Set a default selected grade (if applicable)
        const data = history.state.employeeData;
        if (data) {
          this.selectedGrade = this.gradesList.find((grade) => {
            return grade.id === data.employeeBean.gradeId; // Assuming the employee object has a gradeId
          });
          console.log('Selected Grade:', this.selectedGrade);
        }
      },
      error: (error) => {
        console.error('Error fetching grades:', error);
      },
    });
  }

  fetchDepartmentType(): void {
    console.log(this.Department_Type);
    this.commonService.getRefDetailsByType(this.Department_Type).subscribe({
      next: (types) => {
        this.departmentList = types;
        console.log('Fetched Departments:', this.departmentList);

        // After fetching the department list, patch the form data if employeeData exists
        const data = history.state.employeeData;
        if (data) {
          console.log('Employee Data:', data);

          // Find the corresponding department based on the id from employeeData
          this.selectedDepartment = this.departmentList.find((dept) => {
            return dept.id === data.employeeBean.department; // Compare departmentId from employeeData
          });
          console.log('Fetched Departments:', this.selectedDepartment);
        }
      },
      error: (error: any) => {
        console.error('Error fetching departments:', error);
      },
    });
  }

  // fetchRoles() {
  //   this.roleService.fetchAllRoles('', this.organizationId).subscribe({
  //     next: (roles: any) => {
  //       console.log(roles);
  //       this.roles = roles;
  //     },
  //     error: (error: any) => {
  //       console.error(error);
  //     },
  //   });
  // }
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

  fetchRoles() {
    this.roleService.fetchAllRoles('', this.organizationId).subscribe({
      next: (roles: any) => {
        console.log('Fetched Roles:', roles);
        this.roles = roles;

        // After fetching roles, check if there's employeeData in history
        const data = history.state.employeeData;
        if (data) {
          console.log('Employee Data:', data);

          // Find the corresponding role based on the id from employeeData
          this.selectedRole = this.roles.find((role) => {
            return role.roleId === data.employeeBean.employeeRoleId;
          });
          console.log(this.selectedRole);
          console.log(this.selectedRole);
        }
      },
      error: (error: any) => {
        console.error('Error fetching roles:', error);
      },
    });
  }

  fetchShifts(): void {
    console.log(this.Shift_Timings);
    this.commonService.getRefDetailsByType(this.Shift_Timings).subscribe({
      next: (types) => {
        this.shiftIdList = types;
        console.log('Fetched Shifts:', this.shiftIdList);

        // After fetching the shifts, patch the form data if employeeData exists
        const data = history.state.employeeData;
        if (data) {
          console.log('Employee Data:', data);

          // Find the corresponding shift based on the id from employeeData
          this.selectedShift = this.shiftIdList.find((shift) => {
            return shift.id === data.employeeBean.shiftId; // Compare shiftId from employeeData
          });
        }
      },
      error: (error: any) => {
        console.error('Error fetching shifts:', error);
      },
    });
  }

  fetchCostCenter(): void {
    this.commonService.getRefDetailsByType(this.costCenter).subscribe({
      next: (costCenters) => {
        this.costCenterList = costCenters;
        console.log('Fetched Cost Centers:', this.costCenterList);

        // Optional: Set a default selected cost center (if applicable)
        const data = history.state.employeeData;
        if (data) {
          this.selectedCostCenter = this.costCenterList.find((cost) => {
            return cost.id === data.employeeBean.costCenterId;
          });
          console.log('cost center', this.selectedCostCenter);
        }
      },
      error: (error) => {
        console.error('Error fetching cost centers:', error);
      },
    });
  }
  fetchDivision(): void {
    this.commonService.getRefDetailsByType(this.Divisions).subscribe({
      next: (divisions) => {
        this.divisionList = divisions;
        console.log('Fetched Divisions:', this.divisionList);

        // Optional: Set a default selected division (if applicable)
        const data = history.state.employeeData;
        if (data) {
          this.selectedDivision = this.divisionList.find((division) => {
            return division.id === data.employeeBean.divisionId; // Assuming the employee object has a divisionId
          });
          console.log('Selected Division:', this.selectedDivision);
        }
      },
      error: (error) => {
        console.error('Error fetching divisions:', error);
      },
    });
  }
  fetchEmployeeStatusType(): void {
    console.log(this.Employee_Status);
    this.commonService.getRefDetailsByType(this.Employee_Status).subscribe({
      next: (employeeStatusTypes) => {
        this.employeeStatusList = employeeStatusTypes;
        console.log('Fetched Employee Status Types:', this.employeeStatusList);

        // Optional: Set a default selected employee status (if applicable)
        const data = history.state.employeeData;
        if (data) {
          this.selectedEmployeeStatus = this.employeeStatusList.find(
            (status) => {
              return status.commonRefValue === data.employeeBean.employeeStatus; // Assuming the employee object has employeeStatus
            }
          );
          console.log('Selected Employee Status:', this.selectedEmployeeStatus);
        }
      },
      error: (error) => {
        console.error('Error fetching employee status types:', error);
      },
    });
  }

  downloadFile(fileName: string) {
    // Handle the file download logic (you can use your service to fetch the file)
    console.log('Downloading file for:', fileName);
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

  addBankDetail() {
    const bankDetails = this.empBankDetails.get('bankDetails') as FormArray;
    bankDetails.push(this.createBankDetails());
  }
  removeBankDetail(index: number) {
    const bankDetails = this.empBankDetails.get('bankDetails') as FormArray;
    bankDetails.removeAt(index);
  }

  fetchQualificationArea(): void {
    console.log(this.qualificationArearef);
    this.commonService
      .getRefDetailsByType(this.qualificationArearef)
      .subscribe({
        next: (types) => {
          this.qualificationAreaList = types;
          console.log(this.qualificationAreaList);
        },
        error: (error: any) => {
          console.error('Error fetching  types:', error);
        },
      });
  }
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

  async submitAllForms(): Promise<void> {
    this.employeeBasicDetails.value.organizationId = this.organizationId;
    console.log('Step1 ', this.employeeBasicDetails.value.id);

    console.log(history.state.employeeData.employeeBean.id);

    this.employeeBasicDetails.patchValue({
      id: history.state.employeeData.employeeBean.id,
    });

    console.log(this.employeeBasicDetails);

    // this.employeeBasicDetails.value.id =
    //   history.state.employeeData.employeeBean.id;

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
    console.log('test', this.employeeBasicDetails.value.id);

    const employeeData = this.employeeBasicDetails.value;
    const familyDetailsData = this.empFamilyDetails.get('familyDetails')?.value; // FormArray will also have .value
    const addressData = this.addressForm.get('addresses')?.value; // FormArray will also have .value
    const educationDetails = this.educationDetails.get('education')?.value;
    const bankDetails = this.empBankDetails.value;
    // Create the final object with all form data values
    this.checkAndSetRejectedStatus();

    const allFormData = {
      employeeBean: employeeData,
      employeeFamilyBeanList: familyDetailsData, // Array of family details (should not be null)
      addressBeanList: addressData,
      employeeEducationBeanList: educationDetails,
      employeeBankDetails: bankDetails,
      approvalStatus: this.approvalStatus,
    };
    console.log(allFormData);
    this.employeeService
      .updateEmployeeApprove(allFormData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['layout/employee/employeeformstage']);
        },
        error: (err: any) => {
          console.error('Error updating employee', err);
        },
      });
  }
  approvalStatus: string = '';
  checkAndSetRejectedStatus(): void {
    if (
      this.employeeBasicDetails.value.stepperOneStatus != 1 ||
      this.employeeBasicDetails.value.stepperTwoStatus != 1 ||
      this.employeeBasicDetails.value.stepperThreeStatus != 1 ||
      this.empBankDetails.value.stepperStatus != 1 ||
      this.permanentAddress.value.stepperStatus != 1 ||
      this.temporaryAddress.value.stepperStatus != 1
    ) {
      this.approvalStatus = 'Rejected';
    } else {
      this.approvalStatus = 'Approval';
    }
    const educationArray = this.educationDetails.get('education') as FormArray; // Cast to FormArray
    if (educationArray) {
      for (let educationControl of educationArray.controls) {
        const educationStatus = educationControl.get('stepperStatus')?.value;
        if (educationStatus != 1) {
          this.approvalStatus = 'Rejected';
          break; // Exit loop if any education entry is rejected
        }
        // this.approvalStatus = 'Approval';
      }
    }

    const familyArray = this.empFamilyDetails.get('familyDetails') as FormArray; // Cast to FormArray
    if (familyArray) {
      for (let familyControl of familyArray.controls) {
        const familyStatus = familyControl.get('stepperStatus')?.value;
        if (familyStatus != 1) {
          this.approvalStatus = 'Rejected';
          break; // Exit loop if any family entry is rejected
        }
        // this.approvalStatus = 'Approval';
      }
    }
  }

  approvalStatusMethod() {
    this.checkAndSetRejectedStatus();

    const dialogRef = this.dialog.open(ApproveDialogComponent, {
      width: '40%',
      height: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { status, remarks } = result;
        this.remarks = remarks;
        if (remarks && status !== WorkOrderStatus.CANCEL) {
          console.log(this.employeeBasicDetails.value);
          console.log(this.empFamilyDetails.value);

          this.updateApprovalStatus(this.approvalStatus);
          console.log(this.approvalStatus);
          this.submitAllForms();
        }
      }
    });
  }

  updateApprovalStatus(status: string) {
    this.employeeBasicDetails.patchValue({
      id: history.state.employeeData.employeeBean.id,
    });
    this.approvalsService
      .updateApprovalStatus(
        this.employeeBasicDetails.value.id,
        this.approveStatusBean.workFlowTypeId,
        this.user.userId,
        status,
        this.remarks
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate(['layout/employee/employeeformstage']);
        },
        error: (err) => {
          console.error('Error updating Approvals', err);
        },
      });
  }
}
