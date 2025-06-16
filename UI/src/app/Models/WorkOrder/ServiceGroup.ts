export interface IServiceGroup {
  id: number;
  serviceGroupCategoryId: number;
  serviceGroupName: string;
  serviceGroupCode: string;
  serviceGroupTypeId: number;
  serviceGroupDescription: string;
  status: string;
}
export class ServiceGroup implements IServiceGroup {
  id: number = 0;
  serviceGroupCategoryId: number = 0;
  serviceGroupName: string = '';
  serviceGroupCode: string = '';
  serviceGroupTypeId: number = 0;
  serviceGroupDescription: string = '';
  status: string='';
}
export interface IServiceGroupDto {
  serviceGroupId: number;
  serviceGroupCategory: string;
  serviceGroupName: string;
  serviceGroupCode: string;
  serviceGroupType: string;
  serviceGroupDescription: string;
  serviceGroupStatus: string;
}

export class ServiceGroupDto implements IServiceGroupDto {
  serviceGroupId: number = 0;
  serviceGroupCategory: string = '';
  serviceGroupName: string = '';
  serviceGroupCode: string = '';
  serviceGroupType: string = '';
  serviceGroupDescription: string = '';
  serviceGroupStatus: string = '';
}
