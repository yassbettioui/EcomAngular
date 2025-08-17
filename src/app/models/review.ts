// models/review.ts
export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  productId: number;
  userId: number;
  userName: string;
}
