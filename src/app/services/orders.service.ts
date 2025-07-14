import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model'; 
import { AuthService } from './auth.service'; // Make sure this import is correct

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private apiUrl = 'http://localhost:5241/api/Orders';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  getTodayOrdersCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/today-orders`);
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

  // <---- ADD THIS METHOD ---->
  getOrdersByCompany(): Observable<Order[]> {
    const companyId = this.authService.getCurrentUser()?.CompanyId;
    if (!companyId) {
      throw new Error('User company ID is not available.');
    }
    return this.http.get<Order[]>(`${this.apiUrl}/company/${companyId}`);
  }
}
