import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { UtilityService, AsyncService, AsyncValidationService } from '../../../shared/services';
import { CustomVaidators } from '../../../shared/helpers/custom.validators';
import { HeaderMenuService } from '../../../services/header-menu.service';
import { ProductsService } from '../products.service';

@Component({
  selector: 'product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {
  productAddForm: FormGroup;

  constructor(
    public asyncService: AsyncService,
    private fb: FormBuilder,
    private headerMenuService: HeaderMenuService,
    private validationService: AsyncValidationService,
    private utilService: UtilityService,
    private productsService: ProductsService
  ) {}

  ngOnInit() {
    this.productAddForm = this.fb.group({
      sku: ['', Validators.required],
      title: [
        '',
        [Validators.required, Validators.minLength(2)]
      ],
      description: ['', Validators.required],
      manufactureDetail: this.fb.group({
        modelNo: ['', Validators.required],
        releaseDate: [new Date(), Validators.required]
      }),
      productColors: this.fb.array([this.createProductColor()]),
      pricing: this.fb.group({
        price: [0, [Validators.required, Validators.min(1)]]
      }),
      featureImageUrl: [null, Validators.required],
      isEnabled: [true, Validators.required]
    });
  }

  get manufactureDetail(): FormGroup {
    this.headerMenuService.setHeaderMenu({ title: 'Add Product', subtitle: 'Products' });
    return this.productAddForm.get('manufactureDetail') as FormGroup;
  }

  createProductColor(): FormGroup {
    return this.fb.group({
      colorCode: ['', Validators.required],
      colorName: ['', Validators.required],
      inStock: [0, Validators.min(0)],
      isAvailable: [true],
      images: [null],
      sizes: [[], Validators.required]
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

  addProduct() {
    // TODO: implement
  }

}
