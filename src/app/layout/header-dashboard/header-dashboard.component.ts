import { Component, OnInit, AfterViewInit } from '@angular/core';
import { environment } from 'src/app/lib/environment';
import { Location } from '@angular/common'
import { Urls } from 'src/app/lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { NotificationsService } from 'src/app/services/notifications.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { StatisticsService } from 'src/app/services/statistics/statistics.service';
import { element } from 'protractor';
// import { time } from 'node:console';

@Component({
  selector: 'app-header-dashboard',
  templateUrl: './header-dashboard.component.html',
  styleUrls: ['./header-dashboard.component.scss']
})
export class HeaderDashboardComponent implements OnInit, AfterViewInit{

  [x: string]: any;

  event_general:any;
  timezone_trimmed: any;

  
  openedRequestMeetingSent: any;
  openedReceiveMeetting: any;

  event_delegate_id: any;
  schedule:any;

  show_meeting_request: boolean = false;
  showReceiveMeeting: boolean = false;
  showSentMeeting: boolean = false;

  receive_request: any;
  receive_request_isLoaded: boolean = false;
  receive_request_total_count = 0;

  sent_request: any;
  sent_request_isLoaded: boolean = false;
  sent_request_total_count = 0;

  meeting_details: any;
  meeting_details_total_count: any = 0;
  meeting_details_isloaded: boolean = false;

  userData = JSON.parse(localStorage.getItem('user_profile'))

  temp_convos:any = [];

  constructor(
    public env: environment,
    public location: Location,
    public request: RequestsService,
    public router: Router,
    public notificationService: NotificationsService,
    public modal: NgxSmartModalService,
    public toast: ToastrService,
    public stats: StatisticsService
  ) {
    this.event = JSON.parse(localStorage.getItem('event'));
    console.log('qwqwqwqwq', this.event);
   }

  ngOnInit(): void {

    this.getMySchedule();
    if(this.event){
      this.timezone_trimmed = this.env.trim(this.event.time_zone)
      this.event_general = this.event;
    } 
    this.event_delegate_id = localStorage.getItem('event_delegate_id');
    // this.getMeetingReceive();
    // this.getMeetingSent();
    this.notificationService.getNotifications(this.event);
    
    this.token = localStorage.getItem('aup_f2f_token');
  }

  ngAfterViewInit() {
    this.modal.getModal('scheduleMeeting').onAnyCloseEvent.subscribe(data => {
      let res = this.modal.getModalData('scheduleMeeting');
      if(res){
        this.getMySchedule();
        this.notificationService.resetNotif();
        this.notificationService.getNotifications(this.event);
        // this.notificationService.toggleBanner()
      }
    });

    this.modal.getModal('cancelMeetingModal').onAnyCloseEvent.subscribe(data => {
      let res = this.modal.getModalData('cancelMeetingModal');
      if(res){
        this.getMySchedule();
        this.notificationService.resetNotif();
        this.notificationService.getNotifications(this.event);
        // this.notificationService.toggleBanner()
      }
    });

    this.modal.getModal('viewMeeting').onAnyCloseEvent.subscribe(data => {
      let res = this.modal.getModalData('viewMeeting');
      if(res){
        //this.getMySchedule()
        this.notificationService.resetNotif();
        this.notificationService.getNotifications(this.event);
        // this.notificationService.toggleBanner()
      }
    });
    // this.env.chatSocket.removeListener('get convos');
    if(this.router.url != '/messaging'){

    this.getConvos()
      this.env.chatSocket.on('get convos', data => {
        let _convos = this.env.chatSocket.setConverseWith(data.data)
        if(!this.env.chatSocket.convos){
          this.env.chatSocket.convos = _convos;
        } else {
            /* todo infinite scroll */
            this.env.chatSocket.convos.current_page = _convos.current_page;
            this.env.chatSocket.convos.next_page = _convos.next_page;
            this.env.chatSocket.convos.previous_page = _convos.previous_page;
  
            _convos.datas.forEach(val => {
             this.temp_convos.push(val);

            console.log('temp convos', this.env.chatSocket)
            });
        }
      });
    }
    setTimeout(() => {
console.log('temp convos', this.temp_convos)
      this.messageBadge()
    }, 1000);
  }

