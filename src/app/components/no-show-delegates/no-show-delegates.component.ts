import { Component, OnInit } from '@angular/core';
import { Urls } from 'src/app/lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';


@Component({
  selector: 'app-no-show-delegates',
  templateUrl: './no-show-delegates.component.html',
  styleUrls: ['./no-show-delegates.component.scss']
})
export class NoShowDelegatesComponent implements OnInit {
  user: any;
  event: any;
  local_no_show: any;
  
  no_show_limit = 5;
  no_show_page = 1;
  no_show_delegates: any;
  meeting_with_checked: boolean = false;

  no_show_partners_limit = 5;
  no_show_partners_page = 1;
  no_show_partners_delegates: any;

  noShowPartnersLoading: boolean = false;
  noShowPartnerEmpty: boolean = false;
  noShowEmpty: boolean = false;
 
  constructor(public request: RequestsService,) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user_profile'));
    this.event = JSON.parse(localStorage.getItem('event'));
    this.local_no_show = JSON.parse(localStorage.getItem('local_no_show_partners'));
    console.log('sasa', this.local_no_show);
    if(this.local_no_show){
      this.getShowOnlyDelegates();
    }else{
      this.getTopNoShow();
    }
  }

  /* get all top no show delegates */
  getTopNoShow(){
    this.noShowEmpty = false;
    this.noShowPartnersLoading = true;
    let url = Urls.mapi_noshow_topnoshow;
    url += '?event_id=' + this.event.event_id;
    if(this.no_show_limit){
      url += '&limit=' + this.no_show_limit;
    }
    if(this.no_show_page){
      url += '&page=' + this.no_show_page;
    }
   
    this.request.get(url).then(response => {
      if(response.datas){
        this.no_show_delegates = response['datas'];
        console.log('no_show_delegates', this.no_show_delegates);
        if(this.no_show_delegates == 0){
          this.noShowEmpty = true;
        }else{
          this.noShowEmpty = false
        }
      }
    }).finally(() => {
      this.noShowPartnersLoading = false;
    });
  }

  /* Show only delegates i have meeting with */
  getShowOnlyDelegates(){
    this.noShowPartnersLoading = true;
    this.noShowPartnerEmpty = false;
    if(!this.meeting_with_checked){
      let url = Urls.mapi_noshow_topnoshow;
      url += '?event_id=' + this.event.event_id;
      url += '&delegate_id=' + this.user.id;
      if(this.no_show_partners_limit){
        url += '&limit=' + this.no_show_partners_limit;
      }
      if(this.no_show_partners_page){
        url += '&page=' + this.no_show_partners_page;
      }
      this.request.get(url).then(response => {
        if(response.datas){
          this.no_show_delegates = response['datas'];
          console.log('no_show_partners_delegates', this.no_show_delegates);
          if(this.no_show_delegates.length == 0){
            this.noShowPartnerEmpty = true;
          }else{
            this.noShowPartnerEmpty = false;
          }
        }
      }).finally(() => {
        this.noShowPartnersLoading = false;
      });
      localStorage.setItem('local_no_show_partners', 'true');
      this.meeting_with_checked=true;
    }else{
      localStorage.removeItem('local_no_show_partners');
      this.getTopNoShow();
      this.meeting_with_checked=false;
    }
  }

}


