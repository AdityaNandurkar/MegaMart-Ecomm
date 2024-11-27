import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ApiService } from 'src/app/service/api/api.service';
import { NotificationService } from 'src/app/service/notify/notification.service';
import { ProductService } from 'src/app/service/product/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public totalCartItem: number = 0;
  public products: any[] = [];
  collapsed: boolean = true;
  public email: string | null = '';
  public password: string | null = '';
  public productName: string = "";
  details: any;

  constructor(private _notify: NotificationService, private _router: Router, private _api: ApiService, private _productService: ProductService) { }
  ngOnInit(): void {
    this.loadCredentials();
    this.getCartCount();
    this._productService.cartCount.subscribe(res => {
      this.totalCartItem = res;
    })
  }

  private loadCredentials(): void {
    this.email = localStorage.getItem('email');
    this.password = localStorage.getItem('password');
  }

  isAdmin(): boolean {
    const role = localStorage.getItem('role');
    const isAdmin = localStorage.getItem('isAdmin') === "true";
    return role === "admin" && isAdmin;
  }
  
  getAdmin(): boolean | null {
    return this.isAdmin() ? true : null;
  }
  


  search(event: any) {
    this.productName = (event.target as HTMLInputElement).value;
    console.log(this.productName);
    this._productService.search.next(this.productName);
  };
  loggedIn = () => localStorage.getItem('email') && localStorage.getItem('password');

  onLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('password');
    this._notify.showSuccess("Logout Successfully !!");
    this._productService.updateCartCount(0);
    this._router.navigate([""]);
  };

  getProductCategory(category: string) {
    this._productService.setProductCategory(category);
  }

  getCartCount() {
    if (!this.email || !this.password) {
      this.totalCartItem = 0;
      return;
    }

    this._api.getCartProductsByEmailAndPassword(this.email, this.password).subscribe(
      (cart: any[]) => {
        const cartData = cart.find((c: any) => c.email === this.email && c.password === this.password);
        if (cartData) {
          this.totalCartItem = cartData.product.length;
        } else {
          this.totalCartItem = 0;
        }
      },
      (error) => {
        console.error("Error fetching cart:", error);
        this.totalCartItem = 0;
      }
    );
  }
}