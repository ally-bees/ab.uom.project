// expense-form.component.ts
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';


interface Expense {
  date: string;
  employee: string;
  position: string;
  type: string;
  amount: number;
}

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDatepickerModule, MatInputModule, MatNativeDateModule],
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss']
})
export class ExpenseFormComponent implements OnInit {
  expenseForm: FormGroup;
  positions: string[] = ['Sales Manager', 'Marketing Manager', 'Finance Manager', 'HR Manager'];
  expenseTypes: string[] = ['Travel', 'Meals', 'Equipment', 'Office Supplies', 'Campaign'];
  paymentMethods: string[] = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer'];
  selectedFile: File | null = null;
  
  recentExpenses: Expense[] = [
    {
      date: '03/20/2025',
      employee: 'Jane Smith',
      position: 'Marketing Manager',
      type: 'Campaign',
      amount: 5000.00
    }
  ];

  constructor(private fb: FormBuilder, @Inject(DateAdapter) private dateAdapter: DateAdapter<any>) {
    this.expenseForm = this.fb.group({
      position: ['', Validators.required],
      employeeName: ['Jane Smith', Validators.required],
      expenseType: ['', Validators.required],
      amount: ['Rs.0.00', Validators.required],
      date: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      receipt: [''],
      description: ['']
    });

    this.dateAdapter.setLocale('en-US');
  }

  ngOnInit(): void {
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      console.log(this.expenseForm.value);
      // Add logic to save expense
    }
  }

  cancelForm(): void {
    this.expenseForm.reset();
  }
}