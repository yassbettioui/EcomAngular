// services/review.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import { Review } from '../models/review';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8080/api/reviews';

  constructor(private http: HttpClient) { }

  // Récupérer toutes les reviews
  getAllReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl);
  }

  // Récupérer une review par ID
  getReviewById(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.apiUrl}/${id}`);
  }

  // Créer une nouvelle review
  createReview(review: Partial<Review>): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review);
  }

  // Mettre à jour une review
  updateReview(id: number, review: Partial<Review>): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${id}`, review);
  }

  // Supprimer une review
  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Récupérer les reviews d'un produit spécifique
  getReviewsByProductId(productId: number): Observable<Review[]> {
    const url = `${this.apiUrl}/product/${productId}`;
    console.log('Fetching reviews from:', url); // Debug
    return this.http.get<Review[]>(url).pipe(
      tap(reviews => console.log('Received reviews:', reviews)) // Debug
    );
  }
}
