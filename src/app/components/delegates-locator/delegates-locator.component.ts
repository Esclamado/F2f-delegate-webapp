import { Component, OnInit } from '@angular/core';
import { Urls } from 'src/app/lib/urls'
import { RequestsService } from 'src/app/services/http/requests.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DebounceService } from 'src/app/debounce.service';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';
@Component({
  selector: 'app-delegates-locator',
  templateUrl: './delegates-locator.component.html',
  styleUrls: ['./delegates-locator.component.scss']
})
export class DelegatesLocatorComponent implements OnInit {
  searchForm: FormGroup
  event: any;
  search_key: any;
  limit = 500;
  page = 1;
  delegate_id: any;
  delegate_locator: any;
  user: any;
  search: any;
  isEmpty: boolean = true;
  isLoading: boolean = false;
  searchKey: any=null;
  search_keyword='';
  constructor( private request: RequestsService, public fb: FormBuilder, 
    public debounce: DebounceService,) 
  {

    this.searchForm = this.fb.group({
      search: [''],
    });

    this.searchKey = this.debounce.debounce(() => {
      this.page=1;
      this.search_keyword=this.searchForm.value.search;
      this.searchDelegateLocator();
    }, 500);

  }

  ngOnInit(): void {
    this.event = JSON.parse(localStorage.getItem('event'));
    this.user = JSON.parse(localStorage.getItem('user_profile'));
    console.log('delegate', this.user);
    // this.delegateLocator();
  }

  searchDelegateLocator(){
    this.search_key=this.searchForm.value.search;
    this.delegateLocator();
  }

  delegateLocator(){
  this.isEmpty = true;
  this.isLoading = true;
  let url = Urls.mapi_delegate_locator;
    url += '?event_id=' + this.event.event_id;
    url += '&delegate_id=' + this.user.id;
    if(this.search_key){
      url += '&search_key=' + this.search_key;
    }
    if(this.limit){
      url += '&limit=' + this.limit;
    }
    if(this.page){
      url += '&page=' + this.page;
    }
    if(this.search_key){
      this.request.get(url).then(response =>{
        if(response.error == 0){
        this.delegate_locator = response['data']['datas'];
        console.log('tire', this.delegate_locator);
          if(this.delegate_locator.length == 0){
            this.isEmpty = true;
          }else{
            this.isEmpty = false;
          }
        }
      }).finally(() => { 
          this.isLoading = false;
      })
    }else{
      this.isLoading = false;
    }
  }
}
