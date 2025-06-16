export interface IProjectMembers {
    projectId: number;
   
    projectName: string;
    userName:string;
    phoneNumber:string;
    email:string;
    managerId :number;
    TeamId:number;
    TeamName:string;
   
  }
  
  export class ProjectUsers implements IProjectMembers {
    projectId: number=0;
    projectName: string='';
    userName: string='';
    phoneNumber: string='';
    email: string='';
    managerId: number=0;
    TeamId:number=0;
    TeamName: string='';
  }
  