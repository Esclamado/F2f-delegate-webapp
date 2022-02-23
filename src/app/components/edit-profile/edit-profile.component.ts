import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router, RouterOutlet, NavigationExtras } from '@angular/router';
import { environment } from 'src/app/lib/environment';
import { Urls } from 'src/app//lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { datatable } from '../datatables/company';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  subscribeSearch = new Subject<string>();
  user: any;

  latitude: number;
  longitude: number;
  place: string;
  zoom: number;
  time_zone: string;
  changeUserTimezone: boolean = false;
  submitted = false;

  inCorrectPassword: boolean;
  old_password_type: string = 'password';
  new_password_type: string = 'password';
  confirm_password_type: string = 'password';
  password_matched: boolean;
  show = false;
  showNew = false;
  showConfirm = false;
  isSubmitPass: boolean = false;

  editProfileForm: FormGroup;
  changePasswordForm: FormGroup;

  constructor( 
    public fb: FormBuilder,
    public modal: NgxSmartModalService,
    private toast: ToastrService,
    private route: ActivatedRoute,
    private env: environment,
    private request: RequestsService
  ) 
  {
    let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.editProfileForm = this.fb.group({
      name: ['', Validators.compose([Validators.required, Validators.maxLength(70)])],
      email: ['', Validators.compose([Validators.required,Validators.maxLength(70),Validators.email,Validators.pattern(emailRegex)])],
      job_title: ['', Validators.compose([Validators.required])],
      mobile: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
      my_city: ['', Validators.compose([Validators.required])],
      timezone: ['', Validators.compose([Validators.required])]
    });

    this.changePasswordForm = this.fb.group({
      old_password: ['', Validators.compose([Validators.required])],
      new_password: ['', Validators.compose([Validators.required])],
      confirm_password: ['', Validators.compose([Validators.required])],
    });
    
    this.modal.getModal('imageCropperModal').onAnyCloseEvent.subscribe(data => {
      let imageCropperModal = this.modal.getModalData('imageCropperModal');
      console.log(imageCropperModal);
      if(imageCropperModal){
        if(imageCropperModal['type'] == 'profile'){
          if(imageCropperModal['croppedImage'] && imageCropperModal['profilePhoto']){
            this.croppedprofilePhoto = imageCropperModal['croppedImage'];
            this.user.profile_photo_url = this.croppedprofilePhoto;
            this.profilePhoto = imageCropperModal['profilePhoto'];
            this.user.profile_photo = this.profilePhoto;
            console.log('mobile: ', this.temp_number)
            this.user['mobile'] = this.temp_number ? this.temp_number : this.user.mobile;
            
            this.isProfilePhotoCropped =  true;
          }
        }else if(imageCropperModal['type'] == 'card'){
          if(imageCropperModal['croppedImage'] && imageCropperModal['profilePhoto']){
            this.croppedprofilePhotoCard = imageCropperModal['croppedImage'];
            this.user.businesscard_url = this.croppedprofilePhotoCard;
    
            this.profilePhotoCard = imageCropperModal['profilePhoto'];
            this.user.businesscard = this.profilePhotoCard;
            
            this.isProfilePhotoCroppedCard =  true;
          }
        }
      }
    });

    this.subscribeSearch.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(value => {
        this.isLoaded = false;
        this.contries = null;
        this.getCountries(true);
    });
  }
  
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user_profile'));
    if(this.user){
      this.editProfileForm.controls.name.setValue(this.user.fullname);
      this.editProfileForm.controls.email.setValue(this.user.email);
      this.editProfileForm.controls.job_title.setValue(this.user.job_title);
      this.editProfileForm.controls.mobile.setValue(this.user.mobile);
      this.editProfileForm.controls.my_city.setValue(this.user.address);
      this.editProfileForm.controls.timezone.setValue(this.user.timezone);
    }

    this.getServices();
    this.getSpecializations();
    this.getSoftwares();
    this.getCountries();
  }

  services: any;
  selected_services: any;
  services_total_count: any = 0;
  getServices(){
    this.selected_services = [];
    let url = Urls.api_preferences_get;
    url += '?pref=' + 'services';
    url += '&limit=' + '500';
    this.request.get(url).then( data=>{
      if(data.error == 0){
        this.services_total_count = data.data.total_count;
        this.services = data.data.datas;
        if(this.user.pref_services_ids_detail){
          this.services.forEach((data, key) => {
            this.user.pref_services_ids_detail.forEach((val, idk) => {
              if(data.id == val.id){
                this.selected_services.push(val);
                data.checked = true;
              }
            });
          });
        }
      }
    })
  }

  specializations: any;
  selected_specialization: any;
  specializations_total_count: any = 0;
  getSpecializations(){
    this.selected_specialization = [];
    let url = Urls.api_preferences_get;
    url += '?pref=' + 'specializations';
    url += '&limit=' + '500';
    this.request.get(url).then( data=>{
      if(data.error == 0){
        this.specializations_total_count = data.data.total_count;
        this.specializations = data.data.datas;
        if(this.user.pref_specialization_ids_detail){
          this.specializations.forEach((data, key) => {
            this.user.pref_specialization_ids_detail.forEach((val, idk) => {
              if(data.id == val.id){
                this.selected_specialization.push(val);
                data.checked = true;
              }
            });
          });
        }
      }
    })
  }
  
  contries: any;
  search_key_countries: string = '';
  isLoaded: boolean = false;
  selected_countries: any;
  countries_total_count: any = 0;
  searchCountries($param){
    this.search_key_countries = $param;
    this.contries = null;
    this.isLoaded = false;
    this.getCountries(true);
  }

  getCountries(searh?){
    if(!searh){
      this.selected_countries = [];
    }
    let url = Urls.api_preferences_get;
    url += '?pref=' + 'countries';
    url += '&limit=' + '500';
    if(this.search_key_countries != ''){
      url += '&search=' + this.search_key_countries;
    }
    this.request.get(url).then( data=>{
      this.isLoaded = true;
      if(data.error == 0){
        this.contries = data.data.datas;
        this.countries_total_count = data.data.total_count;

        if(this.user.pref_countries_ids_detail){
          this.contries.forEach((data, key) => {
            this.user.pref_countries_ids_detail.forEach((val, idk) => {
              if(data.id == val.id){
                this.selected_countries.push(val);
                data.checked = true;
              }
            });
          });
        }

        if(this.selected_countries){
          console.log('selected_countries', this.selected_countries);
          this.selected_countries.forEach((val, key) => {
            this.contries.forEach((res, idk) => {
              if(val.id == res.id){
                res.checked = true;
              }
            });
          });
        }
      }
    });
  }


  selected_softwares: any;
  select_all_software: boolean = false;
  selected_software_count: any = 0;
  softwares: any;
  softwares_total_count: any = 0;
  getSoftwares(){
    this.selected_softwares = [];
    let url = Urls.api_preferences_get;
    url += '?pref=' + 'softwares';
    url += '&limit=' + '500';
    this.request.get(url).then( data=>{
      if(data.error == 0){
        this.softwares = data.data.datas;
        this.softwares_total_count = data.data.total_count;
        if(this.user.pref_software_ids_detail){
          this.selected_software_count = this.user.pref_software_ids_detail.length;
          this.softwares.forEach((data, key) => {
            this.user.pref_software_ids_detail.forEach((val, idk) => {
              if(data.id == val.id){
                this.selected_softwares.push(val);
                data.checked = true;
              }
            });

            // this.select_all_software = false;
            // if(this.selected_software_count == this.softwares.total_count){
            //   this.select_all_software = true;
            // }
          });
        }
      }
    });
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

  selectCountries(val, e){
    this.contries.forEach((data, key) => {
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

  selectSoftwares(val, e){
    if(this.softwares){
      this.softwares.forEach((data, key) => {
        if(val.id == data.id){
          data.checked = e;
        }
      });
      if(this.selected_softwares){
        if(e){
          this.selected_software_count++;
          this.selected_softwares.push(val);
        }else{
          this.selected_software_count--;
          let indexOf = this.selected_softwares.findIndex(x => x.id == val.id);
          this.selected_softwares.splice(indexOf, 1);
        }
      }else{
        this.selected_software_count++;
        this.selected_softwares = [];
        this.selected_softwares.push(val);
      }
  
      this.select_all_software = false;
      if(this.selected_software_count == this.softwares.total_count){
        this.select_all_software = true;
      }
      console.log('count', this.selected_software_count);
    }
  }

  saveDelegateProfile(){
    this.submitted = true;
    this.user['mobile'] = this.temp_number;
    console.log('this.temp_number: ', this.temp_number)
    if(this.editProfileForm.controls.mobile.value == 0){
      this.toast.error('Invalid mobile number');
    }else{
      this.user.mobile = this.editProfileForm.controls.mobile.value;
      
      if(this.editProfileForm.valid){
        this.user.job_title = this.editProfileForm.controls.job_title.value;
        this.env.loaderText = 'Saving user profile ...';
        this.env.spinner.show(this.env.loaderSpinner);
        var formData = new FormData();
    
        let keys = Object.keys(this.user);
        for (var i = keys.length - 1; i >= 0; i--) {
          let key = keys[i];
    
          let toAppend = this.user[key];
          if(
            key == 'social_media_links' ||
            key == 'pref_software_ids' ||
            key == 'pref_sector_ids' ||
            key == 'pref_countries_ids' ||
            key == 'pref_specialization_ids' ||
            key == 'pref_services_ids' ||
            key == 'pref_network_ids'
          ){
            toAppend = JSON.stringify(this.user[key]);
          }
          formData.append(key, toAppend);
        }
      
        this.request.post(Urls.api_delegates_save, formData).then(response=>{
            this.env.spinner.hide(this.env.loaderSpinner);
          if(response.error == 0){
            localStorage.setItem('user_profile', JSON.stringify(this.user));
            window.location.reload();
            this.toast.success('Personal preferences updated!')
          }
        });
      }else{
        this.toast.error('Please check the required field!');
      }
    }
  }
  same_old_new_pass: boolean = false;
  checkIfSame(){
    let x = this.changePasswordForm.value.new_password.trim();
    let y = this.changePasswordForm.value.confirm_password.trim();
    let z = this.changePasswordForm.value.old_password.trim();
    console.log('same: ', x,z)
    if(x && y){
      if(x==y){
        this.password_matched = true;
      }else{
        this.password_matched = false;
      }
    }
    if(x==z){
      this.same_old_new_pass = true;
    }else{
      this.same_old_new_pass = false;
    }
  }

  savePassword(){
    this.isSubmitPass = true;
    if(this.changePasswordForm.valid){
      if(this.same_old_new_pass){
        this.toast.error('Old password and new password should not be the same');
      }else{
        this.env.loaderText = 'Changing password ...';
        this.env.spinner.show(this.env.loaderSpinner);
    
        let formData = new FormData();
        console.log('formData', formData);
        formData.append('email', this.user.email);
        formData.append('password', this.changePasswordForm.controls.old_password.value);
    
        this.request.post(Urls.mapi_delegate_checkpassword, formData).then(data => {
        this.env.spinner.hide(this.env.loaderSpinner);
        if(data.error == 0){
            this.changePassword();
          }else{
            this.toast.error('Old password is wrong!');
          }
        });
      }
    }
  }

  changePassword(){

    let formData = new FormData();
    formData.append('newpassword', this.changePasswordForm.controls.new_password.value.toString());
    formData.append('confirmnewpassword', this.changePasswordForm.controls.confirm_password.value.toString());
    formData.append('id', this.user.id);

    this.request.post(Urls.mapi_delegate_changepass, formData).then(data=>{
      this.env.spinner.hide(this.env.loaderSpinner);
      if(data.error == 0){
        this.isSubmitPass = false;
        this.changePasswordForm.reset();
        this.toast.success('Password changed!');
      }else{
        this.toast.error('Error.',data.message);
      }
    });
  }

  showPassword(bool) {
    this.show = bool;
    if (bool) {
      this.old_password_type = 'text';
    } else {
      this.old_password_type = 'password';
    }
  }

  showNewPassword(bool){
    this.showNew = bool;
    if(bool){
      this.new_password_type = 'text';
    }else{
      this.new_password_type = 'password';
    }
  }

  showConfirmPassword(bool){
    this.showConfirm = bool;
    if(bool){
      this.confirm_password_type = 'text';
    }else{
      this.confirm_password_type = 'password';
    }
  }
  temp_number: any;
  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    this.temp_number = this.editProfileForm.controls.mobile.value
    if ((charCode < 48 || charCode > 57 )) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  forgotPassword(){
    let navigationExtras: NavigationExtras = {
      queryParams: {
        user_email: this.user.email,
        prev_page: '/edit-profile/' +this.user.id,
      }
    }

    this.env.router.navigate(['/forgotpass'], navigationExtras);
  }

	/* ===================== start of profile photo cropper ===================== */
  changeProfilePhoto(img){
    img.click();
  }

	profilePhoto: any = '';
	croppedprofilePhoto: any = '';
	isProfileImageLoaded = false;
	isProfilePhotoCropped = false;
	profileUploadWrongFile = false;
  changeProfilePic(event: any): void {
		let fileType = event.target.files[0].type;

    if( event.target.files[0].size <= '10000000'){
      if(fileType.match('image.*')){
        this.isProfileImageLoaded = false;
        this.isProfilePhotoCropped = false;
        this.profileUploadWrongFile = false;
        this.profilePhoto = event;
     
        let reader = new FileReader();
        reader.onload = (e: any) => {
          let obj = {
            'data': event,
            'type': 'profile'
          };
        
          this.modal.resetModalData('imageCropperModal');
          this.modal.setModalData(obj, 'imageCropperModal');
          this.modal.open('imageCropperModal');
        }
        reader.readAsDataURL(event.target.files[0]);

      }else{
        this.isProfileImageLoaded = true;
        this.isProfilePhotoCropped = true;
        this.profileUploadWrongFile = true;
        this.profilePhoto = '';

        this.toast.error('Error.','Invalid image format! Try .png or .jpg instead.')
      }
    } else {
      this.toast.error('Your file is to large!');
    }
  }
	/* ===================== end of profile photo cropper ===================== */


	/* ===================== start of business card cropper ===================== */
  changeBusinessCard(img){
    img.click();
  }

  profilePhotoCard: any = '';
  croppedprofilePhotoCard: any = '';
  isProfileImageLoadedCard = false;
  isProfilePhotoCroppedCard = false;
  profileUploadWrongFileCard = false;
  uploadBusinessCard(event) {
    let fileType = event.target.files[0].type;
    console.log('fileType', fileType);

    if(fileType.match('image.*')){
      this.isProfileImageLoadedCard = false;
      this.isProfilePhotoCroppedCard = false;
      this.profileUploadWrongFileCard = false;
      this.profilePhotoCard = event;
      
      let reader = new FileReader();
      reader.onload = (e: any) => {
        let obj = {
          'data': event,
          'type': 'card'
        };
      
        this.modal.resetModalData('imageCropperModal');
        this.modal.setModalData(obj, 'imageCropperModal');
        this.modal.open('imageCropperModal');
      }
      reader.readAsDataURL(event.target.files[0]);

    } else {
      this.isProfileImageLoadedCard = true;
      this.isProfilePhotoCroppedCard = true;
      this.profileUploadWrongFileCard = true;
      this.profilePhotoCard = '';

      this.toast.error('Invalid image format! Try .png or .jpg instead.')
    }
  }

  removeBusinessCard(){
    this.isProfileImageLoadedCard = false;
    this.isProfilePhotoCroppedCard = false;
    this.profileUploadWrongFileCard = false;
    this.profilePhotoCard = null;
    this.croppedprofilePhotoCard = null;
    this.user.businesscard = null;
    this.user.businesscard_url = null;

    this.saveDelegateProfile();
  }
	/* ===================== end of business card cropper ===================== */

  public handleAddressChange(event){
    console.log('phammpii', event);
    this.latitude = event.geometry.location.lat();
    this.longitude = event.geometry.location.lng();
    this.place = event.formatted_address;
    this.zoom = 10;

    let currentTimezone = event.utc_offset_minutes/60;
    var gmt = 'UTC';
    if (currentTimezone !== 0) {
      gmt += currentTimezone > 0 ? ' +' : ' ';
      gmt += this.decToTime(currentTimezone);
    }
    this.time_zone = '('+gmt+')';
    this.user.address = this.place;
    this.user.timezone_status = 2; //approve

    this.getTimezoneLabel(this.latitude, this.longitude).subscribe(result => {
      console.log('result', result);
      this.changeUserTimezone = true;

      if(result['error'] == '0'){
        this.user.timezone = result['data'] +" : "+ this.time_zone;
        this.editProfileForm.controls.timezone.setValue(this.user.timezone);
      }else{
        this.user.timezone= this.time_zone;
        this.editProfileForm.controls.timezone.setValue(this.user.timezone);
      }
    }); 
  }
  
  getTimezoneLabel(lat, long){
    let url = this.env.getUrl(Urls.api_events_gettimezone) + "?lat=" + lat + "&long="+ long;

    return this.env.http.get<any>(url, this.env.getHttpOptions());
	}

  decToTime(minutes){
    var sign = minutes < 0 ? "-" : "";
    var min = Math.floor(Math.abs(minutes));
    var sec = Math.floor((Math.abs(minutes) * 60) % 60);
    return sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
  }

  savePreferences(){
    // Save services
    if(this.selected_services ){
      let val = [];
      this.selected_services.forEach(element => {
        val.push(element.id);
      });
      this.user.pref_services_ids = val;
      this.user.pref_services_ids_detail = this.selected_services;
    }

    // Save specializations
    if(this.selected_specialization ){
      let val = [];
      this.selected_specialization.forEach(element => {
        val.push(element.id);
      });
      this.user.pref_specialization_ids = val;
      this.user.pref_specialization_ids_detail = this.selected_specialization;
    }

    // Save countries not willing to met
    if(this.selected_countries){
      let val = [];
      this.selected_countries.forEach(element => {
        val.push(element.id);
      });
      this.user.pref_countries_ids = val;
      this.user.pref_countries_ids_detail = this.selected_countries;
    }

    // Save software
    if(this.selected_softwares){
      let val = [];
      this.selected_softwares.forEach(element => {
        val.push(element.id);
      });
      this.user.pref_software_ids = val;
      this.user.pref_software_ids_detail = this.selected_softwares;
    }

    this.saveDelegateProfile();
  }
}