export interface IPurcahseOrder {
  id: number;
  orgId: number;
  projectId: number;
  indentId: number;
  quotationId: number;
  storeId: number;
  poCode: string;
  poStatus: string;
  poSeries: number;
  poType: string;
  status: string;
}

export class PurchaseOrder implements IPurcahseOrder {
  id: number = 0;
  orgId: number = 0;
  projectId: number = 0;
  indentId: number = 0;
  quotationId: number = 0;
  storeId: number = 0;
  poCode: string = '';
  poStatus: string = '';
  poSeries: number = 0;
  poType: string = '';
  status: string = '';
}

export interface IPurchaseOrderDto {
  id: number;
  projectId: number;
  projectName: string;
  indentId: number;
  storeId: number;
  indentName: string;
  quotationId: number;
  quotationName: string;
  storeName: string;
  status: string;
  workflowTypeId: number;
}

export class PurchaseOrderDto implements IPurchaseOrderDto {
  projectId: number = 0;
  indentId: number = 0;
  quotationId: number = 0;
  storeId: number = 0;
  id: number = 0;
  projectName: string = '';
  indentName: string = '';
  quotationName: string = '';
  storeName: string = '';
  status: string = '';
  workflowTypeId: number = 0;
}
