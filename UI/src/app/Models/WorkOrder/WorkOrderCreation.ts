import { StagesDto } from './WorkOrderBilling';
import { IWorkOrderHeader } from './WorkOrderHeader';
import { IWorkOrderTermsAndConditions } from './WorkOrderTermsAndConditions';

export interface IworkOrderQuantities {
  id: number;
  serviceCodeId: number;
  quantity: number;
  rate: number;
  value: number;
  wbsElements: string;
  budgetQuantity: number;
  workOrderCreationId: number;
}

export class WorkOrderQuantities implements IworkOrderQuantities {
  id: number = 0;
  serviceCodeId: number = 0;
  quantity: number = 0;
  rate: number = 0;
  value: number = 0;
  wbsElements: string = '';
  budgetQuantity: number = 0;
  workOrderCreationId: number = 0;
}

export interface IWorkOrderDto {
  id: number;
  workOrderNumber: string;
  plantCodeId: number;
  plantCode: number;
  plantDescription: string;
  vendorId: number;
  termsAndConditions: string;
  contactPersonName: string;
  personContactNumber: string;
  subject: string;
  mobilizationIn: string;
  mobilizationInAmount: number;
  mobilizationInPercentage: number;
  status: string;
  workOrderQuantities: IworkOrderQuantities[];
  workOrderHeaders: IWorkOrderTermsAndConditions[];
}

export class WorkOrderDto implements IWorkOrderDto {
  id: number = 0;
  workOrderNumber: string = '';
  plantCodeId: number = 0;
  plantCode: number = 0;
  plantDescription: string = '';
  vendorId: number = 0;
  termsAndConditions: string = '';
  contactPersonName: string = '';
  personContactNumber: string = '';
  subject: string = '';
  mobilizationIn: string = '';
  mobilizationInAmount: number = 0;
  mobilizationInPercentage: number = 0;
  status: string = '';
  workOrderQuantities: IworkOrderQuantities[] = [];
  workOrderHeaders: IWorkOrderTermsAndConditions[] = [];
}

//added shiv

export interface IWorkOrderCreationsDto {
  id: number;
  workOrderNumber: string;
  plantCodeId: number;
  plantCode: string;
  plantCodeDescription: string;
  vendorId: number;
  vendorName: string;
  vendorCode: string;
  status: string;
  workFlowTypeId: number;
  createdBy: string;
  createdDate: any;
  approvedDate: any;
  actionDoneBy: string;
  actionStatus: string;
  actionRemarks: string;
  woReceivedDate: any;
  woStatus: string;
  currentStageOwner: string;
  totalAmount: number;
  workOrderType: string;
  workOrderAmountWithGst: number;
  workOrderTotalGstPercentage: number;
  workOrderQuantitiesDto: IWorkOrdersQuantitiesDto[];
  previousWorkOrderQuantities: IWorkOrdersQuantitiesDto[];
  stagesDto: StagesDto[];
}

export class WorkOrderCreationsDto implements IWorkOrderCreationsDto {
  id: number = 0;
  workOrderNumber: string = '';
  plantCodeId: number = 0;
  plantCode: string = '';
  plantCodeDescription: string = '';
  vendorId: number = 0;
  vendorName: string = '';
  vendorCode: string = '';
  status: string = '';
  workFlowTypeId: number = 0;
  createdBy: string = '';
  createdDate: any;
  approvedDate: any;
  actionDoneBy: string = '';
  actionStatus: string = '';
  actionRemarks: string = '';
  woReceivedDate: any;
  woStatus: string = '';
  currentStageOwner: string = '';
  totalAmount: number = 0;
  workOrderType: string = '';
  workOrderAmountWithGst: number = 0;
  workOrderTotalGstPercentage: number = 0;
  workOrderQuantitiesDto: WorkOrdersQuantitiesDto[] = [];
  previousWorkOrderQuantities: IWorkOrdersQuantitiesDto[] = [];
  stagesDto: StagesDto[] = [];
}

export interface IWorkOrdersDataDto {
  workOrderId: number;
  workOrderNumber: string;
  vendorId: number;
  vendorCode: string;
  vendorName: string;
  plantCodeId: number;
  plantCode: string;
  plantDescription: string;
  actionStatus: string;
  workFlowTypeId: number;
  createdBy: string;
  createdDate: Date; // Use Date for LocalDateTime
  workOrderType: string;
  totalAmount: number;
  totalAmountWithGst: number;
  subject: string;
  workOrderTotalGstPercentage: number;
  stagesDto: StagesDto[];
  workOrderQuantitiesDto: IWorkOrdersQuantitiesDto[];
  previousWorkOrderQuantities: IWorkOrdersQuantitiesDto[];
}

export interface IWorkOrdersQuantitiesDto {
  workOrderQuantityId: number;
  serviceCodeId: number;
  serviceCode: string;
  serviceDescription: string;
  serviceUomId: number;
  scUomRefValue: string;
  serviceGroupCode: string;
  primeActivityNumber: string;
  quantity: number;
  rate: number;
  value: number;
  wbsElements: string;
  budgetQuantity: number;
  workOrderCreationId: number;
  workOrderQuantityStatus: string;
}

export class WorkOrdersQuantitiesDto implements IWorkOrdersQuantitiesDto {
  workOrderQuantityId: number = 0;
  serviceCodeId: number = 0;
  serviceCode: string = '';
  serviceDescription: string = '';
  serviceUomId: number = 0;
  scUomRefValue: string = '';
  serviceGroupCode: string = '';
  primeActivityNumber: string = '';
  quantity: number = 0;
  rate: number = 0;
  value: number = 0;
  wbsElements: string = '';
  budgetQuantity: number = 0;
  workOrderCreationId: number = 0;
  workOrderQuantityStatus: string = '';
}

export class WorkOrdersDataDto implements IWorkOrdersDataDto {
  workOrderId: number = 0;
  workOrderNumber: string = '';
  vendorId: number = 0;
  vendorCode: string = '';
  vendorName: string = '';
  plantCodeId: number = 0;
  plantCode: string = '';
  plantDescription: string = '';
  actionStatus: string = '';
  workFlowTypeId: number = 0;
  createdBy: string = '';
  createdDate: any;
  workOrderType: string = '';
  totalAmount: number = 0;
  totalAmountWithGst: number = 0;
  subject: string = '';
  workOrderTotalGstPercentage: number = 0;
  stagesDto: StagesDto[] = [];
  workOrderQuantitiesDto: WorkOrdersQuantitiesDto[] = [];
  previousWorkOrderQuantities: IWorkOrdersQuantitiesDto[] = [];
}

//added shiv
