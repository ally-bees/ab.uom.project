import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface AuditYearStats {
  firstAudit: string;
  lastAudit: string;
  count: number;
  totalTax: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private apiUrl = 'http://localhost:5241/table/audit-stats';

  constructor(private http: HttpClient) { }

  getAuditStatistics(): Observable<{ [key: number]: AuditYearStats }> {
    return this.http.get<{ [key: number]: AuditYearStats }>(this.apiUrl);
  }
}
