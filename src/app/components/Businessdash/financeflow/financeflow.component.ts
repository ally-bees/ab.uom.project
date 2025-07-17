import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
// Update the import path below to the correct relative path where auth.service.ts exists.
// For example, if auth.service.ts is in src/app/services/, use the following:
import { AuthService } from '../../../services/auth.service';

interface FinanceEntry {
  amount: number;
  status: 'income' | 'expense';
  orderDate: string | { $date: string };
}

@Component({
  selector: 'app-finance-flow',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgChartsModule],
  templateUrl: './financeflow.component.html',
  styleUrls: ['./financeflow.component.scss']
})
export class FinanceFlowComponent implements OnInit {
  amount: number = 0;
  month: string = '';
  totalIncome: number = 0;

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: '(Last 15 Entries)' }
    }
  };
  public barChartLabels: string[] = [];
  public barChartData: ChartConfiguration<'bar'>['data']['datasets'] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchFinanceData();
  }

private fetchFinanceData(): void {
  const currentUser = this.authService.getCurrentUser();
  const companyId = currentUser?.CompanyId;

  if (!companyId) {
    console.error('No company ID found for the user');
    return;
  }

  // ✅ Use correct route path
  const url = `http://localhost:5241/api/finance/company/${companyId}`;

  this.http.get<FinanceEntry[]>(url).subscribe(data => {
    const sortedData = data
      .map(entry => {
        const dateValue = entry.orderDate;
        const formattedDate = new Date(typeof dateValue === 'string' ? dateValue : dateValue?.$date);
        return { ...entry, date: formattedDate };
      })
      .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));

    const latest15 = sortedData.slice(0, 15).reverse();

    this.barChartLabels = latest15.map(entry =>
      entry.date ? entry.date.toLocaleDateString('en-US') : 'Unknown'
    );

    const incomeData = latest15.map(entry => entry.status === 'income' ? entry.amount : 0);
    const expenseData = latest15.map(entry => entry.status === 'expense' ? entry.amount : 0);

    this.barChartData = [
      { data: incomeData, label: 'Income', backgroundColor: '#00c853' },
      { data: expenseData, label: 'Expense', backgroundColor: '#d50000' }
    ];

    this.amount = latest15.reduce((total, entry) =>
      total + (entry.status === 'income' ? entry.amount : -entry.amount), 0);

    if (latest15.length > 0) {
      const latestDate = latest15[latest15.length - 1].date;
      const targetMonth = latestDate.getMonth();
      const targetYear = latestDate.getFullYear();

      this.month = latestDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

      this.totalIncome = sortedData
        .filter(entry =>
          entry.status === 'income' &&
          entry.date.getMonth() === targetMonth &&
          entry.date.getFullYear() === targetYear
        )
        .reduce((sum, entry) => sum + entry.amount, 0);
    }
  });
}

}
