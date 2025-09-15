import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { SalesViewModel } from '../../models/sale.model';
import { SalesService } from '../../services/sales.service';
import { Order } from '../../models/order.model';
import { product } from '../../models/product.model';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { forkJoin, of } from 'rxjs';

// Sale interface for AG Grid and internal processing
interface Sale {
  saleId: string;
  salesDate: string;
  orderId: string;
  productId: string;
  productName: string; // <-- Add this line
  category: string;
  quantity: number;
  price: number;
  companyId: string;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridModule, NgChartsModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
})
export class SalesComponent implements OnInit {
  // Full data from backend
  rowData: Sale[] = [];
  previousRowData: Sale[] = [];

  // Filtered data used in charts and table
  filteredData: Sale[] = [];
  page: number = 1;
  pageSize: number = 15;

  get totalPages() {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  get pagedFilteredData() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
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

  // Column definitions for AG Grid
  columnDefs: ColDef<Sale>[] = [
    { field: 'saleId', headerName: 'Sale ID', sortable: true },
    { field: 'salesDate', headerName: 'Sales Date', sortable: true },
    { field: 'orderId', headerName: 'Order ID', sortable: true },
    { field: 'productId', headerName: 'Product ID', sortable: true },
    { field: 'category', headerName: 'Category', sortable: true },
    { field: 'quantity', headerName: 'Quantity', sortable: true },
    { field: 'price', headerName: 'Price', sortable: true, valueFormatter: (params: any) => Number(params.value).toFixed(2) }
  ];

  defaultColDef = {
    resizable: true,
    flex: 1,
  };

  // AG Grid instance reference
  gridOptions: GridOptions<Sale> = {};
  private gridApi!: GridApi<Sale>;

  // State variables for filters and dialog
  showPrintDialog = false;
  fromDate: string = '';
  toDate: string = '';
  searchQuery: string = '';
  today: string = '';

  // ---------------- Chart Data Definitions ---------------- //

  // Pie chart for sales by product
  productChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };

