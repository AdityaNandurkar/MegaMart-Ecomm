import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api/api.service';
import { NotificationService } from '../notify/notification.service';
export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  delPrice: number;
  discount: number;
  rating: number;
  category: string;
  total: number;
  quantity: number;
}
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  public search = new BehaviorSubject<string>("");

  public productList = new BehaviorSubject<Product[]>([]);

  private categoryType = new BehaviorSubject<string>("");
  category = this.categoryType.asObservable();

  private cartItem = new BehaviorSubject<number>(0);
  cartCount = this.cartItem.asObservable();

  private cartProducts = new BehaviorSubject<Product[]>([]);
  cartItems = this.cartProducts.asObservable(); // Renamed to match the private variable

  constructor(private _api: ApiService, private _notify: NotificationService) { }

  // Get the list of products
  getProducts() {
    return this.productList.asObservable();
  }

  // Set the product category for filtering
  setProductCategory(category: string) {
    this.categoryType.next(category);
  }

  // Update the cart count
  updateCartCount(count: number) {
    this.cartItem.next(count);
  }

  // Set the items in the cart
  setCartItems(cartItems: Product[]) {
    this.cartProducts.next(cartItems); // Corrected to use cartProducts
  }


  removeAllProducts(email: string, password: string) {
    let product;
    this._api.getCartProductsByEmailAndPassword(email, password).subscribe(
      (cart: any) => {
        const cartData = cart.find((c: any) => c.email === email && c.password === password);

        if (cartData) {
          cartData.product = []; // Clear all products in the cart

          this._api.updateProductQuantityById(cartData.id, cartData).subscribe(
            () => {
              this.updateCartCount(cartData.product.length);
              this.setCartItems(cartData.product);
              this._notify.showSuccess("All products removed from cart");
              // this.getAllCartProducts(); // Refresh the cart display
            },
            (error) => {
              console.error("Error updating cart to empty:", error);
              this._notify.showError("Error removing products from cart");
            }
          );
        } else {
          this._notify.showError("Cart not found");
        }
      },
      (error) => {
        console.error("Error fetching cart:", error);
        this._notify.showError("Error fetching cart");
      }
    );
    return product = [];
  }
}
