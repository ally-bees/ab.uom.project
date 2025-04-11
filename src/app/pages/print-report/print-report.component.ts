import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-print-report',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './print-report.component.html',
  styleUrl: './print-report.component.css'
})
export class PrintReportComponent {
  reportType: string = 'Sales Report'; // Default report type
  exportFormat: string = 'PDF Document (.pdf)'; // Default export format
  startDate: string = '01/12/2024'; // Default start date
  endDate: string = '31/12/2024'; // Default end date
  pageOrientation: string = 'Portrait'; // Default page orientation
  orders: any[] = [ // Sample order data - replace with your actual data
    { orderId: '00001A', customerId: 'CA67890', orderDate: '19/12/2024', amount: '1900.00', city: 'Galle', status: 'Completed' },
    { orderId: '00002B', customerId: 'CA67891', orderDate: '19/12/2024', amount: '566.00', city: 'Colombo', status: 'Pending' },
    { orderId: '00003C', customerId: 'CA67892', orderDate: '20/12/2024', amount: '5002.00', city: 'Kaluthara', status: 'Completed' },
    { orderId: '00004D', customerId: 'CA67893', orderDate: '21/12/2024', amount: '5621.33', city: 'Mathara', status: 'Completed' },
    { orderId: '00005E', customerId: 'CA67894', orderDate: '22/12/2024', amount: '1230.00', city: 'Galle', status: 'Rejected' },
    { orderId: '00005E', customerId: 'CA67894', orderDate: '22/12/2024', amount: '1230.00', city: 'Galle', status: 'Completed' },
  ];

  generateReport() {
    console.log('Generating report...');
  }

  cancel() {
    console.log('Cancelling report generation...');
  }
}