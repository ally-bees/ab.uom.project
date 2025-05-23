
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-adminsidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './adminsidebar.component.html',
  styleUrls: ['./adminsidebar.component.css']
})
export class AdminsidebarComponent {
  menuItems = [
    { id: 'reports', label: 'Reports And Analysis', icon: 'fa-chart-bar', expanded: true, children: [
      { id: 'sales', label: 'Sales', icon: 'fa-chart-line' },
      // { id: 'orders', label: 'Orders', icon: 'fa-shopping-cart' },
      // { id: 'shipping', label: 'Shipping', icon: 'fa-truck' },
      // { id: 'products', label: 'Products', icon: 'fa-box' },
      // { id: 'courier', label: 'Courier', icon: 'fa-shipping-fast' },
      // { id: 'finance', label: 'Finance', icon: 'fa-money-bill-wave' },
      // { id: 'customer-insights', label: 'Customer Insights', icon: 'fa-users' },
      // { id: 'marketing-analytics', label: 'Marketing Analytics', icon: 'fa-bullhorn' }
    ]}
  ];
  
  activeMenuItem: string = 'reports';
  
  toggleExpand(menuItem: any): void {
    menuItem.expanded = !menuItem.expanded;
  }
  
  setActive(id: string): void {
    this.activeMenuItem = id;
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