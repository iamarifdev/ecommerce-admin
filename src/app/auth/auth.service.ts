import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';

import { ApiService, StorageService } from '../shared/services';
import { ApiResponse } from '../models/api-response.model';
import { AuthUser } from '../models/auth-user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly storageService: StorageService
  ) {}

  private _authUser: AuthUser;

  authenticate(username: string, password: string): Observable<ApiResponse<AuthUser>> {
    return this.apiService
      .post<ApiResponse<AuthUser>>('/auth/login', { username, password })
      .pipe(
        map(response => {
          if (response && response.success && response.result) {
            this.storageService.saveUser(response.result);
            this.storageService.saveAccessToken(response.result.accessToken);
            this.storageService.saveRefreshToken(response.result.refreshToken);
          }
          return response;
        })
      );
  }

  logout() {
    const { username, refreshToken } = this.storageService.getUser();
    return this.apiService
      .post<ApiResponse>('/auth/logout', { username, refreshToken })
      .pipe(
        first(),
        map(response => {
          if (response && response.success) {
            this.storageService.destroyAll();
            this.router.navigateByUrl('/auth/login');
          }
          return response;
        })
      );
  }

  get authUser(): AuthUser {
    if (this._authUser) return this._authUser;
    else {
      this._authUser = this.storageService.getUser();
      return this._authUser;
    }
  }

  set authUser(authUser: AuthUser) {
    this._authUser = authUser;
  }
}
