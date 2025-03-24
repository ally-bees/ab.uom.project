// marketing-dashboard.component.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { ChartConfiguration } from 'chart.js';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../../footer/footer.component";
import { AnalyticssidebarComponent } from '../sidebar/analyticssidebar/analyticssidebar.component';


@Component({
  selector: 'app-marketing-analytics-dashboard',
  templateUrl: './marketing-analytics-dashboard.component.html',
  styleUrls: ['./marketing-analytics-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent,AnalyticssidebarComponent]
})
export class MarketingAnalyticsDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('salesFunnelChart') salesFunnelChart!: ElementRef;

  // Statistics
  revenue: number = 1567.99;
  revenueGrowth: number = 8.5;
  weekDate: string = 'Jul 14, 20';

  todayRevenue: number = 2868.99;
  todayRevenueChange: number = 5.59;
  todayOrders: number = 143;

  todaySessions: number = 156;
  todaySessionsChange: number = 3.12;
  todayVisitors: number = 524;

  subscribers: number = 3422;
  subscribersChange: number = 8.5;
  averageOrder: number = 36.18;

  // Device Category
  mobilePercentage: number = 96.42;
  desktopPercentage: number = 2.76;
  tabletPercentage: number = 0.82;

  // Campaign Performance
  campaigns = [
    {
      name: 'Google Ads',
      icon: 'G',
      color: '#34A853',
      impressions: '109k',
      clicks: '9',
      cpc: '10.12',
      spend: '566,033.12'
    },
    {
      name: 'Tik Tok',
      icon: 'T',
      color: '#00F2EA',
      impressions: '287k',
      clicks: '13',
      cpc: '12.12',
      spend: '845,123.12'
    },
    {
      name: 'Instagram',
      icon: 'I',
      color: '#C13584',
      impressions: '156k',
      clicks: '12',
      cpc: '11.12',
      spend: '378,121.12'
    }
  ];

  // Top Countries
  topCountries = [
    {
      name: 'Switzerland',
      code: 'CH',
      percentage: 40
    },
    {
      name: 'United States',
      code: 'US',
      percentage: 48
    },
    {
      name: 'United Kingdom',
      code: 'GB',
      percentage: 12
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initSalesFunnelChart();
  }

  initSalesFunnelChart(): void {
    const ctx = this.salesFunnelChart.nativeElement.getContext('2d');

    // Sample data - adjust according to your needs
    const data = {
      labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
               '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
      datasets: [{
        label: 'Sales',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 110, 120, 130, 145, 160, 180,
                210, 185, 195, 170, 155, 140, 150, 145, 160, 170, 180, 190, 185, 180, 175],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        tension: 0.4,
        borderWidth: 2,
        fill: true,
        pointBackgroundColor: '#FFFFFF',
        pointBorderColor: '#3B82F6',
        pointBorderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
      }]
    };

    const config: ChartConfiguration<'line', number[], string> = {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              display: true,
              maxTicksLimit: 10
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              display: false,
              color: '#E5E7EB',  // Use `color` for grid lines

            },
            ticks: {
              maxTicksLimit: 5
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            backgroundColor: '#FFFFFF',
            titleColor: '#1F2937',
            bodyColor: '#1F2937',
            borderColor: '#E5E7EB',
            borderWidth: 1,
            padding: 12,
            displayColors: false,
            callbacks: {
              label: function(context: any) {
                return `Sales: ${context.raw}`;
              }
            }
          }
        }
      }
    };


    new Chart(ctx, config);
  }

  printReport(): void {
    window.print();
  }
}
