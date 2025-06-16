
export class OrganizationBean{
  organizationId:number=0;
  organizationName: string = '';
  organizationContact: number = 0;
  status: string = '';
  email: string = '';
  orgAddress1: string = '';
  orgAddress2: string = '';
  orgCity: string = '';
  orgPincode: string = '';
  orgGstinUin: string = '';
  orgState: string = '';
  orgCode: string = '';
  orgPan: string = '';
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
