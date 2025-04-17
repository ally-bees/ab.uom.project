import { Component, OnInit } from '@angular/core';
import { AgCharts } from "ag-charts-angular";
import { AgChartOptions } from "ag-charts-community";
import { CommonModule } from '@angular/common';
import { TaxSummaryService } from './taxandfeesummary.service';
import { FormsModule } from '@angular/forms';


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


  constructor(private TaxSummaryService:TaxSummaryService) {
    this.option1 = { data: [], series: [{ type: "donut", angleKey: "amount", innerRadiusRatio: 0.6 , fills: ["#FF5B5B", "#ff5b5b67"]}] };
    this.option2 = { data: [], series: [{ type: "donut", angleKey: "amount", innerRadiusRatio: 0.6 , fills: ["#00B074", "#00b0754f"] }] };
    this.option3 = { data: [], series: [{ type: "donut", angleKey: "amount", innerRadiusRatio: 0.6 , fills: ["#2D9CDB", "#2d9bdb66"] }] };
   };

  ngOnInit(): void {
    console.log("ngOnInit called"); // Add this line temporarily
    this.TaxSummaryService.getTotals().subscribe(data => {
      this.totalValue = data.TotalValue;
      this.totalTax = data.TotalTax;
      this.totalNetValue = data.TotalNetValue;
    
      this.updateChartData();
    });    
  }

  fetchChartData() {
    if (!this.fromDate || !this.toDate) {
      return; // Don't call the API if dates are incomplete
    }
  
    console.log("Requesting data from:", `From: ${this.fromDate}, To: ${this.toDate}`);
  
    this.TaxSummaryService.getChartData(this.fromDate, this.toDate).subscribe(
      data => {
        console.log("Received data:", data);
        this.option1 = data.option1;
        this.option2 = data.option2;
        this.option3 = data.option3;
      },
      error => {
        console.error("Error fetching data", error);
      }
    );
  }
  


  updateChartData(): void {
    this.option1 = {
      ...this.option1,
      data: [
        { asset: "Total Tax", amount: this.totalValue },
        { asset: "Other", amount: this.totalTax + this.totalNetValue + this.totalValue }
      ]
    };

    this.option2 = {
      ...this.option2,
      data: [
        { asset: "Total Tax", amount: this.totalTax },
        { asset: "Other", amount: this.totalTax + this.totalNetValue + this.totalValue }
      ]
    };

    this.option3 = {
      ...this.option3,
      data: [
        { asset: "Total Netvalue", amount: this.totalNetValue },
        { asset: "Other", amount: this.totalTax + this.totalNetValue + this.totalValue }
      ]
    };
  }  
}
