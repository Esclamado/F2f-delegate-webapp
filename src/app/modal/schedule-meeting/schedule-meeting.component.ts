import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { RequestsService } from 'src/app/services/http/requests.service';
import { Urls } from 'src/app/lib/urls';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/app/lib/environment';
import { ClockService } from 'src/app/services/clock.service';
import { TimezoneService } from 'src/app/services/timezone.service';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-schedule-meeting',
  templateUrl: './schedule-meeting.component.html',
  styleUrls: ['./schedule-meeting.component.scss']
})
export class ScheduleMeetingComponent implements OnInit {

  subscribeSearch = new Subject<string>();

  user: any;
  event: any;
  event_delegate_id: any;

  enableSelectTimeSlot: boolean = false;
  schedules: any = null;
  meeting_type: any = null;
  available_timeslot: any = [];
  selected_date: any;
  selected_time: any;

  available_delegate_search: any;
  available_delegate: any = null;
  available_delegate_total_count = 0;
  available_delegate_total_page = 0;
  available_delegate_limit = 10;
  available_delegate_page = 1;
  available_delegate_page_array: any = null;
  available_delegate_isLoaded: boolean = false;
  
  selected_delegate: any;

  d1_timezone: string = '';
  d2_timezone: string = '';

  constructor(
    public modal: NgxSmartModalService,
    public request: RequestsService,
    public fb: FormBuilder,
    public env: environment,
    public timezoneService: TimezoneService,
  ) {
    this.subscribeSearch.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(value => {
        this.available_delegate_isLoaded = false;
        this.available_delegate = null;
        this.available_delegate_total_count = 0;
        this.available_delegate_page = 1;
        this.getAvailableDelegates();
    });
  }

  ngOnInit(): void {
    let event_delegate = JSON.parse(localStorage.getItem('event_delegate'));
    
    if(event_delegate){
      console.log(event_delegate);    
      this.env.clockService = new ClockService();      
      this.env.clockService.setDateTime(event_delegate).startTime();   
    }
  }

  initializeForm() {
  }

  onInitianRequest(){
    this.user = JSON.parse(localStorage.getItem('user_profile'));
    this.event = JSON.parse(localStorage.getItem('event'));
    this.event_delegate_id = localStorage.getItem('event_delegate_id');

    if(this.user && this.user.timezone && this.event.type == '2'){
      this.d1_timezone = this.timezoneService.getTimezoneName(this.user.timezone);
    }

    this.enableSelectTimeSlot = false;
    this.available_delegate_isLoaded = false;
    this.available_timeslot = [];
    this.available_delegate_search = '';
    this.available_delegate = null;
    this.available_delegate_total_count = 0;
    this.available_delegate_page = 1;
    this.selected_delegate = null;

    let data = this.modal.getModalData('scheduleMeeting');
    this.meeting_type = data.type;
    this.schedules = data.schedule;

    this.selected_date = data.timeslot.data;
    this.selected_time = data.timeslot.data;

    let sched = [];
    this.schedules.forEach(val => {
      if(val.event_current_date <= val.milisec){
        sched.push(val);
      }
      if(this.selected_date.event_date_milisec == val.milisec){
        this.selected_date['schedules'] = val.schedules;
        this.selected_date['event_current_time'] = val.event_current_time;
      }
    });
    this.schedules = sched;

    this.getAvailableDelegates();
  }

  reset(){
    this.modal.resetModalData('scheduleMeeting');
    this.modal.close('scheduleMeeting');
  }

  enableTimeSlot(value){
    this.enableSelectTimeSlot = value;
    if(value){
      console.log('enableTimeSlot_selected_date', this.selected_date);
      console.log('enableTimeSlot_selected_delegate', this.selected_delegate);
      
      this.selected_date['milisec'] = this.selected_date.event_date_milisec;
      this.selected_delegate['event_delegateid'] = this.selected_delegate.edid;

      if(this.event.type == '2'){
        this.d2_timezone = this.timezoneService.getTimezoneName(this.selected_delegate.timezone);
      }

      this.getTimeslot(this.selected_date);
    }
  }

  searchAvailableDelegate($param){
    this.available_delegate_isLoaded = false;
    this.available_delegate = null;
    this.available_delegate_total_count = 0;
    this.available_delegate_page = 1;
    this.getAvailableDelegates();
  }

