import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkTraffic: number;
  activeConnections: number;
  responseTime: number;
  errorRate: number;
  uptime: number;
}

export interface UserActivityData {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  loginAttempts: number;
  failedLogins: number;
  sessionsActive: number;
}

export interface SecurityAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  severity: 'high' | 'medium' | 'low';
  source: string;
  acknowledged: boolean;
}

export interface SystemActivity {
  id: string;
  user: string;
  action: string;
  timestamp: Date;
  status: 'success' | 'warning' | 'error';
  ipAddress?: string;
  userAgent?: string;
  details?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminAnalyticsService {
  private apiUrl = 'http://localhost:5241/api';
  
  // Real-time data subjects
  private systemMetricsSubject = new BehaviorSubject<SystemMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkTraffic: 0,
    activeConnections: 0,
    responseTime: 0,
    errorRate: 0,
    uptime: 0
  });

  private userActivitySubject = new BehaviorSubject<UserActivityData>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    loginAttempts: 0,
    failedLogins: 0,
    sessionsActive: 0
  });

  private securityAlertsSubject = new BehaviorSubject<SecurityAlert[]>([]);
  private systemActivitiesSubject = new BehaviorSubject<SystemActivity[]>([]);

  constructor(private http: HttpClient) {
    this.initializeRealTimeData();
  }

  // Observables for components to subscribe to
  get systemMetrics$(): Observable<SystemMetrics> {
    return this.systemMetricsSubject.asObservable();
  }

  get userActivity$(): Observable<UserActivityData> {
    return this.userActivitySubject.asObservable();
  }

  get securityAlerts$(): Observable<SecurityAlert[]> {
    return this.securityAlertsSubject.asObservable();
  }

  get systemActivities$(): Observable<SystemActivity[]> {
    return this.systemActivitiesSubject.asObservable();
  }

  // Initialize real-time data updates
  private initializeRealTimeData(): void {
    // Update every 30 seconds
    interval(30000).subscribe(() => {
      this.refreshAllData();
    });

    // Initial load
    this.refreshAllData();
  }

  // Refresh all data
  refreshAllData(): void {
    this.loadSystemMetrics();
    this.loadUserActivity();
    this.loadSecurityAlerts();
    this.loadSystemActivities();
  }

  // System Metrics
  private loadSystemMetrics(): void {
    // Simulate real-time metrics (replace with actual API calls)
    const metrics: SystemMetrics = {
      cpuUsage: this.getRandomValue(20, 80),
      memoryUsage: this.getRandomValue(30, 90),
      diskUsage: this.getRandomValue(40, 85),
      networkTraffic: this.getRandomValue(10, 60),
      activeConnections: this.getRandomValue(50, 200),
      responseTime: this.getRandomValue(100, 300),
      errorRate: this.getRandomValue(0, 5),
      uptime: 99.2 + Math.random() * 0.8
    };
    
    this.systemMetricsSubject.next(metrics);
  }

  // User Activity
  private loadUserActivity(): void {
    this.http.get<number>(`${this.apiUrl}/usermanagement/count`)
      .pipe(
        catchError(() => [100]) // Fallback value
      )
      .subscribe(totalUsers => {
        const activity: UserActivityData = {
          totalUsers,
          activeUsers: Math.floor(totalUsers * 0.1),
          newUsersToday: this.getRandomValue(5, 20),
          loginAttempts: this.getRandomValue(100, 500),
          failedLogins: this.getRandomValue(10, 50),
          sessionsActive: Math.floor(totalUsers * 0.05)
        };
        
        this.userActivitySubject.next(activity);
      });
  }

  // Security Alerts
  private loadSecurityAlerts(): void {
    const alerts: SecurityAlert[] = [
      {
        id: '1',
        type: 'warning',
        message: 'Multiple failed login attempts detected from IP 192.168.1.100',
        timestamp: new Date(Date.now() - 300000), // 5 minutes ago
        severity: 'medium',
        source: 'Authentication System',
        acknowledged: false
      },
      {
        id: '2',
        type: 'info',
        message: 'System backup completed successfully',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        severity: 'low',
        source: 'Backup Service',
        acknowledged: false
      },
      {
        id: '3',
        type: 'critical',
        message: 'Disk space running low on server partition',
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        severity: 'high',
        source: 'System Monitor',
        acknowledged: false
      }
    ];

    this.securityAlertsSubject.next(alerts);
  }

  // System Activities
  private loadSystemActivities(): void {
    const activities: SystemActivity[] = [
      {
        id: '1',
        user: 'admin@example.com',
        action: 'Updated system configuration',
        timestamp: new Date(Date.now() - 120000), // 2 minutes ago
        status: 'success',
        ipAddress: '192.168.1.10',
        userAgent: 'Mozilla/5.0',
        details: 'Modified security settings'
      },
      {
        id: '2',
        user: 'user@example.com',
        action: 'Failed login attempt',
        timestamp: new Date(Date.now() - 240000), // 4 minutes ago
        status: 'warning',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0',
        details: 'Invalid password'
      },
      {
        id: '3',
        user: 'manager@example.com',
        action: 'Exported user report',
        timestamp: new Date(Date.now() - 360000), // 6 minutes ago
        status: 'success',
        ipAddress: '192.168.1.15',
        userAgent: 'Mozilla/5.0',
        details: 'Monthly user activity report'
      },
      {
        id: '4',
        user: 'system',
        action: 'Automated backup started',
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        status: 'success',
        ipAddress: 'localhost',
        userAgent: 'System Process',
        details: 'Daily database backup'
      }
    ];

    this.systemActivitiesSubject.next(activities);
  }

  // Helper method to generate random values
  private getRandomValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Acknowledge security alert
  acknowledgeAlert(alertId: string): Observable<boolean> {
    const currentAlerts = this.securityAlertsSubject.value;
    const updatedAlerts = currentAlerts.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    );
    
    this.securityAlertsSubject.next(updatedAlerts);
    return new Observable(observer => {
      observer.next(true);
      observer.complete();
    });
  }

  // Dismiss security alert
  dismissAlert(alertId: string): Observable<boolean> {
    const currentAlerts = this.securityAlertsSubject.value;
    const updatedAlerts = currentAlerts.filter(alert => alert.id !== alertId);
    
    this.securityAlertsSubject.next(updatedAlerts);
    return new Observable(observer => {
      observer.next(true);
      observer.complete();
    });
  }

  // Get performance data for charts
  getPerformanceData(period: '1h' | '24h' | '7d' | '30d' = '24h'): Observable<any> {
    // Generate sample performance data
    const dataPoints = period === '1h' ? 60 : period === '24h' ? 24 : period === '7d' ? 7 : 30;
    const labels = Array.from({ length: dataPoints }, (_, i) => {
      if (period === '1h') return `${String(Math.floor(i / 60)).padStart(2, '0')}:${String(i % 60).padStart(2, '0')}`;
      if (period === '24h') return `${i}:00`;
      if (period === '7d') return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i];
      return `Day ${i + 1}`;
    });

    const data = {
      labels,
      datasets: {
        responseTime: Array.from({ length: dataPoints }, () => this.getRandomValue(80, 200)),
        errorRate: Array.from({ length: dataPoints }, () => this.getRandomValue(0, 5)),
        userActivity: Array.from({ length: dataPoints }, () => this.getRandomValue(50, 300)),
        systemLoad: Array.from({ length: dataPoints }, () => this.getRandomValue(20, 80))
      }
    };

    return new Observable(observer => {
      observer.next(data);
      observer.complete();
    });
  }

  // Export system report
  exportSystemReport(): Observable<Blob> {
    const reportData = {
      timestamp: new Date().toISOString(),
      systemMetrics: this.systemMetricsSubject.value,
      userActivity: this.userActivitySubject.value,
      securityAlerts: this.securityAlertsSubject.value,
      systemActivities: this.systemActivitiesSubject.value.slice(0, 100) // Last 100 activities
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });

    return new Observable(observer => {
      observer.next(blob);
      observer.complete();
    });
  }
}
