import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class barchartService {
  private apiUrl = 'http://localhost:5110/table'; // Replace with your actual base URL

  constructor(private http: HttpClient) {}

  getLastThreeYearTaxSum() {
    return this.http.get<{ [year: string]: number }>(`${this.apiUrl}/tax-sum/last-3-years`);
  }
}
