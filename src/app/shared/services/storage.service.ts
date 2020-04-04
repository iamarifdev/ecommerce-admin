import { PLATFORM_ID, Inject, Injectable } from '@angular/core';
import { isPlatformServer } from '@angular/common';

import { AuthUser } from '../../models/auth-user.model';

@Injectable()
export class StorageService {
  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  getUser(): AuthUser {
    if (isPlatformServer(this.platformId)) return null;
    return JSON.parse(window.localStorage.getItem('authUser'));
  }

  saveUser(user: AuthUser) {
    if (isPlatformServer(this.platformId)) return;
    window.localStorage.setItem('authUser', JSON.stringify(user));
  }

  getAccessToken(): string {
    if (isPlatformServer(this.platformId)) return null;
    return window.localStorage.getItem('accessToken');
  }

  saveAccessToken(accessToken: string) {
    if (isPlatformServer(this.platformId)) return;
    window.localStorage.setItem('accessToken', accessToken);
  }

  getRefreshToken(): string {
    if (isPlatformServer(this.platformId)) return null;
    return window.localStorage.getItem('refreshToken');
  }

  saveRefreshToken(refreshToken: string) {
    if (isPlatformServer(this.platformId)) return;
    window.localStorage.setItem('refreshToken', refreshToken);
  }

  getACL(): any {
    if (isPlatformServer(this.platformId)) return null;
    if (window.localStorage.getItem('acl')) {
      return JSON.parse(window.localStorage.getItem('acl'));
    }
    return undefined;
  }

  saveACL(acl: any) {
    if (isPlatformServer(this.platformId)) return;
    window.localStorage.setItem('acl', JSON.stringify(acl));
  }

  hasKey(key: string) {
    try {
      return Object.keys(window.localStorage).indexOf(key) !== -1;
    } catch (e) {
      return false;
    }
  }

  getLanguageCode(): string {
    if (isPlatformServer(this.platformId)) return null;
    const index = ['en', 'bd'].indexOf(window.localStorage['languageCode']);
    return index >= 0 ? window.localStorage['languageCode'] : 'en';
  }

  setLanguageCode(lanCode: string) {
    if (isPlatformServer(this.platformId)) return;
    const index = ['en', 'bd'].indexOf(lanCode);

    if (index >= 0) {
      window.localStorage.setItem('languageCode', lanCode);
      return;
    }
    window.localStorage.setItem('languageCode', 'en');
  }

  destroyAll() {
    if (isPlatformServer(this.platformId)) return;
    const language = this.getLanguageCode();
    window.localStorage.clear();
    this.setLanguageCode(language);
  }
}
