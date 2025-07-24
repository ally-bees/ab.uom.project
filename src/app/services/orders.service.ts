import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model'; 
import { AuthService } from './auth.service'; 

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
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId;
    
    console.log('OrdersService - getTodayOrdersCount - Current User:', currentUser);
    console.log('OrdersService - getTodayOrdersCount - Company ID:', companyId);
    
    // Hard-coded company ID for testing if none is available
    const finalCompanyId = companyId || 'C00001'; // Default to a known company ID if none found
    
    const url = `${this.apiUrl}/today-orders?companyId=${finalCompanyId}`;
    console.log('Calling API with URL:', url);
    
    return this.http.get<number>(url);
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
