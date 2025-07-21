import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // Adjust the path if needed

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './customer-insight.component.html',
  styleUrl: './customer-insight.component.css'
})
export class customerinsightComponent implements OnInit {
  basePath: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const role = this.authService.getCurrentUserRole();

    if (role === 'Sales Manager') {
      this.basePath = '/salesmanager/customerinsight';
    } else if (role === 'Business Owner') {
      this.basePath = '/businessowner/customerinsight';
    } else {
      this.basePath = '/unknown-role'; // Optional: handle unexpected roles
    }
  }
}
