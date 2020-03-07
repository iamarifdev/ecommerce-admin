import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../app/shared/shared.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserActivityLogComponent } from './user-activity-log/user-activity-log.component';
import { UserScheduleJobComponent } from './user-schedule-job/user-schedule-job.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersService } from './users.service';

const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'edit/:id', component: UserEditComponent },
  { path: 'profile', component: UserProfileComponent }
];

@NgModule({
  declarations: [
    UserListComponent,
    UserAddComponent,
    UserEditComponent,
    UserActivityLogComponent,
    UserScheduleJobComponent,
    UserProfileComponent
  ],
  entryComponents: [
    UserListComponent,
    UserAddComponent,
    UserEditComponent
  ],
  imports: [RouterModule.forChild(routes), SharedModule],
  providers: [UsersService]
})
export class UsersModule {}
