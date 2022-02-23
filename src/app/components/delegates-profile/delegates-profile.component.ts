import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Urls } from 'src/app//lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { disableDebugTools } from '@angular/platform-browser';
import { environment } from 'src/app/lib/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-delegates-profile',
  templateUrl: './delegates-profile.component.html',
  styleUrls: ['./delegates-profile.component.scss']
})
export class DelegatesProfileComponent implements OnInit {
  noteForm: FormGroup;
  save_note: any;

  other_delegate_company : any;
  other_delegate_company_total_count = 0;
  other_delegate_company_total_page = 0;
  other_delegate_company_limit = 10;
  other_delegate_company_page = 1;
  isLoaded: boolean = false;

  isProfileLoading: boolean = false;

  user: any;
  delegate_id: any;
  delegate: any;
  event_id: any;
  event: any;
  selectedDelegateProfile: any;
  event_delegate: any;

  delegate_schedule: any = null;
  delegate_schedule_date: any = null;
  delegate_schedule_isLoaded: boolean = false;
  delegate_schedule_isEmpty: boolean = false;

  delegate_list: any = null;
  delegate_list_total_count = 0;
  delegate_list_total_page = 0;
  delegate_list_limit = 10;
  delegate_list_page = 1;
  delegate_list_isLoaded: boolean = false;
  event_delegate_id: any;
  @ViewChild('widgetsContent', { read: ElementRef }) public widgetsContent: ElementRef<any>;

  constructor(
    private request: RequestsService,
    private route: ActivatedRoute,
    private env: environment,
    private toastr: ToastrService,
    public modal: NgxSmartModalService,
    public fb: FormBuilder,
    private router: Router
  ) { 

    this.noteForm = this.fb.group({
      fullname: [''],
      note: ['']
    });


    this.user = JSON.parse(localStorage.getItem('user_profile'));
    this.event = JSON.parse(localStorage.getItem('event'));
    console.log('eventsdsad', this.event);
  }

 

  ngOnInit(): void {
    this.delegate_id = this.route.snapshot.paramMap.get('id');
    this.selectedDelegateProfile = JSON.parse(localStorage.getItem('selected_delegate_profile'));
    this.event_delegate_id = localStorage.getItem('event_delegate_id');
    this.event_delegate = JSON.parse(localStorage.getItem('event_delegate'));
    console.log('this.event_delegate', this.event_delegate);
    this.event = JSON.parse(localStorage.getItem('event'));
    this.getDelegateProfile();
    this.getMySchedule();
    this.getDelegateList();
  }

