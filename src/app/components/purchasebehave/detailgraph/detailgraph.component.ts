import { Component } from '@angular/core';
import { AgCharts } from "ag-charts-angular";
import { AgChartOptions } from "ag-charts-community";
import { getData } from "./data";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detailgraph',
  standalone: true,
  imports: [AgCharts],
  templateUrl: './detailgraph.component.html',
  styleUrl: './detailgraph.component.css'
})
export class DetailgraphComponent {
  productId: string = '';
  year: number = 2025;
  options: AgChartOptions = { data: [], series: [] };

  constructor(private http: HttpClient) {}

  selectProduct(pid: string) {
    this.productId = pid;
    this.fetchData();
  }

  selectYear(y: number) {
    this.year = y;
    this.fetchData();
  }

  fetchData() {
    if (!this.productId || !this.year) return;

    const url = `http://localhost:5000/customer/monthly-product-purchase?productId=${this.productId}&year=${this.year}`;

    this.http.get<{ [key: string]: number }>(url).subscribe((response) => {
      const data = Object.entries(response).map(([month, value]) => ({
        month,
        subscriptions: value
      }));

      this.options = {
        data,
        series: [
          {
            type: 'area',
            xKey: 'month',
            yKey: 'subscriptions',
            yName: 'Subscriptions'
          }
        ]
      };
    });
  }
}
