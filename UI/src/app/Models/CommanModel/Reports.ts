export interface IReports {
  reportId: number;
  reportName: string;
  status: string;
}

export class Reports implements IReports {
  reportId: number = 0;
  reportName: string = '';
  status: string = '';
}
