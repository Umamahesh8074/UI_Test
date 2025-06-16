export interface IUser {
  userId?: number;
  userName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  roleId?: number;
  roleName?: string;
  managerId?: number;
  status?: string;
  managerName?: string;
  homePathId?: number;
  homePath?: string;
  organizationName?: string;

  title?: string;
  userProfileUrl?: string;
  isCanBulkUpload?: string;
  bulkUploadLimit?: number;
  multiLogin?: string;
  employeeId?: number;
}

// export class User implements IUser {
//   public userId = 0;
//   public userName = '';
//   public email = '';
//   public phoneNumber = '';
//   public password = '';
//   public roleId = 0;
//   public roleName = '';
//   public managerId = 0;
//   public status = '';
//   public managerName = '';
//   public organizationId = 0;

//   roleName?:string;
//   managerId?:number
//   status?:string;
//   managerName?:string;
//   organizationId?:number;
// }

export class User implements IUser {
  public userId = 0;
  public userName = '';
  public email = '';
  public phoneNumber = '';
  public password = '';
  public roleId = 0;
  public roleName = '';
  public managerId = 0;
  public status = '';
  public managerName = '';
  public organizationId = 0;
  public homePathId = 0;
  public homePath = '';
  public organizationName = '';
  public shiftStartTime = '';
  public shiftEndTime = '';
  public title = '';
  public userProfileUrl = '';
  public isCanBulkUpload = '';
  public bulkUploadLimit = 0;
  public cpRegisterId = 0;
  public multiLogin = '';
  public employeeId = 0;
}
export class OrgDto {
  userId: number = 0;
  userName: string = '';
  title: string = '';
}

export class Page<T> {
  pageNo: number = 0;
  pageSize: number = 0;
  last: boolean = false;
  first: boolean = false;
  totalPages: number = 0;
  records: any;
  totalRecords: number = 0;
}
