import {PaymentStatus} from './PaymentStatus';
import {PaymentMethod} from './PaymentMethod';

export interface Payment {
  id: number;
  orderId: number; // Uniquement lié à une commande
  amount: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  transactionId: string;
  currency: string;
  createdAt: Date; // correction ici : "Date" avec D majuscule
  updatedAt: Date; // correction ici : ajout de la clé + Date
}
