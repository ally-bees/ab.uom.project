
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-couriersidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './couriersidebar.component.html',
  styleUrls: ['./couriersidebar.component.css']
})
export class CouriersidebarComponent {
  menuItems = [
    { id: 'reports', label: 'Reports And Analysis', icon: 'fa-chart-bar', expanded: true, children: [
      { id: 'sales', label: 'Sales', icon: 'fa-chart-line' },
      { id: 'orders', label: 'Orders', icon: 'fa-shopping-cart' },
      { id: 'products', label: 'Products', icon: 'fa-box' },
      { id: 'courier', label: 'Courier', icon: 'fa-shipping-fast' },
      { id: 'finance', label: 'Finance', icon: 'fa-money-bill-wave' },
      { id: 'customer-insights', label: 'Customer Insights', icon: 'fa-users' },
      { id: 'marketing-analytics', label: 'Marketing Analytics', icon: 'fa-bullhorn' }
    ]}
  ];

  activeMenuItem: string = 'reports';

  constructor(private router: Router) {}

  toggleExpand(menuItem: any): void {
    menuItem.expanded = !menuItem.expanded;
  }

  setActive(id: string): void {
    this.activeMenuItem = id;
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