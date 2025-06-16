//get indents dto
export interface IIndentDto {
  indentId: number;
  indentCode: string;
  projecName: string;
  requiredDate: any;
  createdBy: string;
  status: string;
  createdDate: any;
  indentItems: IIndentItems[];
}

export interface IIndentItems {
  indentItemId: number;
  categoryName: string;
  subCategoryName: string;
  specificationName: string;
  unitName: string;
  quantity: number;
  materialCodeId: number;
}

export class IndentItems implements IIndentItems {
  indentItemId: number = 0;
  categoryName: string = '';
  subCategoryName: string = '';
  specificationName: string = '';
  unitName: string = '';
  quantity: number = 0;
  materialCodeId: number = 0;
}

export class IndentDto implements IIndentDto {
  indentId: number = 0;
  indentCode: string = '';
  projecName: string = '';
  requiredDate: any = '';
  createdBy: string = '';
  status: string = '';
  createdDate: any;
  indentItems: IIndentItems[] = [];
}
