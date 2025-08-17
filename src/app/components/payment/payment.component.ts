import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';
import {Order} from '../../models/order';
import {CommonModule, CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  imports: [
    CurrencyPipe,
    CommonModule
  ],
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  order: Order| null = null;
  paymentMethod = 'credit_card'; // Valeur par défaut
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private paymentService: PaymentService
  ) { }

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrder(+orderId);
    }
  }

  loadOrder(orderId: number): void {
    this.orderService.getOrder(orderId).subscribe({
      next: (order) => this.order = order,
      error: (err) => console.error('Error loading order', err)
    });
  }

  processPayment(): void {
    if (!this.order) return;

    this.loading = true;
    this.paymentService.processPayment(
      this.order.id,
      this.paymentMethod,
      this.order.totalAmount
    ).subscribe({
      next: (payment) => {
        alert('Payment processed successfully!');
        // Rediriger vers la page de confirmation
      },
      error: (err) => {
        console.error('Payment error', err);
        alert('Payment failed: ' + (err.error?.message || 'Unknown error'));
        this.loading = false;
      },
      complete: () => this.loading = false
    });
  }
}
