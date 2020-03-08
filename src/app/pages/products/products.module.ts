import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductAddComponent } from './product-add/product-add.component';
import { ProductsService } from './products.service';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'list' },
  { path: 'list', component: ProductListComponent },
  { path: 'add', component: ProductAddComponent },
  { path: 'edit/:id', component: ProductEditComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [ProductListComponent, ProductAddComponent, ProductEditComponent],
  providers: [ProductsService]
})
export class ProductsModule {}
