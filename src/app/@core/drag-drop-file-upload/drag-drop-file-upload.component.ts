import { Component, Input } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import { DragDropFileUploadService } from './drag-drop-file-upload.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'drag-drop-file-upload',
  templateUrl: './drag-drop-file-upload.component.html',
  styleUrls: ['./drag-drop-file-upload.component.scss']
})
export class DragDropFileUploadComponent {
  fileList = [];
  imageList = [];
  msg: string;
  progress = 0;

  @Input() uploadOnDemand = false;
  @Input() fileKey = 'images';
  @Input() clearAfterUpload = false;
  @Input() uploadUrl: string;

  constructor(private sanitizer: DomSanitizer, private dragdropService: DragDropFileUploadService) {}

  processFilesToUpload(event: any) {
    const fileListAsArray = Array.from(event);
    fileListAsArray.forEach((item, i) => {
      const inputElement = event as HTMLInputElement;
      const url = URL.createObjectURL(inputElement[i]);
      this.imageList.push(url);
      this.fileList.push({ item, url });
    });

    if (!this.uploadOnDemand) {
      this.uploadImages().subscribe();
    }
  }

  uploadImages() {
    if (!this.uploadUrl) {
      console.error('No upload url is passed.');
      return;
    }
    const images = this.fileList.map(i => i.item);
    return this.dragdropService.addFiles(this.uploadUrl, this.fileKey, images).pipe(
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            console.log('Request has been made!');
            break;
          case HttpEventType.ResponseHeader:
            console.log('Response header has been received!');
            break;
          case HttpEventType.UploadProgress:
            this.progress = Math.round((event.loaded / event.total) * 100);
            console.log(`Uploaded! ${this.progress}%`);
            break;
          case HttpEventType.Response:
            console.log('File uploaded successfully!', event.body);
            if (this.clearAfterUpload) {
              setTimeout(() => {
                this.progress = 0;
                this.fileList = [];
                this.msg = '';
              });
            }
            this.msg = 'Files uploaded successfully!';
        }
        return event;
      })
    );
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
}
