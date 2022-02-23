import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appScroll]',
  host: {'scroll': 'onScroll($event)'}
})
export class ScrollDirective {
  element: any; 
  @Input() mySched
  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    console.log('[scroll]', scrollPosition);
  }
  constructor() { 
    console.log('constructor ni dei', this.mySched)
  }
  onScroll(ev){
    // console.log(ev);
  }

}
