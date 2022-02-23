import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class ClockService {

  datetime: string = '';
  datetimeOrig: string = '';

  datetimeTicker: string = '';
  datetimeTickerVirtual: string = '';
  datetimeTickerOriginal: string = '';

  today: any = null;
  todayVirtual: any = null;
  todayOrig: any = null;

  day: string = '';
  date: string = '';
  time: string = '';

  timezone: string = '';

  constructor(
  ) { }

  /**
   * 
   * @param dateTime string
   * month day, year hour:min:sec
   */
  setDateTime(event){
    let dateTime = event.event_location_datetime;
    this.datetime = dateTime;
    this.today = new Date(this.datetime);
    return this;
  }

  setTimezone(timezone){
    this.timezone = timezone;
    return this;
  }

  setDateTimeVirtual(event){
    this.setDateTime(event);

    let dateTime = event.event_location_datetime;
    let dateTimeOrig = event.event_original_datetime

    this.datetime = dateTime;
    this.datetimeOrig = dateTimeOrig;

    this.todayVirtual = new Date(dateTime);
    this.todayOrig = new Date(dateTimeOrig);

    return this;
  }

  /**
   * start the clock this will start the clock
   */
  startTime(){
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let mon = months[this.today.getMonth()];
    let day = days[this.today.getDay()];
    let date = this.today.getDate();
    let year = this.today.getFullYear();
    let hours = this.today.getHours();
    let ampm = hours >= 12 ? 'pm' : 'am';
    let m = this.today.getMinutes();
    let s = this.today.getSeconds();
    let h = hours % 12;
    h = h ? h : 12; /* the hour '0' should be '12' */

    m = this.checkTime(m);
    s = this.checkTime(s);
    
    this.datetimeTicker = mon + " " + date + ", " + year + " " + day + " " + h + ":" + m + ":" + s + " " + ampm;
    let t = setTimeout(f => {
      let milisec = this.today.getTime() + 1000;
      this.today = new Date(milisec);
      this.startTime();
    }, 1000);
  }

  startTimeVirtual(){

    // converted time
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let mon = months[this.todayVirtual.getMonth()];
    let day = days[this.todayVirtual.getDay()];
    let date = this.todayVirtual.getDate();
    let year = this.todayVirtual.getFullYear();
    let hours = this.todayVirtual.getHours();
    let ampm = hours >= 12 ? 'pm' : 'am';
    let m = this.todayVirtual.getMinutes();
    let s = this.todayVirtual.getSeconds();
    let h = hours % 12;
    h = h ? h : 12; /* the hour '0' should be '12' */

    m = this.checkTime(m);
    s = this.checkTime(s);

    // event time

    let monthsO = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let daysO = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let monO = months[this.todayOrig.getMonth()];
    let dayO = days[this.todayOrig.getDay()];
    let dateO = this.todayOrig.getDate();
    let yearO = this.todayOrig.getFullYear();
    let hoursO = this.todayOrig.getHours();
    let ampmO = hoursO >= 12 ? 'pm' : 'am';
    let mO = this.todayOrig.getMinutes();
    let sO = this.todayOrig.getSeconds();
    let hO = hoursO % 12;
    hO = hO ? hO : 12; /* the hour '0' should be '12' */

    mO = this.checkTime(mO);
    sO = this.checkTime(sO);
    
    this.datetimeTickerVirtual = mon + " " + date + ", " + year + " " + day + " " + h + ":" + m + ":" + s + " " + ampm;
    this.datetimeTickerOriginal = monO + " " + dateO + ", " + yearO + " " + dayO + " " + hO + ":" + mO + ":" + sO + " " + ampmO;
    
    let t = setTimeout(f => {
      let milisec = this.todayVirtual.getTime() + 1000;
      this.todayVirtual = new Date(milisec);

      let milisec1 = this.today.getTime() + 1000;
      this.today = new Date(milisec1);

      let milisec2 = this.todayOrig.getTime() + 1000;
      this.todayOrig = new Date(milisec2);

      this.startTimeVirtual();
    }, 1000);
  }

  startMinute(){
    
  }

  /**
   * 
   * @param i min or sec
   * add zero in front of numbers < 10
   */
  checkTime(i) {
    if (i < 10) {i = "0" + i};
    return i;
  }


  /**
   * convert time to military time
   */
  convertTo24Hrs(time=null){
    if(time){
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
    }else{
      return "00:00";
    }
  }

  /**
   * using moment to convert timezone
   * convertion of local zone to specific timezone
   * @param timezone 
   */
  convertToZone(timezone:string=''){
    let today = new Date();
    let formated = moment(today, 'YYYY-MM-DD HH:mm:ss').tz(timezone).format();
    let temp_formated = formated.split("T");

    let date = '1970-01-01';
    let t = '00:00:00';

    if(temp_formated.length == 2){
      date = temp_formated[0];
      let time = temp_formated[1];
      let temp_time = time.split("+");

      if(temp_time.length == 2){
        t = temp_time[0];
      }
    }
    return date + ' ' + t;
  }
}