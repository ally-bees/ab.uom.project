import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
      { id: 'sales', label: 'Sales', icon: 'fa-chart-line',route: 'courier/' },
      { id: 'orders', label: 'Orders', icon: 'fa-shopping-cart',route: 'courier/'},
      { id: 'products', label: 'Products', icon: 'fa-box', route: 'courier/' },
      { id: 'courier', label: 'Courier', icon: 'fa-shipping-fast' ,route: 'courier/'},
      { id: 'finance', label: 'Finance', icon: 'fa-money-bill-wave' ,route: 'courier/'},
      { id: 'customer-insights', label: 'Customer Insights', icon: 'fa-users', route: 'courier/customerinsight' },
      { id: 'marketing-analytics', label: 'Marketing Analytics', icon: 'fa-bullhorn', route: 'courier/' },
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
    this.router.navigate(['courier/schedule']);
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
