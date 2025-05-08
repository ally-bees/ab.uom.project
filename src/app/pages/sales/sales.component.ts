import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { SalesViewModel } from '../../models/sale.model';
import { SalesService } from '../../services/sales.service';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

// Sale interface for AG Grid and internal processing
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
  // Full data from backend
  rowData: Sale[] = [];

  // Filtered data used in charts and table
  filteredData: Sale[] = [];

  // Column definitions for AG Grid
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

  // AG Grid instance reference
  gridOptions: GridOptions<Sale> = {};
  private gridApi!: GridApi<Sale>;

  // State variables for filters and dialog
  showPrintDialog = false;
  fromDate: string = '';
  toDate: string = '';
  searchQuery: string = '';

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

  constructor(
    private salesService: SalesService,
    private router: Router
  ) {}

  // Initialize with last 30 days by default
  ngOnInit(): void {
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 30);

    this.fromDate = from.toISOString().split('T')[0];
    this.toDate = today.toISOString().split('T')[0];

    this.loadSalesData();
  }

  // Fetch dashboard data and transform it to flat Sale[] structure
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
        this.applyFilters(); // triggers chart/table updates
      },
      error: (err) => console.error('Error fetching sales data:', err),
    });
  }

  // Update donut chart comparing current vs previous period total sales
  updateComparisonChart(): void {
    if (!this.fromDate || !this.toDate) return;

    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);

    // Determine length of selected period
    const rangeDuration = Math.floor((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Calculate previous period date range
    const previousTo = new Date(from);
    previousTo.setDate(previousTo.getDate() - 1);

    const previousFrom = new Date(previousTo);
    previousFrom.setDate(previousFrom.getDate() - (rangeDuration - 1));

    let currentTotal = 0;
    let previousTotal = 0;

    // Sum sales for current and previous date ranges
    this.rowData.forEach((sale) => {
      const saleDate = new Date(sale.salesDate);
      if (saleDate >= from && saleDate <= to) {
        currentTotal += sale.price;
      } else if (saleDate >= previousFrom && saleDate <= previousTo) {
        previousTotal += sale.price;
      }
    });

    // Update chart data
    this.comparisonChartData = {
      labels: ['Current Period', 'Previous Period'],
      datasets: [{
        data: [currentTotal, previousTotal],
        backgroundColor: ['#4CAF50', '#F44336'],
        borderWidth: 1
      }]
    };

    // Update tooltip and title
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

  // Update daily line chart of sales per day
  updateDailySalesChart(): void {
    if (!this.fromDate || !this.toDate) return;

    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);

    const dateMap: { [date: string]: number } = {};

    // Initialize every day with 0
    const currentDate = new Date(from);
    while (currentDate <= to) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dateMap[dateStr] = 0;
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Sum by date
    this.filteredData.forEach(sale => {
      const saleDate = sale.salesDate;
      if (dateMap.hasOwnProperty(saleDate)) {
        dateMap[saleDate] += sale.price;
      }
    });

    // Convert to MM/DD format
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
    };

    // Update chart
    this.dailySalesChartData = {
      labels: Object.keys(dateMap).map(formatDate),
      datasets: [{
        ...this.dailySalesChartData.datasets[0],
        data: Object.values(dateMap)
      }]
    };

    // Set Y axis bounds
    const maxValue = Math.max(...Object.values(dateMap));
    const minValue = Math.min(...Object.values(dateMap));
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
      const matchesSearch = !this.searchQuery || sale.productName.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchesDate && matchesSearch;
    });

    // Update all charts after filtering
    this.updatePieCharts();
    this.updateComparisonChart();
    this.updateDailySalesChart();
  }

  onSearchChange(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onDateChange(): void {
    this.applyFilters();
  }

  // Generate pie chart data for product and category
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
}
