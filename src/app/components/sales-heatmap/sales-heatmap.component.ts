import { Component, OnInit } from '@angular/core';
import { SalesService } from '../../services/sales.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { NgChartsModule } from 'ng2-charts';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sales-heatmap',
  standalone: true,
  imports: [CommonModule, FormsModule, AgGridModule, NgChartsModule],
  templateUrl: './sales-heatmap.component.html',
  styleUrls: ['./sales-heatmap.component.scss']
})

export class SalesHeatmapComponent implements OnInit {
  selectedYear: number = 2025;
  heatmapData: any[] = [];
  salesData: any[] = [];

  monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(private salesService: SalesService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadSalesData(this.selectedYear);
  }

  selectYear(year: number): void {
    this.selectedYear = year;
    this.loadSalesData(year);
  }

  loadSalesData(year: number): void {
    const companyId = this.authService.getCurrentUser()?.CompanyId;
    this.salesService.getSalesByYear(year).subscribe((data: any[]) => {
      if (companyId) {
        this.salesData = data.filter(sale => sale.companyId === companyId);
      } else {
        this.salesData = data;
      }
      this.generateHeatmapData();
    });
  }

  generateHeatmapData(): void {
    const rows = [];

    for (let month = 0; month < 12; month++) {
      const row = [];
      for (let day = 0; day < 31; day++) {
        const salesForDay = this.salesData.filter(sale => {
          const saleDate = new Date(sale.saleDate);
          return saleDate.getMonth() === month && saleDate.getDate() === day + 1;
        });

        const salesAmount = salesForDay.reduce((sum, sale) => sum + sale.amount, 0);
        row.push({
          sales: salesAmount,
          tooltipData: `Day ${day + 1}: $${salesAmount}`
        });
      }
      rows.push(row);
    }

    this.heatmapData = rows;
  }

  getIntensityClass(sales: number): string {
    if (sales === 0) {
      return 'intensity-none';
    } else if (sales < 2000) {
      return 'intensity-low';
    } else if (sales < 5000) {
      return 'intensity-medium';
    } else {
      return 'intensity-high';
    }
  }
}
