import { IIndentItems } from './indentDto';
import { QuotationItems } from './quotation';

export interface IApprovals {
  entityId: number;
  incidentId: number;
  stageId: number;
  stageName: string;
  workflowTypeId: number;
  roleId: number;
}

export class Approvals implements IApprovals {
  entityId: number = 0;
  incidentId: number = 0;
  stageId: number = 0;
  stageName: string = '';
  workflowTypeId: number = 0;
  roleId: number = 0;
}

export class ApprovalIndentDto {
  indentId: number = 0;
  indentCode: string = '';
  createdDate: any;
  createdUserName: string = '';
  requiredDate: any;
  indentStatus: string = '';
  projectId: number = 0;
  projectName: string = '';
  workflowTypeId: number = 0;
  currentStageName: string = '';
  indentReceivedDate: any;
  indentApprovedDate: any;
  currentStageOwner: string = '';
  currentStageStatus: string = '';
  indentItems: IIndentItems[] = [];
  quotationId: number = 0;
  quotationItems: QuotationItems[] = [];
  status: string = '';
}
