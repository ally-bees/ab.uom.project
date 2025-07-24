import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

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

  constructor(private http: HttpClient, private authService: AuthService) {}

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

  getCustomerCount(): Observable<number> {
    // Get company ID from auth service
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId;
    
    console.log('MarketingDashboardService - getCustomerCount - Current User:', currentUser);
    console.log('MarketingDashboardService - getCustomerCount - Company ID:', companyId);
    
    // Hard-coded company ID for testing if none is available
    const finalCompanyId = companyId || 'C00001'; // Default to a known company ID if none found
    
    console.log('MarketingDashboardService - getCustomerCount - Using company ID:', finalCompanyId);
    
    return this.http.get<number>(`http://localhost:5241/api/customercount/count?companyId=${finalCompanyId}`);
  }

  getCampaigns(): Observable<Campaign[]> {
    return this.http.get<Campaign[]>('http://localhost:5241/api/campaign');
  }
}