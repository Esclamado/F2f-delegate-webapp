import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { empty } from 'rxjs';

@Component({
  selector: 'app-add-delegates',
  templateUrl: './add-delegates.component.html',
  styleUrls: ['./add-delegates.component.scss']
})
export class AddDelegatesComponent implements OnInit {
  delegatesForm: FormGroup;
  photoEmpty:boolean=false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  constructor(public fb: FormBuilder, public modal: NgxSmartModalService,) 
  { 
    this.initializeForm();
  }

  ngOnInit(): void {
  }

  sampleData = 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero De Finibus Bonorum et Malorum for use in a type specimen book.';
  sampleData1 = 'Lorem ipsum, or lipsum as it is sometimes known.';
  initializeForm() {
    this.delegatesForm = this.fb.group({
        date: ['',Validators.compose([Validators.required])],
      })
}

activetab = 1;
changeTab(num=1){
  this.activetab = num;
  console.log(this.activetab);
}

  openModal(img){
    img.click();
    console.log('sasa',img);
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
    if(this.imageChangedEvent){
      this.modal.setModalData(this.imageChangedEvent.target.value, 'cropperModal');
      this.modal.open('cropperModal');
    }
  }

  closeCropperModal(){
    this.modal.close('cropperModal');
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded(image: HTMLImageElement) {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
}
