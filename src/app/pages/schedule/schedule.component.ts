import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutomationService, Automation } from '../../services/automation.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  form: FormGroup;
  activeAutomations: Automation[] = [];
  editingAutomationId: string | null = null;
  daysOfMonth: number[] = Array.from({ length: 31 }, (_, i) => i + 1);
  allowedReportTypes: { label: string; value: string }[] = [];

  // Define role-based report types
  roleBasedReports: { [role: string]: { label: string; value: string }[] } = {
    'Business Owner': [
      { label: 'Sales Report', value: 'sales' },
      { label: 'Inventory Report', value: 'inventory' },
      { label: 'Financial Report', value: 'financial' },
      { label: 'Analytics Report', value: 'analytics' }
    ],
    'Inventory Manager': [
      { label: 'Inventory Report', value: 'inventory' }
    ],
    'Sales Manager': [
      { label: 'Sales Report', value: 'sales' }
    ],
    'Auditor': [
      { label: 'Financial Report', value: 'financial' }
    ],
    'Marketing Manager': [
      { label: 'Analytics Report', value: 'analytics' }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private automationService: AutomationService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      report: this.fb.group({
        reportType: ['', Validators.required],
        format: ['pdf', Validators.required]
      }),
      schedule: this.fb.group({
        frequency: ['', Validators.required],
        time: ['', Validators.required],
        dayOfWeek: [''],
        dayOfMonth: ['']
      }),
      recipient: this.fb.group({
        emails: ['', [Validators.required, Validators.email]],
        subject: ['', Validators.required],
        message: [''],
        notifyOnSuccess: [false],
        notifyOnFailure: [false]
      })
    });
  }

  ngOnInit(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.Role) {
      this.allowedReportTypes = this.roleBasedReports[currentUser.Role] || [];
    }

    this.loadAutomations();
  }

  loadAutomations(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser?.CompanyId) {
      this.automationService.getAutomationsByCompany(currentUser.CompanyId).subscribe({
        next: data => {
          this.activeAutomations = data;
        },
        error: err => {
          console.error('Failed to load automations:', err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;

      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        console.error('No logged-in user found.');
        return;
      }

      const automationData = {
        companyId: currentUser.CompanyId,
        honeyCombId: currentUser.HoneyCombId,
        ...formValue.report,
        ...formValue.schedule,
        ...formValue.recipient,
        dayOfWeek: formValue.schedule.dayOfWeek || null,
        dayOfMonth: formValue.schedule.dayOfMonth
          ? parseInt(formValue.schedule.dayOfMonth, 10)
          : null
      };

      const request$ = this.editingAutomationId !== null
        ? this.automationService.updateAutomation(this.editingAutomationId.toString(), automationData)
        : this.automationService.addAutomation(automationData);

      request$.subscribe({
        next: () => {
          this.loadAutomations();
          this.resetForm();
        },
        error: err => {
          console.error('Automation error:', err);
        }
      });
    }
  }

  editAutomation(automation: Automation): void {
    this.editingAutomationId = automation.id.toString();

    this.form.patchValue({
      report: {
        reportType: automation.reportType,
        format: automation.format
      },
      schedule: {
        frequency: automation.frequency,
        time: automation.time,
        dayOfWeek: automation.dayOfWeek || '',
        dayOfMonth: automation.dayOfMonth?.toString() || ''
      },
      recipient: {
        emails: automation.emails,
        subject: automation.subject,
        message: automation.message,
        notifyOnSuccess: automation.notifyOnSuccess,
        notifyOnFailure: automation.notifyOnFailure
      }
    });
  }

  deleteAutomation(id: string): void {
    this.automationService.deleteAutomation(String(id)).subscribe(() => {
      this.loadAutomations();
      if (this.editingAutomationId === id) {
        this.resetForm();
      }
    });
  }

  resetForm(): void {
    this.form.reset({
      report: {
        reportType: '',
        format: 'pdf'
      },
      schedule: {
        frequency: '',
        time: '',
        dayOfWeek: '',
        dayOfMonth: ''
      },
      recipient: {
        emails: '',
        subject: '',
        message: '',
        notifyOnSuccess: false,
        notifyOnFailure: false
      }
    });
    this.editingAutomationId = null;
  }

  cancel(): void {
    this.resetForm();
  }
}
