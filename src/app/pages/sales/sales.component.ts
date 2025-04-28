import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, AgGridModule, FooterComponent],
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
                  salesDate: sale.saleDate ? new Date(sale.saleDate).toISOString().split('T')[0] : 'N/A',
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
        this.filteredData = [...this.rowData]; // initially show all
      },
      error: (err) => {
        console.error('Error fetching sales data:', err);
      },
    });
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
      const matchesDate =
        (!this.fromDate || saleDate >= this.fromDate) &&
        (!this.toDate || saleDate <= this.toDate);
      const matchesSearch =
        !this.searchQuery ||
        sale.productName.toLowerCase().includes(this.searchQuery.toLowerCase());

      return matchesDate && matchesSearch;
    });
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value;
    this.applyFilters();
  }

  onDateChange(): void {
    this.applyFilters();
  }
}
