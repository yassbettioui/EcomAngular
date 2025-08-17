import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from '../../../models/order';
import { OrderService } from '../../../services/order.service';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order?: Order;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder(): void {
    this.loading = true;
    this.error = null;

    const orderId = Number(this.route.snapshot.paramMap.get('id'));

    if (isNaN(orderId)) {
      this.error = 'ID de commande invalide';
      this.loading = false;
      return;
    }

    this.orderService.getOrder(orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
        console.log('Détails de la commande:', order);

        if (!order.items || order.items.length === 0) {
          console.warn('Aucun article trouvé pour cette commande');
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement:', err);
        this.error = 'Impossible de charger les détails de la commande';
        this.loading = false;
      }
    });
  }
}
