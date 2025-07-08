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
  showValues = true;
  showPercentage = true;

  constructor(private marketingService: MarketingDashboardService) {}

  ngOnInit(): void {
    this.marketingService.getDashboardData().subscribe(data => {
      this.dashboardData = data;
    });
  }

  toggleValues() {
    this.showValues = !this.showValues;
  }

  togglePercentage() {
    this.showPercentage = !this.showPercentage;
  }

  getCircumference(): number {
    const r = 40;
    return 2 * Math.PI * r;
  }
}