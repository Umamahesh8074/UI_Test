import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'keyvalueUnique'
})
export class KeyvalueUniquePipe implements PipeTransform {
  transform(value: any[], key: string): any[] {
    return Array.from(new Set(value.map(item => item[key])))
      .map(uniqueKey => value.find(item => item[key] === uniqueKey));
  }
}
