export interface IInventoryReceivables {
  irId: number;  // Inventory Receivable ID
  poId: number;  // Purchase Order ID
  receivedBy: number;  // ID of the person who received the item
  receivedDate: Date;  // Date of receipt (as a Date object)
  quantities: IQuantity[];  // List of quantities with dynamic data
}

export interface IQuantity {
  categoryId: number;  // Category ID
  quotationItemId: number;  // Quantity of the item
  quantityReceived: number;  // Quantity received
  itemUnitId:number;
}

export class InventoryReceivables implements IInventoryReceivables {
  irId: number = 0;
  poId: number = 0;
  receivedBy: number = 0;
  receivedDate: Date = new Date();
  quantities: IQuantity[] = [];


}
export class IQuantity {
  categoryId: number=0;  // Category ID
  quotationItemId: number=0;  // Quantity of the item
  quantityReceived: number=0;  // Quantity received
  itemUnitId:number=0;
}

export class InventoryReceivablesDto {
  poId: number = 0;
  categoryId:number=0;
  categoryName: string = '';
  itemSubCategoryName: string = '';

  itemSpecificationsName: string = '';
  quantityReceived: number=0;  // Quantity received
  quotationItemId:number=0;
  quantity: number = 0;
  totalQuantityReceived: number = 0;

  inventoryUnitId :number=0;
	inventoryUnitName:string='';
  unitId:number=0;
}

export class GetInventoryReceivablesDto {
  id:number=0;
  irId: number = 0;
  poId: number = 0;
  categoryId: number = 0;

  categoryName: string = '';
  itemSubCategoryName: string = '';
  itemSpecificationsName: string = '';

  purchaseOrderCode: string = '';
  vendorId: number = 0;
  vendorName: string = '';

  projectId: number = 0;
  projectName: string = '';

  receivedBy: number = 0;
  userName: string = '';

  receivedDate: Date = new Date();

  subCategoryId: number = 0;
  subCategoryName: string = '';

  specificationId: number = 0;
  specificationName: string = '';

  inventoryUnitId: number = 0;
  inventoryUnitName: string = '';
  quotationItemId:number=0;
  quantity: number = 0;
  quantityReceived: number = 0;
  storeId:number=0;
  storeName:string='';
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
