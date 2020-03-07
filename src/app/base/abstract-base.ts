import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Injector, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { UtilityService } from '../shared/services/utility.service';
import { StorageService } from '../shared/services/storage.service';

export abstract class AbstractBase {
  val = 50;
  min = 0;
  max = 100;
  objectList = [];
  dataSource = new MatTableDataSource<any>();
  displayedColumns = [];

  baseURL = '';
  listURL = null;
  deleteURL = null;

  companyId: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  storageService: StorageService;
  httpService: HttpClient;
  dialog: MatDialog;
  utilService: UtilityService;

  constructor(public injector: Injector) {
    this.storageService = injector.get(StorageService);
    this.dialog = injector.get(MatDialog);
    this.utilService = injector.get(UtilityService);
    this.httpService = injector.get(HttpClient);
    this.displayedColumns = this.getDisplayedColumns();
  }

  getList() {
    this.httpService.get(this.listURL || this.getListingURL()).subscribe((res: any) => {
      this.objectList = res.result.items;
      this.dataSource.data = this.objectList;
    });
  }

  deleteObject(object, statusDialog) {
    const dialogRef = this.dialog.open(statusDialog, {
      backdropClass: 'delete-confirmation-box',
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.objectList.map(item => item.id).indexOf(object.id);
        this.httpService.delete(this.deleteURL || this.getDeleteURL(object.id)).subscribe(
          (res: any) => {
            this.objectList.splice(index, 1);
            this.dataSource.data = this.objectList;
            this.utilService.openSuccessSnackBar(res.message);
          },
          err => {
            this.utilService.openSuccessSnackBar(err.error.message);
          }
        );
      }
    });
  }

  protected getListingURL(): string {
    // const currentCompany = this.storageService.getCurrentCompany();
    // this.companyId = currentCompany;
    return `${this.baseURL}/list/`;
  }

  protected getDeleteURL(id): string {
    return `${this.baseURL}/${id}`;
  }

  abstract getDisplayedColumns();
}
