import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { RequestsService } from './http/requests.service';
import { Urls } from 'src/app/lib/urls'

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  notifs: any = []; // the array of notifications
  notifFull: any; // full response data
  page: number = 1; // current page
  total_pages: number = 1; // total pages
  last_page_reached: boolean = false; // last page checker
  notification_active_banner = false;

  notifLoader: boolean = false;

  event: any;

  constructor(
    public request: RequestsService,
  ) {

      setInterval( () => {this.getunread()}, 1000)

  }

  async getunread(){
    this.event = await JSON.parse(localStorage.getItem('event'));
    let data = {event_id: this.event.id}
    this.request.post(Urls.api_notification_getunreadcout, data).then( response => {
      //console.log('unread count response', response)
      if(response.count == 0){
        this.notification_active_banner = false
      }else{
        this.notification_active_banner = true
      }
    })

  }


  //resets the notification values
  resetNotif(){

    this.notifLoader = true;

    this.notifs = []
    this.page = 1
    this.total_pages = 1

    return this
  }




  //feth all the notification data from the databse
  getNotifications(type) : void {

    //console.log('notif', this.notifs.length < 1 || this.notifs == undefined);

    //console.log(this.page + '<=' + this.total_pages) //condition tester

    //if the last page is not reached, prepare data and send a request
    if(this.page <= this.total_pages){
      
      //prepares the form data

      let formData = {
        event_id: type.id,
        page: this.page,
      };

      //execute the  request
      this.request.post(Urls.api_get_notifs, formData).then(response => {
  
        //if the request was a success
        if(response.data){
   
          this.notifFull = response // saves the full response to a variable
          this.total_pages = response.data.total_page // updates the total page based on the database
          
          console.log('notification response', response) //response checker
          
          //adds the data to the array of notifications

          response.data.datas.forEach(data => {        
            this.notifs.push(data)
          });
          

          this.last_page_reached = this.total_pages == this.page ? true : false //updates the value of the last page
          this.page++ //updates the current page variable
          this.notifLoader = false

        }  
       
      });
    }   

  }

  //changes the status of a notification from unread to read
  changeStatusNotification(formData: any){
    return this.request.post(Urls.api_notification_changestatus, formData); //request
  }
}
