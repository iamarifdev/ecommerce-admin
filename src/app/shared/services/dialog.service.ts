import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmationDialogComponent } from '../components';
import { DialogData } from '../../../app/models/dialog-data.model';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(public dialog: MatDialog) {}

  showConfirmationDialog<Result = any>(data: DialogData) {
    const dialogRef = this.dialog.open<ConfirmationDialogComponent, DialogData, Result>(ConfirmationDialogComponent, {
      width: '300px',
      data,
      backdropClass: 'delete-confirmation-box',
      disableClose: true
    });
    return dialogRef;
  }
}
