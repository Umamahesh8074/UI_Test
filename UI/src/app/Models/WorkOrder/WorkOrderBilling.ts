export interface IWorkOrderBillingsDto {
  wobInvoices: any;
  woBillingId: number;
  status: string;
  workOrderId: number;
  workOrderNumber: string;
  vendorId: number;
  vendorCode: string;
  vendorName: string;
  vendorGstNumber: string;
  projectId: number;
  projectCode: string;
  projectName: string;
  projectAddress: string;
  projectLocation: string;
  projectDescription: string;
  workflowTypeId: number;
  userName: string;
  createdDate: any;
  stageStatus: string;
  stageComments: string;
  woReceivedDate: any;
  actionDoneDate: any;
  actionDoneBy: string;
  workOrderBillingId: number;
  currentStageOwner: string;
  totalWorkOrderAmount: number;
  billPeriodFromDate: Date;
  billPeriodToDate: Date;
  invoiceBillNumber: string;
  invoiceBillDate: Date;
  debitAmount: number;
  advanceRecoveredUptoPreviousBill: number;
  advanceRecoveredOnThisBill: number;
  billingGst: number;
  billingCgst: number;
  billingSgst: number;
  retension: number;
  otherRecoveries: number;
  mobilizationAmount: number;
  checkedBy: string;
  stages: IStagesDto[];
  workOrderBillingQuantities: IWorkOrderBillingQuantities[];
  previousWorkOrderBillingQuantities: IWorkOrderBillingQuantities[];
}

export class WorkOrderBillingsDto implements IWorkOrderBillingsDto {
  billPeriodFromDate: any;
  billPeriodToDate: any;
  invoiceBillNumber: string = '';
  invoiceBillDate: any;
  debitAmount: number = 0;
  advanceRecoveredUptoPreviousBill: number = 0;
  advanceRecoveredOnThisBill: number = 0;
  billingCgst: number = 0;
  billingSgst: number = 0;
  billingGst: number = 0;
  retension: number = 0;
  otherRecoveries: number = 0;
  woBillingId: number = 0;
  status: string = '';
  workOrderId: number = 0;
  workOrderNumber: string = '';
  vendorId: number = 0;
  vendorCode: string = '';
  vendorName: string = '';
  vendorGstNumber: string = '';
  projectId: number = 0;
  projectCode: string = '';
  projectName: string = '';
  projectAddress: string = '';
  projectLocation: string = '';
  projectDescription: string = '';
  workflowTypeId: number = 0;
  userName: string = '';
  createdDate: any;
  stageStatus: string = '';
  stageComments: string = '';
  woReceivedDate: any;
  actionDoneDate: any;
  actionDoneBy: string = '';
  workOrderBillingId: number = 0;
  currentStageOwner: string = '';
  totalWorkOrderAmount: number = 0;
  mobilizationAmount: number = 0;
  checkedBy: string = '';
  stages: IStagesDto[] = [];
  workOrderBillingQuantities: IWorkOrderBillingQuantities[] = [];
  previousWorkOrderBillingQuantities: IWorkOrderBillingQuantities[] = [];
  wobInvoices: InvoiceBillings[] = [];
}

export interface IWorkOrderBillingQuantities {
  woBillingQuantitiesId: number;
  releasedTillPrevious: number;
  currentPeriod: number;
  cumulative: number;
  balance: number;

  workOrderId: number;
  workOrderNumber: string;

  vendorId: number;
  vendorCode: string;
  vendorName: string;

  serviceCodeId: number;
  serviceCode: string;
  serviceDescription: string;
  serviceUomId: number;
  scUomRefValue: string;

  woQuantitiesId: number;
  quantity: number;
  rate: number;
  value: number;
  wbsElements: string;
  budgetQuantity: number;

  projectId: number;
  projectCode: string;
  projectName: string;
  projectAddress: string;
  projectLocation: string;
  projectDescription: string;

  serviceGroupCode: string;
  primeActivityNumber: string;
  workOrderQuantityStatus: string;
  workOrderCgstAndSgstPercentage: number;
  workOrderGstPercentage: number;

