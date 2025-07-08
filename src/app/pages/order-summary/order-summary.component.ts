import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { Chart, ChartConfiguration } from 'chart.js';
import { ColDef, GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';

import { OrderService } from '../../services/ordersummary.service';
import { PrintReportService } from '../../services/printreport.service';
import { Order } from '../../models/ordersummery.model'; 

// Interface to represent order status with count
interface OrderStatus {
  status: string;
  count: number;
}

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridModule],
  providers: [DatePipe],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css',
})
export class OrderSummaryComponent implements OnInit, AfterViewInit {
  // Data for ag-grid and filtered results
  rowData: Order[] = [];
  filteredRowData: Order[] = [];

  // Column definitions for ag-grid
  columnDefs: ColDef<Order>[] = [
    { field: 'orderId', headerName: 'Order ID', sortable: true },
    { field: 'customerId', headerName: 'Customer ID', sortable: true },
    { field: 'orderDate', headerName: 'Order Date', sortable: true },
    { field: 'totalAmount', headerName: 'Amount', sortable: true },
    { field: 'status', headerName: 'Status', sortable: true },
  ];

  // Date range for filtering
  fromDate: string = '';
  toDate: string = '';

  // Order status counts
  totalOrders: number = 0;
  pendingOrders: number = 0;
  completedOrders: number = 0;

  // Grid configuration
  defaultColDef = { resizable: true, flex: 1 };
  gridOptions: GridOptions<Order> = {};
  private gridApi!: GridApi<Order>;

  // Chart and summary data
  private chart: Chart | undefined;
  private orderStatusData: OrderStatus[] = [];
  showPrintDialog = false;

  constructor(
    private orderService: OrderService,
    private datePipe: DatePipe,
    private router: Router,
    private printReportService: PrintReportService
  ) {}

  // Lifecycle hook - called on component initialization
  ngOnInit(): void {
    this.loadOrders();
    this.loadOrderStatusSummary();
  }

  // Lifecycle hook - called after view is initialized
  ngAfterViewInit(): void {
    if (this.orderStatusData.length > 0) {
      this.createPieChart(this.orderStatusData);
    }
  }

  // Called when ag-grid is ready
  onGridReady(params: GridReadyEvent<Order>): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  // Load orders from the service and format dates
  private loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.rowData = data.map(order => ({
          ...order,
          orderDate: this.datePipe.transform(order.orderDate, 'yyyy-MM-dd') || ''
        }));
        this.filteredRowData = [...this.rowData];
      },
      error: (err) => console.error('Order fetch error:', err),
    });
  }

  // Load order status summary for the pie chart and counters
  private loadOrderStatusSummary(): void {
    this.orderService.getOrderStatusSummary().subscribe({
      next: (data) => {
        if (!data || typeof data !== 'object') {
          console.error('Invalid order status format:', data);
          return;
        }

        // Extract and count order statuses
        this.pendingOrders = data['pending'] || 0;
        this.completedOrders = data['completed'] || 0;
        const newOrders = data['new'] || 0;
        this.totalOrders = this.pendingOrders + this.completedOrders + newOrders;

        // Convert summary object to array for chart
        const statusArray: OrderStatus[] = Object.entries(data).map(([status, count]) => ({
          status,
          count,
        }));

        this.orderStatusData = statusArray;
        this.createPieChart(statusArray);
      },
      error: (err) => console.error('Order status fetch error:', err),
    });
  }

  // Apply date range filter to order data
  applyDateFilter(): void {
    if (this.fromDate && this.toDate) {
      const from = new Date(this.fromDate);
      const to = new Date(this.toDate);

      const filtered = this.rowData.filter((order: Order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= from && orderDate <= to;
      });

      this.filteredRowData = filtered;

      // Generate status summary for filtered data
      const statusSummary: { [key: string]: number } = {};
      filtered.forEach(order => {
        const status = order.status.toLowerCase();
        if (!statusSummary[status]) {
          statusSummary[status] = 0;
        }
        statusSummary[status]++;
      });

      this.pendingOrders = statusSummary['pending'] || 0;
      this.completedOrders = statusSummary['completed'] || 0;
      const newOrders = statusSummary['new'] || 0;
      this.totalOrders = this.pendingOrders + this.completedOrders + newOrders;

      // Convert summary to array for pie chart
      const summaryArray: OrderStatus[] = Object.keys(statusSummary).map(key => ({
        status: key,
        count: statusSummary[key]
      }));
      this.createPieChart(summaryArray);
    } else {
      // Reset filters and reload all data
      this.loadOrders();
      this.loadOrderStatusSummary();
      this.filteredRowData = this.rowData;
    }
  }

  // Create pie chart with Chart.js
  private createPieChart(data: OrderStatus[]): void {
    const ctx = document.getElementById('orderStatusPieChart') as HTMLCanvasElement;
    if (!ctx || data.length === 0) return;

    const labels = data.map(s => s.status);
    const counts = data.map(s => s.count);
    const backgroundColors = labels.map(label => this.getColorForStatus(label));

    // Destroy existing chart before creating a new one
    if (this.chart) this.chart.destroy();

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels,
        datasets: [{
          data: counts,
          backgroundColor: backgroundColors,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }

  // Get color based on order status
  private getColorForStatus(status: string | undefined): string {
    const statusLowerCase = (status || '').trim().toLowerCase();
    switch (statusLowerCase) {
      case 'pending': return '#f9c74f';
      case 'completed': return '#90be6d';
      case 'new': return '#577590';
      default: return '#adb5bd';
    }
  }

  // Navigate to the print report route
  printReport(): void {
  if (!this.filteredRowData || this.filteredRowData.length === 0) {
    alert('No data available to print.');
    return;
  }

  const tableColumns = ['Order ID', 'Customer ID', 'Order Date', 'Amount', 'Status'];

  const tableData = this.filteredRowData.map(order => ({
    'Order ID': order.orderId,
    'Customer ID': order.customerId,
    'Order Date': order.orderDate, // Already formatted via DatePipe
    'Amount': order.totalAmount.toFixed(2),
    'Status': order.status
  }));

  const reportPayload = {
    reportType: 'Order Summary Report',
    exportFormat: 'PDF Document (.pdf)',
    startDate: this.fromDate,
    endDate: this.toDate,
    pageOrientation: 'Portrait',
    tableColumns,
    tableData
  };

  console.log('📄 Order Report Payload:', reportPayload);

  // Save to shared service
  this.printReportService.setReportData(reportPayload);

  // Navigate to the report preview
  this.router.navigate(['/businessowner/printreport'], {
    state: reportPayload
  });
}

}
