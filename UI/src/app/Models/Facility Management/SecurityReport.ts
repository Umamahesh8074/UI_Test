// Interface for ScheduleWithReports
export interface IScheduleWithReports {
  projectName: string;
  location: string;
  scheduleTime: string;
  status: string;
  userId: number;
  userName: string;
  phoneNumber: string;
  scheduleId: number;
  scheduleTimeId: number;
  imageUrl: string;
  createdDate: Date;
  qrScanStatus: string;
  formatedScheduleTime: string;
}

// Class for ScheduleWithReports
export class SecurityReport implements IScheduleWithReports {
  projectName: string = '';
  location: string = '';
  scheduleTime: string = '';
  status: string = '';
  userId: number = 0;
  userName: string = '';
  phoneNumber: string = '';
  scheduleId: number = 0;
  scheduleTimeId: number = 0;
  imageUrl: string = '';
  createdDate: Date = new Date();
  qrScanStatus: string = '';
  formatedScheduleTime: string = '';
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

