import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Urls } from 'src/app//lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/lib/environment';
import { UpperCasePipe } from '@angular/common';
import { HostListener } from '@angular/core';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { TransformDatePipe } from '../../lib/pipe/transform-date.pipe';

import * as _moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};
@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class NoteComponent implements OnInit {
  noteForm: FormGroup;
  removeNoteID: any;
  event_id: any;
  event: any;
  note: any;
  notes_page = 1;
  note_limt = 9;
  limit: any = 100;
  event_delegate_id: any;
  isNotesEmpty: boolean = false;
  isNotesLoading: boolean = false;
  save_note: any;
  notes: any;
  
  order: any = 'asc';
  pref_services_ids: any;
  pref_specialization_ids: any;
  search: any;
  filter_location: any = [];
  sort: any = 'id';
  delegates_page: any = 1;
  user: any;
  delegate: any;
  schedule: any;
  scheduleTime: any;
  meeting_schedule: any = null;
  selectedDelegate: any;
  delegate_user: any;
  showEditNote: boolean = false;
  save: any;
  myemail: any;
  meeting_with_email: any;

  notes_list_total_count = 0;
  notes_list_total_page = 0;
  notes_list_page_array: any = null;

  constructor(
    public modal: NgxSmartModalService,
    private request: RequestsService,
    public fb: FormBuilder,
    private toastr: ToastrService,
    public env: environment) 
    {
      this.noteForm = this.fb.group({
        fullname: [''],
        note: ['']
      });
    }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user_profile'));
    this.event = JSON.parse(localStorage.getItem('event'));
    this.event_delegate_id = localStorage.getItem('event_delegate_id');
    this.getNoteList();
    this.getDelegateList();
  }

  allowNewLine(text){
    //console.log('texttext', text);
    text = text.replace(/\<br \/\>/g, "");
    return text = text.replace(/\<br \/\>/g, "\n");
    // return text.replace(/\r\n|\r|\n/g, "");
  }

  addNotesModal(data){
    let obj = {
      data: data
    }
    this.modal.setModalData(obj, 'addNoteModal');
    this.modal.open('addNoteModal');
  }

  closeAddNote(){
    this.modal.close('addNoteModal');
  }

  noteSelectID: any;
  getSelectNoteID(){
    this.noteSelectID = this.modal.getModalData('addNoteModal');
    console.log('noteSelectID', this.noteSelectID);
  }

  resetSelectNoteID(){
    this.modal.resetModalData('addNoteModal');
  }


  /* note listed */
  getNoteList(){
    this.isNotesLoading = true;
    this.isNotesEmpty = false;
    let url = Urls.mapi_notes_get;
    url += '?event_id=' + this.event.id;
    url += '&edid=' + this.event_delegate_id;
    if(this.note_limt){
      url += '&limit=' + this.note_limt;
    }
    if(this.notes_page){
      url += '&page=' + this.notes_page;
    }
    this.request.get(url).then(response => {
      if(response.error == 0){
        this.notes = response['data']['datas'];
        this.notes_list_total_count = response['data']['total_count'];
        this.notes_list_total_page = response['data']['total_page'];
        this.notes_list_page_array = response['data']['pages'];
      
        if(this.notes.length == 0){
          this.isNotesEmpty = true;
        }else{
          this.isNotesEmpty = false;
        }
      }
    }).finally(() => {
      this.isNotesLoading = false;
    })
  }


  setPage(page) {
    this.notes = null;
    this.notes_list_total_count = 0;
    this.isNotesLoading = false;
    this.notes_page = page;
    this.getNoteList();
  }

  prevPage() {
    this.notes = null;
    this.notes_list_total_count = 0;
    this.isNotesLoading = false;
    if(this.notes_page <= this.notes_list_total_page) {
      this.notes_page--;
      this.getNoteList();
    }
  }

  nextPage() {
    this.notes = null;
    this.notes_list_total_count = 0;
    this.isNotesLoading = false;
    if(this.notes_page < this.notes_list_total_page) {
      this.notes_page++;
      this.getNoteList();
    }
  }


  getDaysMili(miliisecond){
    let _date = new Date(miliisecond);
    let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[_date.getDay()];
  }

  getDelegateList() {
    let url = Urls.api_delegates_get;
    url += '?event_id=' + this.event.id;
    url += '&app_delegate_id=' + this.user.id;
    if (this.limit) {
      url += '&limit=' + this.limit;
    }
    if (this.sort) {
      url += '&sort=' + this.sort;
    }
    if (this.order) {
      url += '&order=' + this.order;
    }
    if (this.delegates_page) {
      url += '&page=' + this.delegates_page;
    }
   this.request.get(url).then(response => {
     if(response.error == 0){
      this.delegate = response['data']['datas'];
     }
   })
  }
   

  setDelegate(delegate_user) {
    console.log('delegate_user1', delegate_user);
    let textarea: any = document.getElementById("myTextarea");
    if(delegate_user.event_notes){
      textarea.disabled=true;
      this.toastr.error('This delegate have already event notes');
    }else{
      this.noteForm.controls.fullname.setValue(delegate_user.fullname);
      textarea.disabled=false;
      this.selectedDelegate = delegate_user;
    }
  }


  /* add note save */
  saveNote() {
    if(this.noteForm.controls.fullname.value){
      this.env.loaderText = 'Adding note ...';
      this.env.spinner.show(this.env.loaderSpinner);
      let formData = new FormData();
        formData.append('event_id', this.selectedDelegate.event_delegateevent_id);
        formData.append('meeting_schedule_id', this.selectedDelegate.meeting_schedule);
        formData.append('delegate1', this.event_delegate_id);
        formData.append('delegate2', this.selectedDelegate.event_delegateid);
        formData.append('note', this.noteForm.controls.note.value);
        this.request.post(Urls.mapi_notes_save, formData).then(response => {
        this.env.spinner.hide(this.env.loaderSpinner);
        if (response.error == 0 || this.selectedDelegate.meeting_schedule == null) {
          this.save_note = response['error'];
          this.noteForm.reset();
          this.modal.close('addNoteModal');
          this.toastr.success(response.message);
          this.getNoteList();
          this.getDelegateList();
        } else {
          this.modal.close('addNoteModal');
          this.toastr.error(response.message);
        }
      })
    }else{
      this.toastr.error('Please select first delegate!');
    }
  }

  closeSendNoteModal(){
    this.modal.close('sendToMyEmail');
    this.getNoteList();
  }
  
  openSendNoteModal(data){
    let obj = {
      data : data
    }
    this.modal.setModalData(obj, 'sendToMyEmail');
  
    this.modal.open('sendToMyEmail');
  }

  note_data: any;
  note_content: any;
  getData(){
    this.note_data = this.modal.getModalData('sendToMyEmail');
    this.note_content = this.allowNewLine(this.note_data.data.note);
    // this.note_content = this.note_data.data.note;

    console.log('ck note content', this.note_content);
  }

  reset(){
    this.modal.resetModalData('sendToMyEmail')
  }

  
  /* edit note */
  editNote(field, type){
    if(type == 'edit'){
      if(field == 'note'){
        this.showEditNote = true;
      }
    }else{
      if(field == 'note'){
        this.showEditNote = false;
        // this.env.loaderText = 'Saving delegates note ...';
        this.saveEditNote();
      }
    }
 }

  /* update note */
  saveEditNote(){
  //  if(this.note_data.data.note == null){
    this.env.loaderText = 'Updating note ...';
    this.env.spinner.show(this.env.loaderSpinner);
    let formData = new FormData();
      formData.append('id', this.note_data.data.id);
      formData.append('delegate1', this.note_data.data.delegate_id1);
      formData.append('delegate2', this.note_data.data.delegate_id2);
      formData.append('meeting_schedule_id', this.note_data.data.meeting_schedule_id);
      formData.append('event_id', this.note_data.data.event_id);
      formData.append('note', this.note_content);

    this.request.post(Urls.mapi_notes_save, formData).then(response=>{
      this.env.spinner.hide(this.env.loaderSpinner);
      if(response.error == 0){
        localStorage.setItem('note', JSON.stringify(this.note_data));
        this.save = response['error']
        this.modal.close('sendToMyEmail');
        this.getNoteList()
        this.toastr.success(response.message);
      }else{
        this.modal.close('sendToMyEmail');
        this.toastr.error(response.message);
        this.getNoteList();
      }
    });
  //  }else{
  //   this.getNoteList();
  //   this.modal.close('sendToMyEmail');
  //   this.toastr.error('Please enter notes');
  //  }
  }

  /* send note myemail */
  sendNoteToMyEmail(email_type){
    this.myemail = email_type;
    if(this.myemail){
      this.meeting_with_email = 'no';
    }
    this.env.loaderText = 'Sending note to my email ...';
    this.env.spinner.show(this.env.loaderSpinner);
    let formData = new FormData();
      formData.append('note_id', this.note_data.data.id);
      formData.append('event_id', this.note_data.data.event_id);
      formData.append('myemail', this.myemail);
      formData.append('meeting_with_email', this.meeting_with_email);
    this.request.post(Urls.mapi_notes_sendtoemail, formData).then(response => {
      this.env.spinner.hide(this.env.loaderSpinner);
      if(response.error == 0){
        this.modal.close('sendToMyEmail');
        this.toastr.success('Your note has been sent to your email');
      }else{
        this.toastr.error(response.message);
      }
    })
  }

