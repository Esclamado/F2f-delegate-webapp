import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/lib/environment';
import { Urls } from 'src/app/lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';

@Component({
  selector: 'app-past-events-view',
  templateUrl: './past-events-view.component.html',
  styleUrls: ['./past-events-view.component.scss']
})
export class PastEventsViewComponent implements OnInit {

  feedBackForm: FormGroup;
  saveFeedBack: any;
  event: any;
  limit = 10;
  page = 1;
  speaker: any;
  timezone_trimmed: any;
  isRequestingSpeaker: boolean = false;
  html: any;
  final_url: any;
  event_detail: any;
  constructor(
    private request: RequestsService,
    private env: environment,
    private modal: NgxSmartModalService,
    private toastr: ToastrService,
    public fb: FormBuilder, 
  ){
    this.feedBackForm = this.fb.group({
      message: [''],
    });

    this.event = JSON.parse(localStorage.getItem('event'));
   }

  ngOnInit(): void {
    this.getSpeaker();
    this.timezone_trimmed = this.env.trim(this.event.time_zone)
    if(this.event.summary_youtube_link){
      this.getYoutubeId(this.event.summary_youtube_link)
    }
  }


  getSpeaker(limit?, page?){
    this.isRequestingSpeaker = true
    let url = Urls.api_speaker_get;
    url += '?event_id=' + this.event.id;
    url += '&limit=' + this.limit;
    url += '&page=' + this.page;
    this.request.get(url).then(data => {
      if(data.error == 0){
        this.speaker = data.data
      }
    }).finally(()=>{
        this.isRequestingSpeaker = false;
    })
  }
  scrollRequesting: any = false;
  onScroll(ev: any) {
    let scrollHeight = ev.target.scrollHeight;
    let combined = ev.target.scrollTop + ev.target.clientHeight;
    if (!this.scrollRequesting && scrollHeight == combined && this.speaker.next_page ){
        this.getSpeaker(10, this.speaker.next_page);
        this.scrollRequesting = true;
    } else {
        return false;
    }
  }
  
  getYoutubeId(data){
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = data.match(regExp);
    if (match && match[2].length == 11) {

      let youtubevideoId = 'https://www.youtube.com/embed/'+match[2];
      let final_url = "<iframe width='100%' height='300px' class='rounded-b-lg' src='"+youtubevideoId+"' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>";
      this.final_url =  this.env.sanitizeLink(final_url);
    }
    else{
      console.log("no return")
    }
  }

  openFeedBackModal(){
    this.modal.open('feedbackModal');
  }

  closeFeedBackModal(){
    this.modal.close('feedbackModal');
  }

  savefeedBack(){
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

  gotoExternalBrowser(url){
    console.log('url', url);
    window.open(url, '_blank');
  } 

}

