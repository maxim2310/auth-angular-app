import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, tap } from 'rxjs';
import { User } from '../models/User';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {  }

  private users = new BehaviorSubject<User[] | null>(null);
  public users$ = this.users.asObservable();

  getUsers() {
    return this.http.get<User[]>(`${environment.BASE_URL}/users`).pipe(
      tap(user => this.users.next(user))
    )
  }

  updateUser(userId: string, userData: {name: string, email: string, currentPassword: string, newPassword: string, replayPassword: string}) {
    return this.http.patch<User>(`${environment.BASE_URL}/users/${userId}`, userData)
  }
}
