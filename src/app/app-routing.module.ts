import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { AuthGuard } from './shared/services';
import { LoginComponent } from './auth/login/login.component';
import { ForgetPasswordComponent } from './auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'forget-password',
        component: ForgetPasswordComponent
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent
      },
      {
        path: 'reset-password/:userType/:companyId',
        component: ResetPasswordComponent
      }
    ]
  },
  {
    path: '',
    component: SidebarComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
