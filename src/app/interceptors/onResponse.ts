import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === 401 && !error.url?.includes('refresh')) {
          return this.authService.refresh().pipe(
            switchMap(({ accessToken }) => {
              this.tokenService.saveToken(accessToken);
              const newRequest = request.clone({
                setHeaders: { Authorization: `Bearer ${accessToken}` },
              });
              return next.handle(newRequest);
            }),
            catchError((error) => {
              // Handle refresh token failure
              return throwError(error);
            })
          );
        }
        return throwError(error);
      })
    );
  }
}
