import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mobilenumber'
})
export class MobilenumberPipe implements PipeTransform {

  transform(value: '0', mobilenumber: any = null): any {
    let c_number = '+63' + value;  
    return c_number;
  }

}
