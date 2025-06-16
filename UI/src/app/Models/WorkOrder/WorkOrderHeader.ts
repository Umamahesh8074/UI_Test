export interface IWorkOrderHeader {
  id: number;
  headerName: string;
  headerTermsAndConditions: string;
  status: string;
}

export class WorkOrderHeader implements IWorkOrderHeader {
  id: number = 0;
  headerName: string = '';
  headerTermsAndConditions: string = '';
  status: string = '';
}
