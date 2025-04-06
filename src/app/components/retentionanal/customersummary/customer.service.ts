import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface cus{
    active : number,
    inactive: number,
}

@Injectable({
    providedIn: 'root' 
  })

export class customerservice{

    // Mock data to simulate database response
        private cus: cus = {
            active: 30,
            inactive: 50,
        };  
        
        constructor() { }
        
        getpur(): Observable<cus> {
          return of(this.cus); 
        }
} 