export interface IInventoryTransfer {
  transferId: number;
  transferDate: Date;
  itemId: number;
  quantityTransferred: number;
  fromLocation: string;
  toLocation: string;
  transferredBy: number;
  receivedBy: number;
  transferType: string;
  remarks: string;
}
export class InventoryTransfer implements IInventoryTransfer {
  constructor(
    public transferId: number = 0,
    public transferDate: Date = new Date(),
    public itemId: number = 0,
    public quantityTransferred: number = 0,
    public fromLocation: string = '',
    public toLocation: string = '',
    public transferredBy: number = 0,
    public receivedBy: number = 0,
    public transferType: string = '',
    public remarks: string = ''
  ) {}
}
export class InventoryTransferDto {
  constructor(
    public transferId: number = 0,
    public transferDate: Date = new Date(),
    public itemName: string = '',
    public itemId: number = 0,
    public quantityTransferred: number = 0,
    public fromLocation: string = '',
    public toLocation: string = '',
    public transferredBy: string = '',
    public transferredByUserId: number = 0,
    public receivedBy: string = '',
    public receivedByUserId: number = 0,
    public transferType: string = '',
    public remarks: string = '',
    public fromStoreId: number = 0,
    public fromStore: string = '',
    public toStoreId: number = 0,
    public toStore: string = '',
    public toSiteId: number = 0,
    public toSite: string = ''
  ) {}
}
