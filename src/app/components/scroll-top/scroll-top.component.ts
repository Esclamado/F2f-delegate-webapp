import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-scroll-top',
  templateUrl: './scroll-top.component.html',
  styleUrls: ['./scroll-top.component.scss']
})
export class ScrollTopComponent implements OnInit {
  isShow: boolean;
  topPosToStartShowing = 100;
  @Input() mySched: any;
  @Input() scroll: any;;
  @HostListener('window:scroll')
  checkScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    console.log('[scroll]', scrollPosition);
    if (scrollPosition >= this.topPosToStartShowing) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
    
  }
  constructor(
    private element: ElementRef,
  ) {

   }

  ngOnInit(): void {
    let elem = document.getElementById('my_sched')
  }

  goUp(){
    console.log('window', window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    }))
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
  }

}
function input() {
  throw new Error('Function not implemented.');
}

