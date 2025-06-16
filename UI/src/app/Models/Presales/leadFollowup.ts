export interface ILeadFollowup {
  id: number;
  leadId: number;
  followupDate: any;
  typeId: number;
  statusId: number;
  remarks: string;
  isDone: string;
  followupType: string;
  opportunityId: string;
}

export class LeadFollowup implements ILeadFollowup {
  id: number = 0;
  leadId: number = 0;
  followupDate: any;
  typeId: number = 0;
  statusId: number = 0;
  remarks: string = '';
  isDone: string = '';
  followupType: string = '';
  opportunityId: string = '';
}

// export class LeadFollowupDto {
//   id: number = 0;
//   leadName: string = '';
//   followupDate: any;
//   type: string = '';
//   remarks: string = '';
//   status: string = '';
//   leadId: number = 0;
//   isDone: string = '';
// }

export interface ILeadFollowupDto {
  id: number;
  followupDate: any;
  type: string;
  remarks: string;
  status: string;
  leadName: string;
  assignedToSales: number;
  assignedToPreSales: number;
  leadId: number;
  followupType: string;
  opportunityId: string;
}

export class LeadFollowupDto implements ILeadFollowupDto {
  id: number = 0;
  followupDate: any;
  type: string = '';
  remarks: string = '';
  status: string = '';
  leadName: string = '';
  assignedToSales = 0;
  assignedToPreSales = 0;
  leadId: number = 0;
  followupType: string = '';
  opportunityId: string = '';
}
