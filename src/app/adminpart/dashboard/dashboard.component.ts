import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusCardComponent } from '../status-card/status-card.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { SystemConfigComponent } from '../system-config/system-config.component';
import { AuditLogsComponent } from '../audit-logs/audit-logs.component';
import { FooterComponent } from '../../footer/footer.component';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';
import { HeaderComponent } from '../../pages/header/header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatusCardComponent,
    UserManagementComponent,
    SystemConfigComponent,
    AuditLogsComponent,
    FooterComponent,
    HeaderComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  statusCards: Array<{
    title: string;
    value: string | number;
    subtitle: string;
    icon: string;
    status: 'success' | 'warning' | 'error' | 'info';
    trend: 'up' | 'down' | 'neutral';
    percentage: number;
  }> = [
    {
      title: 'System Status',
      value: 'Healthy',
      subtitle: 'uptime 99.2%',
      icon: 'heartbeat-icon',
      status: 'success',
      trend: 'up',
      percentage: 2.1
    },
    {
      title: 'Active Users',
      value: 0,
      subtitle: '0 online',
      icon: 'users-icon',
      status: 'info',
      trend: 'up',
      percentage: 8.5
    },
    {
      title: 'Pending Requests',
      value: 12,
      subtitle: '1 Awaiting Approval',
      icon: 'clock-icon',
      status: 'warning',
      trend: 'down',
      percentage: 12.3
    },
    {
      title: 'API Health',
      value: 'Normal',
      subtitle: 'All Systems Operational',
      icon: 'database-icon',
      status: 'success',
      trend: 'neutral',
      percentage: 0.8
    }
  ];

  activeTab = 'users'; // Default active tab
  currentUser: User | null = null;
  private userSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.loadUserCount();
    this.loadStatusCardData();
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  private loadUserCount(): void {
    this.userService.getUserCount().subscribe({
      next: (count) => {
        this.statusCards[1].value = count;
        this.statusCards[1].subtitle = `${Math.floor(count * 0.1)} online`;
      },
      error: (error) => console.error('Error loading user count:', error)
    });
  }

  // Method to load real-time data for all cards
  private loadStatusCardData(): void {
    // Load user count
    this.loadUserCount();
    
    // You can add more real data sources here:
    // this.loadSystemHealth();
    // this.loadPendingRequests();
    // this.loadApiHealth();
  }

  private updateStatusCards(): void {
    // Example of how to update cards with real data
    // You would call your actual services here
    
    // Update System Status (example with simulated data)
    this.statusCards[0] = {
      ...this.statusCards[0],
      value: 'Healthy', // Could come from a system health service
      subtitle: `uptime ${(99 + Math.random()).toFixed(1)}%`,
      status: 'success' as const
    };

    // Update Pending Requests (example)
    this.statusCards[2] = {
      ...this.statusCards[2],
      value: Math.floor(Math.random() * 20), // Could come from a requests service
      subtitle: `${Math.floor(Math.random() * 5)} Awaiting Approval`
    };

    // Update API Health (example)
    this.statusCards[3] = {
      ...this.statusCards[3],
      value: 'Normal', // Could come from a health check service
      subtitle: 'All Systems Operational'
    };
  }

  goToProfile(): void {
    this.router.navigate(['/userprofile']);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        this.router.navigate(['/login']);
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}