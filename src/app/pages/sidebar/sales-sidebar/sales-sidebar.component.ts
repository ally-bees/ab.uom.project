// sidebar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sales-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-sidebar.component.html',
  styleUrls: ['./sales-sidebar.component.scss']
})
export class SMSidebarComponent {
  menuItems = [
    { id: 'reports', label: 'Reports And Analysis', icon: 'fa-chart-bar', expanded: true, children: [
      { id: 'sales', label: 'Sales', icon: 'fa-chart-line', route: 'salesmanager/sales' },
      { id: 'orders', label: 'Orders', icon: 'fa-shopping-cart', route: 'salesmanager/order' },
      { id: 'customer-insights', label: 'Customer Insights', icon: 'fa-users', route: 'salesmanager/customerinsight' },
      { id: 'expense-form', label: 'Expense Form', icon: 'fa-file-invoice-dollar', route: 'salesmanager/expense-form' }

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
    this.router.navigate(['salesmanager/salesdashboard']);
  }  

  scheduleReport(): void {
    // Logic for schedule report
    console.log('Schedule report clicked');
    this.router.navigate(['salesmanager/schedule']);
  }
  
  pendingRequest(): void {
    // Logic for pending request
    console.log('Pending request clicked');
    this.router.navigate(['/pending-requests']);
  }
  
  logout(): void {
    console.log('Logout clicked');
  
    //  Clear all stored auth/user data
    localStorage.clear();
    sessionStorage.clear();
  
    this.router.navigate(['/login']);
  }
}