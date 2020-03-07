import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { tap, startWith, delay } from 'rxjs/operators';

import { Role } from '../models/role.model';
import { UtilityService } from '../../../../app/shared/services';
import { PaginatedDataSource } from '../../../../app/base/paginated-datasource';
import { HeaderMenuService } from '../../../../app/services/header-menu.service';
import { RolesService } from '../roles.service';
import { RoleAddComponent } from '../role-add/role-add.component';
import { RoleEditComponent } from '../role-edit/role-edit.component';

@Component({
  selector: 'role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss']
})
export class RoleListComponent implements OnInit, AfterViewInit {
  dataSource: PaginatedDataSource<Role>;

  displayedColumns = ['sl', 'name', 'description', 'isEnabled', 'action'];

  activeOptions = [
    {
      name: 'All Roles',
      value: true
    },
    {
      name: 'Active Roles',
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
    private rolesService: RolesService
  ) {}

  ngOnInit() {
    this.headerMenuService.setHeaderMenu({ title: 'Role List', subtitle: 'Role' });
    this.dataSource = new PaginatedDataSource(this.rolesService);
    // this.dataSource.load();
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

  changeEnableStatus(role: Role, templateRef: TemplateRef<any>, event) {
    const status = event.checked;

    const dialogRef = this.dialog.open(templateRef, {
      backdropClass: 'delete-confirmation-box',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rolesService.toggoleActivation(role, status).subscribe(
          res => {
            this.utilService.openSuccessSnackBar(res.message);
          },
          err => {
            const prevRole = this.dataSource.get(role['id']);
            prevRole.isEnabled = !status;
            this.dataSource.update(role['id'], prevRole);

            this.utilService.openErrorSnackBar(err.error.message);
          }
        );
      } else {
        const prevRole = this.dataSource.get(role['id']);
        prevRole.isEnabled = !status;
        this.dataSource.update(role['id'], prevRole);
      }
    });
  }

  addRole() {
    const dialogRef = this.dialog.open(RoleAddComponent, {
      height: '400px',
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.add(result);
      }
    });
  }

  updateRole(role: Role) {
    const dialogRef = this.dialog.open(RoleEditComponent, {
      height: '400px',
      width: '600px',
      disableClose: true
    });

    dialogRef.componentInstance.role = role;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.update(role.id, result);
      }
    });
  }

  deleteRole(role: Role, templateRef: TemplateRef<any>) {
    const dialogRef = this.dialog.open(templateRef, {
      width: '400px',
      backdropClass: 'delete-confirmation-box',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rolesService.remove(role.id).subscribe(
          res => {
            this.dataSource.remove(role.id);
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
