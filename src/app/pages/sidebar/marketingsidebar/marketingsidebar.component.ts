
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-marketingsidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './marketingsidebar.component.html',
  styleUrls: ['./marketingsidebar.component.css']
})
export class MarketingsidebarComponent {
  menuItems = [
    { id: 'reports', label: 'Reports And Analysis', icon: 'fa-chart-bar', expanded: true, children: [
      { id: 'sales', label: 'Sales', icon: 'fa-chart-line' },
      { id: 'customer-insights', label: 'Customer Insights', icon: 'fa-users' },
      { id: 'marketing-analytics', label: 'Marketing Analytics', icon: 'fa-bullhorn' }
    ]}
  ];

  activeMenuItem: string = 'reports';
  
  constructor(private router: Router) {}
  
  toggleExpand(menuItem: any): void {
    menuItem.expanded = !menuItem.expanded;
  }
  
  setActive(id: string, route?: string): void {
    this.activeMenuItem = id;
    if (route) {
      this.router.navigate([route]);
    }
  }

  goToDashboard(): void {
    this.activeMenuItem = 'dashboard';
    this.router.navigate(['businessowner/businessownerdashboard']);
  }  
  
  scheduleReport(): void {
    // Logic for schedule report
    console.log('Schedule report clicked');
    this.router.navigate(['businessowner/schedule']);
  }
  
  pendingRequest(): void {
    // Logic for pending request
    console.log('Pending request clicked');
    this.router.navigate(['/pending-requests']);
  }
  
  logout(): void {
    // Logic for logout
    console.log('Logout clicked');
    // Implement logout logic here
    this.router.navigate(['/login']);
  }
}