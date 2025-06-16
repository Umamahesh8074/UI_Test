export interface IClient {
  clientId: number;

  clientName: string;

  location: string;

  address1: string;

  address2: string;

  city: string;

  pincode: string;

  pan: string;

  gst: string;

  state: string;

  phoneNumber: string;

  residentType: string;

  emailId: string;

  status: string;

  organizationId: number;
  totalServiceNameCount: number;
  projectLocation: string;
  orderNumber: string;
}
export class Client implements IClient {
  clientId: number = 0;

  clientName: string = '';

  location: string = '';

  address1: string = '';

  address2: string = '';

  city: string = '';

  pincode: string = '';

  pan: string = '';

  gst: string = '';

  state: string = '';

  phoneNumber: string = '';

  residentType: string = '';

  emailId: string = '';

  status: string = '';

  organizationId: number = 0;
  totalServiceNameCount: number = 0;
  projectLocation: string = '';
  orderNumber: string = '';
}

export interface IClientInvoiceReport {
  clientInvoiceReportId: number;
  clientId: number;
  clientName: string;
  location: string;
  address1: string;
  address2: string;
  city: string;
  pincode: string;
  pan: string;
  gst: string;
  state: string;
  phoneNumber: string;
  residentType: string;
  emailId: string;
  status: string;
  organizationId: number;
  monthlyClientInvoiceReportId: number;
  noOfDuties: number;
  manPower: number;
  serviceName: string;
  serviceSalary: number;
  totalAmount: number;
  invoiceDate: Date;
  invoiceNumber: string;
  orderNumber: string;
  orgPinCode: string;
  orgGstinUin: string;
  facilityServiceId: number;
  month: string;
  year: string;
  projectLocation: string;
  grandTotal: string;
}

export class ClientInvoiceReport implements IClientInvoiceReport {
  clientInvoiceReportId: number = 0;
  clientId: number = 0;
  clientName: string = '';
  location: string = '';
  address1: string = '';
  address2: string = '';
  city: string = '';
  pincode: string = '';
  pan: string = '';
  gst: string = '';
  state: string = '';
  phoneNumber: string = '';
  residentType: string = '';
  emailId: string = '';
  status: string = '';
  organizationId: number = 0;
  monthlyClientInvoiceReportId: number = 0;
  noOfDuties: number = 0;
  manPower: number = 0;
  serviceName: string = '';
  serviceSalary: number = 0;
  totalAmount: number = 0;
  invoiceDate: Date = new Date();
  invoiceNumber: string = '';
  orderNumber: string = '';
  orgPinCode: string = '';
  orgGstinUin: string = '';
  facilityServiceId: number = 0;
  month: string = '';
  year: string = '';
  projectLocation: string = '';
  grandTotal: string = '';
}

export interface IMonthlyInvoiceReportDto {
  clientId: number;
  clientName: string;
  location: string;
  address1: string;
  address2: string;
  city: string;
  pincode: string;
  pan: string;
  gst: string;
  state: string;
  phoneNumber: string;
  residentType: string;
  emailId: string;
  status: string;
  organizationId: number;
  monthlyClientInvoiceReportId: number;
  noOfDuties: number;
  manPower: number;
  serviceName: string;
  serviceSalary: number;
  totalAmount: number;
  invoiceDate: Date;
  invoiceNumber: string;
  orgPinCode: string;
  orgGstinUin: string;
  facilityServiceId: number;
  month: string;
  year: string;
  orderNumber?: string;
}

export class MonthlyInvoiceReportDto implements IMonthlyInvoiceReportDto {
  clientId: number = 0;
  clientName: string = '';
  location: string = '';
  address1: string = '';
  address2: string = '';
  city: string = '';
  pincode: string = '';
  pan: string = '';
  gst: string = '';
  state: string = '';
  phoneNumber: string = '';
  residentType: string = '';
  emailId: string = '';
  status: string = '';
  organizationId: number = 0;
  monthlyClientInvoiceReportId: number = 0;
  noOfDuties: number = 0;
  manPower: number = 0;
  serviceName: string = '';
  serviceSalary: number = 0;
  totalAmount: number = 0;
  invoiceDate: Date = new Date();
  invoiceNumber: string = '';
  orgPinCode: string = '';
  orgGstinUin: string = '';
  facilityServiceId: number = 0;
  month: string = '';
  year: string = '';
  orderNumber: string = '';
}

export class MonthlyInvoiceReportDtoList {
  projectLocation: string = '';
  location: string = '';
  month: string = '';
  grandTotal: number = 0;
  monthlyGrandTotal: number = 0;
  invoiceDate: Date = new Date();
  invoices: ClientInvoiceReport[] = [];
}

export class ClientFacilityDto {
  clientId: number = 0;

  clientName: string = '';

  serviceName: string = '';

  facilityServiceId: number = 0;
}

export interface IFaclityService {
  facilityServiceId: number;
  serviceName: string;
  manPower: number;
  clientId: number;
  projectLocation: string;
  location: string;
  noOfDuties: number;
}
export class FaclityService implements IFaclityService {
  facilityServiceId: number = 0;
  serviceName: string = '';
  manPower: number = 0;
  clientId: number = 0;
  projectLocation: string = '';
  location: string = '';
  noOfDuties: number = 0;
}

// Example for FacilityServicesDto

export interface FacilityServicesDto {
  facilityServices: Array<{
    serviceName: string;
    manPower: number;
    serviceSalary: number;
    clientId: number;
    projectLocation: string;
    location: string;
  }>;
}

export class FacilityServiceDataDto {
  facilityServiceId: number = 0;
  serviceName: string = '';
  manPower: number = 0;
  clientId: number = 0;
  projectLocation: string = '';
  location: string = '';
  noOfDuties: number = 0;
}

export interface IClientCustomerconsumption_Item {
  serviceName: string;
  manPower: number;
  serviceSalary: number;
}

export class ClientCustomerconsumption_Item
  implements IClientCustomerconsumption_Item
{
  serviceName: string = '';
  manPower: number = 0;
  serviceSalary: number = 0;
}

export class ClientCustomerconsumptionDto {
  clientId: number = 0;
  clientName: string = '';
  pan: string = '';
  facilityServiceId: number = 0;
  address1: string = '';
  address2: string = '';
  city: string = '';
  state: string = '';
  orgPincode: string = '';
  gst: string = '';
  location: string = '';
  phoneNumber: string = '';
  invoiceDate: Date = new Date();

  orgGstinUin: string = '';

  serviceName: string = '';
  serviceSalary: number = 0;
  noOfDuties: number = 0;
  manPower: number = 0;
  totalAmount: number = 0;
  status: string = '';
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
