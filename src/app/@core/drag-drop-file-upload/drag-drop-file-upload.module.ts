import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { DragDropFileUploadComponent } from './drag-drop-file-upload.component';
import { DragDropFileUploadService } from './drag-drop-file-upload.service';
import { DragDropFileUploadDirective } from './drag-drop-file-upload.directive';

@NgModule({
  imports: [
    CommonModule,
    MatProgressBarModule
  ],
  declarations: [DragDropFileUploadComponent, DragDropFileUploadDirective],
  exports: [DragDropFileUploadComponent],
  providers: [DragDropFileUploadService]
})
export class DragDropFileUploadModule { }
