import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular'; 
import { NgChartsModule } from 'ng2-charts';     
import { product } from '../../models/product.model';
import { InventoryService } from '../../services/inventory.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-top-selling',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridModule, NgChartsModule],
  templateUrl: './top-selling.component.html',
  styleUrls: ['./top-selling.component.css']
})
export class TopSellingComponent implements OnInit {
  topSellingProducts: product[] = [];
  productLimit: number = 9; // Default to 9
  page: number = 1;
  pageSize: number = 9;

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

  constructor(private inventoryService: InventoryService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadTopSellingProducts();
  }

  loadTopSellingProducts(): void {
    const companyId = this.authService.getCurrentUser()?.CompanyId;
    this.inventoryService.getInventoryByCompany().subscribe({
      next: (products) => {
        this.topSellingProducts = products.slice(0, this.productLimit);
      },
      error: (err) => {
        console.error('Error fetching company products', err);
      }
    });
  }

  // Generate a gradient color for each product based on its index
  getProductBackgroundColor(index: number): string {
    const startColor = { r: 0, g: 154, b: 177 }; // Dark blue rgb(200, 248, 255)
    const endColor = { r: 200, g: 248, b: 255 }; // Lightest blue rgb(0, 154, 177)

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
