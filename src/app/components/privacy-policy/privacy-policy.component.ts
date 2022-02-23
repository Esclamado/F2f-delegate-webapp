import { Component, OnInit } from '@angular/core';
import { Urls } from 'src/app//lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { environment } from 'src/app/lib/environment';
@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent implements OnInit {
  privacyPolicy: any;
  isLoading: boolean = false;
  constructor
  (
    private request: RequestsService,
    private env: environment
  ) { }

  ngOnInit(): void {
    this.getPrivacyPolicy();
  }

  getPrivacyPolicy(){
    this.isLoading = true;
    let url = Urls.api_cms_page;
    url += '?get=privacy_policy';

    this.request.get(url).then(response => {
      if(response.error == 0){
        this.privacyPolicy = response;
      }
    }).finally(()=>{
      this.isLoading = false;
    });
  }

}
