import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { Chart, ChartConfiguration } from 'chart.js';
import { ColDef, GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';

import { OrderService, Order } from '../../services/ordersummary.service'; // Adjust path as needed

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
  rowData: Order[] = [];
  filteredRowData: Order[] = [];
  columnDefs: ColDef<Order>[] = [
    { field: 'orderId', headerName: 'Order ID', sortable: true },
    { field: 'customerId', headerName: 'Customer ID', sortable: true },
    { field: 'orderDate', headerName: 'Order Date', sortable: true },
    { field: 'totalAmount', headerName: 'Amount', sortable: true },
    { field: 'status', headerName: 'Status', sortable: true },
  ];

  fromDate: string = '';
  toDate: string = '';

  totalOrders: number = 0;
  pendingOrders: number = 0;
  completedOrders: number = 0;

  defaultColDef = { resizable: true, flex: 1 };
  gridOptions: GridOptions<Order> = {};
  private gridApi!: GridApi<Order>;

  private chart: Chart | undefined;
  private orderStatusData: OrderStatus[] = [];
  showPrintDialog = false;

  constructor(
    private orderService: OrderService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadOrderStatusSummary();
  }

  ngAfterViewInit(): void {
    if (this.orderStatusData.length > 0) {
      this.createPieChart(this.orderStatusData);
    }
  }

  onGridReady(params: GridReadyEvent<Order>): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

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

  private loadOrderStatusSummary(): void {
    this.orderService.getOrderStatusSummary().subscribe({
      next: (data) => {
        if (!data || typeof data !== 'object') {
          console.error('Invalid order status format:', data);
          return;
        }

        this.pendingOrders = data['pending'] || 0;
        this.completedOrders = data['completed'] || 0;
        const newOrders = data['new'] || 0;
        this.totalOrders = this.pendingOrders + this.completedOrders + newOrders;

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

  applyDateFilter(): void {
    if (this.fromDate && this.toDate) {
      const from = new Date(this.fromDate);
      const to = new Date(this.toDate);

      const filtered = this.rowData.filter((order: Order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= from && orderDate <= to;
      });

      this.filteredRowData = filtered;

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

      const summaryArray: OrderStatus[] = Object.keys(statusSummary).map(key => ({
        status: key,
        count: statusSummary[key]
      }));
      this.createPieChart(summaryArray);
    } else {
      this.loadOrders();
      this.loadOrderStatusSummary();
      this.filteredRowData = this.rowData;
    }
  }

  private createPieChart(data: OrderStatus[]): void {
    const ctx = document.getElementById('orderStatusPieChart') as HTMLCanvasElement;
    if (!ctx || data.length === 0) return;

    const labels = data.map(s => s.status);
    const counts = data.map(s => s.count);
    const backgroundColors = labels.map(label => this.getColorForStatus(label));

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

  private getColorForStatus(status: string | undefined): string {
    const statusLowerCase = (status || '').trim().toLowerCase();
    switch (statusLowerCase) {
      case 'pending': return '#f9c74f';
      case 'completed': return '#90be6d';
      case 'new': return '#577590';
      default: return '#adb5bd';
    }
  }

  printReport(): void {
    console.log('Print Report button clicked');
    this.router.navigate(['/businessowner/printreport']);
  }

  closePrintDialog(): void {
    this.showPrintDialog = false;
  }
}
