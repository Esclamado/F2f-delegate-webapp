import { Component, OnInit } from '@angular/core';
import { Urls } from 'src/app//lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {
  termsCondition: any;
  isLoading: boolean = false;
  constructor(
    private request: RequestsService,  public router: Router,) { }

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

  goBackLogin(){
    this.router.navigate(['/login']);
  }

  openTerms(){
    this.router.navigate(['/loginTermsCondition']);
  }


  openAboutf2f(){
    this.router.navigate(['/loginAboutf2fScheduler']);
  }

  openPrivacy(){
    this.router.navigate(['/loginPrivacyPolicy']);
  }

}
