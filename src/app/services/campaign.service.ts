// src/app/services/marketing-campaign.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface CampaignPerformance {
  id?: string;
  name: string;
  impressions: string;
  clicks: string;
  cpc: string;
  spend: string;
  icon?: string;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MarketingCampaignService {
  private apiUrl = 'http://localhost:5241/api';

  constructor(private http: HttpClient) {}

  getCampaignPerformance(): Observable<CampaignPerformance[]> {
    return this.http.get<CampaignPerformance[]>(`${this.apiUrl}/campaign/performance`)
      .pipe(
        catchError(error => {
          console.error('Error fetching campaign performance:', error);
          return of([]);
        })
      );
  }
}