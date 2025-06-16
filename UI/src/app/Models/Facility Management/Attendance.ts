export class Attendance {
  constructor(
    public attendanceId: number,
    public userId: number,
    public attendanceInDate: string,
    public attendanceInTime: string,
    public attendanceOutDate: string,
    public attendanceOutTime: string,
    public logInLocationId: number,
    public logOutLocationId: number,
    public status: string,
    public attendanceStatus: string,
    public employeeId: number,
    public shiftId: number,
    public autoLogOut: string
  ) {}
}
