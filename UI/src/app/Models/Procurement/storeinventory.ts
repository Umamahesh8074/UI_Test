export interface IStoreInventory {
  storeInventoryId: number;

  storeId: number;

  itemUnitId: number;

  storeStock: number;
}

export class StoreInventory implements IStoreInventory {
  storeInventoryId: number = 0;

  storeId: number = 0;

  itemUnitId: number = 0;

  storeStock: number = 0;
}

export interface IStoreInventoryDto {
  storeInventoryId: number;
  projectId: number;
  projectName: string;
  storeId: number;
  storeName: string;
  itemUnitId: number;
  unitName: string;
  categoryId: number;
  categoryName: string;
  subCategoryId: number;
  subCategoryName: string;
  specificationId: number;
  specificationName: string;
  storeStock: number;
  categoryType: string;
  poId: number;
  code: string;
}

export class StoreInventoryDto implements IStoreInventoryDto {
  storeInventoryId: number = 0;
  projectId: number = 0;
  projectName: string = '';
  storeId: number = 0;
  storeName: string = '';
  itemUnitId: number = 0;
  unitName: string = '';
  categoryId: number = 0;
  categoryName: string = '';
  subCategoryId: number = 0;
  subCategoryName: string = '';
  specificationId: number = 0;
  specificationName: string = '';
  storeStock: number = 0;
  categoryType: string = '';
  poId: number = 0;
  code: string = '';
}
