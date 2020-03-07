import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import { DialogData } from '../../models/dialog-data.model';

@Component({
  selector: 'dialog',
  template: `
    <h1 mat-dialog-title>{{ title }}</h1>
    <div mat-dialog-content>
      <p *ngIf="content">{{ content }}</p>
      <ng-container *ngIf="component" [ngComponentOutlet]="component"></ng-container>
    </div>
    <div mat-dialog-actions class="text-right mb-0 pb-0 mat-dialog-actions-custom">
      <button mat-raised-button color="primary" [mat-dialog-close]="true" color="primary" tabindex="2">
        {{ 'APP.YES' }}
      </button>
      <button mat-raised-button [mat-dialog-close]="false" tabindex="-1">
        {{ 'APP.NO' }}
      </button>
    </div>
  `
})
export class ConfirmationDialogComponent implements OnInit {
  title: string;
  content: string;
  component: ComponentType<any>;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit() {
    this.title = this.data.title;
    if (this.data.content) this.content = this.data.content;
    if (this.data.component) this.component = this.data.component;
  }
}
