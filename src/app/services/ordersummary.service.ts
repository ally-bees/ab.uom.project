import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/ordersummery.model'; // Adjust path as needed

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly ORDERS_API = 'http://localhost:5241/api/orders';
  private readonly STATUS_API = 'http://localhost:5241/api/orderstatus/summary';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ORDERS_API);
  }

  getOrderStatusSummary(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(this.STATUS_API);
  }
}
