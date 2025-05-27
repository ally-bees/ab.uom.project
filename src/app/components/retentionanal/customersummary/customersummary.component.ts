import { Component,OnInit } from '@angular/core';
import { AgCharts } from "ag-charts-angular";
import { AgChartOptions } from "ag-charts-community";
import { customerservice, cusdetail} from './customer.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customersummary',
  standalone: true,
  imports: [AgCharts,CommonModule],
  templateUrl: './customersummary.component.html',
  styleUrl: './customersummary.component.css',
  providers: [customerservice]
})


export class CustomersummaryComponent implements OnInit {

  cusdetail: cusdetail | null = null;
  errorMessage = '';
  public options:AgChartOptions = {
    data: [],
   series: [],
  }
  
      ngOnInit(): void {
        this.customerservice.getpur().subscribe({
      next: (data) => {
        this.cusdetail = data;
        this.setChartOptions(data);
      },
      error: (error) => {
        this.errorMessage = error.error || 'Failed to load customer summary.';
      }
    });
      }
    
  

  constructor(private customerservice:customerservice) {}
  
  private setChartOptions(data: cusdetail): void{
    this.options = {
      width: 300,
      height: 250,
      data: [
         { asset: "Active", amount: data.aCount },
        { asset: "In-active", amount: data.iaCount },
      ],
      series: [
        {
          type: "pie",
          angleKey: "amount",
          fills: ["#F9F06A", "#FF4B4B"]
        },
      ],
    };
  }
}
