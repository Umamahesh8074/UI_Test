import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullMonthName'
})
export class FullMonthNamePipe implements PipeTransform {
  private monthMap: { [key: string]: string } = {
    jan: 'January',
    feb: 'February',
    mar: 'March',
    apr: 'April',
    may: 'May',
    jun: 'June',
    jul: 'July',
    aug: 'August',
    sep: 'September',
    oct: 'October',
    nov: 'November',
    dec: 'December'
  };

  transform(shortMonth: string): string {
    // Convert the input month to lowercase
    const monthKey = shortMonth ? shortMonth.toLowerCase() : '';
    return this.monthMap[monthKey] || shortMonth;
  }
}
