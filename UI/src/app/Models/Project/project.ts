export interface IProject {
  projectId: number;
  projectCode: string;
  projectName: string;
  projectAddress: string;
  projectLocation: string;
  blocks: number;
  levels: number;
  noOfUnits: number;
  groundFloor: string;
  basement: string;
  status: string;
  projectStatus: any;
  typeId: number;
  currencyId: number;
  landArea: number;
  description: string;
  organizationId: number;
  phoneNumber: string;
  email: string;
  projectCity: string;
  projectPincode: string;
  projectGstinUin: string;
  projectState: string;
  projectPan: string;
  companyName: string;
  companyAddress: string;
  companyLogoUrl: string;
  ifscCode: string;
  bankName: string;
  bankAddress: string;
  typeOfAccount: string;
  accountNumber: string;
  reraNumber: string;
  displayProjectName: string;
}

export class Project implements IProject {
  projectId: number = 0;
  projectCode: string = '';
  projectName: string = '';
  projectAddress: string = '';
  projectLocation: string = '';
  landArea: number = 0;
  description: string = '';
  blocks: number = 0;
  levels: number = 0;
  noOfUnits: number = 0;
  groundFloor: string = '';
  basement: string = '';
  typeId: number = 0;
  currencyId: number = 0;
  status: string = '';
  projectStatus: any;
  organizationId: number = 0;
  phoneNumber = '';

  email: string = '';
  projectCity: string = '';
  projectPincode: string = '';
  projectGstinUin: string = '';
  projectState: string = '';
  projectPan: string = '';
  companyName: string = '';
  companyAddress: string = '';
  companyLogoUrl: string = '';

  ifscCode: string = '';
  bankName: string = '';
  bankAddress: string = '';
  typeOfAccount: string = '';
  accountNumber: string = '';
  reraNumber: string = '';
  displayProjectName: string = '';
}

export interface IProjectDto {
  projectId: number;
  projectCode: string;
  projectName: string;
  status: string;
  projectStatus: any;
  projectType: string;
  currencyType: string;
  phoneNumber: string;
}

export class ProjectDto implements IProjectDto {
  projectId: number = 0;
  projectCode: string = '';
  projectName: string = '';
  projectType: string = '';
  currencyType: string = '';
  status: string = '';
  projectStatus: any;
  phoneNumber = '';
}

export interface ICustomerLegalDocument {
  id: number;
  documentName: string;
  documentPath: string;
  referanceId: any;
  documentType: any;
  subFolder: any;
  folderName: any;
}

export class CustomerLegalDocument implements ICustomerLegalDocument {
  id: number = 0;
  documentName: string = '';
  documentPath = '';
  referanceId = '';
  documentType = '';
  subFolder = '';
  folderName = '';
}

export interface IProjectDocuments {
  documentId: number;
  documentPath: string;
  documentName: string;
  projectName: string;
}
export class ProjectDocuments implements IProjectDocuments {
  documentId: number = 0;
  documentPath: string = '';
  documentName: string = '';
  projectName: string = '';
}

export interface IDocumentUrlDto {
  adharCard: string;
  panCard: string;
  bookingUrl: string;
  salesAgreementUrl: string;
  costSheet: string;
  [key: string]: string;
}
export class DocumentUrlDto implements IDocumentUrlDto {
  [key: string]: string;

  adharCard: string = '';
  panCard: string = '';
  bookingUrl: string = '';
  salesAgreementUrl: string = '';
  costSheet: string = '';
}

export interface IProjectDetails {
  id: number;
  companyName: string;
  companyAddress: string;
  companyLogoUrl: string;
  accountNum: string;
  bankName: string;
  bankAddress: string;
  accountType: string;
  ifscCode: string;
  projectId: number;
  typeId: number;
  gstIn: string;
  status: string;
}
export class ProjectDetails implements IProjectDetails {
  id: number = 0;
  companyName: string = '';
  companyAddress: string = '';
  companyLogoUrl: string = '';
  accountNum: string = '';
  bankName: string = '';
  bankAddress: string = '';
  accountType: string = '';
  ifscCode: string = '';
  projectId: number = 0;
  typeId: number = 0;
  gstIn: string = '';
  status: string = '';
}
