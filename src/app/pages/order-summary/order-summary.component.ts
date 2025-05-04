import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../../footer/footer.component';
import { AgGridModule } from 'ag-grid-angular';
import { Chart, ChartConfiguration } from 'chart.js';
import { ColDef, GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';
import { DatePipe } from '@angular/common';

interface Order {
  orderId: string;
  customerId: string;
  orderDate: string;
  totalAmount: number;
  status: string;
}

interface OrderStatus {
  status: string;
  count: number;
}

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule,FormsModule, AgGridModule, FooterComponent],
  providers: [DatePipe],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css',
})
export class OrderSummaryComponent implements OnInit, AfterViewInit {
  rowData: Order[] = [];
  filteredRowData: Order[] = [];
  columnDefs: ColDef<Order>[] = [
    { field: 'orderId', headerName: 'Order ID', sortable: true, filter: false },
    { field: 'customerId', headerName: 'Customer ID', sortable: true, filter: false },
    { field: 'orderDate', headerName: 'Order Date', sortable: true, filter: false },
    { field: 'totalAmount', headerName: 'Amount', sortable: true, filter: false },
    { field: 'status', headerName: 'Status', sortable: true, filter: false },
  ];

  // Date filtering variables
  fromDate: string = '';
  toDate: string = '';

  constructor(private http: HttpClient, private datePipe: DatePipe) {}

  defaultColDef = { resizable: true, flex: 1 };
  gridOptions: GridOptions<Order> = {};
  private gridApi!: GridApi<Order>;

  showPrintDialog = false;
  private chart: Chart | undefined;
  private orderStatusData: OrderStatus[] = [];

  private readonly ORDERS_API = 'http://localhost:5241/api/orders';
  private readonly STATUS_API = 'http://localhost:5241/api/orderstatus/summary';

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
    this.http.get<Order[]>(this.ORDERS_API).subscribe({
      next: (data) => {
        this.rowData = data.map(order => ({
          ...order,
          orderDate: this.datePipe.transform(order.orderDate, 'yyyy-MM-dd') || ''
        }));
      },
      error: (err) => console.error('Order fetch error:', err),
    });
  }

  filterOrders(): void {
    if (this.fromDate && this.toDate) {
      this.filteredRowData = this.rowData.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= new Date(this.fromDate) && orderDate <= new Date(this.toDate);
      });
    } else {
      this.filteredRowData = this.rowData;  // If no date is selected, show all data
    }
  }


  totalOrders: number = 0;
  pendingOrders: number = 0;
  completedOrders: number = 0;

  private loadOrderStatusSummary(): void {
    this.http.get<OrderStatus[]>(this.STATUS_API).subscribe({
      next: (data) => {
        this.orderStatusData = data;
        this.pendingOrders = 0;
        this.completedOrders = 0;
        this.totalOrders = 0;

        data.forEach(status => {
          const normalized = status.status.toLowerCase();
          if (normalized === 'pending') {
            this.pendingOrders = status.count;
          } else if (normalized === 'completed') {
            this.completedOrders = status.count;
          }
        });

        this.totalOrders = this.pendingOrders + this.completedOrders;
        this.createPieChart(data);
      },
      error: (err) => console.error('Order status fetch error:', err),
    });
  }

  // Apply date filter
  applyDateFilter(): void {
    if (this.fromDate && this.toDate) {
      this.rowData = this.rowData.filter((order: Order) => {
        const orderDate = new Date(order.orderDate);
        const fromDate = new Date(this.fromDate);
        const toDate = new Date(this.toDate);
        return orderDate >= fromDate && orderDate <= toDate;
      });
    } else {
      // If no date range is selected, reload all data
      this.loadOrders();
    }
  }

  private createPieChart(data: OrderStatus[]): void {
    const ctx = document.getElementById('orderStatusPieChart') as HTMLCanvasElement;
    if (!ctx) return;

    if (data.length === 0) {
      return;
    }

    const labels = data.map(s => s.status);  
    const counts = data.map(s => s.count);   
    const backgroundColors = labels.map(label => this.getColorForStatus(label));

    if (this.chart) {
      this.chart.destroy();
    }

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
          legend: { 
            display: false,
          },
        },
      },
    };

    this.chart = new Chart(ctx, config);
  }

  private getColorForStatus(status: string | undefined): string {
    if (!status) {
      return '#adb5bd'; 
    }

    const statusLowerCase = status.trim().toLowerCase();

    switch (statusLowerCase) {
      case 'pending': return '#f9c74f';     
      case 'completed': return '#90be6d';   
      case 'new': return '#577590';         
      default: return '#adb5bd';            
    }
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
}
