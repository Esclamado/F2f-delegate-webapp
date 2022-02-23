import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { LayoutService } from 'src/app/services/tailwind/layout/layout.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDrawer } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { environment } from 'src/app/lib/environment';
import { Urls } from 'src/app//lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
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
export class HeaderComponent implements OnInit, OnChanges {
  @Input() drawer: MatDrawer = null;

  user: any;

  profile_photo_url: any;
  userProfile: any;
  isSocialEmpty: boolean = false;
  openProfile = false;
  open = false;
  expanded = true;
  openSidenav = false;
  sidenav = [
    {
      name: 'dashboard',
      icon: 'home',
      route: '/admin/dashboard'
    },
    {
      name: 'Companies',
      icon: 'apartment',
      route: '/admin/companies'
    },
    {
      name: 'Deligates',
      icon: 'home',
      route: '/admin/dashboard'
    },
    {
      name: 'Speaker',
      icon: 'person',
      route: '/admin/dashboard'
    },
    {
      name: 'Meeting Schedules & Agenda',
      icon: 'event_seat',
      route: '/admin/dashboard'
    },
    {
      name: 'Sponsor',
      icon: 'star',
      route: '/admin/dashboard'
    },
    {
      name: 'FAQs',
      icon: 'help',
      route: '/admin/dashboard'
    },
    {
      name: 'Event Managers',
      icon: 'person_add',
      route: '/admin/dashboard'
    },
    {
      name: 'Zoom Accounts',
      icon: 'videocam',
      route: '/admin/dashboard'
    },
  ]

  constructor(
    private layout: LayoutService,
    public router: Router,
    public env: environment,
    public request: RequestsService,
    private modal_service: NgxSmartModalService
  ) {
    this.layout.expanded.subscribe( res => {
      this.expanded = res;
    });
   }
  ngOnChanges() {
    this.user = JSON.parse(localStorage.getItem('user_profile'));
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.user = JSON.parse(localStorage.getItem('user_profile'));
      if(this.user){
        this.getUserProfile();
      }
    }, 1000);
    
    setTimeout(() => {
      this.user = JSON.parse(localStorage.getItem('user_profile'));

    }, 6000);
  }

  getUserProfile(){
    let url = Urls.api_delegates_get;
    url += '?by=id';
    url += '&isApp=true';
    url += '&delegate=' + this.user.id;

    this.request.get(url).then(response => {
      if(response.error == 0){
        this.user = response['data'];
      }
    })
  }

  toggleSidenav(){
    console.log('sadas')
    if(this.drawer){
      this.drawer.toggle();
    }else{
      this.layout.toggleSideNav(!this.expanded);
      this.layout.toggleEnableHover(!this.layout.enableMouseHover);
    }
  }

  public openProfileDropdown(){
    this.openProfile = !this.openProfile;
  }

  public openSidenavDropdown(){
    this.openSidenav = !this.openSidenav;
  }

  gotoEvent(){
    // this.router.navigate(['/events']);
    localStorage.removeItem('event');
    localStorage.removeItem('event_delegate_id');
    localStorage.removeItem('event_delegate_id');
    localStorage.removeItem('event_schedules');
  } 
  
  gotoPastEvent(){
    // this.router.navigate(['/past-events']);
    localStorage.removeItem('event');
    localStorage.removeItem('event_delegate_id');
  }

  logout(){
    this.modal_service.open('loaderModal');  
    localStorage.removeItem('user_profile');
    localStorage.removeItem('event');
    localStorage.removeItem('event_delegate');
    localStorage.removeItem('event_delegate_id');
    localStorage.removeItem('event_schedules');
    try {
      this.env.chatSocket.removeListener('chat message');
    } catch (error) {
      console.log('error', error)
    }finally{
      setTimeout(()=>{
        this.modal_service.close('loaderModal');  
        this.router.navigate(['/login'])
      },2500);
    }
    //this.env.removeFirebaseToken()
  }
}