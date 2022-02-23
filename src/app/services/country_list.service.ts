import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryListService {

  countries = new BehaviorSubject(0);
  total_count_final = new BehaviorSubject(0);
  services_list = new BehaviorSubject(0)
  constructor() { }
  setCountryList(countries){
    this.countries.next(countries);
  }

  getCountryList():Observable<any>{
    return this.countries.asObservable();
  }


  setServiceList(services_list){
    this.services_list.next(services_list);
  }

  getServiceList():Observable<any>{
    return this.services_list.asObservable();
  }

  setFinalCount(total_count_final){
    this.total_count_final.next(total_count_final);
  }

  getFinalCount():Observable<any>{
    return this.total_count_final.asObservable();
  }
}
