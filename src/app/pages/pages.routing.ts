import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { AuthGuard } from '../shared/services/auth.guard';

export const PagesRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
    // canActivate: [AuthGuard]
  },
  {
    path: 'roles',
    loadChildren: () => import('./roles/roles.module').then(m => m.RolesModule)
    // canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
    // canActivate: [AuthGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
    // canActivate: [AuthGuard]
  }
];
