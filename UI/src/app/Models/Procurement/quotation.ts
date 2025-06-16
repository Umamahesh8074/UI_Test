import { Charges } from './charges';
import { IndentItems } from './indentDto';

export interface IQuotation {
  quotationId: number;
  organizationId: number;
  code: string;
  projectId: number;
  indentId: number;
  vendorId: number;
  deliveryInDays: number;
  pricesAreInclusiveOfTax: boolean;
  totalCostWithGst: number;
  totalCostWithOutGst: number;
  status: string;
  paymentTermType: string;
  numberOfDays: number;
  advanceAmountOrPercentage: number;
  quotationItems: QuotationItems[];
  qoTermsAndConditions: QoTermsAndConditions[];
  charges: Charges[];
}

export class Quotation implements IQuotation {
  quotationId: number = 0;
  organizationId: number = 0;
  code: string = '';
  projectId: number = 0;
  indentId: number = 0;
  vendorId: number = 0;
  deliveryInDays: number = 0;
  pricesAreInclusiveOfTax: boolean = false;
  totalCostWithGst: number = 0;
  totalCostWithOutGst: number = 0;
  status: string = '';
  paymentTermType: string = '';
  numberOfDays: number = 0;
  advanceAmountOrPercentage: number = 0;
  quotationItems: QuotationItems[] = [];
  qoTermsAndConditions: QoTermsAndConditions[] = [];
  charges: Charges[] = [];
}

export interface IQuotationItems {
  quotationItemId: number;
  quotationId: number;
  description: string;
  quantity: number;
  price: number;
  gst: number;
  discount: number;
  finalCost: number;
  indentItemId: number;
  isRemoved: boolean;
}

export class QuotationItems implements IQuotationItems {
  quotationItemId: number = 0;
  quotationId: number = 0;
  description: string = '';
  quantity: number = 0;
  price: number = 0;
  gst: number = 0;
  discount: number = 0;
  finalCost: number = 0;
  indentItemId: number = 0;
  isRemoved: boolean = false;
}

export class QuotationItemDto {
  quotationItemId: number = 0;
  categoryName: string = '';
  subCategoryName: string = '';
  specificationName: string = '';
  unitName: string = '';
  description: string = '';
  quantity: number = 0;
  price: number = 0;
  finalCost: number = 0;
  gst: number = 0;
  discount: number = 0;
}

export class QuotationDto {
  quotationId: number = 0;
  quotationCode: string = '';
  projectName: string = '';
  vendorName: string = '';
  deliveryInDays: string = '';
  pricesAreInclusiveOfTax: string = '';
  charges: Charges[] = [];
  quotationItems: QuotationItemDto[] = [];
  indentItems: IndentItems[] = [];
  indentId: number = 0;
  code: string = '';
  description: string = '';
  projectId: number = 0;
  requiredArea: string = '';
  requiredDate: string = '';
  totalCost: number = 0;
  status: string = '';
}

export class QoTermsAndConditions {
  id: number = 0;
  qoTermsAndConditionDes: string = '';
  quotationId: number = 0;
}
