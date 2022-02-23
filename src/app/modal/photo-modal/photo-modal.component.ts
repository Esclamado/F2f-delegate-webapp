import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.scss']
})
export class PhotoModalComponent implements OnInit {
  img_path = 'assets/images/romel.jpg';
  constructor(
    public modal: NgxSmartModalService
  ) { }

  ngOnInit(): void {
  }
  reset(){
    this.modal.close('photoModal');
  }

}
