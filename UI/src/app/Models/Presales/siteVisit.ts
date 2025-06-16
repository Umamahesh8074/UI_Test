export interface ISiteVisit {
  id: number;
  name: string;
  phoneNumber: string;
  date: any;
  email: string;
  address: string;
  flatTypeId: number;
  budget: any;
  sourceId: number;
  followupDateTime: any;
  remarks: string;
  salesManagerName: string;
}

export class SiteVisit implements ISiteVisit {
  id: number = 0;
  name: string = '';
  phoneNumber: string = '';
  date: any;
  email: string = '';
  address: string = '';
  flatTypeId: number = 0;
  budget: any;
  sourceId: number = 0;
  followupDateTime: any;
  remarks: string = '';
  salesManagerName: string = '';
}

export interface ISiteVisitDto {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  flatType: number;
  budget: any;
  source: number;
  followupDateTime: any;
}

export class SiteVisitDto implements ISiteVisitDto {
  id: number = 0;
  name: string = '';
  phoneNumber: string = '';
  email: string = '';
  flatType: number = 0;
  budget: any;
  source: number = 0;
  followupDateTime: any;
}
