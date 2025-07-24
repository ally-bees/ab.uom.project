import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Expense } from '../models/expense.model'; 
import { AuthService } from './auth.service'; // Ensure correct path

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'http://localhost:5241/api/expenses';
  private backendBaseUrl = 'http://localhost:5241';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getFullReceiptUrl(relativeUrl: string): string {
    if (!relativeUrl) return '';
    return relativeUrl.startsWith('http')
      ? relativeUrl
      : this.backendBaseUrl + (relativeUrl.startsWith('/') ? relativeUrl : '/' + relativeUrl);
  }

  getRecentExpenses(): Observable<Expense[]> {
    const companyId = this.authService.getCurrentUser()?.CompanyId;

    if (!companyId) {
      return throwError(() => new Error('Company ID is missing from current user'));
    }

    return this.http.get<Expense[]>(`${this.apiUrl}/company/${companyId}`).pipe(
      // Add fullReceiptUrl to each expense object here
      map(expenses => expenses.map(expense => ({
        ...expense,
        fullReceiptUrl: this.getFullReceiptUrl(expense.receiptUrl ?? '') // or whatever property holds relative path
      }))),
      catchError(this.handleError)
    );
  }



  // ✅ Submit expense with CompanyId & HoneyCombId from AuthService
  submitExpense(formData: FormData): Observable<any> {
    const currentUser = this.authService.getCurrentUser();

    if (currentUser) {
      formData.append('CompanyId', currentUser.CompanyId ?? '');
      formData.append('HoneyCombId', currentUser.HoneyCombId ?? '');
    }

    return this.http.post(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  // 👇 Not needed anymore since backend extracts companyId from token
  // But if you're manually appending CompanyId to the URL, you can use this:
  // getExpensesByCompany(): Observable<Expense[]> {
  //   const companyId = this.authService.getCurrentUser()?.CompanyId;
  //   return this.http.get<Expense[]>(`${this.apiUrl}/company/${companyId}`);
  // }

  private handleError(error: HttpErrorResponse) {
    console.error('Server Error:', error);
    return throwError(() =>
      new Error(
        error.error?.title || error.error?.detail || error.message || 'Unknown error'
      )
    );
  }
}