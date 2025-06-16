export interface IWeekOff {
  id: number;
  userId: number;
  status: string;
  userName: string;
  weekOffDay: string;
}

export class WeekOff implements IWeekOff {
  constructor(
    public id: number,
    public userId: number,
    public status: string,
    public userName: string,
    public weekOffDay: string
  ) {}
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
