// sidebar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule,Route } from '@angular/router'; // Import RouterModule

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuItems = [
      { id: 'reports', label: 'Reports And Analysis', icon: 'fa-chart-bar', expanded: true, 
      children: [
      { id: 'sales', label: 'Sales', icon: 'fa-chart-line' },
      { id: 'orders', label: 'Orders', icon: 'fa-shopping-cart' },
      { id: 'shipping', label: 'Shipping', icon: 'fa-truck' },
      { id: 'products', label: 'Products', icon: 'fa-box' },
      { id: 'courier', label: 'Courier', icon: 'fa-shipping-fast' },
      { id: 'finance', label: 'Finance', icon: 'fa-money-bill-wave' },
      { id: 'customer-insights', label: 'Customer Insights', icon: 'fa-users',route: '/auditpage/customerinsight' },
      { id: 'marketing-analytics', label: 'Marketing Analytics', icon: 'fa-bullhorn' }
    ]}
  ];
  
  activeMenuItem: string = 'reports';
  
  toggleExpand(menuItem: any): void {
    menuItem.expanded = !menuItem.expanded;
  }
  
  setActive(id: string, route?: string): void {
    this.activeMenuItem = id;
    if (route) {
      window.location.href = route; // Navigate to route
    }
  }
  
  scheduleReport(): void {
    // Logic for schedule report
    console.log('Schedule report clicked');
  }
  
  pendingRequest(): void {
    // Logic for pending request
    console.log('Pending request clicked');
  }
  
  logout(): void {
    // Logic for logout
    console.log('Logout clicked');
  }
}