  amendmentQuantity: number;
  amendmentAmount: number;
  gstWithAmountAfterAmendment: number;

  totalQuantityAfterAmendment: number;
  totalAmountAfterAmendment: number;
  totalAmountWthGstAfterAmendment: number;
}

export class WorkOrderBillingQuantities implements IWorkOrderBillingQuantities {
  woBillingQuantitiesId: number = 0;
  releasedTillPrevious: number = 0;
  currentPeriod: number = 0;
  cumulative: number = 0;
  balance: number = 0;
  workOrderId: number = 0;
  workOrderNumber: string = '';
  vendorId: number = 0;
  vendorCode: string = '';
  vendorName: string = '';
  serviceCodeId: number = 0;
  serviceCode: string = '';
  serviceDescription: string = '';
  serviceUomId: number = 0;
  scUomRefValue: string = '';
  woQuantitiesId: number = 0;
  quantity: number = 0;
  rate: number = 0;
  value: number = 0;
  wbsElements: string = '';
  budgetQuantity: number = 0;
  projectId: number = 0;
  projectCode: string = '';
  projectName: string = '';
  projectAddress: string = '';
  projectLocation: string = '';
  projectDescription: string = '';
  serviceGroupCode: string = '';
  primeActivityNumber: string = '';
  workOrderQuantityStatus: string = '';
  workOrderCgstAndSgstPercentage: number = 0;
  workOrderGstPercentage: number = 0;
  amendmentQuantity: number = 0;
  amendmentAmount: number = 0;
  gstWithAmountAfterAmendment: number = 0;

  totalQuantityAfterAmendment: number = 0;
  totalAmountAfterAmendment: number = 0;
  totalAmountWthGstAfterAmendment: number = 0;
}

//added by shiv

export interface IWorkOrderBillingsData {
  woBillingId: number;
  workOrderId: number;
  workOrderNumber: string;
  vendorId: number;
  vendorCode: string;
  vendorName: string;
  plantCodeId: number;
  projectName: string;
  plantDescription: string;
  actionStatus: string;
  workFlowTypeId: number;
  createdBy: string;
  createdDate: Date;
  currentStageOwner: string;
  totalWorkOrderAmount: number;
  stagesDto: IStagesDto[];
  wobType: string;
  workOrderBillingQuantitiesDto: IWorkOrderBillingQuantities[];
  previousWorkOrderBillingQuantities: IWorkOrderBillingQuantities[];
  wobInvoices: InvoiceBillings[];
}

export class InvoiceBillings {
  invoiceBillingId: number = 0;
  invoiceBillDate: any;
  invoiceBillNumber: string = '';
  billingId: number = 0;
}

export interface IStagesDto {
  stageId: number;
  stageName: string;
  stageOrder: number;
  userId: number;
  actionDoneBy: string;
  actionDate: Date;
  woReceivedDate: Date;
  stageStatus: string;
  actionComments: string;
}

export class StagesDto implements IStagesDto {
  stageId: number = 0;
  stageName: string = '';
  stageOrder: number = 0;
  userId: number = 0;
  actionDoneBy: string = '';
  actionDate: any;
  woReceivedDate: any;
  stageStatus: string = '';
  actionComments: string = '';
}

export class WorkOrderBillingsData implements IWorkOrderBillingsData {
  woBillingId: number = 0;
  workOrderId: number = 0;
  workOrderNumber: string = '';
  vendorId: number = 0;
  vendorCode: string = '';
  vendorName: string = '';
  plantCodeId: number = 0;
  projectName: string = '';
  plantDescription: string = '';
  actionStatus: string = '';
  workFlowTypeId: number = 0;
  createdBy: string = '';
  createdDate: any;
  currentStageOwner: string = '';
  totalWorkOrderAmount: number = 0;
  wobType: string = '';
  stagesDto: StagesDto[] = [];
  workOrderBillingQuantitiesDto: WorkOrderBillingQuantities[] = [];
  previousWorkOrderBillingQuantities: WorkOrderBillingQuantities[] = [];
  wobInvoices: InvoiceBillings[] = [];
}
