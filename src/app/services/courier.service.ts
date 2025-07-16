// src/app/services/courier.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
  getSummary(from: string, to: string, companyId: string): Observable<any> {
    const params = new HttpParams()
      .set('from', from)
      .set('to', to)
      .set('companyId', companyId);
    return this.http.get(`${this.baseUrl}/summary`, { params });
  }

  // Get top 3 countries 
  getTopCountries(companyId: string): Observable<{ name: string, code: string, percentage: number }[]> {
    const params = new HttpParams().set('companyId', companyId);
    return this.http.get<any>(`${this.baseUrl}/top-nations`, { params }).pipe(
      map(data => {
        return data.map((country: any) => {
          return {
            name: country.name,
            code: country.code ? country.code.toLowerCase() : '', // Ensure lowercase
            percentage: country.percentage
          };
        });
      }),
      catchError(error => {
        console.error('Error fetching top countries:', error);
        // Fallback data with proper country codes
        return of([
          { name: 'Sri Lanka', code: 'lk', percentage: 65 },
          { name: 'United States', code: 'us', percentage: 15 },
          { name: 'United Kingdom', code: 'gb', percentage: 10 }
        ]);
      })
    );
  }

  // Fetch a limited number of recent deliveries (default = 6)
  getRecentDeliveries(count = 6, companyId: string): Observable<Courier[]> {
    const params = new HttpParams().set('count', count).set('companyId', companyId);
    return this.http.get<Courier[]>(`${this.baseUrl}/recent`, { params });
  }

  // Fetch the full list of courier records
  getAllCouriers(companyId: string): Observable<Courier[]> {
    const params = new HttpParams().set('companyId', companyId);
    return this.http.get<Courier[]>(`${this.baseUrl}/all`, { params });
  }
}
