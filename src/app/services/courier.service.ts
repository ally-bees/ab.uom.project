// src/app/services/courier.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface defining structure of a Courier object
export interface Courier {
  id: string;
  orderId: string;
  courierId: string;
  destination: string;
  date: string;
  estimateDate: string;
  status: string;
}

export interface CountryStat {
  name: string;
  code: string;
  percentage: number;
}


@Injectable({ providedIn: 'root' }) // Makes this service globally available
export class CourierService {
  // Base URL for all courier-related API endpoints
  private baseUrl = 'http://localhost:5241/api/courier'; 

  constructor(private http: HttpClient) {}

  // Fetch summary statistics between a given date range
  getSummary(from: string, to: string): Observable<any> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get(`${this.baseUrl}/summary`, { params });
  }

  // Get top 3 contries 
  getTopCountries(): Observable<CountryStat[]> {
    return this.http.get<CountryStat[]>(`${this.baseUrl}/top-nations`);
  }
  

  // Fetch a limited number of recent deliveries (default = 6)
  getRecentDeliveries(count = 6): Observable<Courier[]> {
    const params = new HttpParams().set('count', count);
    return this.http.get<Courier[]>(`${this.baseUrl}/recent`, { params });
  }

  // Fetch the full list of courier records
  getAllCouriers(): Observable<Courier[]> {
    return this.http.get<Courier[]>(`${this.baseUrl}/all`);
  }
}
