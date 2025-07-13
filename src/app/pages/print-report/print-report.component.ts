import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PrintReportService } from '../../services/printreport.service';
import { FormsModule } from '@angular/forms';

import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-print-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './print-report.component.html',
  styleUrls: ['./print-report.component.css']
})
export class PrintReportComponent implements OnInit {
  reportType: string = '';
  exportFormat: string = '';
  startDate: string = '';
  endDate: string = '';
  pageOrientation: string = 'Portrait';

  tableColumns: string[] = [];
  tableData: any[] = [];
  filteredData: any[] = [];

  filterStartDate: string = '';
  filterEndDate: string = '';

  constructor(
    private printReportService: PrintReportService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const state = this.printReportService.getReportData();
    console.log('Received State in Print Report:', state);

    if (state) {
      this.reportType = state['reportType'] || 'General Report';
      this.exportFormat = state['exportFormat'] || 'PDF Document (.pdf)';
      this.startDate = state['startDate'] || '';
      this.endDate = state['endDate'] || '';
      this.pageOrientation = state['pageOrientation'] || 'Portrait';
      this.tableColumns = state['tableColumns'] || [];
      this.tableData = state['tableData'] || [];
      this.filteredData = [...this.tableData];
      this.filterStartDate = this.startDate;
      this.filterEndDate = this.endDate;
    }
  }

  applyFilters(): void {
    if (!this.filterStartDate || !this.filterEndDate) {
      this.filteredData = [...this.tableData];
      return;
    }

    const start = new Date(this.filterStartDate);
    const end = new Date(this.filterEndDate);

    this.filteredData = this.tableData.filter(row => {
      const dateStr = row['Order Date'] || row['OrderDate'] || row['orderDate'];
      const rowDate = new Date(dateStr);
      return rowDate >= start && rowDate <= end;
    });

    // Update heading date range
    this.startDate = this.filterStartDate;
    this.endDate = this.filterEndDate;
  }

 generateReport(): void {
  const element = document.getElementById('reportContent');
  if (!element) {
    console.error('Report content element not found!');
    return;
  }

  const opt = {
    margin:       0.5,
    filename:     `${this.reportType.replace(/\s+/g, '_')}_${this.startDate}_${this.endDate}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: this.pageOrientation.toLowerCase() },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
  };

  html2pdf().from(element).set(opt).save();
}

  cancel(): void {
    this.printReportService.clearReportData();
    this.router.navigate(['/finance']);
  }
}
