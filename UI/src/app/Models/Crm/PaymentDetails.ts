export interface IPaymentDetails {
  paymentDetailsId: number;

  paidAmount: number;

  paidAmountInWords: string;

  referenceNumber: string;

  paymentDate: string;

  balanceAmount: number;

  balanceAmountInWords: string;

  applicantId: number;

  paymenetStatus: string;

  stageId: number;

  paymentTypeId: number;

  bankName: string;

  branchName: string;

  ifcCode: string;

  accountNumber: number;

  sourceId: number;

  stageTotalAmount: number;

  stageTds: number;

  status: string;
}
export class PaymentDetails implements IPaymentDetails {
  paymentDetailsId: number = 0;

  paidAmount: number = 0;

  paidAmountInWords: string = '';

  referenceNumber: string = '';

  paymentDate: string = '';

  balanceAmount: number = 0;

  balanceAmountInWords: string = '';

  applicantId: number = 0;

  paymenetStatus: string = '';

  stageId: number = 0;

  paymentTypeId: number = 0;

  bankName: string = '';

  branchName: string = '';

  ifcCode: string = '';

  accountNumber: number = 0;

  sourceId: number = 0;

  stageTotalAmount: number = 0;

  stageTds: number = 0;

  status: string = '';
}
export interface IPaymentDetailsDto {
  paymentDetailsId: number;

  paidAmount: number;

  paidAmountInWords: string;

  referenceNumber: number;

  paymentDate: string;

  balanceAmount: number;

  balanceAmountInWords: string;

  applicantId: number;

  paymenetStatus: string;

  stageId: number;

  paymentTypeId: number;

  bankName: string;
  branchName: string;
  ifcCode: string;
  accountNumber: number;
  sourceId: number;
  projectId: number;
  levelId: number;
  blockId: number;
  unitId: number;
  days: number;
  percentage: number;
  stageTotalAmount: number;
  stageTds: number;
  status: string;
  workflowTypeId: number;
  incidentId: number;
  commonReferenceDetailsId: number;
  userId: number;
  crmUserId: number;
  unitName: string;
  balconyArea: number;
  actionStatus: string;
  paymentReceiptUrl: string;
  transactionType: string;
  transactionTypeId: number;
  paidTds: number;
  formattedPaidAmount: string;
  formattedPendingAmount: String;
  formattedPaidAmountForApproval: string;
  formattedTotalExpectedAmount: string;
}
export class PaymentDetailsDto implements IPaymentDetailsDto {
  paymentDetailsId: number = 0;
  paidAmount: number = 0;
  paidAmountInWords: string = '';
  referenceNumber: number = 0;
  paymentDate: string = '';
  balanceAmount: number = 0;
  balanceAmountInWords: string = '';
  applicantId: number = 0;
  paymenetStatus: string = '';
  stageId: number = 0;
  paymentTypeId: number = 0;
  bankName: string = '';
  branchName: string = '';
  ifcCode: string = '';
  accountNumber: number = 0;
  sourceId: number = 0;
  status: string = '';
  projectId: number = 0;
  levelId: number = 0;
  blockId: number = 0;
  unitId: number = 0;
  days: number = 0;
  percentage: number = 0;
  stageTotalAmount: number = 0;
  stageTds: number = 0;
  workflowTypeId: number = 0;
  incidentId: number = 0;
  commonReferenceDetailsId: number = 0;
  userId: number = 0;
  crmUserId: number = 0;
  unitName: string = '';
  balconyArea: number = 0;
  actionStatus: string = '';
  paymentReceiptUrl: string = '';
  transactionType: string = '';
  transactionTypeId: number = 0;
  paidTds: number = 0;
  formattedPaidAmount: string = '';
  formattedPendingAmount: String = '';
  formattedPaidAmountForApproval: string = '';
  formattedTotalExpectedAmount: string = '';