  // Pie chart for sales by category
  categoryChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{ data: [] }],
  };

  // Donut chart comparing current vs previous period sales totals
  comparisonChartData: ChartData<'doughnut', number[], string | string[]> = {
    labels: ['Current Period', 'Previous Period'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#4CAF50', '#F44336'],
      borderWidth: 1
    }]
  };

  // Line chart of daily sales amount
  dailySalesChartData: ChartData<'line', number[], string> = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Sales Amount',
      borderColor: '#3e95cd',
      backgroundColor: '#7bb6dd',
      fill: false,
      tension: 0.1
    }]
  };

  // Common chart options for pie
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  // Donut chart options with tooltip customization
  donutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: {
        display: true,
        text: 'According to Selected Date Range',
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

  // Line chart Y-axis scaling and tooltip formatting
  dailySalesChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `$${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: (value) => {
            return '$' + value;
          }
        }
      }
    }
  };

  // Track which pie chart is visible in slideshow
  activeChart: 'product' | 'category' = 'category';

  products: product[] = [];

  // Loading and error state
  loading: boolean = false;
  error: string = '';

  constructor(
    private salesService: SalesService,
    private router: Router
  ) {}

  // Initialize with last 7 days by default
  ngOnInit(): void {
    const today = new Date();
    this.today = today.toISOString().split('T')[0];
    const from = new Date();
    from.setDate(today.getDate() - 30); // Use 7 for a week

    this.fromDate = from.toISOString().split('T')[0];
    this.toDate = today.toISOString().split('T')[0];

    this.loadSalesData();
  }

  // Fetch sales data for the company and transform it for the table
  loadSalesData(): void {
    this.loading = true;
    this.error = '';

    // Calculate previous period
    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);
    const rangeDays = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const prevTo = new Date(from);
    prevTo.setDate(prevTo.getDate() - 1);
    const prevFrom = new Date(prevTo);
    prevFrom.setDate(prevFrom.getDate() - (rangeDays - 1));
    const prevFromStr = prevFrom.toISOString().split('T')[0];
    const prevToStr = prevTo.toISOString().split('T')[0];

    forkJoin({
      current: this.salesService.getAggregatedSales(this.fromDate, this.toDate),
      previous: this.salesService.getAggregatedSales(prevFromStr, prevToStr)
    }).subscribe({
      next: ({ current, previous }) => {
        this.rowData = current;
        this.previousRowData = previous;
        this.products = [];
        this.applyFilters();
        this.updateComparisonChart(); // Only update after data loads
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load sales data.';
        this.loading = false;
      }
    });
  }

  // Update donut chart comparing current vs previous period total sales
  updateComparisonChart(): void {
    if (!this.fromDate || !this.toDate) return;

    let currentTotal = 0;
    let previousTotal = 0;

    // Sum sales for current and previous date ranges
    currentTotal = this.rowData.reduce((sum, sale) => sum + sale.price, 0);
    previousTotal = this.previousRowData.reduce((sum, sale) => sum + sale.price, 0);

    // Update chart data
    this.comparisonChartData = {
      labels: ['Current Period', 'Previous Period'],
      datasets: [{
        data: [currentTotal, previousTotal],
        backgroundColor: ['#4CAF50', '#F44336'],
        borderWidth: 1
      }]
    };
  }

  // Update daily line chart of sales per day
  updateDailySalesChart(): void {
    if (!this.fromDate || !this.toDate) return;

    // Prepare a map for daily totals
    const dateMap: { [date: string]: number } = {};

    // Initialize every day in the range with 0
    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);
    const currentDate = new Date(from);

    while (currentDate <= to) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dateMap[dateStr] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Aggregate sales by date
    this.filteredData.forEach(sale => {
      // Ensure salesDate is in YYYY-MM-DD format
      const saleDate = (typeof sale.salesDate === 'string')
        ? sale.salesDate.split('T')[0]
        : new Date(sale.salesDate).toISOString().split('T')[0];
      if (dateMap.hasOwnProperty(saleDate)) {
        dateMap[saleDate] += sale.price;
      }
    });

    // Format labels as MM/DD
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
    };

    this.dailySalesChartData = {
      labels: Object.keys(dateMap).map(formatDate),
      datasets: [{
        ...this.dailySalesChartData.datasets[0],
        data: Object.values(dateMap)
      }]
    };

    // Optionally, update Y axis bounds
    const values = Object.values(dateMap);
    const maxValue = Math.max(...values, 0);
    const minValue = Math.min(...values, 0);
    const padding = (maxValue - minValue) * 0.1;

    this.dailySalesChartOptions = {
      ...this.dailySalesChartOptions,
      scales: {
        y: {
          ...this.dailySalesChartOptions.scales?.['y'],
          min: Math.max(0, minValue - padding),
          max: maxValue + padding
        }
      }
    };
  }

  // Save AG Grid instance
  onGridReady(params: GridReadyEvent<Sale>): void {
    this.gridApi = params.api;
    params.api.sizeColumnsToFit();
  }

  // Apply both date and search filters
  applyFilters(): void {
    this.filteredData = this.rowData.filter((sale) => {
      const saleDate = sale.salesDate;
      const matchesDate = (!this.fromDate || saleDate >= this.fromDate) &&
                         (!this.toDate || saleDate <= this.toDate);
      const productName = sale.productName || '';
      const matchesSearch = !this.searchQuery || productName.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesDate && matchesSearch;
    });

    // Update only charts that depend on filteredData
    this.updatePieCharts();
    this.updateDailySalesChart();
    this.page = 1; // Reset to first page on filter change
  }

  onSearchChange(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onDateChange(): void {
    this.loadSalesData(); // This will update everything including the comparison chart
  }

  // Generate pie chart data for product and category
  updatePieCharts(): void {
    const productMap: { [name: string]: number } = {};
    const categoryMap: { [category: string]: number } = {};

    this.filteredData.forEach((sale) => {
      const productName = sale.productName || sale.productId;
      productMap[productName] = (productMap[productName] || 0) + sale.quantity;
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

  // Get % increase/decrease between current and previous period
  calculateMonthlyProfitPercentage(): number {
    const data = this.comparisonChartData?.datasets?.[0]?.data;

    if (!data || data.length < 2) return 0;

    const current = data[0] as number;
    const previous = data[1] as number;

    if (previous === 0) return 0;

    const percentageChange = ((current - previous) / previous) * 100;
    return Math.round(percentageChange * 10) / 10;
  }

  // Check if profit increased
  isProfitIncreased(): boolean {
    const data = this.comparisonChartData?.datasets?.[0]?.data;
    if (!data || data.length < 2) return false;

    return data[0] > data[1];
  }

  printReport(): void {
    console.log('Print Report button clicked');
    this.router.navigate(['/salesmanager/printreport']);
  }

  closePrintDialog(): void {
    this.showPrintDialog = false;
  }

  goToSalesTable(): void {
    this.router.navigate(['/salesmanager/salesOverveiw']);
  }
}
