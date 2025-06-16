export interface IInvoiceReportDto {
  reportId: number;
  customerName: string;

  customerPhoneNumber: string;
  unitId: number;
  customerResidentType: string;
  blockId: number;
  levelId: number;
  projectId: number;
  organizationName: string;
  organizationContact: string;
  orgEmail: string;
  orgAddress1: string;
  orgAddress2: string;
  orgCity: string;
  orgPincode: string;
  orgGstinUin: string;
  orgState: string;
  orgStateCode: string;

  customerAddress1: string;
  customerAddress2: string;
  customerCity: string;
  customerCityPinCode: string;
  customergstinUin: string;
  customerState: string;
  customerStateCode: string;
  customerPan: string;
  referenceTypeId: number;
  commonRefValue: string;

  previousConsumption: number;
  currentConsumption: number;

  consumptionType: string;

  invoiceNumber: string;
  invoiceDate: string;
  invoicePeriod: string;
  orgPan: string;
  roundOff: number;
  totalValue: number;
  cgst: number;
  sgst: number;

  charge: number;
  presentConsumption: number;
  remainingConsumption: number;
  cgstAmount: number;
  sgstAmount: number;

  consumptionMonth: number;
  consumptionYear: number;
  consumptionId: number;

  area: number;


  tlDl: number;

  tlDlAmount: number;

  tc: number;
  tcAmount: number;

  fac: number;
  facAmount: number;
  tod: number;
  todAmount: number;
  toe: number;
  toeAmount: number;

  revenueArr: number;
  revenueArrAmount: number;
  demandCharges: number;
  totalSumTlAndDlCharge: number;

  totalAmount: number;
  sumOfTotalAmountAndTod: number;
  sumTodAndTcCharge: number;


}

export class InvoiceReportDto implements IInvoiceReportDto {
  reportId: number = 0;
  customerName: string = '';

  customerPhoneNumber: string = '';
  unitId: number = 0;
  customerResidentType: string = '';
  blockId: number = 0;
  levelId: number = 0;
  projectId: number = 0;
  organizationName: string = '';
  organizationContact: string = '';
  orgEmail: string = '';
  orgAddress1: string = '';
  orgAddress2: string = '';
  orgCity: string = '';
  orgPincode: string = '';
  orgGstinUin: string = '';
  orgState: string = '';
  orgStateCode: string = '';

  customerAddress1: string = '';
  customerAddress2: string = '';
  customerCity: string = '';
  customerCityPinCode: string = '';
  customergstinUin: string = '';
  customerState: string = '';
  customerStateCode: string = '';
  customerPan: string = '';
  referenceTypeId: number = 0;
  commonRefValue: string = '';

  previousConsumption: number = 0;
  currentConsumption: number = 0;

  consumptionType: string = '';

  invoiceNumber: string = '';
  invoiceDate: string = '';

  invoicePeriod: string = '';
  orgPan: string = '';
  roundOff: number = 0;
  totalValue: number = 0;
  cgst: number = 0;
  sgst: number = 0;

  charge: number = 0;
  presentConsumption: number = 0;
  remainingConsumption: number = 0;
  cgstAmount: number = 0;
  sgstAmount: number = 0;

  consumptionMonth: number = 0;
  consumptionYear: number = 0;

  consumptionId: number = 0;
  area: number = 0;

  tlDl: number = 0;

  tlDlAmount: number = 0;

  tc: number = 0;
  tcAmount: number = 0;

  fac: number = 0;
  facAmount: number = 0;
  tod: number = 0;
  todAmount: number = 0;
  toe: number = 0;
  toeAmount: number = 0;

  revenueArr: number = 0;
  revenueArrAmount: number = 0;
  demandCharges: number = 0;
  totalSumTlAndDlCharge: number = 0;

  totalAmount: number = 0;
  sumOfTotalAmountAndTod: number = 0;
  sumTodAndTcCharge: number = 0;




}

export class Page<T> {
  pageNo: number = 0;
  pageSize: number = 0;
  last: boolean = false;
  first: boolean = false;
  totalPages: number = 0;
  records: T[] = [];
  totalRecords: number = 0;
}
