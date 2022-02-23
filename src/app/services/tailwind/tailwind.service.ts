import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TailwindService {

  constructor() { }

  darkMode : boolean = false;
  toggleDarkMode(){
    this.darkMode = !this.darkMode;
    let html = document.getElementsByTagName('html');
    html[0].classList.contains('dark') ? html[0].classList.remove('dark') : html[0].classList.add('dark');
    console.log('html', html);
  }
}
