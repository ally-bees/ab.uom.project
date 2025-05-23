import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface TopCustomer {
  name: string;
  location: string;
}


@Injectable({
    providedIn: 'root' 
  })

export class buyerService {    
    private apiUrl = 'http://localhost:5230/Customer'; // Replace with your actual base URL

    constructor(private http: HttpClient) { }
    
    getbuyRecords() {
      return this.http.get<TopCustomer>(`${this.apiUrl}/top-customer`)
    }
  }