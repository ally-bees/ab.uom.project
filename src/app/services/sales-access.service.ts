import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalesAccess } from '../models/sales-access.model';

@Injectable({ providedIn: 'root' })
export class SalesAccessService {
  private apiUrl = 'http://localhost:5241/api/SalesAccess';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SalesAccess[]> {
    return this.http.get<SalesAccess[]>(this.apiUrl);
  }

  getByCompanyId(companyId: string): Observable<SalesAccess> {
    return this.http.get<SalesAccess>(`${this.apiUrl}/company/${companyId}`);
  }

  create(access: SalesAccess): Observable<SalesAccess> {
    return this.http.post<SalesAccess>(this.apiUrl, access);
  }

  update(id: string, access: SalesAccess): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, access);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  patchSalesAccessValue(companyId: string, salesAccessValue: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/company/${companyId}`, salesAccessValue);
  }
} 