import { Component, OnInit } from '@angular/core';
import { datatable } from 'src/app/components/datatables/company';
import { NgxSmartModalService } from 'ngx-smart-modal';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-delegates',
  templateUrl: './delegates.component.html',
  styleUrls: ['./delegates.component.scss']
})
export class DelegatesComponent implements OnInit {
  public noteForm: FormGroup;
  viewProfilePrivate:boolean= false;
  photoEmpty:boolean=false;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  isEmpty:boolean=true;
  ths: any = datatable;
  type_value: any;
  addNoteHidden:boolean=true;
  list = [
    {
      Id: 1,
      name: 'CDO',
      created_at: 1617162410,
      status: 'established'
    },
    {
      Id: 2,
      name: 'Purefoods',
      created_at: 1617162910,
      status: 'established'
    },
    {
      Id: 3,
      name: 'BBC',
      created_at: 1617162210,
      status: 'established'
    },
  ]

  status: any = [
    {
      type: 1,
      name:'Established',
    },
    {
      type: 2,
      name:'Desolve',
    }
  ]

  delegates_card=[
    {
        name: 'Kelly Fabio',
        company_name: 'Leentech',
        position: 'Developer',
        nationality: 'Manila, Philippines',
        available_meetings: '12 available meeting timeslots',
        no_show_meeting: '8 no show meetings',
        meeting_same_company: '1 meeting with the same company',
        status: 1,
        meeting: 54
    },
    {
      name: 'Romel Postrano',
      company_name: 'Leentech',
      position: 'Developer',
      nationality: 'Manila, Philippines',
      available_meetings: '8 available meeting timeslots',
      no_show_meeting: '3 no show meetings',
      meeting_same_company: '2 meeting with the same company',
      status: 0,
      meeting: 0
    },
    {
        name: 'Kael Reyes',
        company_name: 'Leentech',
        position: 'Developer',
        nationality: 'Manila, Philippines',
        available_meetings: '12 available meeting timeslots',
        no_show_meeting: '3 no show meetings',
        meeting_same_company: '1 meeting with the same company',
        status: 1,
        meeting: 83
    }
  ]

  Showing = 'Showing 84 delegates';
  Showing_content = 'Browse or search to find someone you can connect to. You can also use filters to get a better results.';
  name = 'Romel E. Postrano';
  position = 'Developer';

  constructor
  (public modal: NgxSmartModalService, public fb: FormBuilder,  private spinner: NgxSpinnerService) 
  {
    this.noteForm = this.fb.group({
      note: ['', Validators.compose([Validators.maxLength(500)])],
    })
  }

  ngOnInit(): void {
  }

  addNote(){
    this.addNoteHidden = false;
  }

  saveNote(){
    this.addNoteHidden = true;
  }

  closeNote(){
    this.spinner.show();
    setTimeout(() => {
      this.modal.close('noteModal');
      this.spinner.hide();
    }, 5000)
  }

  clickedStatus(type){
    this.type_value = type
  }

  note(){
    this.modal.open('noteModal');
  }

  viewProfile(){
    this.modal.open('viewProfileModal');
  }

  saveProfile(){
    this.spinner.show();
    setTimeout(() => {
      this.modal.close('viewProfileModal');
      this.spinner.hide();
    },5000)
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
