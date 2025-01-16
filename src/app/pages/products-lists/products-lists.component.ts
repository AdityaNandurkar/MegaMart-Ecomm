import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/service/api/api.service';
import { LoaderService } from 'src/app/service/loader/loader.service';
import { NotificationService } from 'src/app/service/notify/notification.service';
import { ProductService } from 'src/app/service/product/product.service';

@Component({
  selector: 'app-products-lists',
  templateUrl: './products-lists.component.html',
  styleUrls: ['./products-lists.component.scss']
})
export class ProductsListsComponent {
  allProducts: any;
  categoryType: string = "";
  searchKey: string = "";
  @Input() category: string | undefined;
  constructor(private apiService: ApiService, private _notify: NotificationService, private _productService: ProductService, private _router: Router, private loaderService: LoaderService,) {

  }
  isLoading$!: Observable<boolean>;
  ngOnInit(): void {
    this.isLoading$ = this.loaderService.loading$;
    this._productService.category.subscribe(data => {
      this.categoryType = data;
      this.getAllProducts();
    });

    this._productService.search.subscribe((val: any) => {
      this.searchKey = val;
    })
  }

  getAllProducts() {
    this.loaderService.show();
    this.apiService.getProducts().subscribe((res: any) => {
      if (res && res.length > 0) {
        if (res && res.length > 0) {
          this.allProducts = this.category
            ? res.filter((item: any) => item.category === this.category)
            : res;

          this.loaderService.hide();
        }
      }
    }, (error) => {
      console.log("Error => ", error);
      this.loaderService.hide();
    })
  }

  addToCart(product: any) {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    if (!email || !password) {
      this._router.navigate(['loginRegister'])
      this._notify.showError('User not authenticated. Please login first.');
      return;
    }

    this.apiService.getCartProductsByEmailAndPassword(email, password).subscribe(
      (res: any) => {
        let cartData = res.find((cart: any) => cart.email === email && cart.password === password);

        if (!cartData) {
          cartData = {
            id: this.generateId(),
            email,
            password,
            product: [{ ...product, quantity: 1 }]
          };
          this.apiService.addProductToCart(cartData).subscribe(
            (response: any) => {
              this._notify.showSuccess('Product added to cart successfully');
            },
            (error) => {
              console.error("Error adding product to cart:", error);
              this._notify.showError('Error adding product to cart');
            }
          );
        } else {
          const existingProduct = cartData.product.find((p: any) => p.id === product.id);

          if (existingProduct) {
            existingProduct.quantity += 1;
          } else {
            cartData.product.push({ ...product, quantity: 1 });
          }

          this.apiService.updateProductQuantityById(cartData.id, cartData).subscribe(
            (response: any) => {
              this._productService.updateCartCount(response.product.length);
              this._notify.showSuccess('Product updated in cart successfully');
            },
            (error) => {
              console.error("Error updating cart data:", error);
              this._notify.showError('Error updating cart data');
            }
          );
        }
      },
      (error) => {
        console.error("Error fetching cart data:", error);
        this._notify.showError('Error fetching cart data');
      }
    );
  }
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

}
