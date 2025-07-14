import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, DateAdapter } from '@angular/material/core';
import { Expense } from '../../models/expense.model';
import { ExpenseService } from '../../services/expense.service';
import { AuthService } from '../../services/auth.service';

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

  recentExpenses: Expense[] = [];
  isLoading = false;
  loading = false;
  error = false;


  constructor(
    private fb: FormBuilder,
    @Inject(DateAdapter) private dateAdapter: DateAdapter<any>,
    private expenseService: ExpenseService,
    private authService: AuthService
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
    this.loading = true;
    this.error = false;
  
    this.expenseService.getRecentExpenses().subscribe({
      next: (expenses) => {
        this.recentExpenses = Array.isArray(expenses) ? expenses.slice(0, 5) : [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading expenses', error);
        this.error = true;
        this.loading = false;
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

  Object.keys(this.expenseForm.value).forEach(key => {
    if (key !== 'receipt' && this.expenseForm.value[key] != null) {
      if (key === 'date') {
        const dateValue = new Date(this.expenseForm.value[key]);
        formData.append(fieldMap[key], dateValue.toISOString().split('T')[0]);
      } else if (key === 'amount') {
        const amountValue = parseFloat(this.expenseForm.value[key]);
        const amountStr = isNaN(amountValue) ? '0.00' : amountValue.toFixed(2);
        formData.append(fieldMap[key], amountStr);
      } else {
        formData.append(fieldMap[key], this.expenseForm.value[key]);
      }
    }
  });

  // ✅ Append CompanyId and HoneyCombId
  const currentUser = this.authService.getCurrentUser();
  if (currentUser) {
    if (currentUser.CompanyId != null) {
      formData.append('CompanyId', String(currentUser.CompanyId));
    }
    if (currentUser.HoneyCombId != null) {
      formData.append('HoneyCombId', String(currentUser.HoneyCombId));
    }
  }

  if (this.selectedFile) {
    formData.append('ReceiptFile', this.selectedFile, this.selectedFile.name);
  }

  this.expenseService.submitExpense(formData).subscribe({
    next: () => {
      console.log('Expense saved successfully');
      this.resetForm();
      this.loadRecentExpenses();
      this.isLoading = false;
    },
    error: (error: any) => {
      alert('An error occurred: ' + error.message);
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
