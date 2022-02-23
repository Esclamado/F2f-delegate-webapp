import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class strrandom {

    base64url(source) {
        let string = JSON.stringify(source);
        let b64url = btoa(string);
        b64url = b64url.replace(/=+$/, '');
        b64url = b64url.replace(/\+/g, '-');
        b64url = b64url.replace(/\//g, '_');
        return b64url;
    }

    public generateFileName(){
        return this.fileNameGenerator(8)+'.png';
    }
    
    protected fileNameGenerator(len){
        let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz,randomPoz+1);
        }
        return randomString;
    }

    validateNumber(event){
        let key = window.event ? event.keyCode : event.which;
        if (event.keyCode === 8 || event.keyCode === 46) {
            return true;
        } else if ( key < 48 || key > 57 ) {
            return false;
        } else {
          return true;
        }
    }

    checkUrl(url){
        var S = "http://   https://";

        if(url.includes("http://") || url.includes("https://")){
            return true;
        }else{
            url = "http://"+url;
            return false;
        }
    }

    /* ================================= start of time convertion ================================= */
    public convertTo24Hrs(time){
		let hours = Number(time.match(/^(\d+)/)[1]);
		let minutes = Number(time.match(/:(\d+)/)[1]);
        let AMPM = time.match(/\s(.*)$/)[1];
		if((AMPM == "PM" || AMPM == "pm") && hours<12) hours = hours+12;
		if((AMPM == "AM" || AMPM == "am") && hours==12) hours = hours-12;
		let sHours = hours.toString();
		let sMinutes = minutes.toString();
		if(hours<10) sHours = "0" + sHours;
        if(minutes<10) sMinutes = "0" + sMinutes;
		return sHours + ":" + sMinutes;
    }
    
    /* this will convert time into a minutes */
    public converToMin(time){
        let t: any = this.convertTo24Hrs(time);
        t = t.split(':');

        let h = parseInt(t[0]);
        let m = parseInt(t[1]);

        let totalMin = h * 60 + m;
        return totalMin;
    }
    /* ================================= end of time convertion ================================= */
}