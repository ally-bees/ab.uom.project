import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  currentStep: number = 1;
  reportForm: FormGroup;
  scheduleForm: FormGroup;
  recipientForm: FormGroup;
  daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  
  activeAutomations = [
    { id: 1, reportType: 'Sales Report', frequency: 'Daily', time: '09:00' },
    { id: 2, reportType: 'Inventory Report', frequency: 'Daily', time: '08:00' }
  ];

  constructor(private fb: FormBuilder) {
    this.reportForm = this.fb.group({
      reportType: ['', Validators.required],
      format: ['pdf']
    });

    this.scheduleForm = this.fb.group({
      frequency: ['daily', Validators.required],
      time: ['', Validators.required],
      dayOfWeek: ['1'],
      dayOfMonth: ['1']
    });

    this.recipientForm = this.fb.group({
      emails: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: [''],
      notifyOnSuccess: [true],
      notifyOnFailure: [true]
    });
  }

  ngOnInit(): void {}

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isFormsValid(): boolean {
    switch(this.currentStep) {
      case 1:
        return this.reportForm.valid;
      case 2:
        return this.scheduleForm.valid;
      case 3:
        return this.recipientForm.valid;
      default:
        return false;
    }
  }

  onSubmit(): void {
    if (this.reportForm.valid && this.scheduleForm.valid && this.recipientForm.valid) {
      // Add new automation
      const newAutomation = {
        id: this.activeAutomations.length + 1,
        reportType: this.reportForm.get('reportType')?.value,
        frequency: this.scheduleForm.get('frequency')?.value,
        time: this.scheduleForm.get('time')?.value
      };
      this.activeAutomations.push(newAutomation);
      
      // Reset forms
      this.reportForm.reset();
      this.scheduleForm.reset();
      this.recipientForm.reset();
      this.currentStep = 1;
    }
  }

  deleteAutomation(id: number): void {
    this.activeAutomations = this.activeAutomations.filter(a => a.id !== id);
  }
}