  getConvos(){    
    let page = 1
    if(this.env.devicetoken){
        this.env.chatSocket.setVar('baseUrl', this.env.getUrl(''))
        .setVar('apiToken', this.token)
        .setVar('currentLogedInUserId', this.env.payload.jti)
        .setVar('devicetoken', this.env.devicetoken)
        .setVar('deviceid', this.env.deviceid)
        .setVar('event_id', this.event.id);
        
        // .setVar('apiToken', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJwYW5lbC5mYWNlMmZhY2VzY2hlZHVsZXIuY29tIiwiYXVkIjoicmhhbmxleXNpY29AZ21haWwuY29tIiwianRpIjoiNSIsImlhdCI6MTYyMjU5NzMzNiwic3ViIjoibG9nZWQgdXNlciB0b2tlbiJ9.a77f6198d8d53b28f53db6823b4a53391cadc0f22d1901516c7d061cb40decc2")
        // .setVar('currentLogedInUserId', this.env.payload.jti)
        // .setVar('devicetoken', "cVxqju9gbkI:APA91bG366jmIjlrFlspNy4IeTSKirpOdIicShu_BpX-rQkXSWAf_nFZ8LCB_YRYfTIcbKbUlcku1D2zy2gpqr5LFWDVhkbAv9OusTADH4VfmeUhRwSkfMVzeY-L2HX5QSU3oEDXoeCG")
        // .setVar('deviceid', "a81aff7f682351187khheq_rhanni")
        // .setVar('event_id', this.event.id);

        if(page == 1){
          this.env.chatSocket.setVar('convos', null);
        }
        this.env.chatSocket.getConvos(page);

        console.log('ailo1: ', this.token)
        console.log('ailo2: ', this.env.payload.jti)
        console.log('ailo3: ', this.env.devicetoken)
        console.log('ailo4: ', this.env.deviceid)
        console.log('ailo5: ', this.event.id)
        console.log('ailo6: ', this.env.chatSocket)
      }else{
        // this.env.setDeviceToken();
      }

  }
  
  back(){
    localStorage.removeItem('event');
    localStorage.removeItem('event_delegate');
    localStorage.removeItem('event_delegate_id');
    // Delegate List Search and Filter
    localStorage.removeItem('filter_search');
    localStorage.removeItem('filter_location');
    localStorage.removeItem('filter_services');
    localStorage.removeItem('filter_specialization');

    // this.location.back();
    if(this.event){
      if(this.event.past_day){
        this.router.navigate(['/past-events']);
      }else{
        this.router.navigate(['/events']);
      }
    }else{
      this.router.navigate(['/events']);
    }
  }

  viewSchedule(){
    if(this.event.type ==1){
      this.router.navigate(['/my-schedule'])
    }else{
      this.router.navigate(['/my-schedule-virtual'])
    }
  }

  showMeetingRequest(){
    this.getMeetingReceive();
    this.getMeetingSent();
    this.show_meeting_request = !this.show_meeting_request;
  }

  showMeetingRequestNotifications(){
    this.show_meeting_request_notification = !this.show_meeting_request_notification;
  }

  showReceiveMeetingRequest(timeslot, id){
    this.openedReceiveMeetting = id;
    this.showReceiveMeeting = true;
    this.getMeetingDetails(timeslot, 'received', );
  }

  closeReceiveMeetingRequest(){
    this.openedReceiveMeetting = "id";
    this.showReceiveMeeting = false;
    this.meeting_details = null;
    this.meeting_details_total_count = 0;
    this.meeting_details_isloaded = true;
  }

  showRequestMeetingSent(timeslot, id){
    this.openedRequestMeetingSent = id;
    this.showReceiveMeeting = true;
    this.showSentMeeting = true;
    this.getMeetingDetails(timeslot, 'sent', );
  }

  closeShowRequestMeetingSent(){
    this.openedRequestMeetingSent = "id";
    this.showSentMeeting = false;
    this.meeting_details = null;
    this.meeting_details_total_count = 0;
    this.meeting_details_isloaded = true;
  }

  getMeetingReceive(){
    this.receive_request_total_count = 0;
    let url = Urls.mapi_delegate_meetingrequest;
    url += '?event_id=' + this.event.id;
    url += '&type=received';
    if(this.event && this.event.type == '2'){
      url += '&is_virtual=true';
    }
    setTimeout(() => {
      this.request.get(url).then(response => {
        this.receive_request_isLoaded = true;
        if(response.error == 0){
  
          this.receive_request = response.data;
          this.receive_request.forEach((req, index, array) => {
            // this.meeting_details_isloaded = false
            if(req.timeslots.length > 0){
              req.timeslots.forEach(tms => {
                if(tms.meeting_schedule_count > 0){
                  this.receive_request_total_count++;
                }
  
                // add meeting details
                // let meeting_per_timeslot
                // let meeting_per_timeslot_total_count
                // let url = Urls.mapi_delegate_meetingrequestlist;
                // if(tms.id){
                //   url += '?timeslot_id=' + tms.id;
                // }
                // url += '&type=' + 'received';
                // if(tms.event_delegate_id){
                //   url += '&edid=' + tms.event_delegate_id;
                // }
                // url += '&limit=100';
                // url += '&page=1';
  
                // this.request.get(url).then(response =>{
                //   if(response.error == 0){
                //     tms['meetings_per_timeslot'] =  response['data']['datas'];
                //     tms['meeting_per_timeslot_total_count'] = response['data']['total_count'];
                //   }
                // })
  
              });
            }
  
            // if(index == array.length - 1){
            //   this.meeting_details_isloaded = false
            // }
            
  
          });
  
          //console.log('recieved request that im looking for', this.receive_request);
  
          // this.receive_request = response.data.map(response_data => {
  
          // })
          
          
        }
      });
    }, 0);

    // setTimeout(() => {
    //   this.meeting_details_isloaded = true
    // }, 10000)

  }

