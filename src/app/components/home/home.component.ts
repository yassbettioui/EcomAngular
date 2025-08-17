import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TruncatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  pagedProducts: Product[] = [];
  categories: Category[] = [];
  currentPage = 1;
  itemsPerPage = 6;
  totalProducts = 0;
  totalPages = 1;
  isLoading = true;
  selectedCategoryId: number | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadAllProducts(); // Charge tous les produits initialement
  }

  loadAllProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = [...products];
        this.updatePagination();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.isLoading = false;
      }
    });
  }

  loadProductsByCategory(categoryId: number): void {
    this.isLoading = true;
    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (products) => {
        this.filteredProducts = products;
        this.updatePagination();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products by category', err);
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories.sort((a, b) => a.name.localeCompare(b.name));
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.categories = [];
      }
    });
  }

  onCategoryChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;
    this.selectedCategoryId = value ? Number(value) : null;
    this.currentPage = 1;

    if (this.selectedCategoryId === null) {
      // Charge tous les produits
      this.filteredProducts = [...this.products];
      this.updatePagination();
    } else {
      // Charge les produits par catégorie
      this.loadProductsByCategory(this.selectedCategoryId);
    }
  }

  updatePagination(): void {
    this.totalProducts = this.filteredProducts.length;
    this.totalPages = Math.ceil(this.totalProducts / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.pagedProducts = this.filteredProducts.slice(startIndex, endIndex);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
    window.scrollTo(0, 0);
  }

  getPages(): number[] {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  addToCart(productId: number): void {
    this.cartService.addToCart(1, productId, 1).subscribe({
      next: () => alert('Produit ajouté au panier'),
      error: (err) => console.error('Error adding to cart', err)
    });
  }
}
