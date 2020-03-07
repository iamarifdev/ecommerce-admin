import { Injectable } from '@angular/core';

import { AuthUser } from '../../models/auth-user.model';

@Injectable()
export class StorageService {
  constructor() {}

  getUser(): AuthUser {
    return JSON.parse(window.localStorage.getItem('authUser'));
  }

  saveUser(user: AuthUser) {
    window.localStorage.setItem('authUser', JSON.stringify(user));
  }

  getAccessToken(): string {
    return window.localStorage['accessToken'];
  }

  saveAccessToken(accessToken: string) {
    window.localStorage['accessToken'] = accessToken;
  }

  getRefreshToken(): string {
    return window.localStorage['refreshToken'];
  }

  saveRefreshToken(refreshToken: string) {
    window.localStorage['refreshToken'] = refreshToken;
  }

  getACL(): any {
    if (window.localStorage.getItem('acl')) {
      return JSON.parse(window.localStorage.getItem('acl'));
    }
    return undefined;
  }

  saveACL(acl: any) {
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
    const index = ['en', 'bd'].indexOf(window.localStorage['languageCode']);
    return index >= 0 ? window.localStorage['languageCode'] : 'en';
  }

  setLanguageCode(lanCode: string) {
    const index = ['en', 'bd'].indexOf(lanCode);

    if (index >= 0) {
      window.localStorage['languageCode'] = lanCode;
      return;
    }
    window.localStorage['languageCode'] = 'en';
  }

  destroyAll() {
    const language = this.getLanguageCode();
    window.localStorage.clear();
    this.setLanguageCode(language);
  }
}
