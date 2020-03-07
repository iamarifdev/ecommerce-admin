import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { UtilityService, AsyncService, AsyncValidationService } from '../../../shared/services';
import { CustomVaidators } from '../../../shared/helpers/custom.validators';
import { UsersService } from '../users.service';
import { Role } from '../../roles/models/role.model';
import { User } from '../models/user.model';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  userEditForm: FormGroup;
  roles: Role[] = [];
  user: User;

  constructor(
    public dialogRef: MatDialogRef<UserEditComponent>,
    private fb: FormBuilder,
    private utilService: UtilityService,
    private validationService: AsyncValidationService,
    private asyncService: AsyncService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.userEditForm = this.fb.group({
      fullName: ['', Validators.required],
      username: [
        '',
        [Validators.required, Validators.minLength(2)],
        CustomVaidators.isIdentityExist(this.validationService, 'username', this.user.id)
      ],
      roleId: ['', Validators.required],
      password: ['', Validators.required],
      email: [
        '',
        [Validators.required, Validators.email],
        CustomVaidators.isIdentityExist(this.validationService, 'email', this.user.id)
      ],
      phoneNumbers: this.fb.array([this.createPhoneNo()]),
      contactPerson: [undefined],
      contactNo: [undefined],
      addresses: this.fb.array([this.createAddress()]),
      remarks: ['', Validators.required],
      isEnabled: [true, Validators.required]
    });

    this.getRolesDropdownItems();
    this.getUser();
  }

  getUser() {
    this.asyncService.start();
    this.usersService.getUserById(this.user.id).subscribe(
      response => {
        this.asyncService.finish();
        this.userEditForm.patchValue(response.result);
      },
      error => this.asyncService.finish()
    );
  }

  get phoneNumbers(): FormArray {
    return this.userEditForm.get('phoneNumbers') as FormArray;
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
        CustomVaidators.isIdentityExist(this.validationService, 'phoneNumbers.phoneNo', this.user.id)
      ]
    });
  }

  get addresses(): FormArray {
    return this.userEditForm.get('addresses') as FormArray;
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

  updateUser() {
    this.asyncService.start();
    this.usersService.updateUserById(this.user.id, this.userEditForm.value).subscribe(
      response => {
        this.asyncService.finish();
        this.dialogRef.close(response.result);
        this.utilService.openSuccessSnackBar(response.message);
      },
      error => this.asyncService.finish()
    );
  }
}