  getAvailableDelegates(infiniteScroll?) {
    let url = Urls.api_meetingschedule_availablebytimeslot;
    url += '?id=' + this.selected_time.id;
    url += '&delegate_id=' + this.event_delegate_id;
    url += '&limit=' + this.available_delegate_limit;
    url += '&page=' + this.available_delegate_page;

    if(this.available_delegate_search) {
      url += '&search=' + this.available_delegate_search;
    }
    
    this.request.get(url).then(response => {
     this.available_delegate_isLoaded = true;

      if(response.error == 0){
        this.available_delegate_total_count = response['data']['total_count'];
        this.available_delegate_total_page = response['data']['total_page'];
        this.available_delegate_page_array = response['data']['pages'];

        if (!infiniteScroll || infiniteScroll === false){
          this.available_delegate = []; 
        }

        response['data']['datas'].forEach((data) => {
          this.available_delegate.push(data);
        });

        if(!this.selected_delegate && this.available_delegate){
          this.selected_delegate = this.available_delegate[0];
          if(this.event.type == '2'){
            this.d2_timezone = this.timezoneService.getTimezoneName(this.available_delegate[0].timezone);
          }
        }
        
        console.log('delega_list', this.available_delegate);

      }else{
        this.available_delegate = [];
        this.available_delegate_total_count = 0;
        this.available_delegate_total_page = 0;
      }
    });
  }

  onScroll(e: any){
    if(this.available_delegate_total_page > this.available_delegate_page){
      this.available_delegate_page++;
      this.getAvailableDelegates(true);
    }
  } 

  selectDelegate(delegate){
    console.log('delagate', delegate);
    this.selected_delegate = delegate;
    if(this.event.type == '2'){
      this.d2_timezone = this.timezoneService.getTimezoneName(this.selected_delegate.timezone);
    }
    if(this.selected_date){
      if(this.enableSelectTimeSlot){
        this.selected_time = null;
      }
      this.available_timeslot = [];
      this.getTimeslot(this.selected_date);
    }
  }  
  
  selectDate(date){
    console.log('selected_date: ', date);
    this.selected_date = date;
    this.selected_time = null;
    this.available_timeslot = [];
    this.getTimeslot(date);
  }

  selectTime(time){
    console.log('selected_time: ', time);
    this.selected_time = time;
  }

  getTimeslot(date){
    let url = Urls.mapi_delegate_availabletimeslot;
    url += '?date=' + date.milisec;
    url += '&event_id=' + this.event.id;
    url += '&delegate1=' + this.event_delegate_id;
    url += '&delegate2=' + this.selected_delegate.event_delegateid;

    this.request.get(url).then(data => {
      if(data.error == 0){
        console.log('available_timeslot', this.available_timeslot);
        this.setAvailables(data.data, date);
      }
    });
  }

  /**
  * set all the available slots
  */
  setAvailables(data, selectedDay){
    let event_current_time = selectedDay.event_current_time;
    let event_date = selectedDay.milisec;
    let scheds = selectedDay.schedules;

    data.forEach(as => {
      let availableTSid = as.id;
      scheds.forEach(val => {
        if(val.type == 'timeslot'){
          let ts = val.data;
          if(availableTSid == ts.id){
            if(event_current_time < ts.event_start_time_milisec){
              if(!ts.meeting_schedule){
                this.available_timeslot.push(ts);
              }
            }
          }
        }
      });
    });

    console.log('aa',this.available_timeslot);
  }

  scheduleAMeeting(){
    this.env.loaderText = 'Setting meeting schedule...';
    this.env.spinner.show(this.env.loaderSpinner);

    let formData = {
      event_id: this.event.id,
      time_slot_id: this.selected_time.id, 
      delegate_1: this.event_delegate_id,
      delegate_2: this.selected_delegate.edid,
      setter: 'delegate1',
    };

    if(this.event.meeting_request == '2'){
      formData['request_message'] = '';
    }

    let url;
    if(this.event.type == 1){
      url = Urls.api_meetingschedule_set;
    }else{
      url = Urls.api_meetingschedule_setvirtual;
    }

    this.request.post(url, formData).then(response => {
      this.env.spinner.hide(this.env.loaderSpinner);
      if(response.error === 0){

        //If with approval
        if(this.event.meeting_request == '2'){
          window.location.reload();
          this.env.toastr.success('Meeting request has been successfully sent');
        }else{
          this.env.toastr.success(response.message);
        }
        
        const obj = {
          'action': 'set_meeting_schedule',
          'delegate_id': this.selected_delegate.id,
        };
      
        // this.modal.resetModalData('findDelagatesScheduleMeeting');    
        // if(this.event.meeting_request == '1'){
        //   this.modal.setModalData(obj, 'findDelagatesScheduleMeeting');
        // }
        this.modal.close('scheduleMeeting');
      }else{
        this.env.toastr.error(response.message)
      }
    });
  }
}
