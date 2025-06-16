export interface ICommonReferenceDetailsDto {
  id: number;
  referenceTypeId: number;
  commonRefKey: string;
  commonRefValue: string;
  name: string;
  roleId:number;
}
export class CommonReferenceDetailsDto implements ICommonReferenceDetailsDto {
  id: number = 0;
  referenceTypeId = 0;
  commonRefKey: string = '';
  commonRefValue: string = '';
  name: string = '';
  roleId:number=0;
}
