import { Component, Input, OnInit, ViewChild, ElementRef, ViewChildren, OnDestroy } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Urls } from 'src/app//lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { DebounceService } from 'src/app/debounce.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QueryList } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { CountryListService } from 'src/app/services/country_list.service';
import { environment } from 'src/app/lib/environment';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ScrollService } from 'src/app/services/scroll/scroll.service';


@Component({
  selector: 'app-find-delegates',
  templateUrl: './find-delegates.component.html',
  styleUrls: ['./find-delegates.component.scss']
})
export class FindDelegatesComponent implements OnInit {
  @ViewChildren('myLocation') myLocation: QueryList<MatCheckbox>;
  @ViewChild('myServices') myServices: QueryList<MatCheckbox>;
 

  subscribeSearch = new Subject<string>();
  subscribeSearchLocation = new Subject<string>();
  subscribeSearchServices = new Subject<string>();
  subscribeSearchSpecialization = new Subject<string>();

  noteForm: FormGroup;
  notes_limit = 100;
  notes_page = 1;
  notes: any;

  user: any;
  event: any;
  event_delegate: any;
  event_delegate_id: any;

  delegate_search_key: any = '';
  delegate_list: any = null;
  delegate_list_total_count = 0;
  delegate_list_total_page = 0;
  delegate_list_limit = 30;
  delegate_list_page = 1;
  delegate_list_page_array: any = null;
  delegate_list_isLoaded: boolean = false;

  services: any;
  selected_services: any = [];
  search_key_services: string = '';
  services_isLoaded: boolean = false;
  services_total_count = 0;

  specializations: any;
  selected_specialization: any = [];
  search_key_specializations: string = '';
  specializations_isLoaded: boolean = false;
  specializations_total_count = 0;
  
  countries: any;
  selected_countries: any = [];
  search_key_countries: string = '';
  countries_isLoaded: boolean = false;
  countries_total_count = 0;

  constructor(
    public modal: NgxSmartModalService,
    public request: RequestsService,
    public fb: FormBuilder,
    public debounce: DebounceService,
    public elementRef: ElementRef,
    public toastr: ToastrService,
    public country_service: CountryListService,
    public env: environment,
    private router: Router,
    private scroll: ScrollService
  ) {

    this.subscribeSearch.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(value => {
        this.delegate_list_isLoaded = false;
        this.delegate_list = null;
        this.delegate_list_total_count = 0;
        this.delegate_list_page = 1;
        this.getDelegateList();
    });
    
    this.subscribeSearchLocation.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(value => {
        this.countries_isLoaded = false;
        this.countries = null;
        this.getPreferencesContries();
    });
    
    this.subscribeSearchServices.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(value => {
        this.services_isLoaded = false;
        this.services = null;
        this.getPreferencesServices();
    });
    
    this.subscribeSearchSpecialization.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(value => {
        this.specializations_isLoaded = false;
        this.specializations = null;
        this.getPreferencesSpecializations();
    });

    this.noteForm = this.fb.group({
      fullname: [''],
      note: ['']
    });
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user_profile'));
    this.event = JSON.parse(localStorage.getItem('event'));
    this.event_delegate = JSON.parse(localStorage.getItem('event_delegate'));
    this.event_delegate_id = localStorage.getItem('event_delegate_id');
    
    if(this.event_delegate){
      console.log(this.event_delegate);    
      this.env.clockService.setDateTime(this.event_delegate).startTime();   
    }

    let filter_search = localStorage.getItem('filter_search');
    if(filter_search && filter_search != ''){
      this.delegate_search_key = filter_search;
    }  

    let selected_countries = JSON.parse(localStorage.getItem('filter_location'));
    if(selected_countries){
      this.selected_countries = selected_countries;
    }  
    
    let selected_services = JSON.parse(localStorage.getItem('filter_services'));
    if(selected_services){
      this.selected_services = selected_services;
    }  
    
    let selected_specialization = JSON.parse(localStorage.getItem('filter_specialization'));
    if(selected_specialization){
      this.selected_specialization = selected_specialization;
    }

    this.modal.getModal('findDelagatesScheduleMeeting').onAnyCloseEvent.subscribe(res => {
      let data = this.modal.getModalData('findDelagatesScheduleMeeting');
      console.log('return from findDelagatesScheduleMeeting', data);
      if(data){
        if(data.action == 'set_meeting_schedule'){
          let indexOf = this.delegate_list.findIndex(x => x.id == data.delegate_id);
          this.delegate_list[indexOf].meeting_schedule = true;   
        }
      }
    });

   
    this.getDelegateList();
    this.getSchedules();

  }

