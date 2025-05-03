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

  productChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };

  categoryChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };

  comparisonChartData: ChartData<'doughnut', number[], string | string[]> = {
    labels: ['Current Period', 'Previous Period'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#4CAF50', '#F44336'],
      borderWidth: 1
    }]
  };

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  donutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: {
        display: true,
        text: 'Monthly Sales Comparison',
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = Number(context.raw) || 0;
            const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: $${value.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    }
  };

  activeChart: 'product' | 'category' = 'product';

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 30);

    this.fromDate = from.toISOString().split('T')[0];
    this.toDate = today.toISOString().split('T')[0];

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
        this.applyFilters();
      },
      error: (err) => console.error('Error fetching sales data:', err),
    });
  }
  updateComparisonChart(): void {
    if (!this.fromDate || !this.toDate) return;
  
    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);
  
    // Calculate duration in days
    const rangeDuration = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
    // Previous date range
    const previousTo = new Date(from);
    previousTo.setDate(previousTo.getDate() - 1);
  
    const previousFrom = new Date(previousTo);
    previousFrom.setDate(previousFrom.getDate() - (rangeDuration - 1));
  
    let currentTotal = 0;
    let previousTotal = 0;
  
    this.rowData.forEach((sale) => {
      const saleDate = new Date(sale.salesDate);
      if (saleDate >= from && saleDate <= to) {
        currentTotal += sale.price;
      } else if (saleDate >= previousFrom && saleDate <= previousTo) {
        previousTotal += sale.price;
      }
    });
  
    this.comparisonChartData = {
      labels: [
        'Current Period',
        'Previous Period'
      ],
      datasets: [{
        data: [currentTotal, previousTotal],
        backgroundColor: ['#4CAF50', '#F44336'],
        borderWidth: 1
      }]
    };
  
    this.donutChartOptions = {
      ...this.donutChartOptions,
      plugins: {
        ...this.donutChartOptions.plugins,
        title: {
          ...this.donutChartOptions.plugins?.title,
          text: `Sales Comparison: ${from.toISOString().split('T')[0]} - ${to.toISOString().split('T')[0]} vs Previous`
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = Number(context.raw) || 0;
              const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
              const percentage = Math.round((value / total) * 100);
              return `${label}: $${value.toLocaleString()} (${percentage}%)`;
            },
            afterLabel: (context) => {
              if (context.dataIndex === 0) {
                return `${from.toISOString().split('T')[0]} to ${to.toISOString().split('T')[0]}`;
              } else {
                return `${previousFrom.toISOString().split('T')[0]} to ${previousTo.toISOString().split('T')[0]}`;
              }
            }
          }
        }
      }
    };
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
      const matchesDate = (!this.fromDate || saleDate >= this.fromDate) &&
                         (!this.toDate || saleDate <= this.toDate);
      const matchesSearch = !this.searchQuery || sale.productName.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesDate && matchesSearch;
    });

    this.updatePieCharts();
    this.updateComparisonChart();
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

  calculateMonthlyProfitPercentage(): number {
    const data = this.comparisonChartData?.datasets?.[0]?.data;

    if (!data || data.length < 2) {
      return 0;
    }

    const current = data[0] as number;
    const previous = data[1] as number;

    if (previous === 0) return 0;

    const percentageChange = ((current - previous) / previous) * 100;
    return Math.round(percentageChange * 10) / 10;
  }

  isProfitIncreased(): boolean {
    const data = this.comparisonChartData?.datasets?.[0]?.data;
    if (!data || data.length < 2) return false;

    return data[0] > data[1];
  }
}
