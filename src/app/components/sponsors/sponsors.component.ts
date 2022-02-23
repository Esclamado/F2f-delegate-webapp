import { Component, OnInit } from '@angular/core';
import { Urls } from 'src/app//lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';

@Component({
  selector: 'app-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.scss']
})
export class SponsorsComponent implements OnInit {
  sponsors = [
    {
      sponsor_name: 'Gekko & Co',
    },
    {
      sponsor_name: 'Sterling Cooper',
    },
    {
      sponsor_name: 'J-Texon',
    }
  ]

  isEventLoading: boolean = false;
  isSponsorEmpty: boolean = false;
  event: any;
  sponsor_limit: any = 10;
  sponsor_sort: 'id';
  sponsor_order: 'asc';
  sponsor_page: any = 1;

  sponsor: any;
  about_sponsor: any;

  selected_sponsor: any;
  default_selected_sponsor: any;
  default_sponsor_id:any;
  constructor(private request: RequestsService,) { }

  ngOnInit(): void {
    this.event = JSON.parse(localStorage.getItem('event'));
    this.getSponsors();
  }

  getSponsors(){
    this.isSponsorEmpty = false;
    this.isEventLoading = true;
    let url = Urls.api_sponsor_get;
    url += '?event_id=' + this.event.event_id;
    if(this.sponsor_limit){
      url += '&limit=' + this.sponsor_limit;
    }
    if(this.sponsor_sort){
      url += '&sort=' + this.sponsor_sort;
    }
    if(this.sponsor_order){
      url += '&order=' + this.sponsor_order;
    }
    if(this.sponsor_page){
      url += '&page=' + this.sponsor_page;
    }
    this.request.get(url).then(response => {
      if(response.error == 0){
        this.sponsor = response['data']['datas'];
        this.about_sponsor = response['data']['datas'][0];
        console.log('about_sponsor', this.about_sponsor);
        this.selected_sponsor = this.sponsor[0].id;
        if(this.sponsor.length == 0){
          this.isSponsorEmpty = true;
        }else{
          this.isSponsorEmpty = false;
        }
      }
   }).finally(() => {
    this.isEventLoading = false;
   
   });
  }

  setSponsor(id){
    this.selected_sponsor=id;
    let sponsor_index=this.findWithAttr(this.sponsor, 'id', id);
    this.about_sponsor=this.sponsor[sponsor_index];
  }
  findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
  }
  
}


