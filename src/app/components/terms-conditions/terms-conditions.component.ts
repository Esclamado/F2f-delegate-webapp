import { Component, OnInit } from '@angular/core';
import { Urls } from 'src/app//lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { environment } from 'src/app/lib/environment';
@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent implements OnInit {
  termsCondition: any;
  isLoading: boolean = false;
  constructor(
    private request: RequestsService,
    private env: environment,
    ) { }

  ngOnInit(): void {
    this.getTermsCondition();
  }

  getTermsCondition(){
    this.isLoading = true;
    let url = Urls.api_cms_page;
    url += '?get=terms_services';

    this.request.get(url).then(response => {
      if(response.error == 0){
        this.termsCondition = response;
      }
    }).finally(() => {
      this.isLoading = false;
    })
  }
}
