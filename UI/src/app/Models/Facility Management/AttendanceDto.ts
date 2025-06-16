export interface IAttendanceDto {
  attendanceId?: number;
  userId?: number;
  userName?: string;
  attendanceInDate?: Date;
  attendanceOutDate?: Date;
  attendanceInTime?: string;
  attendanceOutTime?: string;
  logInLocationId?: number;
  logOutLocationId?: number;
  logInLocationName?: string;
  logOutLocationName?: string;
  attendanceStatus?: string;
  shiftId?: number;
  commonRefKey?: string;

  commonRefValue?: string;
  employeeId?: number;
  roleId?: number;
  roleName?: string;
  currentStatus?: string;
}

export class AttendanceDto implements IAttendanceDto {
  constructor(
    public attendanceId: number,
    public userId: number,
    public userName: string,
    public attendanceInDate: Date,
    public attendanceOutDate: Date,
    public attendanceInTime: '',
    public attendanceOutTime: '',
    public logInLocationId: number,
    public logOutLocationId: number,
    public logInLocationName: string,
    public logOutLocationName: string,
    public attendanceStatus: string,
    public shiftId: number,
    public commonRefKey: string,
    public commonRefValue: string,
    public employeeId: number,
    public roleId: number,
    public roleName: string,
    public currentStatus: string
  ) {}
}
