import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Payment} from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) { }

  processPayment(orderId: number, paymentMethod: string, amount: number): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, null, {
      params: {
        orderId: orderId.toString(),
        paymentMethod: paymentMethod,
        amount: amount.toString()
      }
    });
  }

  getPayment(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  getPaymentsByOrder(orderId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/order/${orderId}`);
  }
}
