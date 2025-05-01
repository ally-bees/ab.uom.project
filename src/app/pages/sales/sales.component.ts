import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { SalesViewModel } from '../../models/sale.model';
import { SalesService } from '../../services/sales.service';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

interface Sale {
  saleId: string;
  salesDate: string;
  orderId: string;
  productName: string;
  category: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridModule, NgChartsModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
})
export class SalesComponent implements OnInit {
  rowData: Sale[] = [];
  filteredData: Sale[] = [];

  columnDefs: ColDef<Sale>[] = [
    { field: 'saleId', headerName: 'Sale ID', sortable: true },
    { field: 'salesDate', headerName: 'Sales Date', sortable: true },
    { field: 'orderId', headerName: 'Order ID', sortable: true },
    { field: 'productName', headerName: 'Product Name', sortable: true },
    { field: 'category', headerName: 'Category', sortable: true },
    { field: 'quantity', headerName: 'Quantity', sortable: true },
    { field: 'price', headerName: 'Price', sortable: true },
  ];

  defaultColDef = {
    resizable: true,
    flex: 1,
  };

  gridOptions: GridOptions<Sale> = {};
  private gridApi!: GridApi<Sale>;

  showPrintDialog = false;
  fromDate: string = '';
  toDate: string = '';
  searchQuery: string = '';

  // Pie chart 1: Product Name Distribution
  productChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };

  // Pie chart 2: Category Distribution
  categoryChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  // 👇 New property to toggle pie chart view
  activeChart: 'product' | 'category' = 'product';

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.loadSalesData();
  }

  loadSalesData(): void {
    this.salesService.getDashboardData().subscribe({
      next: (data: SalesViewModel) => {
        const transformedData: Sale[] = [];

        data.sales.forEach((sale) => {
          sale.orderIds.forEach((orderId) => {
            const order = data.relatedOrders.find((o) => o.orderId === orderId);
            if (order) {
              order.orderDetails.forEach((orderDetail) => {
                const product = data.relatedInventory.find((p) => p.productId === orderDetail.productId);
                const productName = product?.name || 'Unknown';
                const category = product?.category || 'Unknown';
                const quantity = orderDetail.quantity;
                const price = orderDetail.price;

                transformedData.push({
                  saleId: sale.saleId,
                  salesDate: sale.saleDate ? new Date(sale.saleDate).toISOString().split('T')[0] : 'N/A',
                  orderId: order.orderId,
                  productName,
                  category,
                  quantity,
                  price: parseFloat(price.toFixed(2)),
                });
              });
            }
          });
        });

        this.rowData = transformedData;
        this.filteredData = [...this.rowData];
        this.updatePieCharts();
      },
      error: (err) => console.error('Error fetching sales data:', err),
    });
  }

  onGridReady(params: GridReadyEvent<Sale>): void {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }

  openPrintReport(): void {
    this.showPrintDialog = true;
  }

  closePrintDialog(): void {
    this.showPrintDialog = false;
  }

  printReport(): void {
    window.print();
    this.showPrintDialog = false;
  }

  applyFilters(): void {
    this.filteredData = this.rowData.filter((sale) => {
      const saleDate = sale.salesDate;
      const matchesDate = (!this.fromDate || saleDate >= this.fromDate) && (!this.toDate || saleDate <= this.toDate);
      const matchesSearch = !this.searchQuery || sale.productName.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesDate && matchesSearch;
    });
    this.updatePieCharts();
  }

  onSearchChange(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onDateChange(): void {
    this.applyFilters();
  }

  updatePieCharts(): void {
    const productMap: { [name: string]: number } = {};
    const categoryMap: { [category: string]: number } = {};

    this.filteredData.forEach((sale) => {
      productMap[sale.productName] = (productMap[sale.productName] || 0) + sale.quantity;
      categoryMap[sale.category] = (categoryMap[sale.category] || 0) + sale.quantity;
    });

    this.productChartData = {
      labels: Object.keys(productMap),
      datasets: [{ data: Object.values(productMap) }],
    };

    this.categoryChartData = {
      labels: Object.keys(categoryMap),
      datasets: [{ data: Object.values(categoryMap) }],
    };
  }
}
