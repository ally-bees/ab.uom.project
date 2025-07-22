import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service'; // Adjust path as needed


@Component({
  selector: 'app-customersupport',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './customersupport.component.html',
  styleUrl: './customersupport.component.css'
})
export class CustomersupportComponent implements OnInit {
  basePath: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const role = this.authService.getCurrentUserRole();

    const routeMap: { [key: string]: string } = {
      'Sales Manager': '/salesmanager/customersupport',
      'Inventory Manager': '/testinventorymanager/customersupport',
      'Marketing Manager': '/testmarketingmanager/customersupport',
      'Business Owner': '/businessowner/customersupport'
    };

    this.basePath = routeMap[role ?? ''] || '/unauthorized';
  }
}

