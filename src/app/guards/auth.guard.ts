import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router
  ){

  }
  canActivate() {
    let user =  this.userService.getLocalStorage();
    if( user ){
        return true;
    } else {
        this.router.navigate(['/login'])
    }
  }
  
}
