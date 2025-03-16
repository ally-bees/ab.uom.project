import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-marketing-analytics-dashboard',
  templateUrl: './marketing-analytics-dashboard.component.html',
  styleUrls: ['./marketing-analytics-dashboard.component.css']
})
export class MarketingAnalyticsDashboardComponent implements OnInit {
  // Dashboard data
  availableToWithdraw = {
    amount: 1567.99,
    percentage: 8.8,
    weeklyChange: -4.2
  };

  todayRevenue = {
    amount: 2868.99,
    percentage: 1.2,
    orders: 145
  };

  todaySessions = {
    count: 156,
    percentage: 3.2,
    visitors: 53
  };

  subscribers = {
    count: 3422,
    percentage: 8.2,
    averageOrder: 16.4
  };

  deviceCategories = [
    { name: 'Mobile', percentage: 96.42 },
    { name: 'Desktop', percentage: 2.76 },
    { name: 'Tablet', percentage: 0.82 }
  ];

  topCountries = [
    { name: 'Switzerland', percentage: 9, flagCode: 'ch' },
    { name: 'United State', percentage: 48, flagCode: 'us' },
    { name: 'United Kingdom', percentage: 12, flagCode: 'gb' }
  ];

  campaignPerformance = [
    { name: 'Google Ads', impressions: '189k', clicks: '9k', cpc: 8.12, spend: 56123.12 },
    { name: 'Tik Tok', impressions: '287k', clicks: '15k', cpc: 12.12, spend: 140123.12 },
    { name: 'Instagram', impressions: '154k', clicks: '12k', cpc: 5.12, spend: 39123.12 }
  ];

  // Sales funnel chart data (simplified for this example)
  salesData = [
    { date: '1', value: 100 },
    { date: '5', value: 120 },
    { date: '10', value: 90 },
    { date: '15', value: 210 },
    { date: '20', value: 160 },
    { date: '25', value: 140 },
    { date: '30', value: 150 }
  ];

  constructor() { }

  ngOnInit(): void {
    // Initialize chart or fetch data from API if needed
  }

  printReport(): void {
    console.log('Printing report...');
    // Implement print functionality
  }
}
