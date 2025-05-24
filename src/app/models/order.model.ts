export interface Order {
  id?: string;
  orderId: string;
  customerId: string;
  orderDetails: OrderDetail[];
  totalAmount: number;
  orderDate: string;
  status: string;
}

export interface OrderDetail {
  productId: string;
  quantity: number;
  price: number;
}

export interface OrderSummary {
  totalOrders: number;
  totalRevenue: number;
  totalSales: number;
}

