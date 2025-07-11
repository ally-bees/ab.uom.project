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

export interface Campaign {
  id?: string;
  camId: string;
  platform: string;
  description: string;
  clickThroughRate: number;
  cpc: number;
  spentAmount: number;
  noOfVisitors: number;
  noOfCustomers: number;
  date: Date;
}

// export interface CampaignCount {
//   count: number;
// }

@Injectable({ providedIn: 'root' })
export class MarketingDashboardService {
  private apiUrl = 'http://localhost:5241/api/marketingdashboard';

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`);
  }

  getCampaignCount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/campaigns/count`);
  }

  getSpentAmount(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/campaigns/spent`);
  }

  getNewVisitors(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/campaigns/visitors`);
  }

  getNewCustomers(): Observable<number> {
    return this.http.get<any>(`${this.apiUrl}/campaigns/customers`);
  }

  getCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>('http://localhost:5241/api/campaign');
  }
}