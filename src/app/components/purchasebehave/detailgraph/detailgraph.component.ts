import { Component } from '@angular/core';
import { AgCharts } from "ag-charts-angular";
import { AgChartOptions } from "ag-charts-community";
import { getData } from "./data";

@Component({
  selector: 'app-detailgraph',
  standalone:true,
  imports: [
    AgCharts,
  ],
  templateUrl: './detailgraph.component.html',
  styleUrl: './detailgraph.component.css'
})
export class DetailgraphComponent {
  public options:AgChartOptions;
  
  constructor() {
    this.options = {
      data: getData(),
      series: [
        {
          type: "area",
          xKey: "month",
          yKey: "subscriptions",
          yName: "Subscriptions",
        }
      ],
    };
  }
}