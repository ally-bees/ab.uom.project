import { Injectable } from '@angular/core'; //use to inject one component to another component
import { Observable, of } from 'rxjs'; //observable handle multiple data asynchronously  and create observable from static data
import { HttpClient, HttpParams } from '@angular/common/http'; // HTTP requests to a backend API 

interface TaxRecord {
  date: string;
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

  private apiUrl = 'http://localhost:5241/Table/totals'; // Change to match your backend API

  constructor(private http: HttpClient) {}
  
  // Fetch all tax records from the backend
  getTotals(fromDate?: string, toDate?: string): Observable<{ TotalValue: number; TotalTax: number; TotalNetValue: number }> {
    console.log("getTotals() called with URL:", this.apiUrl, fromDate, toDate);
    let params = new HttpParams();
    
    if (fromDate && toDate) {
        params = params.set('from', fromDate).set('to', toDate);
    }
  
    return this.http.get<{ TotalValue: number; TotalTax: number; TotalNetValue: number }>(this.apiUrl, { params });
  }


  getChartData(fromDate: string, toDate: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?from=${fromDate}&to=${toDate}`);
  }
}