import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

interface TaxRecord {
  date: Date;
  auditId: string;
  salesId: string;  
  name: string;
  value: number;
  tax: number;
  netValue: number;  
  status?: string;  // Optional
}

@Injectable({
  providedIn: 'root'
})
export class TaxTableService {
  private apiUrl = 'http://localhost:5241/Table/table';  // Your backend API URL

  constructor(private http: HttpClient) {}

  // Fetch tax records with optional date filters
  getTaxRecords(from: string, to: string): Observable<TaxRecord[]> {
    let params = new HttpParams()
      .set('from', from)
      .set('to', to);

    return this.http.get<TaxRecord[]>(this.apiUrl, { params });  // 👈 corrected
  }

  // Fetch all tax records without filtering
  getAllTaxRecords(): Observable<TaxRecord[]> {
    return this.http.get<TaxRecord[]>(this.apiUrl);
  }
}
