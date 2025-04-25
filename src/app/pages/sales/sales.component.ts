import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { SalesService } from '../../services/sales.service';
import { SalesViewModel } from '../../models/sale.model';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { Order } from '../../models/order.model';  // Importing the correct Order model

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, AgGridModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit {
  rowData: any[] = [];

  columnDefs: ColDef[] = [
    { headerName: 'Sales ID', field: 'saleId', flex: 1 },
    { headerName: 'Sales Date', field: 'salesDate', flex: 1 },
    { headerName: 'Order ID', field: 'orderId', flex: 1 },
    { headerName: 'Quantity', field: 'quantity', flex: 1 },
    { headerName: 'Amount', field: 'amount', flex: 1 },
    { headerName: 'Product Name', field: 'productName', flex: 1 }
  ];

  constructor(private salesService: SalesService) {}

  ngOnInit(): void {
    this.loadSalesData();
  }

  loadSalesData(): void {
    this.salesService.getDashboardData().subscribe((data: SalesViewModel) => {
      const transformedData: any[] = [];

      // Log the data to inspect the structure
      console.log(data.relatedOrders);

      data.relatedOrders.forEach(order => {
        // Ensure that order has productIds and quantities
        if (order.productIds && order.quantities && order.productIds.length === order.quantities.length) {
          const matchingSale = data.sales.find(sale =>
            new Date(sale.date).toDateString() === new Date(order.orderDate).toDateString()
          );

          const saleId = matchingSale?.saleId || '';
          const salesDate = new Date(order.orderDate).toLocaleDateString();
          const amount = order.totalAmount;

          // Iterate through the productIds and quantities arrays
          order.productIds.forEach((productId, index) => {
            const product = data.relatedInventory.find(p => p.productId === productId);
            const quantity = order.quantities[index] || 0;

            // Push the transformed data into the rowData
            transformedData.push({
              saleId: saleId,
              salesDate: salesDate,
              orderId: order.orderId,
              quantity: quantity,
              amount: amount.toFixed(2),
              productName: product?.productName || 'Unknown'
            });
          });
        } else {
          console.error(`Order ${order.orderId} does not have matching productIds and quantities`);
        }
      });

      this.rowData = transformedData;
    });
  }
}
