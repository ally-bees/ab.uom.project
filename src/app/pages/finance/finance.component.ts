import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { FinanceService } from '../../services/finance.service';
import { PrintReportService } from '../../services/printreport.service';
import { Invoice } from '../../models/invoice.model';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, NgChartsModule, MatSnackBarModule],
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit, AfterViewInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  fromDate: string | undefined;
  toDate: string | undefined;
  filteredInvoices: Invoice[] = [];

  loading = false;
  error = false;

  currentPage = 1;
  itemsPerPage = 10;

  get paginatedInvoices(): Invoice[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredInvoices.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredInvoices.length / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

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
          label: (tooltipItem) =>
            `${tooltipItem.dataset.label}: ${tooltipItem.raw}`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: false, grid: { display: false } }
    }
  };

  constructor(
    private printReportService: PrintReportService,
    private financeService: FinanceService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const today = new Date();
this.toDate = this.formatDate(today);

const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
this.fromDate = this.formatDate(startOfMonth);

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

  filterInvoicesFromData(data: Invoice[]): Invoice[] {
    if (!this.fromDate && !this.toDate) return data;

    const from = this.fromDate ? new Date(this.fromDate) : null;
    const to = this.toDate ? new Date(this.toDate) : null;

    return data.filter(invoice => {
      const orderDate = new Date(invoice.orderDate);
      if (from && orderDate < from) return false;
      if (to && orderDate > to) return false;
      return true;
    });
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.loading = false;
    this.error = true;
    this.showSnackBar(message);
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  fetchFinanceData(): void {
    this.loading = true;
    this.error = false;

    this.financeService.getFinanceData().subscribe(
      data => {
        const filteredData = this.filterInvoicesFromData(data);
        const dynamicMap = new Map<string, { income: number; expenses: number }>();

        const fromDate = this.fromDate ? new Date(this.fromDate) : null;
        const toDate = this.toDate ? new Date(this.toDate) : null;

        const groupByDay =
          fromDate &&
          toDate &&
          (fromDate.toDateString() === toDate.toDateString() ||
            (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24) <= 31);

        const formatKey = (date: Date) =>
          groupByDay
            ? date.toISOString().split('T')[0]
            : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        const labelFormat = (key: string): string => {
          const parts = key.split('-');
          if (parts.length === 2) {
            return new Date(+parts[0], +parts[1] - 1).toLocaleString('default', {
              month: 'short',
              year: 'numeric'
            });
          } else {
            return new Date(key).toLocaleDateString();
          }
        };

        filteredData.forEach(entry => {
          const date = new Date(entry.orderDate);
          if (isNaN(date.getTime())) return;

          const key = formatKey(date);
          if (!dynamicMap.has(key)) {
            dynamicMap.set(key, { income: 0, expenses: 0 });
          }

          const current = dynamicMap.get(key)!;
          if (entry.status?.toLowerCase() === 'income') {
            current.income += entry.amount;
          } else if (entry.status?.toLowerCase() === 'expense') {
            current.expenses += entry.amount;
          }
        });

        const finalKeys = Array.from(dynamicMap.keys()).sort();

        this.lineChartData.labels = finalKeys.map(labelFormat);
        this.lineChartData.datasets[0].data = finalKeys.map(key => dynamicMap.get(key)!.income);
        this.lineChartData.datasets[1].data = finalKeys.map(key => dynamicMap.get(key)!.expenses);

        this.filteredInvoices = filteredData.sort(
          (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );

        this.currentPage = 1; // Reset to first page on new fetch
        this.loading = false;
        this.cdr.detectChanges();
        this.chart?.update();
      },
      error => {
        this.handleError(
          '⚠️ Failed to fetch finance data. Please check your connection or try again later.',
          error
        );
      }
    );
  }

  onDateChange(): void {
    this.fetchFinanceData();
  }

  printReport(): void {
    console.log('Filtered Invoices:', this.filteredInvoices);
    if (!this.filteredInvoices || this.filteredInvoices.length === 0) {
      alert('No data available to print.');
      return;
    }

    const tableColumns = ['Finance ID', 'Amount', 'Status', 'Order Date'];

    const tableData = this.filteredInvoices.map(invoice => ({
      'Finance ID': invoice.financeId,
      'Sales IDs': invoice.salesId?.join(', '),
      'Campal IDs': invoice.campalId?.join(', '),
      'Amount': invoice.amount.toFixed(2),
      'Status': invoice.status,
      'Order Date': invoice.orderDate
    }));

    const reportPayload = {
      reportType: 'Finance Report',
      exportFormat: 'PDF Document (.pdf)',
      startDate: this.fromDate,
      endDate: this.toDate,
      pageOrientation: 'Portrait',
      tableColumns,
      tableData
    };

    this.router.navigate(['/businessowner/printreport'], {
      state: reportPayload
    });

    this.printReportService.setReportData(reportPayload);
  }

}