  scrollRight(){
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 400), behavior: 'smooth' });
  }

  scrollLeft() {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 400), behavior: 'smooth' });
  }
  
  // Sprint 2
  addNewNote(data) {
    console.log('data', data);
    this.modal.setModalData(data,'addNoteModal');
    this.modal.open('addNoteModal');
  }

  note_data: any;
  getData(){
    this.note_data = this.modal.getModalData('addNoteModal');
    this.noteForm.controls.fullname.setValue(this.note_data.fullname);
    if(this.note_data.event_notes){
      this.toastr.error('This delegate have already event notes');
    }else{
      console.log('sdsad', this.note_data);
    }
  }

  reset() {
    this.modal.resetModalData('addNoteModal');
  }

  closeAddNote(){
    this.modal.close('addNoteModal');
  }


  allowNewLine(text){
    //console.log('texttext', text);
    text = text.replace(/\<br \/\>/g, "");
    return text = text.replace(/\<br \/\>/g, "\n");
    // return text.replace(/\r\n|\r|\n/g, "");
  }

  saveNote(){
    this.env.loaderText = 'Adding note ...';
    this.env.spinner.show(this.env.loaderSpinner);
    let formData = new FormData();
    formData.append('event_id', this.event.event_id);
    formData.append('meeting_schedule_id', this.note_data.meeting_schedule);
    formData.append('delegate1', this.event_delegate_id);
    formData.append('delegate2', this.note_data.ed_id);
    // formData.append('id', this.note.id)
    formData.append('note', this.noteForm.controls.note.value);
    this.request.post(Urls.mapi_notes_save, formData).then(response => {
      this.env.spinner.hide(this.env.loaderSpinner);
      if (response.error == 0) {
        this.save_note = response['error'];
        this.selectedDelegateProfile.event_notes = response.notes_id ? response.notes_id : null;
        // this.selectedDelegateProfile = JSON.parse(localStorage.getItem('selected_delegate_profile'));
        this.getDelegateProfile();
        // this.router.navigate(['/find-delegates']);
        this.modal.close('addNoteModal');
        this.noteForm.reset();
        this.toastr.success(response.message)
      } else {
        this.modal.close('addNoteModal');
        this.noteForm.reset();
        this.toastr.error(response.message)
      }
    })
  }

  /* for view note */
  viewNewNote(selectedDelegateProfile){
    console.log('selectedDelegateProfile', selectedDelegateProfile);
    this.modal.setModalData(selectedDelegateProfile, 'viewNoteModal');
    this.modal.open('viewNoteModal');
    this.getNoteList();
  }

  viewDelegateNote: any;
  getDataViewNote(){
    this.viewDelegateNote = this.modal.getModalData('viewNoteModal');
    this.note_content = this.allowNewLine(this.notes.note);
    console.log('viewDelegateNote', this.viewDelegateNote);
  }

  notes: any;
  note_content: any;
  /* note listed */
  getNoteList(){
    let url = Urls.mapi_event_note;
    url += '?note_id=' + this.viewDelegateNote.event_notes;
    this.request.get(url).then(response => {
      if(response.error == 0){
        this.notes = response['data'];
        this.note_content = this.allowNewLine(this.notes.note);
        console.log('notes ni pos', this.notes);
      }
    })
  }

  showEditNote: boolean = false;
  /* edit note */
  editNote(field, type){
    if(type == 'edit'){
      if(field == 'note'){
        this.showEditNote = true;
      }
    }else{
      if(field == 'note'){
        this.showEditNote = false;
        // this.env.loaderText = 'Updating delegates note ...';
        this.saveEditNote();
      }
    }
  }

  save: any;
  /* update note */
  saveEditNote(){
    this.env.loaderText = 'Updating note ...';
    this.env.spinner.show(this.env.loaderSpinner);
    let formData = new FormData();
      formData.append('id', this.notes.id);
      formData.append('delegate1', this.notes.delegate_id1);
      formData.append('delegate2', this.notes.delegate_id2);
      formData.append('meeting_schedule_id', this.notes.meeting_schedule_id);
      formData.append('event_id', this.notes.event_id);
      formData.append('note', this.note_content);

    this.request.post(Urls.mapi_notes_save, formData).then(response=>{
      this.env.spinner.hide(this.env.loaderSpinner);
      if(response.error == 0){
        this.save = response['error']
        this.modal.close('viewNoteModal');
        this.toastr.success(response.message);
      }else{
        this.toastr.error(response.message);
      }
    });
  }

  closeViewNoteModal(){
    this.modal.close('viewNoteModal');
  }


  goBack(){
    // localStorage.removeItem('selected_delegate_profile');
    this.env.router.navigate(['/find-delegates']);
  }

  getDelegateProfile(){
    this.isProfileLoading = true;
    let url = Urls.api_delegates_get;
    url += '?by=id';
    url += '&isApp=true';
    url += '&event_id=' + this.event.event_id;
    url += '&delegate=' + this.route.snapshot.paramMap.get('id');
    this.request.get(url).then(response => {

      if(response.error == 0){
        this.delegate = response['data'];
        //console.log('delegate', this.delegate);
      }
    }).finally(()=>{
      this.isProfileLoading = false;
      this.getOtherDelegateCompany();
    });
  }

  getOtherDelegateCompany(infiniteScroll?){
    let url = Urls.api_delegates_get;
    url += '?id=' + this.delegate.id
    url += '&byParam=company_id';
    url += '&valParam=' + this.delegate.company_id
    url += '&page='+ this.other_delegate_company_page;
    url += '&limit='+ this.other_delegate_company_limit;
    this.request.get(url).then(response => {
      this.isLoaded = true;

      if(response.error == 0){
        this.other_delegate_company_total_count = response['data']['total_count'];
        this.other_delegate_company_total_page = response['data']['total_page']

        if (!infiniteScroll || infiniteScroll === false){
          this.other_delegate_company = []; 
        }
        
        response['data']['datas'].forEach((data) => {
          this.other_delegate_company.push(data);
        });
        
        console.log('otherDelegateCompany', this.other_delegate_company);

      }else{
        this.other_delegate_company = [];
        this.other_delegate_company_total_count = 0;
        this.other_delegate_company_total_page = 0;
      }
    })
  }

  onScroll(e: any){
    console.log(this.other_delegate_company_total_page);
    console.log(this.other_delegate_company_page);

    if(this.other_delegate_company_total_page > this.other_delegate_company_page){
      this.other_delegate_company_page++;
      this.getOtherDelegateCompany(true);
    }
  } 

  getMySchedule(){
    let url = Urls.mapi_delegate_meetingschedule;
    if(this.delegate_id){
      url += '?delegate=' + this.delegate_id;
    }

    if(this.event){
      url += '&event=' + this.event.id;
    }

    this.request.get(url).then(response =>{
      this.delegate_schedule_isLoaded = true;
      if(response.error == 0){
        this.delegate_schedule = response['data'];
        this.delegate_schedule_date = response['data'].days;
        console.log('delegate_schedule', this.delegate_schedule);
    console.log('delegate_schedule_date', this.delegate_schedule_date);

        let schedule_count = 0;
        this.delegate_schedule_date.forEach(data => {
          if(data.schedules.length){
            schedule_count++;
          }
        });
        if(!schedule_count){
          this.delegate_schedule_isEmpty = true;
        }
      }
    });
  }

  getDaysMili(miliisecond){
    let _date = new Date(miliisecond);
    let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayNames[_date.getDay()];
  }

  getDelegateList(infiniteScroll?) {
    let url = Urls.api_delegates_get;
    url += '?event_id=' + this.event.event_id;
    url += '&app_delegate_id=' + this.user.id;
    url += '&limit=' + this.delegate_list_limit;
    url += '&page=' + this.delegate_list_page;
    this.request.get(url).then(response => {
     this.delegate_list_isLoaded = true;

      if(response.error == 0){
        this.delegate_list_total_count = response['data']['total_count'];
        this.delegate_list_total_page = response['data']['total_page']

        if (!infiniteScroll || infiniteScroll === false){
          this.delegate_list = []; 
        }
        
        response['data']['datas'].forEach((data) => {
          this.delegate_list.push(data);
        });
        
        console.log('delega_list', this.delegate_list);

      }else{
        this.delegate_list = [];
        this.delegate_list_total_count = 0;
        this.delegate_list_total_page = 0;
      }
    });
  }

  openMessaging(){
    localStorage.setItem('delegate_message', JSON.stringify(this.delegate));
    this.router.navigate(['/messaging'])
    // console.log('delegate: ', this.delegate);

  }

   /*
  * For find delegate tab
  * Set Meeting Schedule
  */

   scheduleDelegateMeeting(delegate) {
    console.log('delegate', delegate);
    delegate['ed_id'] = delegate.event_delegateid;
    
    let event_schedules = JSON.parse(localStorage.getItem('event_schedules'));
    
    let obj = {
      event_schedules: event_schedules,
      delegate: this.delegate,
      event_delegate_id: this.event_delegate.delegate.id
    }

    console.log('obj bago mag click', delegate)
    // this.modal.resetModalData('imageCropperModal');
    this.modal.setModalData(obj, 'findDelagatesScheduleMeeting');
    this.modal.open('findDelagatesScheduleMeeting');


  }

}