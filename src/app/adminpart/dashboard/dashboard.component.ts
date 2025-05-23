import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusCardComponent } from '../status-card/status-card.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { SystemConfigComponent } from '../system-config/system-config.component';
import { AuditLogsComponent } from '../audit-logs/audit-logs.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StatusCardComponent,
    UserManagementComponent,
    SystemConfigComponent,
    AuditLogsComponent
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
      value: '1213',
      subtitle: '342 online',
      icon: 'users-icon'
    },
    {
      title: 'Pending Requests',
      value: '12',
      subtitle: 'Awaiting Approval',
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

  constructor() { }

  ngOnInit(): void {
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }
}