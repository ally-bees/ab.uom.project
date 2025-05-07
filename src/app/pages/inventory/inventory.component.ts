import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { product } from '../../models/product.model';
import { InventoryService } from '../../services/inventory.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit, AfterViewInit {
  @ViewChild('stockChart') stockChartRef!: ElementRef<HTMLCanvasElement>;
  stockChart!: Chart;

  products: product[] = [];
  searchTerm: string = '';

  inStockCount = 0;
  lowStockCount = 0;
  outOfStockCount = 0;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  loadProducts(): void {
    this.inventoryService.getAllProducts().subscribe({
      next: (data: product[]) => {
        this.products = data;
        this.calculateStockCounts();
      },
      error: err => console.error('Error loading products:', err)
    });
  }

  calculateStockCounts(): void {
    this.inStockCount = this.products.filter(p => p.stockQuantity > 20).length;
    this.lowStockCount = this.products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 20).length;
    this.outOfStockCount = this.products.filter(p => p.stockQuantity === 0).length;

    if (this.stockChart) {
      this.stockChart.data.datasets[0].data = [
        this.inStockCount,
        this.lowStockCount,
        this.outOfStockCount
      ];
      this.stockChart.update();
    }
  }

  getStockStatus(product: product): string {
    if (product.stockQuantity === 0) return 'Out of stock';
    if (product.stockQuantity <= 20) return 'Low Stock';
    return 'In Stock';
  }

  getStockStatusClass(product: product): string {
    if (product.stockQuantity === 0) return 'out-of-stock';
    if (product.stockQuantity <= 20) return 'low-stock';
    return 'in-stock';
  }

  filteredProducts(): product[] {
    const term = this.searchTerm.toLowerCase();
    if (!term) return this.products; // If no search term, return all products
    return this.products.filter(product =>
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
    );
  }

  initializeChart(): void {
    const ctx = this.stockChartRef.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Chart context not found');
      return;
    }

    this.stockChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['In Stock', 'Low Stock', 'Out of Stock'],
        datasets: [{
          data: [this.inStockCount, this.lowStockCount, this.outOfStockCount],
          backgroundColor: ['#559bfe', '#fee767', '#ff5967'],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }
}
