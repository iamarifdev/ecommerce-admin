import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { environment } from '../../../../environments/environment';
import { UtilityService } from '../../../shared/services';
import { IProductListItem, IProduct } from '../models';
import { ProductsService } from '../products.service';
import { DragDropFileUploadComponent } from '../../../../app/core/drag-drop-file-upload/drag-drop-file-upload.component';

@Component({
  selector: 'product-color-images',
  templateUrl: './product-color-images.component.html',
  styleUrls: ['./product-color-images.component.scss']
})
export class ProductColorImagesComponent implements OnInit {
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
    private utilityService: UtilityService,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
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

  filterImagesByColor() {
    if (this.product && this.product.productColors) {
      debugger;
      this.uploadedImages = this.product.productColors.find(f=> f.colorCode === this.selectedColor).images || [];
    }
  }

  getProductDetail() {
    this.productsService.getProductById(this.productListItem.id).subscribe(response => {
      if (response.success && response.result) {
        this.product = response.result;
        this.filterImagesByColor();
      }
    });
  }

  changeColor() {
    if (this.selectedColor) {
      const colorCode = this.selectedColor.replace('#', '');
      this.uploadUrl = `${environment.API_BASE}/products/${this.productListItem.id}/upload/images/${colorCode}`;
      this.filterImagesByColor();
    } else {
      this.uploadUrl = null;
    }
  }

  updateImages() {
    if (this.uploader.fileList.length) {
      this.uploader.uploadImages(() => {
        this.utilityService.openSuccessSnackBar('Images uploaded successfully!');
        this.getProductDetail();
      });
    }
  }
}
