import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { ProductsService } from '../products.service';
import { UtilityService } from '../../../shared/services/utility.service';
import { IProductListItem } from '../models';

@Component({
  selector: 'product-color-images',
  templateUrl: './product-color-images.component.html',
  styleUrls: ['./product-color-images.component.scss']
})
export class ProductColorImagesComponent implements OnInit {
  productColorImagesForm: FormGroup;
  productListItem: IProductListItem;

  constructor(
    public dialogRef: MatDialogRef<ProductColorImagesComponent>,
    private fb: FormBuilder,
    private utilService: UtilityService,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    this.productColorImagesForm = this.fb.group({
      images: [null, Validators.required]
    });
  }

  updateImages() {
    // TODO: implement
  }
}
