import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesViewModel } from '../models/sales-view-model.model'; 
import { map } from 'rxjs/operators';
import { Order } from '../models/order.model'; 

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = 'https://localhost:7143/api/Orders';

  constructor(private http: HttpClient) {}

  // Fetch Sales View Model
  getSalesViewModel(startDate: string, endDate: string): Observable<SalesViewModel> {
    return this.http.get<SalesViewModel>(`${this.apiUrl}/Sales/summary?startDate=${startDate}&endDate=${endDate}`).pipe(
      map(salesViewModel => {
        // Optional processing if needed
        return salesViewModel;
      })
    );
  }

  // Other existing methods
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  updateOrder(id: string, order: Order): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, order);
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
