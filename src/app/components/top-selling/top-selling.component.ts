import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular'; 
import { NgChartsModule } from 'ng2-charts';     
import { product } from '../../models/product.model';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-top-selling',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridModule, NgChartsModule], // Include common Angular modules required for forms and structure
  templateUrl: './top-selling.component.html',
  styleUrls: ['./top-selling.component.css']
})
export class TopSellingComponent implements OnInit {
  topSellingProducts: product[] = [];
  productLimit: number = 10; // Default to 10
  page: number = 1;
  pageSize: number = 10;

  get pagedProducts() {
    const start = (this.page - 1) * this.pageSize;
    return this.topSellingProducts.slice(start, start + this.pageSize);
  }

  get totalPages() {
    return Math.ceil(this.topSellingProducts.length / this.pageSize);
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

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

  // Generate a gradient color for each product based on its index
  getProductBackgroundColor(index: number): string {
    const startColor = { r: 0, g: 51, b: 102 }; // Dark blue
    const endColor = { r: 204, g: 224, b: 255 }; // Lightest blue

    // Calculate the factor based on the index
    const factor = index / (this.productLimit - 1);

    const r = Math.round(startColor.r + (endColor.r - startColor.r) * factor);
    const g = Math.round(startColor.g + (endColor.g - startColor.g) * factor);
    const b = Math.round(startColor.b + (endColor.b - startColor.b) * factor);

    return `rgb(${r}, ${g}, ${b})`;
  }

  // Determine if a color is light or dark by calculating its luminance
  getTextColor(backgroundColor: string): string {
    // Extract RGB values from the background color
    const rgb = backgroundColor.match(/\d+/g)?.map(Number);
    if (rgb) {
      const [r, g, b] = rgb;
      // Using luminance formula to calculate brightness
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return luminance > 128 ? 'black' : 'white';
    }
    return 'black'; // Default text color if something goes wrong
  }
}
