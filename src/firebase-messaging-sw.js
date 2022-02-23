importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.5/firebase-messaging.js');
firebase.initializeApp({
    apiKey: "AIzaSyD5n9lzwWW3g_cjwK2hf6CkZm-ZGLVzuKE",
    authDomain: "face2face-d3e7b.firebaseapp.com",
    databaseURL: "https://face2face-d3e7b.firebaseio.com",
    projectId: "face2face-d3e7b",
    storageBucket: "face2face-d3e7b.appspot.com",
    messagingSenderId: "803859933995",
    appId: "1:803859933995:web:7405e2bc85327303f7f36e",
    measurementId: "G-FY88SESM8W"
});
const messaging = firebase.messaging();


self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    //event.waitUntil(self.clients.openWindow(event.notification.data.url));
    console.log('notification clicked');
    // console.log('ck push data',event)
      
    // // if meeting request is recieved
    // if((data.data.data_type == 'set_meeting_request' || data.data.data_type == 'reschedule_meeting_request') && (data.meeting_schedule && data.meeting_schedule.status == '2')){

    // this.getMeetingDetailsFromNotifications(data)
        
    // }

    // // if meeting schedule is set
    // else if(data.meeting_schedule){
    //     if(data.meeting_schedule.status == '1'){
    //         if(data.data.data_type == 'delegate_pending_noshow') {
    //             //this.router.navigate([data.url]); //old from mobile
    //             this.router.navigate(['/no-show-delegates']);          
    //         } 
    //         else if(data.data.data_type == 'approve_noshow') {
    //             //this.router.navigate(['/noshow-delegates/' + data.data.event_id]);
    //             this.router.navigate(['/no-show-delegates']);
    //         }
    //         else {            
    //             this.requestMeetingDetails(data);            
    //         }
    //     }else if(data.meeting_schedule.status == '6'){
    //         this.toast.error('The meeting schedule is reschedule to other timeslot.');
    //     }else if(data.meeting_schedule.status == '8'){
    //         this.toast.error('The meeting schedule is occupied by the other delegate');
    //     } else {
    //         this.requestMeetingDetails(data); 
    //     }
      
    // }else if(data.type == 'time_slot'){
    // this.requestMeetingDetails(data); 
    // }else if(data.type == 'meeting_notes'){
    // this.router.navigate(['notes']);
    // }else if(data.type == 'cancel_meeting'){
    // }else{
    // }
});



// messaging.setBackgroundMessageHandler(function(payload) {
//     console.log('[firebase-messaging-sw.js] Received background message ', payload);
//     // Customize notification here
//     const notificationTitle = 'Background Message Title';
//     const notificationOptions = {
//       body: 'Background Message body.',
//       icon: 'https://ibb.co/8czrSnz'
//     };
  
//     return self.registration.showNotification(notificationTitle,
//       notificationOptions);
// });