  getMeetingSent(){
    this.sent_request_total_count = 0;
    let url = Urls.mapi_delegate_meetingrequest;
    url += '?event_id=' + this.event.id;
    url += '&type=sent';
    if(this.event && this.event.type == '2'){
      url += '&is_virtual=true';
    }
    this.request.get(url).then(response =>{
      this.sent_request_isLoaded = true;
      if(response.error == 0){
        this.sent_request = response.data;
        this.sent_request.forEach(sen => {
          if(sen.timeslots.length > 0){
            sen.timeslots.forEach(tms => {
              if(tms.meeting_schedule_count > 0){
                this.sent_request_total_count++;
              }

              // let url = Urls.mapi_delegate_meetingrequestlist;
              //   if(tms.id){
              //     url += '?timeslot_id=' + tms.id;
              //   }
              //   url += '&type=' + 'sent';
              //   if(tms.event_delegate_id){
              //     url += '&edid=' + tms.event_delegate_id;
              //   }
              //   url += '&limit=100';
              //   url += '&page=1';
  
              //   this.request.get(url).then(response =>{
              //     if(response.error == 0){
              //       tms['meetings_per_timeslot'] =  response['data']['datas'];
              //       tms['meeting_per_timeslot_total_count'] = response['data']['total_count'];
              //     }
              //   })
            });
          }
        });
      }
    });
  }

  async getMeetingDetails(timeslot, type?){
    this.meeting_details_isloaded = false;

    let url = Urls.mapi_delegate_meetingrequestlist;
    if(timeslot.id){
      url += '?timeslot_id=' + timeslot.id;
    }
    if(type){
      url += '&type=' + type;
    }
    if(timeslot.event_delegate_id){
      url += '&edid=' + timeslot.event_delegate_id;
    }
    url += '&limit=100';
    url += '&page=1';

    await this.request.get(url).then(response =>{
      if(response.error == 0){
        // console.log('ck-no error');
        this.meeting_details = response['data']['datas'];
        this.meeting_details_total_count = response['data']['total_count'];
      }
    })

    this.meeting_details_isloaded = true;

    // console.log('ck-loaded', this.meeting_details_isloaded);
  }

  /**
  * open a confirmation modal
  */
  async actionRequest(action, meeting, timeslot?) {

    let formData = new FormData();
    let msg;
    let btn_save;
    let title;

    formData.append('meeting_schedule_id', meeting.id);
    formData.append('edid', meeting.ed_id);
    formData.append('action', action);

    if(action == 'accept') {
      msg = 'Are you sure you want to accept <span class="fw-500 capitalize">' + meeting.del_fullname + '</span> meeting request?';
      btn_save = 'Accept request';
      title = 'Accept Meeting Request';
      this.env.loaderText = 'Accepting meeting request ...';

    }else if(action == 'decline') {
      title = 'Decline meeting request';
      msg = 'Are you sure you want to decline <span class="fw-500 capitalize">' + meeting.del_fullname+ '</span> meeting request?';
      btn_save = 'Decline request';
      this.env.loaderText = 'Declining meeting request ...';

    }else if(action == 'cancel') {
      title = 'Cancel meeting request';
      msg = 'Are you sure you want to cancel this meeting request?';
      btn_save = 'Cancel request';
      this.env.loaderText = 'Cancelling meeting request ...';
    }
    this.env.spinner.show(this.env.loaderSpinner);

    this.request.post(Urls.mapi_delegate_meetingrequestaction, formData).then(response=>{
      this.env.spinner.hide(this.env.loaderSpinner);
      if(response.error == 0){

        if(action == 'accept') {
          this.toast.success('Successfully accepted meeting request');
          this.showMeetingRequest();
          this.show_meeting_request_notification = false;
        }else if(action == 'decline') {
          this.showMeetingRequest();
          this.show_meeting_request_notification = false;

          this.toast.success('Successfully declined meeting request');
        }else if(action == 'cancel') {
          this.showMeetingRequest();
          this.show_meeting_request_notification = false;

          this.toast.success('Successfully cancelled the meeting request');
        }
        timeslot.meeting_schedule_count--;
        let indexOf = this.meeting_details.findIndex(x => x.id == meeting.id);
        this.meeting_details.splice(indexOf, 1);
        this.meeting_details_total_count--;
        if(!this.meeting_details.length){
          this.meeting_details = null;
        }
      }
    });

    this.showSentMeeting = false
    this.showReceiveMeeting = false

  }

  IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  temp_time_slot

  async getMeetingDetailsFromNotifications(data){

    await this.getMeetingReceive();

    this.temp_time_slot = await data.time_slot.id

    // this.meeting_details_isloaded = false;

    let url = Urls.mapi_delegate_meetingrequestlist;
    if(data.time_slot.id){
      url += '?timeslot_id=' + data.time_slot.id;
    }
    url += '&type=' + 'received';

    let event_delegate_id = localStorage.getItem('event_delegate_id')

    if(event_delegate_id){
      url += '&edid=' + event_delegate_id;
    }
    url += '&limit=100';
    url += '&page=1';

    await this.request.get(url).then(response =>{

      console.log('response ck', response);

      if(response.error == 0){
        this.meeting_details = response['data']['datas'];
        this.meeting_details_total_count = response['data']['total_count'];
      }
    })
    
    //console.log('meeting details ck', this.meeting_details);
    
    this.meeting_details_isloaded = await true;


    this.showReceiveMeeting = await true

    this.showMeetingRequestNotifications();

  }

  redirectPage(data){

    // changes the status from unread to  read
    if(data.status == '2'){
      
      let formData = {
        id: data.id
      };
      
      this.notificationService.changeStatusNotification(formData).then(() => {
        data.status = '1';
        // this.notificationService.toggleBanner()

        // this.env.storage.get('notification_count').then((count) => {
        //   if(count > 0){
        //     this.events.publish('notification_count', count--, Date.now());
        //   }
        });
    }
    
    // if meeting request is recieved
    if((data.data.data_type == 'set_meeting_request' || data.data.data_type == 'reschedule_meeting_request') && (data.meeting_schedule && data.meeting_schedule.status == '2')){
      //this.showRequestListModal(data);

      //this.showMeetingRequestNotifications()

      this.getMeetingDetailsFromNotifications(data)
        
    }

    // if meeting schedule is set
    else if(data.meeting_schedule){
      if(data.meeting_schedule.status == '1'){
        if(data.data.data_type == 'delegate_pending_noshow') {
          //this.router.navigate([data.url]); //old from mobile
          this.router.navigate(['/no-show-delegates']);          
        } 
        else if(data.data.data_type == 'approve_noshow') {
          //this.router.navigate(['/noshow-delegates/' + data.data.event_id]);
          this.router.navigate(['/no-show-delegates']);
        }
        else {            
          this.requestMeetingDetails(data);            
        }
      }else if(data.meeting_schedule.status == '6'){
        this.toast.error('The meeting schedule is reschedule to other timeslot.');
      }else if(data.meeting_schedule.status == '8'){
        this.toast.error('The meeting schedule is occupied by the other delegate');
      } else {
        this.requestMeetingDetails(data); 
      }
    
    }else if(data.type == 'time_slot'){
      this.requestMeetingDetails(data); 
    }else if(data.type == 'meeting_notes'){
      this.router.navigate(['notes']);
    }else if(data.type == 'cancel_meeting'){

    //   let thisData = {
    //     id: data.meeting_schedule.time_slot_id,
    //     date: data.time_slot.milli_date
    //   };
    //   //this.env.storage.set('from_notification', true);
    //   this.env.storage.set('notif_date_milli', data.time_slot.milli_date);
    //   this.router.navigate(['/tabs/event/'+data.data.event_id]);
    //   setTimeout(() => {
    //     this.events.publish('tabs-scheduled-timeslot',thisData, Date.now());
    //   }, 500);

    }else{
    //   //this.env.toast(data.data.data_type);
    }
  }

