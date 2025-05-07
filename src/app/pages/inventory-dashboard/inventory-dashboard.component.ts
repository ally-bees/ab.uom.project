import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { product } from '../../models/product.model';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.css']
})
export class InventoryDashboardComponent implements OnInit {
  products: product[] = [];
  bestSellingProducts: product[] = [];
  searchTerm: string = '';

  inStockCount = 0;
  lowStockCount = 0;
  outOfStockCount = 0;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.inventoryService.getAllProducts().subscribe({
      next: (data: product[]) => {
        this.products = data;
        this.calculateStockCounts();
        this.loadBestSellingProducts();
      },
      error: err => console.error('Error loading products:', err)
    });
  }

  calculateStockCounts(): void {
    this.inStockCount = this.products.filter(p => p.stockQuantity > 20).length;
    this.lowStockCount = this.products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 20).length;
    this.outOfStockCount = this.products.filter(p => p.stockQuantity === 0).length;
  }

  getStockStatusClass(product: product): string {
    if (product.stockQuantity === 0) return 'stock-status out-of-stock';
    if (product.stockQuantity <= 20) return 'stock-status low-stock';
    return 'stock-status in-stock';
  }

  getStockStatusText(product: product): string {
    if (product.stockQuantity === 0) return 'Out of Stock';
    if (product.stockQuantity <= 20) return 'Low Stock';
    return 'In Stock';
  }

  filteredProducts(): product[] {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.products.filter(p =>
      p.stockQuantity <= 20 && p.name.toLowerCase().includes(term)
    );
    return [
      ...filtered.filter(p => p.stockQuantity === 0),
      ...filtered.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 20)
    ];
  }

  loadBestSellingProducts(): void {
    // Assume best 10 are determined by stock reduction logic (e.g., lowest stock among popular ones)
    this.bestSellingProducts = [...this.products]
      .sort((a, b) => a.stockQuantity - b.stockQuantity)
      .slice(0, 10);
  }
}