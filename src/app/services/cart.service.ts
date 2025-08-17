import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Cart} from '../models/cart';
import {CartItem} from '../models/cartItem';
import {Order} from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/cart';

  constructor(private http: HttpClient) { }

  addToCart(userId: number, productId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, null, {
      params: {
        userId: userId.toString(),
        productId: productId.toString(),
        quantity: quantity.toString()
      }
    });
  }


  getCart(userId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/${userId}`);
  }

  removeItem(userId: number, productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/remove`, {
      params: {
        userId: userId.toString(),
        productId: productId.toString()
      }
    });
  }

  clearCart(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clear/${userId}`);
  }

  updateQuantity(userId: number, productId: number, newQuantity: number): Observable<CartItem> {
    return this.http.put<CartItem>(`${this.apiUrl}/update`, null, {
      params: {
        userId: userId.toString(),
        productId: productId.toString(),
        newQuantity: newQuantity.toString()
      }
    });
  }

  checkout(userId: number): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/checkout`, null, {
      params: { userId: userId.toString() }
    });
  }
}
