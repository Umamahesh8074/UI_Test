// Interface for Employee
export interface IEmployee {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: Date;
  gender: string;
  address: string;
  city: string;
  state: string;
  postalCode: number;
  department: number;
  designation: string;
  dateOfJoining: Date;
  employeeStatus: string;
  reportingManager: number;
  employeeRoleId: number;
  workLocation: string;
  maritalStatus: string;
  nationalId: string;
  projectAssigned: number;

  dateOfResignation: Date;
  noticePeriodEndDate: Date;
  lastWorkingDay: Date;
  panId: string;

  shiftId: number;
  status: string;
  userId: number;
  isAddAsUserNeeded: string;
  shift: string;

  disignation: string;

  title: string;

  religion: string;

  cast: string;

  bloodGroup: string;

  height: string;

  weight: string;

  identificationMark: string;

  fatherName: string;

  marriageDate: Date;

  spouseName: string;

  nationality: string;

  country: string;

  plcaeOfBirth: string;

  physicallyChallenged: string;

  personalEmail: string;
  age: number;

  emergencyContactName: string;

  emergencyContactNumber: string;

  policeStationLimits: string;

  esiNumber: string;

  esiDisrubbed: string;

  pfUanNo: string;

  adharUrl: string;

  panUrl: string;
  voterIdUrl: string;
  passPortUrl: string;
  rationCardUrl: string;

  divisionId: number;

  costCenterId: number;

  confirmationDate: Date;

  probationPeriod: number;

  referredBy: number;

  gradeId: number;

  company: string;

  isPmsEligible: string;

  formStatusOne: number;
  formStatusval: string;

  stepperOneStatus: number;
  stepperTwoStatus: number;
  stepperThreeStatus: number;
}

// Class implementing the IEmployee interface
export class Employee implements IEmployee {
  id: number = 0;
  employeeId: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  dateOfBirth: Date = new Date();
  gender: string = '';
  address: string = '';
  city: string = '';
  state: string = '';
  postalCode: number = 0;
  department: number = 0;
  designation: string = '';
  dateOfJoining: Date = new Date();
  employeeStatus: string = '';
  reportingManager: number = 0;
  employeeRoleId: number = 0;
  workLocation: string = '';
  maritalStatus: string = '';
  nationalId: string = '';
  projectAssigned: number = 0;

  dateOfResignation: Date = new Date();
  noticePeriodEndDate: Date = new Date();
  lastWorkingDay: Date = new Date();
  panId: string = '';

  shiftId: number = 0;
  status: string = '';
  userId: number = 0;
  isAddAsUserNeeded: string = '';
  shift: string = '';

  disignation: string = '';

  title: string = '';

  religion: string = '';

  cast: string = '';

  bloodGroup: string = '';

  height: string = '';

  weight: string = '';

  identificationMark: string = '';

  fatherName: string = '';

  marriageDate: Date = new Date();

  spouseName: string = '';

  nationality: string = '';

  country: string = '';

  plcaeOfBirth: string = '';

  physicallyChallenged: string = '';

  personalEmail: string = '';

  age: number = 0;

  emergencyContactName: string = '';

  emergencyContactNumber: string = '';

  policeStationLimits: string = '';

  esiNumber: string = '';

  esiDisrubbed: string = '';

  pfUanNo: string = '';

  adharUrl: string = '';

  panUrl: string = '';
  voterIdUrl: string = '';
  passPortUrl: string = '';
  rationCardUrl: string = '';
  divisionId: number = 0;
  costCenterId: number = 0;
  confirmationDate: Date = new Date();
  probationPeriod: number = 0;
  referredBy: number = 0;
  gradeId: number = 0;
  company: string = '';
  isPmsEligible: string = '';
  formStatusOne: number = 413;
  formStatusval: string = '';
  stepperOneStatus: number = 0;
  stepperTwoStatus: number = 0;
  stepperThreeStatus: number = 0;
}

export class EmployeeDto {
  id: number = 0;
  employeeId: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  dateOfBirth: Date = new Date();
  gender: string = '';
  address: string = '';
  city: string = '';
  state: string = '';
  postalCode: number = 0;
  department: string = '';
  designation: string = '';
  dateOfJoining: Date = new Date();
  employeeStatus: string = '';
  reportingManager: number = 0;
  reportingManagerName: string = '';
  employeeRoleId: number = 0;
  employeeRoleName: string = '';
  workLocation: string = '';
  maritalStatus: string = '';
  nationalId: string = '';
  projectAssigned: number = 0;
  projectName: string = '';

