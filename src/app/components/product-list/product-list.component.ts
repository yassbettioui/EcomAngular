import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;

  searchText = '';
  sortField = 'name';
  sortDirection = 'asc';
  filteredProducts: Product[] = [];


  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.totalItems = products.length;
        this.applyFilters(); // Si vous utilisez les filtres
      },
      error: (err) => console.error('Error loading products', err)
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.products = this.products.filter(p => p.id !== id),
        error: (err) => console.error('Error deleting product', err)
      });
    }
  }

  applyFilters(): void {
    // Crée une copie du tableau original pour éviter les mutations directes
    let result = [...this.products];

    // Filtrage
    if (this.searchText) {
      const searchLower = this.searchText.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        (p.description?.toLowerCase()?.includes(searchLower))
      );
    }

    // Tri
    result.sort((a, b) => {
      // Utilisation de l'opérateur de coalescence nulle pour les champs optionnels
      const valueA = this.getSortValue(a);
      const valueB = this.getSortValue(b);

      if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.filteredProducts = result;
    this.currentPage = 1;
    this.totalItems = result.length;
  }

  private getSortValue(product: Product): string | number {
    const value = product[this.sortField as keyof Product];

    // Gestion des valeurs undefined/null et conversion en string pour la comparaison
    if (value === undefined || value === null) return '';

    // Si c'est un nombre, retourne le nombre directement
    if (typeof value === 'number') return value;

    // Pour les autres cas (string), retourne la version lowercase
    return String(value).toLowerCase();
  }


  totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }


  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
