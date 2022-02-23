import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from 'src/app/material/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPassComponent } from '../forgot-pass/forgot-pass.component';



@NgModule({
  declarations: [LoginComponent,
    ForgotPassComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule, 
    ReactiveFormsModule,
    
  ]
})
export class LoginPageModule { }
