import { Component } from '@angular/core';

import { AsyncService } from '../services/async.service';

@Component({
  selector: 'progress-bar',
  template: `
    <div *ngIf="asyncService?.loading" class="progress-bar-container">
      <mat-progress-bar class="progress-bar" color="warn" mode="indeterminate"></mat-progress-bar>
    </div>
  `
})
export class ProgressBarComponent {
  constructor(public asyncService: AsyncService) {}
}
