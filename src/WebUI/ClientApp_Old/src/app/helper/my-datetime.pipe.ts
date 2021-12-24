import {Pipe, PipeTransform} from '@angular/core';
import {format} from 'date-fns'

@Pipe({
  name: 'myDatetime'
})
export class MyDatetimePipe implements PipeTransform {
  transform(value: Date, ...args: unknown[]): string {
    let dateFormat = "yyyy-MM-dd HH:mm";
    return format(value, dateFormat);
  }
}
