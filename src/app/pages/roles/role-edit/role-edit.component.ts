import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { UtilityService } from '../../../../app/shared/services';
import { RolesService } from '../roles.service';
import { Role } from '../models/role.model';

@Component({
  selector: 'role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.scss']
})
export class RoleEditComponent implements OnInit {
  roleEditForm: FormGroup;

  role: Role;

  constructor(
    public dialogRef: MatDialogRef<RoleEditComponent>,
    private fb: FormBuilder,
    private utilService: UtilityService,
    private rolesService: RolesService
  ) {}

  ngOnInit() {
    this.roleEditForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      isEnabled: [true, Validators.required]
    });

    if (this.role) {
      this.getRoleById(this.role.id);
    }
  }

  getRoleById(id: string) {
    this.rolesService.getRoleById(id).subscribe(response => {
      this.roleEditForm.patchValue(response.result);
    });
  }

  updateRole() {
    this.rolesService.updateRoleById(this.role.id, this.roleEditForm.value).subscribe(response => {
      this.dialogRef.close(response.result);
      this.utilService.openSuccessSnackBar(response.message);
    });
  }
}
