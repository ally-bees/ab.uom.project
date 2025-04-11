// dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { BOSidebarComponent } from '../sidebar/BussinesOwnerSidebar/sidebar.component';
import { BusinessStatsCardComponent } from '../../components/Businessdash/BusinesStatsCard/statscard.component';
import { FinanceFlowComponent } from '../../components/Businessdash/financeflow/financeflow.component';
import { SalesInsightComponent } from '../../components/Businessdash/sales-insight/sales-insight.component';
import { RecentOrdersComponent } from '../../components/Businessdash/recent-orders/recent-orders.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, BOSidebarComponent, BusinessStatsCardComponent, FinanceFlowComponent, SalesInsightComponent, RecentOrdersComponent],
  templateUrl: './businessowner.component.html',
  styleUrls: ['./businessowner.component.scss']
})
export class BusinessDashComponent implements OnInit {
  // These properties will be populated from your API when ready
  customerStats = {
    count: 5896
  };
  
  incomeStats = {
    amount: 100098
  };
  
  productStats = {
    sold: 89878
  };
  
  constructor() { }

  ngOnInit(): void {
    // This is where you'll fetch data from your API when it's ready
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