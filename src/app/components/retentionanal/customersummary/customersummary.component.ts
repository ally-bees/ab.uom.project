import { Component } from '@angular/core';
import { AgCharts } from "ag-charts-angular";
import { AgChartOptions } from "ag-charts-community";
import { getData } from "./data";
import {customerservice} from './customer.service';

interface cus{
  active : number,
  inactive: number,
}

@Component({
  selector: 'app-customersummary',
  standalone: true,
  imports: [AgCharts],
  templateUrl: './customersummary.component.html',
  styleUrl: './customersummary.component.css',
  providers: [customerservice]
})
export class CustomersummaryComponent {

  cus: cus | null = null;
  
      ngOnInit(): void {
        this.getpur();
      }
    
      getpur(): void {
        this.customerservice.getpur().subscribe(records => {
          this.cus = records;
        });
      }
  
  public options:AgChartOptions;

  constructor(private customerservice:customerservice) {
    this.options = {
      data: getData(),
      series: [
        {
          type: "pie",
          angleKey: "amount",
        },
      ],
    };
  }
}
