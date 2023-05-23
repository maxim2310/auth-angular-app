import { Injectable } from '@angular/core';
import { UrlTree } from '@angular/router';
import { Observable, first, map, skip, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NavigationService } from '../services/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private authService: AuthService,
    private nav: NavigationService
  ) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      return this.authService.isLoggedIn$.pipe(
        map((isLoggedIn) => {

          if (!isLoggedIn) {
            this.nav.login()

            return false;
          }
          return true;
        })
      );
  }
}
