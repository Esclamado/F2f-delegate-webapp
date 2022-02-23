import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'
import { ToastrService } from 'ngx-toastr';
import { Urls } from 'src/app//lib/urls';
import { environment } from 'src/app/lib/environment';
import { RequestsService } from 'src/app/services/http/requests.service';


@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.scss']
})
export class ForgotPassComponent implements OnInit {

  isLoading: boolean = false;
  forgot_form: FormGroup;
  bg_img_path = 'assets/images/bg-login-vector.png';

  user_email: any = null;
  prev_page: any = null;

  constructor(
    public fb: FormBuilder,
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private request: RequestsService,
    private toastr: ToastrService,
    public env: environment
  ) { 
    this.initializeForm();
  }

  initializeForm(){
    let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.forgot_form = this.fb.group({
      email: ['',
      Validators.compose([
        Validators.required,
        Validators.maxLength(70),
        Validators.email,
        Validators.pattern(emailRegex)
      ])
    ]
    })
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['user_email']){
        this.user_email = params.user_email;
        console.log('user_email', this.user_email);
        this.forgot_form.controls.email.setValue(this.user_email);
      }  
      if(params['prev_page']){
        this.prev_page = params.prev_page;
        console.log('prev_page', this.prev_page);
      }
    });
  }
  gotoUserProfile(){
    this.router.navigate([this.prev_page])
  }
  backToLogin(){
    this.router.navigate(['/login'])
  }
  submit(){

    if ('Notification' in window && Notification.permission == 'granted') {

      this.env.exchangeToken();

      if(this.env.storageChecker()){
        console.log(this.forgot_form.controls.email.value)
        if(this.forgot_form.valid){
          let formData = {
            email: this.forgot_form.controls.email.value,
          };
          this.request.post(Urls.mapi_delegate_forgotpassword, formData).then(data=>{
            //console.log('data: ', data)
            if(data.error == 0){
              console.log('data: ', data)
              this.toastr.success(data.message);
              this.router.navigate(['/login']);
            }else{
              this.toastr.error('Error.',data.message)
            }
    
          })
        }
      }else{
        setTimeout(() => {
          this.submit()
        },1000)
      } 

    }else if(this.getBrowserName() == 'safari'){

      let device_token = 'cVxqju9gbkI:APA91bG366jmIjlrFlspNy4IeTSKirpOdIicShu_BpX-rQkXSWAf_nFZ8LCB_YRYfTIcbKbUlcku1D2zy2gpqr5LFWDVhkbAv9OusTADH4VfmeUhRwSkfMVzeY-L2HX5QSU3oEDXoeCG'
      this.env.setDeviceToken(device_token)
      localStorage.setItem('devicetoken', device_token)

      this.env.exchangeToken() 

      if(this.env.storageChecker()){
        console.log(this.forgot_form.controls.email.value)
        if(this.forgot_form.valid){
          let formData = {
            email: this.forgot_form.controls.email.value,
          };
          this.request.post(Urls.mapi_delegate_forgotpassword, formData).then(data=>{
            //console.log('data: ', data)
            if(data.error == 0){
              console.log('data: ', data)
              this.toastr.success(data.message);
              this.router.navigate(['/login']);
            }else{
              this.toastr.error('Error.',data.message)
            }
    
          })
        }
      }else{
        setTimeout(() => {
          this.submit()
        },1000)
      } 
    }

  
  }

  public getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase()
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(<any>window).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
}
}
