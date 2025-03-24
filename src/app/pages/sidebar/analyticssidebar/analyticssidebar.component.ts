import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analyticssidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analyticssidebar.component.html',
  styleUrls: ['./analyticssidebar.component.css']
})
export class AnalyticssidebarComponent {
  menuItems = [
    { id: 'reports', label: 'Reports And Analysis', icon: 'fa-chart-bar', expanded: true, children: [
      { id: 'sales', label: 'Sales', icon: 'fa-chart-line' },
      { id: 'customer-insights', label: 'Customer Insights', icon: 'fa-users' },
      { id: 'marketing-analytics', label: 'Marketing Analytics', icon: 'fa-bullhorn' }
    ]}
  ];

  activeMenuItem: string = 'reports';

  toggleExpand(menuItem: any): void {
    menuItem.expanded = !menuItem.expanded;
  }

  setActive(id: string): void {
    this.activeMenuItem = id;
  }
  
  logout(): void {
    // Logic for logout
    console.log('Logout clicked');
  }
}
