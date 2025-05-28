import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Pur{
  productName: string;
  productSoldCount: number;
  totalCustomerCount: number;
  value: number;
}

@Injectable({
    providedIn: 'root' 
  })

export class valuerateservice{

     private apiUrl = 'http://localhost:5241/Customer/product-stats';  
    
        constructor(private http: HttpClient) { }
            
        getpur(productId: string): Observable<Pur>{
          return this.http.get<Pur>(`${this.apiUrl}/${productId}`);
        }
} 