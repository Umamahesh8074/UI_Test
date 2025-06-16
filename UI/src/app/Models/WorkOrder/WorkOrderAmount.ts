export interface IWorkOrderAmount {
  id: number;
  workOrderStatus: string;
  stageOrder: number;
  workOrderId: number;
  totalAmount: number;
}

export class WorkOrderAmount implements IWorkOrderAmount {
  id: number = 0;
  workOrderStatus: string = '';
  stageOrder: number = 0;
  workOrderId: number = 0;
  totalAmount: number = 0;
}
