export interface IUserDto {
  userId?: number;
  userName?: string;
  email?: string;
  showPassword?: string;
  phoneNumber?: string;
  roleId?: number;
  roleName?: string;
  managerId?: number;
  status?: string;
  managerName?: string;
  userScanDetails: any;
  companyName?: string;
}

export class UserDto implements IUserDto {
  public userId = 0;
  public userName = '';
  public email = '';
  public phoneNumber = '';
  public roleId = 0;
  public roleName = '';
  public managerId = 0;
  public status = '';
  public managerName = '';
  public showPassword = '';
  public companyName = '';
  public userScanDetails = [];
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
