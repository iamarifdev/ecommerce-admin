import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { share } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import _ from 'lodash';

import { AuthUser } from '../../../models/auth-user.model';
import { UtilityService, StorageService, ApiService } from '../../../shared/services';
import { CustomVaidators } from './../../../shared/helpers/custom.validators';
import { UsersService } from '../users.service';

const ALLOWED_FILE_SIZE: Number = 2000000; // 2MB

@Component({
  selector: 'user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userInfo: AuthUser = null;

  hapId: string;
  isHap = false;

  defaultPicture = '/assets/images/avatar_square_blue.png';
  rootURL = '';

  fileToUpload: File = null;
  isFileSizeValid: Boolean = true;

  isAddAnotherEmail: Boolean = false;
  isAddress = true;

  multipleEmail = [];
  emailAddress = '';
  numberOfEmail = [];
  userData = null;

  profileForm: FormGroup;
  passwordForm: FormGroup;
  addressForm: FormGroup;

  oldPassword: AbstractControl;
  password: AbstractControl;
  retypePassword: AbstractControl;

  constructor(
    public dialog: MatDialog,
    public route: ActivatedRoute,
    public apiService: ApiService,
    public storageService: StorageService,
    private fb: FormBuilder,
    private utilService: UtilityService,
    private usersService: UsersService
  ) {
    this.profileForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      fullName: ['', Validators.required],
      mobileNumber: ['']
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      password: ['', Validators.compose([Validators.required])],
      retypePassword: ['', Validators.compose([Validators.required, CustomVaidators.match('password')])]
    });

    this.addressForm = this.fb.group({
      houseNumber: new FormControl('', [Validators.required]),
      addition: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required])
    });
  }

  setProfileImage() {
    if (this.userInfo.avatarUrl && this.userInfo.avatarUrl.endsWith('avatar_square_blue.png') === false) {
      return this.userInfo.avatarUrl;
    } else {
      return this.defaultPicture;
    }
  }

  ngOnInit() {
    this.userInfo = this.storageService.getUser();
    // this.getUserProfileInfo();
    // this.userInfo.fullName = this.userInfo.name;
    // this.hapId = this.userInfo.id;
    this.rootURL = this.setProfileImage();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    if (this.fileToUpload) {
      this.isFileSizeValid = this.fileToUpload.size <= ALLOWED_FILE_SIZE;
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.rootURL = event.target.result;
      };
      reader.readAsDataURL(this.fileToUpload);
    }
  }

  private uploadPicture() {
    const uploadFile$ = this.usersService.uploadProfile(this.userInfo.userId, this.fileToUpload).pipe(share());
    uploadFile$.subscribe(response => {
      this.userInfo = this.storageService.getUser();
      this.userInfo.avatarUrl = response.result;
      this.storageService.saveUser(this.userInfo);
      this.rootURL = this.userInfo.avatarUrl;
    });
    return uploadFile$;
  }

  private updatePassword() {
    const passwordData = {
      oldPassword: this.passwordForm.controls['oldPassword'].value,
      password: this.passwordForm.controls['password'].value
    };

    const updatePassword$ = this.apiService.post('auth/reset-password', passwordData).pipe(share());
    updatePassword$.subscribe((result: any) => {
      if (result.success) {
        this.passwordForm.reset();
      }
    });
    return updatePassword$;
  }

  private updateProfileInfo() {
    let emailArr = [];
    if (this.multipleEmail.length > 0) {
      const tempEmaiArray = this.multipleEmail.map(o => o.email);
      emailArr = [this.profileForm.value['email'], ...tempEmaiArray];
    } else {
      emailArr = this.profileForm.value['email'];
    }
    this.profileForm.controls['email'].setValue(emailArr);

    const updateProfile$ = this.apiService
      .put(`user/profile/${this.userInfo.userId}`, this.profileForm.value)
      .pipe(share());
    updateProfile$.subscribe((res: any) => {
      this.storageService.saveUser(res.result);
    });
    return updateProfile$;
  }

  onSubmit() {
    const requests: any[] = [];
    if (this.fileToUpload && this.isFileSizeValid) {
      requests.push(this.uploadPicture());
    }
    // if (this.passwordForm.valid && this.passwordForm.dirty) {
    //   requests.push(this.updatePassword());
    // }
    // if (
    //   this.userInfo.fullName !== this.profileForm.value['fullName']
    // ) {
    //   requests.push(this.updateProfileInfo());
    // }

    forkJoin(requests).subscribe(
      (results: any[]) => {
        results.forEach(r => {
          this.utilService.openSuccessSnackBar(r.message);
        });
      },
      err => {
        this.utilService.openErrorSnackBar(err.error.message);
      }
    );
  }

  getUserProfileInfo() {}
}
