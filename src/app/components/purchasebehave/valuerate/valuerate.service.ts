import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface pur{
    value : number,
    rate: number,
}

@Injectable({
    providedIn: 'root' 
  })

export class valuerateservice{

    // Mock data to simulate database response
        private pur: pur = {
          value: 500,
          rate: 50,
        };  
        
        constructor() { }
        
        getpur(): Observable<pur> {
          return of(this.pur); 
        }
} 