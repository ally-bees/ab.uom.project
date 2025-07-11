import { Component,OnInit   } from '@angular/core';
import { AgCharts } from "ag-charts-angular";
import { AgChartOptions,AgBarSeriesOptions  } from "ag-charts-community";
import { getData } from "./data";
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
export class PurchasedetailsComponent implements OnInit{
  value3!: Date;
  public options: AgChartOptions = {
    data: [],
    series: [],
  };

  ngOnInit(): void {
    this.loadChartData();
  }

  

  constructor(private http: HttpClient) {}

loadChartData(): void {
  this.http.get<any[]>('http://localhost:5241/Customer/location-count')
    .subscribe((data) => {
      this.options = {
        width: 600,
        height: 400,
        data: data,
        series: [
          {
            type: 'bar',
            xKey: 'location',
            yKey: 'count',
            yName: 'Customer Count'
          },
        ],
      };
    });
}
}
