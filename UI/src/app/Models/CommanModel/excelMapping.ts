export interface IExcelMapping {
  id: number;
  fieldId: number;
  expectedHeader: string;
  status: string;
}

export class ExcelMapping implements IExcelMapping {
  id: number = 0;
  fieldId: number = 0;
  expectedHeader: string = '';
  status: string = '';
}

export interface IExcelMappingDto {
  fieldId: number;
  fieldName: string;
  reportFieldStatus: string;
  id: number;
  expectedHeader: string;
  excelMappingStatus: string;
}

export class ExcelMappingDto implements IExcelMappingDto {
  fieldId: number = 0;
  fieldName: string = '';
  reportFieldStatus: string = '';
  id: number = 0;
  expectedHeader: string = '';
  excelMappingStatus: string = '';
}
