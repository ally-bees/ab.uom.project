import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Topbuyer{
    name : string;
    orders: number;
    location: string;
    img:string;
}

@Injectable({
    providedIn: 'root' 
  })

export class buyerService {
    // Mock data to simulate database response
    private topbuyer: Topbuyer = {
        name: "Mobina Mirbagheri",
        orders: 111,
        location: "Moratuwa",
        img:"'https://example.com/cat-image.jpg'"
    };  
    
    constructor() { }
    
    getbuyRecords(): Observable<Topbuyer> {
      return of(this.topbuyer); 
    }
  }