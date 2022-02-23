import { Injectable } from '@angular/core';
import { RequestsService } from '../http/requests.service';

import { Urls } from 'src/app/lib/urls';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  event: any;

  constructor(
    private request: RequestsService
  ) { 
    this.event = JSON.parse(localStorage.getItem('event'));
  }

      getDelegateProfile(id){
        return new Promise(resolve => {
            let url = Urls.api_delegates_get;
            url += '?by=id';
            url += '&isApp=true';
            url += '&event_id=' + this.event.event_id;
            url += '&delegate=' + id;

            console.log('obj: ', this.event.event_id)
            this.request.get(url).then(result => {
              resolve(result);
            },error => {
              resolve(error);
            });
          }); 
    }


}
