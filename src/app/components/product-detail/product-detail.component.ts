import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, CommonModule } from '@angular/common';
import {Review} from '../../models/review';
import {ReviewService} from '../../services/review.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  imports: [
    FormsModule,
    CurrencyPipe,
    CommonModule
  ]
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  reviews: Review[] =[];
  quantity: number = 1;
  currentUserId=1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private reviewService: ReviewService

  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    }
  }

  loadReviews(productId: number): void {
    this.reviewService.getReviewsByProductId(productId).subscribe({
      next: (reviews) => {
        console.log('Reviews loaded:', reviews); // Debug
        this.reviews = reviews || []; // Garantit un tableau vide si null
      },
      error: (err) => {
        console.error('Erreur chargement reviews', err);
        this.reviews = []; // Réinitialise en cas d'erreur
      }
    });
  }

  loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loadReviews(id);
        if (this.product.quantity && this.product.quantity < this.quantity) {
          this.quantity = this.product.quantity;
        }
      },
      error: (err) => console.error('Erreur lors du chargement du produit', err)
    });
  }
  generateStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
  addToCart(): void {
    if (!this.currentUserId) {
      alert('Veuillez vous connecter pour ajouter des articles au panier');
      return;
    }

    if (!this.product || !this.product.id) {
      console.error('Produit non disponible');
      return;
    }

    if (this.quantity < 1 || (this.product.quantity && this.quantity > this.product.quantity)) {
      alert('Quantité invalide');
      return;
    }

    this.cartService.addToCart(this.currentUserId, this.product.id, this.quantity).subscribe({
      next: () => alert('Produit ajouté au panier avec succès!'),
      error: (err) => console.error('Erreur lors de l\'ajout au panier', err)
    });
  }
}
