import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  BASE_URL = 'http://localhost:5000';

  private user = new BehaviorSubject<User | null>(null);
  public user$ = this.user.asObservable();

  constructor(private http: HttpClient) {
    this.user$.subscribe((v) => console.log(v));
  }

  registrer(user: User) {
    return this.http.post(`${this.BASE_URL}/registration`, user);
  }

  activate(token: string): Observable<{ user: User; accesToken: string }> {
    return this.http.get<{ user: User; accesToken: string }>(
      `${this.BASE_URL}/activation/${token}`
    );
  }

  login(user: User) {
    return this.http
      .post<{ user: User; accesToken: string }>(`${this.BASE_URL}/login`, user)
      .pipe(tap((res) => this.user.next(res.user)));
  }
}
