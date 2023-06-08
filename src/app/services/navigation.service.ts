import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const NAVURLS = {
  expenses: () => '/',
  login: () => '/auth/login',
  registration: () => '/auth/registration',
  activate: () => '/auth/activate'

}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  expenses() {
    this.router.navigateByUrl(NAVURLS.expenses());
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
