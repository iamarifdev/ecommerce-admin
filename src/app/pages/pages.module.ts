import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { PagesRoutes } from './pages.routing';
import { HomeComponent } from './home/home.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PagesRoutes),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [HomeComponent]
})
export class PagesModule {}
