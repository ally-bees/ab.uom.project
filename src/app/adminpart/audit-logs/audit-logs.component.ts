
import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HeaderComponent } from '../../pages/header/header.component';
import { FooterComponent } from "../../footer/footer.component";
import { AuditLogService, AuditLog, AuditLogFilter, AuditLogSummary } from '../../services/audit-log.service';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-audit-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.css']
})
export class AuditLogsComponent implements OnInit, OnDestroy {
  auditLogs: AuditLog[] = [];
  summary: AuditLogSummary | null = null;
  filterForm: FormGroup;
  loading = false;
  currentPage = 1;
  pageSize = 50;
  totalPages = 0;
  totalCount = 0;
  
  // Filter options
  actionTypes: string[] = [];
  resources: string[] = [];
  statuses: string[] = [];
  severities: string[] = [];
  modules: string[] = [];
  
  // UI state
  showFilters = false;
  showDetails = false;
  selectedLog: AuditLog | null = null;
  autoRefresh = false;
  refreshInterval: any;
  
  private destroy$ = new Subject<void>();

  constructor(
    private auditLogService: AuditLogService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      fromDate: [''],
      toDate: [''],
      username: [''],
      actionType: [''],
      resource: [''],
      status: [''],
      severity: [''],
      module: ['']
    });
  }

  ngOnInit(): void {
    this.loadFilterOptions();
    this.loadAuditLogs();
    this.loadSummary();
    this.setupFormListeners();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  private setupFormListeners(): void {
    this.filterForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.loadAuditLogs();
      });
  }

  private setupAutoRefresh(): void {
    this.auditLogService.refresh$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadAuditLogs();
        this.loadSummary();
      });
  }

  private loadFilterOptions(): void {
    // Load distinct values for filter dropdowns
    this.auditLogService.getDistinctValues('actionType').subscribe(types => this.actionTypes = types);
    this.auditLogService.getDistinctValues('resource').subscribe(resources => this.resources = resources);
    this.auditLogService.getDistinctValues('status').subscribe(statuses => this.statuses = statuses);
    this.auditLogService.getDistinctValues('severity').subscribe(severities => this.severities = severities);
    this.auditLogService.getDistinctValues('module').subscribe(modules => this.modules = modules);
  }

  private loadAuditLogs(): void {
    this.loading = true;
    const filter: AuditLogFilter = {
      ...this.filterForm.value,
      page: this.currentPage,
      pageSize: this.pageSize
    };

    console.log('Loading audit logs with filter:', filter);

    this.auditLogService.getAuditLogs(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Audit logs response:', response);
          this.auditLogs = response.logs;
          this.totalCount = response.pagination.totalCount;
          this.totalPages = response.pagination.totalPages;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading audit logs:', error);
          this.loading = false;
          // Show user-friendly error message
          alert('Failed to load audit logs. Please check your connection and try again.');
        }
      });
  }

  private loadSummary(): void {
    const filterValues = this.filterForm.value;
    this.auditLogService.getAuditLogSummary(filterValues.fromDate, filterValues.toDate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (summary) => {
          console.log('Summary response:', summary);
          this.summary = summary;
        },
        error: (error) => {
          console.error('Error loading summary:', error);
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadAuditLogs();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.currentPage = 1;
    this.loadAuditLogs();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadAuditLogs();
    this.loadSummary();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  showLogDetails(log: AuditLog): void {
    this.selectedLog = log;
    this.showDetails = true;
  }

  closeDetails(): void {
    this.showDetails = false;
    this.selectedLog = null;
  }

  exportLogs(): void {
    const filterValues = this.filterForm.value;
    this.auditLogService.exportAuditLogs(filterValues.fromDate, filterValues.toDate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const filename = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
          this.auditLogService.downloadCsv(blob, filename);
        },
        error: (error) => {
          console.error('Error exporting logs:', error);
        }
      });
  }

  refreshData(): void {
    this.loadAuditLogs();
    this.loadSummary();
  }

  toggleAutoRefresh(): void {
    this.autoRefresh = !this.autoRefresh;
    if (this.autoRefresh) {
      this.refreshInterval = setInterval(() => {
        this.refreshData();
      }, 30000); // Refresh every 30 seconds
    } else {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval);
        this.refreshInterval = null;
      }
    }
  }

  cleanupOldLogs(): void {
    const beforeDate = new Date();
    beforeDate.setMonth(beforeDate.getMonth() - 6); // Keep last 6 months
    
    if (confirm(`This will delete all audit logs older than ${beforeDate.toLocaleDateString()}. Continue?`)) {
      this.auditLogService.cleanupOldLogs(beforeDate)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (result) => {
            alert('Cleanup completed successfully');
            this.refreshData();
          },
          error: (error) => {
            console.error('Error during cleanup:', error);
            alert('Error during cleanup');
          }
        });
    }
  }

  createTestData(): void {
    if (confirm('This will create sample audit log data for testing. Continue?')) {
      this.loading = true;
      
      // Call the test endpoint directly
      fetch(`${environment.apiUrl}/api/auditlog/test`)
        .then(response => response.json())
        .then(data => {
          console.log('Test data created:', data);
          alert(`Test data created successfully! ${data.count} audit logs added.`);
          this.refreshData();
        })
        .catch(error => {
          console.error('Error creating test data:', error);
          alert('Failed to create test data. Please check your backend connection.');
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }

  getStatusColor(status: string): string {
    return this.auditLogService.getStatusColor(status);
  }

  getSeverityColor(severity: string): string {
    return this.auditLogService.getSeverityColor(severity);
  }

  formatTimestamp(timestamp: Date | string): string {
    return this.auditLogService.formatTimestamp(timestamp);
  }

  getActionIcon(actionType: string): string {
    switch (actionType.toLowerCase()) {
      case 'login':
        return 'fas fa-sign-in-alt';
      case 'logout':
        return 'fas fa-sign-out-alt';
      case 'create':
        return 'fas fa-plus';
      case 'update':
        return 'fas fa-edit';
      case 'delete':
        return 'fas fa-trash';
      case 'export':
        return 'fas fa-download';
      case 'import':
        return 'fas fa-upload';
      case 'error':
        return 'fas fa-exclamation-triangle';
      default:
        return 'fas fa-info-circle';
    }
  }

  getModuleIcon(module: string): string {
    switch (module?.toLowerCase()) {
      case 'admin':
        return 'fas fa-user-shield';
      case 'sales':
        return 'fas fa-chart-line';
      case 'inventory':
        return 'fas fa-boxes';
      case 'finance':
        return 'fas fa-money-bill-wave';
      case 'customer':
        return 'fas fa-users';
      default:
        return 'fas fa-cog';
    }
  }
}