export interface IPaymentCount {
  totalAmount: number;
  formatedAmount: string;
  saleAgreementCount:number;
  pendingSaleAgreementCount:number;
  availableCount:number;
  bookedCount:number;
  blockedCount:number;
  reworkSaleAgreementCount:number;
}
export class PaymentCount implements IPaymentCount {
  totalAmount: number = 0;
  formatedAmount: string = '';
  saleAgreementCount:number=0
  pendingSaleAgreementCount:number=0
  availableCount:number=0;
  bookedCount:number=0;
  blockedCount:number=0;
  reworkSaleAgreementCount:number=0;
}
export interface IDocumentDto {
  documentId: number;
  documentPath: string;
  documentName: string;
  projectName: string;
  applicantName: string;
  createdDate: string;
  applicantId: number;
}
export class DocumentDto implements IDocumentDto {
  documentId: number = 0;
  documentPath: string = '';
  documentName: string = '';
  projectName: string = '';
  applicantName: string = '';
  createdDate: string = '';
  applicantId: number = 0;
}
export interface IApprovedCount {
  approvedAmount: number;
  waitingForApprovalAmount: number;
  formattedApprovedAmount: string;
  formattedWaitingForApprovalAmount: string;
  approvedTdsAmount: string;
  waitingForApprovalTdsAmount: string;
}

export class ApprovedCount implements IApprovedCount {
  approvedAmount: number = 0;
  waitingForApprovalAmount: number = 0;
  formattedApprovedAmount: string = '';
  formattedWaitingForApprovalAmount: string = '';
  approvedTdsAmount: string = '';
  waitingForApprovalTdsAmount: string = '';
}
