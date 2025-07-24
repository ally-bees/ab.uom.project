import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { product } from '../../models/product.model';
import { InventoryService } from '../../services/inventory.service';
import Chart from 'chart.js/auto';
import { Router } from '@angular/router';
import { PrintReportService } from '../../services/printreport.service'; // ✅ Import the service
import { MatSnackBar } from '@angular/material/snack-bar'; // ✅ Optional: For feedback

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

  showStockModal = false;
  selectedProduct: product | null = null;
  modalAddQuantity: number = 0;
  modalMessage: string = '';

  constructor(private inventoryService: InventoryService, 
    private printReportService: PrintReportService,
  private snackBar: MatSnackBar,
  private router: Router
) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit(): void {
    this.initializeChart();
  }

  loadProducts(): void {
    this.inventoryService.getInventoryByCompany().subscribe({
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
    let filtered = this.products;
    if (term) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    }
    // Sort: Out of Stock first, then Low Stock, then In Stock
    return filtered.sort((a, b) => {
      const getStatusOrder = (p: product) => {
        if (p.stockQuantity === 0) return 0; // Out of Stock
        if (p.stockQuantity <= 20) return 1; // Low Stock
        return 2; // In Stock
      };
      return getStatusOrder(a) - getStatusOrder(b);
    });
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

  goToStockUpdate() {
    this.router.navigate(['/businessowner/stockupdate']);
  }

  openStockModal(product: product) {
    this.selectedProduct = product;
    this.modalAddQuantity = 0;
    this.modalMessage = '';
    this.showStockModal = true;
  }

  closeStockModal() {
    this.showStockModal = false;
    this.selectedProduct = null;
    this.modalAddQuantity = 0;
    this.modalMessage = '';
  }

  confirmStockUpdate() {
    if (!this.selectedProduct || !this.modalAddQuantity || this.modalAddQuantity <= 0) {
      this.modalMessage = 'Please enter a valid quantity.';
      return;
    }
    const productId = this.selectedProduct.productId;
    this.inventoryService.updateProductStock(productId, this.modalAddQuantity).subscribe({
      next: () => {
        this.modalMessage = 'Stock updated successfully!';
        // Update the product in the table
        this.selectedProduct!.stockQuantity += this.modalAddQuantity;
        setTimeout(() => this.closeStockModal(), 1200);
      },
      error: () => {
        this.modalMessage = 'Failed to update stock.';
      }
    });
  }
  printReport(): void {
  if (!this.products || this.products.length === 0) {
    this.snackBar.open('No inventory data available to print.', 'Close', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
    return;
  }

  const tableColumns = ['Product ID', 'Name', 'Category', 'Price', 'Quantity', 'Status'];
  const tableData = this.filteredProducts().map(product => ({
    'Product ID': product.productId,
    'Name': product.name,
    'Category': product.category,
    'Price': `Rs. ${product.price.toFixed(2)}`,
    'Quantity': product.stockQuantity,
    'Status': this.getStockStatus(product)
  }));

  const reportPayload = {
    reportType: 'Inventory Report',
    exportFormat: 'PDF Document (.pdf)',
    pageOrientation: 'Portrait',
    tableColumns,
    tableData
  };

  this.printReportService.setReportData(reportPayload); // Store the data

  this.router.navigate(['/businessowner/printreport'], {
    state: reportPayload
  });
}

}
