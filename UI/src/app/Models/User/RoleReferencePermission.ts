export interface IRoleReferencePermission {
  id: number;
  roleId: number;
  referenceTypeId:number;

}
export class RoleReferencePermission implements IRoleReferencePermission {
  id: number=0;
  roleId: number=0;
  referenceTypeId:number=0;

}






