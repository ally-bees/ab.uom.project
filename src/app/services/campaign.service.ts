// src/app/services/marketing-campaign.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { User } from '../models/user.model';

export interface CampaignPerformance {
  id?: string;
  name: string;
  impressions: string;
  clicks: string;
  cpc: string;
  spend: string;
  icon?: string;
  color?: string;
  companyId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MarketingCampaignService {
  private apiUrl = 'http://localhost:5241/api';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Simplified method to get campaigns for a specific company
  getCampaignPerformanceByCompanyId(companyId: string): Observable<CampaignPerformance[]> {
    console.log('Directly requesting campaigns for company ID:', companyId);
    return this.http.get<CampaignPerformance[]>(`${this.apiUrl}/campaign/performance?companyId=${companyId}`).pipe(
      tap(campaigns => {
        console.log(`Received ${campaigns.length} campaigns for company ${companyId}`);
      }),
      catchError(error => {
        console.error('Error fetching campaign performance for company:', error);
        return of([]);
      })
    );
  }

  // Method to get ALL campaigns for a specific company (no limit)
  getAllCampaignsByCompanyId(companyId: string): Observable<CampaignPerformance[]> {
    console.log('Requesting ALL campaigns for company ID:', companyId);
    return this.http.get<CampaignPerformance[]>(`${this.apiUrl}/campaign/performance?companyId=${companyId}&all=true`).pipe(
      tap(campaigns => {
        console.log(`Received ALL ${campaigns.length} campaigns for company ${companyId}`);
      }),
      catchError(error => {
        console.error('Error fetching all campaign performance for company:', error);
        return of([]);
      })
    );
  }

  // Method to get campaigns for the current user's company
  getCampaignPerformance(): Observable<CampaignPerformance[]> {
    // Try to get current user
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId;
    
    console.log('Current user in campaign service:', currentUser);
    console.log('Company ID for campaign filtering:', companyId);

    if (companyId) {
      return this.getCampaignPerformanceByCompanyId(companyId);
    }
    
    // Fallback if no user or company ID available
    console.warn('No company ID available, returning empty campaign list');
    return of([]);
    
    /* Commenting out complex logic for now
    // If no user is available yet, try to get from the observable
    if (!currentUser) {
      console.log('No current user available, checking observable');
      return this.authService.currentUser$.pipe(
        // Take first non-null value
        tap((user: User | null) => console.log('User from observable:', user)),
        // Map to the campaign API call
        switchMap((user: User | null) => {
          const userId = user?.CompanyId;
          console.log('User ID from observable:', userId);
          const url = `${this.apiUrl}/campaign/performance${userId ? `?companyId=${userId}` : ''}`;
          console.log('Calling campaign API URL (from observable):', url);
          return this.http.get<CampaignPerformance[]>(url);
        }),
        catchError(error => {
          console.error('Error fetching campaign performance:', error);
          return of([]);
        })
      );
    }
    
    // Regular path if user is available
    const url = `${this.apiUrl}/campaign/performance${companyId ? `?companyId=${companyId}` : ''}`;
    console.log('Calling campaign API URL:', url);
    
    return this.http.get<CampaignPerformance[]>(url).pipe(
      catchError(error => {
        console.error('Error fetching campaign performance:', error);
        return of([]);
      })
    );
    */
  }
}