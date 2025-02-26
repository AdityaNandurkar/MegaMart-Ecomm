import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/service/api/api.service';
import { NotificationService } from 'src/app/service/notify/notification.service';

@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
  updateUserDetails!: FormGroup;
  numberRegEx = /^[0-9]*$/;
  profileImage = 'assets/profileImage.png';
  uploadImage: string = '';
  userInfo: any;
  isPasswordChange: boolean = false; // Example flag to show password change section
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  // Form control values for the passwords
  newPassword: string = '';
  confirmNewPassword: string = '';
  passwordMatchMessage: string = '';
  passwordMatchColor: string = '';

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;


  constructor(
    public dialogRef: MatDialogRef<UpdateUserComponent>, private fb: FormBuilder, private _api: ApiService, private _nofify: NotificationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userInfo = data.data;
  }
  ngOnInit(): void {
    this.initForms();
  }

  close() {
    this.dialogRef.close();
  }

  private initForms(): void {
    this.updateUserDetails = this.fb.group({
      fullname: ['', [Validators.maxLength(50)]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern(this.numberRegEx), Validators.minLength(10), Validators.maxLength(10)]],
      address: [''],
      role: ['user'],
      isAdmin: [false],
      profileImage: [''],
      password: ['', [Validators.minLength(8)]],
      previousPassword: [''],
      newPassword: ['', [Validators.minLength(8)]],
      confirmNewPassword: ['', [Validators.minLength(8)]]
    });


    if (this.userInfo) {
      this.updateUserDetails.patchValue({
        fullname: this.userInfo.fullname,
        email: this.userInfo.email,
        phone: this.userInfo.phone,
        address: this.userInfo.address,
        password: this.userInfo.password,
        role: this.userInfo.role,
        isAdmin: this.userInfo.isAdmin,
        profileImage: this.userInfo.profileImage
      })
    }
  }

  updateUserInfo() {
    if (this.updateUserDetails.valid) {
      const userId = this.userInfo.id;
      const userDetails = { ...this.updateUserDetails.value };

      if (!userDetails.newPassword || !userDetails.confirmNewPassword) {
        userDetails.newPassword = this.userInfo.newPassword;
        userDetails.confirmNewPassword = this.userInfo.confirmNewPassword;
      }

      userDetails.password = userDetails.newPassword || this.userInfo.password;

      userDetails.previousPassword =
        userDetails.password !== this.userInfo.password ? this.userInfo.password : this.userInfo.previousPassword;
      this.getUser(userDetails);
      localStorage.setItem('email', userDetails.email);
      localStorage.setItem('password', userDetails.password);

      this._api.updateUserById(userId, userDetails).subscribe({
        next: () => {
          this._nofify.showSuccess("Updated Successfully...");
          this.close();
        },
        error: (error) => {
          console.error("Error updating user details:", error);
        }
      });
    }
  }
  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files.length > 0) {
      const file = input.files[0];
      const objectURL = URL.createObjectURL(file);
      this.profileImage = objectURL;
      this.uploadImage = this.profileImage;
      this.updateUserDetails.value.profileImage = this.profileImage;
    }
  }
  togglePasswordVisibility(field: string): void {
    if (field === 'old') {
      this.showOldPassword = !this.showOldPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  checkPasswordMatch(): void {
    if (this.newPassword === this.confirmNewPassword) {
      this.passwordMatchMessage = 'Passwords match sucessfully...';
      this.passwordMatchColor = 'green';
    } else {
      this.passwordMatchMessage = 'Passwords do not match';
      this.passwordMatchColor = 'red';
    }
  }

  onPasswordChangeSelection(isYesSelected: boolean): void {
    this.isPasswordChange = isYesSelected;
    const { oldPassword, newPassword, confirmNewPassword } = this.updateUserDetails.controls;

    if (isYesSelected) {
      // Set validators for password fields if "Yes" is selected
      oldPassword.setValidators([Validators.required]);
      newPassword.setValidators([Validators.required, Validators.minLength(8)]);
      confirmNewPassword.setValidators([Validators.required, Validators.minLength(8)]);
    } else {
      // Clear validators if "No" is selected
      oldPassword.clearValidators();
      newPassword.clearValidators();
      confirmNewPassword.clearValidators();
    }

    // Update validity for the fields
    oldPassword.updateValueAndValidity();
    newPassword.updateValueAndValidity();
    confirmNewPassword.updateValueAndValidity();
  }
  getUser(userCreditional: any) {
    // updateEmailandPasswordById
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    if (email && password) {
      this._api.getCartProductsByEmailAndPassword(email, password).subscribe((res: any) => {
        if (res && res.length > 0) {
          let userData = [];
          userData = res[0];
          const userId = userData.id;
          userData.email = userCreditional.email;
          userData.password = userCreditional.password;

          // this._api.updateEmailandPasswordById(userId, userData).subscribe((res: any) => {
          this._api.updateProductQuantityById(userId, userData).subscribe((res: any) => {
          }, (error: any) => {
            console.log("Error => ", error);
          })
        }
      }, (error) => {
        console.log("Error => ", error);
      })
    }
  }
}
