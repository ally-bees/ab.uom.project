import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintReportService {
  private reportData: any = null;

  setReportData(data: any): void {
    this.reportData = data;
    localStorage.setItem('print-report-data', JSON.stringify(data)); // ✅ store
  }

  getReportData(): any {
    if (this.reportData) return this.reportData;

    const stored = localStorage.getItem('print-report-data');
    return stored ? JSON.parse(stored) : null;
  }

  clearReportData(): void {
    this.reportData = null;
    localStorage.removeItem('print-report-data'); // ✅ clean
  }
}
