import { Component, OnInit, ViewChild, AfterViewInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { startWith, delay, tap } from 'rxjs/operators';

import { HeaderMenuService } from '../../../services/header-menu.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { PaginatedDataSource } from './../../../base/paginated-datasource';
import { IProductListItem, IProduct } from '../models';
import { ProductsService } from '../products.service';
import { ProductColorImagesComponent } from '../product-color-images/product-color-images.component';

@Component({
  selector: 'product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, AfterViewInit {
  public dataSource: PaginatedDataSource<IProductListItem>;

  public displayedColumns = [
    'sl',
    'featureImageUrl',
    'title',
    'description',
    'sku',
    'manufactureDetail',
    'pricing',
    'createdAt',
    'updatedAt',
    'isEnabled',
    'action'
  ];

  public activeOptions = [
    {
      name: 'All Products',
      value: true
    },
    {
      name: 'Active Products',
      value: false
    }
  ];

  public shouldLoadAll = false;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private utilService: UtilityService,
    private headerMenuService: HeaderMenuService,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    this.headerMenuService.setHeaderMenu({ title: 'Product List', subtitle: 'Products' });
    this.dataSource = new PaginatedDataSource(this.productsService);
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

  updateProductColorImages(productListItem: IProductListItem) {
    const dialogRef = this.dialog.open(ProductColorImagesComponent, {
      height: '400px',
      width: '600px',
      disableClose: true
    });

    dialogRef.componentInstance.productListItem = productListItem;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.update(productListItem.id, result);
      }
    });
  }

  changeEnableStatus(product: IProduct, templateRef: TemplateRef<any>, event) {
    const status = event.checked;

    const dialogRef = this.dialog.open(templateRef, {
      backdropClass: 'delete-confirmation-box',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productsService.toggoleActivation(product, status).subscribe(
          res => {
            this.utilService.openSuccessSnackBar(res.message);
          },
          err => {
            const prevProduct = this.dataSource.get(product.id);
            prevProduct.isEnabled = !status;
            this.dataSource.update(product.id, prevProduct);
            this.utilService.openErrorSnackBar(err.error.message);
          }
        );
      } else {
        const prevProduct = this.dataSource.get(product.id);
        prevProduct.isEnabled = !status;
        this.dataSource.update(product.id, prevProduct);
      }
    });
  }

  navigateAddProduct() {
    this.router.navigate(['/products/add']);
  }

  navigateUpdateProduct(product: IProduct) {
    this.router.navigate(['products/edit', product.id]);
  }

  deleteProduct(product: IProduct, templateRef: TemplateRef<any>) {
    const dialogRef = this.dialog.open(templateRef, {
      width: '400px',
      backdropClass: 'delete-confirmation-box',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productsService.remove(product.id).subscribe(
          res => {
            this.dataSource.remove(product.id);
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
