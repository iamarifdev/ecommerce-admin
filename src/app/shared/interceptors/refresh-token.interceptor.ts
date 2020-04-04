import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { switchMap, filter, take, catchError, finalize, share } from 'rxjs/operators';

import { AuthService } from '../../auth/auth.service';
import { StorageService } from '../services';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  refreshTokenInProgress = false;
  refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private authService: AuthService, private storageService: StorageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: any) => {
        if (request.url.includes('token/refresh') || request.url.includes('login')) {
          if (request.url.includes('token/refresh')) {
            return this.logoutUser({ error: 'Unhandled api request error' });
          }
          return throwError(error);
        }
        if (error instanceof HttpErrorResponse) {
          // Unauthorized & Refresh Token
          if (error.status === 401) {
            return this.handle401Error(request, next);
            // Forbidden
          } else if (error.status === 403) {
            return this.logoutUser({ error: 'Access forbidden' });
          }
        }
        return throwError(error);
      })
    );
  }

  handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.refreshTokenInProgress) {
      this.refreshTokenInProgress = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshSecurityTokenPair().pipe(
        switchMap((response) => {
          if (response && response.result) {
            this.storageService.saveAccessToken(response.result.accessToken);
            this.storageService.saveRefreshToken(response.result.refreshToken);
            this.refreshTokenSubject.next(response.result.accessToken);
            return next.handle(this.addToken(request, response.result.accessToken));
          }
          return this.logoutUser({ error: 'No refresh token response' });
        }),
        catchError((error) => this.logoutUser(error)),
        finalize(() => (this.refreshTokenInProgress = false))
      );
    } else {
      return this.refreshTokenSubject.pipe(
        share(),
        filter((token) => token != null),
        take(1),
        switchMap((token) => next.handle(this.addToken(request, token)))
      );
    }
  }

  private addToken(request: HttpRequest<any>, accessToken: string): HttpRequest<any> {
    if (!accessToken) {
      return request;
    }
    return request.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` },
    });
  }

  private logoutUser(error: any): Observable<HttpEvent<any>> {
    this.authService.logout().subscribe();
    return throwError(error);
  }
}
