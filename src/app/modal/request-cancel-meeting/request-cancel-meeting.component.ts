import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';

import { Urls } from 'src/app/lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { environment } from 'src/app/lib/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-request-cancel-meeting',
  templateUrl: './request-cancel-meeting.component.html',
  styleUrls: ['./request-cancel-meeting.component.scss']
})
export class RequestCancelMeetingComponent implements OnInit {
  
  cancelRequestForm: FormGroup;
  user: any;
  event: any;
  event_delegate_id: any;
  event_delegate: any;

  meeting_details: any;
  calcellation_reason: any = '';

  constructor(
    public modal: NgxSmartModalService,
    public fb: FormBuilder,
    public request: RequestsService,
    public env: environment,
    public toastr: ToastrService
  ) { 
    
    this.cancelRequestForm = this.fb.group({
      reason_message: ['',Validators.compose([Validators.required])],
    })
  }

  ngOnInit(): void {
  }

  onInitianRequest(){
    this.user = JSON.parse(localStorage.getItem('user_profile'));
    this.event = JSON.parse(localStorage.getItem('event'));
    this.event_delegate_id = localStorage.getItem('event_delegate_id');
    this.event_delegate = JSON.parse(localStorage.getItem('event_delegate'));

    console.log('event: ', this.event);

    let data = this.modal.getModalData('cancelMeetingModal');
    console.log('data: ', data);

    this.meeting_details = data.meeting_details;
  }

  reset(){
    this.modal.resetModalData('cancelMeetingModal');
    this.modal.close('cancelMeetingModal');
  }

  gotoMeetingDetails(){
    this.modal.resetModalData('cancelMeetingModal');
    this.modal.close('cancelMeetingModal');
  }

  cancelMeetingSchedule(){
    this.env.loaderText = 'Cancelling Meeting Schedule ...';
    this.env.spinner.show(this.env.loaderSpinner);
    if(this.cancelRequestForm.controls.reason_message.value != null){
      let formData = new FormData();
      formData.append('meeting_schedule_id', this.meeting_details.meeting_schedule.id);
      formData.append('edid', this.event_delegate_id);
      formData.append('request_message', this.cancelRequestForm.controls.reason_message.value);


    // if(this.event && this.event.cancellation_request == '2' && this.calcellation_reason == ''){
    //   formData.append('message', this.calcellation_reason);
    // }

    this.request.post(Urls.mapi_delegate_requestcancelmeeting, formData).then(data =>{
      this.env.spinner.hide(this.env.loaderSpinner);
      if(data.error == 0){
        this.toastr.success('Successfully canceled');
        // if(this.event && this.event.cancellation_request == '2' && this.calcellation_reason == ''){
        //   this.env.toastr.success('success', 'You have sent a request to cancel your meeting. We’ll review this first and will notify you after.');  
        // }else{
        //   this.env.toastr.success('success', 'You have successfully cancelled your meeting schedule.');  
          
          /* 
          * Close the meeting details modal
          * Reset its value
          */
          this.modal.resetModalData('viewMeeting');
          this.cancelRequestForm.reset();
          this.modal.close('viewMeeting');
        }else{
          this.toastr.error(data.message);
        }
        
        /* 
        * Close the cancel meeting modal 
        * Reset its value
        */
        this.modal.resetModalData('cancelMeetingModal');
        this.modal.close('cancelMeetingModal');

      // }else{
      //   this.env.toastr.error('error','Cancellation of meeting is prohibited 30 mins before the scheduled meeting.');
      // }
    });
    }else{
      this.toastr.error('Request for cancelation field is required');
      this.modal.close('cancelMeetingModal');
      this.env.spinner.hide(this.env.loaderSpinner);
    }
  }
}
