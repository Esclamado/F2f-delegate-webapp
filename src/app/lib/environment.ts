import {Injectable, Inject} from '@angular/core';
import {Jwt} from './Jwt';
import {cookie} from './cookie';
import {Urls} from './urls';
import {Router} from '@angular/router'

import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, mergeMap, tap} from 'rxjs/operators';
import {DOCUMENT} from '@angular/common';
import {Title} from '@angular/platform-browser';

import * as moment from 'moment';
import 'moment/locale/en-gb';
import { env } from 'process';
import { environment as envs } from 'src/environments/environment'
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClockService } from 'src/app/services/clock.service';
import { ChatService } from 'src/app/services/chat/chat.service';

import { ToastrService } from 'ngx-toastr';
import { DeviceDetectorService } from 'ngx-device-detector';

import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class environment {

    private secure = true;
    public subdomain = 'local_';

    // public domain = 'face2facescheduler.com';
    // public domain = 'stagetest.face2facescheduler.com';
    public domain = 'app.face2facescheduler.com';
    // public domain = 'web.face2facescheduler.com';
    //public domain = 'dev.df2f.com';

    public url = 'http://panel.face2facescheduler.com';
    public secureUrl = 'https://panel.face2facescheduler.com';

    // public url = 'http://stagingapi.face2facescheduler.com';
    // public secureUrl = 'https://stagingapi.face2facescheduler.com';

    // public url = 'http://api.face2facescheduler.com';
    // public secureUrl = 'https://api.face2facescheduler.com';

    public devicetoken: any //= 'cVxqju9gbkI:APA91bG366jmIjlrFlspNy4IeTSKirpOdIicShu_BpX-rQkXSWAf_nFZ8LCB_YRYfTIcbKbUlcku1D2zy2gpqr5LFWDVhkbAv9OusTADH4VfmeUhRwSkfMVzeY-L2HX5QSU3oEDXoeCG';
    public deviceid: any;
    private apikey = 'Jk7BfTC5bgGFVQXETPKjcMnrNVam56Q35cXY2yHP8GjaBJ5wbfQgjxp5SyXRhgNhbs922MZnv9qwyQ7mNuL3PWSHmzAJCcL2MENd';
    
    // public devicetoken: any;
    // public deviceid: any;
    // private apikey = 'Jk7BfTC5bgGFVQXETPKjcMnrNVam56Q35cXY2yHP8GjaBJ5wbfQgjxp5SyXRhgNhbs922MZnv9qwyQ7mNuL3PWSHmzAJCcL2MENd';

    /* live */
    public socketPort: any = 3000; 
  
    /* panel */
    //public socketPort: any = 3001;
  
    /* testapi */
    //public socketPort: any = 3002;  

    public chatSocket: any;

    public unread_msg: any = {};
    public push_click_counter: any = 0;

    metaApiKey ='Basic ' + btoa('leentechdev@gmail.com:LWuPu6TqIQJkoLu4PJRB');

    firebase_admin = {
        type: "service_account",
        project_id: "dataplay-301309",
        private_key_id: "2f63174b47c44c50663ee6813d41f9d8c68b3bce",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC4uOCz32SSwCzg\nLjtRwYisP9ihN2ethhuiZekZ5LQH3gnAskHFcv5Mw5DufOEivG9h7h0+PtQHUwXQ\n6GXYnzvWZ72aTOiURIT5Nw4V3dut68/t1br/+3mT4+h8AvM3gmuG+GPTFn8XZz6p\nPqngAWYN3BbwURKoHQaHZKHWMOTXp6nTuBPsOQ1C2EBYDvAqseApyh0berLe90QH\nM5ZJShRsQRTB89tWMYKGH0gz++qp3o9KkCUXRsLeaYWVg/hRENr+QU9v4YpgcTJn\nCDoaGSfc6cwEdELae/bsWoIRbdreYiiJp2/fa1IPVGfYVMc7dsF8/HO+zPzqzWDy\ngMhPbpANAgMBAAECggEASxa4HNY7612cQFr6uQ6rcJ2ZgVtk1UhVFmxH18M8nZAY\nNdEgZFOM5QaAdTmlSPoBavUgxQtEJGAO1q+Jqwd7ivnrvHvz9UVvKmFDZAcmBCp+\nAQenNuRyNPhpqnOGi7OD4z84UPftnMVW1vSGmGzpH8wuNO034Me/vizdjpScib7H\nLljmDar7eYjHmhnpafzv7PceJnFbu1dguN/CYb9LUXUXBHeDxMmKee69Vohvf/49\nQF7W8s0PCgt3KHhNaFdX8p2s6lnmj1t9TbiLfr1u33TxorTEhfHMUXouNTErGIha\nvmLpzKwzrQ3Dp+5W9rzo+IUR2JDfXeD8Y7Mhmxk2bwKBgQD4gWADEdMRWryiaACB\nJMDxSbxsGol/kptOuQBBsjSN3D3QaaxhDTEKtcMJqkujsqh586jWojS/QbidQkH4\nPjUgBJuy627VdCNt+8gNzQ8VWtpy5jVaOzyJf1LFHlkcWzs9BggQt1q7VAg6byIJ\nLnt5o1Oqrebzqwaj+4kqSrhLAwKBgQC+Sw3zAqlatpBjsPmjhANziMj37ifaMp6K\nleWKJfSUPnQgCjUEBN41N0ycqNqoxqNaySdq4qzqMu37rKebVPMWjui0QdjNjyUK\ne+yrep9TKojDKpcI2GHhKMKSi1pt0yaoafurIfQEQK1RLOO0sfeRxX0d3PUfov2D\nnSXRA3DDrwKBgQCC/xgQpi3AQTec2PwjF6/JwdfcmKSQpkTOW8Fh4EHJ4iaHnZzr\n0BthDO2SQ735ve0H1ETVV848X7Wk2E+UP56bkTJOP8M+LCmdCZOsisL/u9PZq7bG\nKOHBjWehV10cEI+KnIpV3YGrrCFmRD0J4AHg3hL1rxRGsIogmTD2JUs+5wKBgCzJ\nu4nDyZp5N7jPEaKj0rAhtLNuEWEw4tHZgAIo9szhejGEVYARqT87OcPxli19OzuF\n9soYefxRamP++h/8OY7IqgqrKN0Q4PX7vvOJU/CeJTxSTOQfEcKN9mXJeMo6lXG0\nKDDaN/W8R07A0wNXk95ybgVWWTdOBH8ywJDWT3cvAoGAYmWllMG/oUdeUh6ntKGM\nGZM2ZMIM/b5ILKsJWo8h81UWjgWVrqSXmfhPKh0CRzZLwK9RTPObX5Mt55rkWLcq\nXfhBAp3+YnAmd+GALAdPLOk8uMUf/oIXMCcZFXNN27glMdqlLNBa8XZidwFhWkBQ\nHcA1ypoh4O9cE3kaR0L4wB8=\n-----END PRIVATE KEY-----\n",
        client_email: "firebase-adminsdk-8m49a@dataplay-301309.iam.gserviceaccount.com",
        client_id: "113034456452039346239",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-8m49a%40dataplay-301309.iam.gserviceaccount.com"
    }

    loaderSpinner = 'loaderSpinner';
    loaderText = '';
    progressbarValue: any = 15;

    skeleton_loader: any = [
        { id: '1' },
        { id: '2' },
        { id: '3' }
    ];

    clockService: any = null;
    template_container: any;

    constructor(
        @Inject(DOCUMENT)private document : Document, 
        public http : HttpClient, 
        public cookie : cookie,
        public title: Title,
        public router: Router,
        public sanitizer: DomSanitizer,
        public spinner: NgxSpinnerService,
        public toastr: ToastrService,
        public deviceService: DeviceDetectorService,
        // private messageService : MessageService, 
        private angularFireMessaging: AngularFireMessaging
    ) {
        this.clockService = new ClockService();
        this.initChatSocket();
        //this.firebaseToken();

      
    } 

    parseDate(str) {
        var mdy = str.split('-');
        
        //console.log('ck date', new Date(mdy[0], mdy[1]-1, mdy[2]));
        return new Date(mdy[0], mdy[1]-1, mdy[2]);
    }

    datediff(first, second) {

        let first_date = this.parseDate(first)
        let end_date = this.parseDate(second)
        // Take the difference between the dates and divide by milliseconds per day.
        // Round to nearest whole number to deal with DST.
        return Math.round((end_date.valueOf() - first_date.valueOf())/(1000*60*60*24));
    }
    

    /* chat */
    disconnectSocket(){
        this.chatSocket.disconnect();
    }

    initChatSocket(){
        this.isLogedIn().then(data => {
            if(data){
                this.setSocket('chatSocket', ChatService, this.socketPort, {query:{user: this.payload.jti}});
                console.log('chat socket: ', this.chatSocket)
            }
        })
    }

    setSocket(socketConatiner: any, socket:any, port:any, opt: any = null){
        let options = {
          url: 'https://face2facescheduler.com:'+port, 
          options: {}
        }
        if(opt){
          options.options = opt;
        }
        this[socketConatiner] = new socket(options);
      }

    getUrl( path: string ):any{
        let url = '';
        if(this.secure == true){
            url += this.secureUrl;
        } else {
            url += this.url;
        }
        url += path;
        return url;
    };

    createUrlParam(p){
        let uriStr = '?';
        for (let key of Object.keys(p)) {
          if(p[key]){
            uriStr += key + '=' + p[key] + '&';
          }
        }
        return uriStr
    }

    getToken() {
        /* this.cookie.setCookie('token', 'token 2', 2, '/', '.test.dv');
        this.cookie.setCookie('token', null, -1, '/', '.test.dv');
        //console.log(this.cookie.getCookie('token'));
        let tz = Jwt.getTimezone();
        let token = Jwt.setAlgo('HS256').setClaim('token', 'exchange').setClaim('tzoffset', tz.gmt).setClaim('tzname', tz.name).setIssuedAt().setSecret(this.apikey).getToken();
        return token; 
        */
        return 'true';
    }

    setToken(token : any, day : number = 0): any {
        localStorage.setItem('aup_f2f_token', token);
        // this.cookie.setCookie('aup_f2f_token', token, day, '/', this.domain); // '.'+
    }

    getCookie(name : string): any {
        return this.cookie.getCookie(name);
    }
    setCookie(name: any,data: any, day: number = 0): any {
        localStorage.setItem(name, data);
        this.cookie.setCookie(name, data, day, '/', this.domain); // '.'+
    }
    deleteUserCookie(){
        return this.cookie.deleteCookie('user_profile', this.domain);
    }

    deleteCookie(): any {
        return this.cookie.deleteCookie('aup_f2f_token', this.domain); // '.'+
    }

    generateToken() {
        //let token = this.getCookie('aup_f2f_token');
        let token = localStorage.getItem('aup_f2f_token');

        // console.log('generateToken', token);
        if(!token || !token.length || token == 'undefined'){

            let tz = Jwt.getTimezone();
            let token = Jwt.setAlgo('HS256')
                .setClaim('token', 'exchange')
                .setClaim('tzoffset', tz.gmt)
                .setClaim('tzname', tz.name)
                .setIssuedAt()
                .setSecret(this.apikey)
                .getToken();
            return token;
        } else {
            return token;
        }
    }

    getHttpOptions() {
        //let deviceid = this.getCookie('aup_dplph_deviceid');
        //this.getfirebaseToken()
        let deviceid = localStorage.getItem('aup_dplph_deviceid');
        let devicetoken = localStorage.getItem('devicetoken');

        if(deviceid){
            this.setDeviceId(deviceid);
        }

        if(devicetoken){
            this.setDeviceToken(devicetoken);
        }

        let httpOptions = {
            headers: new HttpHeaders(
                {
                    /* 'Content-Type': 'application/form-data', */
                    'Authorization': 'Bearer ' + this.generateToken(),
                    'Devicetoken': this.devicetoken,
                    'Deviceid': this.deviceid,
                    'Platform': 'Web',
                }
            )
        };
        // //console.log('httpOptions', httpOptions);
        return httpOptions;
    }

    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    exchangeToken(){
        new Promise((resolve, reject) => {
       
            // let token = this.getCookie('aup_f2f_token');

            new Promise((resolve, reject) => {

                resolve(this.getfirebaseToken())
                
            }).then(() => {

                let token = localStorage.getItem('aup_f2f_token');
                let deviceid = localStorage.getItem('aup_dplph_deviceid');
                if(this.devicetoken){
                    if(!token || !token.length || token == 'undefined'){
                        if(!deviceid || !deviceid.length || deviceid == 'undefined'){
                            this.setDeviceId(this.uuidv4());  
                            localStorage.setItem('aup_dplph_deviceid', this.deviceid);                 
                        }
                        let url = this.getUrl(Urls.get_token);
                        this.http.get(url, this.getHttpOptions()).subscribe(
                            result => {
                                let r: any = result;
                                this.setToken(r.data.token, 60);
        
                                // console.log('r.data.token', r.data.token);
                                // this.setCookie('aup_dplph_deviceid', this.deviceid,60);
                                // this.setCookie('FirebaseId', res);
        
                                //console.log('token exchange result', r);
                                resolve(r.data.token);
                            },
                            error => {
                                console.log('result', error);
                            }
                        );
                    }else{
                        resolve(token);
                    }
                }else{
                    setTimeout(() => {
                        this.exchangeToken()              
                    }, 1000);
                    //console.log('there is no device token');
                }
            })
        }) 

        return false
    }

  
    
    // exchangeToken() {
    //     let token = this.getCookie('token');
    //     if(!token.length || token == 'undefined'){
    //         let httpOptions = this.getHttpOptions();
    //         let url = this.getUrl(Urls.get_token) + '?device_token=' + this.devicetoken;
    //         return this.http.get<any>(url, httpOptions)
    //             .subscribe(data => {this.setToken(data.data.token)});
    //     }
    // }
    
    setDeviceId(str){
        this.deviceid = str;
    }

    getPlatform(){
        return 'web';
    }

    public payload: any;
    isLogedIn() {
            // let token = localStorage.getItem('aup_f2f_token');
            // // console.log('isLogedIn token', token);
            // if(token && token != 'undefined'){
            //     this.payload = Jwt.getPayload(token);
            //     if (typeof this.payload.jti === 'undefined') {
            //         return false;
            //     } else {
            //         return true;
            //     }
            // } else {
            //     return false;
            // }
              return new Promise(resolve => {
                  //let token = this.getCookie('token');
                  let token = localStorage.getItem('aup_f2f_token');
                  // if(token && token != 'undefined'){
                  if(token){
                      this.payload = Jwt.getPayload(token);
                      if(typeof this.payload.jti === 'undefined') {
                          resolve(false);
                      } 
                      else {
                          resolve(true);
                      }
                  } else {
                      resolve(false);
                  }
              });
    }

    numberFormat(valString) {
        if (valString != '0' && valString) {
            valString = new Intl.NumberFormat('en-us', {minimumFractionDigits: 2}).format(valString);
        }
        return valString;
    }

    showLoader() {
        this.document.body.classList.add("loading");
    }

    hideLoader() {
        this.document.body.classList.remove("loading");
    }

    b64toBlob(b64Data, contentType='', sliceSize=512) {

        const byteCharacters = atob(b64Data);
    
        const byteArrays = [];
    
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    
          const slice = byteCharacters.slice(offset, offset + sliceSize);
    
          const byteNumbers = new Array(slice.length);
    
          for (let i = 0; i < slice.length; i++) {
    
            byteNumbers[i] = slice.charCodeAt(i);
    
          }
    
          const byteArray = new Uint8Array(byteNumbers);
    
          byteArrays.push(byteArray);
    
        }
    
        const blob = new Blob(byteArrays, {type: contentType});
    
        return blob;
    }

    getRemainingHours(date){

        let talenthandler_created_at = new Date(date).getTime()/1000;
        let time_now = new Date().getTime()/1000;
        let remaining_seconds = (talenthandler_created_at) - time_now;
        let remaining_hour = Math.floor(remaining_seconds/3600);
        let remaining_days = 0;
        let remaining_minutes = 0;
        let text = '';
    
        if(remaining_hour >= 24){
          remaining_days = Math.floor(remaining_hour/24);
        }
        if(remaining_days > 0){
          remaining_hour = remaining_hour;
          text +=''+remaining_hour + ' hours';
        }else{
          if(remaining_hour > 0){
            text +=''+remaining_hour + ' hours';
          }else{
            remaining_minutes = Math.floor(remaining_seconds/60);
            text +=''+remaining_minutes + ' minutes';
          }
        }
        if(remaining_days <= 0 && remaining_hour<= 0 && remaining_minutes <= 0 && remaining_minutes <=0){
            text = " 0 "
        }
        text += ' time left';
        return text;
    }



    getRemainingHours_minutes_seconds(date){
        let timeRemaining = new Date(date).getTime();
        let time_now = new Date().getTime();
        let remaining_seconds = (timeRemaining - time_now) / 1000;
        let remaining_hour = Math.floor(remaining_seconds/3600);
        let remaining_days = 0;
        let remaining_minutes = 0;
        let text = '';
        if(remaining_hour >= 24){
          remaining_days = Math.floor(remaining_hour/24);
        }
        if(remaining_days >= 0){
          remaining_hour = remaining_hour;
          text +='<span class="fw-600">'+remaining_hour +'</span> hours';
          remaining_minutes = Math.floor((remaining_seconds/60)% 60);
          remaining_seconds = Math.floor((remaining_seconds % 60))
          text += ' <span class="fw-600">'+remaining_minutes + '</span> mins'+' <span class="fw-600">'+remaining_seconds+' '+'</span> secs';
          
        }
        if(remaining_days <= 0 && remaining_hour<= 0 && remaining_minutes <= 0 && remaining_minutes <=0){
            text = " <span class='fw-600 t-black'>0</span> hrs <span class='fw-600 t-black'>0</span> mins <span class='fw-600 t-black'>0</span> secs"
        }
        text += '';
        
        return text;
    }


    repLastChar(cat){
        if(cat){
            var res = cat.charAt(cat.length-1);
            if(res == 's'){
                return cat.slice(0, -1);
            }else{
                return cat;
            }
        }
    }


    toastMessage(data){
        let m = {
        type: "danger",
        msg: ""
        };
        if(data.error == 0){
        m.type = "success";
        m.msg =data.message;
        }
        else{
        m.type = "danger";
        m.msg = data.message;
        }

        // this.messageService.add(m);
    }

    incr_date(date_str){
        var parts = date_str.split("-");
        var dt = new Date(
          parseInt(parts[0], 10),      // year
          parseInt(parts[1], 10) - 1,  // month (starts with 0)
          parseInt(parts[2], 10)       // date
        );
        dt.setDate(dt.getDate() + 1);
        parts[0] = "" + dt.getFullYear();
        parts[1] = "" + (dt.getMonth() + 1);
        if (parts[1].length < 2) {
          parts[1] = "0" + parts[1];
        }
        parts[2] = "" + dt.getDate();
        if (parts[2].length < 2) {
          parts[2] = "0" + parts[2];
        }
        return parts.join("-");
    }

    requireLogIn():any {
        this.isLogedIn().then(payload => {
            // let payload = this.isLogedIn();
            // console.log('requireLogIn payload', payload);
            if(!payload){
                // console.log('ssss');
            this.router.navigate(['/login']);
            }else{
                let user = JSON.parse(localStorage.getItem('user_profile'));
                // console.log('user', user);
                if(user){
                    if(user.last_page == '1'){
                        this.router.navigate(['/onboarding']);
                    }else if(user.last_page == '2'){
                        this.router.navigate(['/onboarding']);
                    }else{
                        this.router.navigate(['/events']);
                    }
                } else{
                    this.router.navigate(['/login']);
                }
            }
        })
    }

    requireNotLogIn():any {
    this.isLogedIn().then(payload => {
        // let payload = this.isLogedIn();
        // console.log('requireNotLogIn payload', payload);
        if(payload){
          this.router.navigate(['/events']);
        }
    })
    }

    convertType(data, type){
      if(type == 'string'){
        if(typeof(data) == 'object'){
          return JSON.stringify(data);
        }else{
          return data;
        }
      }else if(type == 'object'){
        if(typeof(data) == 'string'){
          return JSON.parse(data);
        }else{
          return data;
        }
      }
    }
  
    /**
     * Returns a function, that, as long as it continues to be invoked, will not
     * be triggered. The function will be called after it stops being called for
     * N milliseconds. If `immediate` is passed, trigger the function on the
     * leading edge, instead of the trailing.
     * @param func 
     * @param wait 
     * @param immediate 
     */
    debounce(func, wait, immediate:any = false) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    };
    trim(delegateTimezone){
        let dt = delegateTimezone.split(':');
        let name = dt[0].trim();
        return name
    }
    sanitizeLink(url){
        return this.sanitizer.bypassSecurityTrustHtml(url);
    }

    delegateStorageSet (data: any){
        return new Promise(resolve => {
          // Convert string to object
          data['pref_countries_ids'] = this.convertType(data['pref_countries_ids'], 'object');
          data['pref_network_ids'] = this.convertType(data['pref_network_ids'], 'object');
          data['pref_sector_ids'] = this.convertType(data['pref_sector_ids'], 'object');
          data['pref_services_ids'] = this.convertType(data['pref_services_ids'], 'object');
          data['pref_software_ids'] = this.convertType(data['pref_software_ids'], 'object');
          data['pref_specialization_ids'] = this.convertType(data['pref_specialization_ids'], 'object');
          localStorage.setItem('user_profile', JSON.stringify(data));
          resolve(true);
        });
    }

    canSetSchedule(event_delegate){
        if(this.clockService){
            let nowDate = this.getnowDate();
            let start_time_stamp = this.dateFormat(event_delegate.request_start_date)+'T'+this.clockService.convertTo24Hrs(event_delegate.request_start_time)+'Z';
            let end_time_stamp = this.dateFormat(event_delegate.request_end_date)+'T'+this.clockService.convertTo24Hrs(event_delegate.request_end_time)+'Z';

            let _nowDate = new Date(nowDate);
            let _tsStart = new Date(start_time_stamp);
            let _tsEnd = new Date(end_time_stamp);

            if(_tsStart.valueOf() <= _nowDate.valueOf() && _tsEnd.valueOf() >= _nowDate.valueOf()){
                event_delegate.canSetSchedule = true;
                return true;
            } else {
                event_delegate.canSetSchedule = false;
                return false;
            }
        } else {
            return false;
        }
    }

    /**
    * checker if the slot is past
    * @param ts timeslot
    * return boolean true or false
    * this function is called on template
    */
    isPassAway(ts: any){
        if(ts.isPassAway === 'yes'){
            return true;
        } else {
            if(this.clockService){
                let nowDate = this.getnowDate();

                let start_time_stamp = ts.start_time_stamp.split(" ");
                start_time_stamp = start_time_stamp[0]+'T'+start_time_stamp[1]+'Z';

                let _nowDate = new Date(nowDate);
                let _tsStart = new Date(start_time_stamp);

                if(_nowDate.valueOf() >= _tsStart.valueOf()){
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    /**
    * return the date converted to timestamp
    */
    getnowDate(format?) {
        let y = this.clockService.today.getFullYear();
        let m = this.clockService.checkTime(this.clockService.today.getMonth() + 1);
        let d = this.clockService.today.getDate();
        let hours = this.clockService.checkTime(this.clockService.today.getHours());
        let min = this.clockService.today.getMinutes();
        let s = this.clockService.today.getSeconds();
        min = this.clockService.checkTime(min);
        s = this.clockService.checkTime(s);
        d = this.clockService.checkTime(d);
        if(format){
        if(format == 'y-m-d'){
            return y + '-' + m + '-' + d;
        }
        }else{
            return y + '-' + m + '-' + d + 'T' + hours + ':' + min + ':' + s + 'Z';
        }
    }

    getnowDatewType(event, type){
        // this.clockService = new ClockService();
        //this.clockService.setDateTime(event).startTime(); 

        let y = this.clockService.today.getFullYear();
        let m = this.clockService.checkTime(this.clockService.today.getMonth() + 1);
        let d = this.clockService.today.getDate();

        let hours;
        if(type == 'resched'){
            hours = this.clockService.checkTime(this.clockService.today.getHours() + 2);
        }else{
            hours = this.clockService.checkTime(this.clockService.today.getHours());
        }

        let min;
        if(type == 'cancel'){
            min = this.clockService.today.getMinutes() + 30;
            if(min > 60){
                hours = this.clockService.checkTime(parseInt(hours) + 1);
                min = min - 60;
            }
        }else{
            min = this.clockService.today.getMinutes();
        }

        let s = this.clockService.today.getSeconds(); 
        min = this.clockService.checkTime(min);
        s = this.clockService.checkTime(s);
        d = this.clockService.checkTime(d);
        return y+'-'+m+'-'+d+' '+hours+':'+min+':'+s;
    }

    dateFormat(date){
      let _date = date.split("/");
      return _date[2]+'-'+_date[0]+'-'+_date[1];
    }
    
    getDateFormat(val){
        let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        let d = val.milisec * 1000;
        if(val.date){
          d = val.date
        }
    
        let _date = new Date(d);
        let month = months[_date.getMonth()];
        let day_name = dayNames[_date.getDay()];
        let date = _date.getDate();
        let year = _date.getFullYear();
    
        return day_name+', '+month+' '+date+', '+year;
    }
    
    getDaysMili(miliisecond){
        let _date = new Date(miliisecond);
        let dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return dayNames[_date.getDay()];
    }

    getDays3(miliisecond){
        let _date = new Date(miliisecond);
        let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return dayNames[_date.getDay()];
    }

    // requestPermission() {
    //     this.angularFireMessaging.requestToken.subscribe(
    //         (token) => {
    //             console.log(token);
    //         },(err) => {
    //             console.error('Unable to get permission to notify.', err);
    //         }
    //     );
    // }

    currentMessage = new BehaviorSubject(null);

    receiveMessage() {
        this.angularFireMessaging.messages.subscribe(
            (payload) => {
                console.log("new message received. ", payload);
                this.currentMessage.next(payload);
            }
        )
    }

    async getDeviceToken(){
        let devicetoken = await localStorage.getItem('devicetoken')
        if (devicetoken) return devicetoken
        let devicetokenFrmService = await this.devicetoken
        if(devicetokenFrmService) return devicetokenFrmService
        return false
    }

    setDeviceToken(token){
        this.devicetoken = token
        localStorage.setItem('devicetoken', token)
        return this
    }

    async getfirebaseToken(){

        let devicetoken =  await this.getDeviceToken();
        if(devicetoken) return true

        this.angularFireMessaging.requestPermission
          .pipe(mergeMapTo(this.angularFireMessaging.tokenChanges))
          .subscribe(
            (token) => { 
                console.log('Permission granted! Save to the server!', token);
                this.setDeviceToken(token)        
              
                return true
            },(error) => { 
                console.error(error); 

                return 'Error'
            },  
        );
    }

    async askNotifPermision(){
        Notification.requestPermission()
    }

    removeFirebaseToken(){
        this.angularFireMessaging.getToken
        .pipe(mergeMap(token => this.angularFireMessaging.deleteToken(token)))
            .subscribe(
                (token) => { console.log('Token deleted!'); 
                localStorage.removeItem('devicetoken');
            },
        );
    }

    getBrowserName() {
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

    permisionChecker(){
        if ('Notification' in window && Notification.permission == 'granted') return true
        return false
    }

    storageChecker() : boolean{
        if(localStorage.getItem('devicetoken') 
        && localStorage.getItem('aup_dplph_deviceid') 
        && localStorage.getItem('aup_f2f_token')) 
        return true
        return false
    }
    
    toDataURL(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
            var reader = new FileReader();
            reader.onloadend = function() {
                callback(reader.result);
            }
                reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }
    
    rmSpace(txt){
        return txt.replace(/ /g, '_');
    }
}