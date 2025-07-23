import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale, SalesViewModel, SalesSummary } from '../models/sale.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'http://localhost:5241/api';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getAllSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/Sales`);
  }

  getSaleById(id: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/Sales/${id}`);
  }
  
  getSalesSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Sales/summary`);
  }

  getMonthlySalesData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Sales/monthly`);
  }

  getYearlySalesData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Sales/year-data`);
  }

  getSalesSummarybyDate(startDate: string, endDate: string): Observable<SalesSummary> {
    return this.http.get<SalesSummary>(`${this.apiUrl}/Sales/summary?startDate=${startDate}&endDate=${endDate}`);
  }

  getTotalSalesRevenue(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/Sales/total-revenue`);
  }

  getTodaySalesRevenue(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/Sales/today-cost`);
  }

  getSalesByYear(year: number): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/Sales/year/${year}`);
  }

  getSalesByCompany(): Observable<Sale[]> {
    const companyId = this.authService.getCurrentUser()?.CompanyId;
    if (!companyId) {
      throw new Error('User company ID is not available.');
    }
    return this.http.get<Sale[]>(`${this.apiUrl}/Sales/company/${companyId}`);
  }

  createSale(sale: Sale): Observable<Sale> {
    return this.http.post<Sale>(`${this.apiUrl}/Sales`, sale);
  }

  updateSale(id: string, sale: Sale): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/Sales/${id}`, sale);
  }

  deleteSale(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Sales/${id}`);
  }
  
  getDashboardData(companyId?: string): Observable<SalesViewModel> {
    if (!companyId) {
      companyId = this.authService.getCurrentUser()?.CompanyId;
    }
    if (companyId) {
      return this.http.get<SalesViewModel>(`${this.apiUrl}/SalesDashboard?companyId=${companyId}`);
    } else {
    return this.http.get<SalesViewModel>(`${this.apiUrl}/SalesDashboard`);
    }
  }

  getDashboardDataByCompanyId(): Observable<SalesViewModel> {
    const companyId = this.authService.getCurrentUser()?.CompanyId;
    if (!companyId) {
      throw new Error('User company ID is not available.');
    }
    return this.http.get<SalesViewModel>(`${this.apiUrl}/SalesDashboard?companyId=${companyId}`);
  }
  getSalesByCompanyId(): Observable<Sale[]> {
    const companyId = this.authService.getCurrentUser()?.CompanyId;
    if (!companyId) {
      throw new Error('User company ID is not available.');
    }
    return this.http.get<Sale[]>(`${this.apiUrl}/Sales/company/${companyId}`);
  }

  getCompanySalesComparison(month: string) {
    return this.http.get<{ companyId: string, totalSales: number }[]>(`${this.apiUrl}/SalesDashboard/company-sales-comparison?month=${month}`);
  }

  getDashboardDataForCompanyWithDateRange(startDate: string, endDate: string): Observable<SalesViewModel> {
    const companyId = this.authService.getCurrentUser()?.CompanyId;
    if (!companyId) {
      throw new Error('User company ID is not available.');
    }
    let url = `${this.apiUrl}/SalesDashboard/company/${companyId}`;
    if (startDate && endDate) {
      url += `?startDate=${startDate}&endDate=${endDate}`;
    }
    return this.http.get<SalesViewModel>(url);
  }
}
