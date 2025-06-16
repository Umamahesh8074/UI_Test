import { Page } from 'src/app/Models/User/User';
import { LeaveRequestDto } from './LeaveRequestDto';

export class LeaveRequestPageWithReporteeCount {
    totalReporteeCount: number = 0;
    pageData!: Page<LeaveRequestDto[]>;
  }