// sidebar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-business-owner-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class BOSidebarComponent {
  menuItems = [
    { id: 'reports', label: 'Reports And Analysis', icon: 'fa-chart-bar', expanded: true, children: [
      { id: 'sales', label: 'Sales', icon: 'fa-chart-line', route: 'businessowner/sales' },
      { id: 'orders', label: 'Orders', icon: 'fa-shopping-cart', route: 'businessowner/order' },
      { id: 'shipping', label: 'Shipping', icon: 'fa-truck', route: 'businessowner/shipping' },
      { id: 'inventry', label: 'Inventry', icon: 'fa-box', route: 'businessowner/inventory' },
      { id: 'courier', label: 'Courier', icon: 'fa-shipping-fast', route: 'businessowner/reports/courier' },
      { id: 'finance', label: 'Finance', icon: 'fa-money-bill-wave', route: 'businessowner/finance' },
      { id: 'customer-insights', label: 'Customer Insights', icon: 'fa-users', route: 'businessowner/customerinsight' },
      { id: 'marketing-analytics', label: 'Marketing Analytics', icon: 'fa-bullhorn', route: 'businessowner/analytics' }
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
  
  scheduleReport(): void {
    // Logic for schedule report
    console.log('Schedule report clicked');
    this.router.navigate(['bussinessowner/schedule']);
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