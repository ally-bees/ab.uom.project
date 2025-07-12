import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Invoice } from '../models/invoice.model';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; // ✅ Import AuthService

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private apiUrl = 'http://localhost:5241/api/finance';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getFinanceData(): Observable<Invoice[]> {
  const companyId = this.authService.getCurrentUser()?.CompanyId;
  if (!companyId) {
    throw new Error('CompanyId is not available for the current user');
  }
  return this.http.get<Invoice[]>(`${this.apiUrl}/company/${companyId}`);
}

}
