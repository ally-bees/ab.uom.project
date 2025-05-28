import { Component, OnInit } from '@angular/core';
import { AgCharts } from "ag-charts-angular";
import { AgChartOptions } from "ag-charts-community";
import { CommonModule } from '@angular/common';
import { TaxSummaryService } from './taxandfeessummary.service';
import { FormsModule } from '@angular/forms';
import { DateRangeService } from '../date-rangeaudit.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-taxandfeesummary',
  standalone: true,
  imports: [ AgCharts,FormsModule ],
  templateUrl: './taxandfeesummary.component.html',
  styleUrl: './taxandfeesummary.component.css'
})

export class TaxandfeesummaryComponent implements OnInit {

  fromDate: string = '';
  toDate: string = '';


  totalValue!: number;
  totalTax!: number;
  totalNetValue!: number;

  public option1:AgChartOptions;
  public option2:AgChartOptions;
  public option3:AgChartOptions;


  constructor(private TaxSummaryService:TaxSummaryService,private dateRangeService: DateRangeService,private route: ActivatedRoute) {
    this.option1 = { data: [], series: [{ type: "donut", angleKey: "amount", innerRadiusRatio: 0.6 , fills: ["#FF5B5B", "#ff5b5b67"]}] };
    this.option2 = { data: [], series: [{ type: "donut", angleKey: "amount", innerRadiusRatio: 0.6 , fills: ["#00B074", "#00b0754f"] }] };
    this.option3 = { data: [], series: [{ type: "donut", angleKey: "amount", innerRadiusRatio: 0.6 , fills: ["#2D9CDB", "#2d9bdb66"] }] };
   };

   ngOnInit(): void {
    // Subscribe to query parameters changes
    this.route.queryParams.subscribe(params => {
      const year = params['year'];
      let month = params['month'];

      if (year && month) {
        // Convert month name to number if it's a string name
        if (isNaN(+month)) {
          const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ];
          month = (monthNames.indexOf(month) + 1).toString().padStart(2, '0');
        } else {
          // Ensure month is two-digit
          month = (+month).toString().padStart(2, '0');
        }

        // Calculate the last day of the month
        const lastDay = new Date(+year, +month, 0).getDate();
        
        this.fromDate = `${year}-${month}-01`;
        this.toDate = `${year}-${month}-${lastDay}`;

        console.log(`Setting date range: ${this.fromDate} to ${this.toDate}`);
        
        // Update date range service
        this.dateRangeService.updateDateRange(this.fromDate, this.toDate);
        
        // Fetch data with the new date range
        this.fetchChartData();
      } else {
        // If no query parameters, use default data
        this.DefaultData();
      }
    });
  }


  ChartData(): void {
    console.log('From Date:', this.fromDate);
    console.log('To Date:', this.toDate);

    if (this.fromDate && this.toDate) {

      this.TaxSummaryService.getTotals(this.fromDate, this.toDate).subscribe(data => {
        this.totalValue = data.TotalValue;
        this.totalTax = data.TotalTax;
        this.totalNetValue = data.TotalNetValue;
        console.log(this.totalValue,this.totalTax,this.totalNetValue);
        this.updateChartData(); // Update the chart data after fetching
      }, error => {
        console.error("Error fetching tax records:", error);
      });
    }
  }

  DefaultData(): void {
    console.log("Fetching default data");
    this.TaxSummaryService.getTotals().subscribe(data => {
      this.totalValue = data.TotalValue;
      this.totalTax = data.TotalTax;
      this.totalNetValue = data.TotalNetValue;
      console.log(this.totalValue,this.totalTax,this.totalNetValue);
      this.updateChartData(); // Update the chart data after fetching default data
    }, error => {
      console.error("Error fetching default tax records:", error);
    });
  }


  fetchChartData(): void {
    console.log("Fetching chart data with the selected dates:", this.fromDate, this.toDate);
    if (this.fromDate && this.toDate) {
      this.dateRangeService.updateDateRange(this.fromDate, this.toDate);
      this.ChartData();
    }
  }


  updateChartData(): void {
    this.option1 = {
      ...this.option1,
      data: [
        { asset: "Total Tax", amount: this.totalValue },
        { asset: "Other", amount: this.totalTax +  this.totalValue }
      ]
    };

    this.option2 = {
      ...this.option2,
      data: [
        { asset: "Total Tax", amount: this.totalTax },
        { asset: "Other", amount: this.totalNetValue + this.totalValue }
      ]
    };

    this.option3 = {
      ...this.option3,
      data: [
        { asset: "Total Netvalue", amount: this.totalNetValue },
        { asset: "Other", amount: this.totalTax + this.totalValue }
      ]
    };
  }  
}