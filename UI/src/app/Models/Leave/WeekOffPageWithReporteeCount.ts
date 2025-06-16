import { Page } from 'src/app/Models/User/User';
import { WeekOffDto } from './WeekOffDto';

export class WeekOffPageWithReporteeCount {
    totalReporteeCount: number = 0;
    pageData!: Page<WeekOffDto[]>;
  }