import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { StorageService } from './storage.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private storageService: StorageService) {}

  private isAuthenticated(): boolean {
    const accessToken = this.storageService.getAccessToken();
    return !!accessToken;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isAuthenticated()) {
      return true;
    } else {
      this.router.navigateByUrl('/auth/login');
      return false;
    }
  }
}
