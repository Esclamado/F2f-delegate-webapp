import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { environment } from 'src/app/lib/environment';
import { RequestsService } from 'src/app/services/http/requests.service';
import { Urls } from 'src/app/lib/urls';
import { ClockService } from 'src/app/services/clock.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rechedule-modal',
  templateUrl: './rechedule-modal.component.html',
  styleUrls: ['./rechedule-modal.component.scss']
})
export class RecheduleModalComponent implements OnInit {

  user: any;
  event: any;
  event_delegate_id: any;
  event_delegate: any;

  meeting_details: any;
  schedules: any = null;
  available_timeslot: any = [];
  selected_date: any;
  selected_time: any;

  constructor(
    public modal: NgxSmartModalService,
    public env: environment,
    public request: RequestsService,
    public router: Router
  ) { 
    
  }

  ngOnInit(): void {
    let event_delegate = JSON.parse(localStorage.getItem('event_delegate'));
    
    if(event_delegate){
      console.log(event_delegate);    
      this.env.clockService = new ClockService();      
      this.env.clockService.setDateTime(event_delegate).startTime();   
    }
  }

  onInitianRequest(){
    this.user = JSON.parse(localStorage.getItem('user_profile'));
    this.event = JSON.parse(localStorage.getItem('event'));
    this.event_delegate_id = localStorage.getItem('event_delegate_id');
    this.event_delegate = JSON.parse(localStorage.getItem('event_delegate'));

    console.log('event: ', this.event);

    let data = this.modal.getModalData('rescheduleModal');
    console.log('data:', data);
   

    this.meeting_details = data.meeting_details;
    this.schedules = data.schedule;
  

    let sched = [];
    this.schedules.forEach(val => {
      if(val.event_current_date <= val.milisec){
        sched.push(val);
      }

      /*
      * Get the current timeslot of meeting schedule
      */ 
      if(this.meeting_details.date == val.date){
        val.schedules.forEach(sched => {
          if(this.meeting_details.meeting_schedule.time_slot_id == sched.data.id){
            this.selected_date =  sched.data;
            this.selected_time =  sched.data;
          }
        });
      }

      console.log('timeslot', this.selected_date);
      if(this.selected_date){
        if(this.selected_date.event_date_milisec == val.milisec){
          this.selected_date['schedules'] = val.schedules;
          this.selected_date['event_current_time'] = val.event_current_time;
        }
      }
    });
    this.schedules = sched;
    this.getTimeslot(this.meeting_details);
  }

  reset(){
    this.modal.resetModalData('rescheduleModal');
    this.modal.close('rescheduleModal');
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
    url += '&delegate1=' + this.meeting_details.meeting_schedule.delegate1;
    url += '&delegate2=' + this.meeting_details.meeting_schedule.delegate2;

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

  rescheduleAMeeting(){
    console.log('selected_time', this.selected_time);

    this.env.loaderText = 'Rescheduling meeting schedule...';
    this.env.spinner.show(this.env.loaderSpinner);

    let formData = {
      event_id: this.event.id,
      time_slot_id: this.selected_time.id, 
      sched_id: this.meeting_details.meeting_schedule.id,
      setter: 'delegate1',
    };

    if(this.event_delegate_id == this.meeting_details.meeting_schedule.delegate1){
      formData['delegate_1'] = this.meeting_details.meeting_schedule.delegate1;
      formData['delegate_2'] = this.meeting_details.meeting_schedule.delegate2;
    }else{
      formData['delegate_1'] = this.meeting_details.meeting_schedule.delegate2;
      formData['delegate_2'] = this.meeting_details.meeting_schedule.delegate1; 
    }

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
          this.env.toastr.success('Meeting request has been successfully sent');
          
        }else{
          this.meeting_details.date = this.selected_time.date;
          this.meeting_details.start_time = this.selected_time.start_time;
          this.meeting_details.end_time_orig = this.selected_time.end_time_orig;

          let obj ={
            timeslot: this.meeting_details,
            schedule: this.schedules,
          };

          this.modal.resetModalData('viewMeeting');
          this.modal.setModalData(obj,'viewMeeting');

          this.modal.open('viewMeeting');
          this.env.toastr.success(response.message);
        }

        this.modal.resetModalData('rescheduleModal');
        this.modal.close('rescheduleModal');
        this.modal.close('viewMeeting');

      }else{
        this.env.toastr.error(response.message)
      }
    });
  }

  convertToTimestamp(date){
    let date_now = new Date(date).getTime();
    return date_now;
  }
  getCurrentDay(){
    let date =new Date().getTime() - 86400000;
    return date;
  }
  getCurrentDate(){
    let date = new Date().getTime();
    return date;
  }

  getTimeAmPm(time){
    let ts = time;
    let H = +ts.substr(0, 2);
    let h: any = (H % 12) || 12;
    h = (h < 10)?("0"+h):h;  // leading 0 at the left for 1 digit hours
    let ampm = H < 12 ? " AM" : " PM";
    ts = h + ts.substr(2, 3) + ampm;
    return ts;
  }

  // delegate_timeslot: any = [];
  // getSameTimeslot(){
  //   for(let i = 0; i < this.selected_date.schedules.length; i++) {
  //     for (let x = 0; x < this.available_timeslot.length; x++) {
  //       if(this.selected_date.schedules[i].data.id == this.available_timeslot[x].id){
  //         this.delegate_timeslot.push(this.selected_date.schedules[i])
  //       }    
  //     }
  //   }
  // }


  gotoDelegateprofile(){
    this.router.navigate(['/delegates-profile/'+ this.meeting_details.meeting_schedule.delegate_id]);
    this.modal.resetModalData('viewMeeting');
    this.modal.close('viewMeeting');
    this.modal.resetModalData('rescheduleModal');
    this.modal.close('rescheduleModal');
  }

}
