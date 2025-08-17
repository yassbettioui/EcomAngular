import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  // @ts-ignore
  product: Product = {
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    categoryId:null,
    imageUrl: ''
  };

  imageFile?: File;
  isEditMode = false;
  categories: Category[] = [];
  errorMessage: string | null = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadProduct(+id);
    }
  }

  loadProduct(id: number): void {
    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
      },
      error: (err) => {
        console.error('Error loading product', err);
        this.errorMessage = 'Failed to load product';
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (err) => {
        console.error('Error loading categories', err);
        this.errorMessage = 'Failed to load categories';
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imageFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (!this.validateForm()) return;

    const formData = this.prepareFormData();

    if (this.isEditMode && this.product.id) {
      this.updateProduct(this.product.id, formData);
    } else {
      this.createProduct(formData);
    }
  }

  private validateForm(): boolean {
    this.errorMessage = null;

    if (!this.product.name || !this.product.price || !this.product.quantity) {
      this.errorMessage = 'Please fill all required fields';
      return false;
    }

    return true;
  }

  private prepareFormData(): FormData {
    const formData = new FormData();

    // Créez un objet JSON pour les données produit
    const productData = {
      name: this.product.name,
      description: this.product.description || '',
      price: this.product.price,
      quantity: this.product.quantity,
      categoryId: this.product.categoryId
    };

    // Ajoutez les données produit sous forme de Blob JSON
    formData.append('product', new Blob([JSON.stringify(productData)], {
      type: 'application/json'
    }));

    // Ajoutez l'image si elle existe
    if (this.imageFile) {
      formData.append('image', this.imageFile);
    }

    return formData;
  }

  private createProduct(formData: FormData): void {
    this.productService.createProduct(formData).subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => {
        console.error('Error creating product', err);
        this.errorMessage = 'Failed to create product';
      }
    });
  }

  private updateProduct(id: number, formData: FormData): void {
    this.productService.updateProduct(id, formData).subscribe({
      next: () => this.router.navigate(['/products']),
      error: (err) => {
        console.error('Error updating product', err);
        this.errorMessage = 'Failed to update product';
      }
    });
  }
}
