import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-edit-company-details',
  templateUrl: './edit-company-details.component.html',
  styleUrls: ['./edit-company-details.component.scss']
})
export class EditCompanyDetailsComponent implements OnInit {
  personalInfoForm: FormGroup;
  companyAddressForm: FormGroup;
  contactInfoForm: FormGroup;
  networkInfoForm: FormGroup;
  limit_value: any;
  country_value: any;
  state_value: any;
  member_since_value: any;
  membership_value: any;
  network_value: any;
  type_value: any;
  country_list = [
    {
      type: '1',
      name: 'Philippines',
    },
    {
      type: '2',
      name: 'Canada',
    }
  ]

  state_province_list = [
    {
      type: '1',
      name: 'Cavite',
    },
    {
      type: '2',
      name: 'Manila'
    }
  ]

  electricity = [
    {
      type: '1',
      name: 'Electricity'
    }, {
      type: '2',
      name: 'Internet'
    }
  ]
  constructor
  (
    public fb: FormBuilder,
  ) 
  { 
    this.personalInfoForm = this.fb.group({
      company_name: ['', Validators.compose([Validators.required])],
      textarea: ['', Validators.compose([Validators.required])],
      sector: ['', Validators.compose([Validators.required])],
    })

    this.companyAddressForm = this.fb.group({
      country: ['', Validators.compose([Validators.required])],
      state_province: ['', Validators.compose([Validators.required])],
      zipcode: ['', Validators.compose([Validators.required])],
      company_main_address: ['', Validators.compose([Validators.required])]
    })

    let link = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
    this.contactInfoForm = this.fb.group({
      website: ['', Validators.compose([Validators.required, Validators.pattern(link)])],
      mobile: ['', Validators.compose([Validators.required])],
      linkedin: ['', Validators.compose([Validators.required, Validators.pattern(link)])],
      facebook: ['', Validators.compose([Validators.required, Validators.pattern(link)])],
      twitter: ['', Validators.compose([Validators.required, Validators.pattern(link)])],
      whatspp: ['', Validators.compose([Validators.required, Validators.pattern(link)])],
      wechat: ['', Validators.compose([Validators.required, Validators.pattern(link)])],
      kakao: ['', Validators.compose([Validators.required, Validators.pattern(link)])],
    })


  }

  ngOnInit(): void {
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

  clickedStatus(type){
    this.type_value = type;
  }

  clickedState(type){
    this.type_value = type;
  }

  clickedElectricity(type){
    this.type_value = type;
  }

}
