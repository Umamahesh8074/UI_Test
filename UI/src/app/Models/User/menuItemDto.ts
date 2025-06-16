export interface IMenuItemDto {
    menuItemId?: number;
    menuItemName?: string;
    path?:string;
    menuId?:number;
    status?:string;
    menuName?:string;
  }
  export class MenuItemDto implements IMenuItemDto{

    public menuItemId: number=0;
    public menuItemName: string='';
    public path:string='';
    public menuId:number=0;
    public status:string='';
    public menuName:string='';
   
  }
  export class Page<T> {
    pageNo: number = 0;
    pageSize: number = 0;
    last: boolean = false;
    first: boolean = false;
    totalPages: number = 0;
    records: any;
    totalRecords:number=0;
  }
  