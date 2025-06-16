export interface IStandInUser{ 
id: number;

managerId: number;

userId: number;

status: string;

} export class StandInUser implements IStandInUser { 
id: number=0;

managerId: number=0;

userId: number=0;

status: string='';

} export interface IStandInUserDto { 
id: number;

managerId: number;

managerName: string;

userId: number;

userName: string;

status: string;

} export class IStandInUserDto implements IStandInUserDto { 
id: number=0;

managerId: number=0;

managerName: string='';

userId: number=0;

userName: string='';

status: string='';

}