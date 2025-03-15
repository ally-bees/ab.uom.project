// finance-flow.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finance-flow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './financeflow.component.html',
  styleUrls: ['./financeflow.component.scss']
})
export class FinanceFlowComponent implements OnInit {
  amount: number = 2908;
  month: string = 'August 2024';
  chartData: number[] = [];
  
  constructor() { }
  
  ngOnInit(): void {
    // Generate random data for the chart
    // This will be replaced with real data from your API
    this.generateMockData();
  }
  
  private generateMockData(): void {
    // Generate random data for the chart
    this.chartData = Array(30).fill(0).map(() => Math.floor(Math.random() * 50) + 10);
  }
}