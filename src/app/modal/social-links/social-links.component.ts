import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Urls } from 'src/app//lib/urls';
import { RequestsService } from 'src/app/services/http/requests.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/app/lib/environment';

@Component({
  selector: 'app-social-links',
  templateUrl: './social-links.component.html',
  styleUrls: ['./social-links.component.scss']
})
export class SocialLinksComponent implements OnInit {

  social_links_form: FormGroup;
  user: any;

  constructor(
    public fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public modal: NgxSmartModalService,
    private request: RequestsService,
    private toastr: ToastrService,
    public env: environment
  ){
    // let urlRegex_facebook = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    // let urlRegex_twitter = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    // let urlRegex_linkedin = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    // let urlRegex_skype = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    // let urlRegex_whatsapp = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    // let urlRegex_wechat = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    // let urlRegex_kakao = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    // let urlRegex_zoom = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

    this.social_links_form = this.fb.group({
      facebook: ['', [Validators.maxLength(100)]],
      twitter: ['', [Validators.maxLength(100)]],
      linkedin: ['', [Validators.maxLength(100)]],
      skype: ['', [Validators.maxLength(100)]],
      whatsapp: ['', [Validators.maxLength(100)]],
      wechat: ['', [Validators.maxLength(100)]],
      kakao: ['', [Validators.maxLength(100)]],
      zoom: ['', [Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user_profile'));
    console.log('user', this.user);
    if(this.user && this.user.social_media_links_detail){ 
      this.user.social_media_links_detail.facebook ? this.social_links_form.controls.facebook.setValue(this.user.social_media_links_detail.facebook) : null;
      this.user.social_media_links_detail.twitter ? this.social_links_form.controls.twitter.setValue(this.user.social_media_links_detail.twitter) : null;
      this.user.social_media_links_detail.linkedin ? this.social_links_form.controls.linkedin.setValue(this.user.social_media_links_detail.linkedin) : null;
      this.user.social_media_links_detail.skype ? this.social_links_form.controls.skype.setValue(this.user.social_media_links_detail.skype) : null;
      this.user.social_media_links_detail.whatsapp ? this.social_links_form.controls.whatsapp.setValue(this.user.social_media_links_detail.whatsapp) : null;
      this.user.social_media_links_detail.wechat ? this.social_links_form.controls.wechat.setValue(this.user.social_media_links_detail.wechat) : null;
      this.user.social_media_links_detail.kakao ? this.social_links_form.controls.kakao.setValue(this.user.social_media_links_detail.kakao) : null;
      this.user.social_media_links_detail.zoom ? this.social_links_form.controls.zoom.setValue(this.user.social_media_links_detail.zoom) : null;
    }
  }

  getData(){
    console.log('open modal');
    this.ngOnInit();
  }

  updateSocialLinks(){
    
    if(this.social_links_form.valid){
      // this.env.loaderText = 'Saving ...';
      // this.env.spinner.show(this.env.loaderSpinner);
      let socialMediaLinks = {
        'facebook' : this.social_links_form.controls.facebook.value,
        'kakao' : this.social_links_form.controls.kakao.value,
        'linkedin' : this.social_links_form.controls.linkedin.value,
        'skype' : this.social_links_form.controls.skype.value,
        'wechat' : this.social_links_form.controls.wechat.value,
        'whatsapp' : this.social_links_form.controls.whatsapp.value,
        'zoom' : this.social_links_form.controls.zoom.value,
        'twitter' : this.social_links_form.controls.twitter.value
      };

      var formData = {
        'id' : this.user.id,
        'businesscard' : this.user.businesscard,
        'businesscard_url' : this.user.businesscard_url,
        'company' : this.user.company,
        'company_country' : this.user.company_country,
        'company_id' : this.user.company_id,
        'email' : this.user.email,
        'fullname' : this.user.fullname,
        'job_title' : this.user.job_title,
        'mobile' : this.user.mobile,
        'pref_countries_ids' : this.env.convertType(this.user.pref_countries_ids, 'string'),
        'pref_countries_ids_detail' : this.user.pref_countries_ids_detail,
        'pref_lang' : this.user.pref_lang,
        'pref_lang_details' : this.user.pref_lang_details,
        'pref_network_ids' : this.env.convertType(this.user.pref_network_ids, 'string'),
        'pref_network_ids_detail' : this.user.pref_network_ids_detail,
        'pref_sector_ids' : this.env.convertType(this.user.pref_sector_ids, 'string'),
        'pref_sector_ids_detail' : this.user.pref_sector_ids_detail,
        'pref_services_ids' : this.env.convertType(this.user.pref_services_ids, 'string'),
        'pref_services_ids_detail' : this.user.pref_services_ids_detail,
        'pref_software_ids' : this.env.convertType(this.user.pref_software_ids, 'string'),
        'pref_software_ids_detail' : this.user.pref_software_ids_detail,
        'pref_specialization_ids' : this.env.convertType(this.user.pref_specialization_ids, 'string'),
        'pref_specialization_ids_detail' : this.user.pref_specialization_ids_detail,
        'profile_photo' : this.user.profile_photo,
        'profile_photo_url' : this.user.profile_photo_url,
        'push_notif_enabled' : this.user.push_notif_enabled,
        'user_privacy' : this.user.user_privacy,
        'timezone' : this.user.timezone,
        'timezone_status' : this.user.timezone_status,
        'social_media_links' : this.env.convertType(socialMediaLinks, 'string'),
        'social_media_links_detail' : this.user.social_media_links_detail,
      }
    
      this.request.post(Urls.api_delegates_save, formData).then(response=>{
      // this.env.spinner.hide(this.env.loaderSpinner);
        if(response.error == 0){
          this.user.social_media_links = socialMediaLinks;
          this.user.social_media_links_detail = socialMediaLinks;
          localStorage.setItem('user_profile', JSON.stringify(this.user));
          this.toastr.success('Social links successfully updated');
        }
        this.modal.resetModalData('socialLinks');
        // window.location.reload();
        this.closeEditSocialLinks();
      });
    }else{
      this.toastr.error('Invalid social media links');
      this.social_links_form.markAllAsTouched();
      // this.env.spinner.hide(this.env.loaderSpinner);
    }
  }

  closeEditSocialLinks(){
    this.modal.resetModalData('socialLinks');
    this.modal.close('socialLinks');
    this.social_links_form.reset();
  }
}
