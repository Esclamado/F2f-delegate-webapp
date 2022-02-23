import { AbstractControl, Validators } from '@angular/forms';


export function ValidateUrl(control: AbstractControl) {
  
  if(control.value === ""){
    return null;
  }
  if (Validators.pattern("^(https?|chrome):\/\/[^\s$.?#].[^\s]*$")) {
    return { validUrl: true };
  }
  return null;
}