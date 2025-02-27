import { Component, OnInit } from '@angular/core';
// import { PrintReportComponent } from '../../components/print-report/print-report.component';
import { CommonModule } from '@angular/common';
// import { DashboardComponent } from "../dashboard/dashboard.component";
import { FooterComponent } from "../../footer/footer.component";

interface Order {
  orderId: string;
  customerId: string;
  orderDate: string;
  amount: number;
  city: string;
  status: 'Completed' | 'Pending' | 'Rejected';
}

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [
    CommonModule,
    //PrintReportComponent (didn't use this component)
    FooterComponent,
    // DashboardComponent,
    FooterComponent
],
  templateUrl: './order-summary.component.html',
  styleUrl: './order-summary.component.css'
})
export class OrderSummaryComponent implements OnInit {
  orders: Order[] = [
    { orderId: '0001A', customerId: 'CA67890', orderDate: '19/12/2024', amount: 1900.00, city: 'Galle', status: 'Completed' },
    { orderId: '0002B', customerId: 'CA67891', orderDate: '19/12/2024', amount: 568.00, city: 'Colombo', status: 'Pending' },
    { orderId: '0003C', customerId: 'CA67892', orderDate: '20/12/2024', amount: 5002.00, city: 'Kaluthara', status: 'Pending' },
    { orderId: '0004D', customerId: 'CA67893', orderDate: '21/12/2024', amount: 5621.33, city: 'Mathara', status: 'Completed' },
    { orderId: '0005E', customerId: 'CA67894', orderDate: '22/12/2024', amount: 1230.00, city: 'Galle', status: 'Rejected' },
    { orderId: '0005E', customerId: 'CA67895', orderDate: '22/12/2024', amount: 1230.00, city: 'Galle', status: 'Completed' }
  ];

  showPrintDialog = false;

  constructor() { }

  ngOnInit(): void {
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'badge-completed';
      case 'Pending':
        return 'badge-pending';
      case 'Rejected':
        return 'badge-rejected';
      default:
        return '';
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
