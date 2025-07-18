import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, interval } from 'rxjs';

export interface SystemHealthMetric {
  name: string;
  value: number;
  unit: string;
  status: 'healthy' | 'warning' | 'critical';
  threshold: { warning: number; critical: number };
}

@Component({
  selector: 'app-system-health',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="system-health-widget">
      <h3><i class="fas fa-heartbeat"></i> System Health</h3>
      <div class="health-metrics">
        <div class="metric-item" *ngFor="let metric of metrics" [class]="'status-' + metric.status">
          <div class="metric-header">
            <span class="metric-name">{{ metric.name }}</span>
            <span class="metric-status" [class]="metric.status">
              <i class="fas fa-circle"></i>
            </span>
          </div>
          <div class="metric-value">
            {{ metric.value }}{{ metric.unit }}
          </div>
          <div class="metric-bar">
            <div class="metric-fill" 
                 [style.width.%]="getPercentage(metric)"
                 [class]="'fill-' + metric.status">
            </div>
          </div>
        </div>
      </div>
      <div class="health-summary">
        <div class="summary-item">
          <span class="summary-label">Overall Status:</span>
          <span class="summary-value" [class]="overallStatus">{{ overallStatus.toUpperCase() }}</span>
        </div>
        <div class="summary-item">
          <span class="summary-label">Last Check:</span>
          <span class="summary-value">{{ lastUpdate | date:'short' }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .system-health-widget {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }

    .system-health-widget h3 {
      margin: 0 0 20px 0;
      color: #333;
      font-size: 1.1em;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .metric-item {
      margin-bottom: 16px;
      padding: 12px;
      border-radius: 6px;
      border-left: 4px solid;
    }

    .status-healthy {
      background-color: #f8fff9;
      border-left-color: #28a745;
    }

    .status-warning {
      background-color: #fffbf0;
      border-left-color: #ffc107;
    }

    .status-critical {
      background-color: #fff5f5;
      border-left-color: #dc3545;
    }

    .metric-header {
      display: flex;
      justify-content: between;
      align-items: center;
      margin-bottom: 8px;
    }

    .metric-name {
      font-weight: 500;
      color: #333;
    }

    .metric-status {
      font-size: 0.8em;
    }

    .metric-status.healthy {
      color: #28a745;
    }

    .metric-status.warning {
      color: #ffc107;
    }

    .metric-status.critical {
      color: #dc3545;
    }

    .metric-value {
      font-size: 1.2em;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }

    .metric-bar {
      height: 6px;
      background-color: #e9ecef;
      border-radius: 3px;
      overflow: hidden;
    }

    .metric-fill {
      height: 100%;
      transition: width 0.3s ease;
      border-radius: 3px;
    }

    .fill-healthy {
      background-color: #28a745;
    }

    .fill-warning {
      background-color: #ffc107;
    }

    .fill-critical {
      background-color: #dc3545;
    }

    .health-summary {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #e9ecef;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .summary-label {
      color: #666;
      font-size: 0.9em;
    }

    .summary-value {
      font-weight: 500;
    }

    .summary-value.healthy {
      color: #28a745;
    }

    .summary-value.warning {
      color: #ffc107;
    }

    .summary-value.critical {
      color: #dc3545;
    }
  `]
})
export class SystemHealthComponent implements OnInit, OnDestroy {
  @Input() autoUpdate = true;
  
  metrics: SystemHealthMetric[] = [
    {
      name: 'CPU Usage',
      value: 45,
      unit: '%',
      status: 'healthy',
      threshold: { warning: 70, critical: 90 }
    },
    {
      name: 'Memory Usage',
      value: 62,
      unit: '%',
      status: 'healthy',
      threshold: { warning: 80, critical: 95 }
    },
    {
      name: 'Disk Space',
      value: 78,
      unit: '%',
      status: 'warning',
      threshold: { warning: 75, critical: 90 }
    },
    {
      name: 'Network Latency',
      value: 32,
      unit: 'ms',
      status: 'healthy',
      threshold: { warning: 100, critical: 200 }
    },
    {
      name: 'Error Rate',
      value: 1.2,
      unit: '%',
      status: 'healthy',
      threshold: { warning: 2, critical: 5 }
    }
  ];

  overallStatus: 'healthy' | 'warning' | 'critical' = 'healthy';
  lastUpdate = new Date();
  
  private updateSubscription?: Subscription;

  ngOnInit(): void {
    if (this.autoUpdate) {
      this.startAutoUpdate();
    }
    this.updateOverallStatus();
  }

  ngOnDestroy(): void {
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  private startAutoUpdate(): void {
    this.updateSubscription = interval(10000).subscribe(() => {
      this.updateMetrics();
    });
  }

  private updateMetrics(): void {
    // Simulate real-time metric updates
    this.metrics = this.metrics.map(metric => {
      const variation = (Math.random() - 0.5) * 10; // +/- 5 points variation
      const newValue = Math.max(0, Math.min(100, metric.value + variation));
      
      return {
        ...metric,
        value: Math.round(newValue * 10) / 10, // Round to 1 decimal
        status: this.getMetricStatus(newValue, metric.threshold)
      };
    });

    this.updateOverallStatus();
    this.lastUpdate = new Date();
  }

  private getMetricStatus(value: number, threshold: { warning: number; critical: number }): 'healthy' | 'warning' | 'critical' {
    if (value >= threshold.critical) return 'critical';
    if (value >= threshold.warning) return 'warning';
    return 'healthy';
  }

  private updateOverallStatus(): void {
    const criticalCount = this.metrics.filter(m => m.status === 'critical').length;
    const warningCount = this.metrics.filter(m => m.status === 'warning').length;

    if (criticalCount > 0) {
      this.overallStatus = 'critical';
    } else if (warningCount > 0) {
      this.overallStatus = 'warning';
    } else {
      this.overallStatus = 'healthy';
    }
  }

  getPercentage(metric: SystemHealthMetric): number {
    // For latency and error rate, we want lower values to show as "better"
    if (metric.name.includes('Latency') || metric.name.includes('Error')) {
      return Math.min(100, (metric.value / metric.threshold.warning) * 50);
    }
    // For usage metrics, show actual percentage
    return Math.min(100, metric.value);
  }

  refreshMetrics(): void {
    this.updateMetrics();
  }
}
