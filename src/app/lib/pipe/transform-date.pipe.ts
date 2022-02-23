import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment/moment';

@Pipe({
  name: 'transformDate'
})
export class TransformDatePipe implements PipeTransform {

  transform(date, from_format = 'YYYY-MM-DD hh:mm:ss', to_format = 'MMMM dd YYYY') {
    return moment(date, from_format).format(to_format);
  }

}