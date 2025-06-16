export interface IMenu {
  menuId: number;
  menuName: string;
  status: string;
  organzationId: any;
  order: any;
  icon: any;
}

export class Menu implements IMenu {
  menuId: number = 0;
  menuName: string = '';
  status: string = '';
  organzationId: any;
  order: any;
  icon: any;
}
