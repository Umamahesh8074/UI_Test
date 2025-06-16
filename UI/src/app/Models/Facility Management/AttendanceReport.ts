export class AttendanceReportDto {
  constructor(
    public userId: number,
    public userName: string,
    public locationId: number,
    public locationName: string,
    public presentCount: number,
    public absentCount: number
  ) {}
}

export class AttendanceCountDto {
  constructor(
    public count: number,
    public attendanceStatus: string,

    public createdDate: Date,
    public lateComerCount: number,

    public earlyLeaverCount: number
  ) {}
}
