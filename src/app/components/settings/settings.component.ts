import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(public modal: NgxSmartModalService, public spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  notif_body = "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. Lorem ipsum, or lipsum as it is sometimes known.";
  f2f = "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. Lorem ipsum, or lipsum as it is sometimes known.";
  Privacy = "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. Lorem ipsum, or lipsum as it is sometimes known.";
  terms = "Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. Lorem ipsum, or lipsum as it is sometimes known.";
 
  aboutF2F(){
    this.modal.open('f2fModal');
  }

  f2fClose(){
    this.spinner.show();
    setTimeout(() => {
      this.modal.close('f2fModal');
      this.spinner.hide();
    },5000)
  }

  privacyF2F(){
    this.modal.open('privacyF2FModal');
  }

  f2fPrivacyClose(){
    this.spinner.show();
    setTimeout(() => {
      this.modal.close('privacyF2FModal');
      this.spinner.hide();
    },5000)
  }
  
  termsF2F(){
    this.modal.open('termsF2FModal');
  }

  f2fTermsClose(){
    this.spinner.show();
    setTimeout(() => {
      this.modal.close('termsF2FModal');
      this.spinner.hide();
    },5000)
  }
}
