import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CourierService, Courier, CourierSummaryDto } from '../../services/courier.service';
import { AuthService } from '../../services/auth.service';
import { Chart } from 'chart.js';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
    if (this.fromDate && this.toDate && this.companyId) {
      const from = new Date(this.fromDate);
      const to = new Date(this.toDate);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (to > today) {
        alert('To date cannot be ahead of today.');
        return;
      }
      if (to < from) {
        alert('To date cannot be before From date.');
        return;
      }
      this.isLoading = true;
      this.courierService.getSummary(this.fromDate, this.toDate, this.companyId).subscribe({
        next: (data) => {
          this.summary = data;
          this.updatePieChart();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching summary:', err);
          this.hasError = true;
          this.errorMessage = 'Failed to load summary data. Please try again later.';
          this.isLoading = false;
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
    const fromDate = new Date(this.fromDate);
    const toDate = new Date(this.toDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (toDate > today) {
      alert('To date cannot be ahead of today.');
      return;
    }
    if (toDate < fromDate) {
      alert('To date cannot be before From date.');
      return;
    }
    this.courierService.getAllCouriers(this.companyId).subscribe({
      next: (data) => {
        const results = data.filter(courier => {
          const courierDate = courier.date ? new Date(courier.date) : null;
          return courierDate && courierDate >= fromDate && courierDate <= toDate;
        });
        this.dateRangeResults = results;
        this.showDateRangeResults = true;
      },
      error: (err) => {
        console.error('Error fetching couriers for date range:', err);
      }
    });
  }

  ngAfterViewInit(): void {
    // Draw the chart after view has initialized and summary data is loaded
    if (this.summary && (this.summary.pending > 0 || this.summary.completed > 0 || this.summary.rejected > 0)) {
      this.updatePieChart();
    }
  }

  // Method to (re)draw the pie chart
  updatePieChart(): void {
    if (!this.deliveryPieChartRef) return;
    const canvas = this.deliveryPieChartRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Destroy previous chart if exists
    if (this.pieChart) {
      this.pieChart.destroy();
    }

    // Create new pie chart with delivery stats
    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Pending Deliveries', 'Completed Deliveries', 'Rejected Deliveries'],
        datasets: [{
          data: [
            this.summary?.pending || 0,
            this.summary?.completed || 0,
            this.summary?.rejected || 0
          ],
          backgroundColor: ['#f9e559', '#4caf50', '#f44336'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: false,
            position: 'right'
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
      },
      error: (err) => {
        console.error('Search error:', err);
        this.hasError = true;
        this.errorMessage = 'Search failed. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // Close the search results modal
  closeSearchModal(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showSearchResults = false;
  }

  // Close the date range results modal
  closeDateRangeModal(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.showDateRangeResults = false;
  }

  // Select a courier from search results
  selectCourier(courier: Courier): void {
    // Here you could implement logic to focus on the selected courier
    // or navigate to a courier detail page
    console.log('Selected courier:', courier);
    this.closeSearchModal();
  }
}
