import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Urls } from 'src/app/lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { environment } from 'src/app/lib/environment';

@Component({
  selector: 'app-view-meeting-detail',
  templateUrl: './view-meeting-detail.component.html',
  styleUrls: ['./view-meeting-detail.component.scss']
})
export class ViewMeetingDetailComponent implements OnInit,AfterViewInit {

  user: any;
  delegate:any;
  event: any;
  event_delegate_id: any;
  event_delegate: any;

  meeting_details: any;
  schedule: any;
  
  totalTimeInSeconds: any;
  time_play: boolean = false;

  note: any = null;
  temp_note: any = '';
  is_add_note: boolean = false;
  note_isLoaded: boolean = false;

  constructor(
    public modal: NgxSmartModalService,
    public request: RequestsService,
    public route: Router,
    public env: environment
  ) { }
  ngAfterViewInit(): void {
    this.modal.getModal('rescheduleModal').onAnyCloseEvent.subscribe( data =>{
      this.show_detail = true
      console.log('show_detail: ', this.show_detail);
    })
  }

  ngOnInit(): void {
    // this.modal.getModal('reportNoShow').onAnyCloseEvent.subscribe(data => {
    //   this.modal.resetModalData('viewMeeting');
    //   this.modal.close('viewMeeting');
    // });

    this.getNotes();
  }

  async onInitianRequest(){
    this.user = JSON.parse(localStorage.getItem('user_profile'));
    this.event = JSON.parse(localStorage.getItem('event'));
    this.event_delegate_id = localStorage.getItem('event_delegate_id');
    this.event_delegate = JSON.parse(localStorage.getItem('event_delegate'));

    this.note = null;
    this.temp_note = '';
    this.is_add_note = false;
    this.note_isLoaded = false;

    this.time = null;
    this.timeInSeconds = null;
    this.runTimer = null;
    this.remainingCountdown = '';
    this.displayTime = null;
    this.remainingTime = null;

    this.delegate = null;
    this.meeting_details = null;

    let data = this.modal.getModalData('viewMeeting');
    this.meeting_details = data.timeslot.data ? data.timeslot.data : data;
    this.schedule = data.schedule;

    console.log('data', data);

    this.getDelegateProfile();
    
    this.totalTimeInSeconds = this.meeting_details.total_time_countdown
    this.timeInSeconds = this.meeting_details.time_countdown;
    this.initTimer();
    this.time_play = true;
  }

  time: any;
  timeInSeconds: any;
  runTimer: any;
  hasStarted: boolean;
  hasFinished: boolean;
  remainingCountdown: string;
  displayTime: any;
  remainingTime: any;
  
  initTimer() {
    // Pomodoro is usually for 25 minutes
   this.time = this.timeInSeconds;
   this.runTimer = false;
   this.hasStarted = false;
   this.hasFinished = false;
   this.remainingTime = setInterval(() => {
     //console.log('this.meeting_details.data.meeting_schedule: ', this.time)
    if(this.time_play){
      if(this.timeInSeconds && this.timeInSeconds > 0 && this.meeting_details.meeting_schedule && this.meeting_details.meeting_schedule.state == 'On-going') {
        this.displayTime = this.getSecondsAsDigitalClock(this.timeInSeconds);
        document.getElementById('timeProgress').innerHTML = this.displayTime.time;
        document.getElementById('labelProgress').innerHTML = this.displayTime.label;
        this.timeInSeconds--;
        this.remainingCountdown = this.getPercentage(this.timeInSeconds, this.totalTimeInSeconds);
      }
    }
   },1000);
 }

  getPercentage(num1, num2){
    if(num1 && num2){
      num1 = this.totalTimeInSeconds - num1;
      let que = num1 / num2;
      //parseFloat
      //Math.floor(1.6);
      return Math.floor(que*100).toString();
    }
  }
  
