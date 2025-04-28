import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef, GridApi, GridOptions, GridReadyEvent } from 'ag-grid-community';
import { SalesViewModel } from '../../models/sale.model';
import { FooterComponent } from '../../footer/footer.component';
import { SalesService } from '../../services/sales.service';

interface Sale {
  saleId: string;
  salesDate: string;
  orderId: string;
  productName: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, AgGridModule, FooterComponent],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
})
export class SalesComponent implements OnInit {
  rowData: Sale[] = [];
  columnDefs: ColDef<Sale>[] = [
    { field: 'saleId', headerName: 'Sale ID', sortable: true, filter: false },
    { field: 'salesDate', headerName: 'Sales Date', sortable: true, filter: false },
    { field: 'orderId', headerName: 'Order ID', sortable: true, filter: false },
    { field: 'productName', headerName: 'Product Name', sortable: true, filter: false },
    { field: 'quantity', headerName: 'Quantity', sortable: true, filter: false },
    { field: 'price', headerName: 'Price', sortable: true, filter: false },
  ];

  defaultColDef = {
    resizable: true,
    flex: 1,
  };

  gridOptions: GridOptions<Sale> = {
    // Additional grid options can be added here if necessary
  };

  showPrintDialog = false;
  
  private gridApi!: GridApi<Sale>;

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
                const quantity = orderDetail.quantity;
                const price = orderDetail.price;
  
                transformedData.push({
                  saleId: sale.saleId,
                  salesDate: sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : 'N/A',
                  orderId: order.orderId,
                  productName: productName,
                  quantity: quantity,
                  price: parseFloat(price.toFixed(2)),
                });
              });
            }
          });
        });
  
        this.rowData = transformedData;
      },
      error: (err) => {
        console.error('Error fetching sales data:', err);
      },
    });
  }
  
  onGridReady(params: GridReadyEvent<Sale>): void {
    console.log('Grid Ready Params:', params);
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
}
