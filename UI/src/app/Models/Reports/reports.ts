
export interface IReports {
  scheduleId: number;
  name: string;
  roleId: number;
  organizationId:number;
  buildingId:number;
  location:string;
  scheduleTime:string;
  status:string

}




export class Reports implements IReports {
  scheduleId: number = 0;
  name: string = '';
  roleId: number = 0;
  organizationId:number=0;
  buildingId:number=0;
  location:string='';
scheduleTime:string='';
  status:string='';

}

export class IDisplayReportsDto {
  scheduleId: number = 0;
  name: string = '';
  roleId: number = 0;
  organizationId:number=0;
  buildingId:number=0;
  location:string='';
  scheduleTime:string='';
  status:string='';
}



export class QrReportLocationSummaryDTO {
  location: string = '';
  qrgeneratorId: number = 0;
  yesCount: number = 0;
  noCount:number=0;
  overallCount:number=0;
  overallStatus:string='';

}
export class QrReportProjectSummaryDTO {
  projectName: string = '';
  projectId: number = 0;
  yesCount: number = 0;
  noCount:number=0;
  overallCount:number=0;
  overallStatus:string='';

}

export class QrReportUserSummaryDto{
  userName: string = '';
  userId: number = 0;
  yesCount: number = 0;
  noCount:number=0;
  overallCount:number=0;
  overallStatus:string='';

}


export class QrReportDto{
  qrReportId: number = 0;
  organizationId: number = 0;
  projectId: number = 0;
  projectName: string = '';
  qrgeneratorId: number = 0;
  location: string = '';
  scheduleTimeId: string = '';
  scheduleTime: string = '';
  status: string = '';
  userId: number = 0;

  userName:string='';

  createdDate:Date= new Date();

}
















export class Page<T> {
  pageNo: number = 0;
  pageSize: number = 0;
  last: boolean = false;
  first: boolean = false;
  totalPages: number = 0;
  records: any;
  totalRecords:number=0;
}
