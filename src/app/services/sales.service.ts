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

  // New method for getting sales data by period and company
  getSalesDataByPeriod(period: string, companyId?: string): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    const finalCompanyId = companyId || currentUser?.CompanyId;
    
    let url = `${this.apiUrl}/Sales/period-data?period=${period}`;
    if (finalCompanyId) {
      url += `&companyId=${finalCompanyId}`;
    }
    
    console.log('SalesService - getSalesDataByPeriod - URL:', url);
    return this.http.get<any>(url);
  }

  getSalesSummarybyDate(startDate: string, endDate: string): Observable<SalesSummary> {
    return this.http.get<SalesSummary>(`${this.apiUrl}/Sales/summary?startDate=${startDate}&endDate=${endDate}`);
  }

  getTotalSalesRevenue(): Observable<number> {
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId;
    
    console.log('SalesService - getTotalSalesRevenue - Current User:', currentUser);
    console.log('SalesService - getTotalSalesRevenue - Company ID:', companyId);
    
    if (!companyId) {
      console.warn('SalesService - getTotalSalesRevenue - No company ID available, this may return incorrect data');
      // Don't use a default company ID - let the backend handle it
      const url = `${this.apiUrl}/Sales/total-revenue`;
      console.log('Calling API with URL (no company filter):', url);
      return this.http.get<number>(url);
    }
    
    const url = `${this.apiUrl}/Sales/total-revenue?companyId=${companyId}`;
    console.log('Calling API with URL:', url);
    
    return this.http.get<number>(url);
  }

  getTodaySalesRevenue(): Observable<number> {
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId;
    
    console.log('SalesService - getTodaySalesRevenue - Current User:', currentUser);
    console.log('SalesService - getTodaySalesRevenue - Company ID:', companyId);
    
    if (!companyId) {
      console.warn('SalesService - getTodaySalesRevenue - No company ID available, this may return incorrect data');
      // Don't use a default company ID - let the backend handle it
      const url = `${this.apiUrl}/Sales/today-cost`;
      console.log('Calling API with URL (no company filter):', url);
      return this.http.get<number>(url);
    }
    
    const url = `${this.apiUrl}/Sales/today-cost?companyId=${companyId}`;
    console.log('Calling API with URL:', url);

    return this.http.get<number>(url);
  }

  // Get last month's total revenue for comparison
  getLastMonthSalesRevenue(): Observable<number> {
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId;
    
    console.log('SalesService - getLastMonthSalesRevenue - Current User:', currentUser);
    console.log('SalesService - getLastMonthSalesRevenue - Company ID:', companyId);
    
    if (!companyId) {
      console.warn('SalesService - getLastMonthSalesRevenue - No company ID available, this may return incorrect data');
      const url = `${this.apiUrl}/Sales/last-month-revenue`;
      console.log('Calling API with URL (no company filter):', url);
      return this.http.get<number>(url);
    }
    
    const url = `${this.apiUrl}/Sales/last-month-revenue?companyId=${companyId}`;
    console.log('Calling API with URL:', url);

    return this.http.get<number>(url);
  }  getSalesByYear(year: number): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/Sales/year/${year}`);
  }

  // Get yesterday's sales revenue for comparison with today
  getYesterdaySalesRevenue(): Observable<number> {
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId;
    
    console.log('SalesService - getYesterdaySalesRevenue - Current User:', currentUser);
    console.log('SalesService - getYesterdaySalesRevenue - Company ID:', companyId);
    
    if (!companyId) {
      console.warn('SalesService - getYesterdaySalesRevenue - No company ID available, this may return incorrect data');
      const url = `${this.apiUrl}/Sales/yesterday-revenue`;
      console.log('Calling API with URL (no company filter):', url);
      return this.http.get<number>(url);
    }
    
    const url = `${this.apiUrl}/Sales/yesterday-revenue?companyId=${companyId}`;
    console.log('Calling API with URL:', url);

    return this.http.get<number>(url);
  }

  // Get yesterday's orders count
  getYesterdayOrdersCount(): Observable<number> {
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId;
    
    console.log('SalesService - getYesterdayOrdersCount - Current User:', currentUser);
    console.log('SalesService - getYesterdayOrdersCount - Company ID:', companyId);
    
    if (!companyId) {
      console.warn('SalesService - getYesterdayOrdersCount - No company ID available, this may return incorrect data');
      const url = `${this.apiUrl}/Orders/yesterday-orders`;
      console.log('Calling API with URL (no company filter):', url);
      return this.http.get<number>(url);
    }
    
    const url = `${this.apiUrl}/Orders/yesterday-orders?companyId=${companyId}`;
    console.log('Calling API with URL:', url);

    return this.http.get<number>(url);
  }

  // Get last month's customers count
  getLastMonthCustomersCount(): Observable<number> {
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId;
    
    console.log('SalesService - getLastMonthCustomersCount - Current User:', currentUser);
    console.log('SalesService - getLastMonthCustomersCount - Company ID:', companyId);
    
    if (!companyId) {
      console.warn('SalesService - getLastMonthCustomersCount - No company ID available, this may return incorrect data');
      const url = `${this.apiUrl}/CustomerCount/last-month-customers`;
      console.log('Calling API with URL (no company filter):', url);
      return this.http.get<number>(url);
    }
    
    const url = `${this.apiUrl}/CustomerCount/last-month-customers?companyId=${companyId}`;
    console.log('Calling API with URL:', url);

    return this.http.get<number>(url);
  }

  // Get total customers count
  getTotalCustomersCount(): Observable<number> {
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId;
    
    console.log('SalesService - getTotalCustomersCount - Current User:', currentUser);
    console.log('SalesService - getTotalCustomersCount - Company ID:', companyId);
    
    if (!companyId) {
      console.warn('SalesService - getTotalCustomersCount - No company ID available, this may return incorrect data');
      const url = `${this.apiUrl}/CustomerCount/total-customers`;
      console.log('Calling API with URL (no company filter):', url);
      return this.http.get<number>(url);
    }
    
    const url = `${this.apiUrl}/CustomerCount/total-customers?companyId=${companyId}`;
    console.log('Calling API with URL:', url);

    return this.http.get<number>(url);
  }

  // Get average order amount
  getAverageOrderAmount(): Observable<number> {
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId;
    
    console.log('SalesService - getAverageOrderAmount - Current User:', currentUser);
    console.log('SalesService - getAverageOrderAmount - Company ID:', companyId);
    
    if (!companyId) {
      console.warn('SalesService - getAverageOrderAmount - No company ID available, this may return incorrect data');
      const url = `${this.apiUrl}/Sales/average-order-amount`;
      console.log('Calling API with URL (no company filter):', url);
      return this.http.get<number>(url);
    }
    
    const url = `${this.apiUrl}/Sales/average-order-amount?companyId=${companyId}`;
    console.log('Calling API with URL:', url);

    return this.http.get<number>(url);
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
  
  // Create today's test sales data for a company (for testing purposes)
  createTodayTestData(companyId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Sales/create-today-test-data?companyId=${companyId}`, {});
  }

  // Create historical test sales data for a company (for testing chart functionality)
  createHistoricalTestData(companyId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/Sales/create-historical-test-data?companyId=${companyId}`, {});
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

  // Fetch aggregated sales data for a date range and company
  getAggregatedSales(startDate: string, endDate: string, companyId?: string): Observable<any[]> {
    if (!companyId) {
      companyId = this.authService.getCurrentUser()?.CompanyId;
    }
    if (!companyId) {
      throw new Error('User company ID is not available.');
    }
    return this.http.get<any[]>(`${this.apiUrl}/SalesDashboard/aggregated-sales?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&companyId=${encodeURIComponent(companyId)}`);
  }
}
