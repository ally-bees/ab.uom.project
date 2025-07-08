// marketing-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../../footer/footer.component";
import { MarketingsidebarComponent } from "../sidebar/marketingsidebar/marketingsidebar.component";

interface DashboardData {
  campaigns: number;
  spentAmount: number;
  newVisitors: number;
  newCustomers: number;
}

@Component({
  selector: 'app-marketing-dashboard',
  standalone: true,
  imports: [CommonModule, FooterComponent, MarketingsidebarComponent, HeaderComponent],
  templateUrl: './marketing-dashboard.component.html',
  styleUrls: ['./marketing-dashboard.component.css']
})
export class MarketingDashboardComponent implements OnInit {
  dashboardData: DashboardData = {
    campaigns: 10,
    spentAmount: 100000,
    newVisitors: 6,
    newCustomers: 4
  };

  showValues = true;
  showPercentage = true;

  ngOnInit(): void {}

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