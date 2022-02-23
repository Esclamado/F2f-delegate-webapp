import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';
import {ImageCroppedEvent} from 'ngx-image-cropper';

@Component({
  selector: 'app-save-modal',
  templateUrl: './save-modal.component.html',
  styleUrls: ['./save-modal.component.scss']
})
export class SaveModalComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropperModal1: any;
  constructor
  (
    public modal: NgxSmartModalService,
    private spinner: NgxSpinnerService,
    public router: Router,
  ) { }

  ngOnInit(): void {
  }

  close(){
  this.spinner.show();
    setTimeout(() => {
      this.modal.close('companyModal');
      this.router.navigate(['/admin/companies']);
      this.spinner.hide();
    }, 5000);
  }

}