  formattedPaidTds: string = '';
  formattedPendingTds: String = '';
  formattedTotalTds: string = '';
  formattedPaidTdsForApproval: string = '';
}
export interface ISaleAgreementDto {
  bookingId: number | null;
  firstApplicantFirstName: string;
  firstApplicantMiddleName: string;
  firstApplicantLastName: string;
  secondApplicantFirstName: string;
  secondApplicantMiddleName: string;
  secondApplicantLastName: string;
  firstApplicantPhoneNumber: string;
  secondApplicantPhoneNumber: string;
  firstApplicantAddress1: string;
  firstApplicantAddress2: string;
  firstApplicantCity: string;
  firstApplicantPincode: string;
  firstApplicantState: string;
  projectName: string;
  projectAddress: string;
  projectLocation: string;
  projectCity: string;
  companyName: string;
  companyAddress: string;
  companyLogoUrl: string;
  projectAccountNumber: string;
  ifscCode: string;
  bankName: string;
  bankAddress: string;
  typeOfAccount: string;
  blockName: string;
  unitName: string;
  unitTypeName: string;
  projectId: number | null;
  blockId: number | null;
  levelId: number | null;
  unitId: number | null;
  carpetArea: number;
  superBuiltUpArea: number;
  levelName: string;
  balconyArea: number;
  west: string;
  east: string;
  south: string;
  north: string;
  firstApplicantParentOrSpouse: string;
  secondApplicantParentOrSpouse: string;
  secondApplicantSalutation: string;
  firstApplicantSalutation: string;
  firstApplicantPanNumber: string;
  secondApplicantPanNumber: string;
  firstApplicantRelationToParent: string;
  secondApplicantRelationToParent: string;
  firstApplicantAadharNumber: string;
  secondApplicantAadharNumber: string;
  firstApplicantParentOrSpouseSalutation: string;
  secondApplicantParentOrSpouseSalutation: string;
  agrrementDateInWords: string;
  agrrementMonthInWords: string;
  agreementYearLastNumInWords: string;
  agreementDate: string;
  agreementMonth: string;
  agreementYearLastNum: string;
  udsArea: number;
  proportionateShare: number;
}
export class SaleAgreementDto implements ISaleAgreementDto {
  bookingId: number | null = null;
  firstApplicantFirstName: string = '';
  firstApplicantMiddleName: string = '';
  firstApplicantLastName: string = '';
  secondApplicantFirstName: string = '';
  secondApplicantMiddleName: string = '';
  secondApplicantLastName: string = '';
  firstApplicantPhoneNumber: string = '';
  secondApplicantPhoneNumber: string = '';
  firstApplicantAddress1: string = '';
  firstApplicantAddress2: string = '';
  firstApplicantCity: string = '';
  firstApplicantPincode: string = '';
  firstApplicantState: string = '';
  projectName: string = '';
  projectAddress: string = '';
  projectLocation: string = '';
  projectCity: string = '';
  companyName: string = '';
  companyAddress: string = '';
  companyLogoUrl: string = '';
  projectAccountNumber: string = '';
  ifscCode: string = '';
  bankName: string = '';
  bankAddress: string = '';
  typeOfAccount: string = '';
  blockName: string = '';
  unitName: string = '';
  unitTypeName: string = '';
  projectId: number | null = null;
  blockId: number | null = null;
  levelId: number | null = null;
  unitId: number | null = null;
  carpetArea: number = 0;
  superBuiltUpArea: number = 0;
  levelName: string = '';
  balconyArea: number = 0;
  west: string = '';
  east: string = '';
  south: string = '';
  north: string = '';
  firstApplicantParentOrSpouse: string = '';
  secondApplicantParentOrSpouse: string = '';
  secondApplicantSalutation: string = '';
  firstApplicantSalutation: string = '';
  firstApplicantPanNumber: string = '';
  secondApplicantPanNumber: string = '';
  firstApplicantRelationToParent: string = '';
  secondApplicantRelationToParent: string = '';
  firstApplicantAadharNumber: string = '';
  secondApplicantAadharNumber: string = '';
  firstApplicantParentOrSpouseSalutation: string = '';
  secondApplicantParentOrSpouseSalutation: string = '';
  agrrementDateInWords: string = '';
  agrrementMonthInWords: string = '';
  agreementYearLastNumInWords: string = '';
  agreementDate: string = '';
  agreementMonth: string = '';
  agreementYearLastNum: string = '';
  udsArea: number = 0;
  proportionateShare: number = 0;
}
export class CustomerPaymentDto {
  balanceAmount: number = 0;
  stageId: number = 0;
  stageTotalAmount: number = 0;
  unitName: string = '';
  stageName: string = '';
  unitId: number = 0;
  paymentDetailsId: number = 0;
  applicantId: number = 0;
  paidTds: number = 0;
}

export interface IPaymentLedgerDto {
  paymentLedgerId: number;
  applicantName: string;
  projectId: number;
  projectName: string;
  unitId: number;
  unitName: string;
  receivedAmount: number;
  paidAmountForApproval: number;
  PaymentDate: any;
  transactionType: number;
  transactionTypeName: string;
  paymentReceiptUrl: string;
  formattedReceivedAmount: string;
  formattedPaidAmountForApproval: string;
  actionStatusId: number;
  actionStatus: string;
  referenceNumber: string;
  branchName: string;
  bankName: string;
  paymentReceiptCode: string;
  sourceId: number;
  sourceName: string;
  paymentTypeId: number;
  paymentTypeName: string;
}
export class PaymentLedgerDto implements IPaymentLedgerDto {
  paymentLedgerId: number = 0;

  applicantName: string = '';

  projectId: number = 0;

  projectName: string = '';

  unitId: number = 0;

  unitName: string = '';

  receivedAmount: number = 0;

  paidAmountForApproval: number = 0;

  PaymentDate: any;

  transactionType: number = 0;

  transactionTypeName: string = '';

  paymentReceiptUrl: string = '';

  formattedReceivedAmount: string = '';

  formattedPaidAmountForApproval: string = '';

  actionStatusId: number = 0;

  actionStatus: string = '';
  referenceNumber: string = '';
  branchName: string = '';
  bankName: string = '';
  paymentReceiptCode: string = '';
  sourceId: number = 0;
  sourceName: string = '';
  paymentTypeId: number = 0;
  paymentTypeName: string = '';
}
export class paymentLedger {
  paymentLedgerId: number = 0;

  receivedAmount: number = 0;

  paidAmountForApproval: number = 0;

  referenceNumber: string = '';

  paymentDate: string = '';

  balanceAmount: number = 0;

  applicantId: number = 0;

  paymentTypeId: number = 0;

  bankName: string = '';
  branchName: string = '';

  ifscCode: string = '';

  accountNumber: string = '';

  sourceId: number = 0;
  status: string = '';
  challanaUrl: string = '';

  checkUrl: string = '';

  emailUrl: string = '';

  paymentStatusId: number = 0;

  actionStatusId: number = 0;

  paymentReceiptUrl: string = '';

  paymentReceiptCode: string = '';

  transactionTypeId: number = 0;
}

export interface ICRMFollowup {
  id: number;
  applicantId: number;
  followupDate: any;
  remarks: string;
  statusId: number;
  stageId: number;
  subStatusId: number;
  typeId: number;
}

export class CRMFollowup implements ICRMFollowup {
  id: number = 0;
  applicantId: number = 0;
  followupDate: any;
  remarks: string = '';
  statusId: number = 0;
  stageId: number = 0;
  subStatusId: number = 0;
  typeId: number = 0;
}
