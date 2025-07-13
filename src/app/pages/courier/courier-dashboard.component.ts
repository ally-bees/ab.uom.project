import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CourierService, Courier } from '../../services/courier.service';
import { Chart } from 'chart.js';
import { HeaderComponent } from "../header/header.component";
import { CouriersidebarComponent } from "../sidebar/couriersidebar/couriersidebar.component";
import { FooterComponent } from "../../footer/footer.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-courier',
  templateUrl: './courier-dashboard.component.html',
  styleUrls: ['./courier-dashboard.component.css'],
  imports: [HeaderComponent, CouriersidebarComponent, FooterComponent, CommonModule, FormsModule]
})
export class CourierDashboardComponent implements OnInit, AfterViewInit {
  // Reference to the pie chart canvas element
  @ViewChild('deliveryPieChart') deliveryPieChartRef!: ElementRef<HTMLCanvasElement>;

  // Summary statistics for deliveries
  summary: any = {};
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

  constructor(private courierService: CourierService) {}

  ngOnInit(): void {
    // Initialize default date range (last 6 months)
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 180);

    this.fromDate = weekAgo.toISOString().slice(0, 10);
    this.toDate = today.toISOString().slice(0, 10);

    // Load recent deliveries (limit 10)
    this.courierService.getRecentDeliveries(10).subscribe(data => {
      this.recentDeliveries = data;
      this.allDeliveries = data; // Backup for search
    });

    // Load all deliveries and derive recent deliveries from it
    this.courierService.getAllCouriers().subscribe(data => {
      this.allDeliveries = data;
      this.recentDeliveries = data.slice(-10).reverse(); 
    });

    // Fetch summary data for current date range
    this.fetchSummary();
  }

  // Fetch delivery summary statistics based on selected date range
  fetchSummary(): void {
    if (this.fromDate && this.toDate) {
      this.courierService.getSummary(this.fromDate, this.toDate).subscribe(data => {
        this.summary = data;
        this.updatePieChart(); // Refresh chart with new data
      });
    }
  }

  ngAfterViewInit(): void {
    // Draw the chart after view has initialized
    this.updatePieChart();
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
          legend: { display: false }
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

  // Search deliveries by courier ID or order ID
  searchDeliveries(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      // Reset to last 10 if search is cleared
      this.recentDeliveries = this.allDeliveries.slice(-10).reverse();
      return;
    }

    // Filter by courierId or orderId matching search term
    this.recentDeliveries = this.allDeliveries.filter(delivery =>
      (delivery.courierId && delivery.courierId.toLowerCase().includes(term)) ||
      (delivery.orderId && delivery.orderId.toLowerCase().includes(term))
    );
  }
}
