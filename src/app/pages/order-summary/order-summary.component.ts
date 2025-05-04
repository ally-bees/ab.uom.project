import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../../footer/footer.component';
import { AgGridModule } from 'ag-grid-angular';
import { Chart, ChartConfiguration } from 'chart.js';
import { ColDef, GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';

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
  imports: [CommonModule, AgGridModule, FooterComponent],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css',
})
export class OrderSummaryComponent implements OnInit, AfterViewInit {
  rowData: Order[] = [];
  columnDefs: ColDef<Order>[] = [
    { field: 'orderId', headerName: 'Order ID', sortable: true, filter: false },
    { field: 'customerId', headerName: 'Customer ID', sortable: true, filter: false },
    { field: 'orderDate', headerName: 'Order Date', sortable: true, filter: false },
    { field: 'totalAmount', headerName: 'Amount', sortable: true, filter: false },
    { field: 'status', headerName: 'Status', sortable: true, filter: false },
  ];

  defaultColDef = { resizable: true, flex: 1 };
  gridOptions: GridOptions<Order> = {};
  private gridApi!: GridApi<Order>;

  showPrintDialog = false;
  private chart: Chart | undefined;
  private orderStatusData: OrderStatus[] = [];

  private readonly ORDERS_API = 'http://localhost:5241/api/orders';
  private readonly STATUS_API = 'http://localhost:5241/api/orderstatus/summary';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadOrderStatusSummary();
  }

  ngAfterViewInit(): void {
    // Create pie chart after view has been initialized
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
      next: (data) => (this.rowData = data),
      error: (err) => console.error('Order fetch error:', err),
    });
  }

  private loadOrderStatusSummary(): void {
    this.http.get<OrderStatus[]>(this.STATUS_API).subscribe({
      next: (data) => {
        console.log("Received Order Status Data:", data);  // Debug log for response data
        this.orderStatusData = data;
        // Create the pie chart after data is fetched
        this.createPieChart(data);
      },
      error: (err) => console.error('Order status fetch error:', err),
    });
  }
  

  private createPieChart(data: OrderStatus[]): void {
    const ctx = document.getElementById('orderStatusPieChart') as HTMLCanvasElement;
    if (!ctx) return;
  
    console.log('Order Status Data:', data); // Log the data received before using it
  
    if (data.length === 0) {
      console.log('No data for order status chart');
      return;
    }
  
    const labels = data.map(s => s.status);  // Access 'Status' with correct casing
    const counts = data.map(s => s.count);   // Access 'Count' with correct casing
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
          legend: { position: 'bottom' },
        },
      },
    };
  
    this.chart = new Chart(ctx, config);
  }
  

  private getColorForStatus(status: string | undefined): string {
    console.log('Received Status:', status); // Log status for debugging
  
    // If the status is undefined or null, return a fallback color (gray)
    if (!status) {
      console.log('Status is undefined or null. Returning fallback color.');
      return '#adb5bd'; // gray fallback
    }
  
    const statusLowerCase = status.trim().toLowerCase();
  
    switch (statusLowerCase) {
      case 'pending': return '#f9c74f';     // yellow for pending
      case 'completed': return '#90be6d';   // green for completed
      case 'new': return '#577590';         // blue for new
      default: return '#adb5bd';            // gray fallback for unknown statuses
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
