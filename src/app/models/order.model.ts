export interface Order {
    orderId: string;           // Unique identifier for the order
    customerId: string;       // Customer ID
    orderDetails: OrderDetail[]; // Array of order details, each containing a product and its quantity and price
    totalAmount: number;       // Total amount for the order
    orderDate: string;         // Date of the order
    status: string;            // Status of the order
  }
  
  export interface OrderDetail {
    productId: string;  // ID of the product in the order
    quantity: number;   // Quantity of the product ordered
    price: number;      // Price of the product in the order
  }
  