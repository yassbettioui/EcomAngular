import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product';
import {catchError, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, formData);
  }

  updateProduct(id: number, formData: FormData): Observable<Product> {
    // Ajoutez le debuggage
    console.log('Sending update for product ID:', id);
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    return this.http.put<Product>(`${this.apiUrl}/${id}`, formData).pipe(
      catchError(error => {
        console.error('Detailed error:', error);
        throw error;
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProductsByCategory(categoryId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/${categoryId}`);
  }

  // Récupère les produits par nom de catégorie
  getProductsByCategoryName(categoryName: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/category/name/${categoryName}`);
  }
}
