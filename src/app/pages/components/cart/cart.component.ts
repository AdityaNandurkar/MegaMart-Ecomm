import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api/api.service';
import { Product, ProductService } from 'src/app/service/product/product.service';
import { NotificationService } from 'src/app/service/notify/notification.service';
import { PaymentComponent } from '../payment/payment.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
 email = localStorage.getItem('email');
  password = localStorage.getItem('password');

  decareaseQuantity: number = 1;
  constructor(private productService: ProductService, private _api: ApiService, private _notify: NotificationService, private _productService: ProductService, private _dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAllCartProducts();
    this._productService.cartItems.subscribe(res => {
      if (res)
        this.products = res;
    })
  }

  public products: Product[] = [];
  grandTotal: any;

  getAllCartProducts() {
    if (this.email && this.password) {
      this._api.getCartProductsByEmailAndPassword(this.email, this.password).subscribe((res: any[]) => {
        if (res && res.length > 0) {
          this.products = res[0].product;
          this.grandTotal = this.products.reduce((total, item) => {
            const itemValue = item.quantity * item.price;
            return total + itemValue;
          }, 0);
        }
        console.log("Products => ", this.products)
      });
    }
  }

  // decreaseQuantity(q: any) {
  //
  //   q.quantity = q.quantity - this.decareaseQuantity;
  //   if (q.quantity > 0) {
  //     this._api.updateProductQuantityById(q.id, q).subscribe((res: any) => {
  //       this._notify.showSuccess("Product quantity decrease");
  //     }, (error) => {
  //       console.log("Error => ", error);
  //     })
  //   } else {
  //     this._api.deleteCartProduct(q.id).subscribe((res: any) => {
  //       this.getAllCartProducts();
  //       this._notify.showSuccess("Product removed");
  //     }, (error) => {
  //       console.log("Error => ", error);
  //     })
  //   }
  // }
  // increaseQuantity(q: any) {
  //   q.quantity = q.quantity + this.decareaseQuantity;
  //   this._api.updateProductQuantityById(q.id, q).subscribe((res: any) => {
  //     this._notify.showSuccess("Product quantity increase");
  //   }, (error) => {
  //     console.log("Error => ", error);
  //   })
  // }

  updateCartQuantity(product: any, action: 'increase' | 'decrease') {
    const adjustmentValue = action === 'increase' ? 1 : -1;
    product.quantity += adjustmentValue;
    if (this.email && this.password) {
      this._api.getCartProductsByEmailAndPassword(this.email, this.password).subscribe(
        (cart: any) => {
          let cartData = cart.find((c: any) => c.email === this.email && c.password === this.password);
          if (!cartData) return;

          const existingProduct = cartData.product.find((p: any) => p.id === product.id);

          if (existingProduct) {
            existingProduct.quantity += adjustmentValue;
            if (existingProduct.quantity <= 0) {
              cartData.product = cartData.product.filter((p: any) => p.id !== product.id);
            }
          } else if (action === 'increase') {
            cartData.product.push({ ...product, quantity: 1 });
          }

          this._api.updateProductQuantityById(cartData.id, cartData).subscribe(
            () => {
              this.getAllCartProducts();
              const message = action === 'increase' ? 'Product added to cart successfully' : 'Product updated in cart successfully';
              this._productService.updateCartCount(cartData.product.length);
              this._notify.showSuccess(message);
            },
            (error) => {
              console.error("Error updating cart data:", error);
              this._notify.showError('Error updating cart data');
            }
          );
        },
        (error) => {
          console.error("Error fetching cart:", error);
        }
      );
    }
  }

  decreaseQuantity(product: any) {
    if (product.quantity > 1) {
      this.updateCartQuantity(product, 'decrease');
    } else {
      this.updateCartQuantity(product, 'decrease');
    }
  }

  increaseQuantity(product: any) {
    this.updateCartQuantity(product, 'increase');
  }
  removeItem(product: any) {
    if (this.email && this.password) {
      this._api.getCartProductsByEmailAndPassword(this.email, this.password).subscribe(
        (cart: any) => {
          const cartData = cart.find((c: any) => c.email === this.email && c.password === this.password);
          if (!cartData) return;

          // Filter out the product to remove it
          cartData.product = cartData.product.filter((p: any) => p.id !== product.id);

          // Update cart data on the server
          this._api.updateProductQuantityById(cartData.id, cartData).subscribe(
            () => {
              this.getAllCartProducts();
              this._productService.updateCartCount(cartData.product.length);
              this._notify.showSuccess("Product removed from cart successfully");
            },
            (error) => {
              console.error("Error removing product from cart:", error);
              this._notify.showError('Error removing product from cart');
            }
          );
        },
        (error) => {
          console.error("Error fetching cart:", error);
        }
      );
    }
  }

  emptyCart() {
    if (this.email && this.password) {
      this._productService.removeAllProducts(this.email, this.password);
    }
  }


  //--------------------------------Payment-----------------------------------
  openPopup(grandTotal: number) {
    const data = {
      email: this.email,
      password: this.password,
      amount_paid: grandTotal,
      paymentMethod: '',
      upi_Id: '',
      card_details: [],
      productList: [...this.products],
      purchaseDate: ''
    }
    const dialogRef = this._dialog.open(PaymentComponent, {
      width: '800px', // Set the width of the popup
      height: '400px',
      data: { productHistory: data }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}