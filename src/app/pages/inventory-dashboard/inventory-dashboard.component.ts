import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { product } from '../../models/product.model';
import { InventoryService } from '../../services/inventory.service';
import { TopSellingTableComponent } from '../../components/top-selling-table/top-selling-table.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-inventory-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,TopSellingTableComponent],
  templateUrl: './inventory-dashboard.component.html',
  styleUrls: ['./inventory-dashboard.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class InventoryDashboardComponent implements OnInit {
  products: product[] = [];
  bestSellingProducts: product[] = [];  // Passed to <app-top-selling-table>
  searchTerm: string = '';

  inStockCount = 0;
  lowStockCount = 0;
  outOfStockCount = 0;

  constructor(private inventoryService: InventoryService, private authService: AuthService) {}

  ngOnInit(): void {
    const companyId = this.authService.getCurrentUser()?.CompanyId;
    console.log('Current user company ID:', companyId);
    this.loadProducts();
  }

  loadProducts(): void {
    this.inventoryService.getInventoryByCompany().subscribe({
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
    if (product.stockQuantity <= 50) return 'Low Stock';
    return 'In Stock';
  }

  filteredProducts(): product[] {
    const term = this.searchTerm.toLowerCase();
    const filtered = this.products.filter(p =>
      p.stockQuantity <= 50 && p.name.toLowerCase().includes(term)
    );
    return [
      ...filtered.filter(p => p.stockQuantity === 0),
      ...filtered.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 50)
    ];
  }

  loadBestSellingProducts(): void {
    this.inventoryService.getBestSellingProductsByCompany(10).subscribe({
      next: (products) => {
        this.bestSellingProducts = products;
      },
      error: (err) => {
        console.error('Error fetching best selling products for company', err);
      }
    });
  }
}
