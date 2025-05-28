// src/app/services/courier.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Courier {
  id: string;
  orderId: string;
  courierId: string;
  destination: string;
  date: string;
  estimateDate: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class CourierService {
  private baseUrl = 'http://localhost:5241/api/courier'; // Use http if not using SSL

  constructor(private http: HttpClient) {}

  getSummary(from: string, to: string): Observable<any> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get(`${this.baseUrl}/summary`, { params });
  }

  getRecentDeliveries(count = 6): Observable<Courier[]> {
    const params = new HttpParams().set('count', count);
    return this.http.get<Courier[]>(`${this.baseUrl}/recent`, { params });
  }

  getAllCouriers(): Observable<Courier[]> {
    return this.http.get<Courier[]>(`${this.baseUrl}/all`);
  }
}
