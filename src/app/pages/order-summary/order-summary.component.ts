import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FooterComponent } from '../../footer/footer.component';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridReadyEvent, GridOptions } from 'ag-grid-community';

interface Order {
  orderId: string;
  customerId: string;
  orderDate: string;
  totalAmount: number;
  status: string;
}

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, AgGridModule, FooterComponent],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css',
})
export class OrderSummaryComponent implements OnInit {
  rowData: Order[] = [];
  columnDefs: ColDef<Order>[] = [
    { field: 'orderId', headerName: 'Order ID', sortable: true, filter: false },
    { field: 'customerId', headerName: 'Customer ID', sortable: true, filter: false },
    { field: 'orderDate', headerName: 'Order Date', sortable: true, filter: false },
    { field: 'totalAmount', headerName: 'Amount', sortable: true, filter: false },
    { field: 'status', headerName: 'Status', sortable: true, filter: false },
  ];

  defaultColDef = {
    resizable: true,
    flex: 1,
  };


  // Remove rowSelection to disable checkboxes
  gridOptions: GridOptions<Order> = {
    // No rowSelection configuration
=======
  // Properly typed GridOptions
  gridOptions: GridOptions<Order> = {
  
    // Other optional properties can be added if needed

  };

  showPrintDialog = false;


  private gridApi!: GridApi<Order>;
  private gridColumnApi: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Order[]>('http://localhost:5241/api/orders').subscribe({
      next: (data) => {
        console.log('Fetched orders:', data);
        this.rowData = data;
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      },
    });
  }

  onGridReady(params: GridReadyEvent<Order>): void {

    console.log('Grid Ready Params:', params);
    this.gridApi = params.api;
    this.gridColumnApi = (params as any).columnApi;
    if (this.gridColumnApi) {
      params.api.sizeColumnsToFit();

    } else {
      console.warn('columnApi is not available, skipping sizeColumnsToFit');
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