import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency'
})
export class CurrencyPipe implements PipeTransform {

  // transform(value: any, ...args: any[]): any {
  //   return null;
  // }

  transform(value:any = 0, currency: any = null): any {

    if(!currency){
      currency = 'PHP';
    }
    // if you want two decimal
    let nf = new Intl.NumberFormat('tl-PH', { style: 'currency', currency: currency });
    /* let nf = new Intl.NumberFormat(); */

    let amount = parseFloat(value);
    return nf.format(amount);
  }


}
