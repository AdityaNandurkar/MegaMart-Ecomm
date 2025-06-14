import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from 'src/app/models/user';
import { environment } from 'src/Enviroment/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = environment.apiServerUrl;

  constructor(private _http: HttpClient) { }

  // Centralized error handling
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => error);
  }

  // Generic HTTP methods
  private get<T>(endpoint: string): Observable<T> {
    return this._http.get<T>(`${this.baseUrl}${endpoint}`).pipe(catchError(this.handleError));
  }

  private post<T>(endpoint: string, body: any): Observable<T> {
    return this._http.post<T>(`${this.baseUrl}${endpoint}`, body).pipe(catchError(this.handleError));
  }

  private put<T>(endpoint: string, body: any): Observable<T> {
    return this._http.put<T>(`${this.baseUrl}${endpoint}`, body).pipe(catchError(this.handleError));
  }

  private delete<T>(endpoint: string): Observable<T> {
    return this._http.delete<T>(`${this.baseUrl}${endpoint}`).pipe(catchError(this.handleError));
  }

  // Product APIs
  getProducts(): Observable<any> {
    return this.get<any>('products');
  }

  getProductsById(id: string): Observable<any> {
    return this.get<any>(`products/${id}`);
  }

  // User APIs
  registerNewUser(newUser: User): Observable<User> {
    return this.post<User>('users', newUser);
  }

  getUserDetails(): Observable<User[]> {
    return this.get<User[]>('users');
  }

  getUser(email: string, password: string): Observable<User> {
    return this.get<User>(`users?email=${email}&password=${password}`);
  }

  updateUserById(id: string, user: Partial<User>): Observable<any> {
    return this.put<any>(`users/${id}`, user);
  }

  // Cart APIs
  getCartProductsByEmailAndPassword(email: string, password: string): Observable<any> {
    return this.get<any>(`addToCartProductsList?email=${email}&password=${password}`);
  }

  getCartProductsById(cartId: string): Observable<any> {
    return this.get<any>(`addToCartProductsList/${cartId}`);
  }

  addProductToCart(product: any): Observable<any> {
    return this.post<any>('addToCartProductsList', product);
  }

  updateProductQuantityById(cartId: string, updatedProduct: any): Observable<any> {
    return this.put<any>(`addToCartProductsList/${cartId}`, updatedProduct);
  }

  deleteCartProduct(id: string): Observable<any> {
    return this.delete<any>(`addToCartProductsList/${id}`);
  }

  // Payment APIs
  addPayment(paymentHistory: any): Observable<any> {
    return this.post<any>('paymentHistory', paymentHistory);
  }

  getPurchaseHistory(email: string, password: string): Observable<any> {
    return this.get<any>(`paymentHistory?email=${email}&password=${password}`);
  }

  // Authentication Utility
  isLoggedIn(): boolean {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    return !!(email && password);
  }
}