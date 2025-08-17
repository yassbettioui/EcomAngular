import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, tap} from 'rxjs';
import {Order} from '../models/order';
import {OrderStatus} from '../models/orderStatus';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';
  private orders$ = new BehaviorSubject<Order[]>([]); // Sujet pour le state management

  constructor(private http: HttpClient) {}

  createOrder(orderData: any): Observable<Order> {
    // Validation basique des données
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      throw new Error('Données de commande invalides');
    }

    // Formatage des données pour le backend
    const payload = {
      ...orderData,
      status: 'PENDING', // Statut par défaut
      orderDate: new Date().toISOString()
    };

    return this.http.post<Order>(this.apiUrl, payload).pipe(
      tap((newOrder) => {
        console.log('Commande créée avec succès:', newOrder);

        // Mise à jour du state local
        const currentOrders = this.orders$.value;
        this.orders$.next([...currentOrders, newOrder]);
      }),
      catchError((error) => {
        console.error('Erreur lors de la création de la commande:', error);
        throw error; // Propagation de l'erreur//
         })
    );
  }


  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl).pipe(
      map(orders => orders.map(order => ({
        ...order,
        items: order.items || [] // Initialisation si null
      }))),
      catchError(error => {
        console.error('Error fetching orders:', error);
        return of([]);
      })
    );
  }
  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`).pipe(
      tap(order => console.log('Raw order data:', order)), // Debug
      map(order => ({
          ...order,
          items: order.items?.map(item => ({
            ...item,
            productName: item.productName || `Product ${item.productId}`,
            price: item.price || (item.unitPrice * item.quantity)
          })) || []
        }),
        catchError(error => {
          console.error('Error loading order:', error);
          throw error }))
      );
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/status`, { status });
  }

  getCustomerOrders(customerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/customer/${customerId}`);
  }

  cancelOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
