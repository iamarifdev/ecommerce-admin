import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

import { environment } from '../../../../environments/environment';
import { IProductListItem, IProduct } from '../models';
import { DragDropFileUploadComponent } from '../../../@core/drag-drop-file-upload/drag-drop-file-upload.component';
import { UtilityService, AsyncService } from '../../../shared/services';
import { ProductsService } from '../products.service';

@Component({
  selector: 'product-color-images',
  templateUrl: './product-color-images.component.html',
  styleUrls: ['./product-color-images.component.scss']
})
export class ProductColorImagesComponent implements OnInit, OnDestroy {
  productColorImagesForm: FormGroup;
  productListItem: IProductListItem;
  product: IProduct;
  uploadedImages: string[] = [];
  selectedColor: string;
  uploadUrl: string;

  @ViewChild('uploader', { static: true }) uploader: DragDropFileUploadComponent;

  constructor(
    public dialogRef: MatDialogRef<ProductColorImagesComponent>,
    private fb: FormBuilder,
    public asyncService: AsyncService,
    private utilityService: UtilityService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    const { productColors } = this.productListItem;
    if (productColors && productColors.length) {
      this.selectedColor = productColors[0].colorCode;
    }
    this.productColorImagesForm = this.fb.group({
      colorCode: [this.selectedColor, Validators.required]
    });
    this.changeColor();
    this.getProductDetail();
  }

  filterImagesByColor(): void {
    if (this.product && this.product.productColors) {
      this.uploadedImages = this.product.productColors.find(f=> f.colorCode === this.selectedColor).images || [];
    }
  }

  getProductDetail(): void {
    this.asyncService.start();
    this.productsService.getProductById(this.productListItem.id).subscribe(response => {
      if (response.success && response.result) {
        this.product = response.result;
        this.filterImagesByColor();
      }
      this.asyncService.finish();
    }, error => {
      this.asyncService.finish();
    });
  }

  changeColor(): void {
    if (this.selectedColor) {
      const colorCode = this.selectedColor.replace('#', '');
      this.uploadUrl = `${environment.API_BASE}/products/${this.productListItem.id}/upload/images/${colorCode}`;
      this.filterImagesByColor();
    } else {
      this.uploadUrl = null;
    }
  }

  updateImages(): void {
    if (this.uploader.fileList.length) {
      this.asyncService.start();
      this.uploader.uploadImages().subscribe((response) => {
        if(response.type === HttpEventType.Response) {
          this.asyncService.finish();
          this.utilityService.openSuccessSnackBar('Images uploaded successfully!');
          this.getProductDetail();
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.asyncService) {
      this.asyncService.finish();
    }
  }
}
