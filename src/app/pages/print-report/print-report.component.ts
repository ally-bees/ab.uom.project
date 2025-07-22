import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PrintReportService } from '../../services/printreport.service';
import { FormsModule } from '@angular/forms';

import html2pdf from 'html2pdf.js';

// Chart.js will be dynamically imported when needed

@Component({
  selector: 'app-print-report',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './print-report.component.html',
  styleUrls: ['./print-report.component.css']
})
export class PrintReportComponent implements OnInit, AfterViewInit {
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
  
  // Properties for Courier report
  isCourierReport: boolean = false;
  summaryData: any = null;
  chartInstance: any = null;

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
      
      // Check if this is a courier report
      this.isCourierReport = this.reportType.toLowerCase().includes('courier');
      
      // Get summary data if available
      if (state['summaryData']) {
        this.summaryData = state['summaryData'];
      }
    }
  }
  
  ngAfterViewInit(): void {
    // Initialize chart after view is ready
    setTimeout(() => {
      if (this.isCourierReport && this.summaryData) {
        this.initCourierChart();
      }
    }, 500);
  }
  
  /**
   * Initialize the courier pie chart
   */
  initCourierChart(): void {
    if (!this.summaryData) return;
    
    const canvas = document.getElementById('courierChart') as HTMLCanvasElement;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Import Chart.js dynamically
    import('chart.js').then(Chart => {
      // Destroy existing chart if it exists
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      
      // Create the chart
      this.chartInstance = new Chart.Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Pending', 'Completed', 'Rejected'],
          datasets: [{
            data: [
              this.summaryData.pending || 0,
              this.summaryData.completed || 0, 
              this.summaryData.rejected || 0
            ],
            backgroundColor: this.summaryData.chartColors?.backgroundColor || ['#FFC107', '#4CAF50', '#F44336'],
            borderColor: this.summaryData.chartColors?.borderColor || ['#FFD54F', '#81C784', '#E57373'],
            borderWidth: 2,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 15,
                padding: 15
              }
            }
          }
        }
      });
    }).catch(err => {
      console.error('Error loading Chart.js:', err);
    });
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
    html2canvas:  { 
      scale: 2,
      // These options help ensure the chart is properly rendered
      useCORS: true,
      allowTaint: true,
      logging: true
    },
    jsPDF:        { unit: 'in', format: 'a4', orientation: this.pageOrientation.toLowerCase() },
    pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
  };
  
  // For courier reports, make sure the chart is rendered before generating PDF
  if (this.isCourierReport && this.chartInstance) {
    // Update the chart one more time just to be sure
    this.chartInstance.update();
    
    // Short delay to ensure chart rendering is complete
    setTimeout(() => {
      html2pdf().from(element).set(opt).save();
    }, 250);
  } else {
    // For other reports, generate PDF immediately
    html2pdf().from(element).set(opt).save();
  }
}

  cancel(): void {
    const reportData = this.printReportService.getReportData();
    
    // Navigate back based on report type with query params for date ranges
    if (this.isCourierReport) {
      // For courier reports, preserve the date ranges in query parameters
      this.router.navigate(['/courier'], { 
        queryParams: { 
          fromDate: this.startDate,
          toDate: this.endDate
        }
      });
    } else {
      this.router.navigate(['/finance']);
    }
    
    // Don't clear report data until after navigation to preserve parameters
    setTimeout(() => {
      this.printReportService.clearReportData();
    }, 100);
  }
  
  /**
   * Get CSS class for status display
   */
  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('complete')) return 'completed';
    if (statusLower.includes('pending')) return 'pending';
    if (statusLower.includes('reject')) return 'rejected';
    return '';
  }
}
