import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { UtilityService, AsyncService } from '../../../shared/services';
import { HeaderMenuService } from '../../../services/header-menu.service';
import { ProductsService } from '../products.service';
import { IProduct } from '../models';

@Component({
  selector: 'product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit, OnDestroy {
  public productEditForm: FormGroup;
  public productId: string;
  public product: IProduct;

  public sizes: number[] = [];

  @ViewChild('featureImage', { static: true }) featureImage: ElementRef;

  constructor(
    public asyncService: AsyncService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private headerMenuService: HeaderMenuService,
    private utilService: UtilityService,
    private productsService: ProductsService
  ) {
    this.sizes = Array(15)
      .fill(30)
      .map((x, y) => x + y);
  }

  ngOnInit(): void {
    if (!this.route.snapshot.params.id) {
      this.router.navigate(['/products']);
      return;
    }
    this.productId = this.route.snapshot.params.id;
    this.productEditForm = this.fb.group({
      id: ['', Validators.required],
      sku: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', Validators.required],
      manufactureDetail: this.fb.group({
        modelNo: ['', Validators.required],
        releaseDate: [new Date(), Validators.required]
      }),
      productColors: this.fb.array([]),
      pricing: this.fb.group({
        price: [0, [Validators.required, Validators.min(1)]]
      }),
      featureImage: [null],
      featureImageUrl: [null],
      isEnabled: [true, Validators.required]
    });
    this.headerMenuService.setHeaderMenu({ title: 'Edit Product', subtitle: 'Products', goBack: true });
    this.getProduct();
  }

  get manufactureDetail(): FormGroup {
    return this.productEditForm.get('manufactureDetail') as FormGroup;
  }

  get pricing(): FormGroup {
    return this.productEditForm.get('pricing') as FormGroup;
  }

  createProductColor(): FormGroup {
    return this.fb.group({
      colorCode: ['', [Validators.required, Validators.pattern(/^#([A-Fa-f0-9]{3}){1,2}\b/)]],
      colorName: ['', Validators.required],
      inStock: [0, Validators.min(0)],
      isAvailable: [false],
      images: [null],
      sizes: [null, Validators.required]
    });
  }

  addMoreProductColor(): void {
    this.productColors.push(this.createProductColor());
  }

  removeProductColor(index: number): void {
    this.productColors.removeAt(index);
  }

  get productColors(): FormArray {
    return this.productEditForm.get('productColors') as FormArray;
  }

  getProductColorControl(index: number): AbstractControl {
    return this.productColors.controls[index];
  }

  loadProductEditForm(): void {
    this.product.productColors.forEach(() => {
      this.addMoreProductColor();
    });
    this.productEditForm.patchValue(this.product);
  }

  getProduct(): void {
    this.asyncService.start();
    this.productsService.getProductById(this.productId).subscribe(response => {
      this.asyncService.finish();
      if (response.success && response.result) {
        this.product = response.result;
        this.loadProductEditForm();
      } else {
        this.utilService.openErrorSnackBar('Product not found!');
        this.router.navigate(['/products']);
      }
    }, error => {
      this.asyncService.finish();
      this.router.navigate(['/products']);
    });
  }

  changeInStock(event: any, index: number): void {
    const isAvailableControl = this.getProductColorControl(index).get('isAvailable');
    isAvailableControl.patchValue(!!parseFloat(event.target.value));
  }

  changeAvailibilty(event: MatCheckboxChange, index: number): void {
    if (!event.checked) {
      const inStockControl = this.getProductColorControl(index).get('inStock');
      inStockControl.patchValue(0);
    }
  }

  updateProduct(): void {
    console.log(this.productEditForm.value);
    if (this.productEditForm.valid) {
      this.asyncService.start();
      const { featureImage, ...data } = this.productEditForm.value;
      this.productsService.updateProductById(this.product.id, data).subscribe(
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

  uploadFeatureImage(productId: string): void {
    const element = this.featureImage.nativeElement as HTMLInputElement;
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

  ngOnDestroy(): void {
    if (this.asyncService) {
      this.asyncService.finish();
    }
  }
}
