import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  company_form: FormGroup;
  
  constructor(
    public fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public modal: NgxSmartModalService,
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
  }
  initializeForm() {
    let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.company_form = this.fb.group({
      name: ['',Validators.compose([Validators.required])],
      email: ['',Validators.compose([Validators.required,Validators.maxLength(70),Validators.email,Validators.pattern(emailRegex)])],
      number: ['',Validators.compose([Validators.required,Validators.minLength(12),Validators.pattern("^[0-9]*$"), Validators.maxLength(12)])],
      date: ['',Validators.compose([Validators.required])],})
  }

  saveCompanyModal(){
    this.modal.open('companyModal');
  }

}
