import { Component, OnInit } from '@angular/core';
import { AgCharts } from "ag-charts-angular";
import { AgChartOptions } from "ag-charts-community";
import { getData } from "./data";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-taxandfeesummary',
  standalone: true,
  imports: [ AgCharts ],
  templateUrl: './taxandfeesummary.component.html',
  styleUrl: './taxandfeesummary.component.css'
})
export class TaxandfeesummaryComponent {

  public options:AgChartOptions;

  constructor() {
    this.options = {
      data: getData(),
      series: [
        {
          type: "donut",
          calloutLabelKey: "asset",
          angleKey: "amount",
          innerRadiusRatio: 0.6,
        },
      ],
    };
   }
}
