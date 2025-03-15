import { Component } from '@angular/core';
import { AgChartsModule } from 'ag-charts-angular';  // Import this
import { AgCharts  } from 'ag-charts-angular';
@Component({
  selector: 'app-auditsummary',
  standalone: true,
  imports: [ AgChartsModule,AgCharts ],
  templateUrl: './auditsummary.component.html',
  styleUrl: './auditsummary.component.css'
})
export class AuditsummaryComponent {
  options: AgChartsModule = {
    data: [
      { quarter: 'Q1', Completed: 12, InProgress: 6, Pending: 5},
    ],
    series: [
      {
        type: 'bar',  // Set the type to 'bar' for a bar chart
        direction: 'horizontal',
        xKey: 'quarter',
        yKey: 'Completed',
        yName: 'In-Progress'
      },
      {
        type: 'bar',  // Another series for example
        direction: 'horizontal',
        xKey: 'quarter',
        yKey: 'Completed',
        yName: 'In-Progress'
      },
      {
        type: 'bar',  // Another series for example
        direction: 'horizontal',
        xKey: 'quarter',
        yKey: 'Completed',
        yName: 'In-Progress'
      }
    ]
  };
}
