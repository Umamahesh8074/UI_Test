import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianCurrency'
})
export class IndianCurrencyPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value === null || value === undefined) return '';

    // Ensure the value is a number
    value = typeof value === 'string' ? parseFloat(value) : value;

    // Format the integer part (lakhs, crores, etc.)
    const [integerPart, decimalPart] = value.toFixed(2).split('.');
    
    const formattedIntegerPart = this.formatIntegerPart(integerPart);
    
    // Return formatted value
    return `₹${formattedIntegerPart}.${decimalPart}`;
  }

  // Format the integer part to Indian numbering system
  private formatIntegerPart(value: string): string {
    const lastThree = value.slice(-3);
    const otherNumbers = value.slice(0, value.length - 3);
    if (otherNumbers !== '') {
      return `${otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${lastThree}`;
    }
    return lastThree;
  }
}
