import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-testbusiness-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="business-dashboard">
      <!-- Header with navigation -->
      <div class="dashboard-header">
        <div class="header-content">
          <h1>Business Owner Dashboard</h1>
          <p *ngIf="currentUser">Welcome, {{ currentUser.username }}!</p>
        </div>
        <div class="header-actions">
          <button class="profile-btn" (click)="goToProfile()">
            <i class="fas fa-user"></i> User Profile
          </button>
          <button class="logout-btn" (click)="logout()">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>

      <!-- User Info Card -->
      <div class="user-info-card" *ngIf="currentUser">
        <div class="user-details">
          <div class="user-avatar">
            <i class="fas fa-crown"></i>
          </div>
          <div class="user-info">
            <h3>{{ currentUser.username }}</h3>
            <p class="role">{{ currentUser.role }}</p>
            <p class="email">{{ currentUser.email }}</p>
            <p class="honeycomb">ID: {{ currentUser.honeycombId }}</p>
          </div>
          <div class="profile-action">
            <button class="edit-profile-btn" (click)="goToProfile()">
              <i class="fas fa-edit"></i> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <!-- Dashboard Content -->
      <div class="dashboard-content">
        <div class="quick-stats">
          <div class="stat-card">
            <h3>Total Revenue</h3>
            <p class="stat-number">$345,670</p>
          </div>
          <div class="stat-card">
            <h3>Active Employees</h3>
            <p class="stat-number">156</p>
          </div>
          <div class="stat-card">
            <h3>Business Units</h3>
            <p class="stat-number">8</p>
          </div>
        </div>

        <div class="dashboard-actions">
          <button class="action-btn" (click)="navigateTo('analytics')">
            <i class="fas fa-chart-bar"></i> Business Analytics
          </button>
          <button class="action-btn" (click)="navigateTo('finance')">
            <i class="fas fa-dollar-sign"></i> Financial Overview
          </button>
          <button class="action-btn" (click)="navigateTo('team')">
            <i class="fas fa-users"></i> Manage Team
          </button>
          <button class="action-btn" (click)="navigateTo('strategy')">
            <i class="fas fa-chess"></i> Strategic Planning
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .business-dashboard {
      padding: 20px;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      padding: 20px 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }

    .header-content h1 {
      margin: 0;
      color: #333;
      font-size: 1.8em;
    }

    .header-content p {
      margin: 5px 0 0 0;
      color: #666;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    .profile-btn, .logout-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: all 0.3s;
    }

    .profile-btn {
      background: #ffc107;
      color: #333;
    }

    .profile-btn:hover {
      background: #e0a800;
      transform: translateY(-1px);
    }

    .logout-btn {
      background: #dc3545;
      color: white;
    }

    .logout-btn:hover {
      background: #c82333;
    }

    .user-info-card {
      background: white;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .user-details {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .user-avatar i {
      font-size: 60px;
      color: #ffc107;
    }

    .user-info h3 {
      margin: 0;
      color: #333;
      font-size: 1.4em;
    }

    .user-info .role {
      color: #ffc107;
      font-weight: bold;
      margin: 5px 0;
    }

    .user-info .email, .user-info .honeycomb {
      color: #666;
      margin: 3px 0;
      font-size: 0.9em;
    }

    .edit-profile-btn {
      padding: 8px 16px;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: background 0.3s;
    }

    .edit-profile-btn:hover {
      background: #218838;
    }

    .dashboard-content {
      background: white;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .quick-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .stat-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      border-left: 4px solid #ffc107;
    }

    .stat-number {
      font-size: 2em;
      font-weight: bold;
      color: #ffc107;
      margin: 10px 0;
    }

    .dashboard-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 15px;
    }

    .action-btn {
      padding: 15px 20px;
      background: #ffc107;
      color: #333;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 500;
      transition: all 0.3s;
    }

    .action-btn:hover {
      background: #e0a800;
      transform: translateY(-2px);
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
      }

      .user-details {
        flex-direction: column;
        text-align: center;
      }

      .dashboard-actions {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TestbusinessDashboardComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private userSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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

  navigateTo(route: string): void {
    this.router.navigate([`/testbusinessowner/${route}`]);
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
}