import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auditstatustracker',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './auditstatustracker.component.html',
  styleUrls: ['./auditstatustracker.component.css']
})
export class AuditstatustrackerComponent implements OnInit {
  fiscalYears: string[] = [];
  selectedFY: string = '';
  statusCards: { month: string, year: number }[] = [];

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    for (let year = 2023; year <= currentYear + 1; year++) {
      this.fiscalYears.unshift(`FY ${year}-${year + 1}`);
    }
    this.selectFY(this.fiscalYears[0]); // Default to the latest fiscal year
  }

  selectFY(fy: string) {
    this.selectedFY = fy;
    const startYear = +fy.split(' ')[1].split('-')[0]; // Extract the start year from FY
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    this.statusCards = months.map(month => ({
      month,
      year: startYear
    }));
  }
}
