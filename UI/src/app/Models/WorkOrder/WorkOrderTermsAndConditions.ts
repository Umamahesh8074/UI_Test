export interface IWorkOrderTermsAndConditions {
  id: number;
  headerId:number;
  headerName: string;
  headerTermsAndConditions: string;
  headerOrder: number;
  woId: number;
  status: string;
}

export class WorkOrderTermsAndConditions
  implements IWorkOrderTermsAndConditions
{
  id: number = 0;
  headerId:number=0;
  headerName: string = '';
  headerTermsAndConditions: string = '';
  headerOrder: number = 0;
  woId: number = 0;
  status: string = '';
}
