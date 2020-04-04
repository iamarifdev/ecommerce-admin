import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeInDownOnEnterAnimation, bounceOutDownOnLeaveAnimation } from 'angular-animations';

import { AuthService } from '../auth.service';
import { StorageService, UtilityService } from '../../../app/shared/services';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    fadeInDownOnEnterAnimation({ anchor: 'enter', duration: 1000, delay: 100, translate: '80px' }),
    bounceOutDownOnLeaveAnimation({ anchor: 'leave', duration: 500, delay: 200, translate: '80px' })
  ]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private storageService: StorageService,
    private utilityService: UtilityService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.storageService.destroyAll();
  }

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.authenticate(username, password).subscribe(
        response => {
          if (response && response.success && response.result) {
            this.router.navigate(['/home']);
            this.utilityService.openSuccessSnackBar(response.message);
          } else {
            this.utilityService.openErrorSnackBar(response.message);
          }
        },
        error => {
          if (error.error) {
            this.utilityService.openErrorSnackBar(error.error.message);
          }
        }
      );
    } else {
      this.loginForm.markAsTouched();
      this.loginForm.updateValueAndValidity();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
