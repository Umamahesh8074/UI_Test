export interface IItemSpecification {
  specificationId: number;
  name: string;
  categoryId:number;
  subCategoryId: number;
  status: string;
  specificationCode:string;
  specificationseries:number;
}
export class ItemSpecification implements IItemSpecification {
  specificationId: number = 0;
  name: string = '';
  categoryId:number=0;
  subCategoryId: number = 0;
  status: string = '';
  specificationCode:string='';
  specificationseries:number=0;
}







