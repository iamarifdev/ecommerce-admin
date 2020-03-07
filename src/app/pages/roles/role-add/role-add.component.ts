import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { UtilityService } from '../../../../app/shared/services';
import { RolesService } from '../roles.service';

@Component({
  selector: 'role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.scss']
})
export class RoleAddComponent implements OnInit {
  roleAddForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<RoleAddComponent>,
    private fb: FormBuilder,
    private utilService: UtilityService,
    private rolesService: RolesService
  ) {}

  ngOnInit() {
    this.roleAddForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      isEnabled: [true, Validators.required]
    });
  }

  addRole() {
    this.rolesService.addRole(this.roleAddForm.value).subscribe(response => {
      this.dialogRef.close(response.result);
      this.utilService.openSuccessSnackBar(response.message);
    });
  }
}
