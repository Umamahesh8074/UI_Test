export interface IRoleManage {
  id?: string | null;
  referenceId?: number | null;
  roleId?: number | null;
  typeCommonReferenceDetailsId?: number;
  isAssigned?: any;
}

export class RoleManage implements IRoleManage {}

export interface IRoleManageDto {
  id?: string | null;
  referenceId?: number | null;
  roleId?: number | null;
  typeCommonReferenceDetailsId?: number;
  isAssigned?: any;
  roleName?: string | null;
}

export class RoleManageDto implements IRoleManageDto {}
