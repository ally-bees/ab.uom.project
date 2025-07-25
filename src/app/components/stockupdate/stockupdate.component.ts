import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { product } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stockupdate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stockupdate.component.html',
  styleUrl: './stockupdate.component.css'
})
export class StockupdateComponent implements OnInit {
  products: product[] = [];
  addQuantities: { [productId: string]: number } = {};
  reduceQuantities: { [productId: string]: number } = {};
  message: string = '';
  loading: boolean = false;
  searchTerm: string = '';

  constructor(
    private inventoryService: InventoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inventoryService.getInventoryByCompany().subscribe({
      next: (data) => {
        console.log('Loaded products:', data); // Debug log
        this.products = data;
      },
      error: () => this.message = 'Failed to load products.'
    });
  }

  updateStock(productId: string) {
    const addQuantity = this.addQuantities[productId];
    if (!addQuantity || addQuantity <= 0) {
      this.message = 'Please enter a valid quantity.';
      setTimeout(() => this.message = '', 2500);
      return;
    }
    this.loading = true;
    this.inventoryService.updateProductStock(productId, addQuantity).subscribe({
      next: () => {
        this.message = 'Stock updated successfully!';
        this.loading = false;
        // Optionally refresh product list
        this.ngOnInit();
        this.addQuantities[productId] = 0;
        setTimeout(() => this.message = '', 2500);
      },
      error: () => {
        this.message = 'Failed to update stock.';
        this.loading = false;
        setTimeout(() => this.message = '', 2500);
      }
    });
  }

  reduceStock(productId: string): void {
    const quantity = this.reduceQuantities[productId];
    if (!quantity || quantity <= 0) return;
    this.loading = true;
    this.message = '';
    this.inventoryService.reduceStock(productId, quantity).subscribe({
      next: (res) => {
        this.message = 'Stock reduced successfully!';
        this.reduceQuantities[productId] = 0;
        this.ngOnInit();
        this.loading = false;
      },
      error: (err) => {
        this.message = 'Failed to reduce stock.';
        this.loading = false;
      }
    });
  }

  filteredProducts(): product[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.products;
    return this.products.filter(p =>
      p.productId.toLowerCase().includes(term) ||
      p.name.toLowerCase().includes(term)
    );
  }

  goBack(): void {
    this.router.navigate(['../']);
  }
}
