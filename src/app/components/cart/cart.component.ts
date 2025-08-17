import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import {Cart} from '../../models/cart';
import {CommonModule, CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  imports: [
    CurrencyPipe,
    CommonModule
  ],
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;
  currentUserId = 1; // À remplacer par l'ID de l'utilisateur connecté

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartService.getCart(this.currentUserId).subscribe({
      next: (cart) => this.cart = cart,
      error: (err) => console.error('Erreur lors du chargement du panier', err)
    });
  }

  updateQuantity(productId: number, newQuantity: number): void {
    if (newQuantity < 1) return;

    this.cartService.updateQuantity(this.currentUserId, productId, newQuantity).subscribe({
      next: () => this.loadCart(),
      error: (err) => {
        console.error('Erreur lors de la mise à jour de la quantité', err);
        alert(err.error?.message || 'Erreur lors de la mise à jour de la quantité');
        this.loadCart(); // Recharger le panier pour afficher les quantités correctes
      }
    });
  }

  removeItem(productId: number): void {
    this.cartService.removeItem(this.currentUserId, productId).subscribe({
      next: () => this.loadCart(),
      error: (err) => console.error('Erreur lors de la suppression de l\'article', err)
    });
  }

  checkout(): void {
    this.cartService.checkout(this.currentUserId).subscribe({
      next: (order) => {
        alert('Commande passée avec succès!');
        this.router.navigate(['/orders', order.id]);
      },
      error: (err) => {
        console.error('Erreur lors de la commande', err);
        alert(err.error?.message || 'Erreur lors de la commande');
      }
    });
  }
}
