import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RequestsService } from 'src/app/services/http/requests.service';
import { Urls } from 'src/app/lib/urls'
import { DebounceService } from 'src/app/debounce.service';
@Component({
  selector: 'app-messaging-modal-search',
  templateUrl: './messaging-modal-search.component.html',
  styleUrls: ['./messaging-modal-search.component.scss']
})
export class MessagingModalSearchComponent implements OnInit {
  
  searchForm: FormGroup;

  current_page = 1;
  limit = 30;
  sort: any = 'id';
  order: any = 'asc';
  search: any = '';
  delegates: any;
  delegates_page = 1;
  isEmpty: boolean= false;
  isLoading: boolean= false;
  searchKey: any=null;
  search_keyword='';

  event: any;
  user: any;
  selected_deletage: any;
  

  constructor(
    private fb: FormBuilder,
    public modal: NgxSmartModalService, 
    private request: RequestsService,
    public debounce: DebounceService,
  ){

      this.searchForm = this.fb.group({
        search: [''],
      });

      this.searchKey = this.debounce.debounce(() => {
        this.delegates_page=1;
        this.search_keyword=this.searchForm.value.search;
        this.searchList();
      }, 500);

      
    }

  async ngOnInit() {
    //console.log('pasukin mo ako', this.event);
    //console.log('pasukin mo ako', this.user);
    // if(this.user && this.event){
    //   await this.getDelegateList();
    // }
    //console.log('pusdsadmasok 1', this.getDelegateList());
    await this.getEvent() 
    await this.getUser()
    await this.getDelegateList()
  }

  async getEvent(){
    this.event = await JSON.parse(localStorage.getItem('event'));
    return this
  }

  async getUser(){
    this.user = await JSON.parse(localStorage.getItem('user_profile'));
    return this
  }

  searchList() {
    this.delegates_page = 1;
    this.search = this.searchForm.value.search;
    this.getDelegateList();
  }

  closeSearchMessagingModal(){
    this.modal.close('searchMessaging');
  }

  async getDelegateData(){
    this.event = await JSON.parse(localStorage.getItem('event'));
    this.user = await JSON.parse(localStorage.getItem('user_profile'));
    if(this.event && this.user){
      this.getDelegateList();
    }
    
  }

  getDelegateList() {
    this.isLoading = true;
    let url = Urls.api_delegates_get;
    url += '?event_id=' + this.event.event_id;
    url += '&app_delegate_id=' + this.user.id;

    if (this.limit) {
      url += '&limit=' + this.limit;
    }
    if (this.sort) {
      url += '&sort=' + this.sort;
    }
    if (this.order) {
      url += '&order=' + this.order;
    }
    if (this.delegates_page) {
      url += '&page=' + this.delegates_page;
    }
    if (this.search) {
      url += '&search=' + this.search;
    }
    this.request.get(url).then(response => {
      if (response.error == 0) {
        this.delegates = response['data']['datas'];
        if(this.delegates.length == 0){
          this.isEmpty = true;
        }else{
          this.isEmpty = false;
        }
      }
    }).finally(()=>{
      this.isLoading = false;
    });
  }

  selectDelegate(delegate){
    this.selected_deletage = delegate
  }
  messageDelegate(){
    localStorage.setItem('delegate_message', JSON.stringify(this.selected_deletage));
    this.modal.close('searchMessaging')
  }

}
