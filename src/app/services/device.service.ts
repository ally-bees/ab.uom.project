import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DeviceCategoryStats {
  deviceType: string;
  sessionCount: number;
  percentage: number;
  orderCount: number;
  revenue: number;
}

export interface DeviceCategorySummary {
  mobilePercentage: number;
  desktopPercentage: number;
  tabletPercentage: number;
  totalSessions: number;
  totalOrders: number;
  totalRevenue: number;
}

export interface DeviceCategory {
  id?: string;
  deviceType: string;
  sessionCount: number;
  orderCount: number;
  revenue: number;
  companyId: string;
  date: Date;
  userAgent: string;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = environment.apiUrl + '/api/DeviceCategory';

  constructor(private http: HttpClient) { }

  /**
   * Get device category statistics with percentages
   */
  getDeviceCategoryStats(companyId?: string): Observable<DeviceCategoryStats[]> {
    let params = new HttpParams();
    if (companyId) {
      params = params.set('companyId', companyId);
    }
    return this.http.get<DeviceCategoryStats[]>(`${this.apiUrl}/stats`, { params });
  }

  /**
   * Get device category summary with percentages for mobile, desktop, and tablet
   */
  getDeviceCategorySummary(companyId?: string): Observable<DeviceCategorySummary> {
    let params = new HttpParams();
    if (companyId) {
      params = params.set('companyId', companyId);
    }
    return this.http.get<DeviceCategorySummary>(`${this.apiUrl}/summary`, { params });
  }

  /**
   * Track a device session
   */
  trackDeviceSession(deviceData: DeviceCategory): Observable<any> {
    return this.http.post(`${this.apiUrl}/track`, deviceData);
  }

  /**
   * Get all device categories
   */
  getAllDeviceCategories(companyId?: string): Observable<DeviceCategory[]> {
    let params = new HttpParams();
    if (companyId) {
      params = params.set('companyId', companyId);
    }
    return this.http.get<DeviceCategory[]>(`${this.apiUrl}`, { params });
  }

  /**
   * Create sample device data for testing
   */
  createSampleData(companyId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/sample/${companyId}`, {});
  }

  /**
   * Detect device type from user agent
   */
  detectDeviceType(): string {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'Tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'Mobile';
    } else {
      return 'Desktop';
    }
  }

  /**
   * Track current session
   */
  trackCurrentSession(companyId: string, orderCount: number = 0, revenue: number = 0): Observable<any> {
    const deviceData: DeviceCategory = {
      deviceType: this.detectDeviceType(),
      sessionCount: 1,
      orderCount: orderCount,
      revenue: revenue,
      companyId: companyId,
      date: new Date(),
      userAgent: navigator.userAgent
    };

    return this.trackDeviceSession(deviceData);
  }
}
