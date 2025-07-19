import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CourierService, Courier, CourierSummaryDto } from '../../services/courier.service';
import { AuthService } from '../../services/auth.service';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Register all Chart.js components
Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-courier',
  templateUrl: './courier-dashboard.component.html',
  styleUrls: ['./courier-dashboard.component.css'],
  imports: [CommonModule, FormsModule]
})
export class CourierDashboardComponent implements OnInit, AfterViewInit {
  showDateRangeResults: boolean = false;
  dateRangeResults: Courier[] = [];
  // Reference to the pie chart canvas element
  @ViewChild('deliveryPieChart') deliveryPieChartRef!: ElementRef<HTMLCanvasElement>;

  // Summary statistics for deliveries
  summary: CourierSummaryDto = { total: 0, pending: 0, completed: 0, rejected: 0 };
  // List of recent deliveries to display in table
  recentDeliveries: Courier[] = [];
  // Pie chart instance
  private pieChart: Chart | undefined;

  // Date filters for the summary
  fromDate: string = '';
  toDate: string = '';

  // Search term entered by user
  searchTerm: string = '';
  // All delivery data (used for filtering/searching)
  allDeliveries: Courier[] = [];

  // Company ID for filtering deliveries
  companyId: string = '';

  // Search results modal
  showSearchResults: boolean = false;
  searchResults: Courier[] = [];

  // Loading states
  isLoading: boolean = false;
  hasError: boolean = false;
  errorMessage: string = '';
  constructor(private courierService: CourierService, private authService: AuthService) {}

  ngOnInit(): void {
    // Get companyId from AuthService only
    // You must inject AuthService in the constructor: constructor(private courierService: CourierService, private authService: AuthService) {}
    this.companyId = this.authService.getCurrentUser()?.CompanyId || '';
    if (!this.companyId) {
      this.hasError = true;
      this.errorMessage = 'No company ID found for current user.';
      return;
    }

    // Initialize default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.fromDate = thirtyDaysAgo.toISOString().split('T')[0];
    this.toDate = today.toISOString().split('T')[0];

    // Fetch summary, recent deliveries, and all couriers for dashboard
    this.fetchSummary();
    this.fetchRecentDeliveries();
    this.fetchAllCouriers();
  }

  loadData(): void {
    // Deprecated: replaced by individual fetch methods
  }

