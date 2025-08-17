import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    RouterLink,
    CurrencyPipe,
    CommonModule
  ]
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: any[] = [];
  selectedCategory: number | null = null;
  currentUserId=1;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
      },
      error: (err) => console.error('Erreur lors du chargement des produits', err)
    });
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const categoryId = selectElement.value ? +selectElement.value : null;
    this.filterByCategory(categoryId);
  }

  filterByCategory(categoryId: number | null): void {
    this.selectedCategory = categoryId;
    if (!categoryId) {
      this.filteredProducts = [...this.products];
    } else {
      this.productService.getProductsByCategory(categoryId).subscribe({
        next: (products) => this.filteredProducts = products,
        error: (err) => console.error('Erreur lors du filtrage des produits', err)
      });
    }
  }

  addToCart(productId: number): void {
    if (!this.currentUserId) {
      alert('Veuillez vous connecter pour ajouter des articles au panier');
      return;
    }
    this.cartService.addToCart(this.currentUserId, productId, 1).subscribe({
      next: () => alert('Produit ajouté au panier avec succès!'),
      error: (err) => console.error('Erreur lors de l\'ajout au panier', err)
    });
  }
}
