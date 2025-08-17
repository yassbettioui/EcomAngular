import {OrderItem} from './OrderItem';
import {OrderStatus} from './orderStatus';

export interface Order {
  id: number;
  customerId: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  paymentMethod?: string;
}
