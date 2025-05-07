import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sale, SalesViewModel, SalesSummary } from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SalesService {
  private apiUrl = 'http://localhost:5241/api';
  private apiUrl2 = 'https://localhost:5241/api'; 

  constructor(private http: HttpClient) {}

  // Sales endpoints
  getAllSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/Sales`);
  }

  getSaleById(id: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/Sales/${id}`);
  }
  
  getSalesSummary(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Sales/summary`);
  }

  getSalesSummarybyDate(startDate: string, endDate: string): Observable<SalesSummary> {
    return this.http.get<SalesSummary>(`${this.apiUrl}/Sales/summary?startDate=${startDate}&endDate=${endDate}`);
  }

 

  getSalesByYear(year: number): Observable<Sale[]> {
    // Assuming you have an API endpoint to fetch sales for a specific year.
    return this.http.get<Sale[]>(`${this.apiUrl}/Sales/year/${year}`);
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
  getSalesVeiwData(): Observable<SalesViewModel> {
    return this.http.get<SalesViewModel>('/`${this.apiUrl2}/SalesDashboard/date-range'); 
  }
  // Dashboard endpoints
  getDashboardData(): Observable<SalesViewModel> {
    return this.http.get<SalesViewModel>(`${this.apiUrl}/SalesDashboard`);
  }

}