  ngAfterViewInit() {
  }

  searchDelegates($param){
    this.delegate_list_isLoaded = false;
    this.delegate_list = null;
    this.delegate_list_page = 1;
    this.getDelegateList();
  }

  getDelegateList(infiniteScroll?) {
    let url = Urls.api_delegates_get;
    url += '?event_id=' + this.event.event_id;
    url += '&app_delegate_id=' + this.user.id;
    url += '&limit=' + this.delegate_list_limit;
    url += '&page=' + this.delegate_list_page;
    
    if(this.delegate_search_key) {
      url += '&search=' + this.delegate_search_key;
    }

    if(this.selected_countries.length){
      let filter_location = JSON.stringify(this.selected_countries);
      url += '&filter_location=' + filter_location;
    }

    if(this.selected_services.length){
      let filter_services = "";
      this.selected_services.forEach(data => {
        filter_services += data.id + ',';
      });
      url += '&pref_services_ids=' + filter_services;
    }
    
    if(this.selected_specialization.length){
      let filter_specialization = "";
      this.selected_specialization.forEach(data => {
        filter_specialization += data.id + ',';
      });
      url += '&pref_specialization_ids=' + filter_specialization;
    }
    
    this.request.get(url).then(response => {
     this.delegate_list_isLoaded = true;

      if(response.error == 0){
        this.delegate_list_total_count = response['data']['total_count'];
        this.delegate_list_total_page = response['data']['total_page'];
        this.delegate_list_page_array = response['data']['pages'];

        if (!infiniteScroll || infiniteScroll === false){
          this.delegate_list = []; 
        }
        
        let _delIds = '';
        response['data']['datas'].forEach((data) => {
          this.delegate_list.push(data);
          let keyIndex = this.delegate_list.length - 1;
          _delIds += data.id + '-' + keyIndex + '_';
        });

        /** 
         * get the delegate's company from server return
         * and display the all meeting count with the same 
         * company
        */

        let url = Urls.mapi_meetingsched_samecompany;
        url += '?delegate_ids=' + _delIds;
        url += '&event_id=' + this.event.event_id;
        this.request.get(url).then(response => {
          if(response){
            response.data.forEach(val => {
              let delegatesId = parseInt(this.delegate_list[val.keyIndex].id);
              let _delegatesId = parseInt(val.delegate_id);
              if(delegatesId === _delegatesId){
                this.delegate_list[val.keyIndex].same_company_meeting_count = val.totalcount;
              }
            });
          }
        });
        
        console.log('delega_list', this.delegate_list);

      }else{
        this.delegate_list = [];
        this.delegate_list_total_count = 0;
        this.delegate_list_total_page = 0;
      }
    }).finally(()=>{
      setTimeout(() => {
        this.scroll.updateScroll(document.getElementById('scroll_top'))
      }, 1000);
    });
  }
  
  setPage(page) {
    this.delegate_list = null;
    this.delegate_list_total_count = 0;
    this.delegate_list_isLoaded = false;
    this.delegate_list_page = page;
    this.getDelegateList();
  }

  prevPage() {
    this.delegate_list = null;
    this.delegate_list_total_count = 0;
    this.delegate_list_isLoaded = false;
    if(this.delegate_list_page <= this.delegate_list_total_page) {
      this.delegate_list_page--;
      this.getDelegateList();
    }
  }

  nextPage() {
    this.delegate_list = null;
    this.delegate_list_total_count = 0;
    this.delegate_list_isLoaded = false;
    if(this.delegate_list_page < this.delegate_list_total_page) {
      this.delegate_list_page++;
      this.getDelegateList();
    }
  }

  /* Start of Load Filter Services */
  getPreferencesServices(){
    let url = Urls.api_preferences_get;
    url += '?pref=' + 'services';
    url += '&limit=' + '500';
    if(this.search_key_services != ''){
      url += '&search=' + this.search_key_services;
    }
    this.request.get(url).then( data=>{
      this.services_isLoaded = true;
      if(data.error == 0){
        this.services_total_count = data.data.total_count;
        this.services = data.data.datas;
        if(this.selected_services){
          console.log('selected_services', this.selected_services);
          this.selected_services.forEach((val, key) => {
            this.services.forEach((res, idk) => {
              if(val.id == res.id){
                res.checked = true;
              }
            });
          });
        }
      }
    })
  }

