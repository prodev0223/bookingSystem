import {Pipe, PipeTransform} from '@angular/core';
import {format} from 'date-fns'

@Pipe({
  name: 'myTimeOnly'
})
export class MyTimeOnlyPipe implements PipeTransform {

  transform(value: Date, ...args: unknown[]): string {
    let dateFormat = "HH:mm";
    return format(value, dateFormat);
  }
}
