import { Component, OnInit } from '@angular/core';
import { Order } from '../../../models/order';
import { OrderService } from '../../../services/order.service';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderStatus } from '../../../models/orderStatus';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    FormsModule,
    CommonModule
  ],
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  loading = false;
  error = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getStatuses(): string[] {
    return Object.values(OrderStatus); // Assurez-vous que OrderStatus est un enum
  }

  updateStatus(order: Order, newStatus: OrderStatus): void {
    if (order.id) {
      this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
        next: (updatedOrder) => {
          order.status = updatedOrder.status;
        },
        error: (err) => {
          console.error('Failed to update status', err);
          // Revert the change in UI if update fails
          const originalStatus = this.orders.find(o => o.id === order.id)?.status;
          if (originalStatus) {
            order.status = originalStatus;
          }
        }
      });
    }
  }
}