  // Fetch delivery summary statistics based on selected date range
  fetchSummary(): void {
    // If dates are not properly set, don't fetch data
    if (!this.fromDate || !this.toDate) {
      // Don't show alerts here to avoid multiple alerts when dates change
      // Clear any existing data since date range is invalid
      this.summary = {
        total: 0,
        pending: 0,
        completed: 0,
        rejected: 0
      };
      return;
    }
    
    if (this.companyId) {
      const from = new Date(this.fromDate);
      const to = new Date(this.toDate);
      
      // Set time to end of day for to date to include full day
      to.setHours(23, 59, 59, 999);
      
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Set to end of today
      
      if (to > today) {
        // Only show error if the date is actually in the future (after today)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        if (to >= tomorrow) {
          alert('Please check the date range: To date cannot be in the future.');
          // Clear data for invalid date range
          this.summary = {
            total: 0,
            pending: 0,
            completed: 0,
            rejected: 0
          };
          return;
        }
      }
      
      if (to < from) {
        alert('Please check the date range: To date cannot be before From date.');
        // Clear data for invalid date range
        this.summary = {
          total: 0,
          pending: 0,
          completed: 0,
          rejected: 0
        };
        return;
      }
      this.isLoading = true;
      this.courierService.getSummary(this.fromDate, this.toDate, this.companyId).subscribe({
        next: (data) => {
          this.summary = data;
          this.ensureChartVisible(); // Use ensureChartVisible for consistency
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching summary:', err);
          this.hasError = true;
          this.errorMessage = 'Failed to load summary data. Please try again later.';
          this.isLoading = false;
          
          // Ensure pie chart is visible even after error
          setTimeout(() => {
            this.ensureChartVisible();
          }, 100);
        }
      });
    }
  }

  fetchRecentDeliveries(): void {
    this.isLoading = true;
    this.courierService.getRecentDeliveries(10, this.companyId).subscribe({
      next: (data) => {
        this.recentDeliveries = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching recent deliveries:', err);
        this.hasError = true;
        this.errorMessage = 'Failed to load recent deliveries. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  fetchAllCouriers(): void {
    this.isLoading = true;
    this.courierService.getAllCouriers(this.companyId).subscribe({
      next: (data) => {
        this.allDeliveries = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching all couriers:', err);
        this.hasError = true;
        this.errorMessage = 'Failed to load all couriers. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  // Load all couriers for the selected date range
  loadCouriersForDateRange(): void {
    // Check if dates are selected
    if (!this.fromDate || !this.toDate) {
      // Only show an error if both dates are not selected
      if (!this.fromDate && !this.toDate) {
        alert('Please check the date range: Both From and To dates are required.');
        return;
      } else if (!this.fromDate) {
        alert('Please check the date range: From date is required.');
        return;
      } else {
        alert('Please check the date range: To date is required.');
        return;
      }
    }
    
    const fromDate = new Date(this.fromDate);
    const toDate = new Date(this.toDate);
    
    // Set time to end of day for toDate to include full day
    toDate.setHours(23, 59, 59, 999);
    
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Set to end of today
    
    // Validate date range
    if (toDate > today) {
      // Only show error if the date is actually in the future (after today)
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      if (toDate >= tomorrow) {
        alert('Please check the date range: To date cannot be in the future.');
        return;
      }
    }
    
    if (toDate < fromDate) {
      alert('Please check the date range: To date cannot be before From date.');
      return;
    }
    this.isLoading = true;
    this.courierService.getAllCouriers(this.companyId).subscribe({
      next: (data) => {
        this.isLoading = false;
        const results = data.filter(courier => {
          const courierDate = courier.date ? new Date(courier.date) : null;
          return courierDate && courierDate >= fromDate && courierDate <= toDate;
        });
        
        // Check if there are any results in the date range
        if (results.length === 0) {
          alert('No couriers found in the selected date range. Please try a different range.');
          return;
        }
        
        this.dateRangeResults = results;
        this.showDateRangeResults = true;
        
        // Ensure pie chart is visible after loading date range results
        setTimeout(() => {
          this.ensureChartVisible();
        }, 150);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching couriers for date range:', err);
        alert('Failed to fetch data. Please try again.');
      }
    });
  }

  ngAfterViewInit(): void {
    // Always draw the chart after view has initialized
    setTimeout(() => {
      this.updatePieChart();
    }, 100);
  }

  // Method to (re)draw the pie chart
  updatePieChart(): void {
    console.log('Updating pie chart...');
    
    // Don't update if we're in the middle of loading data
    if (this.isLoading) {
      console.log('Loading in progress, will update chart later');
      return;
    }
    
    if (!this.deliveryPieChartRef) {
      console.log('Pie chart reference not found - waiting');
      setTimeout(() => this.updatePieChart(), 500);
      return;
    }
    
    const canvas = this.deliveryPieChartRef.nativeElement;
    
    // Make sure canvas is visible and has dimensions
    if (canvas.offsetWidth === 0 || canvas.offsetHeight === 0) {
      console.log('Canvas has zero dimensions, retry later');
      setTimeout(() => this.updatePieChart(), 200);
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.log('Could not get canvas context');
      return;
    }

    // Destroy previous chart if exists
    if (this.pieChart) {
      this.pieChart.destroy();
    }

    console.log('Creating pie chart with data:', this.summary);
    
    // Get data values for the chart
    const pendingValue = this.summary?.pending || 0;
    const completedValue = this.summary?.completed || 0;
    const rejectedValue = this.summary?.rejected || 0;
    
    // Check if all values are zero
    const allZero = pendingValue === 0 && completedValue === 0 && rejectedValue === 0;
    
    // Create new pie chart with delivery stats
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Pending', 'Completed', 'Rejected'],
        datasets: [{
          data: allZero ? [1, 1, 1] : [pendingValue, completedValue, rejectedValue], // Use placeholder values if all are zero
          backgroundColor: ['#f9e559', '#4caf50', '#f44336'],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000
        },
        layout: {
          padding: {
            top: 20,
            bottom: 30,
            left: 0,
            right: 0
          }
        },
        plugins: {
          legend: { 
            display: false  // Hiding built-in legend as we use a custom one
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => {
                // Get the actual values regardless of what's shown in the chart
                const values = [pendingValue, completedValue, rejectedValue];
                const actualValue = values[context.dataIndex];
                return context.label + ': ' + actualValue;
              }
            }
          }
        }
      }
    });
  }

  // Return CSS class based on delivery status
  getStatusClass(status: string | undefined): string {
    switch ((status || '').toLowerCase()) {
      case 'completed': return 'completed';
      case 'pending': return 'pending';
      case 'rejected': return 'rejected';
      default: return '';
    }
  }

  // Trigger print functionality
  printReport(): void {
    window.print();
  }

  // Search deliveries - show popup with results
  searchDeliveries(): void {
    if (!this.searchTerm.trim()) {
      this.showSearchResults = false;
      return;
    }

    this.isLoading = true;
    
    // Use the backend search endpoint
    this.courierService.searchCouriers(this.searchTerm, this.companyId).subscribe({
      next: (results) => {
        this.searchResults = results;
        this.showSearchResults = true;
        this.isLoading = false;
        
        // Make sure the pie chart is still visible and updated
        setTimeout(() => {
          this.ensureChartVisible();
        }, 100);
      },
      error: (err) => {
        console.error('Search error:', err);
        this.hasError = true;
        this.errorMessage = 'Search failed. Please try again.';
        this.isLoading = false;
        
        // Ensure pie chart is still visible even if search fails
        setTimeout(() => {
          this.ensureChartVisible();
        }, 100);
      }
    });
  }

  // Close the search results modal
  closeSearchModal(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showSearchResults = false;
    
    // Ensure pie chart is redrawn after closing the search modal
    setTimeout(() => {
      this.ensureChartVisible();
    }, 100);
  }

  // Close the date range results modal
  closeDateRangeModal(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showDateRangeResults = false;
    
    // Ensure pie chart is visible after closing date range results
    setTimeout(() => {
      this.ensureChartVisible();
    }, 100);
  }

  // Select a courier from search results
  selectCourier(courier: Courier): void {
    // Here you could implement logic to focus on the selected courier
    // or navigate to a courier detail page
    console.log('Selected courier:', courier);
    this.closeSearchModal();
    
    // Ensure the pie chart is visible after selection
    setTimeout(() => {
      this.ensureChartVisible();
    }, 100);
  }
  
  // Add a method to handle window resize events to ensure chart redraws properly
  @HostListener('window:resize')
  onResize() {
    // Redraw the chart when window is resized
    setTimeout(() => {
      this.ensureChartVisible();
    }, 200);
  }
  
  // Method to make sure chart is visible after any UI changes
  ensureChartVisible() {
    if (this.pieChart) {
      // If chart exists but might be hidden or dimensions changed, redraw it
      setTimeout(() => {
        this.updatePieChart();
      }, 100);
    }
  }
}
