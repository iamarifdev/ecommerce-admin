import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { UtilityService, AsyncService } from '../../../shared/services';
import { HeaderMenuService } from '../../../services/header-menu.service';
import { ProductsService } from '../products.service';

@Component({
  selector: 'product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {
  public productAddForm: FormGroup;

  public sizes: number[] = [];

  @ViewChild('featureImage', { static: true }) featureImage: ElementRef;

  constructor(
    public asyncService: AsyncService,
    private fb: FormBuilder,
    private router: Router,
    private headerMenuService: HeaderMenuService,
    private utilService: UtilityService,
    private productsService: ProductsService
  ) {
    this.sizes = Array(15)
      .fill(30)
      .map((x, y) => x + y);
  }

  ngOnInit() {
    this.productAddForm = this.fb.group({
      sku: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', Validators.required],
      manufactureDetail: this.fb.group({
        modelNo: ['', Validators.required],
        releaseDate: [new Date(), Validators.required]
      }),
      productColors: this.fb.array([this.createProductColor()]),
      pricing: this.fb.group({
        price: [0, [Validators.required, Validators.min(1)]]
      }),
      featureImage: [null],
      isEnabled: [true, Validators.required]
    });
    this.headerMenuService.setHeaderMenu({ title: 'Add Product', subtitle: 'Products', goBack: true });
  }

  get manufactureDetail(): FormGroup {
    return this.productAddForm.get('manufactureDetail') as FormGroup;
  }

  get pricing(): FormGroup {
    return this.productAddForm.get('pricing') as FormGroup;
  }

  createProductColor(): FormGroup {
    return this.fb.group({
      colorCode: ['', [Validators.required, Validators.pattern(/^#([A-Fa-f0-9]{3}){1,2}\b/)]],
      colorName: ['', Validators.required],
      inStock: [0, Validators.min(0)],
      isAvailable: [false],
      // images: [null],
      sizes: [null, Validators.required]
    });
  }

  addMoreProductColor() {
    this.productColors.push(this.createProductColor());
  }

  removeProductColor(index: number) {
    this.productColors.removeAt(index);
  }

  get productColors(): FormArray {
    return this.productAddForm.get('productColors') as FormArray;
  }

  getProductColorControl(index: number) {
    return this.productColors.controls[index];
  }

  changeInStock(event: any, index: number) {
    const isAvailableControl = this.getProductColorControl(index).get('isAvailable');
    isAvailableControl.patchValue(!!parseFloat(event.target.value));
  }

  changeAvailibilty(event: MatCheckboxChange, index: number) {
    if (!event.checked) {
      const inStockControl = this.getProductColorControl(index).get('inStock');
      inStockControl.patchValue(0);
    }
  }

  addProduct() {
    if (this.productAddForm.valid) {
      this.asyncService.start();
      const { featureImage, ...data } = this.productAddForm.value;
      this.productsService.addProduct(data).subscribe(
        response => {
          if (response.success && response.result) {
            this.utilService.openSuccessSnackBar('Product added succesfully!');
            this.asyncService.finish();
            if (featureImage) {
              const product = response.result;
              this.uploadFeatureImage(product.id);
            } else {
              this.router.navigate(['/products']);
            }
          }
        },
        error => {
          this.asyncService.finish();
        }
      );
    }
  }

  uploadFeatureImage(productId: string) {
    const element = this.featureImage.nativeElement;
    if (element.files && element.files[0]) {
      this.asyncService.start();
      const file = element.files[0];
      this.productsService.uploadFeatureImage(productId, file).subscribe(
        response => {
          if (response.success && response.result) {
            this.utilService.openSuccessSnackBar('Product feature image uploaded!');
            this.router.navigate(['/products']);
          }
          this.asyncService.finish();
        },
        error => {
          this.asyncService.finish();
        }
      );
    }
  }
}
