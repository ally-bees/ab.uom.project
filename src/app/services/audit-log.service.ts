import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AuditLog {
  id?: string;
  action: string;
  user: string;
  userId?: string;
  timestamp: Date;
  status: string;
  ipAddress?: string;
  userAgent?: string;
  module?: string;
  details?: string;
  oldValues?: any;
  newValues?: any;
  severity: string;
  category: string;
}

export interface AuditLogResponse {
  logs: AuditLog[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface AuditLogFilter {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  category?: string;
  fromDate?: Date;
  toDate?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private apiUrl = 'http://localhost:5241/api/auditlog';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getLogs(filter: AuditLogFilter = {}): Observable<AuditLogResponse> {
    let params = new HttpParams();

    if (filter.page) params = params.set('page', filter.page.toString());
    if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    if (filter.search) params = params.set('search', filter.search);
    if (filter.status) params = params.set('status', filter.status);
    if (filter.category) params = params.set('category', filter.category);
    if (filter.fromDate) params = params.set('fromDate', filter.fromDate.toISOString());
    if (filter.toDate) params = params.set('toDate', filter.toDate.toISOString());

    return this.http.get<AuditLogResponse>(this.apiUrl, { 
      params,
      headers: this.getHeaders()
    });
  }

  getStatistics(fromDate?: Date, toDate?: Date): Observable<{ [key: string]: number }> {
    let params = new HttpParams();
    if (fromDate) params = params.set('fromDate', fromDate.toISOString());
    if (toDate) params = params.set('toDate', toDate.toISOString());

    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/statistics`, { 
      params,
      headers: this.getHeaders()
    });
  }

  exportLogs(fromDate?: Date, toDate?: Date, format: string = 'csv'): Observable<Blob> {
    let params = new HttpParams();
    if (fromDate) params = params.set('fromDate', fromDate.toISOString());
    if (toDate) params = params.set('toDate', toDate.toISOString());
    params = params.set('format', format);

    return this.http.get(`${this.apiUrl}/export`, { 
      params, 
      responseType: 'blob',
      headers: this.getHeaders()
    });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`, {
      headers: this.getHeaders()
    });
  }

  getStatuses(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/statuses`, {
      headers: this.getHeaders()
    });
  }

  createLog(auditLog: Partial<AuditLog>): Observable<any> {
    return this.http.post(`${this.apiUrl}/log`, auditLog, {
      headers: this.getHeaders()
    });
  }
}
