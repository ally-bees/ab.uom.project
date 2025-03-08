// sales-insight.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales-insight',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-insight.component.html',
  styleUrls: ['./sales-insight.component.scss']
})
export class SalesInsightComponent implements OnInit {
  profitPercentage: number = 50;
  
  constructor() { }
  
  ngOnInit(): void {
    // This will be populated from your API when ready
  }
  
  // Calculate the circle's stroke-dasharray for the progress indicator
  getCircleStyle(): object {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const dashArray = circumference;
    const dashOffset = circumference * (1 - this.profitPercentage / 100);
    
    return {
      'stroke-dasharray': `${dashArray}`,
      'stroke-dashoffset': `${dashOffset}`
    };
  }
}