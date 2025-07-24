import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService } from '../../services/audit.service';

interface AuditYearData {
  year: number;
  firstAudit: string;
  lastAudit: string;
  count: number;
  totalTax: number;
}

@Component({
  selector: 'app-pastaudit',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pastaudit.component.html',
  styleUrls: ['./pastaudit.component.css']
})
export class PastauditComponent implements OnInit {
  auditYears: AuditYearData[] = [];
  loading = true;
  error: string | null = null;

  constructor(private auditService: AuditService) {}

  ngOnInit(): void {
    this.loadAuditStatistics();
  }

  private loadAuditStatistics(): void {
    this.auditService.getAuditStatistics().subscribe({
      next: (stats) => {
        this.auditYears = Object.entries(stats).map(([year, data]) => ({
          year: +year,
          firstAudit: data.firstAudit,
          lastAudit: data.lastAudit,
          count: data.count,
          totalTax: data.totalTax
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load audit statistics', err);
        this.error = 'Failed to load audit statistics. Please try again later.';
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
}
