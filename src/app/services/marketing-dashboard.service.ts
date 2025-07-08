import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardData {
  campaigns: number;
  spentAmount: number;
  newVisitors: number;
  newCustomers: number;
  pie: {
    totalOrder: number;
    customerGrowth: number;
    totalRevenue: number;
    orderPercent: number;
    growthPercent: number;
    revenuePercent: number;
  };
}

@Injectable({ providedIn: 'root' })
export class MarketingDashboardService {
  private apiUrl = 'http://localhost:5241/api/marketingdashboard';

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`);
  }
}