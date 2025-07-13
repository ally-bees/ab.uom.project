// marketing-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../../footer/footer.component";
import { MarketingsidebarComponent } from "../sidebar/marketingsidebar/marketingsidebar.component";
import { MarketingDashboardService, DashboardData, Campaign } from '../../services/marketing-dashboard.service';

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

  campaignCount: number = 0;
  spentAmount: number = 0;
  newVisitors: number = 0;
  newCustomers: number = 0;

  campaigns: Campaign[] = [];
  showCampaignTable = false;
  showSpentAmountTable = false;

  constructor(private marketingService: MarketingDashboardService) {}

  ngOnInit(): void {
    this.marketingService.getDashboardData().subscribe(data => {
      this.dashboardData = data;
    });

    this.marketingService.getCampaignCount().subscribe(data => {
      this.campaignCount = data;
    });

    this.marketingService.getSpentAmount().subscribe(data => {
      this.spentAmount = parseFloat(data.toFixed(2));
    });

    this.marketingService.getNewVisitors().subscribe(data => {
      this.newVisitors = data;
    });

    this.marketingService.getNewCustomers().subscribe(data => {
      this.newCustomers = data;
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

  showCampaignDetails(): void {
    this.showCampaignTable = true;
    this.marketingService.getCampaigns().subscribe(data => {
      this.campaigns = data;
    });
  }

  closeCampaignModal(event: MouseEvent): void {
    // Close only if clicking the overlay background, not the modal content
    if ((event.target as HTMLElement).className === 'modal-overlay') {
      this.showCampaignTable = false;
    }
  }

  showSpentAmountDetails(): void {
    this.showSpentAmountTable = true;
    this.marketingService.getCampaigns().subscribe(data => {
      this.campaigns = data;
    });
  }

  closeSpentModal(event: MouseEvent): void {
    if ((event.target as HTMLElement).className === 'modal-overlay') {
      this.showSpentAmountTable = false;
    }
  }

  getTotalSpentAmount(): number {
    if (!this.campaigns || this.campaigns.length === 0) {
      return 0;
    }
    return this.campaigns.reduce((sum, campaign) => sum + campaign.spentAmount, 0);
  }
}