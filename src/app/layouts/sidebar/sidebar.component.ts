import { ChangeDetectorRef, Component, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { delay, startWith } from 'rxjs/operators';

import { NavigationList } from '../../data/navigation-list.data';
import { NavItem } from '../../models/nav-item.model';
import { NavService } from '../../../app/services/nav.service';
import { HeaderMenu } from './../../models/header-menu.model';
import { HeaderMenuService } from '../../services/header-menu.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements AfterViewInit, OnDestroy {
  @ViewChild('appDrawer', { static: false }) appDrawer: MatSidenav;
  mobileQuery: MediaQueryList;
  navItems: NavItem[] = NavigationList.items;
  headerMenu: HeaderMenu = null;

  private mobileQueryListener: () => void;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private headerMenuService: HeaderMenuService,
    public navService: NavService
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    // tslint:disable-next-line: deprecation
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngAfterViewInit(): void {
    this.navService.appDrawer = this.appDrawer;
    this.headerMenuService.headerMenu$
      .pipe(startWith(null), delay(0))
      .subscribe(headerMenu => (this.headerMenu = headerMenu));
  }

  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }
}
