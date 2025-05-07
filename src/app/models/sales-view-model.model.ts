import { Order } from './order.model';
import { Sale } from './sale.model';
import { product } from './product.model';

export interface SalesViewModel {
  sales: Sale[];
  relatedOrders: Order[];
  relatedInventory: product[];
  totalRevenue: number;
  totalItems: number;
  totalOrders: number;
}