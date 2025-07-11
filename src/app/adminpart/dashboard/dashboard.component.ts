import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusCardComponent } from '../status-card/status-card.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { SystemConfigComponent } from '../system-config/system-config.component';
import { AuditLogsComponent } from '../audit-logs/audit-logs.component';
import { HeaderComponent } from '../../pages/header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { AdminsidebarComponent } from '../../pages/sidebar/adminsidebar/adminsidebar.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatusCardComponent,
    UserManagementComponent,
    SystemConfigComponent,
    AuditLogsComponent,
    HeaderComponent,
    AdminsidebarComponent,
    FooterComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  statusCards = [
    {
      title: 'System Status',
      value: 'Healthy',
      subtitle: 'uptime 99.2%',
      icon: 'heartbeat-icon'
    },
    {
      title: 'Active Users',
      value: 1000,
      subtitle: '3 online',
      icon: 'users-icon'
    },
    {
      title: 'Pending Requests',
      value: '12',
      subtitle: '1 Awaiting Approval',
      icon: 'clock-icon'
    },
    {
      title: 'API Health',
      value: 'Normal',
      subtitle: 'All Systems Operational',
      icon: 'database-icon'
    }
  ];

  activeTab = 'users'; // Default active tab

  currentUser: User | null = null;
  private userSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
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