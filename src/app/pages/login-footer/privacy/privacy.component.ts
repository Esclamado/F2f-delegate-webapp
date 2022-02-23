import { Component, OnInit } from '@angular/core';
import { Urls } from 'src/app//lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {
  privacyPolicy: any;
  isLoading: boolean = false;
  constructor(private request: RequestsService,  public router: Router,) { }

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
