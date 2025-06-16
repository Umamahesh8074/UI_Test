export interface ILead {
  id: number | undefined | null;
  name: string | null | undefined;
  phoneNumber?: string | null;
  alternatePhoneNumber?: string | null;
  address: string | null;
  location: string | null;
  pincode: string | null;
  email: string | null;
  gender: string | null;
  designation: string | null;
  companyName: string | null;
  typeId: number | null;
  statusId: number;
  sourceId: number;
  subSourceId?: number | null;
  budget: string;
  preferredFlatType: string | null;
  remarks: string | null;
  campaignName: string | null;
  projectId: number;
  isAssigned?: any;
  assignedToPreSales: number;
  assignedToSales: number;
  subStatusId: number;
  referredCustomerProjectId: number;
  customerUnitName: string;
  referredEmployeeId: number;
  referredEmployeeName: string;
  otherLostReason: string;
  isExpired: string;
  expiredDate: any;
  mcubeAudio: string;
  isAcquiredLead: string;
  digitalPartner: any;
}
export class Lead implements ILead {
  id: number = 0;
  name: string = '';
  phoneNumber: string = '';
  alternatePhoneNumber: string = '';
  status: string = '';
  address: string = '';
  email: string = '';
  gender: string = '';
  designation: string = '';
  typeId: number = 0;
  sourceId: number = 0;
  subSourceId: number = 0;
  budget: string = '';
  preferredFlatType: string = '';
  remarks: string = '';
  campaignName: string = '';
  location: string = '';
  pincode: string = '';
  companyName: string = '';
  statusId: number = 0;
  projectId: number = 0;
  isAssigned?: any = 0;
  assignedToPreSales: number = 0;
  assignedToSales: number = 0;
  subStatusId: number = 0;
  referredCustomerProjectId: number = 0;
  customerUnitName: string = '';
  referredEmployeeId: number = 0;
  referredEmployeeName: string = '';
  otherLostReason: string = '';
  starCount: any;
  isExpired: string = '';
  expiredDate: any;
  mcubeAudio: string = '';
  isAcquiredLead = '';
  digitalPartner = '';
}

export interface ILeadType {
  id: number;
  value: string;
}

export interface ILeadDto {
  id: number;
  name: string;
  gender: string;
  phoneNumber: string;
  alternatePhoneNumber: string;
  email: string;
  address: string;
  designation: string;
  type: string;
  status: string;
  budget: string;
  sourceName: string | null;
  subSourceName: string | null;
  agencyId: number | null;
  preferredFlatType: string;
  assigneeId: number | null;
  remarks: string;
  campaignName: string;
  projectName: string;
  homeLocation: string | null;
  workLocation: string | null;
  createdDate: any;
  assignedPresalesUserName: string | null;
  assignedSalesUserName: string | null;
  opportunityId: string | null;
  starCount: number;
  isRegisteredWithAnotherProject: number;
  isSiteVisitDoneInAnotherProject: number;
}

export interface MapDto {
  status: string;
  value: number;
  statusId: number;
}

export interface TeamDashBoardDataDto {
  status: string;
  userId: number;
  userName: string;
  assignedLeads: number;
  noOfFollowups: number;
  noOfSiteVisitConfirm: number;
  noOfSiteVisitDone: number;
}

export class LeadDto implements ILeadDto {
  id = 0;
  name = '';
  gender = '';
  phoneNumber = '';
  alternatePhoneNumber = '';
  email = '';
  address = '';
  designation = '';
  type = '';
  status = '';
  budget = '';
  sourceName: string | null = null;
  subSourceName: string | null = null;
  agencyId: number | null = null;
  preferredFlatType = '';
  assigneeId: number | null = null;
  remarks = '';
  campaignName = '';
  projectName = '';
  homeLocation = '';
  workLocation = '';
  createdDate: any;
  assignedPresalesUserName: string | null = null;
  assignedSalesUserName: string | null = null;
  opportunityId: string | null = null;
  starCount: number = 0;
  isRegisteredWithAnotherProject: number = 0;
  isSiteVisitDoneInAnotherProject: number = 0;
  isAcquiredLead: string = '';
  expireDate: any;
  digitalPartner: any;
}
export interface ILeadHistoryDto {
  leadId: number;
  leadName: string | null;
  leadStatus: string | null;
  recordedDate: any;
  note: string | null;
  assignedToPresale: any;
  presaleMemberName: string | null;
  assignedToSale: any;
  saleMemberName: string | null;
}

export class LeadHistoryDto implements ILeadHistoryDto {
  leadId: number = 0;
  leadName: string | null = '';
  leadStatus: string | null = '';
  recordedDate: any;
  note: string | null = '';
  assignedToPresale: any;
  presaleMemberName: string | null = '';
  assignedToSale: any;
  saleMemberName: string | null = '';
  opportunityId: string | null = '';
}

export class TotalLeadsDto {
  id: number = 0;
  assignedToPresales: string = '';
  assignedToSales: string = '';
  budget: string = '';
  campaignName: string = '';
  email: string = '';
  name: string = '';
  phoneNumber: string = '';
  projectName: string = '';
  sourceName: string = '';
  status: string = '';
  subSourceName: string = '';
  opportunityId: string = '';
  isProcessed: string = '';
  unitName: string = '';
}

export interface ILeadFilterDto {
  name: string;
  phoneNumber: string;
  sourceId: any;
  subSourceId: any;
  dateRange: number;
  startDate: any;
  endDate: any;
  projectId: any;
  page: number;
  size: number;
  digitalPartner: any;
  campaginName: any;
  isExportExcel: any;
}

export interface LeadMcubeAudio {
  id: number;
  leadId: number;
  audioFile: string;
  createdDate: any;
  calledTo: string;
  assignedTo: string;
  isPlaying?: boolean;
  currentTime?: number;
  duration?: number;
}

export interface IApplicantLeadDto {
  name: String;
  phoneNumber: string;
  gender: string;
  email: string;
  sourceId: number;
  leadSourceName: string;
  subSourceId: number;
  leadSubSourceName: string;
  projectId: number;
  preSalesName: string;
  salesName: string;
  preSalesId: number;
  salesId: number;
}

export class ApplicantLeadDto implements IApplicantLeadDto {
  name: String = '';
  phoneNumber: string = '';
  gender: string = '';
  email: string = '';
  sourceId: number = 0;
  leadSourceName: string = '';
  subSourceId: number = 0;
  leadSubSourceName: string = '';
  projectId: number = 0;
  preSalesName: string = '';
  salesName: string = '';
  preSalesId: number = 0;
  salesId: number = 0;
}

export interface ILeadTransfer {
  id: number;
  leadId: number;
  requestedSourceId: number;
  requestedSubSourceId: number;
  projectId:number
}

export class LeadTransfer implements ILeadTransfer {
  id: number = 0;
  leadId: number = 0;
  requestedSourceId: number = 0;
  requestedSubSourceId: number = 0;
  projectId: number = 0;
}
