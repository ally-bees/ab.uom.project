import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface cusdetail{
    aCount : number,
    iaCount: number,
}

@Injectable({
    providedIn: 'root' 
  })

export class customerservice{

    private apiUrl = 'http://localhost:5230/Customer';  

    constructor(private http: HttpClient) { }
        
    getpur(){
      return this.http.get<cusdetail>(`${this.apiUrl}/active-and-inactive`)
    }
} 