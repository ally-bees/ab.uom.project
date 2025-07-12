import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuditLog {
  id?: string;
  timestamp: Date;
  userId?: string;
  username?: string;
  userEmail?: string;
  userRole?: string;
  action: string;
  actionType: string;
  resource?: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  status: string;
  errorMessage?: string;
  sessionId?: string;
  module?: string;
  severity: string;
  oldValues?: any;
  newValues?: any;
  durationMs?: number;
  isSystemLog: boolean;
}

export interface AuditLogFilter {
  fromDate?: Date;
  toDate?: Date;
  userId?: string;
  username?: string;
  actionType?: string;
  resource?: string;
  status?: string;
  severity?: string;
  module?: string;
  page?: number;
  pageSize?: number;
}

export interface AuditLogSummary {
  totalLogs: number;
  successCount: number;
  failedCount: number;
  pendingCount: number;
  actionTypeCounts: { [key: string]: number };
  moduleCounts: { [key: string]: number };
  severityCounts: { [key: string]: number };
  recentLogs: AuditLog[];
}

export interface PaginatedResponse<T> {
  logs: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private apiUrl = `${environment.apiUrl}/api/auditlog`;
  private refreshSubject = new BehaviorSubject<void>(undefined);

  constructor(private http: HttpClient) {}

  // Get audit logs with filtering and pagination
  getAuditLogs(filter: AuditLogFilter = {}): Observable<PaginatedResponse<AuditLog>> {
    let params = new HttpParams();

    if (filter.fromDate) {
      params = params.set('fromDate', filter.fromDate.toISOString());
    }
    if (filter.toDate) {
      params = params.set('toDate', filter.toDate.toISOString());
    }
    if (filter.userId) {
      params = params.set('userId', filter.userId);
    }
    if (filter.username) {
      params = params.set('username', filter.username);
    }
    if (filter.actionType) {
      params = params.set('actionType', filter.actionType);
    }
    if (filter.resource) {
      params = params.set('resource', filter.resource);
    }
    if (filter.status) {
      params = params.set('status', filter.status);
    }
    if (filter.severity) {
      params = params.set('severity', filter.severity);
    }
    if (filter.module) {
      params = params.set('module', filter.module);
    }
    if (filter.page) {
      params = params.set('page', filter.page.toString());
    }
    if (filter.pageSize) {
      params = params.set('pageSize', filter.pageSize.toString());
    }

    console.log('Making request to:', `${this.apiUrl}/api/auditlog`, 'with params:', params);
    return this.http.get<PaginatedResponse<AuditLog>>(`${this.apiUrl}/api/auditlog`, { params });
  }

  // Get audit log summary
  getAuditLogSummary(fromDate?: Date, toDate?: Date): Observable<AuditLogSummary> {
    let params = new HttpParams();
    if (fromDate) {
      params = params.set('fromDate', fromDate.toISOString());
    }
    if (toDate) {
      params = params.set('toDate', toDate.toISOString());
    }

    return this.http.get<AuditLogSummary>(`${this.apiUrl}/api/auditlog/summary`, { params });
  }

  // Get distinct values for a field
  getDistinctValues(field: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/api/auditlog/distinct/${field}`);
  }

  // Create a new audit log
  createAuditLog(auditLog: Partial<AuditLog>): Observable<AuditLog> {
    return this.http.post<AuditLog>(`${this.apiUrl}/api/auditlog`, auditLog);
  }

  // Export audit logs
  exportAuditLogs(fromDate?: Date, toDate?: Date, format: string = 'csv'): Observable<Blob> {
    let params = new HttpParams().set('format', format);
    if (fromDate) {
      params = params.set('fromDate', fromDate.toISOString());
    }
    if (toDate) {
      params = params.set('toDate', toDate.toISOString());
    }

    return this.http.get(`${this.apiUrl}/api/auditlog/export`, { 
      params, 
      responseType: 'blob' 
    });
  }

  // Cleanup old logs (Admin only)
  cleanupOldLogs(beforeDate: Date): Observable<any> {
    const params = new HttpParams().set('beforeDate', beforeDate.toISOString());
    return this.http.delete(`${this.apiUrl}/api/auditlog/cleanup`, { params });
  }

  // Helper method to create audit log entries
  logAction(
    action: string,
    actionType: string,
    resource?: string,
    resourceId?: string,
    details?: string,
    severity: string = 'Info',
    module?: string
  ): Observable<AuditLog> {
    const auditLog: Partial<AuditLog> = {
      action,
      actionType,
      resource,
      resourceId,
      details,
      severity,
      module,
      status: 'Success',
      timestamp: new Date()
    };

    return this.createAuditLog(auditLog);
  }

  // Helper method to log errors
  logError(
    action: string,
    errorMessage: string,
    actionType: string = 'Error',
    resource?: string,
    resourceId?: string,
    module?: string
  ): Observable<AuditLog> {
    const auditLog: Partial<AuditLog> = {
      action,
      actionType,
      resource,
      resourceId,
      errorMessage,
      severity: 'Error',
      module,
      status: 'Failed',
      timestamp: new Date()
    };

    return this.createAuditLog(auditLog);
  }

  // Refresh trigger for real-time updates
  refresh(): void {
    this.refreshSubject.next();
  }

  // Observable for refresh events
  get refresh$(): Observable<void> {
    return this.refreshSubject.asObservable();
  }

  // Download CSV file
  downloadCsv(data: Blob, filename: string): void {
    const url = window.URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // Format timestamp for display
  formatTimestamp(timestamp: Date | string): string {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleString();
  }

  // Get status color class
  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'success':
        return 'status-success';
      case 'failed':
        return 'status-failed';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-default';
    }
  }

  // Get severity color class
  getSeverityColor(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'severity-critical';
      case 'error':
        return 'severity-error';
      case 'warning':
        return 'severity-warning';
      case 'info':
        return 'severity-info';
      default:
        return 'severity-default';
    }
  }
} 