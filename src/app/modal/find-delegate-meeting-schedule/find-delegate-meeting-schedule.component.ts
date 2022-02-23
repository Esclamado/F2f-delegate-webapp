import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Urls } from 'src/app/lib/urls'
import { RequestsService } from 'src/app/services/http/requests.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/lib/environment';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-find-delegate-meeting-schedule',
  templateUrl: './find-delegate-meeting-schedule.component.html',
  styleUrls: ['./find-delegate-meeting-schedule.component.scss']
})
export class FindDelegateMeetingScheduleComponent implements OnInit {

  subscribeSearch = new Subject<string>();

  user: any;  
  event: any;
  event_delegate: any;

  event_delegate_id: any;
  selected_delegate: any = null;
  event_schedules: any = null;
  schedules: any = null;
  available_timeslot: any = [];
  selected_date: any;
  selected_time: any;
  delegate_profile: any;
  
  delegate_search_key: any = '';
  delegate_list: any = null;
  delegate_list_total_count = 0;
  delegate_list_total_page = 0;
  delegate_list_limit = 500;
  delegate_list_page = 1;
  delegate_list_page_array: any = null;
  delegate_list_isLoaded: boolean = false;
  
  constructor(
    public modal: NgxSmartModalService,
    public request: RequestsService,
    public fb: FormBuilder,
    public toastr: ToastrService,
    public env: environment
  ){    
    this.subscribeSearch.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(value => {
        this.delegate_list_isLoaded = false;
        this.delegate_list = null;
        this.delegate_list_total_count = 0;
        this.delegate_list_page = 1;
        this.getDelegateList();
    });
  }

  ngOnInit(): void {
  }

  onInitianRequest(){

    this.event = JSON.parse(localStorage.getItem('event'));
    this.user = JSON.parse(localStorage.getItem('user_profile'));
    this.event_delegate_id = localStorage.getItem('event_delegate_id');
    this.delegate_profile = JSON.parse(localStorage.getItem('selected_delegate_profile'));

    let data = this.modal.getModalData('findDelagatesScheduleMeeting');
    this.event_delegate_id= data.event_delegate_id; 
    this.event_schedules = data.event_schedules;
    this.selected_delegate = data.delegate;
    
    this.schedules= null;
    this.available_timeslot = [];
    this.selected_date= null;
    this.selected_time= null;
    this.delegate_search_key = '';

    console.log('event_schedules', this.event_schedules);
    let sched = [];
    this.event_schedules.forEach(val => {
      if(val.event_current_date <= val.milisec){
        sched.push(val);
      }
    });
    this.schedules = sched;
  }

  reset(){
    this.event_delegate_id= null;
    this.selected_delegate= null;
    this.event_schedules= null;
    this.schedules= null;
    this.available_timeslot = [];
    this.selected_date= null;
    this.selected_time= null;
    this.modal.resetModalData('findDelagatesScheduleMeeting');    
  }

  closeFindDelegateSchedule(){
    this.modal.close('findDelagatesScheduleMeeting');
    this.reset();
  }

  searchDelegates($param){
    this.delegate_list_isLoaded = false;
    this.delegate_list = null;
    this.delegate_list_total_count = 0;
    this.delegate_list_page = 1;
    this.getDelegateList();
  }

  getDelegateList(infiniteScroll?) {
    let url = Urls.api_delegates_get;
    url += '?event_id=' + this.event.event_id;
    url += '&app_delegate_id=' + this.user.id;
    url += '&limit=' + this.delegate_list_limit;
    url += '&page=' + this.delegate_list_page;
    
    if(this.delegate_search_key) {
      url += '&search=' + this.delegate_search_key;
    }
    
    this.request.get(url).then(response => {
     this.delegate_list_isLoaded = true;

      if(response.error == 0){
        this.delegate_list_total_count = response['data']['total_count'];
        this.delegate_list_total_page = response['data']['total_page'];
        this.delegate_list_page_array = response['data']['pages'];

        if (!infiniteScroll || infiniteScroll === false){
          this.delegate_list = []; 
        }
        
        response['data']['datas'].forEach((data) => {
          if(!data.meeting_schedule){
            this.delegate_list.push(data);
          }else{
            this.delegate_list_total_count--;
          }
        });
        
        console.log('delega_list', this.delegate_list);

      }else{
        this.delegate_list = [];
        this.delegate_list_total_count = 0;
        this.delegate_list_total_page = 0;
      }
    });
  }

  onScroll(e: any){
    if(this.delegate_list_total_page > this.delegate_list_page){
      this.delegate_list_page++;
      this.getDelegateList(true);
    }
  } 

  selectDelegate(delegate){
    this.selected_delegate = delegate;
    if(this.selected_date){
      this.selected_time = null;
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
      delegate_2: this.selected_delegate.event_delegateid ? this.selected_delegate.event_delegateid : this.delegate_profile.event_delegateid,
      setter: 'delegate1',
    };
    console.log('formData: ', formData)
    console.log('formData edid2: ', this.delegate_profile)
    console.log('formData 1: ', this.selected_delegate.event_delegateid)
    console.log('formData 2: ', this.selected_delegate.ed_id)

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
          this.toastr.success('Meeting request has been successfully sent');
        }else{
          this.toastr.success(response.message);
        }
        
        const obj = {
          'action': 'set_meeting_schedule',
          'delegate_id': this.selected_delegate.id,
        };
      
        this.modal.resetModalData('findDelagatesScheduleMeeting');    
        if(this.event.meeting_request == '1'){
          this.modal.setModalData(obj, 'findDelagatesScheduleMeeting');
        }
        this.modal.close('findDelagatesScheduleMeeting');
      }else{
        this.toastr.error(response.message)
      }
    });
  }
}
