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
import { Router } from '@angular/router';
import { PrintReportService } from '../../services/printreport.service';
import { DeviceService, DeviceCategorySummary } from '../../services/device.service';

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
  revenueGrowth: number = 0; // Percentage change from last month
  revenueGrowthAvailable: boolean = false; // Whether growth data is available
  isRevenueIncreasing: boolean = true; // Whether revenue is increasing or decreasing
  isRevenueZero: boolean = false; // Whether revenue growth is exactly zero
  weekDate: string = 'Jul 14, 20';
  currentDate: Date = new Date(); // Today's date for display

  todayRevenue: number = 0; // Will be filled with real data from the API
  todayRevenueAvailable: boolean = false; // Whether there are any sales today
  todayRevenueChange: number = 5.59;
  todayRevenueGrowth: number = 0; // Percentage change from yesterday
  todayRevenueGrowthAvailable: boolean = false; // Whether growth data is available
  isTodayRevenueIncreasing: boolean = true; // Whether today revenue is increasing or decreasing
  isTodayRevenueZero: boolean = false; // Whether today revenue growth is exactly zero

  todayOrders: number = 143;
  todayOrdersGrowth: number = 0; // Percentage change from yesterday
  todayOrdersGrowthAvailable: boolean = false; // Whether growth data is available
  isTodayOrdersIncreasing: boolean = true; // Whether today orders is increasing or decreasing
  isTodayOrdersZero: boolean = false; // Whether today orders growth is exactly zero

  totalCustomers: number = 0; // Total customers count
  totalCustomersGrowth: number = 0; // Percentage change from last month
  totalCustomersGrowthAvailable: boolean = false; // Whether growth data is available
  isTotalCustomersIncreasing: boolean = true; // Whether total customers is increasing or decreasing
  isTotalCustomersZero: boolean = false; // Whether total customers growth is exactly zero

  averageOrderAmount: number = 0; // Average order amount

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

  // Chart data and labels for dynamic periods
  chartData: number[] = [];
  chartLabels: string[] = [];

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
    'Sri Lanka': 'lk',
    'Australia': 'au',
    'United States': 'us',
    'United Kingdom': 'gb',
    'Switzerland': 'ch',
    'Canada': 'ca',
    'India': 'in',
    'Japan': 'jp',
    'Germany': 'de',
    'France': 'fr',
    'China': 'cn',
    'Brazil': 'br',
    'Italy': 'it',
    'Spain': 'es',
    'Netherlands': 'nl',
    'Singapore': 'sg',
    'Thailand': 'th',
    'Malaysia': 'my',
    'Indonesia': 'id',
    'Philippines': 'ph',
    'Vietnam': 'vn',
    'South Korea': 'kr',
    'New Zealand': 'nz',
    'South Africa': 'za',
    'UAE': 'ae',
    'Saudi Arabia': 'sa',
    'Israel': 'il',
    'Russia': 'ru',
    'Mexico': 'mx',
    'Argentina': 'ar',
    'Chile': 'cl',
    'Colombia': 'co',
    'Peru': 'pe',
    'Egypt': 'eg',
    'Nigeria': 'ng',
    'Kenya': 'ke',
    'Ghana': 'gh',
    'Morocco': 'ma',
    'Turkey': 'tr',
    'Greece': 'gr',
    'Portugal': 'pt',
    'Poland': 'pl',
    'Czech Republic': 'cz',
    'Hungary': 'hu',
    'Austria': 'at',
    'Belgium': 'be',
    'Denmark': 'dk',
    'Finland': 'fi',
    'Norway': 'no',
    'Sweden': 'se',
    'Ireland': 'ie'
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
    private authService: AuthService,
    private router: Router,
    private printReportService: PrintReportService,
    private deviceService: DeviceService
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
    this.loadDeviceCategoryData();

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
        
        // Load last month's revenue for comparison
        this.loadRevenueGrowth(companyId);
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
        
        // Load today revenue growth vs yesterday
        this.loadTodayRevenueGrowth();
        
        // If no revenue for today and we have a company ID, create test data
        if (data === 0 && companyId) {
          console.log('No sales found for today, creating test sales data for company:', companyId);
          this.salesService.createTodayTestData(companyId).subscribe({
            next: () => {
              console.log('Test sales data created for today, reloading revenue...');
              // Reload today's revenue after creating test data
              this.loadTodayRevenue();
            },
            error: (error) => {
              console.error('Error creating today test sales data:', error);
            }
          });
        }
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
          if (data && data.length > 0) {
            this.topCountries = data.map((item) => ({
              name: item.name,
              code: this.getCountryCode(item.name),
              percentage: item.percentage,
            }));
            console.log('Top countries loaded:', this.topCountries);
          } else {
            console.log('No courier data found, creating test data for company:', userCompanyId);
            // Create test data and then reload countries
            this.courierService.createTestData(userCompanyId).subscribe({
              next: () => {
                console.log('Test courier data created, reloading countries...');
                // Reload top countries after creating test data
                this.loadTopCountries(userCompanyId);
              },
              error: (error) => {
                console.error('Error creating test courier data:', error);
                this.setFallbackCountryData();
              }
            });
          }
        },
        error: (error) => {
          console.error("Error fetching top countries:", error);
          this.setFallbackCountryData();
        }
      });
    } else {
      console.error("No company ID available");
      this.setFallbackCountryData();
    }

    // Get today's orders count for current company
    this.orderService.getTodayOrdersCount().subscribe({
      next: (data) => {
        this.todaySessions = data;
        this.todayOrders = data; // Also update todayOrders for growth calculation
        this.todayOrdersAvailable = data > 0;
        console.log('Today orders count loaded for company:', data);
        
        // Load today orders growth vs yesterday
        this.loadTodayOrdersGrowth();
      },
      error: (error) => {
        console.error("Error fetching today's orders count:", error);
        this.todaySessions = 0;
        this.todayOrders = 0;
        this.todayOrdersAvailable = false;
      }
    });

    // Load customer count growth (total customers vs last month)
    this.loadCustomerCountGrowth();

    // Load average order amount
    this.loadAverageOrderAmount();
  }

  private loadChartData(): void {
    // Get current user's company ID
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId;
    
    console.log('Loading chart data for period:', this.selectedPeriod, 'and company:', companyId);
    
    // Load sales data based on selected period and company ID
    this.salesService.getSalesDataByPeriod(this.selectedPeriod, companyId).subscribe({
      next: (data) => {
        console.log('Raw period data received:', data);
        
        if (data && Array.isArray(data)) {
          // Check if we have meaningful data (not all zeros)
          const hasRealData = data.some(item => item.value > 0);
          
          if (hasRealData) {
            // Process the data
            this.processPeriodData(data);
            
            this.dataLoaded = true;
            
            // Update chart if view is initialized
            if (this.isViewInitialized) {
              this.initSalesFunnelChart();
            }
          } else if (companyId) {
            // No real data found, create historical test data
            console.log('No sales data found for period, creating historical test data for company:', companyId);
            this.salesService.createHistoricalTestData(companyId).subscribe({
              next: () => {
                console.log('Historical test data created, reloading chart data...');
                // Reload chart data after creating historical data
                this.loadChartData();
              },
              error: (error) => {
                console.error('Error creating historical test data:', error);
                this.setFallbackChartData();
                this.dataLoaded = true;
                if (this.isViewInitialized) {
                  this.initSalesFunnelChart();
                }
              }
            });
          } else {
            // No company ID, use fallback data
            this.setFallbackChartData();
            this.dataLoaded = true;
            if (this.isViewInitialized) {
              this.initSalesFunnelChart();
            }
          }
        }
      },
      error: (error) => {
        console.error('Error loading period chart data:', error);
        
        // Use fallback data if API fails
        this.setFallbackChartData();
        this.dataLoaded = true;
        
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

    // Use dynamic chart data and labels if available, otherwise use fallback
    let labels: string[];
    let chartData: number[];

    if (this.chartLabels.length > 0 && this.chartData.length > 0) {
      labels = this.chartLabels;
      chartData = this.chartData;
    } else {
      // Fallback data based on selected period
      this.setFallbackChartData();
      labels = this.chartLabels;
      chartData = this.chartData;
    }
    
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
            label: 'Sales Revenue',
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
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#FFFFFF',
              bodyColor: '#FFFFFF',
              borderColor: '#3B82F6',
              borderWidth: 1,
              callbacks: {
                label: function(context) {
                  return `Sales: $${context.parsed.y.toLocaleString()}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                display: false
              },
              ticks: {
                color: '#6B7280',
                font: {
                  size: 12
                },
                maxRotation: 45,
                minRotation: 0
              }
            },
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.05)'
              },
              ticks: {
                color: '#6B7280',
                font: {
                  size: 12
                },
                callback: function(value) {
                  return '$' + Number(value).toLocaleString();
                }
              }
            }
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
    // Reload chart data for the new period
    this.loadChartData();
  }

  // Generate and print marketing analytics report
  printReport(): void {
    // Get current user's company ID for reporting
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId;
    
    // Create the table columns and data structure for the print-report component
    const tableColumns = ['Metric', 'Current Value', 'Growth', 'Period', 'Status'];
    
    // Transform the marketing analytics data into the format expected by the print-report component
    const tableData = [
      {
        'Metric': 'Total Revenue',
        'Current Value': `$${this.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        'Growth': this.revenueGrowthAvailable ? `${this.revenueGrowth.toFixed(1)}%` : 'N/A',
        'Period': 'vs Last Month',
        'Status': this.revenueGrowthAvailable ? (this.isRevenueIncreasing ? 'Increasing' : this.isRevenueZero ? 'Stable' : 'Decreasing') : 'N/A'
      },
      {
        'Metric': 'Today Revenue',
        'Current Value': `$${this.todayRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        'Growth': this.todayRevenueGrowthAvailable ? `${this.todayRevenueGrowth.toFixed(1)}%` : 'N/A',
        'Period': 'vs Yesterday',
        'Status': this.todayRevenueGrowthAvailable ? (this.isTodayRevenueIncreasing ? 'Increasing' : this.isTodayRevenueZero ? 'Stable' : 'Decreasing') : 'N/A'
      },
      {
        'Metric': 'Today Orders',
        'Current Value': this.todayOrders.toString(),
        'Growth': this.todayOrdersGrowthAvailable ? `${this.todayOrdersGrowth.toFixed(1)}%` : 'N/A',
        'Period': 'vs Yesterday',
        'Status': this.todayOrdersGrowthAvailable ? (this.isTodayOrdersIncreasing ? 'Increasing' : this.isTodayOrdersZero ? 'Stable' : 'Decreasing') : 'N/A'
      },
      {
        'Metric': 'Total Customers',
        'Current Value': this.totalCustomers.toLocaleString(),
        'Growth': this.totalCustomersGrowthAvailable ? `${this.totalCustomersGrowth.toFixed(1)}%` : 'N/A',
        'Period': 'vs Last Month',
        'Status': this.totalCustomersGrowthAvailable ? (this.isTotalCustomersIncreasing ? 'Increasing' : this.isTotalCustomersZero ? 'Stable' : 'Decreasing') : 'N/A'
      },
      {
        'Metric': 'Average Order Amount',
        'Current Value': `$${this.averageOrderAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        'Growth': '-',
        'Period': 'Current',
        'Status': 'Active'
      }
    ];

    // Add campaign data if available
    if (this.campaigns && this.campaigns.length > 0) {
      this.campaigns.slice(0, 5).forEach(campaign => {
        tableData.push({
          'Metric': `Campaign: ${campaign.name}`,
          'Current Value': `$${campaign.spend}`,
          'Growth': `${campaign.clicks}%`,
          'Period': 'CTR',
          'Status': 'Active'
        });
      });
    }
    
    // Format dates for display
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, currentDate.getDate());
    
    // Create a report payload that matches what the print-report component expects
    const reportPayload = {
      reportType: 'Marketing Analytics Report',
      exportFormat: 'PDF Document (.pdf)',
      startDate: lastMonth.toISOString().split('T')[0],
      endDate: currentDate.toISOString().split('T')[0],
      pageOrientation: 'Portrait',
      tableColumns,
      tableData,
      // Additional metadata to customize the report
      companyName: 'Alliance Bees',
      companyId: companyId,
      // Add summary data for the marketing analytics
      summaryData: {
        totalRevenue: this.revenue,
        todayRevenue: this.todayRevenue,
        todayOrders: this.todayOrders,
        totalCustomers: this.totalCustomers,
        averageOrderAmount: this.averageOrderAmount,
        revenueGrowth: this.revenueGrowth,
        todayRevenueGrowth: this.todayRevenueGrowth,
        todayOrdersGrowth: this.todayOrdersGrowth,
        totalCustomersGrowth: this.totalCustomersGrowth,
        activeCampaigns: this.campaigns ? this.campaigns.length : 0,
        periodStart: lastMonth.toLocaleDateString(),
        periodEnd: currentDate.toLocaleDateString(),
        // Chart colors for consistency
        chartColors: {
          backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#9C27B0'], 
          borderColor: ['#81C784', '#64B5F6', '#FFB74D', '#BA68C8']
        }
      }
    };
    
    console.log('Sending marketing analytics report data:', reportPayload);
    
    // Store the report data in the PrintReportService
    this.printReportService.setReportData(reportPayload);
    
    // Navigate to the print-report page
    this.router.navigate(['/businessowner/printreport'], {
      state: reportPayload,
      queryParams: {
        reportType: 'marketing-analytics',
        companyId: companyId
      }
    });
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

  getCountryCode(countryName: string): string {
    // First try exact match
    const exactMatch = this.countryCodeMap[countryName];
    if (exactMatch) {
      return exactMatch;
    }
    
    // Try case-insensitive search
    const lowerCountryName = countryName.toLowerCase();
    for (const [key, value] of Object.entries(this.countryCodeMap)) {
      if (key.toLowerCase() === lowerCountryName) {
        return value;
      }
    }
    
    // Try partial match (contains)
    for (const [key, value] of Object.entries(this.countryCodeMap)) {
      if (key.toLowerCase().includes(lowerCountryName) || lowerCountryName.includes(key.toLowerCase())) {
        return value;
      }
    }
    
    // If no match found, return 'unknown'
    console.warn(`Country code not found for: ${countryName}`);
    return 'unknown';
  }

  // Helper method to load top countries
  private loadTopCountries(companyId: string): void {
    this.courierService.getTopCountries(companyId).subscribe({
      next: (data) => {
        this.topCountries = data.map((item) => ({
          name: item.name,
          code: this.getCountryCode(item.name),
          percentage: item.percentage,
        }));
        console.log('Top countries reloaded:', this.topCountries);
      },
      error: (error) => {
        console.error("Error reloading top countries:", error);
        this.setFallbackCountryData();
      }
    });
  }

  // Helper method to set fallback country data
  private setFallbackCountryData(): void {
    this.topCountries = [
      { name: 'Sri Lanka', code: 'lk', percentage: 45.3 },
      { name: 'United States', code: 'us', percentage: 28.7 },
      { name: 'Australia', code: 'au', percentage: 15.9 }
    ];
  }

  // Helper method to load today's revenue
  private loadTodayRevenue(): void {
    this.salesService.getTodaySalesRevenue().subscribe({
      next: (data) => {
        this.todayRevenue = data;
        this.todayRevenueAvailable = data > 0;
        console.log('Today revenue reloaded:', data);
      },
      error: (error) => {
        console.error("Error reloading today's revenue:", error);
        this.todayRevenue = 0;
        this.todayRevenueAvailable = false;
      }
    });
  }

  // Method to load and calculate revenue growth
  private loadRevenueGrowth(companyId?: string): void {
    this.salesService.getLastMonthSalesRevenue().subscribe({
      next: (lastMonthRevenue) => {
        console.log('Last month revenue loaded:', lastMonthRevenue);
        
        // Calculate growth percentage
        if (lastMonthRevenue > 0) {
          this.revenueGrowth = ((this.revenue - lastMonthRevenue) / lastMonthRevenue) * 100;
          this.revenueGrowthAvailable = true;
          this.isRevenueZero = Math.abs(this.revenueGrowth) < 0.01; // Consider values very close to 0 as zero
          this.isRevenueIncreasing = this.revenueGrowth > 0;
          
          console.log(`Revenue growth calculation: Current: ${this.revenue}, Last Month: ${lastMonthRevenue}, Growth: ${this.revenueGrowth.toFixed(2)}%`);
        } else if (this.revenue > 0) {
          // If last month was 0 but current month has revenue, it's 100% growth
          this.revenueGrowth = 100;
          this.revenueGrowthAvailable = true;
          this.isRevenueIncreasing = true;
          this.isRevenueZero = false;
          
          console.log('Revenue growth: 100% (from 0 to positive revenue)');
        } else {
          // Both are 0, show 0% growth
          this.revenueGrowth = 0;
          this.revenueGrowthAvailable = true;
          this.isRevenueZero = true;
          this.isRevenueIncreasing = false;
          console.log('Revenue growth: 0% (both current and last month are 0)');
        }
      },
      error: (error) => {
        console.error("Error fetching last month sales revenue:", error);
        this.revenueGrowthAvailable = false;
      }
    });
  }

  // Method to load and calculate today's revenue growth vs yesterday
  private loadTodayRevenueGrowth(): void {
    this.salesService.getYesterdaySalesRevenue().subscribe({
      next: (yesterdayRevenue) => {
        console.log('Yesterday revenue loaded:', yesterdayRevenue);
        
        // Calculate growth percentage
        if (yesterdayRevenue > 0) {
          this.todayRevenueGrowth = ((this.todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;
          this.todayRevenueGrowthAvailable = true;
          this.isTodayRevenueZero = Math.abs(this.todayRevenueGrowth) < 0.01; // Consider values very close to 0 as zero
          this.isTodayRevenueIncreasing = this.todayRevenueGrowth > 0;
          
          console.log(`Today revenue growth calculation: Today: ${this.todayRevenue}, Yesterday: ${yesterdayRevenue}, Growth: ${this.todayRevenueGrowth.toFixed(2)}%`);
        } else if (this.todayRevenue > 0) {
          // If yesterday was 0 but today has revenue, it's 100% growth
          this.todayRevenueGrowth = 100;
          this.todayRevenueGrowthAvailable = true;
          this.isTodayRevenueIncreasing = true;
          this.isTodayRevenueZero = false;
          
          console.log('Today revenue growth: 100% (from 0 to positive revenue)');
        } else {
          // Both are 0, show 0% growth
          this.todayRevenueGrowth = 0;
          this.todayRevenueGrowthAvailable = true;
          this.isTodayRevenueZero = true;
          this.isTodayRevenueIncreasing = false;
          console.log('Today revenue growth: 0% (both today and yesterday are 0)');
        }
      },
      error: (error) => {
        console.error("Error fetching yesterday sales revenue:", error);
        this.todayRevenueGrowthAvailable = false;
      }
    });
  }

  // Method to load and calculate today's orders growth vs yesterday
  private loadTodayOrdersGrowth(): void {
    this.salesService.getYesterdayOrdersCount().subscribe({
      next: (yesterdayOrders) => {
        console.log('Yesterday orders loaded:', yesterdayOrders);
        
        // Calculate growth percentage
        if (yesterdayOrders > 0) {
          this.todayOrdersGrowth = ((this.todayOrders - yesterdayOrders) / yesterdayOrders) * 100;
          this.todayOrdersGrowthAvailable = true;
          this.isTodayOrdersZero = Math.abs(this.todayOrdersGrowth) < 0.01; // Consider values very close to 0 as zero
          this.isTodayOrdersIncreasing = this.todayOrdersGrowth > 0;
          
          console.log(`Today orders growth calculation: Today: ${this.todayOrders}, Yesterday: ${yesterdayOrders}, Growth: ${this.todayOrdersGrowth.toFixed(2)}%`);
        } else if (this.todayOrders > 0) {
          // If yesterday was 0 but today has orders, it's 100% growth
          this.todayOrdersGrowth = 100;
          this.todayOrdersGrowthAvailable = true;
          this.isTodayOrdersIncreasing = true;
          this.isTodayOrdersZero = false;
          
          console.log('Today orders growth: 100% (from 0 to positive orders)');
        } else {
          // Both are 0, show 0% growth
          this.todayOrdersGrowth = 0;
          this.todayOrdersGrowthAvailable = true;
          this.isTodayOrdersZero = true;
          this.isTodayOrdersIncreasing = false;
          console.log('Today orders growth: 0% (both today and yesterday are 0)');
        }
      },
      error: (error) => {
        console.error("Error fetching yesterday orders count:", error);
        this.todayOrdersGrowthAvailable = false;
      }
    });
  }

  // Method to load and calculate customers growth vs last month
  private loadCustomerCountGrowth(): void {
    // Load total customers first
    this.salesService.getTotalCustomersCount().subscribe({
      next: (totalCustomers) => {
        this.totalCustomers = totalCustomers;
        console.log('Total customers loaded:', totalCustomers);
        
        // Load last month customers for comparison
        this.salesService.getLastMonthCustomersCount().subscribe({
          next: (lastMonthCustomers) => {
            console.log('Last month customers loaded:', lastMonthCustomers);
            
            // Calculate growth percentage
            if (lastMonthCustomers > 0) {
              this.totalCustomersGrowth = ((this.totalCustomers - lastMonthCustomers) / lastMonthCustomers) * 100;
              this.totalCustomersGrowthAvailable = true;
              this.isTotalCustomersZero = Math.abs(this.totalCustomersGrowth) < 0.01; // Consider values very close to 0 as zero
              this.isTotalCustomersIncreasing = this.totalCustomersGrowth > 0;
              
              console.log(`Customers growth calculation: Current: ${this.totalCustomers}, Last Month: ${lastMonthCustomers}, Growth: ${this.totalCustomersGrowth.toFixed(2)}%`);
            } else if (this.totalCustomers > 0) {
              // If last month was 0 but current has customers, it's 100% growth
              this.totalCustomersGrowth = 100;
              this.totalCustomersGrowthAvailable = true;
              this.isTotalCustomersIncreasing = true;
              this.isTotalCustomersZero = false;
              
              console.log('Customers growth: 100% (from 0 to positive customers)');
            } else {
              // Both are 0, show 0% growth
              this.totalCustomersGrowth = 0;
              this.totalCustomersGrowthAvailable = true;
              this.isTotalCustomersZero = true;
              this.isTotalCustomersIncreasing = false;
              console.log('Customers growth: 0% (both current and last month are 0)');
            }
          },
          error: (error) => {
            console.error("Error fetching last month customers count:", error);
            this.totalCustomersGrowthAvailable = false;
          }
        });
      },
      error: (error) => {
        console.error("Error fetching total customers count:", error);
        this.totalCustomersGrowthAvailable = false;
      }
    });
  }

  // Method to load average order amount
  private loadAverageOrderAmount(): void {
    this.salesService.getAverageOrderAmount().subscribe({
      next: (averageAmount) => {
        this.averageOrderAmount = averageAmount;
        console.log('Average order amount loaded:', averageAmount);
      },
      error: (error) => {
        console.error("Error fetching average order amount:", error);
        this.averageOrderAmount = 0;
      }
    });
  }

  // Helper method to process period data for chart
  private processPeriodData(data: any[]): void {
    // Extract labels and values from the period data
    this.chartLabels = data.map(item => item.label || '');
    this.chartData = data.map(item => Number(item.value) || 0);
    
    console.log('Processed chart data:', {
      labels: this.chartLabels,
      data: this.chartData,
      period: this.selectedPeriod
    });
  }

  // Helper method to set fallback chart data
  private setFallbackChartData(): void {
    switch (this.selectedPeriod) {
      case 'month':
        this.chartLabels = Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`);
        this.chartData = this.monthlyData;
        break;
      case 'threeMonths':
        this.chartLabels = Array.from({ length: 12 }, (_, i) => `Week ${i + 1}`);
        this.chartData = Array.from({ length: 12 }, () => Math.random() * 1000);
        break;
      case 'sixMonths':
        this.chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        this.chartData = Array.from({ length: 6 }, () => Math.random() * 5000);
        break;
      case 'year':
        this.chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.chartData = this.yearlyData;
        break;
      default:
        this.chartLabels = Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`);
        this.chartData = this.monthlyData;
    }
  }

  /**
   * Load device category data from the API
   */
  loadDeviceCategoryData(): void {
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId;

    this.deviceService.getDeviceCategorySummary(companyId).subscribe({
      next: (summary: DeviceCategorySummary) => {
        this.mobilePercentage = summary.mobilePercentage;
        this.desktopPercentage = summary.desktopPercentage;
        this.tabletPercentage = summary.tabletPercentage;
        
        console.log('Device category data loaded:', {
          mobile: this.mobilePercentage,
          desktop: this.desktopPercentage,
          tablet: this.tabletPercentage,
          totalSessions: summary.totalSessions,
          totalOrders: summary.totalOrders,
          totalRevenue: summary.totalRevenue
        });
      },
      error: (err) => {
        console.error('Error fetching device category data:', err);
        // Keep default hardcoded values as fallback
        console.log('Using fallback device percentages:', {
          mobile: this.mobilePercentage,
          desktop: this.desktopPercentage,
          tablet: this.tabletPercentage
        });
      }
    });
  }
}