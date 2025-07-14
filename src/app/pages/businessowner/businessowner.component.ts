// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { BusinessStatsCardComponent } from '../../components/Businessdash/BusinesStatsCard/statscard.component';
import { FinanceFlowComponent } from '../../components/Businessdash/financeflow/financeflow.component';
import { SalesInsightComponent } from '../../components/Businessdash/sales-insight/sales-insight.component';
import { RecentOrdersComponent } from '../../components/Businessdash/recent-orders/recent-orders.component';
import { HttpClient } from '@angular/common/http';
import { DashboardService } from '../../services/businessdash.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ BusinessStatsCardComponent, FinanceFlowComponent, SalesInsightComponent, RecentOrdersComponent ],
  templateUrl: './businessowner.component.html',
  styleUrls: ['./businessowner.component.scss']
})
export class BusinessDashComponent implements OnInit {
  customerStats = {
    count: 0
  };

  incomeStats = {
    amount: 0
  };

  productStats = {
    sold: 0
  };

  constructor(private dashboardService: DashboardService) {}

 // dashboard.component.ts

ngOnInit(): void {
  const companyId = localStorage.getItem('companyId') || '';

  this.dashboardService.getCustomerCount().subscribe({
    next: (count) => this.customerStats.count = count,
    error: (err) => console.error('Failed to load customer count', err)
  });

  this.dashboardService.getIncomeTotal().subscribe({
    next: (total) => this.incomeStats.amount = total,
    error: (err) => console.error('Failed to load income total', err)
  });

  this.dashboardService.getTotalProductsSold().subscribe({
    next: (sold) => this.productStats.sold = sold,
    error: (err) => console.error('Failed to load products sold', err)
  });
}

  scheduleReport(): void {
    console.log('Schedule report clicked');
  }

  pendingRequest(): void {
    console.log('Pending request clicked');
  }

  logout(): void {
    console.log('Logout clicked');
  }
}
