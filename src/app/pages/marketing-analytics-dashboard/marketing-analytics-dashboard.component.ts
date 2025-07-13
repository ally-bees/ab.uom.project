// marketing-analytics-dashboard.component.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { ChartConfiguration } from 'chart.js';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../../footer/footer.component";
import { AnalyticssidebarComponent } from '../sidebar/analyticssidebar/analyticssidebar.component';
import { SalesService } from '../../services/sales.service';
import { CourierService } from '../../services/courier.service';
import { OrdersService } from '../../services/orders.service';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Inject } from '@angular/core';
import { MarketingCampaignService, CampaignPerformance } from '../../services/campaign.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-marketing-analytics-dashboard',
  templateUrl: './marketing-analytics-dashboard.component.html',
  styleUrls: ['./marketing-analytics-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, HeaderComponent, FooterComponent, 
            AnalyticssidebarComponent, FormsModule]
})
export class MarketingAnalyticsDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('salesFunnelChart') salesFunnelChart!: ElementRef;

  // Statistics
  revenue: number = 0;
  revenueGrowth: number = 8.5;
  weekDate: string = 'Jul 14, 20';

  todayRevenue: number = 2868.99;
  todayRevenueChange: number = 5.59;
  todayOrders: number = 143;

  todaySessions: number = 120;
  todaySessionsChange: number = 3.12;
  todayVisitors: number = 524;

  subscribers: number = 3422;
  subscribersChange: number = 8.5;
  averageOrder: number = 36.18;

  // Dropdown: "month" or "year"
  selectedPeriod: string = 'month';

  // Monthly and Yearly Sales Data - Default fallback data
  monthlyData: number[] = [
    30, 40, 35, 50, 49, 60, 70, 91, 125, 110,
    120, 130, 145, 160, 180, 210, 185, 195, 170, 155,
    140, 150, 145, 160, 170, 180, 190, 185, 180, 175
  ];

  yearlyData: number[] = [
    500, 600, 750, 800, 850, 900, 950, 1000, 980, 940, 910, 1050
  ];

  private funnelChart: Chart | undefined;
  private isViewInitialized = false;
  private dataLoaded = false;

  mobilePercentage: number = 96.42;
  desktopPercentage: number = 2.76;
  tabletPercentage: number = 0.82;

  campaigns: CampaignPerformance[] = [];

  topCountries = [
    { name: '', code: '', percentage: 0 },
    { name: '', code: '', percentage: 0 },
    { name: '', code: '', percentage: 0 }
  ];

  countryCodeMap: { [key: string]: string } = {
    'Sri Lanka': 'LK',
    'Australia': 'AU',
    'United States': 'US',
    'United Kingdom': 'GB',
    'Switzerland': 'CH',
    'Canada': 'CA'
  };

  // Add this property for the modal
  showAllCampaigns = false;

  constructor(
    private salesService: SalesService,
    private courierService: CourierService,
    private orderService: OrdersService,
    private marketingCampaignService: MarketingCampaignService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.loadChartData();
    this.loadCampaignData(); // Add this
  }

  ngAfterViewInit(): void {
    this.isViewInitialized = true;
    console.log('View initialized, canvas element:', this.salesFunnelChart?.nativeElement);
    
    // Initialize chart with default data first, then update when API data arrives
    this.initSalesFunnelChart();
    
    // If data is already loaded, update the chart
    if (this.dataLoaded) {
      setTimeout(() => this.initSalesFunnelChart(), 100);
    }
  }

  private loadInitialData(): void {
    // Load non-chart data
    this.salesService.getTotalSalesRevenue().subscribe({
      next: (data) => {
        this.revenue = data;
        console.log('Total revenue loaded:', data);
      },
      error: (error) => console.error("Error fetching total sales revenue:", error)
    });

    this.salesService.getTodaySalesRevenue().subscribe({
      next: (data) => {
        this.todayRevenue = data;
        console.log('Today revenue loaded:', data);
      },
      error: (error) => console.error("Error fetching today's sales revenue:", error)
    });

    this.courierService.getTopCountries().subscribe({
      next: (data) => {
        this.topCountries = data.map((item) => ({
          name: item.name,
          code: this.countryCodeMap[item.name] || 'UN',
          percentage: item.percentage,
        }));
        console.log('Top countries loaded:', this.topCountries);
      },
      error: (error) => console.error("Error fetching top countries:", error)
    });

    this.orderService.getTodayOrdersCount().subscribe({
      next: (data) => {
        this.todaySessions = data;
        console.log('Today sessions loaded:', data);
      },
      error: (error) => console.error("Error fetching today's orders count:", error)
    });
  }

  private loadChartData(): void {
    // Load chart data using forkJoin to ensure both datasets are loaded
    forkJoin({
      monthlyData: this.salesService.getMonthlySalesData(),
      yearlyData: this.salesService.getYearlySalesData()
    }).subscribe({
      next: (results) => {
        console.log('Raw API responses:', results);
        
        // Process monthly data
        if (results.monthlyData && Array.isArray(results.monthlyData)) {
          this.monthlyData = results.monthlyData
            .map((item: any) => {
              // Handle different API response formats
              if (typeof item === 'number') return item;
              if (item.sales) return Number(item.sales);
              if (item.value) return Number(item.value);
              if (item.amount) return Number(item.amount);
              return 0;
            })
            .slice(0, 30);
          
          console.log('Processed monthly data:', this.monthlyData);
        }

        // Process yearly data
        if (results.yearlyData && Array.isArray(results.yearlyData)) {
          this.yearlyData = results.yearlyData
            .map((item: any) => {
              // Handle different API response formats
              if (typeof item === 'number') return item;
              if (item.sales) return Number(item.sales);
              if (item.value) return Number(item.value);
              if (item.amount) return Number(item.amount);
              return 0;
            });
          
          console.log('Processed yearly data:', this.yearlyData);
        }

        this.dataLoaded = true;
        
        // Update chart if view is initialized
        if (this.isViewInitialized) {
          this.initSalesFunnelChart();
        }
      },
      error: (error) => {
        console.error('Error loading chart data:', error);
        this.dataLoaded = true; // Use default data
        
        if (this.isViewInitialized) {
          this.initSalesFunnelChart();
        }
      }
    });
  }

  // Add this method
  loadCampaignData(): void {
    this.marketingCampaignService.getCampaignPerformance().subscribe((campaigns: CampaignPerformance[]) => {
      this.campaigns = campaigns;
      
      // Add default icon/color if not provided
      this.campaigns = this.campaigns.map(campaign => ({
        ...campaign,
        icon: campaign.icon || campaign.name.charAt(0),
        color: campaign.color || this.getRandomColor()
      }));
      
      console.log('Campaign data loaded:', this.campaigns);
    });
  }

  initSalesFunnelChart(): void {
    // Ensure canvas element exists
    if (!this.salesFunnelChart?.nativeElement) {
      console.error('Canvas element not found');
      return;
    }

    const ctx = this.salesFunnelChart.nativeElement.getContext('2d');
    if (!ctx) {
      console.error('Cannot get canvas context');
      return;
    }

    // Prepare labels and data
    const labels = this.selectedPeriod === 'month'
      ? Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const chartData = this.selectedPeriod === 'month' ? this.monthlyData : this.yearlyData;
    
    console.log('Chart initialization details:', {
      selectedPeriod: this.selectedPeriod,
      chartData: chartData,
      labels: labels,
      dataLoaded: this.dataLoaded
    });

    // Validate data
    if (!chartData || chartData.length === 0) {
      console.error('No chart data available');
      return;
    }

    // Ensure all data points are valid numbers
    const validData = chartData.map(item => {
      const num = Number(item);
      return isNaN(num) ? 0 : num;
    });

    // Destroy existing chart
    if (this.funnelChart) {
      this.funnelChart.destroy();
    }

    // Create new chart
    try {
      this.funnelChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: 'Sales',
            data: validData,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            tension: 0.4,
            borderWidth: 2,
            fill: true,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#3B82F6',
            pointBorderWidth: 2,
            pointRadius: 3,
            pointHoverRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { 
              display: false 
            },
            tooltip: {
              callbacks: {
                label: function (context: any) {
                  return `Sales: ${context.raw.toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            x: { 
              grid: { display: false },
              ticks: {
                maxTicksLimit: 10
              }
            },
            y: { 
              beginAtZero: true, 
              grid: { display: false },
              ticks: {
                callback: function(value: any) {
                  return value.toLocaleString();
                }
              }
            }
          },
          interaction: {
            intersect: false,
            mode: 'index'
          }
        }
      });
      
      console.log('Chart created successfully');
    } catch (error) {
      console.error('Error creating chart:', error);
    }
  }

  onPeriodChange(): void {
    console.log('Period changed to:', this.selectedPeriod);
    this.initSalesFunnelChart();
  }

  printReport(): void {
    window.print();
  }

  // Add "See All" functionality
  showAllCampaignsModal(): void {
    this.showAllCampaigns = true;
  }
  
  closeAllCampaignsModal(event: MouseEvent): void {
    if ((event.target as HTMLElement).className === 'modal-overlay') {
      this.showAllCampaigns = false;
    }
  }

  // Helper method for random colors
  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Debug method - you can call this from the template to test
  debugChart(): void {
    console.log('Debug Chart Data:', {
      monthlyData: this.monthlyData,
      yearlyData: this.yearlyData,
      selectedPeriod: this.selectedPeriod,
      dataLoaded: this.dataLoaded,
      isViewInitialized: this.isViewInitialized,
      canvasElement: this.salesFunnelChart?.nativeElement
    });
  }

  getCountryCode(countryCode: string): string {
    // Return the lowercase country code if it exists, otherwise return 'unknown'
    return countryCode?.toLowerCase() || 'unknown';
  }
}