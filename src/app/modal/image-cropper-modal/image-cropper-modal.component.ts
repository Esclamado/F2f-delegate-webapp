import { Component, OnInit, ViewChild } from '@angular/core';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-image-cropper-modal',
  templateUrl: './image-cropper-modal.component.html',
  styleUrls: ['./image-cropper-modal.component.scss']
})
export class ImageCropperModalComponent implements OnInit {

	@ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;

  data: any;
  type: string = 'profile';
  croppedImage: any = '';
  profilePhoto: any = '';
  imageChangedEvent: any;


  constructor(
    private modal: NgxSmartModalService
  ) { }

  ngOnInit(): void {
  }
  getData(){
    
    let imageCropperModal = this.modal.getModalData('imageCropperModal');
    console.log(imageCropperModal);
    if(imageCropperModal){
      this.imageChangedEvent = imageCropperModal.data;
      this.type = imageCropperModal.type;
    }
  }
  closeCropperModal(){
    this.modal.close('imageCropperModal');
  }
	startCrop(event: ImageCroppedEvent) {
		this.imageCropper.crop();
	}
  imageCropped(event: ImageCroppedEvent) {
    console.log(event);
    this.croppedImage = event.base64;
		this.profilePhoto = event.file;
  }
  imageLoaded(image: HTMLImageElement) {
    // show cropper
  }
  cropperReady(ev) {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  doneCrop(){
    if(this.croppedImage && this.profilePhoto){
      const obj = {
        'croppedImage': this.croppedImage,
        'profilePhoto': this.profilePhoto,
        'type': this.type
      };
      console.log('obj sa cropper component: ', obj)
    
      this.modal.resetModalData('imageCropperModal');
      this.modal.setModalData(obj, 'imageCropperModal');
      console.log('this.croppedImage:', obj);
    }
    this.modal.close('imageCropperModal');
  }
  reset(){
    this.modal.resetModalData('imageCropperModal');
  }
}
