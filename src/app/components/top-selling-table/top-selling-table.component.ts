import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { NgChartsModule } from 'ng2-charts';
import { product } from '../../models/product.model';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-top-selling-table',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridModule, NgChartsModule],
  templateUrl: './top-selling-table.component.html',
  styleUrls: ['./top-selling-table.component.css']
})
export class TopSellingTableComponent implements OnInit {
  topSellingProducts: product[] = [];
  productLimit: number = 10;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadTopSellingProducts();
  }

  loadTopSellingProducts(): void {
    this.inventoryService.getBestSellingProducts(this.productLimit).subscribe({
      next: (products) => {
        this.topSellingProducts = products;
      },
      error: (err) => {
        console.error('Error fetching top-selling products', err);
      }
    });
  }

  // Determine stock status text from quantity
  getStockStatus(quantity: number): string {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 50) return 'Low Stock';
    return 'In Stock';
  }

  // Optional: for applying CSS classes (if used in your HTML/CSS)
  getStockStatusClass(quantity: number): string {
    if (quantity === 0) return 'out-stock';
    if (quantity < 50) return 'low-stock';
    return 'in-stock';
  }
}
