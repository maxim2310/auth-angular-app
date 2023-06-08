import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
import {
  Observable,
  ReplaySubject,
  catchError,
  map,
  tap,
  throwError,
} from 'rxjs';
import { TokenService } from './token.service';
import { environment } from '../../environments/environment';
import { SocialAuthService } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user = new ReplaySubject<User | null>(1);
  public user$ = this.user.asObservable();

  public isLoggedIn$ = this.user$.pipe(map((user) => user !== null));

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private socialAuthService: SocialAuthService
  ) {}

  registrer(user: User) {
    return this.http.post(`${environment.BASE_URL}/registration`, user);
  }

  registrerWithGoogle(user: { name: string; email: string }) {
    return this.http
      .post<{ user: User; accessToken: string }>(
        `${environment.BASE_URL}/registration-with-google`,
        user,
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(({ user, accessToken }) => {
          this.tokenService.saveToken(accessToken);
          this.user.next(user);
        })
      );
  }

  activate(token: string): Observable<{ user: User; accesToken: string }> {
    return this.http.get<{ user: User; accesToken: string }>(
      `${environment.BASE_URL}/activation/${token}`
    );
  }

  login(user: User) {
    return this.http
      .post<{ user: User; accessToken: string }>(
        `${environment.BASE_URL}/login`,
        user,
        { withCredentials: true }
      )
      .pipe(
        tap(({ user, accessToken }) => {
          this.tokenService.saveToken(accessToken);
          this.user.next(user);
        })
      );
  }

  refresh() {
    return this.http
      .get<{ user: User; accessToken: string }>(
        `${environment.BASE_URL}/refresh`,
        {
          withCredentials: true,
        }
      )
      .pipe(
        tap(({ user, accessToken }) => {
          this.tokenService.saveToken(accessToken);
          this.user.next(user);
        }),
        catchError((error) => {
          this.user.next(null);
          return throwError(() => error);
        })
      );
  }

  logout() {
    return this.http
      .post(`${environment.BASE_URL}/logout`, null, { withCredentials: true })
      .pipe(
        tap(() => {
          this.user.next(null);
          this.tokenService.removeToken();
          this.socialAuthService.signOut();
        })
      );
  }

  restorePasswordEmailPart(email: string) {
    return this.http.post(
      `${environment.BASE_URL}/restore-password-email-part`,
      { email }
    );
  }

  checkRestoreCode(restoreCode: string) {
    return this.http.post(`${environment.BASE_URL}/check-restore-code`, {
      restoreCode,
    });
  }

  changePassword(email: string, password: string) {
    return this.http.post(`${environment.BASE_URL}/change-password`, {
      email,
      password,
    });
  }

  updateUserData(user: User) {
    this.user.next(user);
  }
}
