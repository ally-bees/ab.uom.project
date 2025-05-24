import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';

// Define SalesViewModel interface
interface SalesViewModel {
  totalSales: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  totalItems?: number; 
}

@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.css']
})
export class StatsCardComponent implements OnInit {
  @Input() startDate?: string;
  @Input() endDate?: string;

  salesData?: SalesViewModel;
  loading: boolean = true;
  error: boolean = false;



  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // If startDate and endDate are not provided, use default (last 30 days)
    if (!this.startDate || !this.endDate) {
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      this.endDate = today.toISOString().split('T')[0];
      this.startDate = thirtyDaysAgo.toISOString().split('T')[0];
    }

    this.fetchSalesData();
  }

  fetchSalesData(): void {
    const params = new HttpParams()
      .set('startDate', this.startDate!)
      .set('endDate', this.endDate!);

    this.http.get<SalesViewModel>('http://localhost:5241/api/SalesDashboard/date-range', { params })
      .subscribe({
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
  }
}
