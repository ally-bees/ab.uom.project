import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale, SalesViewModel } from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'https://localhost:7143/api';

  constructor(private http: HttpClient) { }

  // Sales endpoints
  getAllSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/Sales`);
  }

  getSaleById(id: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/Sales/${id}`);
  }

  getSalesByVendorId(vendorId: string): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/Sales/vendor/${vendorId}`);
  }

  getSalesByDateRange(startDate: string, endDate: string): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/Sales/daterange?startDate=${startDate}&endDate=${endDate}`);
  }

  getSalesSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Sales/summary`);
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

  // Dashboard endpoints
  getDashboardData(): Observable<SalesViewModel> {
    return this.http.get<SalesViewModel>(`${this.apiUrl}/SalesDashboard`);
  }

  getDashboardDataByVendor(vendorId: string): Observable<SalesViewModel> {
    return this.http.get<SalesViewModel>(`${this.apiUrl}/SalesDashboard/vendor/${vendorId}`);
  }
}