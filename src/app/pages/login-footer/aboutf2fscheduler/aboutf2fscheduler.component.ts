import { Component, OnInit } from '@angular/core';
import { Urls } from 'src/app//lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aboutf2fscheduler',
  templateUrl: './aboutf2fscheduler.component.html',
  styleUrls: ['./aboutf2fscheduler.component.scss']
})
export class Aboutf2fschedulerComponent implements OnInit {
  aboutScheduler: any;
  isLoading: boolean = false;

  constructor(private request: RequestsService,  public router: Router,) { }

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
