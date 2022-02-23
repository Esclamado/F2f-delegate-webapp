import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { MatStepper } from '@angular/material/stepper';
import { environment } from 'src/app/lib/environment';
import { Urls } from 'src/app//lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',  
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  img_path = 'assets/images/bg-login-vector.png';
  show = false;
  login_password_type: string = 'password';
  login_form: FormGroup;
  forgot_form: FormGroup;
  isLoading = false
  @ViewChild('stepper') private main_stepper: MatStepper;
  patch_signin: any;
  constructor(
    private toastr: ToastrService,
    public router: Router,
    public fb: FormBuilder,
    public modal: NgxSmartModalService,
    private env: environment,
    private request: RequestsService,
    private _snackBar: MatSnackBar
    ) 
  {
    this.initializeForm(); 
    this.patch_signin = JSON.parse(localStorage.getItem('remember_me'));
    if(this.patch_signin){
      this.login_form.patchValue({email: this.patch_signin.email});
      this.login_form.patchValue({password: this.patch_signin.password});
    }

    this.openSnackBar('This app uses push notifications, please enable notifications to proceed', 'Enable');
  }

  ngOnInit(): void {
		this.env.requireNotLogIn();
    //this.env.exchangeToken();
  }

  async openSnackBar(message: string, action: string) {
    let permision = await this.env.permisionChecker();
    let browserPrivacy 
    await this.checkBrowserPrivacy().then(val => {
      browserPrivacy = val
    })

    console.log('browser stats', !permision + '||' + browserPrivacy );

    if(!permision){
      if(await this.env.getBrowserName() == 'safari' || browserPrivacy){
        // do nothing
      }else{
        this._snackBar.open(message, action, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
        }).onAction().subscribe(() => {
          this.env.askNotifPermision();
        })
      }
    } 
  }

  showPassword(bool) {
    this.show = bool;
    //console.log('boolean', bool);
    if (bool) {
    this.login_password_type = 'text';
    } else {
    this.login_password_type = 'password';
    }
  }

  initializeForm() {
    let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.login_form = this.fb.group({
      password: ['', Validators.compose([Validators.required, Validators.minLength(8),])],
      email: ['', Validators.compose([Validators.required, Validators.maxLength(70), Validators.email, Validators.pattern(emailRegex)])],
      rememberme:['',Validators.compose([])]
    });

    this.forgot_form = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.maxLength(70), Validators.email, Validators.pattern(emailRegex)])]
    });
  }
  
  showLoginPassword(bool) {
    this.show = bool;
    //console.log('boolean', bool);
    if (bool) {
      this.login_password_type = 'text';
    } else {
      this.login_password_type = 'password';
    }
  }

  async signIn(){

    //console.log('browser name' , this.getBrowserName())

    let browserPrivacy
    await this.checkBrowserPrivacy().then(val => {
      browserPrivacy = val
    })

    //console.log(browserPrivacy);

    if ('Notification' in window && Notification.permission == 'granted') {
      this.isLoading = true
      this.env.exchangeToken() 
  
      //console.log('storage checker', this.env.storageChecker())
  
      if(this.env.storageChecker()){
        this.sign()
      }else{
        setTimeout(() => {
          this.signIn()
        },1000)
      } 
    }else if(this.getBrowserName() == 'safari' || browserPrivacy){
      
      let device_token = 'cVxqju9gbkI:APA91bG366jmIjlrFlspNy4IeTSKirpOdIicShu_BpX-rQkXSWAf_nFZ8LCB_YRYfTIcbKbUlcku1D2zy2gpqr5LFWDVhkbAv9OusTADH4VfmeUhRwSkfMVzeY-L2HX5QSU3oEDXoeCG'
      this.env.setDeviceToken(device_token)
      localStorage.setItem('devicetoken', device_token)

      this.isLoading = true
      this.env.exchangeToken() 

      if(this.env.storageChecker()){
        this.sign()
      }else{
        setTimeout(() => {
          this.signIn()
        },1000)
      } 
      
    }else {
      this.toastr.error('Please Enable notifications')
    }
  }

  async checkBrowserPrivacy(){
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const {usage, quota} = await navigator.storage.estimate();
      console.log(`Using ${usage} out of ${quota} bytes.`);
  
      if(quota < 1000000000){
          console.log('Incognito')
          return true
      } else {
          console.log('Not Incognito')
          return false
      }   
    } else {
        console.log('Can not detect')
        return false
    }
  }

  sign(){
    if(this.login_form.valid){
      let formData = {
        email: this.login_form.controls.email.value,
        password: this.login_form.controls.password.value,
      };
      this.request.post(Urls.api_login, formData).then(data=>{
        if(data.error == 0){
          this.env.setToken(data.token);
          if (this.login_form.controls.rememberme.value){
            localStorage.setItem('user_profile', JSON.stringify(data.data));
            this.env.setToken(data.token,60);
            localStorage.setItem('remember_me', JSON.stringify(formData));
          } else {
            localStorage.setItem('user_profile', JSON.stringify(data.data));
            localStorage.removeItem('remember_me');
            this.env.setToken(data.token);
          }
          this.toastr.success('You have succesfully logged in!');
          this.router.navigate(['/events']);
        }else{
          this.toastr.error('Your email or password is incorrect')
        }
      }).finally(()=>{
        this.isLoading = false;
      })
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

  forgotPass(){
    this.router.navigate(['/forgotpass']);
  }

  prevStepper(){
    this.main_stepper.previous();
    this.forgot_form.reset();
  }


  openTerms(){
    this.router.navigate(['/loginTermsCondition']);
  }


  openAboutf2f(){
    this.router.navigate(['/loginAboutf2fScheduler']);
  }

  
  openPrivacy(){
    this.router.navigate(['/loginPrivacyPolicy']);
  }

}
