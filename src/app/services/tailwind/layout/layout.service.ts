import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  expandedSubj = new BehaviorSubject(true);
  expanded = this.expandedSubj.asObservable();

  enableMouseHover = false;

  constructor() { }

  toggleSideNav(bool){
    this.expandedSubj.next(bool);
  }
  toggleEnableHover(bool){
    this.enableMouseHover = bool;
  }
}
