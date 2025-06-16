
export interface IVendor {
  id: number;
  orgId: number;
  dateOfJoining: any;
  projectId: number;
  vendorCode: string;
  vendorName: string;
  vendorTypeId:number,
  companyName: string;
  permanentAddress: string;
  presentAddress: string;
  contactNumber: string;
  email: string;
  gstNumber: string;
  panNumber: string;
  aadharNumber: number;
  msmeNumber: string;
  bocwLicenseNumber: string;
  bankName: string;
  ifscCode: string;
  accountNumber: number;
  status: string;
}

export class Vendor implements IVendor {
  id: number = 0;
  orgId: number = 0;
  dateOfJoining: any;
  projectId: number = 0;
  vendorCode: string = '';
  vendorName: string = '';
  vendorTypeId:number=0;
  companyName: string = '';
  permanentAddress: string = '';
  presentAddress: string = '';
  contactNumber: string = '';
  email: string = '';
  gstNumber: string = '';
  panNumber: string = '';
  aadharNumber: number = 0;
  msmeNumber: string = '';
  bocwLicenseNumber: string = '';
  bankName: string = '';
  ifscCode: string = '';
  accountNumber: number = 0;
  status: string='';
}

export interface IVendorDto {
  id: number;
  orgId: number;
  dateOfJoining: any;
  vendorCode: string;
  vendorName: string;
  vendorType:number;
  projectName: string;
  companyName: string;
  contactNumber: string;
  email: string;
  status: string;
}
export class VendorDto implements IVendorDto {
  id: number = 0;
  orgId: number = 0;
  dateOfJoining: any;
  vendorCode: string = '';
  vendorName: string = '';
  vendorType:number=0;
  projectName: string = '';
  companyName: string = '';
  contactNumber: string = '';
  email: string = '';
  status: string='';
}
