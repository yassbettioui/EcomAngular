import {PaymentStatus} from './PaymentStatus';

export interface Payment {
  id: number;
  orderId: number; // Uniquement lié à une commande
  amount: number;
  paymentMethod: string;
  status: PaymentStatus;
  transactionId: string;
  currency: string;
  createdAt: Date; // correction ici : "Date" avec D majuscule
  updatedAt: Date; // correction ici : ajout de la clé + Date
}
