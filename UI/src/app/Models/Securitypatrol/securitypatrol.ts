// securitypatrol.ts

export interface ISecuritypatrol {
  scheduleId: number;
  scheduleTimeId: number ;
  roleId: number;
  status: string;
  projectId:number;
  generatorId:number;
  securityPatrolName:string;
  scheduleItems: ISchedule_Item[];
}

export class Securitypatrol implements ISecuritypatrol {
  scheduleId: number = 0;
  scheduleTimeId: number = 0;
  roleId: number = 0;
  status: string = '';
  projectId:number=0;
  generatorId:number=0;
  securityPatrolName:string='';
  scheduleItems: Schedule_Item[] = [];
}

export interface ISchedule_Item {
  startTime: string;
  endTime: string;
}

export class Schedule_Item implements ISchedule_Item {
  startTime: string = '';
  endTime: string = '';
}

export class ScheduleItemDto {
  scheduleId: number = 0;
  roleId: number = 0;
  status: string = '';
  projectId:number=0;
	generatorId:number=0;
  securityPatrolName:string='';
  scheduleItems: Schedule_Item[] = [];
}



export interface IDisplaySecuritypatrol {
  scheduleId: number;
  scheduleTimeId: number;
  organizationId:number;
  projectName:string;
  location:string;
  scheduleTime:string;
  status:string;
  createdDate:string;
  userName:string;
  check:string;
  overallResult:string;
  yesCount:number;
}




export class DisplaySecuritypatrol implements IDisplaySecuritypatrol {

  scheduleId: number = 0;
  scheduleTimeId: number = 0;
  organizationId:number=0;
  projectName:string='';
  location:string='';
  scheduleTime:string='';
  status:string='';
  createdDate:string='';
  userName:string='';
  check:string='';
  overallResult:string='';
  yesCount:number=0;


}



export class IDisplaySecuritypatrolDto {
  scheduleId: number = 0;
  name: string = '';
  roleId: number = 0;
  organizationId:number=0;
  buildingId:number=0;
  location:string='';
  scheduleTime:string='';
  status:string='';
  createdDate:string='';
  userName:string='';
  check:string='';
  overallResult:string='';
  yesCount:number=0;
}
export class  ScheduleSecurityPatrolDto
{
  scheduleTimeId: number = 0;   // Default value for number
  scheduleId: number = 0;        // Default value for number
  generatorId: number = 0;       // Default value for number
  scheduleTime: string = '';      // Default value for string
  location: string = '';          // Default value for string
  roleId: number = 0;            // Default value for number
  status: string = '';            // Default value for string
  projectId: number = 0;         // Default value for number

}



export class ScheduleTimeDto {
  scheduleId: number = 0;           // Schedule ID
  scheduleTimeId: number = 0;       // Schedule Time ID
  roleId: string = '';              // Role ID (updated to string type)
  projectId: number = 0;            // Project ID
  generatorId: number = 0;          // Generator ID
  startTime: string = '';           // Start time
  endTime: string = '';             // End time
  securityPatrolName: string = '';  // Security patrol name
  status: string = '';              // Status
}

