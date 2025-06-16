export interface IUserManage {
  id?: number | null;
  referenceId?: number | null;
  userId?: number | null;
  typeCommonReferenceDetailsId?: number;
  isAssigned?: any;
  projectId?: any;
  isEligibleForLeadDistribution: string;
}

export class UserManage implements IUserManage {
  id = 0;
  referenceId = 0;
  userId = 0;
  typeCommonReferenceDetailsId = 0;
  isAssigned = 0;
  projectId = 0;
  isEligibleForLeadDistribution='';
}

export interface IUserManageDto {
  id?: number | null;
  referenceId?: number | null;
  userId?: number | null;
  typeCommonReferenceDetailsId?: number;
  isAssigned?: any;
  userName?: string | null;
  projectName?: string | null;
  projectId?: any;
  role: any;
  isEligibleForLeadDistribution: string;
  status:any
}

export class UserManageDto implements IUserManageDto {
  id: number | null = 0;
  referenceId?: number | null = 0;
  userId?: number | null = 0;
  typeCommonReferenceDetailsId?: number = 0;
  isAssigned?: any = 0;
  userName?: string | null = '';
  projectName?: string | null = '';
  projectId = 0;
  role: any;
  isEligibleForLeadDistribution: string = '';
  status:any
}
