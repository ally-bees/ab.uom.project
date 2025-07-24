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
import { MarketingDashboardService } from '../../services/marketing-dashboard.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-marketing-analytics-dashboard',
  templateUrl: './marketing-analytics-dashboard.component.html',
  styleUrls: ['./marketing-analytics-dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule,
             FormsModule]
})
export class MarketingAnalyticsDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('salesFunnelChart') salesFunnelChart!: ElementRef;

  // Statistics
  revenue: number = 0; // Will be filled with real data from the API
  revenueGrowth: number = 8.5; 
  weekDate: string = 'Jul 14, 20';
  currentDate: Date = new Date(); // Today's date for display

  todayRevenue: number = 0; // Will be filled with real data from the API
  todayRevenueAvailable: boolean = false; // Whether there are any sales today
  todayRevenueChange: number = 5.59;
  todayOrders: number = 143;

  todaySessions: number = 0;
  todayOrdersAvailable: boolean = false; // Whether there are any orders today
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
  campaignsAvailable: boolean = false;

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

  customerCount: number = 0;

  constructor(
    private salesService: SalesService,
    private courierService: CourierService,
    private orderService: OrdersService,
    private marketingCampaignService: MarketingCampaignService,
    private marketingService: MarketingDashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit - Starting initialization');
    
    // Set initial placeholder values
    this.revenue = 1;      // Temporary placeholder
    this.todayRevenue = 1; // Temporary placeholder
    
    // Check if user authentication is loaded
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      console.log('User already authenticated, loading data immediately');
      this.loadAllDashboardData();
    } else {
      console.log('Waiting for user authentication before loading data');
      // Subscribe to auth changes to ensure we have the user data before loading campaign data
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          console.log('User authenticated, loading data', user);
          this.loadAllDashboardData();
        }
      });
    }
  }
  
  loadAllDashboardData(): void {
    // Load all the data
    this.loadInitialData();
    this.loadChartData();
    this.loadCampaignData();

    // Get customer count for current company
    this.marketingService.getCustomerCount().subscribe({
      next: count => {
        this.customerCount = count;
        console.log('Customer count loaded for company:', count);
      },
      error: (err) => {
        console.error('Error fetching customer count:', err);
        this.customerCount = 0;
      }
    });
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
    // Get user details and company ID from auth service
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId;
    
    console.log('Current user from auth service:', currentUser);
    console.log('Company ID from auth service:', companyId);
    
    // If there's no company ID, try to reload the user info
    if (!companyId) {
      console.warn('No company ID available from auth service, checking local storage...');
    }
    
    // Load non-chart data - Total revenue using company ID filter
    this.salesService.getTotalSalesRevenue().subscribe({
      next: (data) => {
        this.revenue = data;
        console.log('Total revenue loaded for company:', data);
      },
      error: (error) => {
        console.error("Error fetching total sales revenue:", error);
        this.revenue = 0; // Fallback value
      }
    });

    // Today's revenue using company ID filter - EXACT today's sales only
    this.salesService.getTodaySalesRevenue().subscribe({
      next: (data) => {
        this.todayRevenue = data;
        this.todayRevenueAvailable = data > 0;
        console.log('Today revenue loaded for company:', data);
      },
      error: (error) => {
        console.error("Error fetching today's sales revenue:", error);
        this.todayRevenue = 0; // Fallback value
        this.todayRevenueAvailable = false;
      }
    });

    // Get current user's company ID from auth service
    const userCompanyId = this.authService.getCurrentUser()?.CompanyId || '';
    if (userCompanyId) {
      this.courierService.getTopCountries(userCompanyId).subscribe({
        next: (data) => {
          this.topCountries = data.map((item) => ({
            name: item.name,
            code: this.countryCodeMap[item.name] || 'UN',
            percentage: item.percentage,
          }));
          console.log('Top countries loaded:', this.topCountries);
        },
        error: (error) => {
          console.error("Error fetching top countries:", error);
          // Fallback data in case of error
          this.topCountries = [
            { name: 'Sri Lanka', code: 'LK', percentage: 45.3 },
            { name: 'United States', code: 'US', percentage: 28.7 },
            { name: 'Australia', code: 'AU', percentage: 15.9 }
          ];
        }
      });
    } else {
      console.error("No company ID available");
      // Use fallback data
      this.topCountries = [
        { name: 'Sri Lanka', code: 'LK', percentage: 45.3 },
        { name: 'United States', code: 'US', percentage: 28.7 },
        { name: 'Australia', code: 'AU', percentage: 15.9 }
      ];
    }

    // Get today's orders count for current company
    this.orderService.getTodayOrdersCount().subscribe({
      next: (data) => {
        this.todaySessions = data;
        this.todayOrdersAvailable = data > 0;
        console.log('Today orders count loaded for company:', data);
      },
      error: (error) => {
        console.error("Error fetching today's orders count:", error);
        this.todaySessions = 0;
        this.todayOrdersAvailable = false;
      }
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
    console.log('Starting to load campaign data');
    const currentUser = this.authService.getCurrentUser();
    console.log('Current user in component:', currentUser);
    
    // Get the current user's company ID
    const companyId = currentUser?.CompanyId;
    console.log('Using company ID for campaign data:', companyId);
    
    if (!companyId) {
      console.warn('No company ID available for user. Using sample data.');
      this.addSampleCampaignData();
      return;
    }
    
    this.marketingCampaignService.getCampaignPerformanceByCompanyId(companyId).subscribe({
      next: (campaigns: CampaignPerformance[]) => {
        console.log('Raw campaign data received for company ' + companyId + ':', campaigns);
        this.campaigns = campaigns;
        
        // Add default icon/color if not provided, preserve companyId
        this.campaigns = this.campaigns.map(campaign => ({
          ...campaign,
          icon: campaign.icon || campaign.name.charAt(0),
          color: campaign.color || this.getRandomColor(),
          companyId: campaign.companyId || companyId // Ensure companyId is preserved
        }));
        
        console.log('Campaign data processed:', this.campaigns);
        this.campaignsAvailable = this.campaigns.length > 0;
        
        // If no campaigns available, add a placeholder for better UI experience
        if (!this.campaignsAvailable) {
          console.log('No campaigns available for company ' + companyId + ', adding sample data');
          this.addSampleCampaignData();
        }
      },
      error: (error) => {
        console.error('Error loading campaign data:', error);
        this.campaignsAvailable = false;
        this.addSampleCampaignData(); // Add sample data on error
      }
    });
  }
  
  // Add sample campaign data when no data is available
  addSampleCampaignData(): void {
    // Get current user's company ID for the sample data
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId || 'SAMPLE_COMPANY';
    
    this.campaigns = [
      {
        name: 'TikTok Engagement',
        impressions: '287K',
        clicks: '13.0',
        cpc: '12.12',
        spend: '845,123.12',
        icon: 'T',
        color: '#ff0050',
        companyId: companyId
      },
      {
        name: 'Facebook Promotion',
        impressions: '156K',
        clicks: '8.2',
        cpc: '5.45',
        spend: '65,432.21',
        icon: 'F',
        color: '#1877f2',
        companyId: companyId
      },
      {
        name: 'Google Ads',
        impressions: '412K',
        clicks: '15.3',
        cpc: '7.89',
        spend: '120,876.43',
        icon: 'G',
        color: '#4285f4',
        companyId: companyId
      },
      {
        name: 'Instagram Stories',
        impressions: '198K',
        clicks: '11.0',
        cpc: '8.23',
        spend: '89,543.67',
        icon: 'I',
        color: '#E4405F',
        companyId: companyId
      },
      {
        name: 'LinkedIn B2B',
        impressions: '98K',
        clicks: '9.0',
        cpc: '15.67',
        spend: '156,789.34',
        icon: 'L',
        color: '#0077B5',
        companyId: companyId
      },
      {
        name: 'Twitter Promoted',
        impressions: '234K',
        clicks: '7.0',
        cpc: '6.78',
        spend: '42,156.89',
        icon: 'T',
        color: '#1DA1F2',
        companyId: companyId
      }
    ];
    this.campaignsAvailable = true;
    console.log('Sample campaign data added for company:', companyId, this.campaigns);
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
    console.log('Opening campaign modal, refreshing data...');
    
    // Get current user's company ID
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId;
    
    if (companyId) {
      console.log('Loading all campaigns for company:', companyId);
      
      // Fetch ALL campaigns for the current user's company (using the new method)
      this.marketingCampaignService.getAllCampaignsByCompanyId(companyId).subscribe({
        next: (campaigns: CampaignPerformance[]) => {
          console.log('All campaigns loaded for modal:', campaigns);
          
          // Update campaigns with proper icons, colors, and preserve companyId
          this.campaigns = campaigns.map(campaign => ({
            ...campaign,
            icon: campaign.icon || campaign.name.charAt(0),
            color: campaign.color || this.getRandomColor(),
            companyId: campaign.companyId || companyId // Ensure companyId is preserved
          }));
          
          this.campaignsAvailable = this.campaigns.length > 0;
          
          // If no campaigns available, add sample data
          if (!this.campaignsAvailable) {
            console.log('No campaigns found for company, adding sample data');
            this.addSampleCampaignData();
          }
          
          // Show the modal
          this.showAllCampaigns = true;
        },
        error: (error) => {
          console.error('Error loading campaigns for modal:', error);
          // Still show modal with existing data or sample data
          if (!this.campaignsAvailable) {
            this.addSampleCampaignData();
          }
          this.showAllCampaigns = true;
        }
      });
    } else {
      console.warn('No company ID available, showing existing campaigns');
      // If no company ID, just show existing data or sample data
      if (!this.campaignsAvailable) {
        this.addSampleCampaignData();
      }
      this.showAllCampaigns = true;
    }
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