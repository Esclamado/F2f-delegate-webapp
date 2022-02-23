import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-loader-modal',
  templateUrl: './loader-modal.component.html',
  styleUrls: ['./loader-modal.component.scss']
})
export class LoaderModalComponent implements OnInit {
  modal_data: any;

  constructor(
    private modal_service: NgxSmartModalService,
  ) { }

  ngOnInit(): void {
  }
  getData(){
    this.modal_data = this.modal_service.getModalData('loaderModal')
  }
  reset(){
    this.modal_data = null;
    this.modal_service.resetModalData('loaderModal')
  }

}