  getSecondsAsDigitalClock(inputSeconds: number) {
    var sec_num = parseInt(inputSeconds.toString(), 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);
    var hoursString = '';
    var minutesString = '';
    var secondsString = '';
    hoursString = (hours < 10) ? "0" + hours : hours.toString();
    minutesString = (minutes < 10) ? "0" + minutes : minutes.toString();
    secondsString = (seconds < 10) ? "0" + seconds : seconds.toString();
  
    let label = '';
    if(hours > 1){
      label = "hours left";
    }
    else if(hours == 1){
      label = "hour left";
    }
    else if(minutes > 1){
      label = "minutes left";
    }
    else if(minutes == 1){
      label = "minute left";
    }
    else if(seconds > 1){
      label = "seconds left";
    }
    else if(seconds == 1){
      label = "second left";
    }
    else if(seconds == 0){
      label = "The meeting is finished";
    }
  
    let time = '';
    time = hoursString + ':' + minutesString + ':' + secondsString;
    if(hours == 0){
      time = minutesString + ':' + secondsString;
    }
  
    let data_time = {
      time: time,
      label: label
    };
    return data_time;
  }

  reset(){
    clearInterval(this.remainingTime);
    this.modal.resetModalData('viewMeeting');
    this.modal.close('viewMeeting');
  }
  
  /**
  * open a confirmation modal to report as no show
  */
  reporter_delegate_id : any = null;
  reported_delegate_id : any = null;
  reportAsNoshow(day, meeting){
    let obj = {
      day: day,
      meeting: meeting,
    }

    this.modal.resetModalData('reportNoShow');
    this.modal.setModalData(obj, 'reportNoShow');
    this.modal.open('reportNoShow');
  }

  /**
  * open a confirmation modal to cancel report as no show
  */
  cancelRequest(noshow, meeting){
    let obj = {
      noshow: noshow,
      meeting: meeting,
    }
    this.modal.resetModalData('reportNoShow');
    this.modal.setModalData(obj, 'reportNoShow');
    this.modal.open('reportNoShow');
  }

  /*
  * This is for Reschedule of Schedule Meeting
  */
  show_detail: boolean = true;
  rescheduleMeetingSchedule(){
    let obj = {
      meeting_details: this.meeting_details,
      schedule: this.schedule
    }
    
    this.modal.resetModalData('rescheduleModal');
    this.modal.setModalData(obj, 'rescheduleModal');

    // this.modal.resetModalData('viewMeeting');
    // this.modal.close('viewMeeting');

    this.modal.open('rescheduleModal');
    this.show_detail= false;
  }

  /*
  * This is for Cancellation of Schedule Meeting
  */
  cancelMeetingSchedule(){
    let obj = {
      meeting_details: this.meeting_details
    }
    this.modal.resetModalData('cancelMeetingModal');
    this.modal.setModalData(obj, 'cancelMeetingModal');
    
    // this.modal.resetModalData('viewMeeting');
    // this.modal.close('viewMeeting');
    this.modal.open('cancelMeetingModal');
  }

  copyText(sched){
    console.log(sched);
    let link;
    if(sched.delegate_email == sched.d2_email){
      //start
      link = sched.zoom_meeting_link_1;
    }else{
      //join
      link = sched.zoom_meeting_link_2;
    }

    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.env.toastr.success('Copy to Clipboard');
  }

  getDelegateProfile(){
    console.log('asdfasdfasdf: ',this.meeting_details )
    let id = this.meeting_details.hasOwnProperty('meeting_schedule') && this.meeting_details.meeting_schedule.delegate_id ? this.meeting_details.meeting_schedule.delegate_id : this.meeting_details.timeslot.d2_delegate_id;
    let url = Urls.api_delegates_get;
    url += '?by=id';
    url += '&isApp=true';
    url += '&delegate=' + id;
    this.request.get(url).then(response => {
      if(response.error == 0){
        this.delegate = response.data;
        console.log('delegates: ', this.delegate)
        this.getNotes();
      }
    });
  }

