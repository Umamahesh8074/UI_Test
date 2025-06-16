export interface IHoliday {
  id: number;
  name: string;
  date: any;
  description: string;
  status: string;
}

export class Holiday implements IHoliday {
  id: number = 0;
  name: string = '';
  date: any;
  description: string = '';
  status: string = 'A';
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
