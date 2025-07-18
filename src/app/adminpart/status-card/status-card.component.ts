
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

export interface StatusCardData {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  trend?: 'up' | 'down' | 'neutral';
  percentage?: number;
}

@Component({
  selector: 'app-status-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './status-card.component.html',
  styleUrls: ['./status-card.component.css']
})
export class StatusCardComponent implements OnInit, OnDestroy {
  @Input() title: string = '';
  @Input() value: string | number = 0;
  @Input() subtitle: string = '';
  @Input() icon: string = '';
  @Input() status: 'success' | 'warning' | 'error' | 'info' = 'info';
  @Input() trend: 'up' | 'down' | 'neutral' = 'neutral';
  @Input() percentage?: number;

  isLoading = false;
  hasError = false;
  displayValue: string | number = 0;
  
  private subscription?: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // If this is the Active Users card, fetch real-time data
    if (this.title === 'Active Users') {
      this.fetchUserCount();
    } else {
      // For other cards, use the provided value
      this.displayValue = this.value;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private fetchUserCount(): void {
    this.isLoading = true;
    this.hasError = false;
    
    this.subscription = this.userService.getUserCount().subscribe({
      next: (count) => {
        this.displayValue = count;
        this.isLoading = false;
        this.hasError = false;
        
        // Update subtitle with online users (10% of total)
        const onlineUsers = Math.floor(count * 0.1);
        this.subtitle = `${onlineUsers} online`;
      },
      error: (error) => {
        console.error('Error fetching user count:', error);
        this.displayValue = 'Error';
        this.isLoading = false;
        this.hasError = true;
        this.status = 'error';
      }
    });
  }

  getIconClass(): string {
    const iconMap: { [key: string]: string } = {
      'heartbeat-icon': 'fas fa-heartbeat',
      'users-icon': 'fas fa-users',
      'clock-icon': 'fas fa-clock',
      'database-icon': 'fas fa-database',
      'chart-icon': 'fas fa-chart-line',
      'shield-icon': 'fas fa-shield-alt',
      'server-icon': 'fas fa-server',
      'bell-icon': 'fas fa-bell'
    };
    
    return iconMap[this.icon] || this.icon || 'fas fa-info-circle';
  }

  getTrendIcon(): string {
    switch (this.trend) {
      case 'up': return 'fas fa-arrow-up';
      case 'down': return 'fas fa-arrow-down';
      default: return '';
    }
  }

  refreshData(): void {
    if (this.title === 'Active Users') {
      this.fetchUserCount();
    }
  }
}