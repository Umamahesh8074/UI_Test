export interface IMenuDto {
  menuId: number;
  menuName: string;
  icon: string;
  menuItems: IMenuItemsDto[];
  expanded?: boolean;
}

export class MenuDto implements IMenuDto {
  menuId: number = 0;
  menuName: string = '';
  icon: string = '';
  menuItems: IMenuItemsDto[] = [];
}

export interface IMenuItemsDto {
  roleMenuItemId?: number;
  menuName?: string | null;
  menuId?: number;
  icon?: string;
  menuItemId?: number;
  menuItemName?: string;
  path?: string;
  roleId?: string;
  accessiable?: number;
  organizationId?: any;
}
export class MenuItemsDto implements IMenuItemsDto {}

export interface IMenuItemDto {
  roleMenuItemId?: number;
  menuItemId?: number;
  path?: string;
  roleId?: string;
  accessiable?: number;
}
export class MenuItemDto implements IMenuItemDto {}

export interface ICommonReferenceType {
  id: number;
  commonRefValue: string;
  commonRefKey: string;
}

export class CommonReferenceType implements ICommonReferenceType {
  id!: number;
  commonRefValue!: string;
  commonRefKey!: string;
  phoneNumberPattren?:string|undefined;
}

export class CommonReferenceDto {
  id!: number;
  commonRefValue!: string;
  commonRefKey!: string;
  phoneNumberPattren?:string|undefined;
  refValue:string=''
}
