import { Component, OnInit } from '@angular/core';
import { Urls } from 'src/app//lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { environment } from 'src/app/lib/environment';

@Component({
  selector: 'app-f2f-about',
  templateUrl: './f2f-about.component.html',
  styleUrls: ['./f2f-about.component.scss']
})
export class F2fAboutComponent implements OnInit {
  aboutScheduler: any;
  isLoading: boolean = false;
  constructor(
    private request: RequestsService,
    private env: environment,
    ) { }

  ngOnInit(): void {
    this.getAboutScheduler();
  }

  getAboutScheduler(){
    this.isLoading = true;
    let url = Urls.api_cms_page;
    url += '?get=about';

    this.request.get(url).then(response => {
      if(response.error == 0){
        this.aboutScheduler = response;
      }
    }).finally(()=>{
      this.isLoading = false;
    });
  }

}
