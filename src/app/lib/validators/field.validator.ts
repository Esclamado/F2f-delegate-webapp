import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class FieldValidator {

	displayError = false;
	fields = {};

	validateEmail(email) {
		this.displayError = true;

		let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}

	validate (value: any = '', max: number = 0){
		this.displayError = true;

		if(value.length) {
			if(max > 0){
				if(value.length > max){
					return false;
				}
				else {
					return true;
				}
			}
			else {
				return true;
			}
		}
		else {
			return false
		}
	}
}