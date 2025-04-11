import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-courier',
  standalone: true,
  templateUrl: './courier-dashboard.component.html',
  styleUrls: ['./courier-dashboard.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class CourierDashboardComponent {
  deliveries = [
    { id: '00001A', orderId: '202400065', orderDate: '19/12/2024', estimatedDate: '26/12/2024', city: 'Galle', status: 'Completed' },
    { id: '00002B', orderId: '202400025', orderDate: '19/12/2024', estimatedDate: '26/12/2024', city: 'Colombo', status: 'Pending' },
    { id: '00003C', orderId: '202400093', orderDate: '20/12/2024', estimatedDate: '27/12/2024', city: 'Kaluthara', status: 'Completed' },
    { id: '00004D', orderId: '202400069', orderDate: '21/12/2024', estimatedDate: '29/12/2024', city: 'Mathara', status: 'Completed' },
    { id: '00005E', orderId: '202400048', orderDate: '22/12/2024', estimatedDate: '31/12/2024', city: 'Galle', status: 'Rejected' },
    { id: '00006F', orderId: '202400048', orderDate: '22/12/2024', estimatedDate: '31/12/2024', city: 'Galle', status: 'Completed' }
  ];

  getStatusClass(status: string) {
    switch (status.toLowerCase()) {
      case 'completed': return 'completed';
      case 'pending': return 'pending';
      case 'rejected': return 'rejected';
      default: return '';
    }
  }
}
