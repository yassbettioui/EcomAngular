export interface OrderItem {
  id: number; // Ajouté pour correspondre au backend
  productId: number;
  productName: string; // Optionnel
  quantity: number;
  unitPrice: number; // Optionnel - sera calculé côté backend
  price: number; // Optionnel - sera calculé côté backend
  orderId:number;
}
