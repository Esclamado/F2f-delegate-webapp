import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { Urls } from 'src/app/lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/app/lib/environment';

@Component({
  selector: 'app-report-no-show',
  templateUrl: './report-no-show.component.html',
  styleUrls: ['./report-no-show.component.scss']
})
export class ReportNoShowComponent implements OnInit {

  user: any;
  event: any;

  meeting: any;
  day: any;
  noshow: any;
  
  reporter_delegate_id : any = null;
  reported_delegate_id : any = null;

  constructor(
    private modal: NgxSmartModalService,
    public request: RequestsService,
    public env: environment
  ) { 
  }

  ngOnInit(): void {
  }

  getData(){
    this.user = JSON.parse(localStorage.getItem('user_profile'));
    this.event = JSON.parse(localStorage.getItem('event'));
    
    let data = this.modal.getModalData('reportNoShow');
    this.meeting = data.meeting;

    if(data.day){
      this.day = data.day;
    }
    if(data.noshow){
      this.noshow = data.noshow;
    }
  }

  /* 
  /* Reports the delegate as no show 
  */
  reportAsNoShow(){  
    this.meeting.filter_date = this.day.filter_date;
    this.meeting.milisec = this.day.milisec;

    let delegate_name = this.meeting.meeting_schedule.delegate_fullname;
    let meeting_schedule_id = this.meeting.meeting_schedule.id

    let a = this;
    this.reporter_delegate_id = this.meeting.event_delegate_id;

    if(this.meeting.meeting_schedule.delegate1 == this.reporter_delegate_id){
      this.reported_delegate_id = this.meeting.meeting_schedule.delegate2;
    }else{
      this.reported_delegate_id = this.meeting.meeting_schedule.delegate1;
    }

    let title = 'Report as no show';
    let msg = 'Are you sure you want to report ' + delegate_name + ' as no show? This will notify the admin and will be validated first before approval.';
    let btn_save = 'Report';
    let btn_cancel = 'Cancel';

    this.env.loaderText = 'Reporting as No Show...';
    this.env.spinner.show(this.env.loaderSpinner);
    
    let formData = new FormData();
    formData.append('event_id', this.event.id);
    formData.append('meeting_schedule_id', meeting_schedule_id);
    formData.append('reported_delegate_id', this.reported_delegate_id);
    formData.append('reporter_delegate_id', this.reporter_delegate_id);
    
    this.request.post(Urls.mapi_noshow_report, formData).then(data =>{
      this.env.spinner.hide(this.env.loaderSpinner);
      if(data.error == 0){

        this.meeting['no_show'] = data.data
        localStorage.setItem('no_show_data', JSON.stringify(this.meeting['no_show']))
        let msg = 'You have successfully reported '+delegate_name+' as no show.';
        
        this.env.toastr.success(msg)
      }else{

        this.env.toastr.error('Error.', data.message)

      }
    });

    this.closeReportNoShow();
  }

  /* 
  /* Cancel the No Show Reports of the delegate
  */
  removeNoshowReport(){
    let delegate_name = this.meeting.meeting_schedule.delegate_fullname;

    let a = this;

    let title = 'Cancel No Show Report';
    let msg = 'Are you sure you want to cancel the no show report for ' + delegate_name + '? This will be remove the report permanently.';
    let btn_save = 'Cancel';
    let btn_cancel = 'Not now';

    this.env.loaderText = 'Cancelling No Show Report...';
    this.env.spinner.show(this.env.loaderSpinner);

    let thisData = {
      id: this.noshow.id,
      status: this.noshow.status
    };

    this.request.post(Urls.mapi_noshow_cancel, thisData).then(data =>{
      this.env.spinner.hide(this.env.loaderSpinner);
      if(data.error == 0){

        this.meeting['no_show'] = null;
        localStorage.removeItem('no_show_data',)

        let msg = 'You have successfully cancel the no show report for '+delegate_name+'.';
        this.env.toastr.success(msg);
      }else{
        this.env.toastr.error('Error.', data.message);
      }
    });

    this.closeReportNoShow();
  }

  reset(){
    this.modal.resetModalData('reportNoShow');
    this.modal.close('reportNoShow');
  }

  closeReportNoShow(){
    this.modal.resetModalData('reportNoShow');
    this.modal.close('reportNoShow');
  }
}
