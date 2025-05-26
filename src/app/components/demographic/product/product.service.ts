import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Topproduct{
    productId : string,
    name :string
}

@Injectable({
    providedIn: 'root' 
  })

export class productservice{
        private apiUrl = 'http://localhost:5241/Customer'; // Replace with your actual base URL

        constructor(private http: HttpClient) { }
        
        getproRecords(){
      return this.http.get<Topproduct>(`${this.apiUrl}/top-product`)
        }
} 