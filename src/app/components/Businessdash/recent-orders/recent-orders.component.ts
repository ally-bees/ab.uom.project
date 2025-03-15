// recent-orders.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Order {
  id: string;
  product: string;
  date: string;
  amount: number;
  status: 'Delivered' | 'Canceled' | 'Pending' | 'Processing';
}

@Component({
  selector: 'app-recent-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-orders.component.html',
  styleUrls: ['./recent-orders.component.scss']
})
export class RecentOrdersComponent implements OnInit {
  recentOrders: Order[] = [
    {
      id: '#968659684',
      product: 'Ipad pro 456gb',
      date: 'Aug 30, 2023',
      amount: 4345,
      status: 'Delivered'
    },
    {
      id: '#968659684',
      product: 'Ipad pro mini 512gb',
      date: 'Sep 01, 2023',
      amount: 236,
      status: 'Canceled'
    }
  ];
  
  constructor() { }
  
  ngOnInit(): void {
    // This will be populated from your API when ready
  }
}