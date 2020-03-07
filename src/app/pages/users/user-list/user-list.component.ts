import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { tap, startWith, delay } from 'rxjs/operators';

import { User } from '../models/user.model';
import { UsersService } from '../users.service';
import { UtilityService } from '../../../../app/shared/services';
import { PaginatedDataSource } from '../../../../app/base/paginated-datasource';
import { HeaderMenuService } from '../../../../app/services/header-menu.service';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserAddComponent } from '../user-add/user-add.component';

@Component({
  selector: 'user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit, AfterViewInit {
  dataSource: PaginatedDataSource<User>;

  displayedColumns = [
    'sl',
    'fullName',
    'username',
    'role',
    'email',
    'phoneNumbers',
    'remarks',
    'createdAt',
    'isEnabled',
    'action'
  ];

  activeOptions = [
    {
      name: 'All Users',
      value: true
    },
    {
      name: 'Active Users',
      value: false
    }
  ];
  shouldLoadAll = false;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private utilService: UtilityService,
    private headerMenuService: HeaderMenuService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.headerMenuService.setHeaderMenu({ title: 'User List', subtitle: 'User' });
    this.dataSource = new PaginatedDataSource(this.usersService);
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(
        startWith(null),
        delay(0),
        tap(() => {
          this.dataSource.pageSize = this.paginator.pageSize;
          this.dataSource.load(this.paginator.pageIndex);
        })
      )
      .subscribe();
  }

  onSelectChange() {
    this.dataSource.load(0, this.shouldLoadAll);
  }

  changeEnableStatus(user: User, templateRef: TemplateRef<any>, event) {
    const status = event.checked;

    const dialogRef = this.dialog.open(templateRef, {
      backdropClass: 'delete-confirmation-box',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersService.toggoleActivation(user, status).subscribe(
          res => {
            this.utilService.openSuccessSnackBar(res.message);
          },
          err => {
            const prevUser = this.dataSource.get(user['id']);
            prevUser.isEnabled = !status;
            this.dataSource.update(user['id'], prevUser);

            this.utilService.openErrorSnackBar(err.error.message);
          }
        );
      } else {
        const prevUser = this.dataSource.get(user['id']);
        prevUser.isEnabled = !status;
        this.dataSource.update(user['id'], prevUser);
      }
    });
  }

  addUser() {
    const dialogRef = this.dialog.open(UserAddComponent, {
      height: '600px',
      width: '800px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.add(result);
      }
    });
  }

  updateUser(user: User) {
    const dialogRef = this.dialog.open(UserEditComponent, {
      height: '600px',
      width: '800px',
      disableClose: true
    });

    dialogRef.componentInstance.user = user;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.update(user.id, result);
      }
    });
  }

  deleteUser(user: User, templateRef: TemplateRef<any>) {
    const dialogRef = this.dialog.open(templateRef, {
      width: '400px',
      backdropClass: 'delete-confirmation-box',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usersService.remove(user.id).subscribe(
          res => {
            this.dataSource.remove(user.id);
            this.utilService.openSuccessSnackBar(res.message);
          },
          err => {
            this.utilService.openErrorSnackBar(err.error.message);
          }
        );
      }
    });
  }
}
