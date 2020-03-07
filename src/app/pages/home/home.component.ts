import { Component, OnInit } from '@angular/core';
import { HeaderMenuService } from '../../../app/services/header-menu.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private headerMenuService: HeaderMenuService) {}

  ngOnInit() {
    this.headerMenuService.setHeaderMenu({ title: 'Home' });
  }
}
