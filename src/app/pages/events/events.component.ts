import { Component, OnInit } from '@angular/core';import { Router } from '@angular/router';
import { Urls } from 'src/app/lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { environment } from 'src/app/lib/environment';
import { StatisticsService } from 'src/app/services/statistics/statistics.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  user: any;
  events:any;
  isEmpty:boolean = false;
  isLoading: boolean = false;
  limit = 9;

  events_list_total_count = 0;
  events_list_total_page = 0;
  events_list_page_array: any = null;
  events_page = 1;

  constructor(
    private request: RequestsService,
    private router: Router,
    private env: environment,
    private stats: StatisticsService
  ) {
    this.user = JSON.parse(localStorage.getItem('user_profile'));
   }

  ngOnInit(): void {
    this.env.requireLogIn();
    this.getEvents();
  }

  getEvents(){
    this.isLoading = true;
    let url = Urls.api_eventdelegate_get;
    url += '?status=' + 'ongoingandupcomming';
    url += '&delegate_id=' + this.user.id;
    url += '&published=' + 'true';
    url += '&limit=' + this.limit;
    url += '&page=' + this.events_page;

    this.request.get(url).then( data => {
      console.log(data)
      if(data.error == 0){
        this.events = data.data;
        this.events_list_total_count = data['data']['total_count'];
        this.events_list_total_page = data['data']['total_page'];
        this.events_list_page_array = data['data']['pages'];

        if(this.events.total_count >= 1){
          this.isEmpty = false
        }else{
          this.isEmpty = true
        }
      }else{
        this.isEmpty = true
      }
    }).finally(()=>{
      this.isLoading = false;
    })
  }


  setPage(page) {
    this.events = null;
    this.events_list_total_count = 0;
    this.isLoading = false;
    this.events_page = page;
    this.getEvents();
  }

  prevPage() {
    this.events = null;
    this.events_list_total_count = 0;
    this.isLoading = false;
    if(this.events_page <= this.events_list_total_page) {
      this.events_page--;
      this.getEvents();
    }
  }

  nextPage() {
    this.events = null;
    this.events_list_total_count = 0;
    this.isLoading = false;
    if(this.events_page < this.events_list_total_page) {
      this.events_page++;
      this.getEvents();
    }
  }


  viewEvents(event){
    let url = Urls.api_delegates_get;
    url += '?event_id=' + event.id;
    url += '&by=id';
    url += '&isApp=true';
    url += '&delegate=' + this.user.id;

    this.request.get(url).then(data => {
      if(data.error == 0){
        localStorage.setItem('event_delegate_id', data.data.ed_id);
      }
    });
    this.env.initChatSocket();
    localStorage.setItem('event', JSON.stringify(event));
    this.getEventExtraDetails(event);
    this.router.navigate(['events/view'])
    this.stats.saveFeatureComparison(1, event.id).then(data=>{
      console.log('feature comparison: ', data)
    })
  }

  getEventExtraDetails(event){
    let url = Urls.api_events_get;
    url += '?event_id=' + event.id;
    url += '&isApp=' +this.user.id ;

    this.request.get(url).then(data => {
      if(data.error == 0){
        localStorage.setItem('event_delegate', JSON.stringify(data.data));
      }
    });
  }
}
