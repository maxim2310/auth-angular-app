import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const NAVURLS = {
  home: () => '/',
  users: () => '/users',
  login: () => '/auth/login',
  registration: () => '/auth/registration',
  activate: () => '/auth/activate'

}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  home() {
    this.router.navigateByUrl(NAVURLS.home());
  }
  users() {
    this.router.navigateByUrl(NAVURLS.users());
  }
  login() {
    this.router.navigateByUrl(NAVURLS.login());
  }
  registration() {
    this.router.navigateByUrl(NAVURLS.registration());
  }
  activate() {
    this.router.navigate([NAVURLS.activate(), '']);
  }
}
