import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SalesService } from '../../services/sales.service';

// Define SalesViewModel interface
interface SalesViewModel {
  totalSales?: number;
  totalOrders: number;
  totalCustomers?: number;
  totalRevenue: number;
  totalItems?: number; 
  sales?: any[];
}

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.css']
})
export class StatsCardComponent implements OnInit {
  @Input() startDate?: string;
  @Input() endDate?: string;

  salesData?: SalesViewModel;
  loading: boolean = true;
  error: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private salesService: SalesService
  ) {}

  ngOnInit(): void {
    if (!this.startDate || !this.endDate) {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      this.endDate = today.toISOString();
      this.startDate = thirtyDaysAgo.toISOString();
    }

    this.fetchSalesData();
  }
  onDateChange(): void {
    this.fetchSalesData();
  }
  
  fetchSalesData(): void {
    this.loading = true;
    this.error = false;
    if (this.startDate && this.endDate) {
      this.salesService.getDashboardDataForCompanyWithDateRange(this.startDate, this.endDate).subscribe({
        next: (data) => {
          this.salesData = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching sales data:', err);
          this.error = true;
          this.loading = false;
        }
      });
    } else {
      this.loading = false;
    }
  }
}