  dateOfResignation: Date = new Date();
  noticePeriodEndDate: Date = new Date();
  lastWorkingDay: Date = new Date();
  panId: string = '';

  shiftId: number = 0;
  shiftTiming: string = '';
  status: string = '';
  userId: number = 0;
  organizationId: number = 0;
  shift: string = '';
}
export class Page<T> {
  pageNo: number = 0;
  pageSize: number = 0;
  last: boolean = false;
  first: boolean = false;
  totalPages: number = 0;
  records: any;
  totalRecords: number = 0;
}

export interface Iaddress {
  addressId: number;
  employeeId: number;
  doorNo: string;
  houseOwnerName: string;
  streetOrRoad: string;
  post: string;
  city: string;
  pincode: string;
  state: string;
  policeStationLimits: string;
  typeOfAddress: string;
  isPointOfContact: string;
  stepperStatus: number;
}

export class address implements Iaddress {
  addressId: number = 0;
  employeeId: number = 0;
  doorNo: string = '';
  houseOwnerName: string = '';
  streetOrRoad: string = '';
  post: string = '';
  city: string = '';
  pincode: string = '';
  state: string = '';
  policeStationLimits: string = '';
  typeOfAddress: string = '';
  isPointOfContact: string = '';
  stepperStatus: number = 0;
}
export interface IEmpFamilyDetails {
  id: number;
  name: string;
  relationship: string;
  contactNo: string;
  dateOfBirth: Date;
  age: number;
  remarks: string;
  address: string;
  email: string;
  country: string;
  pincode: string;
  city: string;
  employeeId: number;
  stepperStatus: number;
  familyMemberId: string;
}

export class EmpFamilyDetails implements IEmpFamilyDetails {
  id: number = 0;
  name: string = '';
  relationship: string = '';
  contactNo: string = '';
  dateOfBirth: Date = new Date();
  age: number = 0;
  remarks: string = '';
  address: string = '';
  email: string = '';
  country: string = '';
  pincode: string = '';
  city: string = '';
  employeeId: number = 0;
  stepperStatus: number = 0;
  familyMemberId: string = '';
}
export interface IEducationDetails {
  id: number;
  qualification: string;
  institute: string;
  qualificationArea: string;
  grade: string;
  remarks: string;
  startDate: Date;
  endDate: Date;
  employeeId: number;
  stepperStatus: number;
}
export class EducationDetails implements IEducationDetails {
  id: number = 0;
  qualification: string = '';
  institute: string = '';
  qualificationArea: string = '';
  grade: string = '';
  remarks: string = '';
  startDate: Date = new Date();
  endDate: Date = new Date();
  employeeId: number = 0;
  stepperStatus: number = 0;
}
export interface IBankDetails {
  id: number;
  employeeId: number;
  bankName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  accountType: string;
  accountOpeningDate: Date;
  aadhaarNumber: string;
  panNumber: string;
  esicInclude: string;
  esicNumber: string;
  pfInclude: string;
  pfNumber: string;
  uanNumber: string;
  lwfInclude: string;
  mobileNumber: string;
  status: string;
  stepperStatus: number;
}
export class BankDetails implements IBankDetails {
  id: number = 0;
  employeeId: number = 0;
  bankName: string = '';
  bankAccountNumber: string = '';
  bankIfscCode: string = '';
  accountType: string = '';
  accountOpeningDate: Date = new Date();
  aadhaarNumber: string = '';
  panNumber: string = '';
  esicInclude: string = ''; // 'Yes' or 'No'
  esicNumber: string = '';
  pfInclude: string = ''; // 'Yes' or 'No'
  pfNumber: string = '';
  uanNumber: string = '';
  lwfInclude: string = ''; // 'Yes' or 'No'
  mobileNumber: string = '';
  status: string = '';
  stepperStatus: number = 0;

  constructor() {
    // Default constructor
  }
}

export class EmployeeSaveDto {
  employeeBean!: Employee;

  addressBeanList: address[] = [];
  employeeEducationBeanList: EducationDetails[] = [];
  employeeBankDetails: BankDetails = new BankDetails();
  employeeFamilyBeanList: EmpFamilyDetails[] = [];
  approvalStatus: string = '';
}

export class EmployeeApprovalDto {
  empId: number = 0;
  employeeId: string = '';
  empFirstName: string = '';
  empLastName: string = '';
  employeeDoj: Date = new Date();
  designation: string = '';
  workFlowId: number = 0;
  workflowStageName: string = '';
  workFlowStatus: string = '';
  workFlowTypeId: number = 0;
}
