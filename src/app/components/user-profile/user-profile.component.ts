import { Component, OnInit } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/lib/environment';
import { Urls } from 'src/app//lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  user: any;
  other_delegate_company : any;
  other_delegate_company_total_count = 0;
  other_delegate_company_total_page = 0;
  other_delegate_company_limit = 10;
  other_delegate_company_page = 1;
  isLoaded: boolean = false;
  user_privacy: any;
  isUserProfileLoading: boolean = false;
  constructor(
    public modal: NgxSmartModalService,
    private toast: ToastrService,
    private env: environment,
    private request: RequestsService,
    private router: Router
  ) { 
    
  this.user = JSON.parse(localStorage.getItem('user_profile')); }

  ngOnInit() {
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
            
            this.isProfilePhotoCropped =  true;
            
            this.env.loaderText = 'Saving profile photo ...';
            this.saveDelegateProfile();
          }
        }
      }
    });
    
    this.modal.getModal('socialLinks').onAnyCloseEvent.subscribe(data => {
      this.user = JSON.parse(localStorage.getItem('user_profile'));
      console.log('user', this.user);
    });

    if(this.user){
      this.getUserProfile();
      if(this.user.user_privacy == 'no'){
        this.user_privacy = false;
      }else{
        this.user_privacy = true;
      }
    }
    this.getUserProfile();
  }

  getUserProfile(){
    this.isUserProfileLoading = true;
    let url = Urls.api_delegates_get;
    url += '?by=id';
    url += '&isApp=true';
    url += '&delegate=' + this.user.id;

    this.request.get(url).then(response => {
      if(response.error == 0){
        this.user = response['data'];
        console.log('user', this.user);
        this.temp_description = this.user.company.description;
        localStorage.setItem('user_profile', JSON.stringify(this.user));
      }
    }).finally(()=>{
      this.isUserProfileLoading = false;
      this.getOtherDelegateCompany();
    })
  }

  getOtherDelegateCompany(infiniteScroll?){
    let url = Urls.api_delegates_get;
   
    //  url += 'id' + this.user.id;
     url += '?by=id';
     url += '&byParam='+ 'company_id';
     url += '&valParam='+ this.user.company_id;
     url += '&limit='+ this.other_delegate_company_limit;
     url += '&page='+ this.other_delegate_company_page;
  

    // let url = Urls.api_delegates_get;
    // url += '?by=id';
    // url += '?byParam=company_id';
    // url += '&valParam=' + this.user.company_id,
    // url += '&page='+ this.other_delegate_company_page;
    // url += '&limit='+ this.other_delegate_company_limit;
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
  
  editSocialLinks(){
    this.modal.open('socialLinks');
  }

  changeProfilePhoto(img){
    img.click();
  }

	/* ===================== start of profile photo cropper ===================== */
	profilePhoto: any = '';
	croppedprofilePhoto: any = '';
	isProfileImageLoaded = false;
	isProfilePhotoCropped = false;
	profileUploadWrongFile = false;
  changeProfilePic(event: any): void {
		let fileType = event.target.files[0].type;

    if( event.target.files[0].size <= '1e+6'){
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

  saveDelegateProfile(){
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
        if(this.router.url == '/user-profile'){
          window.location.reload();
        }
      }
    });
  }

  verifyAddressAndTimezone(){
    this.env.loaderText = 'Verifying Timezone ...';
    this.env.spinner.show(this.env.loaderSpinner);
    
    let formData = new FormData();
    formData.append('delegate_id', this.user.id);
    formData.append('timezone_status' , '2');

    this.request.post(Urls.api_delegates_settimezone, formData).then(response=>{
      this.env.spinner.hide(this.env.loaderSpinner);
      if(response.error == 0){
        this.user.timezone_status = 2;
        localStorage.setItem('user_profile', JSON.stringify(this.user));
      }
    });
  }
  
  temp_description: any;
  showInputDescription: boolean = false;
  editfield(field, type){
    if(type == 'edit'){
      if(field == 'description'){
        this.showInputDescription = true;
      }
    }else{
      if(field == 'description'){
        this.showInputDescription = false;
        this.env.loaderText = 'Saving company description ...';
        this.saveDescription();
      }
    }
  }

  saveDescription(){
    this.env.spinner.show(this.env.loaderSpinner);
    console.log('sdsadsa', this.temp_description);
    if( this.temp_description != this.user.company.description ){
      var formData = new FormData();
        formData.append('id', this.user.company.id);
        formData.append('description', this.user.company.description);

      this.request.post(Urls.api_company_savedescription, formData).then(response=>{
        this.env.spinner.hide(this.env.loaderSpinner);
        if(response.error == 0){
          localStorage.setItem('user_profile', JSON.stringify(this.user));
          this.temp_description = this.user.company.description;
          this.toast.success(response.message);
        }else{
          this.toast.error(response.message);
        }
      });
    }else{
      this.env.spinner.hide(this.env.loaderSpinner);
      this.toast.error('No change in description');
    }
	
  }

  changePrivacy(value){
    this.user.user_privacy = 'no';
    if(value){
      this.user.user_privacy = 'yes';
    }

    this.env.loaderText = 'Saving user settings ...';
    this.saveDelegateProfile();
  }
}
