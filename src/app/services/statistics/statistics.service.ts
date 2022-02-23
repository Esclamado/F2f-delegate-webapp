import { Injectable } from '@angular/core';
import { environment } from 'src/app/lib/environment';
import { RequestsService } from '../http/requests.service';
import { Urls } from 'src/app/lib/urls';


@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  comparison_type: any = [
    {
      type: 1,
      name: 'event_details'
    },    
    {
      type: 2,
      name: 'delegates'
    },
    {
      type: 3,
      name: 'my_schedules'
    },
    {
      type: 4,
      name: 'sponsor'
    },
    {
      type: 5,
      name: 'messages'
    },
    {
      type: 6,
      name: 'notifications'
    },

  ]

  constructor(
    private env: environment,
    private request: RequestsService
  ) { }

    /*
  * will save the event feature comparison or statistics
  */
    saveFeatureComparison(type, event_id){
      let temp_type: any = []; 
      this.comparison_type.forEach(element => {
        if(element.type == type ){
          temp_type = element;
        }
      });
      // console.log('formdata: ',temp_type)
      let formData = {
        'event_id': event_id,
        'type': temp_type.name,
        'platform': this.env.getPlatform(),
      };
      // console.log('formdata: ',formData)
      return new Promise(resolve => {
        let url = Urls.api_featurecomparison_save;
        this.request.post(url,formData).then(result => {
          resolve(result);
        },error => {
          resolve(error);
        });
      });
      
    }

}
