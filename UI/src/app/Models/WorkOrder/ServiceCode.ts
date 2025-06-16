export interface IServiceCode {
  id: number;
  serviceGroupId: number;
  primeActivityId: number;
  serviceUomId: number;
  serviceDescription: string;
  sacCodeId: number;
  serviceCode: string;
  status: string;
}

export class ServiceCode implements IServiceCode {
  id: number = 0;
  serviceGroupId: number = 0;
  primeActivityId: number = 0;
  serviceUomId: number = 0;
  serviceDescription: string = '';
  sacCodeId: number = 0;
  serviceCode: string = '';
  status: string = '';
}

export interface IServiceCodeDto {
  serviceCodeId: number;
  serviceDescription: string;
  sacCode: string;
  serviceCode: string;
  serviceCodeStatus: string;
  serviceUomId: number;
  scUomRefValue: string;
  serviceGroupId: number;
  serviceGroupName: string;
  serviceGroupCode: string;
  serviceGroupTypeId: number;
  sgTypeRefValue: string;
  primeActivityId: number;
  primeActivityNumber: string;
  primeActivityDescription: string;
  primeActivityUomId: number;
  paUomRefValue: string;
}
export class ServiceCodeDto implements IServiceCodeDto {
  serviceCodeId: number = 0;
  serviceDescription: string = '';
  sacCode: string = '';
  serviceCode: string = '';
  serviceCodeStatus: string = '';
  serviceUomId: number = 0;
  scUomRefValue: string = '';
  serviceGroupId: number = 0;
  serviceGroupName: string = '';
  serviceGroupCode: string = '';
  serviceGroupTypeId: number = 0;
  sgTypeRefValue: string = '';
  primeActivityId: number = 0;
  primeActivityNumber: string = '';
  primeActivityDescription: string = '';
  primeActivityUomId: number = 0;
  paUomRefValue: string = '';
}
