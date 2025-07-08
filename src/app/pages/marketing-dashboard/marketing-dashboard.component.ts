// marketing-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../../footer/footer.component";
import { MarketingsidebarComponent } from "../sidebar/marketingsidebar/marketingsidebar.component";
import { MarketingDashboardService, DashboardData } from '../../services/marketing-dashboard.service';

@Component({
  selector: 'app-marketing-dashboard',
  standalone: true,
  imports: [CommonModule, FooterComponent, MarketingsidebarComponent, HeaderComponent],
  templateUrl: './marketing-dashboard.component.html',
  styleUrls: ['./marketing-dashboard.component.css']
})
export class MarketingDashboardComponent implements OnInit {
  dashboardData: DashboardData | null = null;
  showMode: 'value' | 'percentage' = 'percentage';

  constructor(private marketingService: MarketingDashboardService) {}

  ngOnInit(): void {
    this.marketingService.getDashboardData().subscribe(data => {
      this.dashboardData = data;
    });
  }

  setShowMode(mode: 'value' | 'percentage') {
    this.showMode = mode;
  }

  getPieValue(key: 'totalOrder' | 'customerGrowth' | 'totalRevenue') {
    return this.dashboardData?.pie[key];
  }

  getPiePercent(key: 'orderPercent' | 'growthPercent' | 'revenuePercent') {
    return this.dashboardData?.pie[key];
  }

  getCircumference(): number {
    const r = 40;
    return 2 * Math.PI * r;
  }
}