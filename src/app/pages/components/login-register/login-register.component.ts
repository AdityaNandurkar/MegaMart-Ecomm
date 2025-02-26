import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { ApiService } from 'src/app/service/api/api.service';
import { NotificationService } from 'src/app/service/notify/notification.service';
import { ProductService } from 'src/app/service/product/product.service';

@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {

  loginForm!: FormGroup;
  signupForm!: FormGroup;
  numberRegEx = /^[0-9]*$/;
  offerOptions: { id: number, name: string, isSelected: boolean }[] = [];
  isRegister: boolean = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private notify: NotificationService, private _api: ApiService, private _productService: ProductService
  ) { }

  ngOnInit(): void {
    this.initForms();
    this.getOffers();
  }

  // Initializes the login and signup forms
  private initForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.signupForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(this.numberRegEx), Validators.minLength(10), Validators.maxLength(10)]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      role: ['user', [Validators.required]],
      isAdmin: [false]
    });
  }

  // Toggles between login and registration forms
  toggleForm(): void {
    this.isRegister = !this.isRegister;
  }

  // Retrieves offer options
  private getOffers(): void {
    this.offerOptions = [
      { id: 1, name: 'Home Delivery', isSelected: false },
      { id: 2, name: 'Cash on Delivery', isSelected: false },
      { id: 3, name: 'Order Pickup', isSelected: false }
    ];
  }

  // Handles login functionality
  login(): void {
    if (this.loginForm.invalid) {
      this.notify.showWarning('Please fill in all required fields correctly.');
      return;
    }

    this.apiService.getUserDetails().subscribe(
      (res: User[]) => {
        const user = res.find(
          (u: User) => u.email === this.loginForm.value.email && u.password === this.loginForm.value.password
        );

        if (user) {
          this.storeUserData(user);
          this.navigateAfterLogin(user);

          this._api.getCartProductsByEmailAndPassword(user.email, user.password).subscribe(
            (cart: any) => {
              const cartData = cart.find((c: any) => c.email === user.email && c.password === user.password);
              this._productService.updateCartCount(cartData.product.length);
            },
            (error) => {
              console.error("Error fetching cart:", error);
            }
          );
        } else {
          this.notify.showError('User not found or invalid credentials!');
        }
      },
      (error) => {
        console.error("Error during login:", error);
        this.notify.showError('An error occurred during login. Please try again.');
      }
    );
  }

  // Stores user data in local storage
  private storeUserData(user: User): void {
    localStorage.setItem('email', this.loginForm.value.email);
    localStorage.setItem('password', this.loginForm.value.password);

    localStorage.setItem('role', user.role);
    localStorage.setItem('isAdmin', JSON.stringify(user.isAdmin));
  }

  // Redirects user based on their role after successful login
  private navigateAfterLogin(user: User): void {
    const message = user.isAdmin && user.role === 'admin' ? 'Admin Login Success!!' : `${user.email} Login Success!!`;
    this.notify.showSuccess(message);
    this.loginForm.reset();
    this.router.navigate(['']);
  }

  // Handles new user signup
  newUserSignUp(): void {
    if (this.signupForm.invalid) {
      this.notify.showError("Invalid form. Please fill in all fields correctly.");
      return;
    }

    this._api.getUserDetails().subscribe((res: any) => {
      if (res && res.length > 0) {
        const newUser: User = this.signupForm.value;
        const isUserExit = res.find((x: any) => x.email === newUser.email && x.password === newUser.password && x.phone === newUser.phone)
        if (!isUserExit) {
          this.apiService.registerNewUser(newUser).subscribe(
            () => {
              this.router.navigate(['']);
              this.notify.showSuccess("User registered successfully!");
              this.signupForm.reset();
            },
            (error) => {
              console.error("Error during registration:", error);
              this.notify.showError("Registration failed. Please try again.");
            }
          );
        } else {
          this.notify.showError("User exist with same Email or Password or Phone No.");
        }
      }
    }, (error) => {
      console.log("Error => ", error);
    })
  }
  
  // Form control values for the passwords
  password: string = '';
  confirmPassword: string = '';
  passwordMatchMessage: string = '';
  passwordMatchColor: string = '';
  showConfirmPassword: boolean = false;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  checkPasswordMatch(): void {
    if (this.signupForm.value.password === this.signupForm.value.confirmPassword) {
      this.passwordMatchMessage = 'Passwords match sucessfully...';
      this.passwordMatchColor = 'green';
    } else {
      this.passwordMatchMessage = 'Passwords do not match';
      this.passwordMatchColor = 'red';
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
}
