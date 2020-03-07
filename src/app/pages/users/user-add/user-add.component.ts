import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { UtilityService, AsyncService, AsyncValidationService } from '../../../shared/services';
import { CustomVaidators } from '../../../shared/helpers/custom.validators';
import { UsersService } from '../users.service';
import { Role } from '../../roles/models/role.model';

@Component({
  selector: 'user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss']
})
export class UserAddComponent implements OnInit {
  userAddForm: FormGroup;
  roles: Role[] = [];

  constructor(
    public dialogRef: MatDialogRef<UserAddComponent>,
    public asyncService: AsyncService,
    private fb: FormBuilder,
    private validationService: AsyncValidationService,
    private utilService: UtilityService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.userAddForm = this.fb.group({
      fullName: ['', Validators.required],
      username: [
        '',
        [Validators.required, Validators.minLength(2)],
        CustomVaidators.isIdentityExist(this.validationService, 'username')
      ],
      roleId: ['', Validators.required],
      password: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email],
        CustomVaidators.isIdentityExist(this.validationService, 'email')
      ],
      phoneNumbers: this.fb.array([this.createPhoneNo()]),
      contactPerson: [undefined],
      contactNo: [undefined],
      addresses: this.fb.array([this.createAddress()]),
      remarks: ['', Validators.required],
      isEnabled: [true, Validators.required]
    });

    this.getRolesDropdownItems();
  }

  get phoneNumbers(): FormArray {
    return this.userAddForm.get('phoneNumbers') as FormArray;
  }

  getPhoneNumberControl(index: number) {
    return this.phoneNumbers.controls[index].get('phoneNo');
  }

  addPhone() {
    this.phoneNumbers.push(this.createPhoneNo());
  }

  removePhone(index: number) {
    this.phoneNumbers.removeAt(index);
  }

  createPhoneNo(): FormGroup {
    return this.fb.group({
      phoneNo: [
        '',
        [Validators.required, Validators.minLength(11)],
        CustomVaidators.isIdentityExist(this.validationService, 'phoneNumbers.phoneNo')
      ]
    });
  }

  get addresses(): FormArray {
    return this.userAddForm.get('addresses') as FormArray;
  }

  getAddressControl(index: number) {
    return this.addresses.controls[index];
  }

  addAddress() {
    this.addresses.push(this.createAddress());
  }

  removeAddress(index: number) {
    this.addresses.removeAt(index);
  }

  createAddress(): FormGroup {
    return this.fb.group({
      district: ['', Validators.required],
      thana: ['', Validators.required],
      postCode: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  getRolesDropdownItems() {
    this.usersService.getRoleDropdownItems().subscribe(response => {
      this.roles = response.result;
    });
  }

  addUser() {
    this.asyncService.start();
    this.usersService.addUser(this.userAddForm.value).subscribe(
      response => {
        this.asyncService.finish();
        this.dialogRef.close(response.result);
        this.utilService.openSuccessSnackBar(response.message);
      },
      error => this.asyncService.finish()
    );
  }
}
