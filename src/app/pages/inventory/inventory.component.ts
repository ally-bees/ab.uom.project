// src/app/pages/inventory/inventory.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface StockAlert {
  orderId: string;
  date: string;
  quantity: number;
  alertAmount: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

interface BestSellingProduct {
  productId: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
  // Date range filter
  fromDate: string = '2024/12/05';
  toDate: string = '2024/12/12';
 
  // Stock summary data
  stockSummary = {
    inStock: 500,
    lowStock: 220,
    outOfStock: 225
  };

  // Best selling products data
  bestSellingProducts: BestSellingProduct[] = [
    { productId: '00001A', status: 'Low Stock' },
    { productId: '00002B', status: 'In Stock' },
    { productId: '00003C', status: 'Out of Stock' },
    { productId: '00004D', status: 'Low Stock' },
    { productId: '00005E', status: 'In Stock' },
    { productId: '00006E', status: 'Out of Stock' }
  ];
 
  // Search functionality
  searchTerm: string = '';
 
  constructor() { }
 
  ngOnInit(): void {
    // Initialize the component with data
    // In a real application, this would likely fetch data from a service
  }
 
  // Method to filter best selling products based on search term
  filterProducts(): BestSellingProduct[] {
    if (!this.searchTerm) {
      return this.bestSellingProducts;
    }
   
    return this.bestSellingProducts.filter(product =>
      product.productId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.status.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
 
  // Method to update date range
  updateDateRange(): void {
    // In a real application, this would trigger a data refresh based on the new date range
    console.log('Date range updated:', this.fromDate, 'to', this.toDate);
    // You would call a service to fetch new data here
  }

  // Method to print the report
  printReport(): void {
    window.print();
  }
}