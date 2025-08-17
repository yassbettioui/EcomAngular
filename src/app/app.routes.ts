import { Routes } from '@angular/router';
import {ProductListComponent} from './components/product-list/product-list.component';
import {ProductFormComponent} from './components/product-form/product-form.component';
import {OrderListComponent} from './components/orders/order-list/order-list.component';
import {OrderDetailComponent} from './components/orders/order-detail/order-detail.component';
import {HomeComponent} from './components/home/home.component';
import {ProductDetailComponent} from './components/product-detail/product-detail.component';
import {CartComponent} from './components/cart/cart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/add', component: ProductFormComponent },
  { path: 'products/:id', component: ProductFormComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'orders', component: OrderListComponent },
  { path: 'orders/:id', component: OrderDetailComponent },//
  { path: 'cart', component: CartComponent },//
  { path: 'products/edit/:id', component: ProductFormComponent }

];
