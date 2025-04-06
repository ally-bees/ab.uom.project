import { Component  } from '@angular/core';
import { AgCharts } from "ag-charts-angular";
import { AgChartOptions } from "ag-charts-community";
import { getData } from "./data";
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-purchasedetails',
  standalone:true,
  imports: [
    AgCharts,
    ReactiveFormsModule
  ],
  templateUrl: './purchasedetails.component.html',
  styleUrl: './purchasedetails.component.css',
})
export class PurchasedetailsComponent {
  value3!: Date;
  public options:AgChartOptions;

  constructor() {
    this.options = {
      data: getData(),
      series: [
        {
          type: "bar",
          xKey: "quarter",
          yKey: "colombo",
          yName: "colombo",
        },
      ],
    };
  }
}
