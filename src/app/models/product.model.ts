export interface product {
  id?: string;
  productId: string;
  name: string;
  category: string;
  price: number;
  stockQuantity: number;
  description: string;
  companyId: string; // Added for company filtering
}
