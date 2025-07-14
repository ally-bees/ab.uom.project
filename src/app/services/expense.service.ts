import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Expense } from '../models/expense.model'; 

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'http://localhost:5241/api/expenses';

  constructor(private http: HttpClient) {}

  getRecentExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  submitExpense(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Server Error:', error);
    return throwError(() =>
      new Error(
        error.error?.title || error.error?.detail || error.message || 'Unknown error'
      )
    );
  }
}
