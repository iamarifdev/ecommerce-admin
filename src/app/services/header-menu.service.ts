import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HeaderMenu } from '../models/header-menu.model';

@Injectable()
export class HeaderMenuService {
  private headerMenuSubject = new BehaviorSubject<HeaderMenu>({} as HeaderMenu);

  constructor() {}

  public get headerMenu() {
    return this.headerMenuSubject.value;
  }

  public get headerMenu$() {
    return this.headerMenuSubject.asObservable();
  }

  setHeaderMenu(headerMenu: HeaderMenu) {
    this.headerMenuSubject.next(headerMenu);
  }
}