  gotoDelegateprofile(){
    this.route.navigate(['/delegates-profile/'+ this.delegate.id]);
    this.modal.resetModalData('viewMeeting');
    this.modal.close('viewMeeting');
  }

  /*
  * This is for Displaying, Adding, and Updateing Notes
  */
  getNotes(){
    if(this.meeting_details){
      let url = Urls.mapi_event_note;
      let meeting_id = this.meeting_details.meeting_schedule && this.meeting_details.meeting_schedule.id ? this.meeting_details.meeting_schedule.id : this.meeting_details.timeslot.id;
      
      let d1_id
      let d2_id
      if(this.delegate.email == this.meeting_details.meeting_schedule.d1_email){
        d1_id = this.meeting_details.meeting_schedule && this.meeting_details.meeting_schedule.delegate1 ? this.meeting_details.meeting_schedule.delegate2 : this.meeting_details.timeslot.d1_id;
        d2_id = this.meeting_details.meeting_schedule && this.meeting_details.meeting_schedule.delegate2 ? this.meeting_details.meeting_schedule.delegate1 : this.meeting_details.timeslot.d2_id;  
      }else{
        d1_id = this.meeting_details.meeting_schedule && this.meeting_details.meeting_schedule.delegate1 ? this.meeting_details.meeting_schedule.delegate1 : this.meeting_details.timeslot.d2_id;
        d2_id = this.meeting_details.meeting_schedule && this.meeting_details.meeting_schedule.delegate2 ? this.meeting_details.meeting_schedule.delegate2 : this.meeting_details.timeslot.d1_id;  
      }
      url += '?msid=' + meeting_id;
      url += '&myedid=' + d1_id;
      url += '&other_deid=' + d2_id;
  
      console.log('ck - url' , url)
      
      this.request.get(url).then(data => {
        this.note_isLoaded = true;
        if(data.error == 0){
          this.note = data.data;
          this.temp_note = data.data.note;
        }
      });
    }
  }

  clickNote(val){
    this.is_add_note = val;
  }  

  focusOutNote(){
    this.is_add_note = false;
    //console.log('tagal');
    if(this.note){
      if(this.temp_note != this.note.note){
        this.saveNotes();
      }
    }else{
      this.saveNotes();
    }
  }

  saveNotes(){
    this.env.loaderText = 'Saving notes ...';
    this.env.spinner.show(this.env.loaderSpinner);

    let formData = new FormData();
    formData.append('event_id', this.event.id);
    formData.append('meeting_schedule_id', this.meeting_details.meeting_schedule);
    // formData.append('delegate1', this.event_delegate_id);
    //* start this is for another delegate *//
    if(this.delegate.email == this.meeting_details.meeting_schedule.d1_email){
      formData.append('delegate1', this.meeting_details.meeting_schedule.delegate2);
      formData.append('delegate2', this.meeting_details.meeting_schedule.delegate1);
    //* end this is for another delegate *//
    //* start this is for delegate na nkalogin *//
    }else{
      formData.append('delegate1', this.meeting_details.meeting_schedule.delegate1);
      formData.append('delegate2', this.meeting_details.meeting_schedule.delegate2);
    //* end this is for delegate na nkalogin *//
    }
    formData.append('note', this.temp_note);
    if(this.note){
      formData.append('id', this.note.id);
    }

    console.log('ck - form data', this.note );

    this.request.post(Urls.mapi_notes_save, formData).then(response => {
      this.env.spinner.hide(this.env.loaderSpinner);
      if (response.error == 0) {
        this.temp_note = '';
        this.env.toastr.success(response.message);
        this.getNotes();
      }else{
        this.env.toastr.error(response.message);
      }
    });
  }
  openMessaging(){
    localStorage.setItem('delegate_message', JSON.stringify(this.meeting_details.meeting_schedule));
    this.route.navigate(['/messaging'])
    this.modal.close('viewMeeting')
  }
}
