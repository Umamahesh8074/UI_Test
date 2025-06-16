export interface IQrgenerator {
  id: number;
  orgId: number;
  projectId: number;
  location: string;
  latitude: string;
  longitude: string;
  radius: number;
  status: string;
  projectName: string;
}
export class Qrgenerator implements IQrgenerator {
  id: number = 0;
  orgId: number = 0;
  projectId: number = 0;
  location: string = '';
  latitude: string = '';
  longitude: string = '';
  radius: number = 0;
  status: string = '';
  projectName: string = '';
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
