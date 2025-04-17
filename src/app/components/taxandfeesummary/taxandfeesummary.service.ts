import { Injectable } from '@angular/core'; //use to inject one component to another component
import { Observable, of } from 'rxjs'; //observable handle multiple data asynchronously  and create observable from static data
import { HttpClient } from '@angular/common/http'; // HTTP requests to a backend API 

interface TaxRecord {
  date: Date;
  auditId: string;
  salesId: string;  
  name: string;
  value: number;
  tax: number;
  netValue: number;  
  status?: string;  
}

@Injectable({               //how we use injectable
  providedIn: 'root'
})

export class TaxSummaryService {

  private apiUrl = 'http://localhost:5110/Table/totals'; // Change to match your backend API

  constructor(private http: HttpClient) {}
  
  // Fetch all tax records from the backend
  getTotals(): Observable<{ TotalValue: number; TotalTax: number; TotalNetValue: number }> {
    console.log("getTotals() called with URL:", this.apiUrl);
    return this.http.get<{ TotalValue: number; TotalTax: number; TotalNetValue: number }>(this.apiUrl);
  }

  getChartData(fromDate: string, toDate: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?from=${fromDate}&to=${toDate}`);
  }
}