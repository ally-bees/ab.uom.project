import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';
import { TopSellingComponent } from '../../components/top-selling/top-selling.component';
import { SalesHeatmapComponent } from '../../components/sales-heatmap/sales-heatmap.component';
import { SalesService } from '../../services/sales.service';
import { SalesViewModel } from '../../models/sale.model';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { AuthService } from '../../services/auth.service';
import { SalesAccessService } from '../../services/sales-access.service';


@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    StatsCardComponent,
    TopSellingComponent,
    SalesHeatmapComponent,
    NgChartsModule
  ],
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.css']
})

export class SalesDashboardComponent implements OnInit {
  dashboardData: SalesViewModel | null = null;
  companySalesData: { companyId: string, totalSales: number }[] = [];
  companySalesChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  companySalesChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Company Sales Comparison (For Selected Month)' }
    },
    scales: { x: {}, y: { beginAtZero: true } }
  };
  selectedMonth: string = '';
  startDate: string = '';
  endDate: string = '';
  userSalesAccessValue: number | null = null;
  userCompanyId: string | null = null;
  showAccessInfo = false;

  constructor(
    private salesService: SalesService,
    private authService: AuthService,
    private salesAccessService: SalesAccessService
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    this.endDate = today.toISOString().split('T')[0];
    this.startDate = thirtyDaysAgo.toISOString().split('T')[0];
    const now = new Date();
    this.selectedMonth = now.toISOString().slice(0, 7); // YYYY-MM
    this.userCompanyId = this.authService.getCurrentUser()?.CompanyId || null;
    if (this.userCompanyId) {
      this.salesAccessService.getByCompanyId(this.userCompanyId).subscribe(access => {
        this.userSalesAccessValue = access.salesAccessValue;
      });
    }
    this.loadCompanySalesComparison();
  }

  onDateChange(): void {
    // This will trigger the input bindings to stats-card and other components if needed
  }

  onMonthChange(): void {
    this.loadCompanySalesComparison();
  }

  loadCompanySalesComparison(): void {
    const userCompanyId = this.authService.getCurrentUser()?.CompanyId;
    this.salesService.getCompanySalesComparison(this.selectedMonth).subscribe(data => {
      this.companySalesData = data;
      this.companySalesChartData = {
        labels: data.map(d => d.companyId === userCompanyId ? 'Your Company' : d.companyId),
        datasets: [{
          label: 'Total Sales',
          data: data.map(d => d.totalSales),
          backgroundColor: data.map(d => d.companyId === userCompanyId ? '#ff7043' : '#42a5f5')
        }]
      };
    });
  }

  toggleSalesAccess(): void {
    if (!this.userCompanyId || this.userSalesAccessValue === null) return;
    const newValue = this.userSalesAccessValue === 1 ? 0 : 1;
    this.salesAccessService.patchSalesAccessValue(this.userCompanyId, newValue).subscribe(() => {
      this.userSalesAccessValue = newValue;
      this.loadCompanySalesComparison(); // Refresh the bar graph
    });
  }
}
