export interface IItemCategory {
  workTypeId: number;
  categoryId: number;
  name: string;
  status: string;
}
export class ItemCategory implements IItemCategory {
  workTypeId: number = 0;
  categoryId: number = 0;
  name: string = '';
  status: string = '';
}

export interface IPageResponse<T> {
  pageNo: number;
  pageSize: number;
  last: boolean;
  first: boolean;
  totalPages: number;
  totalRecords: number;
  records: T;
}

export interface IItemCategoryDto {
  categoryId: number;
  categoryName: string;
  status: string;
  workTypeId: number;
  workTypeName: string;
}
export class ItemCategoryDto implements IItemCategoryDto {
  categoryId: number = 0;
  categoryName: string = '';
  status: string = '';
  workTypeId: number = 0;
  workTypeName: string = '';
}
