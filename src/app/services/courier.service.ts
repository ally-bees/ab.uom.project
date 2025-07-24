// src/app/services/courier.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Interface defining structure of a Courier object
export interface Courier {
  id?: string;
  courierId?: string;
  orderId?: string;
  destination?: string;
  date?: Date;
  estimateDate?: Date;
  status?: string;
  companyId?: string;
}

export interface CourierSummaryDto {
  total: number;
  pending: number;
  completed: number;
  rejected: number;
}

export interface TopCountryResult {
  name: string;
  percentage: number;
}

@Injectable({
  providedIn: 'root'
}) // Makes this service globally available
export class CourierService {
  // Fetch couriers for the current user's company
  getCouriersByCurrentUser(authService: { getCurrentUser: () => any }): Observable<Courier[]> {
    const companyId = authService.getCurrentUser()?.CompanyId;
    if (!companyId) {
      throw new Error('User company ID is not available.');
    }
    let params = new HttpParams().set('companyId', companyId);
    return this.http.get<Courier[]>(`${this.baseUrl}/all`, { params });
  }
  // Base URL for all courier-related API endpoints
  private baseUrl = environment.apiUrl + '/api/courier';

  constructor(private http: HttpClient) { }

  // Get all couriers for a company
  getAllCouriers(companyId: string): Observable<Courier[]> {
    let params = new HttpParams().set('companyId', companyId);
    return this.http.get<Courier[]>(`${this.baseUrl}/all`, { params });
  }

  // Get recent deliveries with optional company ID filter
  getRecentDeliveries(count: number, companyId?: string): Observable<Courier[]> {
    let params = new HttpParams().set('count', count.toString());
    if (companyId) {
      params = params.set('companyId', companyId);
    }
    return this.http.get<Courier[]>(`${this.baseUrl}/recent`, { params });
  }

  // Fetch summary statistics between a given date range
  getSummary(fromDate: string, toDate: string, companyId: string): Observable<CourierSummaryDto> {
    let params = new HttpParams()
      .set('from', fromDate)
      .set('to', toDate)
      .set('companyId', companyId);
    return this.http.get<CourierSummaryDto>(`${this.baseUrl}/summary`, { params });
  }

  // Get a single courier by ID
  getById(id: string): Observable<Courier> {
    return this.http.get<Courier>(`${this.baseUrl}/${id}`);
  }

  // Create a new courier
  create(courier: Courier): Observable<Courier> {
    return this.http.post<Courier>(this.baseUrl, courier);
  }

  // Update an existing courier
  update(id: string, courier: Courier): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, courier);
  }

  // Delete a courier
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  // Search couriers by any field
  searchCouriers(searchTerm: string, companyId: string): Observable<Courier[]> {
    let params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('companyId', companyId);
    return this.http.get<Courier[]>(`${this.baseUrl}/search`, { params });
  }

  // Get top countries by delivery count
  getTopCountries(companyId: string): Observable<TopCountryResult[]> {
    let params = new HttpParams().set('companyId', companyId);
    return this.http.get<TopCountryResult[]>(`${this.baseUrl}/top-countries`, { params });
  }

  // Create test data for a company (for testing purposes)
  createTestData(companyId: string): Observable<any> {
    let params = new HttpParams().set('companyId', companyId);
    return this.http.post(`${this.baseUrl}/create-test-data`, {}, { params });
  }

  // Recreate test data for a company (deletes existing and creates new)
  recreateTestData(companyId: string): Observable<any> {
    let params = new HttpParams().set('companyId', companyId);
    return this.http.post(`${this.baseUrl}/recreate-test-data`, {}, { params });
  }
}

