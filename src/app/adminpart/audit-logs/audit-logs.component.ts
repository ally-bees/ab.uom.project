
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../pages/header/header.component';
import { SidebarComponent } from '../../pages/sidebar/sidebar.component';
import { FooterComponent } from "../../footer/footer.component";
import { AuditLogService, AuditLog, AuditLogFilter } from '../../services/audit-log.service';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.css']
})
export class AuditLogsComponent implements OnInit {
  logs: AuditLog[] = [];
  loading = false;
  error: string | null = null;
  
  // Filter properties
  searchText = '';
  selectedStatus = '';
  selectedCategory = '';
  fromDate: string = '';
  toDate: string = '';
  
  // Pagination
  currentPage = 1;
  pageSize = 20;
  totalPages = 0;
  totalCount = 0;
  
  // Dropdown options
  statuses: string[] = [];
  categories: string[] = [];
  
  // Statistics
  statistics: { [key: string]: number } = {};
  
  constructor(private auditLogService: AuditLogService) { }

  ngOnInit(): void {
    this.loadDropdownOptions();
    this.loadLogs();
    this.loadStatistics();
    
    // Add some mock data for testing
    this.addMockData();
  }

  addMockData(): void {
    // Temporary mock data to test the display
    this.logs = [
      {
        id: '1',
        action: 'User Login',
        user: 'admin@example.com',
        timestamp: new Date(),
        status: 'Success',
        category: 'Authentication',
        severity: 'Info',
        ipAddress: '192.168.1.100',
        details: 'Admin user successfully logged in'
      },
      {
        id: '2',
        action: 'Permission Change',
        user: 'admin@example.com',
        timestamp: new Date(Date.now() - 3600000),
        status: 'Success',
        category: 'User Management',
        severity: 'Info',
        ipAddress: '192.168.1.100',
        details: 'Updated user permissions for john.doe@example.com'
      },
      {
        id: '3',
        action: 'Login Failed',
        user: 'unknown@example.com',
        timestamp: new Date(Date.now() - 1800000),
        status: 'Failed',
        category: 'Authentication',
        severity: 'Warning',
        ipAddress: '192.168.1.200',
        details: 'Invalid password attempt'
      }
    ];
    this.totalCount = this.logs.length;
    this.totalPages = 1;
    this.statistics = {
      'Success': 2,
      'Failed': 1,
      'Warning': 0,
      'Error': 0
    };
  }

  loadDropdownOptions(): void {
    this.auditLogService.getStatuses().subscribe({
      next: (statuses) => this.statuses = statuses,
      error: (error) => console.error('Error loading statuses:', error)
    });

    this.auditLogService.getCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: (error) => console.error('Error loading categories:', error)
    });
  }

  loadLogs(): void {
    this.loading = true;
    this.error = null;

    const filter: AuditLogFilter = {
      page: this.currentPage,
      pageSize: this.pageSize,
      search: this.searchText || undefined,
      status: this.selectedStatus || undefined,
      category: this.selectedCategory || undefined,
      fromDate: this.fromDate ? new Date(this.fromDate) : undefined,
      toDate: this.toDate ? new Date(this.toDate) : undefined
    };

    this.auditLogService.getLogs(filter).subscribe({
      next: (response) => {
        this.logs = response.logs;
        this.currentPage = response.pagination.currentPage;
        this.totalPages = response.pagination.totalPages;
        this.totalCount = response.pagination.totalCount;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load audit logs';
        this.loading = false;
        console.error('Error loading logs:', error);
      }
    });
  }

  loadStatistics(): void {
    const fromDate = this.fromDate ? new Date(this.fromDate) : undefined;
    const toDate = this.toDate ? new Date(this.toDate) : undefined;

    this.auditLogService.getStatistics(fromDate, toDate).subscribe({
      next: (stats) => this.statistics = stats,
      error: (error) => console.error('Error loading statistics:', error)
    });
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadLogs();
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadLogs();
    this.loadStatistics();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadLogs();
    }
  }

  exportLogs(): void {
    const fromDate = this.fromDate ? new Date(this.fromDate) : undefined;
    const toDate = this.toDate ? new Date(this.toDate) : undefined;

    this.auditLogService.exportLogs(fromDate, toDate, 'csv').subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        this.error = 'Failed to export logs';
        console.error('Error exporting logs:', error);
      }
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedStatus = '';
    this.selectedCategory = '';
    this.fromDate = '';
    this.toDate = '';
    this.currentPage = 1;
    this.loadLogs();
    this.loadStatistics();
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'success': return 'success';
      case 'failed': 
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'pending': return 'pending';
      default: return 'default';
    }
  }

  getSeverityClass(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'critical': return 'critical';
      default: return 'info';
    }
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleString();
  }

  // Helper methods for template
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  mathMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  getPaginationArray(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}