  searchServices($param){
    this.search_key_services = $param;
    this.services = null;
    this.services_isLoaded = false;
    this.getPreferencesServices();
  }

  selectServices(val, e){
    this.services.forEach((data, key) => {
      if(val.id == data.id){
        data.checked = e;
      }
    });
    if(this.selected_services){
      if(e){
        this.selected_services.push(val);
      }else{
        let indexOf = this.selected_services.findIndex(x => x.id == val.id);
        this.selected_services.splice(indexOf, 1);
      }
    }else{
      this.selected_services = [];
      this.selected_services.push(val);
    }
  }
  /* End of Load Filter Services */

  /* ------------------------------------------------------ */

  /* Start of Load Filter Specialization */
  getPreferencesSpecializations(){
    let url = Urls.api_preferences_get;
    url += '?pref=' + 'specializations';
    url += '&limit=' + '500';
    if(this.search_key_specializations != ''){
      url += '&search=' + this.search_key_specializations;
    }
    this.request.get(url).then( data=>{
      this.specializations_isLoaded = true;
      if(data.error == 0){
        this.specializations_total_count = data.data.total_count;
        this.specializations = data.data.datas;
        if(this.selected_specialization){
          console.log('selected_specialization', this.selected_specialization);
          this.selected_specialization.forEach((val, key) => {
            this.specializations.forEach((res, idk) => {
              if(val.id == res.id){
                res.checked = true;
              }
            });
          });
        }
      }
    })
  }

  searchSpecialization($param){
    this.search_key_specializations = $param;
    this.specializations = null;
    this.specializations_isLoaded = false;
    this.getPreferencesSpecializations();
  }

  selectSpecialization(val, e){
    this.specializations.forEach((data, key) => {
      if(val.id == data.id){
        data.checked = e;
      }
    });
    if(this.selected_specialization){
      if(e){
        this.selected_specialization.push(val);
      }else{
        let indexOf = this.selected_specialization.findIndex(x => x.id == val.id);
        this.selected_specialization.splice(indexOf, 1);
      }
    }else{
      this.selected_specialization = [];
      this.selected_specialization.push(val);
    }
  }
  /* End of Load Filter Specialization */
  
  /* ------------------------------------------------------ */

  /* Start of Load Filter Countries */
  searchCountries($param){
    this.search_key_countries = $param;
    this.countries = null;
    this.countries_isLoaded = false;
    this.getPreferencesContries();
  }

  getPreferencesContries(){
    let url = Urls.api_preferences_get;
    url += '?pref=' + 'countries';
    url += '&limit=' + '500';
    if(this.search_key_countries != ''){
      url += '&search=' + this.search_key_countries;
    }
    this.request.get(url).then( data=>{
      this.countries_isLoaded = true;
      if(data.error == 0){
        this.countries_total_count = data.data.total_count;
        this.countries = data.data.datas;
        if(this.selected_countries){
          console.log('selected_countries', this.selected_countries);
          this.selected_countries.forEach((val, key) => {
            this.countries.forEach((res, idk) => {
              if(val.id == res.id){
                res.checked = true;
              }
            });
          });
        }
      }
    });
  }

  selectCountries(val, e){
    this.countries.forEach((data, key) => {
      if(val.id == data.id){
        data.checked = e;
      }
    });
    if(this.selected_countries){
      if(e){
        this.selected_countries.push(val);
      }else{
        let indexOf = this.selected_countries.findIndex(x => x.id == val.id);
        this.selected_countries.splice(indexOf, 1);
      }
    }else{
      this.selected_countries = [];
      this.selected_countries.push(val);
    }
  }
  /* End of Load Filter Countries */


  /* Start of Filter Location Modal */
  openFilterLocation() {
    this.search_key_countries = '';
    this.getPreferencesContries();
    this.modal.open('filterLocationModal');
  }

  closeFilterLocation() {
    this.search_key_countries = '';
    this.getPreferencesContries();
    this.modal.close('filterLocationModal');
  }

