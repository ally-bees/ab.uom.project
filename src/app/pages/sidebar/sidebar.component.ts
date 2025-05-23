import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuItems = [
    { id: 'reports', label: 'Reports And Analysis', icon: 'fa-chart-bar', expanded: true, children: [
      { id: 'sales', label: 'Sales', icon: 'fa-chart-line', route: 'sales' },
      { id: 'orders', label: 'Orders', icon: 'fa-shopping-cart', route: 'order-summary' },
      { id: 'shipping', label: 'Shipping', icon: 'fa-truck', route: 'shipping' },
      { id: 'inventry', label: 'Inventry', icon: 'fa-box', route: 'inventory' },
      { id: 'courier', label: 'Courier', icon: 'fa-shipping-fast', route: '/reports/courier' },
      { id: 'finance', label: 'Finance', icon: 'fa-money-bill-wave', route: 'finance' },
      { id: 'customer-insights', label: 'Customer Insights', icon: 'fa-users', route: 'customerinsight' },
      { id: 'marketing-analytics', label: 'Marketing Analytics', icon: 'fa-bullhorn', route: 'analytics' }
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
    console.log('Schedule report clicked');
    this.router.navigate(['schedule']);
  }

  pendingRequest(): void {
    console.log('Pending request clicked');
    this.router.navigate(['/pending-requests']);
  }

  logout(): void {
    console.log('Logout clicked');
    this.router.navigate(['/login']);
  }
}
