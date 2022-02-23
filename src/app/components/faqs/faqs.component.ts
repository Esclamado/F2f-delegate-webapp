import { Component, OnInit } from '@angular/core';
import { Urls } from 'src/app//lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { DebounceService } from 'src/app/debounce.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/lib/environment';
@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent implements OnInit {
  searchForm: FormGroup
  feedBackForm: FormGroup;
  showFaqs: boolean = false;
  model: any;
  length: number;
  event_id: any;
  id: any;
  delegate_id: any;
  faqs: any;
  event: any;
  user: any;
  keyword: any;
  filter_option: any;
  limit = 5;
  page = 1;
  openedFaqs: any;
  searchKey: any=null;
  search_keyword='';
  isFaqsEmpty: boolean = false;
  isFaqsLoading: boolean = false;
  saveFaqs: any;
  saveFeedBack: any;
  final_url: any;
  constructor(private request: RequestsService,  public debounce: DebounceService,  public fb: FormBuilder,  private toastr: ToastrService,  public env: environment) 
  { 
    this.searchKey = this.debounce.debounce(() => {
      this.page=1;
      this.filter_option = '';
      this.search_keyword=this.searchForm.value.search;
      this.searchList();
    }, 500);

    this.searchForm = this.fb.group({
      search: [''],
    });

    this.feedBackForm = this.fb.group({
      message: [''],
    })
  }

  ngOnInit(): void {
    this.event = JSON.parse(localStorage.getItem('event'));
    this.user = JSON.parse(localStorage.getItem('user_profile'));
    this.getFaqs();
  }

  getYoutubeId(data){
    console.log('data', data);
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = data.match(regExp);
    if (match && match[2].length == 11) {

      let youtubevideoId = 'https://www.youtube.com/embed/'+match[2];
      let final_url = "<iframe width='100%' height='300px' class='rounded-b-lg' src='"+youtubevideoId+"' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>";
      this.final_url =  this.env.sanitizeLink(final_url);
      return this.env.sanitizeLink(final_url);

    }
    else{
      return null;
      // console.log("no return")
    }
  }


  openFaqs(id){
    this.openedFaqs = id;
    this.showFaqs = true;
  }

  closeFaqs(){
    this.openedFaqs = "id";
    this.showFaqs = false;
  }

  searchList() {
    this.page = 1;
    this.filter_option = '';
    this.keyword = this.searchForm.value.search;
    this.getFaqs();
  }

  getFaqsYoutubelink: any;
  newFaqs: any = [];
  getFaqs(){
    this.isFaqsLoading = true;
    this.isFaqsEmpty = false;
    let url = Urls.api_faqs_get;
    url += '?event_id=' + this.event.event_id;
    if(this.keyword){
      url += '&keyword=' + this.keyword;
    }
    if(this.filter_option){
      url += '&filter_option=' + this.filter_option;
    }
    if(this.limit){
      url += '&limit=' + this.limit;
    }
    if(this.page){
      url += '&page=' + this.page;
    }
    
    this.request.get(url).then(response => {
      if(response.error == 0){
        this.faqs = response['data']['datas'];
        console.log('faqs', this.faqs);
        // if(this.faqs[0].youtubelink){
        //   this.getYoutubeId(this.faqs[0].youtubelink)
        // }
        this.newFaqs = [];
        this.faqs.forEach(element => {
          element.youtubelink = this.getYoutubeId(element.youtubelink);
          this.newFaqs.push(element);
        });

        if(this.faqs.length == 0){
          this.isFaqsEmpty = true;
        }else{
          this.isFaqsEmpty = false;
        }
      }
    }).finally(() => {
      this.isFaqsLoading = false;
    });
  }

  voteFaqsYES(id){
    let params = {
      delegate_id: this.user.id,
      event_id: this.event.event_id,
      faq_id: id,
      vote: 'yes'
    }
    this.request.post(Urls.api_faqs_savefaqvote, params).then(response => {
      if(response.error == 0){
        this.saveFaqs = response['error'];
        this.toastr.success(response.message)
      }else{
        this.toastr.error(response.message)
      }
    })
  }

  voteFaqsNO(id){
    let params = {
      delegate_id: this.user.id,
      event_id: this.event.event_id,
      faq_id: id,
      vote: 'no'
    }
    this.request.post(Urls.api_faqs_savefaqvote, params).then(response => {
      if(response.error == 0){
        this.saveFaqs = response['error'];
        this.toastr.success(response.message)
      }else{
        this.toastr.error(response.message)
      }
    })
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
        this.env.spinner.hide(this.env.loaderSpinner);
        this.toastr.success(response.message);
      }else{
        this.toastr.error(response.message);
      }
    })
  }


}
