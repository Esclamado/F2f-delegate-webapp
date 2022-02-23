import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/app/lib/environment';
import { Urls } from 'src/app/lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { ClockService } from 'src/app/services/clock.service';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-events',
  templateUrl: './view-events.component.html',
  styleUrls: ['./view-events.component.scss']
})
export class ViewEventsComponent implements OnInit {
  feedBackForm: FormGroup;
  saveFeedBack: any;
  event: any;
  event_delegate: any;
  timezone_trimmed: any;

  speakers: any;
  speakers_total_count = 0;
  speakers_total_page = 0;
  speakers_limit = 10;
  speakers_page = 1;
  isLoaded: boolean = false;
  isLoading: boolean = false;

  clockService: any = null;

  constructor(
    private request: RequestsService,
    private env: environment,
    private route: Router,
    public modal: NgxSmartModalService,
    public fb: FormBuilder, 
    private toastr: ToastrService,  
  ) { 

    this.clockService = new ClockService();

    this.event = JSON.parse(localStorage.getItem('event'));
    this.event_delegate = JSON.parse(localStorage.getItem('event_delegate'));
    if(this.event){
      this.timezone_trimmed = this.env.trim(this.event.time_zone);
      if(this.event.lat){
        this.event.lat = parseFloat(this.event.lat);
      }
      if(this.event.long){
        this.event.long = parseFloat(this.event.long);
      }

      if(this.event_delegate){
        this.clockService = new ClockService();      
        this.clockService.setDateTime(this.event_delegate).startTime();   
      }
    }

   this.feedBackForm = this.fb.group({
     message: [''],
   });

  }

  ngOnInit(): void {
    this.getSpeakers();
  }

  getSpeakers(infiniteScroll?){
    this.isLoading = true;
    let url = Urls.api_speaker_get;
    url += '?event_id=' + this.event.id;
    url += '&limit=' + this.speakers_limit;
    url += '&page=' + this.speakers_page;
    this.request.get(url).then(data => {
      this.isLoaded = true;
      this.isLoading = false;
      if(data.error == 0){
        this.speakers_total_count = data['data']['total_count'];
        this.speakers_total_page = data['data']['total_page']

        if (!infiniteScroll || infiniteScroll === false){
          this.speakers = []; 
        }

        data['data']['datas'].forEach((data) => {
          this.speakers.push(data);
        });
      }else{
        this.speakers = [];
        this.speakers_total_count = 0;
        this.speakers_total_page = 0;
      }
    });
  }

  scrollRequesting: any = false;
  onScroll(ev: any) {
    console.log(this.speakers_total_page);
    console.log(this.speakers_page);

    if(this.speakers_total_page > this.speakers_page){
      this.speakers_page++;
      this.getSpeakers(true);
    }
  }

  browsePhysicalDelegates(){
    this.route.navigate(['/find-delegates']);
  }

  browseVirtualDelegates(){
    this.route.navigate(['/my-schedule-virtual']);
  }

  openFeedBackModal(){
    this.modal.open('feedbackModal');
  }

  closeFeedBackModal(){
    this.modal.close('feedbackModal');
  }

  savefeedBack(){
    this.env.loaderText = 'Updating feedback ...';
    this.env.spinner.show(this.env.loaderSpinner);
    let formData = new FormData();
      formData.append('event_id', this.event.event_id);
      formData.append('message', this.feedBackForm.controls.message.value);
    
    this.request.post(Urls.api_feedback_save, formData).then(response => {
      if(response.error == 0){
        this.saveFeedBack = response['error'];
        this.feedBackForm.reset();
        this.modal.close('feedbackModal');
        this.env.spinner.hide(this.env.loaderSpinner);
        this.toastr.success(response.message);
      }else{
        this.modal.close('feedbackModal');
        this.toastr.error(response.message);
      }
    })
  }
}
