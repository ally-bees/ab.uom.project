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

// Component decorator defining selector, standalone usage, and required modules
@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, NgChartsModule, MatSnackBarModule],
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.scss']
})
export class FinanceComponent implements OnInit, AfterViewInit {

  // Access to the chart directive instance
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  // Date range for filtering
  fromDate: string | undefined;
  toDate: string | undefined;

  // Filtered invoices list
  filteredInvoices: Invoice[] = [];

  // UI state flags
  loading = false;
  error = false;

  // Line chart data configuration
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

  // Line chart options for appearance and behavior
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

  // Dependency injection for services
  constructor(
    private printReportService: PrintReportService,
    private financeService: FinanceService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  // Lifecycle hook: initializes default state and fetches finance data
  ngOnInit(): void {
    this.fromDate = undefined;
    this.toDate = undefined;
    this.fetchFinanceData();
  }

  // Lifecycle hook: triggers chart update after view initialization
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.chart?.update();
    }, 0);
  }

  // Formats a Date object into YYYY-MM-DD string format
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Filters the invoice list based on selected date range
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

  // Handles API call failures and shows error messages
  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.loading = false;
    this.error = true;
    this.showSnackBar(message);
  }

  // Displays a snackbar with a custom message
  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  // Fetches finance data from service, processes and updates chart and invoice list
  fetchFinanceData(): void {
    this.loading = true;
    this.error = false;

    this.financeService.getFinanceData().subscribe(
      data => {
        // Apply date filtering
        const filteredData = this.filterInvoicesFromData(data);

        // Map to accumulate income and expenses per month
        const monthMap = new Map<string, { income: number; expenses: number }>();

        // Iterate through filtered data and accumulate values
        filteredData.forEach(entry => {
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

        // Sort months and update chart labels
        const sortedKeys = Array.from(monthMap.keys()).sort();

        this.lineChartData.labels = sortedKeys.map(key => {
          const [year, month] = key.split('-').map(Number);
          return new Date(year, month - 1).toLocaleString('default', {
            month: 'short',
            year: 'numeric'
          });
        });

        // Update chart dataset values
        this.lineChartData.datasets[0].data = sortedKeys.map(
          key => monthMap.get(key)!.income
        );
        this.lineChartData.datasets[1].data = sortedKeys.map(
          key => monthMap.get(key)!.expenses
        );

        // Sort invoices by date (descending)
        this.filteredInvoices = filteredData.sort(
          (a, b) =>
            new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );

        this.loading = false;

        // Ensure chart and view updates
        this.cdr.detectChanges();
        this.chart?.update();
      },
      error => {
        // Handle error during data fetch
        this.handleError(
          '⚠️ Failed to fetch finance data. Please check your connection or try again later.',
          error
        );
      }
    );
  }

  // Triggered when user changes the date range
  onDateChange(): void {
    this.fetchFinanceData();
  }

  // Navigates to print report page
  printReport(): void {
    console.log('Filtered Invoices:', this.filteredInvoices); // 🔍 Check this
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
    'Order Date': invoice.orderDate // Should be already formatted
  }));

  console.log('Table Data to Pass:', tableData);

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
  this.printReportService.setReportData(reportPayload); // ✅ store the data
  // Optionally, you can remove the second navigation if not needed
  // this.router.navigate(['/businessowner/printreport']);
}

}
