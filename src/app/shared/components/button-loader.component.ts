import { Input, Component } from '@angular/core';

@Component({
  selector: 'button-loader',
  template: `
    <mat-icon *ngIf="loading">
      <mat-progress-spinner [diameter]="size" mode="indeterminate"></mat-progress-spinner>
    </mat-icon>
  `,
})
export class ButtonLoaderComponent {
  @Input() loading = false;
  @Input() size = 20;
}
