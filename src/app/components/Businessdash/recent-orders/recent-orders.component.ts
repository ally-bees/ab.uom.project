import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
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
  styleUrls: ['./recent-orders.component.scss'],
  providers: [DatePipe]
})
export class RecentOrdersComponent implements OnInit {
  recentOrders: Order[] = [];
  constructor(private http: HttpClient, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.http.get<Order[]>('http://localhost:5241/api/orders')
      .subscribe({
        next: (orders) => {
          this.recentOrders = orders
          .sort((a, b) => b.orderId.localeCompare(a.orderId))  // Compare by orderId in descending order
          .slice(0, 5)  // Get the latest 5 orders
          .map(order => ({
            ...order,
            orderDate: this.datePipe.transform(order.orderDate, 'yyyy-MM-dd') || ''
          }));
        },
        error: (err) => {
          console.error('Error fetching orders:', err);
        }
      });
  }
}