/* send note email other delegate */
  sendToOtherDelegate(email_type){
    this.meeting_with_email = email_type;
    if(this.meeting_with_email){
      this.myemail = 'no';
    }
    this.env.loaderText = 'Sending note this delegate email ...';
    this.env.spinner.show(this.env.loaderSpinner);
    let formData = new FormData();
      formData.append('note_id', this.note_data.data.id);
      formData.append('event_id', this.note_data.data.event_id);
      formData.append('myemail', this.myemail);
      formData.append('meeting_with_email', this.meeting_with_email);
    
    this.request.post(Urls.mapi_notes_sendtoemail, formData).then(response => {
      this.env.spinner.hide(this.env.loaderSpinner);
      if(response.error == 0){
        this.modal.close('sendToMyEmail');
        this.toastr.success('Your note has been sent to ' + (this.note_data.data.d_fullname) +'.');
      }else{
        this.toastr.error(response.message);
      }
    })
  }

  resetEmailType(){
    this.myemail = null;
    this.meeting_with_email = null;
  }

  /* remove note delegate  modal*/
  removeNote(){
    this.env.loaderText = 'Removing notes ...';
    this.env.spinner.show(this.env.loaderSpinner);
    let formData = new FormData();
      formData.append('note_id', this.note_data.data.id);

    this.request.post(Urls.mapi_notes_delete, formData).then(response => {
      this.env.spinner.hide(this.env.loaderSpinner);
      if(response.error == 0){
        this.modal.close('sendToMyEmail');
        this.modal.close('removeNoteModal');
        this.getNoteList();
        this.toastr.success('Delegate note has been deleted');
      }else{
        this.toastr.error(response.message);
      }
    })
  }

  /* confirmation for remove in send note */
  confirmationModal(){
    this.modal.open('removeNoteModal');
  }

  closeConfirmationModal(){
    this.modal.close('removeNoteModal');
  }


  /* remove note list */
  removeNoteList(){
    this.env.loaderText = 'Removing note ...';
    this.env.spinner.show(this.env.loaderSpinner);
    let formData = new FormData();
      formData.append('note_id', this.removeNoteID.id);

    this.request.post(Urls.mapi_notes_delete, formData).then(response => {
      this.env.spinner.hide(this.env.loaderSpinner);
      if(response.error == 0){
        this.getNoteList();
        this.modal.close('removeNoteListModal');
        this.toastr.success('Delegate note has been deleted');
      }else{
        this.toastr.error(response.message);
      }
    })
  }


    /* confirmation for remove in removenotelist */
    confirmationListModal(data){
      console.log('data', data);
      this.modal.setModalData(data, 'removeNoteListModal');
      this.modal.open('removeNoteListModal');
    }
  
    closeConfirmationListModal(){
      this.modal.close('removeNoteListModal');
    }

    getNoteID(){
      this.removeNoteID = this.modal.getModalData('removeNoteListModal')
      console.log('removeNoteID', this.removeNoteID);
    }

    resetGetNoteID(){
      this.modal.resetModalData('removeNoteListModal');
    }
  

  /* send to myemail list */
  sendNoteToMyEmailList(note_id, email_type){
    this.myemail = email_type;
    if(this.myemail){
      this.meeting_with_email = 'no';
    }
    this.env.loaderText = 'Sending note to my email ...';
    this.env.spinner.show(this.env.loaderSpinner);
    let formData = new FormData();
      formData.append('note_id', note_id);
      formData.append('event_id', this.event.event_id);
      formData.append('myemail', this.myemail);
      formData.append('meeting_with_email', this.meeting_with_email);
    this.request.post(Urls.mapi_notes_sendtoemail, formData).then(response => {
      this.env.spinner.hide(this.env.loaderSpinner);
      if(response.error == 0){
        this.modal.close('sendToMyEmail');
        this.toastr.success('Your note has been sent to your email');
      }else{
        this.toastr.error(response.message);
      }
    })
  }


  /* for hover in note list */
  hoverNote: any;
  showing: boolean = false;
  show(note, boolean){
    this.hoverNote = note 
    this.showing = boolean;
  }

}
