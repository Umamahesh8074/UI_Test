export interface IReportField {
  fieldId: number;
  fieldName: string;
  reportId: number;
  status: string;
}

export class ReportFields implements IReportField {
  fieldId: number = 0;
  fieldName: string = '';
  reportId: number = 0;
  status: string = '';
}

export interface IReportFieldDto {
  reportId: number;
  reportName: string;
  reportStatus: string;
  fieldId: number;
  fieldName: string;

  reportFieldStatus: string;
}

export class ReportFieldDto implements IReportFieldDto {
  reportId: number = 0;
  reportName: string = '';
  reportStatus: string = '';
  fieldId: number = 0;
  fieldName: string = '';
  reportFieldStatus: string = '';
}
