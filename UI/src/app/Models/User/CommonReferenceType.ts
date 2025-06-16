export interface ICommonReferenceType {
  id: number;
  name: string;
  

}
export class CommonReferenceType implements ICommonReferenceType {
  id: number = 0;
  name: string = '';

}


export class CommonReferenceTypeDto  {
  id: number=0;
  name: string='';
  roleId:number=0;

}
