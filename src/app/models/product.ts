// Dans models/product.ts
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  categoryId: number | null; // Changé de categoryName à categoryId
  categoryName?: string; // Optionnel pour l'affichage seulement
}
