import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service'; // Adjust path if needed

interface FinanceRecord {
  id: string;
  amount: number;
  status: 'income' | 'expense';
  orderDate: string; // must match backend date field
}

@Component({
  selector: 'app-sales-insight',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-insight.component.html',
  styleUrls: ['./sales-insight.component.scss']
})
export class SalesInsightComponent implements OnInit {
  profitPercentage = 0;
  thisMonthIncome = 0;
  thisMonthExpense = 0;
  lastMonthIncome = 0;
  lastMonthExpense = 0;
  thisMonthProfit = 0;
  lastMonthProfit = 0;
  thisMonthLabel = '';
  lastMonthLabel = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    console.log('[SalesInsight] ngOnInit called');
    this.fetchFinanceData();
  }

  fetchFinanceData(): void {
    const currentUser = this.authService.getCurrentUser();
    console.log('[SalesInsight] Current user:', currentUser);

    const companyId = currentUser?.CompanyId;
    console.log('[SalesInsight] Company ID:', companyId);

    if (!companyId) {
      console.error('[SalesInsight] No company ID found for the current user');
      this.resetData();
      return;
    }

    const url = `http://localhost:5241/api/finance/company/${companyId}`;
    console.log('[SalesInsight] Fetching finance data from:', url);

    this.http.get<FinanceRecord[]>(url).subscribe({
      next: (records) => {
        console.log('[SalesInsight] Finance API data:', records);

        if (!records || records.length === 0) {
          console.log('[SalesInsight] No records returned.');
          this.resetData();
          return;
        }

        const grouped = this.groupFinanceByMonth(records);
        console.log('[SalesInsight] Grouped by month:', grouped);

        this.thisMonthIncome = this.getTotalByStatusForMonth(grouped, 'income', 0);
        this.thisMonthExpense = this.getTotalByStatusForMonth(grouped, 'expense', 0);
        this.lastMonthIncome = this.getTotalByStatusForMonth(grouped, 'income', 1);
        this.lastMonthExpense = this.getTotalByStatusForMonth(grouped, 'expense', 1);

        console.log('[SalesInsight] This month income:', this.thisMonthIncome);
        console.log('[SalesInsight] This month expense:', this.thisMonthExpense);
        console.log('[SalesInsight] Last month income:', this.lastMonthIncome);
        console.log('[SalesInsight] Last month expense:', this.lastMonthExpense);

        this.thisMonthProfit = this.thisMonthIncome - this.thisMonthExpense;
        this.lastMonthProfit = this.lastMonthIncome - this.lastMonthExpense;

        console.log('[SalesInsight] This month profit:', this.thisMonthProfit);
        console.log('[SalesInsight] Last month profit:', this.lastMonthProfit);

        this.profitPercentage = this.calculateProfitPercentage(this.thisMonthProfit, this.lastMonthProfit);
        console.log('[SalesInsight] Profit percentage:', this.profitPercentage);

        const today = new Date();
        this.thisMonthLabel = new Date(today.getFullYear(), today.getMonth()).toLocaleString('default', { month: 'long' });
        this.lastMonthLabel = new Date(today.getFullYear(), today.getMonth() - 1).toLocaleString('default', { month: 'long' });

        console.log('[SalesInsight] This month label:', this.thisMonthLabel);
        console.log('[SalesInsight] Last month label:', this.lastMonthLabel);
      },
      error: (error) => {
        console.error('[SalesInsight] Failed to fetch finance data:', error);
        this.resetData();
      }
    });
  }

  groupFinanceByMonth(records: FinanceRecord[]): Map<string, { income: number; expense: number }> {
    const monthlyData = new Map<string, { income: number; expense: number }>();
    records.forEach(record => {
      const date = new Date(record.orderDate);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthlyData.has(key)) {
        monthlyData.set(key, { income: 0, expense: 0 });
      }
      const data = monthlyData.get(key)!;
      if (record.status.toLowerCase() === 'income') {
        data.income += record.amount;
      } else if (record.status.toLowerCase() === 'expense') {
        data.expense += record.amount;
      }
    });
    return monthlyData;
  }

  getTotalByStatusForMonth(
    grouped: Map<string, { income: number; expense: number }>,
    status: 'income' | 'expense',
    offset: number
  ): number {
    const today = new Date();
    const targetMonth = new Date(today.getFullYear(), today.getMonth() - offset);
    const key = `${targetMonth.getFullYear()}-${targetMonth.getMonth()}`;
    const data = grouped.get(key);
    if (!data) {
      console.log(`[SalesInsight] No data found for key: ${key}`);
      return 0;
    }
    return status === 'income' ? data.income : data.expense;
  }

  calculateProfitPercentage(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  getCircleStyle(): string {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const percent = Math.min(Math.max(this.profitPercentage, 0), 100);
    const offset = circumference * (1 - percent / 100);
    return `stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset}`;
  }

  private resetData(): void {
    console.log('[SalesInsight] Resetting all data to zero');
    this.profitPercentage = 0;
    this.thisMonthIncome = 0;
    this.thisMonthExpense = 0;
    this.lastMonthIncome = 0;
    this.lastMonthExpense = 0;
    this.thisMonthProfit = 0;
    this.lastMonthProfit = 0;
    this.thisMonthLabel = '';
    this.lastMonthLabel = '';
  }
}
