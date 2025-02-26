import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SalesData } from '../../models/sales-data.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales-heatmap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-heatmap.component.html',
  styleUrls: ['./sales-heatmap.component.scss']
})
export class SalesHeatmapComponent {
  @Input() salesData!: SalesData;
  @Input() yearOptions: string[] = [];
  @Input() selectedYear: string = '';
  @Output() yearChange = new EventEmitter<string>();

  getMonths(): string[] {
    return Object.keys(this.salesData.months);
  }

  onYearSelect(year: string): void {
    this.yearChange.emit(year);
  }

  getCellColor(month: string, row: number): string {
    const cellData = this.salesData.months[month];
    if (!cellData) return '#eee';
    
    for (const [r, level] of cellData) {
      if (r === row) {
        return this.getColorForLevel(level);
      }
    }
    return '#eee';
  }

  getColorForLevel(level: number): string {
    switch(level) {
      case 0: return '#eee';
      case 1: return '#9BE9FF';
      case 2: return '#36B4F8';
      case 3: return '#0066FF';
      default: return '#eee';
    }
  }
}