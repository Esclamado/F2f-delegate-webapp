import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/services/tailwind/layout/layout.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDrawer } from '@angular/material/sidenav';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('easeUpDown', [
      state('true', style({
        transition: 'all 200ms ease-in',
        transform: 'translateY(0%)',
        opacity: 1
      })),
      state('false', style({
        transition: 'all 200ms ease-out',
        transform: 'translateY(75%)',
        opacity:0
      })),
      transition('true => false', animate('200ms')),
      transition('false => true', animate('200ms'))
    ])
  ]
})
export class SidenavComponent implements OnInit {
  @Input() drawer: MatDrawer = null;
  dataArr:any;
  
  isActive = false;
  open = false;
  activeTabe = '';
  isDark = false;
  isSettingsPanelOpen = false;
  isNotificationsPanelOpen = false;
  isSearchPanelOpen = false;
  isMobileSubMenuOpen = false;
  isMobileMainMenuOpen = false;
  activeNavigation = 'dashboard';
  openProfile = false;

  expanded = true;
  showText = true;
  showTextTimeOut:any;
  sidenav_items = [
    { 
    route: 'admin/companies', 
    icon:`<svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>`, 
    title: 'Dashboard' },
  ]
  constructor(
    private layout: LayoutService,
    public router: Router
  ) {
    this.layout.expanded.subscribe( res => {
      // console.log('res:',res);
      this.expanded = res;
      if(res){
        this.showTextTimeOut = setTimeout(()=>{
          this.showText = true;
        },200);
      } else {
        clearTimeout(this.showTextTimeOut);
        this.showText = false;
      }
    })
  }

  ngOnInit(): void {
  }
  showImage(e,bool){
    if( this.layout.enableMouseHover ){
      this.layout.toggleSideNav(bool);
    }
  }
  
  public setActiveNav(nav = 'dashboard'){
    if(nav === this.activeNavigation){
      this.activeNavigation = '';
    }else{
      this.activeNavigation = nav;
    }
  }
}
