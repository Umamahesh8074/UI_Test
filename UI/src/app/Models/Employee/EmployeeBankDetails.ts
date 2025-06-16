export interface IEmployeeBankDetails {
  id: number;
  employeeId: string;
  bankName: string;
  bankAccountNumber: string;
  bankIfscCode: string;
  accountType: string;
  accountOpeningDate: Date;
  aadhaarNumber: string;
  panNumber: string;
  esicNumber: string;
  mobileNumber: string;
  status: string;
}

export class EmployeeBankDetails implements IEmployeeBankDetails {
  id: number = 0;
  employeeId: string = '';
  bankName: string = '';
  bankAccountNumber: string = '';
  bankIfscCode: string = '';
  accountType: string = '';
  accountOpeningDate: Date = new Date();
  aadhaarNumber: string = '';
  panNumber: string = '';
  esicNumber: string = '';
  mobileNumber: string = '';
  status: string = '';
}
