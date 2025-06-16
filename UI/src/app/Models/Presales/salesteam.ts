export interface ISalesTeam {
  id: number;
  name: string | null;
  projectId: number;
  isLeadAssigned: string | null;
  status: string | null;
  teamHeadId: any;
}
export class SalesTeam implements ISalesTeam {
  id: number = 0;
  name: string | null = '';
  projectId: number = 0;
  isLeadAssigned: string | null = '';
  status: string | null = '';
  teamHeadId: any;
}
export interface ISalesTeamDto {
  id: number;
  name: string | null;
  projectId: number;
  isLeadAssigned: string | null;
  status: string | null;
  projectName: string | null;
  teamHeadId: any;
  teamHeadName: any;
}
export class SalesTeamDto implements ISalesTeamDto {
  id: number = 0;
  name: string | null = '';
  projectId: number = 0;
  isLeadAssigned: string | null = '';
  status: string | null = '';
  projectName: string | null = '';
  teamHeadId: any;
  teamHeadName: any;
}
