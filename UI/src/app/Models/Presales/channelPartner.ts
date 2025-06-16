export interface IChannelPartnerRegisterBean {
  id: number;
  name: string;

  email: string;
  phoneNumber: any;
  password: any;
  officeNumber: any;
  address: string;
  companyName: string;
  companyWebsite: string;
  registeredDate: Date;
  dateOfBirth: Date;
  idProofs: any;
  idProofNumber: any;
  showAdditionalFields: any;
  // showAdditionalFields: boolean;
  personName: string;
  personPhoneNumber: number;
  personemail: string;
  designation: string;
  reraExpDate: Date;
  isCanBulkUpload: string;
  bulkUploadLimit: number;
  isCallSupportAvailable: string;
  aadharUrl: string;
  panUrl: string;
  reraUrl: string;
  personUrl: string;
  gstCertificateUrl: string;
  status: string;
  cpUserId: number;
  pageUrl: string;
  gstNumber: string;
  reraNumber: string;
  alternatePhoneNumber: string;
  aadharNumber:string;
  panNumber:string;
  sourceId:number;
  isFromNewChannelPartner:boolean;
  isToggled:boolean;
}

export class ChannelPartnerRegisterBean implements IChannelPartnerRegisterBean {
  id: number = 0;
  name: string = '';
  email: string = '';
  phoneNumber: any;
  password: any;
  officeNumber: any;
  address: string = '';
  companyName: string = '';
  companyWebsite: string = '';
  registeredDate!: Date;
  dateOfBirth!: Date;
  idProofs: any;
  idProofNumber: any;
  showAdditionalFields: any;
  personName: string = '';
  personPhoneNumber: number = 0;
  personemail: string = '';
  designation: string = '';
  reraExpDate!: Date;
  isCanBulkUpload: string = '';
  bulkUploadLimit: number = 0;
  isCallSupportAvailable: string = '';
  aadharUrl: string = '';
  panUrl: string = '';
  reraUrl: string = '';
  personUrl: string = '';
  gstCertificateUrl: string = '';
  status: string = '';
  cpUserId: number = 0;
  pageUrl: string = '';
  gstNumber: string = '';
  reraNumber: string = '';
  alternatePhoneNumber: string = '';
  aadharNumber:string='';
  panNumber:string='';
  sourceId:number=0;
  isFromNewChannelPartner:boolean=false;
  isToggled:boolean=false;
}

export interface CPTeamDashBoardDataDto {
  userId: number;
  userName: string;
  registeredLeads: number;
  noOfFollowups: number;
  noOfSiteVisitDone: number;
  booked: number;
  bookedCancelled: number;
}

export interface CPDashBoardData {
  userId: number;
  userName: string;
  assignedLeadIds: number[];
  assignedLeads: number;
  siteVisitDone: number;
  siteVisitDoneId: number;
  followUps: number;
  followUpsStatusId: number;
  booked: number;
  bookedStatusId: number;
  nonContactable: number;
  nonContactableStatusId: number;
  siteVisitConfirm: number;
  siteVisitConfirmStatusId: number;
  visitProspect: number;
  visitProspectStatusId: number;
  qualified: number;
  qualifiedStatusId: number;
  bookedCancelled: number;
  bookedCancelledStatusId: number;
  lost: number;
  lostStatusId: number;
}
