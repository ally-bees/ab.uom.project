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
  styleUrls: ['./order-summary.component.css'],
})
export class OrderSummaryComponent implements OnInit, AfterViewInit {
  rowData: Order[] = [];
  filteredRowData: Order[] = [];

  selectedCustomer: any = null;
  showCustomerPopup: boolean = false;

  columnDefs: ColDef<Order>[] = [
    { field: 'orderId', headerName: 'Order ID', sortable: true },
    {
      field: 'customerId',
      headerName: 'Customer ID',
      sortable: true,
      cellRenderer: (params: any) => {
        return `<span style="color: inherit; text-decoration: none; cursor: pointer;">${params.value}</span>`;
      },
      onCellClicked: (params) => {
        this.onCustomerClick(params.value);
      }
    },
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
    private router: Router,
    private printReportService: PrintReportService
  ) {}

  ngOnInit(): void {
    this.setDefaultDateRange();
    this.loadOrders(); // Will also trigger loadOrderStatusSummary inside
  }

  ngAfterViewInit(): void {}

  onGridReady(params: GridReadyEvent<Order>): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  private loadOrders(): void {
    this.orderService.getOrdersByCompany().subscribe({
      next: (data) => {
        this.rowData = data.map(order => ({
          ...order,
          orderDate: this.datePipe.transform(order.orderDate, 'yyyy-MM-dd') || ''
        }));
        this.filteredRowData = [...this.rowData];

        this.applyDateFilter(); // Will call loadOrderStatusSummary internally
        if (this.gridApi) {
          this.gridApi.refreshCells({ force: true });
        }
      },
      error: (err) => console.error('Order fetch error:', err),
    });
  }

  private setDefaultDateRange(): void {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    this.fromDate = this.datePipe.transform(start, 'yyyy-MM-dd') || '';
    this.toDate = this.datePipe.transform(end, 'yyyy-MM-dd') || '';
  }

  private loadOrderStatusSummary(filteredData: Order[]): void {
    // Generate summary based on filtered data
    const statusSummary: { [key: string]: number } = {};
    filteredData.forEach(order => {
      const status = order.status.toLowerCase();
      statusSummary[status] = (statusSummary[status] || 0) + 1;
    });

    this.pendingOrders = statusSummary['pending'] || 0;
    this.completedOrders = statusSummary['completed'] || 0;
    const newOrders = statusSummary['new'] || 0;
    this.totalOrders = this.pendingOrders + this.completedOrders + newOrders;

    const summaryArray: OrderStatus[] = Object.keys(statusSummary).map(key => ({
      status: key,
      count: statusSummary[key]
    }));

    this.orderStatusData = summaryArray;
    this.createPieChart(summaryArray);
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
      this.loadOrderStatusSummary(filtered); // ⬅️ Now this reflects the filtered range
    } else {
      this.filteredRowData = [...this.rowData];
      this.loadOrderStatusSummary(this.filteredRowData);
    }

    if (this.gridApi) {
      this.gridApi.refreshCells({ force: true });
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
    if (!this.filteredRowData || this.filteredRowData.length === 0) {
      alert('No data available to print.');
      return;
    }

    const tableColumns = ['Order ID', 'Customer ID', 'Order Date', 'Amount', 'Status'];
    const tableData = this.filteredRowData.map(order => ({
      'Order ID': order.orderId,
      'Customer ID': order.customerId,
      'Order Date': order.orderDate,
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

    this.printReportService.setReportData(reportPayload);
    this.router.navigate(['/businessowner/printreport'], {
      state: reportPayload
    });
  }

  onCustomerClick(customerId: string): void {
    this.orderService.getCustomerDetails(customerId).subscribe({
      next: (data) => {
        this.selectedCustomer = data;
        this.showCustomerPopup = true;
      },
      error: (err) => {
        console.error('Error loading customer details', err);
        alert('Failed to load customer details.');
      }
    });
  }
}
