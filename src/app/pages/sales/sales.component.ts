import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sale, Order, Inventory, SalesViewModel } from '../../models/sale.model';
import { SalesService } from '../../services/sales.service';


@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  salesData: SalesViewModel | null = null;
  loading = true;
  error = false;
  selectedVendorId: string = '';
  vendorList: string[] = [];

  constructor(private salesService: SalesService) { }

  ngOnInit(): void {
    this.loadSalesData();
  }

  loadSalesData(): void {
    this.loading = true;
    this.salesService.getDashboardData().subscribe({
      next: (data) => {
        this.salesData = data;
        this.extractVendorList();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading sales data:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadVendorSalesData(): void {
    if (!this.selectedVendorId) {
      this.loadSalesData();
      return;
    }
    
    this.loading = true;
    this.salesService.getDashboardDataByVendor(this.selectedVendorId).subscribe({
      next: (data) => {
        this.salesData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading vendor sales data:', error);
        this.error = true;
        this.loading = false;
      }
    });
  }

  extractVendorList(): void {
    if (this.salesData && this.salesData.sales) {
      this.vendorList = [...new Set(this.salesData.sales.map(sale => sale.vendorId))];
    }
  }

  onVendorChange(): void {
    this.loadVendorSalesData();
  }

  resetFilters(): void {
    this.selectedVendorId = '';
    this.loadSalesData();
  }
}