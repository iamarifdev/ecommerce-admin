import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { switchMap, filter, take, catchError, finalize, share } from 'rxjs/operators';

import { RefreshToken } from './../../models/refresh-token.model';
import { ApiResponse } from './../../models/api-response.model';
import { StorageService, ApiService } from '../services';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  isRefreshing = false;
  refreshTokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private router: Router, private apiService: ApiService, private storageService: StorageService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          // Unauthorized & Refresh Token
          if (error.status === 401) {
            this.handle401Error(request, next);
            // Forbidden
          } else if (error.status === 403) {
            this.logoutUser();
          }
        }
        return throwError(error);
      })
    );
  }

  handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.refreshToken()
        .pipe(
          switchMap(response => {
            if (response && response.result) {
              this.storageService.saveAccessToken(response.result.accessToken);
              this.storageService.saveRefreshToken(response.result.refreshToken);
              this.refreshTokenSubject.next(response.result.accessToken);
              return next.handle(this.addToken(request, response.result.accessToken));
            }
            return this.logoutUser();
          }),
          catchError(error => this.logoutUser()),
          finalize(() => (this.isRefreshing = false))
        )
        .subscribe();
    } else {
      return this.refreshTokenSubject
        .pipe(
          share(),
          filter(token => token != null),
          take(1),
          switchMap(token => next.handle(this.addToken(request, token)))
        )
        .subscribe();
    }
  }

  private addToken(request: HttpRequest<any>, accessToken: string) {
    return request.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
  }

  private logoutUser() {
    this.storageService.destroyAll();
    this.router.navigateByUrl('/auth/login');
    return throwError({});
  }

  refreshToken() {
    const user = this.storageService.getUser();
    const refreshToken = this.storageService.getRefreshToken();
    const accessToken = this.storageService.getAccessToken();

    return this.apiService.post<ApiResponse<RefreshToken>>('/auth/token/refresh', {
      userId: user.userId,
      accessToken,
      refreshToken
    });
  }
}