  applyFilterLocation() {
    this.search_key_countries = '';
    this.modal.close('filterLocationModal');
    this.getNewDelegateList();
  }

  resetFilterLocation() {
    localStorage.removeItem('filter_location');
    this.search_key_countries = '';
    this.selected_countries = [];
    this.countries.forEach(reset => {
      if(reset.checked) {
        reset.checked = false;
      }
    });

    this.modal.close('filterLocationModal');
    this.getNewDelegateList();
  }
  /* End of Filter Location Modal */
  
  /* ------------------------------------------------------ */

  /* Start of Filter Services Modal */
  openFilterServices() {
    this.search_key_services = '';
    this.getPreferencesServices();
    this.modal.open('filterServicesModal');
  }

  closeFilterServices() {
    this.search_key_services = '';
    this.getPreferencesServices();
    this.modal.close('filterServicesModal');
  } 

  applyFilterServices() {
    this.search_key_services = '';
    this.modal.close('filterServicesModal');
    this.getNewDelegateList();
  }

  resetFilterServices() {
    localStorage.removeItem('filter_services');
    this.search_key_services = '';
    this.selected_services = [];
    this.services.forEach(reset => {
      if(reset.checked) {
        reset.checked = false;
      }
    });
    this.modal.close('filterServicesModal');
    this.getNewDelegateList();
  }
  /* End of Filter Services Modal */

  /* ------------------------------------------------------ */

  /* Start of Filter Specialization Modal */
  openFilterSpecializations() {
    this.search_key_specializations = '';
    this.getPreferencesSpecializations();
    this.modal.open('filterSpecializationModal');
  }

  closeFilterSpecializations() {
    this.search_key_specializations = '';
    this.getPreferencesSpecializations();
    this.modal.close('filterSpecializationModal');
  }
  
  applyFilterSpecializations() {
    this.search_key_specializations = '';
    this.modal.close('filterSpecializationModal');
    this.getNewDelegateList();
  }

  resetFilterSpecializations() {
    localStorage.removeItem('filter_specialization');
    this.search_key_specializations = '';
    this.selected_specialization = [];
    this.specializations.forEach(reset => {
      if(reset.checked) {
        reset.checked = false;
      }
    });
    this.modal.close('filterSpecializationModal');
  }
  /* End of Filter Specialization Modal */

  getNewDelegateList(){
    this.delegate_list_isLoaded = false;
    this.delegate_list = null;
    this.delegate_list_total_count = 0;
    this.delegate_list_page = 1;
    this.getDelegateList();
  }

  resetFilters() {
    this.delegate_search_key = '';

    this.selected_countries = [];
    if(this.countries){
      this.countries.forEach(reset => {
        if(reset.checked) {
          reset.checked = false;
        }
      });
    }

    this.selected_services = [];
    if(this.services){
      this.services.forEach(reset => {
        if(reset.checked) {
          reset.checked = false;
        }
      });
    }

    this.selected_specialization = [];
    if(this.specializations){
      this.specializations.forEach(reset => {
        if(reset.checked) {
          reset.checked = false;
        }
      });
    }

    localStorage.removeItem('filter_search');
    localStorage.removeItem('filter_location');
    localStorage.removeItem('filter_services');
    localStorage.removeItem('filter_specialization');

    this.getNewDelegateList();
  }

  gotoDelegateProfile(delegate){
    localStorage.setItem('selected_delegate_profile', JSON.stringify(delegate));
    if(this.delegate_search_key && this.delegate_search_key != ''){
      localStorage.setItem('filter_search', this.delegate_search_key);
    }
    if(this.selected_countries.length > 0){
      localStorage.setItem('filter_location', JSON.stringify(this.selected_countries));
    }
    if(this.selected_services.length > 0){
      localStorage.setItem('filter_services', JSON.stringify(this.selected_services));
    }
    if(this.selected_specialization.length > 0){
      localStorage.setItem('filter_specialization', JSON.stringify(this.selected_specialization));
    }
    this.env.router.navigate(['/delegates-profile/'+ delegate.id]);
  }

  
  /*
  * For find delegate tab
  * Get Meeting Schedule
  */
  schedules: any;
  getSchedules() {
    let url = Urls.mapi_event_schedule;
    url += '?event_id=' + this.event.id;

    this.request.get(url).then(data => {
      if (data.error == 0) {
        this.schedules = data.data;
        localStorage.setItem('event_schedules', JSON.stringify(this.schedules));
      }
    })
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
      delegate: delegate,
      event_delegate_id: this.event_delegate.delegate.id
    }

