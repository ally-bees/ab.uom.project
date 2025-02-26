import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-print-report',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './print-report.component.html',
  styleUrl: './print-report.component.css'
})
export class PrintReportComponent {
  constructor() {}

  printReport(): void {
    window.print();
  }

  close(): void {
    // This will be handled by the parent component
  }
}