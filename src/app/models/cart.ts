import {CartItem} from './cartItem';


export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalPrice: number;
}
