import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  static tokenKey = 'accessToken';

  getToken() {
    return localStorage.getItem(TokenService.tokenKey);
  }

  saveToken(token: string) {
    localStorage.setItem(TokenService.tokenKey, token);
  }

  removeToken() {
    localStorage.removeItem(TokenService.tokenKey);
  }
}
