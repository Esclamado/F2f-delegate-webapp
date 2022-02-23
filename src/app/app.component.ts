import { Component, ViewChild } from '@angular/core';
import { TailwindService } from './services/tailwind/tailwind.service';
import { environment } from './lib/environment';
import { AngularFireMessaging } from '@angular/fire/messaging';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'face2face-web-app';

  constructor(
    private tailwind: TailwindService,
    private env: environment,
    private angularFireMessaging: AngularFireMessaging
  ){

    this.angularFireMessaging.messages.subscribe(
      (payload: any) => {
          console.log("new message received. ", payload);
          
          //this.currentMessage.next(payload);
          //this.resetNotif().getNotifications(this.event); //for badges if ever

          const NotificationOptions = {
            body: payload.notification.body,
            data: payload.data,
            icon: payload.notification.icon
          }
          navigator.serviceWorker.getRegistration('/firebase-cloud-messaging-push-scope').then(registration => {
                  registration.showNotification(payload.notification.title, NotificationOptions);
          });
          // this.currentMessage.next(payload);
        })

        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/firebase-messaging-sw.js', {scope: 'firebase-cloud-messaging-push-scope'});
        }

  }
  
  ngOnInit() {
    //this.env.exchangeToken();
    //this.env.setDeviceToken();
  }


 darkMode: any = false; 
  toggleChanged(){
    this.tailwind.toggleDarkMode();
    this.darkMode = this.tailwind.darkMode;
  }
}
