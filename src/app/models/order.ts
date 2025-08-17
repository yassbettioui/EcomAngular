import {OrderItem} from './OrderItem';
import {OrderStatus} from './orderStatus';
import {PaymentMethod} from './PaymentMethod';

export interface Order {
  id: number;
  customerId: number;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  paymentMethod?: PaymentMethod
}
