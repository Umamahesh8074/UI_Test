export interface IQrtransactiondata{
id: number;

orgId: number;
projectId: number;
roleId: number;
location: string;

name: string;
latitude: string;



longitude: string;




radius: number;


status: string;

projectName:string;

createdBy:number;


} export class Qrtransactiondata implements IQrtransactiondata {
id: number=0;
orgId: number=0;
projectId: number=0;

roleId: number=0;
location: string='';
name: string='';



latitude: string='';
longitude: string='';

radius: number=0;


status: string='';
projectName: string='';
createdBy:number=0;


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

