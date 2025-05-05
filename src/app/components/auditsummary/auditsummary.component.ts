import { Component, OnInit } from '@angular/core';
import { AgChartsModule } from 'ag-charts-angular';  // Import this
import { AgCharts  } from 'ag-charts-angular';
import { barchartService } from './auditsummary.service';
import { AgChartOptions } from 'ag-charts-community'; // Import correct type

@Component({
  selector: 'app-auditsummary',
  standalone: true,
  imports: [ AgChartsModule,AgCharts ],
  templateUrl: './auditsummary.component.html',
  styleUrl: './auditsummary.component.css'
})
export class AuditsummaryComponent implements OnInit {

  tax1: number = 0;
  tax2: number = 0;
  tax3: number = 0;

  currentYear: number = new Date().getFullYear();
  lastYear: number = this.currentYear - 1;
  twoYearsAgo: number = this.currentYear - 2;

  options: AgChartOptions;

  constructor(private barchartService: barchartService){
    // Initialize with default options
    this.options = this.createChartOptions(0, 0, 0);
  }


  ngOnInit() {
    this.barchartService.getLastThreeYearTaxSum().subscribe(data => {
      this.tax1 = data[this.currentYear.toString()] || 0;
      this.tax2 = data[this.lastYear.toString()] || 0;
      this.tax3 = data[this.twoYearsAgo.toString()] || 0;    
      console.log(this.currentYear,this.tax1,this.lastYear,this.tax2,this.twoYearsAgo,this.tax3);

      this.options = this.createChartOptions(this.tax1, this.tax2, this.tax3);

    });
  }

  createChartOptions(tax1: number, tax2: number, tax3: number): AgChartOptions {
    return {
    data: [
      { 
        quarter: 'Annual Tax',
          [this.currentYear.toString()]: tax1, 
          [this.lastYear.toString()]: tax2, 
          [this.twoYearsAgo.toString()]: tax3 
      },    
    ],
      series: [
        {
          type: 'bar',
          direction: 'horizontal',
          xKey: 'quarter',
          yKey: this.currentYear.toString(),
          yName: this.currentYear.toString(),
        },
        {
          type: 'bar',
          direction: 'horizontal',
          xKey: 'quarter',
          yKey: this.lastYear.toString(),
          yName: this.lastYear.toString(),
        },
        {
          type: 'bar',
          direction: 'horizontal',
          xKey: 'quarter',
          yKey: this.twoYearsAgo.toString(),
          yName: this.twoYearsAgo.toString(),
        },
      ],
  };
  }
}

