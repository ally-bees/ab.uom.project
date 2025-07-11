// services/password-reset.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface ResetPasswordRequest {
  token: string;
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private apiUrl = 'http://localhost:5241/api/auth';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  forgotPassword(email: string): Observable<any> {
    const request: ForgotPasswordRequest = { email };
    
    console.log(' Sending forgot password request to:', `${this.apiUrl}/forgot-password`);
    
    return this.http.post(`${this.apiUrl}/forgot-password`, request, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('✅ Forgot password response:', response)),
      catchError(this.handleError)
    );
  }

  resetPassword(resetData: ResetPasswordRequest): Observable<any> {
    console.log(' Making reset password request to:', `${this.apiUrl}/reset-password`);
    console.log(' Request data:', { ...resetData, newPassword: '*****', confirmPassword: '*****' });
    
    return this.http.post(`${this.apiUrl}/reset-password`, resetData, {
      headers: this.getHeaders()
    }).pipe(
      tap(response => console.log('✅ Reset password response:', response)),
      catchError(this.handleError)
    );
  }

  private handleError = (error: HttpErrorResponse) => {
    console.error(' Password Reset Service Error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Unable to connect to server. Please check your internet connection.';
      } else if (error.status === 404) {
        errorMessage = 'Service not found. Please contact support.';
      } else if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Server returned code: ${error.status}, error message is: ${error.message}`;
      }
    }
    
    return throwError(() => error);
  };
}