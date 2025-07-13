import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Automation {
    id: number;
    reportType: string;
    format: string;
    frequency: string;
    time: string;
    dayOfWeek?: string;
    dayOfMonth?: number;
  
    // Add these properties:
    emails: string;
    subject: string;
    message: string;
    notifyOnSuccess: boolean;
    notifyOnFailure: boolean;
  }
  

@Injectable({ providedIn: 'root' })
export class AutomationService {
  private baseUrl = 'http://localhost:5241/api/automation'; 

  constructor(private http: HttpClient) {}

  getAutomations(): Observable<Automation[]> {
    return this.http.get<Automation[]>(this.baseUrl);
  }

  addAutomation(automation: Partial<Automation>): Observable<Automation> {
    return this.http.post<Automation>(this.baseUrl, automation);
  }

  deleteAutomation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // filepath: automation.service.ts
updateAutomation(id: string, automationData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, automationData);
  }
}
