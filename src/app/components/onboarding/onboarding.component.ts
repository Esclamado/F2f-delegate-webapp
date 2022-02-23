import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { Urls } from 'src/app/lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { environment } from 'src/app/lib/environment';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit, AfterViewInit {

  @ViewChild('stepper') private main_stepper: MatStepper;
  subscribeSearch = new Subject<string>();
  
  password_form: FormGroup;
  basic_detail_form: FormGroup;
  img_path = 'assets/images/bg-profile.png';
  profile_img_path = 'assets/images/default_img.png';
  id_bg = 'assets/images/id_bg.png';
  uploaded_id: any;
  new_uploaded_id: any = null;
  uploaded_id_type: any;
  profile = [
    {
      name: 'Ramon Anderson ',
      language: 'English, Korean, Japanese',
      mobile: '(85)(298)0242-00'
    }
  ]
  user: any;
  user_privacy: boolean = true;

  services: any;
  specializations: any;
  
  contries: any;
  search_key_countries: string = '';
  isLoaded: boolean = false;

  selected_services: any;
  selected_specialization: any;
  selected_countries: any;
  selected_softwares: any;
  select_all_software: boolean = false;
  selected_software_count: any = 0;

  softwares: any;

  temp_profile_pic: any;
  temp_img_cropped: any;

  constructor(
    public fb: FormBuilder,
    private toast: ToastrService,
    private modal: NgxSmartModalService,
    private request: RequestsService,
    private toastr: ToastrService,
    public env: environment,
    public router: Router
  ) { 
    this.env.requireLogIn();
    this.initializeForm();
    this.user = JSON.parse(localStorage.getItem('user_profile'));
    if(this.user['last_page'] == '2'){
      this.show_changepass = false;
      setTimeout(()=>{
        this.nextStepper();
      },500)
    }

    this.subscribeSearch.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(value => {
        this.isLoaded = false;
        this.contries = null;
        this.getPreferencesContries();
    });
  }

  ngAfterViewInit() {
    
    this.modal.getModal('imageCropperModal').onAnyCloseEvent.subscribe(data => {
      let imageCropperModal = this.modal.getModalData('imageCropperModal');
      console.log('imageCropperModal: ', imageCropperModal);
      if(imageCropperModal){
        if(imageCropperModal['type'] == 'profile'){
          if(imageCropperModal['croppedImage'] && imageCropperModal['profilePhoto']){
            this.croppedprofilePhoto = imageCropperModal['croppedImage'];
            this.user.profile_photo_url = this.croppedprofilePhoto;
            this.temp_profile_pic = this.croppedprofilePhoto;
    
            this.profilePhoto = imageCropperModal['profilePhoto'];
            this.user.profile_photo = this.profilePhoto;
            console.log('this.temp_profile_pic: ', this.temp_profile_pic)
            this.temp_img_cropped = imageCropperModal;
            
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
    
    this.modal.getModal('socialLinks').onAnyCloseEvent.subscribe(data => {
      this.user = JSON.parse(localStorage.getItem('user_profile'));
      this.croppedprofilePhoto = this.temp_img_cropped['croppedImage'];
      this.user.profile_photo_url = this.croppedprofilePhoto;
      this.temp_profile_pic = this.croppedprofilePhoto;

      this.profilePhoto = this.temp_img_cropped['profilePhoto'];
      this.user.profile_photo = this.profilePhoto;
      console.log('this.temp_profile_pic: ', this.temp_profile_pic)
      
      this.isProfilePhotoCropped =  true;
    });
  }

  initializeForm() {
    this.password_form = this.fb.group({
      new_password: ['',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
        ])
      ],
      confirm_password: ['',
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
        ])
      ]
    })
    let emailRe = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.basic_detail_form = this.fb.group({
      fullname: ['', Validators.compose([Validators.required])],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRe)])],
      job_title: ['', Validators.compose([Validators.required])],
      mobile: ['', Validators.compose([Validators.required, Validators.pattern("^[0-9]*$")])],
    })
  }

  ngOnInit(): void {
    console.log('user: ', this.user);
    this.getPreferencesServices();
    this.getPreferencesSpecializations();
    this.getPreferencesContries();
    this.getPreferencesSoftwares();
    if(this.user){
      this.basic_detail_form.controls['fullname'].setValue(this.user.fullname);
      this.basic_detail_form.controls['email'].setValue(this.user.email);
      this.basic_detail_form.controls['job_title'].setValue(this.user.job_title);
      this.basic_detail_form.controls['mobile'].setValue(this.user.mobile);

      if(this.user.user_privacy == 'no'){
        this.user_privacy = false;
      }

      if(this.user.social_media_links){
        let social_media_links = {
          facebook: (this.user && this.user.social_media_links_detail && this.user.social_media_links_detail.facebook) ? this.user.social_media_links_detail.facebook : '',
          linkedin: (this.user && this.user.social_media_links_detail && this.user.social_media_links_detail.linkedin) ? this.user.social_media_links_detail.linkedin : '',
          whatsapp: (this.user && this.user.social_media_links_detail && this.user.social_media_links_detail.whatsapp) ? this.user.social_media_links_detail.whatsapp : '',
          twitter: (this.user && this.user.social_media_links_detail && this.user.social_media_links_detail.twitter) ? this.user.social_media_links_detail.twitter : '',
          kakao: (this.user && this.user.social_media_links_detail && this.user.social_media_links_detail.kakao) ? this.user.social_media_links_detail.kakao : '',
          wechat: (this.user && this.user.social_media_links_detail && this.user.social_media_links_detail.wechat) ? this.user.social_media_links_detail.wechat : '',
          skype: (this.user && this.user.social_media_links_detail && this.user.social_media_links_detail.skype) ? this.user.social_media_links_detail.skype : '',
          zoom: (this.user && this.user.social_media_links_detail && this.user.social_media_links_detail.zoom) ? this.user.social_media_links_detail.zoom : '',
        };
        this.user.social_media_links = social_media_links;
      }
    }
  }

  getPreferencesServices(){
    let url = Urls.api_preferences_get;
    url += '?pref=' + 'services';
    url += '&limit=' + '500';
    this.request.get(url).then( data=>{
      if(data.error == 0){
        this.services = data.data;
      }
    })
  }

  getPreferencesSpecializations(){
    let url = Urls.api_preferences_get;
    url += '?pref=' + 'specializations';
    url += '&limit=' + '500';
    this.request.get(url).then( data=>{
      if(data.error == 0){
        this.specializations = data.data;
      }
    })
  }
  
  searchCountries($param){
    this.search_key_countries = $param;
    this.contries = null;
    this.isLoaded = false;
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
      this.isLoaded = true;
      if(data.error == 0){
        this.contries = data.data;
        if(this.selected_countries){
          console.log('selected_countries', this.selected_countries);
          this.selected_countries.forEach((val, key) => {
            this.contries.datas.forEach((res, idk) => {
              if(val.id == res.id){
                res.checked = true;
              }
            });
          });
        }
      }
    });
  }

  getPreferencesSoftwares(){
    let url = Urls.api_preferences_get;
    url += '?pref=' + 'softwares';
    url += '&limit=' + '500';
    this.request.get(url).then( data=>{
      if(data.error == 0){
        this.softwares = data.data;
      }
    })
  }
  
  nextStepper(){
    if(this.showInputJobTitle == true || this.showInputMobile == true){
      return false
    }else{
      this.main_stepper.next();
      this.env.progressbarValue += 15;
      console.log('this.user', this.user);
  
      if(this.main_stepper.selectedIndex == 2){
        // this.env.loaderText = 'Saving Profile ...';
        // this.saveDelegateProfile();
  
      }
      else if(this.main_stepper.selectedIndex == 3){
        //this.env.loaderText = 'Saving Business Card ...';
  
        /* Select Selected Services */
        this.selected_services = [];
        if(this.services && this.services.datas){
          if(this.user.pref_services_ids_detail){
            this.services.datas.forEach((data, key) => {
              this.user.pref_services_ids_detail.forEach((val, idk) => {
                if(data.id == val.id){
                  this.selected_services.push(val);
                  data.checked = true;
                }
              });
            });
          }
        }
        
        /* Select Selected Specializations */
        this.selected_specialization = [];
        if(this.specializations && this.specializations.datas){
          if(this.user.pref_specialization_ids_detail){
            this.specializations.datas.forEach((data, key) => {
              this.user.pref_specialization_ids_detail.forEach((val, idk) => {
                if(data.id == val.id){
                  this.selected_specialization.push(val);
                  data.checked = true;
                }
              });
            });
          }
        }
        
        /* Select Selected Countries */
        this.selected_countries = [];
        if(this.contries && this.contries.datas){
          if(this.user.pref_countries_ids_detail){
            this.contries.datas.forEach((data, key) => {
              this.user.pref_countries_ids_detail.forEach((val, idk) => {
                if(data.id == val.id){
                  this.selected_countries.push(val);
                  data.checked = true;
                }
              });
            });
          }
        }
        //this.saveDelegateProfile();
      }
      else if(this.main_stepper.selectedIndex == 4){
        //this.env.loaderText = 'Saving Preferences ...';
  
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
             
        /* Select Selected Services */
        this.selected_softwares = [];
        if(this.softwares && this.softwares.datas){
          if(this.user.pref_software_ids_detail){
            this.selected_software_count = this.user.pref_software_ids_detail.length;
            this.softwares.datas.forEach((data, key) => {
              this.user.pref_software_ids_detail.forEach((val, idk) => {
                if(data.id == val.id){
                  this.selected_softwares.push(val);
                  data.checked = true;
                }
              });
  
              this.select_all_software = false;
              if(this.selected_software_count == this.softwares.total_count){
                this.select_all_software = true;
              }
            });
          }
        }
  
        console.log('count', this.selected_software_count);
        //this.saveDelegateProfile();
  
      }
      else if(this.main_stepper.selectedIndex == 5){
        
        // Save software
        if(this.selected_softwares){
          let val = [];
          this.selected_softwares.forEach(element => {
            val.push(element.id);
          });
          this.user.pref_software_ids = val;
          this.user.pref_software_ids_detail = this.selected_softwares;
        }
  
        //this.env.loaderText = 'Saving Operational Softwares ...';
        //this.saveDelegateProfile();
      }
      
      localStorage.setItem('user_profile', JSON.stringify(this.user));
    }
  }

  selectServices(val, e){
    this.services.datas.forEach((data, key) => {
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
    this.specializations.datas.forEach((data, key) => {
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
    this.contries.datas.forEach((data, key) => {
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
      this.softwares.datas.forEach((data, key) => {
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

  selectAllSoftwares(e){
    console.log(e.checked);
    this.select_all_software = e.checked;
    this.softwares.datas.forEach((data, key) => {
      if(data.id){
        data.checked = e.checked;
      }
    });
    if(this.selected_softwares){
      if(e.checked){
        this.selected_softwares = this.softwares.datas;
        this.selected_software_count = this.softwares.datas.length;
      }else{
        this.selected_software_count = 0;
        this.selected_softwares = null;
      }
    }else{
      this.selected_softwares = this.softwares.datas;
      this.selected_software_count = this.softwares.datas.length;
    }

    console.log(this.selected_software_count);
  }
  
  prevStepper(){
    this.main_stepper.previous();
    this.env.progressbarValue -= 15;
  }

  same:any = true;
  checkIfSame(){
    let x = this.password_form.value.new_password;
    let y = this.password_form.value.confirm_password;
    this.same = x === y ? true : false;
  }

  showInputJobTitle = false;
  showInputMobile = false;
  editfield(field, detail){
    if(field == 'job_title'){
      this.showInputJobTitle = !this.showInputJobTitle;
      this.basic_detail_form.patchValue({job_title: detail});
    }else if(field == 'mobile'){
      this.showInputMobile = !this.showInputMobile;
      this.basic_detail_form.patchValue({mobile: detail});
    }
  }
  temp_mobile: any
  saveEditField(field, value){
    if(value){
      if(field == 'job_title'){
        this.showInputJobTitle = !this.showInputJobTitle;
        this.basic_detail_form.controls.job_title.setValue(value);
        this.user['job_title'] = value;
      }else if(field == 'mobile'){
        if(this.basic_detail_form.controls.mobile.value == 0){
          this.toast.error('Invalid mobile number');
        }else{
          this.showInputMobile = !this.showInputMobile;
          // this.basic_detail_form.controls.mobile.setValue(value);
          this.user.mobile = this.basic_detail_form.controls.mobile.value;
          this.temp_mobile = this.basic_detail_form.controls.mobile.value;
          this.user['mobile'] = value;
          localStorage.setItem('user_profile', JSON.stringify(this.user));
          // this.toast.error('Please check the required field!');
        }
      }
    }
    //console.log('saveEditField', this.user);
  }

	/* ===================== start of profile photo cropper ===================== */
	profilePhoto: any = '';
	croppedprofilePhoto: any = '';
	isProfileImageLoaded = false;
	isProfilePhotoCropped = false;
	profileUploadWrongFile = false;
  changeProfilePic(event: any): void {
		let fileType = event.target.files[0].type;

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

		} else {
			this.isProfileImageLoaded = true;
			this.isProfilePhotoCropped = true;
			this.profileUploadWrongFile = true;
			this.profilePhoto = '';

      this.toast.error('Error.','Invalid image format! Try .png or .jpg instead.')
		}
  }
	/* ===================== end of profile photo cropper ===================== */

	/* ===================== start of business card cropper ===================== */
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
      // localStorage.setItem('user_profile', JSON.stringify(this.user));

      this.toast.error('Error.','Invalid image format! Try .png or .jpg instead.')
		}
  }
  
  onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
  }
  
  onIdDrop(event){
    event.preventDefault();
    this.uploaded_id = event.dataTransfer.files;
    this.uploaded_id_type=event.dataTransfer.files[0].type
    if (this.uploaded_id) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.new_uploaded_id=e.target.result;
        }
        reader.readAsDataURL(event.dataTransfer.files[0]);
    }
    // if ( this.uploaded_id_type != 'image/jpeg' && this.uploaded_id_type != 'image/png'){
    //   this.toast.error('Error.','Invalid image format! Try .png or .jpg instead.')
    //   this.empty_id = true;
    // } else{
    //   this.empty_id = false;
    // }
  }
  
  removeBusinessCard(){
    this.isProfileImageLoadedCard = false;
    this.isProfilePhotoCroppedCard = false;
    this.profileUploadWrongFileCard = false;
    this.profilePhotoCard = null;
    this.user.businesscard = null;
    this.user.businesscard_url = null;
  }
	/* ===================== end of business card cropper ===================== */
  
  openSocialLinks(){
    this.modal.open('socialLinks');
  }

  cropProfilePic(profilePic = null){
    profilePic.click();
  }

  convertToBase64(data){
      return new Promise ((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(data);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  show_changepass: boolean = true;
  /* 2nd stepper */
  skipPassword(){
    this.show_changepass = false;
   setTimeout(() => {
    this.user['last_page'] = 2;
    this.env.delegateStorageSet(this.user);
    this.saveDelegateProfile(true);
    this.nextStepper();
    // window.location.reload();
   }, 1000);
  }

  checkPassword(){
    this.env.loaderText = 'Changing password ...';
    this.env.spinner.show(this.env.loaderSpinner);

    let formData = new FormData();
    console.log('formData', formData);
    formData.append('email', this.user.email);
    formData.append('password', this.password_form.controls.new_password.value);

    this.request.post(Urls.mapi_delegate_checkpassword, formData).then(data => {
      if(data.error == 0){
      
      this.env.spinner.hide(this.env.loaderSpinner);
      this.toast.error('Sorry! This is your current password. Try to use other password or skip this one.');
      }else{
        this.changePass();
      }
    });
  }

  changePassword: any;
  changePass(){
    let formData = new FormData();

    formData.append('id', this.user.id);
    formData.append('newpassword', this.password_form.controls.new_password.value);
    formData.append('confirmnewpassword', this.password_form.controls.confirm_password.value);
    formData.append('firstloginchangepass', 'yes'); 

    this.env.spinner.hide(this.env.loaderSpinner);
    this.request.post(Urls.mapi_delegate_changepass, formData).then(data=>{
      if(data.error == 0){
        this.toastr.success('Password changed!','Don’t forget to use this new password on your next login')
      }else{
        this.toastr.error('Error.',data.message);
      }
      this.skipPassword();
    })
  }

  /* 2nd stepper */
  show = false;
  show_confirm = false;
  change_password_type: string = 'password';
  confirm_password_type: string = 'password';
  showPassword(bool) {
    this.show = bool;
    if (this.show) {
      this.change_password_type = 'text';
    } else {
      this.change_password_type = 'password';
    }
    // this.show = bool;
    // if(type == 'new_password'){
    //   if (this.show) {
    //     this.change_password_type = 'text';
    //   } else {
    //     this.change_password_type = 'password';
    //   }
    // }else if(type == 'confirm_password'){
    //   this.show_confirm = bool;
    //   if (this.show_confirm) {
    //     this.confirm_password_type = 'text';
    //   } else {
    //     this.confirm_password_type = 'password';
    //   }
    // }
  }

  showConfirmPassword(bool){
    this.show_confirm = bool;
    if (this.show_confirm) {
      this.confirm_password_type = 'text';
    } else {
      this.confirm_password_type = 'password';
    }
  }

  logout(){
    this.env.loaderText = 'Logging out ...';
    this.env.spinner.show(this.env.loaderSpinner);
    localStorage.removeItem('user_profile');
    this.env.deleteCookie();    
    setTimeout(()=>{
      this.env.spinner.hide(this.env.loaderSpinner);
      this.env.router.navigate(['/login'])
    },1000);
  }

  gotoEvent(){
    this.env.loaderText = 'Saving Delegate Profile...';
    this.user.last_page = 0;
    localStorage.setItem('user_profile', JSON.stringify(this.user));
    
    this.saveDelegateProfile();
    this.env.router.navigate(['/events'])
  }

  changePrivacy(value){
    this.user.user_privacy = 'no';
    if(value){
      this.user.user_privacy = 'yes';
    }
  }

  saveDelegateProfile(no_spinner?){
    this.user['profile_photo_url'] = this.temp_profile_pic;
    this.user['mobile'] = this.temp_mobile;

    if(!no_spinner){
      this.env.spinner.show(this.env.loaderSpinner);
    }
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
      if(!no_spinner){
        this.env.spinner.hide(this.env.loaderSpinner);
      }
      if(response.error == 0){
        localStorage.setItem('user_profile', JSON.stringify(this.user));
      }
    });
  }

  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode < 48 || charCode > 57 )) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
}