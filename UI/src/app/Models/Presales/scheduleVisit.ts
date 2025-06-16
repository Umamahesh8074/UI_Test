export interface IScheduleVisit {
  id: number;
  followupDate: any;
  address: string;
  remarks: string;
  statusId: string;
  leadId: number;
}
export class ScheduleVisit implements IScheduleVisit {
  find(arg0: (item: any) => boolean) {
    throw new Error('Method not implemented.');
  }
  id: number = 0;
  followupDate: any;
  address: string = '';
  remarks: string = '';
  statusId: string = '';
  leadId: number = 0;
}

export interface IScheduleVisitDto {
  id: number;
  leadName: string;
  opportunityId:string;
  followupDate: any;
  address: string;
  remarks: string;
  status: string;
}

export class ScheduleVisitDto implements IScheduleVisitDto {
  id: number = 0;
  leadName: string = '';
  opportunityId:string='';
  followupDate: any;
  address: string = '';
  remarks: string = '';
  status: string = '';
}
