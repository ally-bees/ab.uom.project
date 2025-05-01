import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface Expense {
  id?: string;
  date: string;
  employeeName: string;
  position: string;
  expenseType: string;
  amount: number;
  paymentMethod: string;
  description?: string;
  receiptUrl?: string;
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
  paymentMethods: string[] = ['Cash', 'Credit Card', 'Debit ԝCard', 'Bank Transfer'];
  selectedFile: File | null = null;

  recentExpenses: Expense[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    @Inject(DateAdapter) private dateAdapter: DateAdapter<any>,
    private http: HttpClient
  ) {
    this.expenseForm = this.fb.group({
      position: ['', Validators.required],
      employeeName: ['', Validators.required],
      expenseType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      date: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      receipt: [''],
      description: ['']
    });

    this.dateAdapter.setLocale('en-US');
  }

  ngOnInit(): void {
    this.loadRecentExpenses();
  }

  loadRecentExpenses(): void {
    this.isLoading = true;
    this.http.get<Expense[]>('http://localhost:5241/api/expenses')
      .subscribe({
        next: (expenses) => {
          this.recentExpenses = expenses;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading expenses', error);
          this.isLoading = false;
        }
      });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    if (this.expenseForm.invalid) {
      console.log('Form is invalid:', this.expenseForm.errors);
      return;
    }

    this.isLoading = true;
    const formData = new FormData();

    // Map camelCase to PascalCase for backend compatibility
    const fieldMap: { [key: string]: string } = {
      date: 'Date',
      employeeName: 'EmployeeName',
      position: 'Position',
      expenseType: 'ExpenseType',
      amount: 'Amount',
      paymentMethod: 'PaymentMethod',
      description: 'Description',
      receipt: 'ReceiptFile'
    };

    // Log form values for debugging
    console.log('Form Values:', this.expenseForm.value);

    // Add form fields to FormData with PascalCase keys
    Object.keys(this.expenseForm.value).forEach(key => {
      if (key !== 'receipt' && this.expenseForm.value[key] != null) {
        if (key === 'date') {
          const dateValue = new Date(this.expenseForm.value[key]);
          const formattedDate = dateValue.toISOString().split('T')[0]; // yyyy-MM-dd
          formData.append(fieldMap[key], formattedDate);
        } else if (key === 'amount') {
          // Handle amount as string or number
          const amountValue = typeof this.expenseForm.value[key] === 'string'
            ? parseFloat(this.expenseForm.value[key])
            : this.expenseForm.value[key];
          // Ensure valid number and format to 2 decimal places
          const amountStr = isNaN(amountValue) ? '0.00' : amountValue.toFixed(2);
          formData.append(fieldMap[key], amountStr); // Backend parses without "Rs."
        } else {
          formData.append(fieldMap[key], this.expenseForm.value[key]);
        }
      }
    });

    // Add file if selected
    if (this.selectedFile) {
      formData.append('ReceiptFile', this.selectedFile, this.selectedFile.name);
    }

    // Log FormData contents for debugging
    for (const pair of (formData as any).entries()) {
      console.log(`FormData: ${pair[0]} = ${pair[1]}`);
    }

    // Send to backend
    this.http.post('http://localhost:5241/api/expenses', formData)
      .subscribe({
        next: (response) => {
          console.log('Expense saved successfully', response);
          this.resetForm();
          this.loadRecentExpenses();
          this.isLoading = false;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error saving expense:', error);
          console.error('Server error details:', error.error);
          alert('An error occurred: ' + (error.error?.title || error.error?.detail || error.message || 'Unknown error'));
          this.isLoading = false;
        }
      });
  }

  resetForm(): void {
    this.expenseForm.reset();
    this.selectedFile = null;
  }

  cancelForm(): void {
    this.resetForm();
  }
}