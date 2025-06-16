export interface IIndent {
  indentId: number;
  code: string;
  projectId: number;
  requiredDate: any;
  requiredArea: string;
  status: string;
  description: string;
  initialApprovalUserId: number;
  currentApprovalFlowId: number;
}
export class Indent implements IIndent {
  indentId: number = 0;
  code: string = '';
  projectId: number = 0;
  requiredDate: any = '';
  requiredArea: string = '';
  status: string = '';
  description: string = '';
  initialApprovalUserId: number = 0;
  currentApprovalFlowId: number = 0;
}

export interface IIndent_Item {
  indentItemId: number;
  indentId: number;
  categoryId: number;
  subCategoryId: number;
  specificationId: number;
  unitId: number;
  quantity: number;
}

export class Indent_Item implements IIndent_Item {
  indentItemId: number = 0;
  indentId: number = 0;
  categoryId: number = 0;
  subCategoryId: number = 0;
  specificationId: number = 0;
  unitId: number = 0;
  quantity: number = 0;
}

export class IndentItemDto {
  indentId: number = 0;
  code: string = '';
  projectId: number = 0;
  requiredDate: any = '';
  requiredArea: string = '';
  status: string = '';
  description: string = '';
  indentItems: Indent_Item[] = [];
}
