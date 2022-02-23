import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/app/lib/environment';
@Injectable({
  providedIn: 'root'
})
export class RequestsService {
  api_user_profile() {
    throw new Error('Method not implemented.');
  }

  constructor(
    private http: HttpClient,
    private env: environment
  ) { }
  post(url, data) : any {
    return new Promise((resolve) => {
      this.http.post(this.env.getUrl(url), data, this.env.getHttpOptions()).subscribe(
        result => {
          resolve(result);
        },
        error => {
          resolve(error);
        }
      );
    })
  }

  get(url) :any {
    return new Promise((resolve) => {
      this.http.get(this.env.getUrl(url), this.env.getHttpOptions()).subscribe(
        result => {
          resolve(result);
        },
        error => {
          resolve(error);
        }
      );
    })
  }

  debounce(func, wait){
    let timeout;

    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };


  





}
