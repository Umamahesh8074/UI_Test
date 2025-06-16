export interface ILogEntry {
  id: number;
  message: string;
  executionTime: string;

  procedureName: string;
}
export class LogEntry implements ILogEntry {
  id: number = 0;
  message: string = '';
  executionTime: string = '';

  procedureName: string = '';
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
