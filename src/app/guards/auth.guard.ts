import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(private authService: AuthService, private nav: NavigationService) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.authService.user$.pipe(
        map(user => {
          if (user) {
            return true; // allow access if user data exists
          } else {
            // redirect to login page if user data does not exist
            this.nav.login()
            return false;
          }
        })
      );
    }

}
