import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // ✅ Adjust this path as needed

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

  constructor(
    private http: HttpClient,
    private datePipe: DatePipe,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  goToOrderSummary(): void {
    this.router.navigate(['businessowner/order']);
  }

  fetchOrders(): void {
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId;

    if (!companyId) {
      console.error('No company ID found for the current user');
      return;
    }

    const url = `http://localhost:5241/api/orders/company/${companyId}`;

    this.http.get<Order[]>(url).subscribe({
      next: (orders) => {
        this.recentOrders = orders
          .sort((a, b) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          ) // 🔄 Sort by latest date
          .slice(0, 5) // Limit to the latest 5
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
