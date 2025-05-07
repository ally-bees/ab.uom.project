import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private baseUrl = 'http://localhost:5241/api';

  constructor(private http: HttpClient) {}

  getCustomerCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/customercount/count`);
  }
  getIncomeTotal(): Observable<number> {
    return this.http.get<any[]>(`${this.baseUrl}/finance`).pipe(
      map((data) =>
        data
          .filter(entry => entry.status === 'income')
          .reduce((total, item) => total + item.amount, 0)
      )
    );
  }
  getTotalProductsSold(): Observable<number> {
    return this.http.get<any[]>(`${this.baseUrl}/orders`).pipe(
      map((orders) =>
        orders.reduce((total, order) => {
          const items = order.orderDetails || [];
          return total + items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
        }, 0)
      )
    );
  }
  
}