import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  scrollSubject: Subject<any> = new Subject();
  scrollSubscription = this.scrollSubject.asObservable();
  scroll: any;
  constructor() { 
  }

  updateScroll(data){
    // this.scrollSubject.next(data);
    this.scroll = data
  }
  getscroll(){
    return new Promise((resolve)=>{
      resolve(this.scroll)
    })
  }

  
}
