import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class TimezoneService {

  constructor() { }

  public delegateTimezone: string;
  public eventTimezone: string;

  public delegateTimezoneName: string;
  public eventTimezoneName: string;

  public delegateTimezoneOffset;

  public setDelegateTimezone(delegateTimezone){
    this.delegateTimezone = delegateTimezone;
    this.setDelegateTimezoneName(delegateTimezone);
    this.setTimezoneDelegateOffset(delegateTimezone);
  }

  public setEventTImezone(eventTimezone) {
    this.eventTimezone = eventTimezone;
    this.setEventTimezoneName(eventTimezone);
  }

  public setEventTimezoneName(eventTimezone){
    let et = eventTimezone.split(':');
    let name = et[0].trim();

    this.eventTimezoneName = name;
    console.log('this is the event timezone name', this.eventTimezoneName);

  }

  public setDelegateTimezoneName(delegateTimezone){
    let dt = delegateTimezone.split(':');
    let name = dt[0].trim();

    this.delegateTimezoneName = name;
    //console.log('this is the delegate timezone name', this.delegateTimezoneName);
  }

  setTimezoneDelegateOffset(timezone){
    // Europe/Berlin : (UTC +02:00)
    timezone = timezone.split('(');
    let timezoneOffset = timezone[1].slice(4, -1);
    this.delegateTimezoneOffset = timezoneOffset;
    console.log('this is the delegate timezone offset', this.delegateTimezoneOffset);
  }

  allTimezones(){
    var timeZones = moment.tz.names();
    var offsetTmz=[];

    for(var i in timeZones)
    {
      // Asia/Manila : (UTC +08:00)
      offsetTmz.push(timeZones[i] + " : (UTC " + moment.tz(timeZones[i]).format('Z') + ")");

    }
    //console.log(offsetTmz);
  }

  public getTimezoneName(timezone){
    let et = timezone.split(':');
    let name = et[0].trim();

    return name;
  }

}