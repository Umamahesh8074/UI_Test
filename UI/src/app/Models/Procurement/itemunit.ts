export interface IItemUnit {
  unitId: number;
  inventoryUnitId: number;
  name: string;
  categoryId: any;
  subCategoryId: any;
  specificationId: number;
  status: string;
  materialCode: string;
}
export class ItemUnit implements IItemUnit {
  unitId: number = 0;
  inventoryUnitId: number = 0;
  name: string = '';
  categoryId: any;
  subCategoryId: any;
  specificationId: number = 0;
  status: string = '';
  materialCode: string = '';
}

export class ItemUnitDto {
  unitId: number=0;
  name: string='';
  categoryId:number=0;
  itemCategoryName: string='';
  subCategoryId:number=0;
  itemSubCategoryName: string='';
  specificationId:number=0;
  itemSpecificationName: string='';
  status: string='';
  workTypeName: string='';
  inventoryUnitName: string='';
  materialCode: string='';
  categoryCode: string='';
  subCategoryCode: string='';
  specCode: string='';
}
export class transferType {
  id: number = 0;
  transferType: string = '';
}