import { Injectable } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { environment } from 'src/app/lib/environment';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    public localSt: LocalStorageService,
    public sessionSt: SessionStorageService,
    private env: environment,
  ) { }
  storageSet(key, value, session = false) {
    let newKey = this.env.subdomain + key;
    if (session) {
      this.sessionSt.store(newKey, value);
    } else {
      this.localSt.store(newKey, value);
    }
  }

  storageGet(key, session = false) {
    let newKey = this.env.subdomain + key;
    var data;
    if (session) {
      data = this.sessionSt.retrieve(newKey);
    } else {
      data = this.localSt.retrieve(newKey);
    }
    return data;
  }
  storageClear() {
    // this.localSt.clear();
    // this.sessionSt.clear();
    // this.env.deleteCookie();

    this.localSt.clear('aup_dplph');
    this.sessionSt.clear('aup_dplph');

    this.localSt.clear('aup_f2f_token');
    this.sessionSt.clear('aup_f2f_token');
    this.env.deleteCookie();

  }
  clearMessageDelegate(){
    localStorage.removeItem('delegate_message')
  }

  checkStoredData(key) {

    let data = this.sessionSt.retrieve(key)

    let stored = data ? data : false;

    return stored;

  }

  /**
   * get data from storage using the given name
   * @param name  
   */
  get(name) {
    return new Promise(resolve => {
      let data: any = this.localSt.retrieve(name);
      if (!data) {
        data = this.localSt.retrieve(name);
      }
      if (data) {
        resolve(data);
      } else {
        resolve(null);
      }
    });
  }

  updateUserProfile(data){
    this.storageSet('aup_dplph',data);
  }
}
