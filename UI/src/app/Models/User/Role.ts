export interface IRole {
  roleId: number;
  roleName: string;
  status: string;
  homePageId: number;
}

export class Role implements IRole {
  public roleId: number = 0;
  public roleName: string = '';
  public status: string = '';
  public homePageId: number = 0;
}

export interface IRoleDto {
  roleId: number;
  roleName: string;
  status: string;
  homePageId: number;
  homePageName: string;
  homePagePath: string;
}

export class RoleDto implements IRoleDto {
  public roleId: number = 0;
  public roleName: string = '';
  public status: string = '';
  public homePageId: number = 0;
  public homePageName: string = '';
  public homePagePath: string = '';
}