    console.log('obj', obj)
    this.modal.resetModalData('imageCropperModal');
    this.modal.setModalData(obj, 'findDelagatesScheduleMeeting');
    this.modal.open('findDelagatesScheduleMeeting');
  }

  selectedDelegate: any;
  setDelegate(delegate_user) {
    console.log('delegate_user', delegate_user);
    let textarea: any = document.getElementById("myTextarea");
    this.noteForm.controls.fullname.setValue(delegate_user.fullname);
    console.log('selectedDelegate', this.selectedDelegate);
    if(delegate_user.event_notes){
      textarea.disabled=true;
      this.toastr.error('This delegate have already event notes');
    }else{
      textarea.disabled=false;
      this.selectedDelegate = delegate_user;
    }
  }

  save_note: any;
  note: any;
  getData() {
    this.note = this.modal.getModalData('addNoteModal');
    this.note_content = this.allowNewLine(this.note.fullname);
    // this.noteForm.controls.fullname.setValue(this.note.fullname);
    // if(!this.note.meeting_schedule){
    //   this.toastr.error('This delegate do not have a schedule meeting');
    //   this.noteForm.controls.note.disable();
    // }else{
    //   this.noteForm.controls.note.enable();
    // }
  }  
  
  // Sprint 2
  addNewNote(data) {
    this.modal.setModalData(data, 'addNoteModal');
    console.log('data', data)
    this.modal.open('addNoteModal');
  }

  closeAddNote() {
    this.modal.close('addNoteModal');
  }

  reset() {
    this.modal.resetModalData('addNoteModal');
  }

  saveNote() {
    this.env.loaderText = 'Adding note ...';
    this.env.spinner.show(this.env.loaderSpinner);
    let formData = new FormData();
    formData.append('event_id', this.note.event_delegateevent_id);
    formData.append('meeting_schedule_id', this.note.meeting_schedule);
    formData.append('delegate1', this.event_delegate_id);
    formData.append('delegate2', this.note.event_delegateid);
    // formData.append('id', this.note.id)
    formData.append('note', this.noteForm.controls.note.value);
    this.request.post(Urls.mapi_notes_save, formData).then(response => {
      this.env.spinner.hide(this.env.loaderSpinner);
      if (response.error == 0) {
        this.save_note = response['error'];
        this.modal.close('addNoteModal');
        this.noteForm.reset();
        this.getDelegateList();
        this.toastr.success(response.message)
      } else {
        this.modal.close('addNoteModal');
        this.noteForm.reset();
        this.toastr.error(response.message)
      }
    })
  }

  viewNewNote(viewNote){
    console.log('viewNote', viewNote);
    this.modal.setModalData(viewNote, 'viewNoteModal')
    this.modal.open('viewNoteModal');
    this.getNoteList();
  }

  viewNoteID: any;
  getDataViewNote(){
   this.viewNoteID = this.modal.getModalData('viewNoteModal');
   console.log('viewNoteID', this.viewNoteID);
  }

  closeViewNoteModal(){
    this.modal.close('viewNoteModal')
  }

  resetDataViewNote(){
    this.modal.resetModalData('viewNoteModal');
  }

  allowNewLine(text){
    //console.log('texttext', text);
    text = text.replace(/\<br \/\>/g, "");
    return text = text.replace(/\<br \/\>/g, "\n");
    // return text.replace(/\r\n|\r|\n/g, "");
  }

  /* note listed */
  note_content: any
  getNoteList(){
    let url = Urls.mapi_event_note;
    url += '?note_id=' + this.viewNoteID.event_notes;
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
        this.env.loaderText = 'Updating delegates note ...';
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
        localStorage.setItem('note', JSON.stringify(this.notes));
        this.save = response['error']
        this.modal.close('viewNoteModal');
        this.toastr.success(response.message);
      }else{
        this.toastr.error(response.message);
      }
    });
  }
  openMessages(delegate){
    console.log('delegate: ', delegate)
    
    localStorage.setItem('delegate_message', JSON.stringify(delegate));
    this.router.navigate(['/messaging'])
  }
}