import { Order } from './order.model';
import { product } from './product.model';

export interface Sale {
  id?: string;
  saleId: string;
  orderIds: string[];
  saleDate: string;
  amount: number;
}

export interface SalesViewModel {
  sales: Sale[];
  relatedOrders: Order[];
  relatedInventory: product[];
  totalRevenue: number;
  totalItems: number;
  totalOrders: number;
}
