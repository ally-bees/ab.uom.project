import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutomationService, Automation } from '../../services/automation.service';

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
  editingAutomationId: number | null = null;
  daysOfMonth: number[] = Array.from({ length: 31 }, (_, i) => i + 1);

  constructor(
    private fb: FormBuilder,
    private automationService: AutomationService
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
    this.loadAutomations();
  }

  loadAutomations(): void {
    this.automationService.getAutomations().subscribe(data => {
      this.activeAutomations = data;
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;

      const automationData = {
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
    this.editingAutomationId = automation.id;

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

  deleteAutomation(id: number): void {
    this.automationService.deleteAutomation(id).subscribe(() => {
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
