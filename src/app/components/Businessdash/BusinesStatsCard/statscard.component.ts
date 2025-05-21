// stats-card.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stats-card',
  standalone: true,
  templateUrl: './statscard.component.html',
  styleUrls: ['./statscard.component.scss']
})
export class BusinessStatsCardComponent {
  @Input() title: string = '';
  @Input() value: number|string = '';
  @Input() valueType: 'number' | 'currency' | 'percentage' = 'number';
  
  getFormattedValue(): string {
    if (this.valueType === 'currency') {
      return `Rs. ${(+this.value).toLocaleString()}`;
    } else if (this.valueType === 'percentage') {
      return `${this.value}%`;
    } else {
      return (+this.value).toLocaleString();
    }
  }
  
}