  requestMeetingDetails(data){
    let modalObj = {
      data
    }

    let start_time = data.time_slot.start_time;
    let end_time = data.time_slot.end_time_orig;
    let date = data.time_slot.date;
    let total_time_countdown = data.time_slot.total_time_countdown;
    let time_countdown = data.time_slot.time_countdown;

    data['start_time'] = start_time;
    data['end_time_orig'] = end_time;
    data['date'] = date;
    data['total_time_countdown'] = total_time_countdown;
    data['time_countdown'] = time_countdown;
    data['event_id'] = data.data.event_id;

    let no_show_string = localStorage.getItem('no_show_data')    
    //console.log('meeting from local storage', this.IsJsonString(no_show_string));

    if(this.IsJsonString(no_show_string) && no_show_string != null){
      let no_show_data = JSON.parse(localStorage.getItem('no_show_data'))

      //console.log('meeting from local storage', no_show_data);
      
      if(data['meeting_schedule']['id'] == no_show_data.meeting_schedule_id){
        data['no_show'] = no_show_data
      }
    }

    let timeslot = [];
    this.schedule.forEach(element => {
      timeslot.push(element);
    });
    modalObj['type'] = this.event_general.type == 1 ? 'physical' : 'virtual';

    let date_time: any;
    let i = 0;
    
    timeslot.forEach(val => {
      if(val.date == date){
        date_time = timeslot[i];
      }
      i++;
    });

    //console.log('modal object', modalObj);
    //console.log('date_time', date_time)
    this.viewMeetingDetail(modalObj, timeslot, date_time);

  }

  viewMeetingDetail(data, timeslot, date_time){

    //old
    // let obj = {
    //   data: data,
    //   timeslot: timeslot,
    //   default_date: date_time,
    //   from_notififcations: true // if accessed through notification module
    // }

    //new
    let obj = {
      timeslot: data,
      schedule: this.schedules
    }

    console.log('modal object', obj);

    if(data.data.meeting_schedule){
      this.modal.setModalData(obj, 'viewMeeting')
      this.modal.open('viewMeeting')
    }
  }

  getMySchedule(){
    if(this.initial_load){
      this.isLoading = true;
    }

    let url = '';
    if(this.event.type == '1'){
      url += Urls.mapi_event_schedule;
      url += '?event_id=' + this.event.id;
    }else{
      url +=  Urls.mapi_event_schedulevirtual;
      url += '?event_id=' + this.event.id;

      if(this.userData && this.userData.timezone){
        url += '&delegate_timezone=' + this.env.trim(this.userData.timezone);
      }       

      console.log('event', this.event + '&&' + this.event.timezone); 
      if(this.event && this.event.time_zone){
        url += '&event_timezone=' + this.env.trim(this.event.time_zone);
      }        
    }

    console.log('url', url );
    
    this.request.get(url).then(data=>{
      if(data.error == 0){
        this.schedule = data.data;
        this.edid = data.event_delegate_id;
        localStorage.setItem('event_delegate_id', data.event_delegate_id);
      }
    }).finally(()=>{
      this.initial_load = false;
      this.isLoading = false;
    })
  }

  onScroll(event: any){
  
    let scroll_height = event.target.scrollHeight
    let scroll_threshold= event.target.scrollTop + event.target.clientHeight

    let test =  scroll_height == scroll_threshold ? true : false

    //console.log(scroll_height + '/' + scroll_threshold + '.' + test + '&&' +  !this.notificationService.last_page_reached) //tester

    if (scroll_height == scroll_threshold && !this.notificationService.last_page_reached){
      this.notificationService.getNotifications(this.event)
    }
  }

  async resetNotif(){
      if(await this.toggleNotif()){
        this.notificationService.resetNotif().getNotifications(this.event)
      }
  }
  
  togglePushNotif(event){
    //alert(this.userData.push_notif_enabled == 'yes'? true : false);

    let data = {
      delegate_id: this.userData.id,
      push_notif_enabled: event.checked ? 'yes' : 'no'
    }
    
    this.request.post(Urls.api_push_notif_toggle, data).then(response => {
      //console.log(response)
      this.userData.push_notif_enabled = event.checked ? 'yes' : 'no'
      localStorage.setItem('user_profile', JSON.stringify(this.userData))
      this.user = this.userData
    })

  }
  saveStatistics(type){
    this.stats.saveFeatureComparison(type, this.event.id).then(data=>{
      console.log('feature comparison: ', data)
    })
  }

  notifToggle: boolean = false
  
  async toggleNotif(){
    this.notifToggle = await !this.notifToggle
    return this.notifToggle
  }
  
  messageBadge(){
    if(this.env.chatSocket.convos){
      let badge = this.env.chatSocket.convos.datas.find(element => element.unread == true && element.event_id == this.event.id )
      if(badge){
        //console.log('ailo: ', badge)
        return true
      }else{
        return false
      }
    }


  
    }


}
