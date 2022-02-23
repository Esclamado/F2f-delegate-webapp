import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { RequestsService } from '../http/requests.service';
import { environment } from 'src/app/lib/environment';
import { Urls } from 'src/app/lib/urls';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private request: RequestsService,
    private env: environment
  ) { 

  }

  getLocalStorage(){
    let user = JSON.parse(localStorage.getItem('user_profile'));
    if(user){
      return user
    }else{
      return false
    }
  }
  
}
