import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: "series",
  standalone: true,
})
export class SeriesPipePipe implements PipeTransform {

  transform(value: any, args: any): any {
    if (args === "radar") {
      return value.map((c: { name: any; data: any; }) => {
        return {
          name: c.name,
          data: c.data,
        };
      });
    }

    return value;
  }

}
