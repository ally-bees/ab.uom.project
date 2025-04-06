// sidebar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuItems = [
    {
      id: 'reports', label: 'Reports And Analysis', icon: 'fa-chart-bar', expanded: true,
      children: [
        { id: 'sales', label: 'Sales', icon: 'fa-chart-line', route: '/salespage/sales-dashboard' },
        { id: 'orders', label: 'Orders', icon: 'fa-shopping-cart', route: '/salespage/order-summary' },
        { id: 'shipping', label: 'Shipping', icon: 'fa-truck', route: '/salespage/shipping-dashboard' },
        { id: 'products', label: 'Products', icon: 'fa-box', route: '/salespage/inventory' },
        { id: 'courier', label: 'Courier', icon: 'fa-shipping-fast', route: '/salespage/courier' },
        { id: 'finance', label: 'Finance', icon: 'fa-money-bill-wave', route: '/salespage/finance' },
        { id: 'customer-insights', label: 'Customer Insights', icon: 'fa-users', route: '/salespage/customer-insights' },
        { id: 'marketing-analytics', label: 'Marketing Analytics', icon: 'fa-bullhorn', route: '/salespage/analytics' }
      ]
    }
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




