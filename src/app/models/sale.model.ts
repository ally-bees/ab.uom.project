export interface Sale {
    id?: string;
    saleId: string;
    vendorId: string;
    productIds: string[];
    date: string;
    totalSales: number;
    totalOrdersCount: number;
    totalItemsSold: number;
  }
  
  export interface Order {
    id?: string;
    orderId: string;
    customerId: string;
    productIds: string[];
    quantities: number[];
    totalAmount: number;
    orderDate: string;
    status: string;
  }
  
  export interface Inventory {
    id?: string;
    productId: string;
    productName: string;
    quantityAvailable: number;
    availabilityStatus: boolean;
    price: number;
    category: string;
  }
  
  export interface SalesViewModel {
    sales: Sale[];
    relatedOrders: Order[];
    relatedInventory: Inventory[];
    totalRevenue: number;
    totalItems: number;
    totalOrders: number;
  }