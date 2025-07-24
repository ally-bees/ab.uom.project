// sidebar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inventory-sidebar.component.html',
  styleUrls: ['./inventory-sidebar.component.scss']
})
export class inventorySidebarComponent {
  menuItems = [
    { id: 'reports', label: 'Reports And Analysis', icon: 'fa-chart-bar', expanded: true, children: [
      { id: 'inventory', label: 'inventory', icon: 'fa-chart-line', route: 'inventorymanager/inventory' },
      { id: 'orders', label: 'Orders', icon: 'fa-shopping-cart', route: 'inventorymanager/order' },
      { id: 'expense-form', label: 'Expense Form', icon: 'fa-file-invoice-dollar', route: 'inventorymanager/expense-form' }
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
    this.router.navigate(['schedule']);
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
  
    //  Optionally reset your user subject (if you use BehaviorSubject in AuthService)
    // this.authService.setCurrentUser(null); // Only if applicable
  
    //  Navigate to login page
    this.router.navigate(['/login']);
  }
}