import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../app/shared/shared.module';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleAddComponent } from './role-add/role-add.component';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { RolesService } from './roles.service';

const routes: Routes = [
  { path: '', component: RoleListComponent },
  { path: 'edit/:id', component: RoleEditComponent }
];

@NgModule({
  declarations: [RoleListComponent, RoleAddComponent, RoleEditComponent],
  entryComponents: [RoleListComponent, RoleAddComponent, RoleEditComponent],
  imports: [RouterModule.forChild(routes), SharedModule],
  providers: [RolesService]
})
export class RolesModule {}
