import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Order {
  orderId: string;
  customerId: string;
  orderDate: string;
  totalAmount: number;
  status: string;
}

@Component({
  selector: 'app-recent-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-orders.component.html',
  styleUrls: ['./recent-orders.component.scss']
})
export class RecentOrdersComponent implements OnInit {
  recentOrders: Order[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.http.get<Order[]>('http://localhost:5241/api/orders')
      .subscribe({
        next: (orders) => {
          this.recentOrders = orders.slice(0, 5);
        },
        error: (err) => {
          console.error('Error fetching orders:', err);
        }
      });
  }
}
