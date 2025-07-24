// buyer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';

export interface TopCustomer {
  name: string;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class BuyerService {    
  private apiUrl = 'http://localhost:5241/Customer'; // Matches the [Route("[controller]")] in the backend

  constructor(private http: HttpClient) { }
  
  getTopCustomer(): Observable<TopCustomer> {
    return this.http.get<{name: string, location: string}>(`${this.apiUrl}/top-customer`).pipe(
      map(response => {
        if (!response) {
          throw new Error('No data received from server');
        }
        return {
          name: response.name || 'No name available',
          location: response.location || 'Location not specified'
        };
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('API Error:', error);
        let errorMessage = 'An error occurred while fetching top customer data.';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}