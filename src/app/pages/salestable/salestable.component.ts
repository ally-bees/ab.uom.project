import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SalesService } from '../../services/sales.service';
import { ColDef, GridOptions, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
    
interface Sale {
  saleId: string;
  salesDate: string;
  orderId: string;
  productId: string;
  productName: string;
  category: string;
  quantity: number;
  price: number;
  companyId: string;
}

@Component({
  selector: 'app-salestable',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridModule, NgChartsModule],
  templateUrl: './salestable.component.html',
  styleUrls: ['./salestable.component.css']
})
export class SalestableComponent implements OnInit {
  salesData: Sale[] = [];
  filteredData: Sale[] = [];
  loading = false;
  error = '';
  page = 1;
  pageSize = 13;
  searchQuery: string = '';
  fromDate: string = '';
  toDate: string = '';
  today: string = new Date().toISOString().split('T')[0];

  columnDefs: ColDef<Sale>[] = [
    { field: 'saleId', headerName: 'Sale ID', sortable: true },
    { field: 'salesDate', headerName: 'Sales Date', sortable: true, valueFormatter: (params: any) => {
      if (!params.value) return '';
      // If value is already YYYY-MM-DD, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(params.value)) return params.value;
      // Otherwise, parse and format as YYYY-MM-DD
      const date = new Date(params.value);
      return isNaN(date.getTime()) ? params.value : date.toISOString().split('T')[0];
    } },
    { field: 'orderId', headerName: 'Order ID', sortable: true },
    { field: 'productId', headerName: 'Product ID', sortable: true },
    { field: 'quantity', headerName: 'Quantity', sortable: true },
    { field: 'price', headerName: 'Price', sortable: true, valueFormatter: (params: any) => Number(params.value).toFixed(2) }
  ];
  defaultColDef = { resizable: true, flex: 1 };
  gridOptions: GridOptions<Sale> = {};
  private gridApi!: GridApi<Sale>;

  get totalPages() {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }
  get pagedData() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  constructor(private salesService: SalesService, private router: Router) {}

  ngOnInit(): void {
    // Default to last 7 days
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 7);
    this.fromDate = from.toISOString().split('T')[0];
    this.toDate = today.toISOString().split('T')[0];
    this.loadSalesData();
  }

  loadSalesData(): void {
    this.loading = true;
    this.error = '';
    this.salesService.getAggregatedSales(this.fromDate, this.toDate).subscribe({
      next: (data) => {
        this.salesData = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load sales data.';
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredData = this.salesData.filter((sale) => {
      const saleDate = sale.salesDate;
      const matchesDate = (!this.fromDate || saleDate >= this.fromDate) && (!this.toDate || saleDate <= this.toDate);
      const search = this.searchQuery.trim().toLowerCase();
      const matchesSearch = !search || [
        sale.saleId,
        sale.orderId,
        sale.productId
      ].some(field => (field || '').toLowerCase().includes(search));
      return matchesDate && matchesSearch;
    })
    .sort((a, b) => b.salesDate.localeCompare(a.salesDate)); // Sort by date descending
    this.page = 1;
  }

  onSearchChange(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onDateChange(): void {
    this.loadSalesData();
  }

  onGridReady(params: GridReadyEvent<Sale>): void {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }

  nextPage() {
    if (this.page < this.totalPages) this.page++;
  }
  prevPage() {
    if (this.page > 1) this.page--;
  }

  goBack() {
    this.router.navigate(['/salesmanager/sales']);
  }
} 