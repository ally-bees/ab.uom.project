import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service'; // Adjust path if needed

interface Sale {
  id: string;
  saleId: string;
  orderIds: string[];
  saleDate: string;
  amount: number;
}

@Component({
  selector: 'app-sales-insight',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-insight.component.html',
  styleUrls: ['./sales-insight.component.scss']
})
export class SalesInsightComponent implements OnInit {
  profitPercentage: number = 0;
  thisMonthProfit: number = 0;
  lastMonthProfit: number = 0;
  thisMonthLabel: string = '';
  lastMonthLabel: string = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchSalesData();
  }

  fetchSalesData(): void {
    const currentUser = this.authService.getCurrentUser();
    const companyId = currentUser?.CompanyId;

    if (!companyId) {
      console.error('No company ID found for the current user');
      return;
    }

    const url = `http://localhost:5241/api/sales/company/${companyId}`;

    this.http.get<Sale[]>(url).subscribe({
      next: (sales) => {
        const grouped = this.groupSalesByMonth(sales);
        const currentMonth = this.getTotalForMonth(grouped, 0);
        const previousMonth = this.getTotalForMonth(grouped, 1);
        this.profitPercentage = this.calculateProfitPercentage(currentMonth, previousMonth);
        this.thisMonthProfit = currentMonth;
        this.lastMonthProfit = previousMonth;

        const today = new Date();
        const current = new Date(today.getFullYear(), today.getMonth());
        const previous = new Date(today.getFullYear(), today.getMonth() - 1);
        this.thisMonthLabel = current.toLocaleString('default', { month: 'long' });
        this.lastMonthLabel = previous.toLocaleString('default', { month: 'long' });
      },
      error: (error) => {
        console.error('Failed to fetch sales data:', error);
      }
    });
  }

  groupSalesByMonth(sales: Sale[]): Map<string, number> {
    const monthlyTotals = new Map<string, number>();
    sales.forEach(sale => {
      const date = new Date(sale.saleDate);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const prev = monthlyTotals.get(key) || 0;
      monthlyTotals.set(key, prev + sale.amount);
    });
    return monthlyTotals;
  }

  getTotalForMonth(grouped: Map<string, number>, offset: number): number {
    const today = new Date();
    const target = new Date(today.getFullYear(), today.getMonth() - offset, 1);
    const key = `${target.getFullYear()}-${target.getMonth()}`;
    return grouped.get(key) || 0;
  }

  calculateProfitPercentage(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  getCircleStyle(): string {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - this.profitPercentage / 100);
    return `stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset}`;
  }
}