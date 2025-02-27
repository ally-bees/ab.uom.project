
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

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.css']
})
export class InventoryDashboardComponent implements OnInit {
  // Date range filter
  fromDate: string = '2024/12/05';
  toDate: string = '2024/12/12';
  
  // Stock summary data
  stockSummary = {
    inStock: 500,
    lowStock: 220,
    outOfStock: 225
  };
  
  // Stock alerts table data
  stockAlerts: StockAlert[] = [
    { orderId: '1233', date: '2024-05-21', quantity: 255, alertAmount: 8, status: 'Low Stock' },
    { orderId: '1234', date: '2024-05-21', quantity: 11, alertAmount: 5, status: 'In Stock' },
    { orderId: '1255', date: '2024-05-21', quantity: 22, alertAmount: 5, status: 'Out of Stock' },
    { orderId: '1233', date: '2024-05-21', quantity: 255, alertAmount: 8, status: 'Low Stock' },
    { orderId: '1234', date: '2024-05-21', quantity: 11, alertAmount: 5, status: 'In Stock' },
    { orderId: '1255', date: '2024-05-21', quantity: 22, alertAmount: 5, status: 'Out of Stock' }
  ];
  
  // Search functionality
  searchTerm: string = '';
  
  constructor() { }
  
  ngOnInit(): void {
    // Initialize the component with data
    // In a real application, this would likely fetch data from a service
  }
  
  // Method to filter stock alerts based on search term
  filterStockAlerts(): StockAlert[] {
    if (!this.searchTerm) {
      return this.stockAlerts;
    }
    
    return this.stockAlerts.filter(alert => 
      alert.orderId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      alert.status.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  
  // Method to update date range
  updateDateRange(): void {
    // In a real application, this would trigger a data refresh based on the new date range
    console.log('Date range updated:', this.fromDate, 'to', this.toDate);
    // You would call a service to fetch new data here
  }
}