import { AfterViewInit, Component, HostListener, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd} from '@angular/router';
import { ScrollService } from 'src/app/services/scroll/scroll.service';
import { LayoutService } from 'src/app/services/tailwind/layout/layout.service';
import { environment } from 'src/app/lib/environment';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit,AfterViewInit {

  @ViewChild('scheduleContainer')
  scheduleContainer: ElementRef;

  innerWidth:any;
  isOpenChat: boolean = false;
  isOpenAvatar: boolean = true;
  scroll_btn: any
  show: boolean = false;
  @HostListener('window:resize', ['$event'])
  @ViewChild('content') content: any;
  show_popup = false;
  onResize() {
    let width = this.innerWidth = window.innerWidth;
    if(width <= 768){
      this.isMobile = true;
    }else{
      this.isMobile = false;
    }
  }
  expanded = true;
  isMobile:boolean=false;

  constructor(
    public layout: LayoutService,
    public scroll: ScrollService,
    public renderer: Renderer2,
    public router: Router,
    public env: environment
  ) { 
    this.layout.expanded.subscribe( res => {
      this.expanded = res;
    })
    
  }
  ngAfterViewInit(){
    setTimeout(() => {
      var height = this.scheduleContainer.nativeElement.offsetHeight;
      console.log('template_container', height);
      this.env.template_container = height;
    }, 1000);
  }

  ngOnInit(): void {
    this.onResize();
    console.log(this.router.url);
    this.initializeSub()
  }
  
  initializeSub(){
    if(this.router.url == '/my-schedule-virtual' || this.router.url == '/my-schedule' || this.router.url == '/find-delegates'){
      this.show_popup = true;
      return true;
    }else{
      this.show_popup = false;
      return false;
    }
  }
  minimize(){
    this.isOpenChat = false;
  }
  close(){
    this.isOpenChat = false;
    this.isOpenAvatar = false;
  }
  openChat(){
    this.isOpenChat = !this.isOpenChat;
  }
  
  onScroll(ev){
    let scrollHeight = ev.target.scrollHeight;
    let combined = ev.target.scrollTop + ev.target.clientHeight;
    ev.target.scrollTop >= 689 ? this.show = true: this.show = false;
    let toTopbtn = document.getElementById('toTopbtn')
    if(this.show){
      if(toTopbtn){
        this.renderer.setStyle(toTopbtn, 'bottom', '1rem')
        this.renderer.setStyle(toTopbtn, 'webkitTransition', 'bottom 300ms')
      }
    }
  }
  goToTop(){
    this.scroll.getscroll().then((data : any)=>{
      console.log('data: ', data)
      data.scrollIntoView({
        "behavior": "smooth",
        "block":"start"
      })
    })
  }

  logout(){
    this.env.loaderText = 'Logging out ...';
    this.env.spinner.show(this.env.loaderSpinner);
    localStorage.removeItem('user_profile');
    localStorage.removeItem('event');
    localStorage.removeItem('event_delegate');
    localStorage.removeItem('event_delegate_id');
    localStorage.removeItem('event_schedules');
    this.env.deleteCookie();    
    setTimeout(()=>{
      this.env.spinner.hide(this.env.loaderSpinner);
      this.env.router.navigate(['/login'])
    },1000);
  }
  
}
