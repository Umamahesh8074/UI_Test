import { InvoiceReportDto } from '../Invoice/invoice';

export interface ICustomerconsumption {
  consumptionId: number;

  currentConsumption: number;

  consumptionType: string;

  consumptionMonth: string;
  consumptionYear: string;
  customerId: number;
}
export class Customerconsumption implements ICustomerconsumption {
  consumptionId: number = 0;
  currentConsumption: number = 0;
  consumptionType: string = '';
  consumptionMonth: string = '';
  consumptionYear: string = '';
  customerId: number = 0;
}

export class CustomerconsumptionDto {
  consumptionId: number = 0;
  currentConsumption: number = 0;
  consumptionType: string = '';
  consumptionMonth: string = '';
  consumptionYear: string = '';
  customerId: number = 0;
  name: string = '';

  reportId: number = 0;

  area: number = 0;

  tlDl: number = 0;
  fac: number = 0;
  tod: number = 0;
  demandCharges: number = 0;
}



export class CustomerconsumptionWithoutAreaDto {
  consumptionId: number = 0;

  currentConsumption: number = 0;

  consumptionType: string = '';

  consumptionMonth: string = '';
  consumptionYear: string = '';

  customerId: number = 0;
  name: string = '';

  reportId: number = 0;

  tlDl: number = 0;
  fac: number = 0;
  tod: number = 0;
  demandCharges: number = 0;
}

export class Page<T> {
  pageNo: number = 0;
  pageSize: number = 0;
  last: boolean = false;
  first: boolean = false;
  totalPages: number = 0;
  records: any;
  totalRecords: number = 0;
}

export class CustomerInvoiceDetails {
  customerName: string = '';
  totalCost: number = 0.0;
  consumptionMonth: string = '';
  invoices: InvoiceReportDto[] = [];
}
