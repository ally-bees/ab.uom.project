import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartType } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ChangeDetectorRef } from '@angular/core';

interface Invoice {
  id: string;
  financeId: string;
  date: Date;
  orderDate: Date;
  shipmentDate: Date;
  city: string;
  status: string;
  amount: number;
}

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, NgChartsModule],
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit, AfterViewInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  fromDate: string | undefined;
  toDate: string | undefined;

  filteredInvoices: Invoice[] = [];

  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Income',
        borderColor: '#007bff',
        backgroundColor: '#007bff',
        pointRadius: 4,
        borderWidth: 1.5,
        tension: 0.5,
        pointHoverRadius: 6,
        pointBackgroundColor: '#007bff'
      },
      {
        data: [],
        label: 'Expenses',
        borderColor: '#00b894',
        backgroundColor: '#00b894',
        pointRadius: 4,
        borderWidth: 1.5,
        tension: 0.5,
        pointHoverRadius: 6,
        pointBackgroundColor: '#00b894'
      }
    ]
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    elements: { line: { tension: 0.5 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          title: () => '',
          label: (tooltipItem) => `${tooltipItem.dataset.label}: ${tooltipItem.raw}`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: false, grid: { display: false } }
    }
  };

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private router: Router) {}

  ngOnInit(): void {
    this.fromDate = this.formatDate(new Date(new Date().setMonth(new Date().getMonth() - 3)));
    this.toDate = this.formatDate(new Date());
    this.fetchFinanceData();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.chart?.update();
    }, 0);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  fetchFinanceData(): void {
    this.http.get<Invoice[]>('http://localhost:5241/api/finance').subscribe(data => {
      const monthMap = new Map<string, { income: number, expenses: number }>();

      data.forEach(entry => {
        const date = new Date(entry.orderDate);
        if (isNaN(date.getTime())) return;

        const key = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

        if (!monthMap.has(key)) {
          monthMap.set(key, { income: 0, expenses: 0 });
        }

        const current = monthMap.get(key)!;
        if (entry.status?.toLowerCase() === 'income') {
          current.income += entry.amount;
        } else if (entry.status?.toLowerCase() === 'expense') {
          current.expenses += entry.amount;
        }
      });

      const sortedKeys = Array.from(monthMap.keys()).sort();

      this.lineChartData.labels = sortedKeys.map(key => {
        const [year, month] = key.split('-').map(Number);
        return new Date(year, month - 1).toLocaleString('default', { month: 'short', year: 'numeric' });
      });

      this.lineChartData.datasets[0].data = sortedKeys.map(key => monthMap.get(key)!.income);
      this.lineChartData.datasets[1].data = sortedKeys.map(key => monthMap.get(key)!.expenses);

      // Sort invoices by latest orderDate for the table
      this.filteredInvoices = data.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

      this.cdr.detectChanges();
      this.chart?.update();
    }, error => {
      console.error('Error fetching finance data:', error);
    });
  }

  printReport(): void {
    this.router.navigate(['/businessowner/printreport']);
  }
}
