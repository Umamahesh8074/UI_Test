export interface IworkOrderGST {
  id: number;
  gstType: string;
  gstPercentage: number;
}

export class WorkOrderGST implements IworkOrderGST {
  id: number = 0;
  gstType: string = '';
  gstPercentage: number = 0;
}
