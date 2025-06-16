export interface IProjectSalesTeam {
  id?: number | null;
  referenceId?: number | null;
  userId?: number | null;
  typeCommonReferenceDetailsId?: number;
  isAssigned?: any;
  projectId?: any;
}

export class ProjectSalesTeam implements IProjectSalesTeam {
  id = 0;
  referenceId = 0;
  userId = 0;
  typeCommonReferenceDetailsId = 0;
  isAssigned = 0;
  projectId = 0;
}

export interface IProjectSalesTeamDto {
  id?: number | null;
  referenceId?: number | null;
  userId?: number | null;
  typeCommonReferenceDetailsId?: number;
  isAssigned?: any;
  userName?: string | null;
  projectName?: string | null;
  projectId?: any;
}

export class ProjectSalesTeamDto implements IProjectSalesTeamDto {
  id: number | null = 0;
  referenceId?: number | null = 0;
  userId?: number | null = 0;
  typeCommonReferenceDetailsId?: number = 0;
  isAssigned?: any = 0;
  userName?: string | null = '';
  projectName?: string | null = '';
  projectId = 0;
}
