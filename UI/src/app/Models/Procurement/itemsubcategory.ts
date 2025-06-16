export interface IItemSubCategory {
  subCategoryId: number;
  name: string;
  categoryId: number;
  status: string;
}
export class ItemSubCategory implements IItemSubCategory {
  subCategoryId: number = 0;
  name: string = '';
  categoryId: number = 0;
  status: string = '';
}
