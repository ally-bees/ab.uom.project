import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Shipment {
  shippingId: string;
  orderId: string;
  orderDate: string;
  estimatedDelivery: string;
  city: string;
  status: string;
}

@Component({
  selector: 'app-shipping-dashboard',
  standalone:true,
  templateUrl: './shipping-dashboard.component.html',
  styleUrls: ['./shipping-dashboard.component.css'],
    imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class ShippingDashboardComponent implements OnInit {
  totalShipments = 800;
  delivered = 240;
  inTransit = 240;
  pendingDeliveries = 320;

  dateRange = new FormGroup({
    fromDate: new FormControl('2024/12/05'),
    toDate: new FormControl('2024/12/12')
  });

  searchQuery: string = '';

  recentShipments: Shipment[] = [
    { shippingId: '0001FA', orderId: '202400063', orderDate: '18/12/2024', estimatedDelivery: '26/12/2024', city: 'Galle', status: 'In Transit' },
    { shippingId: '0002GB', orderId: '202400025', orderDate: '18/12/2024', estimatedDelivery: '26/12/2024', city: 'Colombo', status: 'Delivered' },
    { shippingId: '0003CC', orderId: '202400093', orderDate: '20/12/2024', estimatedDelivery: '27/12/2024', city: 'Kalutara', status: 'Pending' },
    { shippingId: '0004AD', orderId: '202400089', orderDate: '21/12/2024', estimatedDelivery: '29/12/2024', city: 'Matara', status: 'In Transit' },
    { shippingId: '0004BE', orderId: '202400048', orderDate: '22/12/2024', estimatedDelivery: '31/12/2024', city: 'Galle', status: 'Delivered' },
    { shippingId: '0005BE', orderId: '202400048', orderDate: '22/12/2024', estimatedDelivery: '31/12/2024', city: 'Galle', status: 'Pending' }
  ];

  constructor() {}

  ngOnInit(): void {}

  searchProducts(): void {
    console.log('Searching for:', this.searchQuery);
  }

  printReport(): void {
    console.log('Printing report...');
    window.print();
  }

  getStatusClass(status: string): string {
    switch(status.toLowerCase()) {
      case 'delivered': return 'status-delivered';
      case 'in transit': return 'status-transit';
      case 'pending': return 'status-pending';
      default: return '';
    }
  }
}
